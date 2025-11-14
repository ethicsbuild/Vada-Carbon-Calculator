import re

# Read the home page file
with open('client/src/pages/home.tsx', 'r') as f:
    content = f.read()

# Update main background gradient
content = re.sub(
    r'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
    'bg-gradient-to-br from-sage-50 via-forest-50 to-sage-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950',
    content
)

# Update header title gradient
content = re.sub(
    r'text-white mb-4 bg-gradient-to-r from-emerald-400 via-emerald-300 to-violet-400 bg-clip-text text-transparent',
    'mb-4 bg-gradient-to-r from-forest-600 via-sage-600 to-moss-600 dark:from-forest-400 dark:via-sage-400 dark:to-moss-400 bg-clip-text text-transparent',
    content
)

# Update subtitle color
content = re.sub(
    r'text-slate-400',
    'text-sage-700 dark:text-sage-400',
    content
)

# Update CTA button
content = re.sub(
    r'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25',
    'bg-gradient-to-r from-forest-600 to-sage-600 hover:from-forest-700 hover:to-sage-700 text-white shadow-lg shadow-forest-500/25 rounded-xl',
    content
)

# Update feature cards
content = re.sub(
    r'bg-slate-800/50 border-slate-700/50',
    'bg-forest-50/80 dark:bg-forest-900/50 border-forest-200/50 dark:border-forest-700/50 nature-card',
    content
)

# Update feature card titles
content = re.sub(
    r'text-white mb-2',
    'text-forest-800 dark:text-forest-200 mb-2',
    content
)

# Update feature card text
content = re.sub(
    r'text-slate-400 text-sm',
    'text-sage-700 dark:text-sage-400 text-sm',
    content
)

# Write back
with open('client/src/pages/home.tsx', 'w') as f:
    f.write(content)

print("Home page updated with nature theme!")