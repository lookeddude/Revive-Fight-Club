/**
 * Batch replaces all public page files:
 * - import { Header } from '@/components/layout/Header'
 * + import { Navbar } from '@/components/layout/Navbar'
 * - <Header />
 * + <Navbar />
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const pages = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/book-trial/page.tsx',
  'app/contact/page.tsx',
  'app/membership/page.tsx',
  'app/privacy-policy/page.tsx',
  'app/programs/page.tsx',
  'app/programs/[slug]/page.tsx',
  'app/reviews/page.tsx',
  'app/schedule/page.tsx',
  'app/terms-of-service/page.tsx',
  'app/trainers/page.tsx',
  'app/trainers/[slug]/page.tsx',
]

let updated = 0

for (const rel of pages) {
  const fullPath = join(process.cwd(), rel)
  let content = readFileSync(fullPath, 'utf8')

  const before = content

  content = content
    .replace(
      `import { Header } from '@/components/layout/Header'`,
      `import { Navbar } from '@/components/layout/Navbar'`
    )
    .replace(/<Header \/>/g, '<Navbar />')

  if (content !== before) {
    writeFileSync(fullPath, content, 'utf8')
    console.log(`✓ Updated: ${rel}`)
    updated++
  } else {
    console.log(`  Skipped (no match): ${rel}`)
  }
}

console.log(`\nDone! Updated ${updated}/${pages.length} files.`)
