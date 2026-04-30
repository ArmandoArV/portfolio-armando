const fs = require("fs");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#020617"/>
      <stop offset="50%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#020617"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#020617;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="600" cy="315" r="300" fill="url(#glow)"/>
  <circle cx="100" cy="80" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="250" cy="150" r="1" fill="white" opacity="0.4"/>
  <circle cx="700" cy="80" r="1.5" fill="white" opacity="0.6"/>
  <circle cx="1000" cy="90" r="1.3" fill="white" opacity="0.5"/>
  <circle cx="150" cy="500" r="1" fill="white" opacity="0.4"/>
  <circle cx="1050" cy="480" r="1.5" fill="white" opacity="0.6"/>
  <rect x="200" y="270" width="120" height="3" rx="1.5" fill="#3b82f6"/>
  <text x="200" y="240" font-family="system-ui,sans-serif" font-size="52" font-weight="bold" fill="white">Armando Arredondo Valle</text>
  <text x="200" y="320" font-family="system-ui,sans-serif" font-size="28" fill="#94a3b8">Software Engineer at</text>
  <text x="503" y="320" font-family="system-ui,sans-serif" font-size="28" font-weight="bold" fill="#60a5fa"> Microsoft</text>
  <text x="200" y="370" font-family="monospace" font-size="18" fill="#64748b">React · Azure · .NET · Go · TypeScript · AI/ML</text>
  <text x="200" y="530" font-family="monospace" font-size="16" fill="#3b82f6">armandoav.com</text>
  <circle cx="950" cy="350" r="40" fill="none" stroke="#334155" stroke-width="1" opacity="0.4"/>
  <circle cx="950" cy="350" r="70" fill="none" stroke="#334155" stroke-width="1" opacity="0.3"/>
  <circle cx="950" cy="350" r="100" fill="none" stroke="#334155" stroke-width="1" opacity="0.2"/>
  <circle cx="950" cy="350" r="12" fill="#FDB813" opacity="0.8"/>
  <circle cx="990" cy="340" r="5" fill="#60a5fa" opacity="0.7"/>
  <circle cx="920" cy="290" r="4" fill="#f97316" opacity="0.7"/>
  <circle cx="1040" cy="380" r="6" fill="#a78bfa" opacity="0.7"/>
</svg>`;

fs.writeFileSync("public/og-image.svg", svg);
console.log("Created public/og-image.svg");
