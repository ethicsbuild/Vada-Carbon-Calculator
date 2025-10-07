import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Award, AlertTriangle } from 'lucide-react';

interface CarbonResultsProps {
  calculation: {
    total: number;
    venue: number;
    transportation: number;
    energy: number;
    catering: number;
    waste: number;
    production: number;
    emissionsPerAttendee: number;
    benchmarkComparison: {
      industryAverage: number;
      percentile: number;
      performance: string;
    };
  };
}

export function CarbonResults({ calculation }: CarbonResultsProps) {
  const { total, emissionsPerAttendee, benchmarkComparison } = calculation;

  // Determine if below or above average
  const percentDiff = ((emissionsPerAttendee - benchmarkComparison.industryAverage) / benchmarkComparison.industryAverage) * 100;
  const isBelowAverage = emissionsPerAttendee < benchmarkComparison.industryAverage;

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-green-400';
      case 'average': return 'text-yellow-400';
      case 'needs improvement': return 'text-orange-400';
      case 'poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    if (performance === 'excellent' || performance === 'good') {
      return <Award className="w-5 h-5 text-emerald-400" />;
    } else if (performance === 'needs improvement' || performance === 'poor') {
      return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    }
    return null;
  };

  // Calculate breakdown percentages
  const breakdownData = [
    { label: 'Transportation', value: calculation.transportation, color: 'bg-blue-500' },
    { label: 'Energy', value: calculation.energy, color: 'bg-yellow-500' },
    { label: 'Catering', value: calculation.catering, color: 'bg-green-500' },
    { label: 'Production', value: calculation.production, color: 'bg-purple-500' },
    { label: 'Venue', value: calculation.venue, color: 'bg-orange-500' },
    { label: 'Waste', value: calculation.waste, color: 'bg-red-500' },
  ].sort((a, b) => b.value - a.value);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
      <div className="space-y-6">
        {/* Total Emissions */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getPerformanceIcon(benchmarkComparison.performance)}
            <h3 className="text-2xl font-bold text-white">Total Carbon Footprint</h3>
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent mb-2">
            {total.toFixed(2)} tCO₂e
          </div>
          <p className="text-slate-400 text-sm">
            {emissionsPerAttendee.toFixed(4)} tCO₂e per attendee
          </p>
        </div>

        {/* Performance Comparison */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Performance Rating</span>
            <span className={`font-bold capitalize ${getPerformanceColor(benchmarkComparison.performance)}`}>
              {benchmarkComparison.performance}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isBelowAverage ? (
              <>
                <TrendingDown className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">
                  {Math.abs(percentDiff).toFixed(1)}% below industry average
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-medium">
                  {Math.abs(percentDiff).toFixed(1)}% above industry average
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Industry average: {benchmarkComparison.industryAverage.toFixed(4)} tCO₂e per attendee
          </p>
        </div>

        {/* Emissions Breakdown */}
        <div>
          <h4 className="text-slate-300 font-medium mb-3">Emissions Breakdown</h4>
          <div className="space-y-3">
            {breakdownData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-medium">
                      {item.value.toFixed(3)} tCO₂e ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 rounded-lg p-4 border border-emerald-500/20">
          <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            💡 Key Insight
          </h4>
          <p className="text-slate-300 text-sm">
            {breakdownData[0].label} is your largest emission source at {((breakdownData[0].value / total) * 100).toFixed(1)}%.
            Focus reduction efforts here for maximum impact.
          </p>
        </div>
      </div>
    </Card>
  );
}
