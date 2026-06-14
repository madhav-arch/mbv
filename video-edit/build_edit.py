#!/usr/bin/env python3
"""
Cinematic portrait re-edit pipeline for the "Rate is the amateur number" ad.

Reproduces draft_v1 from the source release asset:
  - rotates the sideways 4K footage upright to 1080x1920 portrait
  - keeps only the on-camera (facing-lens) delivery, dropping reset/look-away gaps
  - applies a subtle cinematic grade + slow push-in per take
  - chains takes with 0.3s video/audio cross-dissolves

Requires only: imageio-ffmpeg, numpy, opencv-python-headless, pocketsphinx (all from PyPI).
No external model downloads (works in network-restricted sandboxes).

Stages (run individually or all):
  1. download   - pull source MP4 from the GitHub release asset
  2. analyze    - extract audio, detect on-camera blocks (OpenCV frontal-face)
  3. edl        - snap block boundaries to silence -> edl.json
  4. segments   - render each keeper segment (rotate + grade + push-in + audio)
  5. assemble   - cross-dissolve segments into the final cut

The "best of repeated takes" decision is intentionally left to a human: speech-to-text
model hosts are blocked in the sandbox, so verbatim-repeat detection is unreliable.
Edit edl.json (drop/trim entries) and re-run stages 4-5 to refine.
"""
import json, subprocess, os, re, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
WORK = os.environ.get("WORK", "work")
SRC = os.path.join(WORK, "src.mp4")
ASSET_URL = ("https://github.com/madhav-arch/mbv/releases/download/video/"
             "-.Dan.-.EHO.-.rate.is.amateur.-.ad.MP4")

# Subtle cinematic grade applied after rotating upright (transpose=1 = 90 CW).
GRADE = ("transpose=1,scale=1080:1920,"
         "eq=contrast=1.06:saturation=0.93:gamma=0.98,"
         "curves=b='0/0.02 0.5/0.5 1/0.96':r='0/0 0.5/0.52 1/1',"
         "vignette=PI/4.5")
PUSH_IN = ("zoompan=z='min(1.0+0.0007*on\\,1.09)':"
           "x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=25")
XF = 0.30  # crossfade duration (s)


def sh(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.stderr.write(r.stderr[-1000:] + "\n")
        raise SystemExit(f"ffmpeg failed: {' '.join(cmd[:3])}...")
    return r


def download():
    os.makedirs(WORK, exist_ok=True)
    subprocess.run(["curl", "-sL", "-o", SRC, ASSET_URL], check=True)
    print("downloaded", SRC, os.path.getsize(SRC), "bytes")


def analyze():
    """Extract audio + detect facing-camera blocks -> oncam.json."""
    import wave, numpy as np, cv2, glob
    aud = os.path.join(WORK, "vid_audio.wav")
    sh([FF, "-y", "-i", SRC, "-ac", "1", "-ar", "16000", "-vn", aud])

    fdet = os.path.join(WORK, "fdet")
    os.makedirs(fdet, exist_ok=True)
    sh([FF, "-i", SRC, "-vf", "transpose=1,fps=2,scale=-1:720",
        "-q:v", "3", os.path.join(fdet, "f_%04d.jpg")])

    hc = cv2.data.haarcascades
    front = cv2.CascadeClassifier(hc + "haarcascade_frontalface_default.xml")
    alt = cv2.CascadeClassifier(hc + "haarcascade_frontalface_alt2.xml")
    arr = []
    for i, f in enumerate(sorted(glob.glob(os.path.join(fdet, "f_*.jpg")))):
        t = round(i / 2.0, 2)
        g = cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2GRAY)
        fr = front.detectMultiScale(g, 1.1, 5, minSize=(90, 90))
        if len(fr) == 0:
            fr = alt.detectMultiScale(g, 1.1, 5, minSize=(90, 90))
        arr.append((t, 1 if len(fr) else 0))
    json.dump(arr, open(os.path.join(WORK, "face.json"), "w"))

    # contiguous facing-camera blocks: merge gaps <=1.0s, keep >=1.2s
    out, s, last = [], None, None
    for t, fc in arr:
        if fc:
            if s is None:
                s = t
            last = t
        elif s is not None and t - last > 1.0:
            if last - s >= 1.2:
                out.append((round(s, 1), round(last, 1)))
            s = None
    if s is not None and last - s >= 1.2:
        out.append((round(s, 1), round(last, 1)))
    json.dump(out, open(os.path.join(WORK, "oncam.json"), "w"))
    print(f"on-camera blocks: {len(out)}  total {sum(b-a for a,b in out):.0f}s")


