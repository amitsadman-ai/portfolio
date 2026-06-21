/* Trim the source PNGs to their actual content (most of each 1408×768
 * canvas is empty alpha — the pistachio occupies a much smaller crop),
 * then export crisp WebPs for the hero rain. Trimming first is what
 * makes the pistachios sharp at display sizes — without it, the resized
 * webp is mostly transparency and the pistachio inside ends up tiny. */
import sharp from 'sharp'

for (const [src, out] of [
  ['pistachiowithshell.png', 'public/assets/pistachio-shell.webp'],
  ['pistachionoshell.png', 'public/assets/pistachio-noshell.webp'],
]) {
  await sharp(src)
    .trim()
    .resize(480, null, { kernel: 'lanczos3', withoutEnlargement: false })
    .webp({ quality: 95, effort: 6 })
    .toFile(out)
  console.log(`Wrote ${out}`)
}
