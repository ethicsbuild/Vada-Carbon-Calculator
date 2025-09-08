import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoPilotChat } from '@/components/calculator/co-pilot-chat';
import { CalculationForm } from '@/components/calculator/calculation-form';
import { ProgressTracker } from '@/components/calculator/progress-tracker';
import { AchievementBadges } from '@/components/gamification/achievement-badges';
import { useCarbonCalculation } from '@/hooks/use-carbon-calculation';
import { Bot, TrendingUp, Zap } from 'lucide-react';

export default function Calculator() {
  const {
    progress,
    estimateEmissions,
    calculateEmissions,
    isEstimating,
    isCalculating,
    estimationResult,
    calculationResult
  } = useCarbonCalculation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="bg-green-600/10 border-green-600/20">
              <Bot className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-green-600">AI-Powered Calculator</span>
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interactive Carbon Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start your carbon footprint journey with our AI-powered co-pilot that guides you through GHG Protocol compliant calculations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Co-Pilot Chat */}
            <CoPilotChat />
            
            {/* Calculation Form */}
            <CalculationForm 
              onEstimate={estimateEmissions}
              onCalculate={calculateEmissions}
              isLoading={isEstimating || isCalculating}
              result={estimationResult || calculationResult}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker progress={progress} />
            
            {/* Achievement Badges */}
            <AchievementBadges />
            
            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Industry Average</span>
                    <span className="font-semibold text-gray-900 dark:text-white">125 tCO2e</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Your Estimate</span>
                    <span className="font-semibold text-green-600">
                      {estimationResult ? `${estimationResult.total.toFixed(1)} tCO2e` : '-- tCO2e'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Potential Savings</span>
                    <span className="font-semibold text-orange-600">-15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200">
                      💡 Start with estimation mode for quick baseline results, then refine with detailed data.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200">
                      🎯 Scope 3 is now mandatory per GHG Protocol 2025 updates - our AI helps estimate missing data.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-purple-800 dark:text-purple-200">
                      🔗 Generate blockchain-verified carbon receipts for transparent offset verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
