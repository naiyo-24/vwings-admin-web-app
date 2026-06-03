import os
import re

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                
                # Replace varying opacities of white text colors
                new_content = re.sub(r"color:\s*'rgba\(255,\s*255,\s*255,\s*(0\.[4-9])\)'", r"color: 'var(--text-muted)'", new_content)
                new_content = re.sub(r"color:\s*\"rgba\(255,\s*255,\s*255,\s*(0\.[4-9])\)\"", r'color: "var(--text-muted)"', new_content)
                new_content = re.sub(r"color:\s*'var\(--text-muted,\s*rgba\(255,\s*255,\s*255,\s*[0-9.]+\)\)'", r"color: 'var(--text-muted)'", new_content)
                
                # Replace white borders
                new_content = re.sub(r"border:\s*'1px solid rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)'", r"border: '1px solid var(--border)'", new_content)
                new_content = re.sub(r"borderBottom:\s*'1px solid rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)'", r"borderBottom: '1px solid var(--border)'", new_content)
                new_content = re.sub(r"borderTop:\s*'1px solid rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)'", r"borderTop: '1px solid var(--border)'", new_content)

                # Replace white transparent backgrounds
                new_content = re.sub(r"background:\s*'rgba\(255,\s*255,\s*255,\s*0\.[0123]\)'", r"background: 'var(--surface-hover)'", new_content)
                new_content = re.sub(r"background:\s*rgba\(255,\s*255,\s*255,\s*0\.[0123]\)", r"var(--surface-hover)", new_content)
                
                # specific ones
                new_content = new_content.replace("'var(--text-main, white)'", "'var(--text-main)'")
                new_content = new_content.replace("'rgba(255,255,255,0.1) !important'", "'var(--surface-hover) !important'")
                new_content = new_content.replace("rgba(255,255,255,0.03)", "var(--surface-hover)")
                new_content = new_content.replace("rgba(255,255,255,0.01)", "var(--surface-hover)")

                # Also fix the Layout dropdown backgrounds which were very dark
                new_content = new_content.replace("background: 'rgba(5, 5, 15, 0.98)'", "background: 'var(--surface)'")
                new_content = new_content.replace("background: 'rgba(15, 15, 25, 0.95)'", "background: 'var(--surface)'")

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    process_directory(r"d:\VWings24x7-Admin-App\src")
