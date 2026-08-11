import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const INPUT  = './public/images/rfc-logo-original.png'
const OUTPUT = './public/images/rfc-logo.png'

// First back up original
import { copyFileSync, existsSync } from 'fs'
if (!existsSync(INPUT)) {
  copyFileSync('./public/images/rfc-logo.png', INPUT)
  console.log('Backed up original.')
}

const { data, info } = await sharp(INPUT)
  .ensureAlpha()      // make sure we have RGBA
  .raw()
  .toBuffer({ resolveWithObject: true })

const pixels = new Uint8ClampedArray(data)
const THRESHOLD = 235  // pixels >= this on ALL channels are treated as white

let removed = 0

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]

  // Near-white → transparent
  if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
    pixels[i + 3] = 0
    removed++
  }
}

await sharp(Buffer.from(pixels), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(OUTPUT)

console.log(`Done! Removed ${removed} white pixels. Saved → ${OUTPUT}`)
