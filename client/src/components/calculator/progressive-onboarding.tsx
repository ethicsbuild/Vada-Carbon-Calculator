import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface ProgressiveOnboardingProps {
  onComplete: () => void;
  eventType?: string;
}

export function ProgressiveOnboarding({ onComplete, eventType }: ProgressiveOnboardingProps) {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'first-timer' | 'experienced' | null>(null);
  const [needsLevel, setNeedsLevel] = useState<'quick' | 'detailed' | null>(null);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-8 max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {step} of {totalSteps}</span>
            <span className="text-sm text-emerald-400">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: User Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">
                Hey there! Welcome to VADA 👋
              </h2>
              <p className="text-slate-300 text-lg">
                First things first—is this your first time calculating carbon for an event?
              </p>
            </div>

            <div className="grid gap-4 mt-8">
              <button
                onClick={() => {
                  setUserType('first-timer');
                  setStep(2);
                }}
                className="p-6 bg-slate-900/50 hover:bg-slate-900/70 border-2 border-slate-700 hover:border-emerald-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🌱</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      Yes, I'm new to this!
                    </h3>
                    <p className="text-slate-400 text-sm">
                      No worries! We'll keep it simple and guide you through the basics.
                      You'll get a solid estimate without overwhelming details.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserType('experienced');
                  setStep(2);
                }}
                className="p-6 bg-slate-900/50 hover:bg-slate-900/70 border-2 border-slate-700 hover:border-violet-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      I've done this before
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Great! We'll give you the full toolkit with granular controls for accurate reporting.
                      Perfect for compliance, ESG reports, or optimization.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Needs Assessment */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">
                What's your goal today?
              </h2>
              <p className="text-slate-300 text-lg">
                This helps us show you the right level of detail.
              </p>
            </div>

            <div className="grid gap-4 mt-8">
              <button
                onClick={() => {
                  setNeedsLevel('quick');
                  setStep(3);
                }}
                className="p-6 bg-slate-900/50 hover:bg-slate-900/70 border-2 border-slate-700 hover:border-emerald-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⚡</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      Quick Estimate (5 minutes)
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Get a ballpark number fast. Great for initial planning, comparing options,
                      or seeing if sustainability is feasible for your budget.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Basic inputs</span>
                      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">±20% accuracy</span>
                      <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">5 min</span>
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setNeedsLevel('detailed');
                  setStep(3);
                }}
                className="p-6 bg-slate-900/50 hover:bg-slate-900/70 border-2 border-slate-700 hover:border-violet-500/50 rounded-lg transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                      Detailed Analysis (15 minutes)
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Accurate numbers for reporting, compliance, or optimization.
                      Break down staff/artist transport, meal categories, equipment scale—the works.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded">Granular inputs</span>
                      <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded">±5% accuracy</span>
                      <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded">15 min</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="mt-4 text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Let's Go! */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-emerald-500/20 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Perfect! You're all set.
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Sage Riverstone will be your guide throughout the calculation. She'll explain each field,
                provide tips, and help you make informed decisions. Let's get started!
              </p>

              {eventType && (
                <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-slate-400 mb-1">Starting with:</div>
                  <div className="text-xl font-semibold text-white">
                    {eventType === 'festival' && '🎪 Music Festival'}
                    {eventType === 'conference' && '💼 Corporate Conference'}
                    {eventType === 'wedding' && '💍 Wedding'}
                    {eventType === 'concert' && '🎸 Concert/Show'}
                  </div>
                </div>
              )}

              {userType === 'first-timer' && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-lg p-4 text-left">
                  <div className="text-sm font-semibold text-emerald-400 mb-2">💡 Pro Tip</div>
                  <p className="text-slate-300 text-sm">
                    Don't stress about having perfect numbers. Even rough estimates give you valuable insights.
                    You can always refine later as you get more data.
                  </p>
                </div>
              )}

              {userType === 'experienced' && (
                <div className="bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-violet-500/20 rounded-lg p-4 text-left">
                  <div className="text-sm font-semibold text-violet-400 mb-2">🎯 Nice!</div>
                  <p className="text-slate-300 text-sm">
                    Perfect! Sage will guide you through a comprehensive calculation with all the granular details.
                    You'll get detailed recommendations with vendor contacts at the end.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex-1 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                Let's Calculate!
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