def edl():
    """Snap on-camera block edges to nearest silence -> edl.json."""
    import wave, numpy as np
    oncam = json.load(open(os.path.join(WORK, "oncam.json")))
    w = wave.open(os.path.join(WORK, "vid_audio.wav"), "rb"); sr = w.getframerate()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    hop, win = int(0.02 * sr), int(0.04 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, len(x) - win, hop)])
    edb = 20 * np.log10(e + 1e-6)
    lo, hi = np.percentile(edb, 5), np.percentile(edb, 95)
    thr = lo + 0.30 * (hi - lo)

    def t2i(t): return int(min(max(t / 0.02, 0), len(edb) - 1))

    def snap(t, d, window=0.7):
        c, span = t2i(t), int(window / 0.02)
        for k in range(span):
            j = max(c - k, 0) if d < 0 else min(c + k, len(edb) - 1)
            if edb[j] < thr:
                return j * 0.02
        return t

    raw = []
    for a, b in oncam:
        sa, sb = snap(a - 0.15, -1), snap(b + 0.25, +1)
        if sb - sa >= 1.0:
            raw.append([round(sa, 2), round(sb, 2)])
    merged = [raw[0]]
    for a, b in raw[1:]:
        if a - merged[-1][1] < 0.8:
            merged[-1][1] = b
        else:
            merged.append([a, b])
    json.dump(merged, open(os.path.join(WORK, "edl.json"), "w"))
    print(f"{len(merged)} keeper segments, {sum(b-a for a,b in merged):.1f}s")


def segments():
    edl_list = json.load(open(os.path.join(WORK, "edl.json")))
    seg_dir = os.path.join(WORK, "segs"); os.makedirs(seg_dir, exist_ok=True)
    for i, (a, b) in enumerate(edl_list):
        vf = f"{GRADE},{PUSH_IN},format=yuv420p"
        sh([FF, "-y", "-ss", str(a), "-to", str(b), "-i", SRC, "-vf", vf,
            "-r", "25", "-c:v", "libx264", "-crf", "20", "-preset", "fast",
            "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
            "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-movflags", "+faststart",
            os.path.join(seg_dir, f"s{i:02d}.mp4")])
        print(f"seg {i:02d} ok")


def assemble(out="draft_v1.mp4"):
    seg_dir = os.path.join(WORK, "segs")
    files = sorted(f for f in os.listdir(seg_dir) if f.endswith(".mp4"))
    durs = []
    for f in files:
        r = subprocess.run([FF, "-i", os.path.join(seg_dir, f)],
                           capture_output=True, text=True)
        h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr).groups()
        durs.append(int(h) * 3600 + int(m) * 60 + float(s))
    inputs = []
    for f in files:
        inputs += ["-i", os.path.join(seg_dir, f)]
    vfc, cur, off = [], "0:v", durs[0] - XF
    for i in range(1, len(files)):
        vfc.append(f"[{cur}][{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[v{i}]")
        cur, off = f"v{i}", off + durs[i] - XF
    afc, ca = [], "0:a"
    for i in range(1, len(files)):
        afc.append(f"[{ca}][{i}:a]acrossfade=d={XF}[a{i}]")
        ca = f"a{i}"
    sh([FF, "-y", *inputs, "-filter_complex", ";".join(vfc + afc),
        "-map", f"[{cur}]", "-map", f"[{ca}]",
        "-c:v", "libx264", "-crf", "19", "-preset", "medium", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
        os.path.join(WORK, out)])
    print("wrote", os.path.join(WORK, out))


STAGES = {"download": download, "analyze": analyze, "edl": edl,
          "segments": segments, "assemble": assemble}

if __name__ == "__main__":
    todo = sys.argv[1:] or ["analyze", "edl", "segments", "assemble"]
    for name in todo:
        if name not in STAGES:
            raise SystemExit(f"unknown stage {name}; choose from {list(STAGES)}")
        print(f"== {name} ==")
        STAGES[name]()
