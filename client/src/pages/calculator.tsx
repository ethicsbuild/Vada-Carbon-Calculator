import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SageChat } from '@/components/sage/sage-chat';
import { EventFormCalculator } from '@/components/calculator/event-form-calculator';
import { QuestionFlow } from '@/components/calculator/question-flow';
import { LiveEmissionsDisplay } from '@/components/calculator/live-emissions-display';
import { MessageCircle, FileText } from 'lucide-react';

export default function Calculator() {
  const [location] = useLocation();
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [calculatorMode, setCalculatorMode] = useState<'form' | 'chat'>('form');
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
  const sageChatRef = useRef<{ sendMessage: (msg: string) => void } | null>(null);

  // Extract event type from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      setEventType(type);
      console.log('📍 Event type from URL:', type);
    }
  }, [location]);

  const handleDataExtracted = (data: any) => {
    setExtractedData(data);
    // Update emissions based on extracted data
    // This will be calculated by the backend
  };

  const handleGetReductionTips = () => {
    if (sageChatRef.current) {
      sageChatRef.current.sendMessage("Please show me reduction tips");
    }
  };

  const handleSaveCertificate = () => {
    if (sageChatRef.current) {
      sageChatRef.current.sendMessage("I'd like to save my results and get a certificate");
    }
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
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-2 inline-flex gap-2">
            <Button
              onClick={() => setCalculatorMode('form')}
              variant={calculatorMode === 'form' ? 'default' : 'ghost'}
              className={calculatorMode === 'form'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
              }
            >
              <FileText className="w-4 h-4 mr-2" />
              Manual Form
            </Button>
            <Button
              onClick={() => setCalculatorMode('chat')}
              variant={calculatorMode === 'chat' ? 'default' : 'ghost'}
              className={calculatorMode === 'chat'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                : 'text-slate-300 hover:text-white'
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </Card>
        </div>

        {calculatorMode === 'form' ? (
          /* Form Calculator */
          <div className="max-w-4xl mx-auto">
            <EventFormCalculator initialEventType={eventType} />
          </div>
        ) : (
          /* Chat Mode */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sage Chat Column */}
            <div>
              <SageChat
                ref={sageChatRef}
                eventType={eventType}
                onDataExtracted={handleDataExtracted}
              />
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
                    onClick={handleGetReductionTips}
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  >
                    Get Reduction Tips
                  </Button>
                  <Button
                    onClick={handleSaveCertificate}
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
        )}
      </div>
    </div>
  );
}
