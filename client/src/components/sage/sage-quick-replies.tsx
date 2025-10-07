import { Button } from '@/components/ui/button';

interface QuickReply {
  label: string;
  value: string;
}

interface SageQuickRepliesProps {
  options: QuickReply[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function SageQuickReplies({ options, onSelect, disabled }: SageQuickRepliesProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs text-slate-400 mb-2">Quick answers:</p>
      <div className="grid grid-cols-1 gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelect(option.value)}
            disabled={disabled}
            variant="outline"
            className="bg-slate-700/30 border-slate-600 text-white hover:bg-slate-700/50 hover:border-emerald-500 transition-all text-left justify-start h-auto py-3 px-4"
          >
            <span className="text-sm">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
