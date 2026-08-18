import fs from 'fs'

const filesToClean = [
  "C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp/app/about/page.tsx",
  "C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp/app/membership/page.tsx",
  "C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp/app/privacy-policy/page.tsx",
  "C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp/app/terms-of-service/page.tsx",
  "C:/Users/rajni/OneDrive/Desktop/All Projects/Revive Fight Club/revive-temp/components/admin/Toast.tsx"
]

function cleanFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8')
  let newContent = content

  newContent = newContent.replace(/,\s*borderLeft:\s*['`].*?['`]/g, "")
  newContent = newContent.replace(/borderLeft:\s*['`].*?['`]\s*,?\s*/g, "")

  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf-8')
    console.log(`Cleaned ${filepath}`)
  }
}

filesToClean.forEach(cleanFile)
