const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const envContent = fs.readFileSync('.env.local', 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const idx = line.indexOf('=')
  if (idx > 0) {
    const key = line.slice(0, idx).trim()
    const val = line.slice(idx + 1).trim()
    env[key] = val
  }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const BUCKET = 'revive-gallery'
const ORPHANED_FILES = [
  'hero-slides/1786213946039-c8tyottikvl.jpg',
  'hero-slides/1786213963182-36delpd2ry.jpg',
  'hero-slides/1786213983130-6hstu9awtyu.jpg',
  'hero-slides/1786213995966-98c8a9eji1n.jpg',
  'hero-slides/1786214004130-nr892gx2ekm.jpg',
  'hero-slides/1786214026475-4t8uli3bf5f.jpg',
  'hero-slides/1786214052511-k4grrytzgb.jpg',
  'hero-slides/1786214061494-riybla3acxl.jpg',
  'hero-slides/1786215461411-1ncg0yg7iy8.png',
  'hero-slides/1786215848675-rjy6axel76.png',
  'hero-slides/1786216191150-thlm5pyfa7.png',
  'hero-slides/1786216236773-e6c1g1r22er.jpg',
  'program-slides/bodybuilding/1786219950096-0pur8cbv3k9p.jpg',
  'program-slides/kickboxing/1786229963042-ribdmbmn2zn.jpg',
  'program-slides/kickboxing/1786230031121-ka738r08e2.jpg',
  'program-slides/mma/1786225176283-96o6ysifisp.png',
  'program-slides/mma/1786225205073-4ozw5cpwiqh.png',
  'program-slides/mma/1786225242588-qjjjpsrc2rs.jpg',
  'program-slides/mma/1786225251770-wlso9m102dn.jpg',
  'program-slides/mma/1786225260621-batc27u2n0k.jpg',
  'program-slides/mma/1786225269620-shfqeoxp0h.jpg',
  'program-slides/mma/1786230906977-y8jrnzawqli.jpg',
  'program-slides/mma/1786230918050-21et02fhlf3.jpg',
  'program-slides/mma/1786230927718-zljg452qiej.jpg',
  'program-slides/mma/1786230938601-x6l1ks0265.jpg',
  'program-slides/mma/1786230961727-0zdk4gairuka.jpg',
  'program-slides/weight-loss/1786308304526-4y59sp3x3uq.jpg',
  'program-slides/weight-loss/1786308329098-b4njvh8e227.jpg',
  'program-slides/weight-loss/1786308344589-4g0466aw1hd.jpg',
  'program-slides/weight-loss/1786308360398-zj9kvgpybtr.jpg',
]

console.log('Deleting ' + ORPHANED_FILES.length + ' orphaned files...')

supabase.storage.from(BUCKET).remove(ORPHANED_FILES).then(function(result) {
  if (result.error) {
    console.error('ERROR:', result.error.message)
    process.exit(1)
  }
  console.log('SUCCESS: Deleted ' + ORPHANED_FILES.length + ' orphaned files')
  ORPHANED_FILES.forEach(function(f) { console.log('  - ' + f) })
})
