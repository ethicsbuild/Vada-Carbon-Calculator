import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play, BarChart3, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProgressState, CalculationStep } from '@/types/carbon';

interface ProgressTrackerProps {
  progress: ProgressState;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const steps = [
    {
      id: 'organization_setup' as CalculationStep,
      title: 'Organization Setup',
      description: 'Basic information and preferences',
      icon: Circle,
    },
    {
      id: 'scope1_calculation' as CalculationStep,
      title: 'Scope 1 Calculation',
      description: 'Direct emissions sources',
      icon: Play,
    },
    {
      id: 'scope2_calculation' as CalculationStep,
      title: 'Scope 2 Calculation',
      description: 'Energy indirect emissions',
      icon: Play,
    },
    {
      id: 'scope3_calculation' as CalculationStep,
      title: 'Scope 3 Calculation',
      description: 'Value chain emissions',
      icon: Play,
    },
    {
      id: 'report_generation' as CalculationStep,
      title: 'Generate Reports',
      description: 'Create compliance reports',
      icon: FileText,
    },
  ];

  const getStepStatus = (stepId: CalculationStep) => {
    if (progress.completedSteps.includes(stepId)) {
      return 'completed';
    } else if (progress.currentStep === stepId) {
      return 'current';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (step: typeof steps[0], status: string) => {
    if (status === 'completed') {
      return CheckCircle;
    }
    return step.icon;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
          Your Carbon Journey
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle 
                cx="64" 
                cy="64" 
                r="45" 
                stroke="#E5E7EB" 
                strokeWidth="8" 
                fill="none"
                className="dark:stroke-gray-600"
              />
              <circle 
                cx="64" 
                cy="64" 
                r="45" 
                stroke="#16A34A" 
                strokeWidth="8" 
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress.progress / 100)}
                className="transition-all duration-500 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(progress.progress)}%</div>
                <div className="text-sm text-gray-600 dark:text-sage-600 dark:text-sage-400">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const Icon = getStepIcon(step, status);

            return (
              <div key={step.id} className="flex items-start space-x-3">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                  status === 'completed' && "bg-green-600",
                  status === 'current' && "bg-green-600",
                  status === 'pending' && "bg-gray-300 dark:bg-gray-600"
                )}>
                  <Icon className={cn(
                    "w-4 h-4",
                    status === 'completed' && "text-forest-900 dark:text-forest-50",
                    status === 'current' && "text-forest-900 dark:text-forest-50",
                    status === 'pending' && "text-gray-600 dark:text-sage-600 dark:text-sage-400"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm",
                    status === 'completed' && "text-gray-900 dark:text-forest-900 dark:text-forest-50",
                    status === 'current' && "text-green-600 dark:text-green-400",
                    status === 'pending' && "text-gray-600 dark:text-sage-600 dark:text-sage-400"
                  )}>
                    {step.title}
                    {status === 'current' && (
                      <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-sage-600 dark:text-sage-400 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Step Indicator */}
        {progress.currentStep && progress.currentStep !== 'completed' && (
          <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Currently working on: {steps.find(s => s.id === progress.currentStep)?.title}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
