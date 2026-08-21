import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read service role key from .env.local
const envPath = resolve('.env.local')
const env = readFileSync(envPath, 'utf-8')
const keyMatch = env.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)
if (!keyMatch) { console.error('SUPABASE_SERVICE_ROLE_KEY not found in .env.local'); process.exit(1) }
const SERVICE_KEY = keyMatch[1].trim()

const SUPABASE_URL = 'https://hnmtjcpmdywwtafgexxk.supabase.co'
const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

const ORPHANS = {
  'revive-gallery': [
    'hero-slides/1786214850090-c2x5ypzslbi.jpg',
    'hero-slides/1786215377933-734m50fq36s.jpg',
    'hero-slides/1786218352426-zhgd5ifjscs.jpg',
    'hero-slides/1786220311897-gp2uztrbhur.jpg',
    'hero-slides/1786326431154-aks97wiwj3.jpg',
    'hero-slides/1786326487248-5vvw10hzxjj.jpg',
    'hero-slides/1786895425217-ed89jgz2lfr.jpg',
    'hero-slides/1786895687128-2crfc6lex44.jpg',
    'hero-slides/1786896199220-6e446582arw.png',
    'hero-slides/1786896719861-awel6icl62v.jpg',
    'hero-slides/1786896828794-ya97xsjoaln.jpg',
    'program-slides/bodybuilding/1786282476997-go9hr1qxvu.jpg',
    'program-slides/bodybuilding/1786282487748-3xazl93nej5.jpg',
    'program-slides/bodybuilding/1786282497145-qp7m6yg9p1g.jpg',
    'program-slides/bodybuilding/1786282517648-dg4tv8gb934.jpg',
  ],
  'revive-brand': [
    '.emptyFolderPlaceholder',
    'seconf.png',
    'uploads/1786459211511-mqs1dbk30no.png',
    'uploads/1786898213326-cih2g4jak2d.png',
  ],
  'revive-trainers': [
    'acd1958b-afe9-4f6b-82b8-400e180a0c1e/1787062203542-y9142p94js8.png',
    'acd1958b-afe9-4f6b-82b8-400e180a0c1e-desktop/1787062580130-hf2r1cw7bft.png',
    'acd1958b-afe9-4f6b-82b8-400e180a0c1e-mobile/1787062591391-uff6n6nm3sb.png',
    'acd1958b-afe9-4f6b-82b8-400e180a0c1e-tablet/1787062666313-xstyqs5khp.png',
  ],
}

let totalDeleted = 0
let totalFailed = 0

for (const [bucket, paths] of Object.entries(ORPHANS)) {
  console.log(`\n── Bucket: ${bucket} (${paths.length} files) ──`)
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ prefixes: paths }),
  })
  const data = await res.json()
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.error) {
        console.log(`  ❌ FAILED: ${item.name} — ${item.error?.message ?? JSON.stringify(item.error)}`)
        totalFailed++
      } else {
        console.log(`  ✅ Deleted: ${item.name}`)
        totalDeleted++
      }
    }
  } else {
    console.log('  Response:', JSON.stringify(data))
    // Try individually if batch fails
    for (const path of paths) {
      const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ prefixes: [path] }),
      })
      const d = await r.json()
      if (Array.isArray(d) && d[0] && !d[0].error) {
        console.log(`  ✅ Deleted: ${path}`)
        totalDeleted++
      } else {
        console.log(`  ❌ FAILED: ${path}`)
        totalFailed++
      }
    }
  }
}

console.log(`\n════════════════════════`)
console.log(`✅ Deleted : ${totalDeleted} files`)
console.log(`❌ Failed  : ${totalFailed} files`)
console.log(`════════════════════════`)
