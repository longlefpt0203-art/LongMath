const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { execSync } = require('child_process');

// Content for the author Lê Ngọc Long Zalo QR
const authorLink = 'https://zalo.me/longlefpt0203';

const qr = QRCode.create(authorLink, {
  errorCorrectionLevel: 'H',
});

const size = qr.modules.size; // 33
const moduleSize = 16;
const padding = 4 * moduleSize;
const totalSize = size * moduleSize + padding * 2;

// Center circle radius in modules
const centerRadiusModules = 3.6;
const centerModule = (size - 1) / 2;

let circles = [];

// Helper to check if a module is inside the 3 finder patterns
function isFinderPattern(r, c) {
  // Top-left
  if (r <= 7 && c <= 7) return true;
  // Top-right
  if (r <= 7 && c >= size - 8) return true;
  // Bottom-left
  if (r >= size - 8 && c <= 7) return true;
  return false;
}

// Helper to check if a module is inside the center logo circle
function isCenterLogo(r, c) {
  const dr = r - centerModule;
  const dc = c - centerModule;
  const dist = Math.sqrt(dr * dr + dc * dc);
  return dist < centerRadiusModules + 0.3;
}

// Generate data dots (dots as rounded circles)
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (qr.modules.get(r, c)) {
      if (!isFinderPattern(r, c) && !isCenterLogo(r, c)) {
        const cx = padding + c * moduleSize + moduleSize / 2;
        const cy = padding + r * moduleSize + moduleSize / 2;
        const radius = moduleSize * 0.44;
        circles.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="#000000" />`);
      }
    }
  }
}

// Generate finder patterns with rounded corners
function renderFinder(startCol, startRow) {
  const x = padding + startCol * moduleSize;
  const y = padding + startRow * moduleSize;
  const outerW = 7 * moduleSize;
  const midW = 5 * moduleSize;
  const innerW = 3 * moduleSize;

  const outerRx = moduleSize * 1.8;
  const midRx = moduleSize * 1.2;
  const innerRx = moduleSize * 0.9;

  return `
    <!-- Finder Pattern Outer Ring -->
    <rect x="${x}" y="${y}" width="${outerW}" height="${outerW}" rx="${outerRx}" ry="${outerRx}" fill="#000000" />
    <rect x="${x + moduleSize}" y="${y + moduleSize}" width="${midW}" height="${midW}" rx="${midRx}" ry="${midRx}" fill="#FFFFFF" />
    <rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${innerW}" height="${innerW}" rx="${innerRx}" ry="${innerRx}" fill="#000000" />
  `;
}

const finders = [
  renderFinder(0, 0),
  renderFinder(size - 7, 0),
  renderFinder(0, size - 7),
].join('\n');

// Center Zalo Logo Badge
const centerCx = padding + centerModule * moduleSize + moduleSize / 2;
const centerCy = padding + centerModule * moduleSize + moduleSize / 2;
const centerR = centerRadiusModules * moduleSize;

const centerLogo = `
  <!-- Center Zalo Circle -->
  <circle cx="${centerCx}" cy="${centerCy}" r="${centerR + moduleSize * 0.3}" fill="#FFFFFF" />
  <circle cx="${centerCx}" cy="${centerCy}" r="${centerR}" fill="#000000" />
  <text x="${centerCx}" y="${centerCy + moduleSize * 0.48}" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        font-size="${moduleSize * 2.3}" 
        font-weight="700" 
        fill="#FFFFFF" 
        text-anchor="middle"
        letter-spacing="-0.5px">Zalo</text>
`;

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">
  <rect width="${totalSize}" height="${totalSize}" fill="#FFFFFF" />
  ${finders}
  ${circles.join('\n  ')}
  ${centerLogo}
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgPath = path.join(publicDir, 'author-zalo-qr.svg');
const pngPath = path.join(publicDir, 'author-zalo-qr.png');
const imagePngPath = path.join(publicDir, 'image.png');

fs.writeFileSync(svgPath, svgContent);
console.log('Saved SVG to:', svgPath);

// Also generate standard high-res PNGs using qrcode built-in renderer
QRCode.toFile(
  pngPath,
  authorLink,
  {
    errorCorrectionLevel: 'H',
    width: 600,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  },
  function (err) {
    if (err) {
      console.error('Error generating PNG:', err);
    } else {
      console.log('Successfully generated PNG:', pngPath);
      fs.copyFileSync(pngPath, imagePngPath);
      console.log('Successfully copied to:', imagePngPath);
    }
  }
);
