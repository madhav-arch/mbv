// Mortgage / banking line-icons, drawn as inline SVG so they need no assets
// and stay crisp at any resolution. Stroke colour is inherited via `color`.

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number): React.CSSProperties => ({ display: "block", width: size, height: size });

export const HouseIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 30 L32 12 L54 30" />
    <path d="M16 28 V52 H48 V28" />
    <path d="M27 52 V40 H37 V52" />
  </svg>
);

export const BankIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 24 L32 12 L54 24" />
    <path d="M12 24 H52" />
    <path d="M17 24 V46 M27 24 V46 M37 24 V46 M47 24 V46" />
    <path d="M12 52 H52" />
  </svg>
);

export const PercentIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="46" x2="46" y2="18" />
    <circle cx="22" cy="22" r="7" />
    <circle cx="42" cy="42" r="7" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12 V52 H52" />
    <path d="M18 42 L28 32 L36 38 L50 20" />
    <path d="M50 20 H42 M50 20 V28" />
  </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="22" cy="24" r="10" />
    <path d="M29 31 L50 52" />
    <path d="M44 46 L49 41 M50 52 L54 48" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M32 10 L52 18 V32 C52 44 43 52 32 56 C21 52 12 44 12 32 V18 Z" />
    <path d="M24 32 L30 38 L42 26" />
  </svg>
);

export const CoinsIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="26" cy="20" rx="14" ry="7" />
    <path d="M12 20 V32 C12 36 18 39 26 39 C34 39 40 36 40 32 V20" />
    <ellipse cx="40" cy="40" rx="14" ry="7" />
    <path d="M26 40 V48 C26 52 32 55 40 55 C48 55 54 52 54 48 V40" />
  </svg>
);

export const HandshakeIcon: React.FC<IconProps> = ({ size = 64, color = "currentColor", strokeWidth = 3.5 }) => (
  <svg viewBox="0 0 64 64" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 26 L16 24 L30 32 L36 30" />
    <path d="M58 26 L48 24 L34 30" />
    <path d="M16 24 L22 38 C24 42 30 42 31 38" />
    <path d="M48 24 L42 38 C40 42 35 42 33 39" />
  </svg>
);
