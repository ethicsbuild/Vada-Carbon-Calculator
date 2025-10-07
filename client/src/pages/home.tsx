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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
            VADA CarbonCoPilot
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
              >
                Start Calculating
              </Button>
            </Link>
          </div>
        )}

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">🧭</div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Guided Journey</h3>
            <p className="text-slate-400 text-sm">
              Sage Riverstone walks you through every step with tips, examples, and real festival success stories
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">⛓️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Blockchain Verified</h3>
            <p className="text-slate-400 text-sm">
              Immutable records on Hedera for ESG reporting and third-party verification
            </p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">Gamified Journey</h3>
            <p className="text-slate-400 text-sm">
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
