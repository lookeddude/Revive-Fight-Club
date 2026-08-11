/**
 * Logo Color Correction Script
 * - Converts black/dark pixels → white (so they show on dark navbar)
 * - Keeps red pixels red (brand color preserved)
 * - Saves as rfc-logo-dark.png (for dark backgrounds)
 * - Original rfc-logo.png stays for light bg use
 */

import sharp from 'sharp'
import { copyFileSync, existsSync } from 'fs'

const SOURCE = './public/images/rfc-logo-original.png'
const OUTPUT = './public/images/rfc-logo.png'

console.log('Loading logo...')

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const pixels = new Uint8ClampedArray(data)

let whiteConverted = 0
let redKept = 0
let transparentKept = 0

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i]
  const g = pixels[i + 1]
  const b = pixels[i + 2]
  const a = pixels[i + 3]

  // Skip fully transparent pixels
  if (a < 10) {
    transparentKept++
    continue
  }

  // Skip near-white (already removed background, but safety check)
  if (r >= 230 && g >= 230 && b >= 230) {
    pixels[i + 3] = 0
    continue
  }

  // Detect RED pixels: high R, low G, low B
  const isRed = r > 140 && g < 100 && b < 100

  if (isRed) {
    // Keep red but make it slightly more vibrant/bright
    pixels[i]     = Math.min(255, Math.round(r * 1.05))
    pixels[i + 1] = g
    pixels[i + 2] = b
    redKept++
  } else {
    // All other non-transparent pixels (black, dark gray, etc.) → white
    // This makes the black "FC" letters and fighter silhouette WHITE
    pixels[i]     = 255
    pixels[i + 1] = 255
    pixels[i + 2] = 255
    whiteConverted++
  }
}

await sharp(Buffer.from(pixels), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(OUTPUT)

console.log(`✓ Done!`)
console.log(`  Red pixels kept:     ${redKept.toLocaleString()}`)
console.log(`  Dark→White pixels:   ${whiteConverted.toLocaleString()}`)
console.log(`  Transparent pixels:  ${transparentKept.toLocaleString()}`)
console.log(`  Saved → ${OUTPUT}`)
