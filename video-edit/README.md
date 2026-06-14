# Cinematic portrait re-edit — "Rate is the amateur number"

Reproducible pipeline that turns the raw sideways 4K ad footage into a tight,
on-camera, cinematic **portrait (1080×1920)** cut.

## What it does
- **Rotates** the footage upright (it was shot portrait but stored sideways → `transpose=1`).
- **Keeps only on-camera delivery.** OpenCV frontal-face detection (sampled 2 fps)
  finds the blocks where the subject faces the lens and drops the ~64% of the take
  where he looks down / resets between takes.
- **Subtle cinematic grade** + slow push-in per take (no heavy captions).
- **Smooth transitions:** 0.3s video + audio cross-dissolves between takes; audio
  loudness-normalised to −16 LUFS.

## Run
```bash
pip install imageio-ffmpeg numpy opencv-python-headless pocketsphinx
python video-edit/build_edit.py            # analyze -> edl -> segments -> assemble
# or a single stage:
python video-edit/build_edit.py download
python video-edit/build_edit.py segments assemble
```
Output: `work/draft_v1.mp4`. Media lives under `work/` and is git-ignored.

## Refining "best of the repeated takes"
Speech-to-text model hosts are blocked in the web sandbox, so verbatim-repeat
detection isn't reliable enough to auto-pick the best take. The honest workflow:

1. Watch `work/draft_v1.mp4`.
2. Edit **`edl.json`** — each entry is `[start_sec, end_sec]` on the source timeline.
   Delete or trim entries to drop repeated/weaker lines.
3. Re-run `python video-edit/build_edit.py segments assemble`.

## Artifacts (committed, small)
- `edl.json`  — final edit decision list (source-time in/out per kept segment)
- `oncam.json` — detected facing-camera blocks
- `segs.json` — pause-based speech segmentation
- `face.json` — per-frame (2 fps) facing-camera flags

## Source
GitHub release `video` asset on `madhav-arch/mbv` (~2 GB 4K MP4, 25 fps, 4:34).
