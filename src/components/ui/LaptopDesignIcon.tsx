import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LaptopDesignIcon: React.FC<IconProps> = ({
  size = 28,
  className = "",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Laptop Base */}
      <path
        d="M 70 370 h 372 a 32 32 0 0 1 32 32 v 5 a 32 32 0 0 1 -32 32 H 70 a 32 32 0 0 1 -32 -32 v -5 a 32 32 0 0 1 32 -32 Z"
        strokeWidth="24"
      />
      {/* Touchpad Notch */}
      <path
        d="M 216 370 v 26 h 80 v -26"
        strokeWidth="22"
      />

      {/* Laptop Screen Frame */}
      <line x1="88" y1="370" x2="88" y2="215" strokeWidth="24" />
      <path
        d="M 232 145 H 424 A 24 24 0 0 1 448 169 V 370"
        strokeWidth="24"
      />

      {/* Canvas Elements: Square, Circle, Triangle */}
      <rect
        x="280"
        y="185"
        width="54"
        height="54"
        rx="10"
        strokeWidth="22"
      />
      <circle cx="385" cy="212" r="30" strokeWidth="22" />
      <polygon
        points="345,320 385,255 425,320"
        strokeWidth="22"
      />

      {/* Stylus Pen */}
      {/* Pen Cap Top */}
      <path
        d="M 70 65 L 50 85 a 20 20 0 0 0 0 28 l 20 20 48 -48 -20 -20 a 20 20 0 0 0 -28 0 Z"
        strokeWidth="24"
      />
      {/* Clip */}
      <path d="M 52 108 L 38 122" strokeWidth="22" />

      {/* Pen Body & Ring */}
      <path d="M 90 113 L 225 248" strokeWidth="24" />
      <path d="M 138 161 L 118 181" strokeWidth="22" />

      {/* Pen Nib */}
      <path
        d="M 205 268 L 284 304 L 248 225 Z"
        strokeWidth="22"
        fill="currentColor"
      />
    </svg>
  );
};

export default LaptopDesignIcon;
