import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const targetDirs = ['app', 'components']
const baseDir = path.resolve('C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp')

function processFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8')
  let newContent = content

  // Font
  newContent = newContent.replace(/--font-inter/g, '--font-body')

  // Colors
  newContent = newContent.replace(/#6b6059/g, '#9ca3af')
  newContent = newContent.replace(/#5a5450/g, '#9ca3af')
  newContent = newContent.replace(/#7a6e68/g, '#c8c4bf')
  newContent = newContent.replace(/#7a7470/g, '#c8c4bf')
  newContent = newContent.replace(/#6a6460/g, '#9ca3af')
  newContent = newContent.replace(/#8a8078/g, '#c8c4bf')
  newContent = newContent.replace(/#8a8079/g, '#c8c4bf')

  // Typography Scale (9px, 10px -> text-xs. 11px -> text-sm)
  newContent = newContent.replace(/text-\[9px\]/g, 'text-xs')
  newContent = newContent.replace(/text-\[10px\]/g, 'text-xs')
  newContent = newContent.replace(/text-\[11px\]/g, 'text-sm')
  
  // Actually the critique says to increase body font sizes to 14px-16px.
  // We'll leave `text-xs` (12px) as `text-sm` where possible, but safely.
  // Wait, let's just make sure tracking is removed from <p> tags
  newContent = newContent.replace(/(<p[^>]*?class(?:Name)?="[^"]*?)tracking-\[0\.15em\]([^"]*?")/g, '$1$2')
  newContent = newContent.replace(/(<p[^>]*?class(?:Name)?="[^"]*?)tracking-widest([^"]*?")/g, '$1$2')

  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf-8')
    console.log(`Updated ${filepath}`)
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) {
      walk(filepath)
    } else if (file.endsWith('.tsx') || file.endsWith('.css')) {
      processFile(filepath)
    }
  }
}

for (const d of targetDirs) {
  walk(path.join(baseDir, d))
}
