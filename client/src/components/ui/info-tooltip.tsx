import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface InfoTooltipProps {
  content: string;
  title?: string;
}

export function InfoTooltip({ content, title }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="ml-1 text-sage-600 dark:text-sage-400 hover:text-emerald-400 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-sage-50 dark:bg-forest-900 border border-emerald-500/30 rounded-lg shadow-xl">
          {title && <div className="font-semibold text-emerald-400 mb-1">{title}</div>}
          <div className="text-sm text-sage-700 dark:text-sage-300 leading-relaxed">{content}</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-sage-50 dark:bg-forest-900 border-r border-b border-emerald-500/30 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}
