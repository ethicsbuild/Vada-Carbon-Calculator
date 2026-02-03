import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventTypeCard } from '@/components/calculator/event-type-card';
import { LeaderboardWidget } from '@/components/gamification/leaderboard-widget';
import { CaseStudies } from '@/components/homepage/case-studies';

const eventTypes = [
  {
    icon: '🎪',
    title: 'Music Festival',
    description: 'Multi-day outdoor gathering with camping, stages, and vendors',
    avgEmissions: 0.041,
    type: 'festival'
  },
  {
    icon: '💼',
    title: 'Corporate Conference',
    description: 'Professional gathering with presentations and networking',
    avgEmissions: 0.38,
    type: 'conference'
  },
  {
    icon: '💍',
    title: 'Wedding',
    description: 'Celebration with catering, venue, and guest travel',
    avgEmissions: 0.15,
    type: 'wedding'
  },
  {
    icon: '🎸',
    title: 'Concert/Show',
    description: 'Single venue performance with artist and audience',
    avgEmissions: 0.025,
    type: 'concert'
  }
];

export default function Home() {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-sage-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-forest-600 via-sage-600 to-moss-600 dark:from-forest-400 dark:via-sage-400 dark:to-moss-400 bg-clip-text text-transparent">
            VEDA CarbonCoPilot
          </h1>
          <p className="text-lg text-sage-700 dark:text-sage-400 max-w-2xl mx-auto">
            Your AI sustainability guide for events—powered by Sage Riverstone
          </p>
        </div>

        {/* Quick Start Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {eventTypes.map((event) => (
            <EventTypeCard
              key={event.type}
              {...event}
              isSelected={selectedEventType === event.type}
              onSelect={() => setSelectedEventType(event.type)}
            />
          ))}
        </div>

        {/* CTA Button */}
        {selectedEventType && (
          <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Link href={`/calculator?type=${selectedEventType}`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-forest-600 to-sage-600 hover:from-forest-700 hover:to-sage-700 text-forest-900 dark:text-forest-50 shadow-lg shadow-forest-500/25 rounded-xl"
              >
                Start Calculating
              </Button>
            </Link>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="bg-forest-50/80 dark:bg-forest-900/50 border-forest-200/50 dark:border-forest-700/50 nature-card p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">🧭</div>
            <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-200 mb-2">AI-Guided Journey</h3>
            <p className="text-sage-700 dark:text-sage-400 text-sm">
              Sage Riverstone walks you through every step with tips, examples, and real festival success stories
            </p>
          </Card>

          <Card className="bg-forest-50/80 dark:bg-forest-900/50 border-forest-200/50 dark:border-forest-700/50 nature-card p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-200 mb-2">Blockchain Verified</h3>
            <p className="text-sage-700 dark:text-sage-400 text-sm">
              Immutable records on Hedera for ESG reporting and third-party verification
            </p>
          </Card>

          <Card className="bg-forest-50/80 dark:bg-forest-900/50 border-forest-200/50 dark:border-forest-700/50 nature-card p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-semibold text-forest-800 dark:text-forest-200 mb-2">Gamified Journey</h3>
            <p className="text-sage-700 dark:text-sage-400 text-sm">
              Unlock achievements, compare with peers, and celebrate sustainability wins
            </p>
          </Card>
        </div>

        {/* Case Studies Section */}
        <CaseStudies />
      </div>

      {/* Leaderboard Widget - Fixed position */}
      <LeaderboardWidget />
    </div>
  );
}
