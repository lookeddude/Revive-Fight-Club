import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    # Look for style={{ ... borderLeft: '...', ... }} or similar
    # Easiest way is to remove borderLeft completely from style={{...}} blocks.
    # regex to find borderLeft: '...' or `...` and its trailing comma or preceding comma
    new_content = re.sub(r",\s*borderLeft:\s*['`].*?['`]", "", new_content)
    new_content = re.sub(r"borderLeft:\s*['`].*?['`]\s*,?\s*", "", new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Cleaned {filepath}")

files_to_clean = [
    r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp\app\about\page.tsx",
    r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp\app\membership\page.tsx",
    r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp\app\privacy-policy\page.tsx",
    r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp\app\terms-of-service\page.tsx",
    r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp\components\admin\Toast.tsx"
]

for f in files_to_clean:
    clean_file(f)
