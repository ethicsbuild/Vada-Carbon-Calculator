import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, TrendingUp, Award, AlertTriangle, Save, History, Target } from 'lucide-react';
import { HumanScaleComparisons } from './human-scale-comparisons';
import { ActionableRecommendations } from './actionable-recommendations';
import { SaveEventDialog } from '../events/save-event-dialog';
import { InfluenceScoreResults } from './influence-score-results';

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
    influenceScore?: number;
    highInfluenceEmissions?: {
      total: number;
      categories: Record<string, number>;
      breakdown: Record<string, number>;
    };
    mediumInfluenceEmissions?: {
      total: number;
      categories: Record<string, number>;
      breakdown: Record<string, number>;
    };
    lowInfluenceEmissions?: {
      total: number;
      categories: Record<string, number>;
      breakdown: Record<string, number>;
    };
    influenceInsights?: {
      category: string;
      message: string;
      impact: 'high' | 'medium' | 'low';
      actionable: boolean;
    }[];
  };
  eventData?: {
    attendance?: number;
    eventType?: string;
    location?: string;
  };
}

export function CarbonResults({ calculation, eventData }: CarbonResultsProps) {
  const { total, emissionsPerAttendee, benchmarkComparison } = calculation;
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Determine if below or above average
  const percentDiff = ((emissionsPerAttendee - benchmarkComparison.industryAverage) / benchmarkComparison.industryAverage) * 100;
  const isBelowAverage = emissionsPerAttendee < benchmarkComparison.industryAverage;

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-forest-400';
      case 'good': return 'text-green-400';
      case 'average': return 'text-yellow-400';
      case 'needs improvement': return 'text-orange-400';
      case 'poor': return 'text-red-400';
      default: return 'text-sage-600 dark:text-sage-400';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    if (performance === 'excellent' || performance === 'good') {
      return <Award className="w-5 h-5 text-forest-400" />;
    } else if (performance === 'needs improvement' || performance === 'poor') {
      return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    }
    return null;
  };

  const getCelebration = (performance: string, percentDiff: number) => {
    if (performance === 'excellent') {
      return `🎉 Outstanding! You're crushing it—${Math.abs(percentDiff).toFixed(0)}% below average. You're in the top tier of sustainable events!`;
    } else if (performance === 'good') {
      return `🌟 Nice work! You're already ${Math.abs(percentDiff).toFixed(0)}% below industry average. Keep pushing forward!`;
    } else if (performance === 'average') {
      return `📊 You're right at industry average. Good baseline—now let's get you into the top tier with a few strategic changes.`;
    } else {
      return `💪 Every journey starts somewhere! Focus on the high-impact recommendations below to make major improvements.`;
    }
  };

  // Calculate breakdown percentages
  const breakdownData = [
    { label: 'Transportation', value: calculation.transportation, color: 'bg-blue-500' },
    { label: 'Energy', value: calculation.energy, color: 'bg-yellow-500' },
    { label: 'Catering', value: calculation.catering, color: 'bg-forest-500' },
    { label: 'Production', value: calculation.production, color: 'bg-purple-500' },
    { label: 'Venue', value: calculation.venue, color: 'bg-orange-500' },
    { label: 'Waste', value: calculation.waste, color: 'bg-red-500' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      {/* Plain English Summary - NEW */}
      <Card className="bg-gradient-to-br from-emerald-50 to-violet-50 dark:from-emerald-900/20 dark:to-violet-900/20 border-emerald-300 dark:border-emerald-700/50 p-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-100 text-center">
            Your Event's Carbon Footprint in Plain English
          </h3>
          <div className="bg-white/50 dark:bg-forest-900/50 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-lg text-forest-800 dark:text-forest-200 leading-relaxed">
              Your event is estimated to generate <span className="font-bold text-emerald-600 dark:text-emerald-400">{total.toFixed(2)} metric tons of CO₂</span> — 
              roughly equivalent to{' '}
              <span className="font-bold">
                {Math.round(total / 4.6)} cars driven for an entire year
              </span>
              {' '}or{' '}
              <span className="font-bold">
                {Math.round(total / 1.2)} roundtrip flights from LA to NYC
              </span>.
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-sage-600 dark:text-sage-400">
              That's <span className="font-semibold text-forest-700 dark:text-forest-300">{emissionsPerAttendee.toFixed(3)} tons per attendee</span> — 
              about the same as driving <span className="font-semibold">{Math.round((emissionsPerAttendee / 0.000404))} miles</span> in a typical car.
            </p>
          </div>
        </div>
      </Card>

      {/* Hero Results Card */}
      <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 backdrop-blur-sm p-6">
        <div className="space-y-6">
          {/* Total Emissions */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getPerformanceIcon(benchmarkComparison.performance)}
              <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Technical Details</h3>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-forest-400 to-violet-400 bg-clip-text text-transparent mb-2">
              {total.toFixed(2)} tCO₂e
            </div>
            <p className="text-sage-600 dark:text-sage-400 text-sm">
              {emissionsPerAttendee.toFixed(4)} tCO₂e per attendee
            </p>
          </div>

          {/* Industry Comparison */}
          <div className="bg-sage-50 dark:bg-sage-900/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sage-500 dark:text-sage-500 font-medium">Industry Comparison</span>
              <span className={`font-bold capitalize ${getPerformanceColor(benchmarkComparison.performance)}`}>
                {benchmarkComparison.performance}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isBelowAverage ? (
                <>
                  <TrendingDown className="w-5 h-5 text-forest-400" />
                  <span className="text-forest-400 font-medium">
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
            <p className="text-xs text-sage-500 dark:text-sage-500 mt-2">
              Industry average: {benchmarkComparison.industryAverage.toFixed(4)} tCO₂e per attendee
            </p>
          </div>

          {/* Celebration Message */}
          <div className="bg-gradient-to-br from-forest-500/10 to-violet-500/10 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-sage-500 dark:text-sage-500 text-sm leading-relaxed">
              {getCelebration(benchmarkComparison.performance, percentDiff)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => setSaveDialogOpen(true)}
              className="flex-1 bg-gradient-to-r from-forest-500 to-sage-600 hover:from-forest-600 hover:to-sage-700 text-forest-900 dark:text-forest-100"
            >
              <Save className="w-4 h-4 mr-2" />
              Save This Event
            </Button>
            <Button
              variant="outline"
              className="border-sage-300 dark:border-sage-600 text-sage-500 dark:text-sage-500 hover:bg-sage-100 dark:hover:bg-sage-700"
              onClick={() => window.location.href = '/history'}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>

          {/* Emissions Breakdown */}
          <div>
            <h4 className="text-sage-500 dark:text-sage-500 font-medium mb-3">Emissions Breakdown</h4>
            <div className="space-y-3">
              {breakdownData.map((item, index) => {
                const percentage = (item.value / total) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-sage-600 dark:text-sage-400">{item.label}</span>
                      <span className="text-forest-900 dark:text-forest-100 font-medium">
                        {item.value.toFixed(3)} tCO₂e ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-sage-100 dark:bg-sage-700 rounded-full overflow-hidden">
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
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="influence" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-forest-100 dark:bg-forest-800/50">
          <TabsTrigger value="influence" className="data-[state=active]:bg-forest-500/20">
            <Target className="w-4 h-4 mr-2" />
            Your Control
          </TabsTrigger>
          <TabsTrigger value="comparisons" className="data-[state=active]:bg-forest-500/20">
            What Does This Mean?
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-forest-500/20">
            How To Improve
          </TabsTrigger>
        </TabsList>

        <TabsContent value="influence" className="mt-6">
          {calculation.influenceScore !== undefined && 
           calculation.highInfluenceEmissions && 
           calculation.mediumInfluenceEmissions && 
           calculation.lowInfluenceEmissions && 
           calculation.influenceInsights ? (
            <InfluenceScoreResults
              influenceScore={calculation.influenceScore}
              highInfluenceEmissions={calculation.highInfluenceEmissions}
              mediumInfluenceEmissions={calculation.mediumInfluenceEmissions}
              lowInfluenceEmissions={calculation.lowInfluenceEmissions}
              influenceInsights={calculation.influenceInsights}
              total={total}
              attendance={eventData?.attendance || 1}
            />
          ) : (
            <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 p-6">
              <p className="text-sage-600 dark:text-sage-400 text-center">
                Influence score data not available for this calculation.
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="comparisons" className="mt-6">
          <HumanScaleComparisons
            totalEmissions={total}
            perAttendee={emissionsPerAttendee}
            attendance={eventData?.attendance}
          />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <ActionableRecommendations
            calculation={calculation}
            eventData={eventData}
          />
        </TabsContent>
      </Tabs>

      {/* Save Event Dialog */}
      <SaveEventDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        calculation={calculation}
        eventData={eventData || {}}
        onSaveSuccess={() => {
          // Could show a success toast here
          console.log('Event saved successfully!');
        }}
      />
    </div>
  );
}