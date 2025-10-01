import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SageChat } from '@/components/sage/sage-chat';
import { QuestionFlow } from '@/components/calculator/question-flow';
import { LiveEmissionsDisplay } from '@/components/calculator/live-emissions-display';

export default function Calculator() {
  const [showChat, setShowChat] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [emissions, setEmissions] = useState({
    total: 0,
    transport: 0,
    energy: 0,
    foodWaste: 0,
    production: 0
  });
  const [selectedTransport, setSelectedTransport] = useState('driving');
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleDataExtracted = (data: any) => {
    setExtractedData(data);
    // Update emissions based on extracted data
    // This will be calculated by the backend
  };

  const achievements = [
    { icon: '🌟', label: 'First Steps' },
    { icon: '🚌', label: 'Transit Hero' },
    { icon: '♻️', label: 'Waste Warrior' },
    { icon: '🏆', label: 'Under Average' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sage Chat Column */}
          <div>
            <SageChat onDataExtracted={handleDataExtracted} />
          </div>

          {/* Calculator Results Column */}
          <div className="space-y-6">
            {/* Live Emissions Display */}
            {emissions.total > 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Estimate</h3>
                <LiveEmissionsDisplay
                  emissions={emissions}
                  percentBelowAverage={23}
                />
              </Card>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                <div className="flex gap-3 flex-wrap">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex-1 min-w-[80px] text-center p-3 bg-gradient-to-br from-violet-500/10 to-violet-500/5 rounded-lg border border-violet-500/30"
                    >
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <p className="text-xs text-slate-400">{achievement.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            {extractedData && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  >
                    Get Reduction Tips
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Save & Get Certificate
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
