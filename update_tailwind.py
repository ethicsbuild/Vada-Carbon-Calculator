import re

# Read the file
with open('tailwind.config.ts', 'r') as f:
    content = f.read()

# Define the nature colors to insert
nature_colors = '''           // Nature-forward earthy color palette
           forest: {
             50: '#f0f9f4',
             100: '#dcf2e4',
             200: '#bae5cd',
             300: '#8bd3ad',
             400: '#56ba87',
             500: '#32a06a',
             600: '#228354',
             700: '#1b6844',
             800: '#175337',
             900: '#14442e',
           },
           sage: {
             50: '#f6f7f4',
             100: '#e8ebe3',
             200: '#d1d8c8',
             300: '#b0bda3',
             400: '#8d9f7c',
             500: '#6f835f',
             600: '#576849',
             700: '#45523b',
             800: '#394332',
             900: '#30392b',
           },
           moss: {
             50: '#f4f6f3',
             100: '#e5ebe1',
             200: '#ccd7c5',
             300: '#a8bba0',
             400: '#7f9975',
             500: '#5f7d56',
             600: '#4a6343',
             700: '#3c4f37',
             800: '#32412f',
             900: '#2b3729',
           },
           earth: {
             50: '#f9f7f4',
             100: '#f0ebe3',
             200: '#e0d5c5',
             300: '#cbb89f',
             400: '#b59778',
             500: '#a67f5d',
             600: '#996d51',
             700: '#7f5844',
             800: '#69493b',
             900: '#573d32',
           },
'''

# Find the position to insert (after carbon-light)
pattern = r'("carbon-light": "var\(--carbon-light\)",)\s*(\},\s*keyframes:)'
replacement = r'\1\n' + nature_colors + r'         \2'

# Replace
new_content = re.sub(pattern, replacement, content)

# Write back
with open('tailwind.config.ts', 'w') as f:
    f.write(new_content)

print("Tailwind config updated with nature colors!")