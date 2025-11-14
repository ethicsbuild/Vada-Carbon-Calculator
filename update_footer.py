import re

# Read the footer file
with open('client/src/components/layout/footer.tsx', 'r') as f:
    content = f.read()

# Update footer background
content = re.sub(
    r'bg-gray-900',
    'bg-forest-900 dark:bg-forest-950',
    content
)

# Update text colors
content = re.sub(
    r'text-white(?![a-z-])',
    'text-forest-50',
    content
)

content = re.sub(
    r'text-gray-400',
    'text-sage-300 dark:text-sage-400',
    content
)

# Update hover states
content = re.sub(
    r'hover:text-white',
    'hover:text-forest-100',
    content
)

# Update brand gradient
content = re.sub(
    r'from-green-600 to-green-700',
    'from-forest-600 to-sage-600',
    content
)

# Update border
content = re.sub(
    r'border-gray-800',
    'border-forest-800 dark:border-forest-900',
    content
)

# Write back
with open('client/src/components/layout/footer.tsx', 'w') as f:
    f.write(content)

print("Footer updated with nature theme!")