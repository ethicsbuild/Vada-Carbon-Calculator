import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ProgressiveOnboarding } from '@/components/calculator/progressive-onboarding';
import { SageGuidedCalculator } from '@/components/calculator/sage-guided-calculator';

export default function Calculator() {
  const [location] = useLocation();
  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Extract event type from URL parameter
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      setEventType(type);
      console.log('📍 Event type from URL:', type);
    }
    // Check if user has completed onboarding before
    const hasCompletedOnboarding = localStorage.getItem('vada_onboarding_complete');
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    }
  }, [location]);

  // Scroll to top when transitioning from onboarding to calculator
  useEffect(() => {
    if (!showOnboarding) {
      window.scrollTo(0, 0);
    }
  }, [showOnboarding]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('vada_onboarding_complete', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Show Onboarding First */}
        {showOnboarding ? (
          <ProgressiveOnboarding
            onComplete={handleOnboardingComplete}
            eventType={eventType}
          />
        ) : (
          <SageGuidedCalculator initialEventType={eventType} />
        )}
      </div>
    </div>
  );
}
