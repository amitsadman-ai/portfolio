/* Generate a 1200×630 PNG of the homepage hero for use as the social
 * Open Graph image. Run with: node scripts/make-og-image.mjs */
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const W = 1200
const H = 630

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f6f8fc"/>
      <stop offset="100%" stop-color="#cfdcec"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#7d96b3" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>

  <text x="60" y="74" font-family="'Caveat','Segoe Script',cursive" font-size="44" font-weight="500" fill="#1d2433">Amit Mittlman</text>

  <text x="${W / 2}" y="240" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="700" fill="#1a1f33">Big challenges create</text>
  <text x="${W / 2}" y="320" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="700" fill="#1a1f33">opportunities to lead, learn</text>
  <text x="${W / 2}" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="74" font-weight="700" fill="#1a1f33">&amp; make meaningful impact.</text>

  <text x="${W / 2}" y="470" text-anchor="middle" font-family="'Caveat','Segoe Script',cursive" font-size="32" font-weight="500" fill="#3b4a66">Hey there, I'm Amit —</text>
  <text x="${W / 2}" y="510" text-anchor="middle" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="22" fill="#3b4a66">Product Designer · 4+ years building solutions for today and tomorrow.</text>

  <g transform="translate(${W / 2 - 110}, 555)">
    <rect width="220" height="48" rx="24" fill="#fdeea7" stroke="#f5d878" stroke-width="1"/>
    <text x="110" y="31" text-anchor="middle" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="18" font-weight="500" fill="#1a1f33">Fun fact about me</text>
  </g>
</svg>`

writeFileSync('public/assets/og-image.svg', svg)

await sharp(Buffer.from(svg))
  .png()
  .toFile('public/assets/og-image.png')

const FAV = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="56" fill="#1a1f33"/>
  <text x="128" y="170" text-anchor="middle" font-family="Georgia, serif" font-size="160" font-weight="700" fill="#fdbe30">A</text>
</svg>`

await sharp(Buffer.from(FAV))
  .png()
  .toFile('public/assets/favicon.png')

console.log('Wrote public/assets/og-image.png (1200x630)')
console.log('Wrote public/assets/favicon.png (256x256)')
