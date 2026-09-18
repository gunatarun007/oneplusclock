import React from 'react';

interface OnePlusLogoProps {
  size?: number;
  className?: string;
}

export const OnePlusLogo: React.FC<OnePlusLogoProps> = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      role="img"
      aria-label="OnePlus Clock Fan Edition"
    >
      <defs>
        <linearGradient id="opWebRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF1E28" />
          <stop offset="100%" stopColor="#E0001E" />
        </linearGradient>
      </defs>

      {/* Official OnePlus Squircle / Rounded Badge */}
      <rect width="512" height="512" rx="112" fill="url(#opWebRedGrad)" />

      {/* Official OnePlus Emblem (Signature Box + Plus Corner + Numeral 1) */}
      <g transform="translate(96, 72) scale(13.333333)" fill="#FFFFFF">
        <path d="M0 3.74V24h20.26V12.428h-2.256v9.317H2.254V5.995h9.318V3.742z M18.004 0v3.74h-3.758v2.256h3.758v3.758h2.255V5.996H24V3.74h-3.758V0zm-6.45 18.756V8.862H9.562c0 .682-.228 1.189-.577 1.504-.367.297-.91.437-1.556.437h-.245v1.625h2.133v6.31h2.237z" />
      </g>

      {/* Fan Edition Pill Badge */}
      <g transform="translate(0, 4)">
        <rect
          x="190"
          y="420"
          width="132"
          height="34"
          rx="17"
          fill="#000000"
          fillOpacity="0.45"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle cx="212" cy="437" r="3.5" fill="#FF3B47" />
        <path d="M228 428 h11 v3 h-7.5 v3.5 h6.5 v3 h-6.5 v5.5 h-3.5 z" fill="#FFFFFF" />
        <path
          d="M246 443 h6.5 l-3.25 -8.5 z M243.5 448 l4.5 -12 h3 l4.5 12 h-3.4 l-0.8 -2.4 h-4.4 l-0.8 2.4 z"
          fill="#FFFFFF"
          fillRule="evenodd"
        />
        <path d="M266 428 h3.2 l5.3 7.8 v-7.8 h3.2 v20 h-3.2 l-5.3 -7.8 v7.8 h-3.2 z" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
