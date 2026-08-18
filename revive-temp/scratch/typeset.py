import os
import re

# We will search and replace in these directories
target_dirs = [
    'app',
    'components'
]

# Replacements to make
replacements = [
    (r'--font-inter', r'--font-body'),
    (r'#6b6059', r'#9ca3af'),
    (r'#5a5450', r'#9ca3af'),
    (r'#7a6e68', r'#c8c4bf'),
    (r'#7a7470', r'#c8c4bf'),
    (r'text-\[9px\]', r'text-xs'),
    (r'text-\[10px\]', r'text-sm'),
    (r'text-\[11px\]', r'text-sm'),
    (r'text-xs', r'text-sm'), # We replaced 9px to xs, but existing xs to sm
]

# We should be careful about replacing text-xs globally. Let's just do targeted replacements in components/sections/home and Footer.
# Actually, the critique said "Increase baseline body font sizes to 14px-16px. Brighten the secondary text colors..."
# And remove extreme letter spacing.

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    
    # Global replacement for font variable
    new_content = new_content.replace('--font-inter', '--font-body')
    
    # Global replacement for low contrast colors
    new_content = new_content.replace('#6b6059', '#9ca3af')
    new_content = new_content.replace('#5a5450', '#9ca3af')
    new_content = new_content.replace('#7a6e68', '#c8c4bf')
    new_content = new_content.replace('#7a7470', '#c8c4bf')
    new_content = new_content.replace('#6a6460', '#9ca3af')
    new_content = new_content.replace('#8a8078', '#c8c4bf')
    new_content = new_content.replace('#8a8079', '#c8c4bf')
    
    # Targeted typography fixes (font sizes, tracking)
    new_content = new_content.replace('text-[9px]', 'text-xs')
    new_content = new_content.replace('text-[10px]', 'text-xs')
    new_content = new_content.replace('text-[11px]', 'text-sm')
    # Change any text-xs that are strictly body text to text-sm? We'll leave text-xs as is since we just mapped 9px/10px to text-xs.
    
    # Remove tracking-[0.15em] from paragraphs. We can do a regex.
    # Looking for <p class="... tracking-[0.15em] ...">
    new_content = re.sub(r'(<p[^>]*?class(?:Name)?="[^"]*?)tracking-\[0\.15em\]([^"]*?")', r'\1\2', new_content)
    new_content = re.sub(r'(<p[^>]*?class(?:Name)?="[^"]*?)tracking-widest([^"]*?")', r'\1\2', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    base_dir = os.path.abspath(r"C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp")
    for d in target_dirs:
        dir_path = os.path.join(base_dir, d)
        for root, _, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.css'):
                    process_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
