/**
 * Converts the generated favicon JPG into:
 * - app/icon.png        (32×32)  → Next.js auto-picks as browser tab icon
 * - app/icon-192.png   (192×192) → PWA / Android
 * - app/apple-icon.png (180×180) → Apple touch icon
 * - public/favicon.ico equivalent via PNG
 */
import sharp from 'sharp'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

const SRC = 'C:/Users/rajni/.gemini/antigravity/brain/b1164f88-4c56-4763-80c5-07ac4dcb01af/rfc_favicon_1786899275853.jpg'
const APP_DIR = join(process.cwd(), 'app')

async function run() {
  // 32×32 favicon (browser tab)
  await sharp(SRC)
    .resize(32, 32)
    .png()
    .toFile(join(APP_DIR, 'icon.png'))
  console.log('✓ app/icon.png (32×32)')

  // 180×180 Apple touch icon
  await sharp(SRC)
    .resize(180, 180)
    .png()
    .toFile(join(APP_DIR, 'apple-icon.png'))
  console.log('✓ app/apple-icon.png (180×180)')

  // 512×512 high-res for PWA / open graph
  await sharp(SRC)
    .resize(512, 512)
    .png()
    .toFile(join(process.cwd(), 'public', 'icon-512.png'))
  console.log('✓ public/icon-512.png (512×512)')

  console.log('\nDone! Next.js will auto-detect app/icon.png and app/apple-icon.png.')
}

run().catch(console.error)
