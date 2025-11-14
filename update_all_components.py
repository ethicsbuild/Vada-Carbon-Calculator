import os
import re

def update_file(filepath, replacements):
    """Update a file with multiple replacements"""
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        original_content = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
        
        if content != original_content:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"✅ Updated: {filepath}")
            return True
        else:
            print(f"⏭️  No changes: {filepath}")
            return False
    except Exception as e:
        print(f"❌ Error updating {filepath}: {e}")
        return False

# Common replacements for dark backgrounds to nature theme
common_replacements = [
    # Background colors
    (r'bg-slate-950', 'bg-forest-50 dark:bg-forest-950'),
    (r'bg-slate-900', 'bg-sage-50 dark:bg-sage-900'),
    (r'bg-slate-800', 'bg-forest-100 dark:bg-forest-800'),
    (r'bg-slate-700', 'bg-sage-100 dark:bg-sage-700'),
    
    # Text colors
    (r'text-slate-950', 'text-forest-900 dark:text-forest-100'),
    (r'text-slate-900', 'text-forest-800 dark:text-forest-200'),
    (r'text-slate-800', 'text-forest-700 dark:text-forest-300'),
    (r'text-slate-700', 'text-sage-700 dark:text-sage-300'),
    (r'text-slate-600', 'text-sage-600 dark:text-sage-400'),
    (r'text-slate-500', 'text-sage-500 dark:text-sage-500'),
    (r'text-slate-400', 'text-sage-600 dark:text-sage-400'),
    (r'text-slate-300', 'text-sage-500 dark:text-sage-500'),
    (r'text-white(?![a-z-])', 'text-forest-900 dark:text-forest-100'),
    
    # Border colors
    (r'border-slate-800', 'border-forest-200 dark:border-forest-800'),
    (r'border-slate-700', 'border-forest-300 dark:border-forest-700'),
    (r'border-slate-600', 'border-sage-300 dark:border-sage-600'),
    (r'border-white/10', 'border-forest-200/30 dark:border-forest-700/30'),
    (r'border-white/20', 'border-forest-200/40 dark:border-forest-700/40'),
    
    # Emerald to Forest green
    (r'bg-emerald-500', 'bg-forest-500'),
    (r'bg-emerald-600', 'bg-forest-600'),
    (r'bg-emerald-700', 'bg-forest-700'),
    (r'text-emerald-400', 'text-forest-400'),
    (r'text-emerald-500', 'text-forest-500'),
    (r'text-emerald-600', 'text-forest-600'),
    (r'from-emerald-400', 'from-forest-400'),
    (r'from-emerald-500', 'from-forest-500'),
    (r'from-emerald-600', 'from-forest-600'),
    (r'to-emerald-500', 'to-sage-500'),
    (r'to-emerald-600', 'to-sage-600'),
    (r'to-emerald-700', 'to-sage-700'),
    (r'hover:bg-emerald-600', 'hover:bg-forest-600'),
    (r'hover:bg-emerald-700', 'hover:bg-forest-700'),
    
    # Green colors to nature palette
    (r'bg-green-500', 'bg-forest-500'),
    (r'bg-green-600', 'bg-forest-600'),
    (r'text-green-500', 'text-forest-500'),
    (r'text-green-600', 'text-forest-600'),
    
    # Rounded corners - make more organic
    (r'rounded-lg(?![a-z])', 'rounded-xl'),
    (r'rounded-md(?![a-z])', 'rounded-lg'),
]

# Files to update
files_to_update = [
    'client/src/components/calculator/event-form-calculator.tsx',
    'client/src/components/calculator/sage-guided-calculator.tsx',
    'client/src/components/calculator/event-type-card.tsx',
    'client/src/components/sage/carbon-results.tsx',
    'client/src/components/sage/influence-score-results.tsx',
    'client/src/components/ui/button.tsx',
    'client/src/components/ui/card.tsx',
    'client/src/components/ui/input.tsx',
    'client/src/pages/calculator.tsx',
    'client/src/pages/dashboard.tsx',
]

print("🌿 Updating components with nature theme...\n")

updated_count = 0
for filepath in files_to_update:
    full_path = filepath
    if os.path.exists(full_path):
        if update_file(full_path, common_replacements):
            updated_count += 1
    else:
        print(f"⚠️  File not found: {filepath}")

print(f"\n✨ Updated {updated_count} files with nature theme!")