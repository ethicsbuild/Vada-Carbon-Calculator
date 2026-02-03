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
        "relative overflow-hidden cursor-pointer transition-all duration-300 p-6 bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 hover:bg-forest-100 dark:hover:bg-forest-800/70 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20",
        isSelected && "border-primary bg-forest-100 dark:bg-forest-800/70 shadow-lg shadow-emerald-500/20"
      )}
    >
      {/* Top gradient bar - appears on hover and selection */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-500 to-violet-500 transition-transform duration-300",
          isSelected ? "scale-x-100" : "scale-x-0"
        )}
      />

      {/* Icon */}
      <div className="text-4xl mb-4">{icon}</div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-forest-900 dark:text-forest-100 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sage-600 dark:text-sage-400 text-sm leading-relaxed mb-4">{description}</p>

      {/* Stats */}
      <div className="pt-4 border-t border-forest-300 dark:border-forest-700/50">
        <p className="text-forest-400 text-sm font-medium">
          Avg: {avgEmissions} tons CO₂/person
        </p>
      </div>
    </Card>
  );
}
