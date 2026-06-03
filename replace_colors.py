import os
import re

def process_directory(directory):
    replacements = [
        (r"color:\s*'white'", "color: 'var(--text-main)'"),
        (r"color:\s*'#FFFFFF'", "color: 'var(--text-main)'"),
        (r"color:\s*\"white\"", "color: \"var(--text-main)\""),
        (r"color:\s*\"#FFFFFF\"", "color: \"var(--text-main)\""),
        (r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.05\)'", "background: 'var(--surface-hover)'"),
        (r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.1\)'", "background: 'var(--surface-hover)'"),
        (r"background:\s*'rgba\(255,255,255,0\.05\)'", "background: 'var(--surface-hover)'"),
        (r"background:\s*'rgba\(255,255,255,0\.1\)'", "background: 'var(--surface-hover)'"),
        (r"border:\s*'1px solid rgba\(255,\s*255,\s*255,\s*0\.2\)'", "border: '1px solid var(--border)'"),
        (r"border:\s*'1px solid rgba\(255,255,255,0\.2\)'", "border: '1px solid var(--border)'"),
        (r"color:\s*'rgba\(255,\s*255,\s*255,\s*0\.7\)'", "color: 'var(--text-muted)'"),
        (r"color:\s*'rgba\(255,255,255,0\.7\)'", "color: 'var(--text-muted)'")
    ]

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements:
                    new_content = re.sub(old, new, new_content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    process_directory(r"d:\VWings24x7-Admin-App\src")
