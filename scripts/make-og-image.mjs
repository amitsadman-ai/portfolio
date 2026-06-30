/* Generate a 1200×630 PNG of the homepage hero for use as the social
 * Open Graph image. Run with: node scripts/make-og-image.mjs */
import sharp from 'sharp'
import { writeFileSync } from 'fs'

/* Pack a set of square PNG buffers into a multi-resolution ICO file. */
async function pngsToIco(pngBuffers, sizes) {
  const headerSize = 6 + sizes.length * 16
  const total = pngBuffers.reduce((s, b) => s + b.length, 0)
  const ico = Buffer.alloc(headerSize + total)
  ico.writeUInt16LE(0, 0)
  ico.writeUInt16LE(1, 2)
  ico.writeUInt16LE(sizes.length, 4)
  let offset = headerSize
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i]
    const buf = pngBuffers[i]
    const eo = 6 + i * 16
    ico.writeUInt8(s === 256 ? 0 : s, eo)
    ico.writeUInt8(s === 256 ? 0 : s, eo + 1)
    ico.writeUInt8(0, eo + 2)
    ico.writeUInt8(0, eo + 3)
    ico.writeUInt16LE(1, eo + 4)
    ico.writeUInt16LE(32, eo + 6)
    ico.writeUInt32LE(buf.length, eo + 8)
    ico.writeUInt32LE(offset, eo + 12)
    buf.copy(ico, offset)
    offset += buf.length
  }
  return ico
}

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

  <text x="${W / 2}" y="240" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700" fill="#1a1f33">Some people think I'm obsessed with Figma.</text>
  <text x="${W / 2}" y="306" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700" fill="#1a1f33">I'm actually obsessed with pistachios.</text>

  <text x="${W / 2}" y="402" text-anchor="middle" font-family="'Caveat','Segoe Script',cursive" font-size="36" font-weight="500" fill="#3b4a66">Hey there, I'm Amit —</text>
  <text x="${W / 2}" y="446" text-anchor="middle" font-family="-apple-system, 'Helvetica Neue', sans-serif" font-size="22" fill="#3b4a66">Product Designer · 4+ years building solutions for today and tomorrow.</text>

  <g transform="translate(${W / 2 - 110}, 500)">
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

/* Real favicon.ico at the site root — browsers auto-request /favicon.ico
 * and Netlify's SPA redirect would otherwise serve index.html for it. */
const icoSizes = [16, 32, 48]
const icoPngs = await Promise.all(
  icoSizes.map((s) => sharp(Buffer.from(FAV)).resize(s, s).png().toBuffer()),
)
writeFileSync('public/favicon.ico', await pngsToIco(icoPngs, icoSizes))

console.log('Wrote public/assets/og-image.png (1200x630)')
console.log('Wrote public/assets/favicon.png (256x256)')
console.log('Wrote public/favicon.ico (16/32/48)')
