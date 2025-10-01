import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventTypeCardProps {
  icon: string;
  title: string;
  description: string;
  avgEmissions: number;
  type: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function EventTypeCard({
  icon,
  title,
  description,
  avgEmissions,
  isSelected,
  onSelect
}: EventTypeCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 p-6 bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20",
        isSelected && "border-emerald-500 bg-slate-800/70 shadow-lg shadow-emerald-500/20"
      )}
    >
      {/* Top gradient bar - appears on hover and selection */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-violet-500 transition-transform duration-300",
          isSelected ? "scale-x-100" : "scale-x-0"
        )}
      />

      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-4">{description}</p>

      {/* Stats */}
      <div className="pt-4 border-t border-slate-700/50">
        <p className="text-emerald-400 text-sm font-medium">
          Avg: {avgEmissions} tons CO₂/person
        </p>
      </div>
    </Card>
  );
}
