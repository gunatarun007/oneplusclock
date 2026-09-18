import fs from 'fs';

// Pure vector SVG icon with authentic OnePlus emblem + crisp legal-safe FAN edition badge
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Rich OnePlus Red Gradient -->
    <linearGradient id="opRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF1E28" />
      <stop offset="100%" stop-color="#E0001E" />
    </linearGradient>
  </defs>

  <!-- Official OnePlus Squircle / Rounded Badge -->
  <rect width="512" height="512" rx="112" fill="url(#opRedGrad)" />

  <!-- Official OnePlus Emblem (Signature Box + Plus Corner + Numeral 1) -->
  <g transform="translate(96, 72) scale(13.333333)" fill="#FFFFFF">
    <path d="M0 3.74V24h20.26V12.428h-2.256v9.317H2.254V5.995h9.318V3.742z M18.004 0v3.74h-3.758v2.256h3.758v3.758h2.255V5.996H24V3.74h-3.758V0zm-6.45 18.756V8.862H9.562c0 .682-.228 1.189-.577 1.504-.367.297-.91.437-1.556.437h-.245v1.625h2.133v6.31h2.237z" />
  </g>

  <!-- Legally-safe Fan Edition Pill Badge (Crisp Vector Paths - No Font Dependencies) -->
  <g transform="translate(0, 4)">
    <!-- Pill Capsule Container -->
    <rect x="190" y="420" width="132" height="34" rx="17" fill="#000000" fill-opacity="0.4" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />
    <!-- Red Accent Indicator Dot -->
    <circle cx="212" cy="437" r="3.5" fill="#FF3B47" />
    <!-- Vector "FAN" Lettering -->
    <!-- F -->
    <path d="M228 428 h11 v3 h-7.5 v3.5 h6.5 v3 h-6.5 v5.5 h-3.5 z" fill="#FFFFFF" />
    <!-- A -->
    <path d="M246 443 h6.5 l-3.25 -8.5 z M243.5 448 l4.5 -12 h3 l4.5 12 h-3.4 l-0.8 -2.4 h-4.4 l-0.8 2.4 z" fill="#FFFFFF" fill-rule="evenodd" />
    <!-- N -->
    <path d="M266 428 h3.2 l5.3 7.8 v-7.8 h3.2 v20 h-3.2 l-5.3 -7.8 v7.8 h-3.2 z" fill="#FFFFFF" />
  </g>
</svg>`;

fs.writeFileSync('app-icon.svg', svg);
fs.writeFileSync('src-tauri/icons/app-icon.svg', svg);
console.log('Successfully generated app-icon.svg with pure vector geometry');
