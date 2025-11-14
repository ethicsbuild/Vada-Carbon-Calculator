import re

# Read the file
with open('tailwind.config.ts', 'r') as f:
    content = f.read()

# Add organic border radius and nature animations
additions = '''         borderRadius: {
           lg: "var(--radius)",
           md: "calc(var(--radius) - 2px)",
           sm: "calc(var(--radius) - 4px)",
           'organic': '30% 70% 70% 30% / 30% 30% 70% 70%',
           'leaf': '50% 0% 50% 50% / 50% 50% 0% 50%',
           'nature': '1.5rem',
         },'''

# Replace borderRadius section
pattern = r'borderRadius: \{[^}]+\},'
content = re.sub(pattern, additions, content)

# Add nature-themed animations to keyframes
nature_animations = '''           "leaf-float": {
             '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
             '25%': { transform: 'translateY(-10px) rotate(5deg)' },
             '50%': { transform: 'translateY(-5px) rotate(-3deg)' },
             '75%': { transform: 'translateY(-15px) rotate(7deg)' },
           },
           "grow": {
             '0%': { transform: 'scale(0.95)', opacity: '0.8' },
             '100%': { transform: 'scale(1)', opacity: '1' },
           },
           "sway": {
             '0%, 100%': { transform: 'rotate(-3deg)' },
             '50%': { transform: 'rotate(3deg)' },
           },
'''

# Find the blink animation and add nature animations before it
pattern = r'(blink: \{[^}]+\},)'
replacement = nature_animations + r'           \1'
content = re.sub(pattern, replacement, content)

# Add nature animations to animation section
nature_anim_classes = '''           "leaf-float": "leaf-float 6s ease-in-out infinite",
           "grow": "grow 0.3s ease-out",
           "sway": "sway 3s ease-in-out infinite",
'''

# Find typing animation and add nature animations before it
pattern = r'(typing: "typing[^"]+",)'
replacement = nature_anim_classes + r'           \1'
content = re.sub(pattern, replacement, content)

# Write back
with open('tailwind.config.ts', 'w') as f:
    f.write(content)

print("Tailwind config updated with nature animations and organic borders!")