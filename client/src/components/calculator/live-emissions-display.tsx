import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LiveEmissionsDisplayProps {
  emissions: {
    total: number;
    transport: number;
    energy: number;
    foodWaste: number;
    production: number;
  };
  percentBelowAverage: number;
}

export function LiveEmissionsDisplay({
  emissions,
  percentBelowAverage
}: LiveEmissionsDisplayProps) {
  const isGood = percentBelowAverage > 0;

  const breakdownItems = [
    {
      label: 'Transport',
      value: emissions.transport,
      percentage: (emissions.transport / emissions.total) * 100
    },
    {
      label: 'Energy',
      value: emissions.energy,
      percentage: (emissions.energy / emissions.total) * 100
    },
    {
      label: 'Food & Waste',
      value: emissions.foodWaste,
      percentage: (emissions.foodWaste / emissions.total) * 100
    },
    {
      label: 'Production',
      value: emissions.production,
      percentage: (emissions.production / emissions.total) * 100
    }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-xl p-6 border border-emerald-500/30">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent mb-2">
            {emissions.total.toFixed(1)} tons CO₂
          </div>
          <div className={cn(
            "text-sm font-medium",
            isGood ? "text-emerald-400" : "text-orange-400"
          )}>
            {Math.abs(percentBelowAverage)}% {isGood ? 'below' : 'above'} average for your event type
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {breakdownItems.map((item) => (
          <Card
            key={item.label}
            className="bg-white/5 border-slate-700 p-4"
          >
            <div className="text-slate-400 text-sm mb-1">{item.label}</div>
            <div className="text-white text-xl font-semibold mb-2">
              {item.value.toFixed(1)} tons
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
