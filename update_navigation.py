import re

# Read the navigation file
with open('client/src/components/layout/navigation.tsx', 'r') as f:
    content = f.read()

# Update logo section
content = re.sub(
    r'<h1 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent cursor-pointer tracking-tight">\s*VADA\s*</h1>',
    '''<div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-3xl animate-leaf-float">🌿</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-forest-600 to-sage-600 bg-clip-text text-transparent tracking-tight group-hover:from-forest-500 group-hover:to-sage-500 transition-all">
                  VADA
                </h1>
              </div>''',
    content
)

# Update navigation links colors
content = re.sub(
    r'text-slate-400 hover:text-white',
    'text-sage-600 dark:text-sage-400 hover:text-forest-600 dark:hover:text-forest-400',
    content
)

content = re.sub(
    r'"text-white"',
    '"text-forest-700 dark:text-forest-300 font-semibold"',
    content
)

# Update carbon score badge
content = re.sub(
    r'bg-slate-800 px-4 py-2 rounded-full border border-emerald-500/50',
    'bg-forest-100 dark:bg-forest-800 px-4 py-2 rounded-full border border-forest-400/50',
    content
)

content = re.sub(
    r'text-slate-300',
    'text-forest-700 dark:text-forest-300',
    content
)

content = re.sub(
    r'text-emerald-400',
    'text-forest-600 dark:text-forest-400',
    content
)

# Update mobile menu button
content = re.sub(
    r'text-white hover:bg-slate-800',
    'text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800',
    content
)

# Update mobile menu border
content = re.sub(
    r'border-white/10',
    'border-forest-200/50 dark:border-forest-700/50',
    content,
    count=1  # Only the mobile menu border, not the header
)

# Write back
with open('client/src/components/layout/navigation.tsx', 'w') as f:
    f.write(content)

print("Navigation updated with nature theme!")