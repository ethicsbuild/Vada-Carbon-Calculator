import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, TrendingUp, Info, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface InfluenceTierEmissions {
  total: number;
  categories: Record<string, number>;
  breakdown: Record<string, number>;
}

interface InfluenceScoreResultsProps {
  influenceScore: number;
  highInfluenceEmissions: InfluenceTierEmissions;
  mediumInfluenceEmissions: InfluenceTierEmissions;
  lowInfluenceEmissions: InfluenceTierEmissions;
  influenceInsights: {
    category: string;
    message: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
  }[];
  total: number;
  attendance: number;
}

export function InfluenceScoreResults({
  influenceScore,
  highInfluenceEmissions,
  mediumInfluenceEmissions,
  lowInfluenceEmissions,
  influenceInsights,
  total,
  attendance
}: InfluenceScoreResultsProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-forest-400 to-green-500';
    if (score >= 75) return 'from-green-400 to-lime-500';
    if (score >= 60) return 'from-yellow-400 to-amber-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-rose-500';
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're maximizing your impact where it matters most.";
    if (score >= 75) return "Great work! You're doing well on the things you can control.";
    if (score >= 60) return "Good progress! Focus on the high-influence areas for bigger impact.";
    if (score >= 40) return "You're on the right track. Let's optimize your controllable emissions.";
    return "There's significant room for improvement in areas you can control.";
  };

  const getImpactIcon = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return <Target className="w-4 h-4 text-forest-400" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <Info className="w-4 h-4 text-sage-600 dark:text-sage-400" />;
    }
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-forest-500/20 text-forest-400 border-emerald-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-slate-500/20 text-sage-600 dark:text-sage-400 border-slate-500/30'
    };
    return (
      <Badge variant="outline" className={`${colors[impact]} capitalize`}>
        {impact} Control
      </Badge>
    );
  };

  const formatEmissions = (value: number) => {
    return value.toFixed(3);
  };

  const getPercentage = (value: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Influence Score Hero */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-forest-300 dark:border-forest-700/50 backdrop-blur-sm p-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-forest-400" />
            <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Your Influence Score</h2>
          </div>
          
          <div className="relative">
            <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(influenceScore)} bg-clip-text text-transparent`}>
              {influenceScore}
            </div>
            <div className="text-sage-600 dark:text-sage-400 text-sm mt-1">out of 100</div>
          </div>

          <div className="space-y-2">
            <div className={`text-xl font-semibold bg-gradient-to-r ${getScoreColor(influenceScore)} bg-clip-text text-transparent`}>
              {getScoreRating(influenceScore)}
            </div>
            <p className="text-sage-500 dark:text-sage-500 text-sm max-w-2xl mx-auto">
              {getScoreMessage(influenceScore)}
            </p>
          </div>

          <div className="bg-sage-50 dark:bg-sage-900/50 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-sage-600 dark:text-sage-400 text-xs leading-relaxed">
              <Info className="w-4 h-4 inline mr-1" />
              Your Influence Score measures how well you're performing on the things you <strong className="text-forest-900 dark:text-forest-100">CAN control</strong>. 
              It focuses on production elements like energy, catering, and waste—not on attendee travel, which is largely outside your control.
            </p>
          </div>
        </div>
      </Card>

      {/* Three-Tier Breakdown */}
      <Tabs defaultValue="high" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-forest-100 dark:bg-forest-800/50">
          <TabsTrigger 
            value="high" 
            className="data-[state=active]:bg-forest-500/20 data-[state=active]:text-forest-400"
          >
            <Target className="w-4 h-4 mr-2" />
            High Control
          </TabsTrigger>
          <TabsTrigger 
            value="medium" 
            className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Medium Control
          </TabsTrigger>
          <TabsTrigger 
            value="low" 
            className="data-[state=active]:bg-slate-500/20 data-[state=active]:text-sage-600 dark:text-sage-400"
          >
            <Info className="w-4 h-4 mr-2" />
            Context
          </TabsTrigger>
        </TabsList>

        {/* High Influence Tab */}
        <TabsContent value="high" className="mt-6">
          <Card className="bg-forest-100 dark:bg-forest-800/50 border-emerald-500/30 p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100 mb-2">High Control Areas</h3>
                  <p className="text-sage-600 dark:text-sage-400 text-sm">
                    These are the elements you have direct control over. Focus here for maximum impact.
                  </p>
                </div>
                <Badge className="bg-forest-500/20 text-forest-400 border-emerald-500/30">
                  85-100% Control
                </Badge>
              </div>

              <div className="bg-sage-50 dark:bg-sage-900/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sage-500 dark:text-sage-500 font-medium">Total High-Control Emissions</span>
                  <span className="text-2xl font-bold text-forest-400">
                    {formatEmissions(highInfluenceEmissions.total)} tCO₂e
                  </span>
                </div>
                <div className="text-xs text-sage-500 dark:text-sage-500">
                  {getPercentage(highInfluenceEmissions.total)}% of total footprint • {(highInfluenceEmissions.total / attendance).toFixed(4)} tCO₂e per attendee
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(highInfluenceEmissions.categories).map(([category, value]) => (
                  <div key={category} className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sage-500 dark:text-sage-500 capitalize">{category}</span>
                      <span className="text-forest-900 dark:text-forest-100 font-medium">
                        {formatEmissions(value)} tCO₂e
                      </span>
                    </div>
                    <div className="h-2 bg-sage-100 dark:bg-sage-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-forest-400 to-green-500 transition-all duration-500"
                        style={{ width: `${(value / highInfluenceEmissions.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Medium Influence Tab */}
        <TabsContent value="medium" className="mt-6">
          <Card className="bg-forest-100 dark:bg-forest-800/50 border-yellow-500/30 p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100 mb-2">Medium Control Areas</h3>
                  <p className="text-sage-600 dark:text-sage-400 text-sm">
                    You can influence these through planning and incentives, but don't have complete control.
                  </p>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  40-84% Control
                </Badge>
              </div>

              <div className="bg-sage-50 dark:bg-sage-900/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sage-500 dark:text-sage-500 font-medium">Total Medium-Control Emissions</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {formatEmissions(mediumInfluenceEmissions.total)} tCO₂e
                  </span>
                </div>
                <div className="text-xs text-sage-500 dark:text-sage-500">
                  {getPercentage(mediumInfluenceEmissions.total)}% of total footprint • {(mediumInfluenceEmissions.total / attendance).toFixed(4)} tCO₂e per attendee
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(mediumInfluenceEmissions.categories).map(([category, value]) => (
                  <div key={category} className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sage-500 dark:text-sage-500 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-forest-900 dark:text-forest-100 font-medium">
                        {formatEmissions(value)} tCO₂e
                      </span>
                    </div>
                    <div className="h-2 bg-sage-100 dark:bg-sage-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                        style={{ width: `${(value / mediumInfluenceEmissions.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Low Influence Tab */}
        <TabsContent value="low" className="mt-6">
          <Card className="bg-forest-100 dark:bg-forest-800/50 border-sage-300 dark:border-sage-600/30 p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100 mb-2">Context: Low Control Areas</h3>
                  <p className="text-sage-600 dark:text-sage-400 text-sm">
                    These emissions are largely outside your control, but it's important to understand their impact.
                  </p>
                </div>
                <Badge className="bg-slate-500/20 text-sage-600 dark:text-sage-400 border-slate-500/30">
                  &lt;40% Control
                </Badge>
              </div>

              <div className="bg-sage-50 dark:bg-sage-900/50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sage-500 dark:text-sage-500 font-medium">Total Low-Control Emissions</span>
                  <span className="text-2xl font-bold text-sage-600 dark:text-sage-400">
                    {formatEmissions(lowInfluenceEmissions.total)} tCO₂e
                  </span>
                </div>
                <div className="text-xs text-sage-500 dark:text-sage-500">
                  {getPercentage(lowInfluenceEmissions.total)}% of total footprint • {(lowInfluenceEmissions.total / attendance).toFixed(4)} tCO₂e per attendee
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(lowInfluenceEmissions.categories).map(([category, value]) => (
                  <div key={category} className="bg-sage-50 dark:bg-sage-900/30 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sage-500 dark:text-sage-500 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-forest-900 dark:text-forest-100 font-medium">
                        {formatEmissions(value)} tCO₂e
                      </span>
                    </div>
                    <div className="h-2 bg-sage-100 dark:bg-sage-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-slate-400 to-slate-500 transition-all duration-500"
                        style={{ width: `${(value / lowInfluenceEmissions.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-sage-500 dark:text-sage-500">
                    <p className="font-medium text-blue-400 mb-1">Why This Matters</p>
                    <p className="text-sage-600 dark:text-sage-400">
                      While you can't directly control attendee travel, your venue choice and event location 
                      do influence these emissions. Transit-accessible venues and central locations help minimize 
                      this impact. Consider partnering with rideshare programs or offering transit incentives for future events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights & Recommendations */}
      <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-forest-900 dark:text-forest-100">Insights & Recommendations</h3>
        </div>

        <div className="space-y-3">
          {influenceInsights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border ${
                insight.impact === 'high'
                  ? 'bg-forest-500/10 border-emerald-500/30'
                  : insight.impact === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-sage-100 dark:bg-sage-700/30 border-sage-300 dark:border-sage-600/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {insight.actionable ? (
                    <CheckCircle2 className="w-5 h-5 text-forest-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-forest-900 dark:text-forest-100">{insight.category}</span>
                    {getImpactBadge(insight.impact)}
                  </div>
                  <p className="text-sm text-sage-500 dark:text-sage-500 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}