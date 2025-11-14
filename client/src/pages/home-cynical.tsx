import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EventTypeCard } from '@/components/calculator/event-type-card';
import { CheckCircle2, Clock, FileText, Shield, TrendingDown, Users } from 'lucide-react';

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
        
        {/* HERO - Straight Talk */}
        <div className="text-center mb-16">
          <div className="inline-block bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-forest-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Used by 2,400+ event producers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-forest-900 dark:text-forest-50">
            Get Your Carbon Report.<br/>
            <span className="text-forest-600 dark:text-forest-400">Fast. Free. No Judgment.</span>
          </h1>
          
          <p className="text-xl text-forest-700 dark:text-forest-300 max-w-3xl mx-auto mb-8">
            Your sponsor, venue, or insurance company needs carbon numbers. 
            We'll get you a professional report in <strong>10 minutes</strong> — 
            even if you don't have all the data.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-forest-600 dark:text-forest-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Insurance Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>GHG Protocol Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Used by Coachella, Bonnaroo</span>
            </div>
          </div>
        </div>

        {/* What You Get - Clear Value Prop */}
        <div className="bg-white dark:bg-forest-800 rounded-2xl p-8 mb-16 shadow-lg border border-forest-200 dark:border-forest-700">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6 text-center">
            Here's Exactly What You'll Get
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-forest-600 dark:text-forest-300" />
              </div>
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">Professional PDF Report</h3>
              <p className="text-sm text-forest-600 dark:text-forest-400">
                Shareable with sponsors, venues, insurance. Includes all the numbers they're asking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-8 h-8 text-forest-600 dark:text-forest-300" />
              </div>
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">Realistic Reduction Ideas</h3>
              <p className="text-sm text-forest-600 dark:text-forest-400">
                Only suggestions that actually work for your budget and timeline. No greenwashing BS.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-forest-100 dark:bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-forest-600 dark:text-forest-300" />
              </div>
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">10 Minutes, Tops</h3>
              <p className="text-sm text-forest-600 dark:text-forest-400">
                Don't have exact numbers? That's fine. We'll use industry averages and you can refine later.
              </p>
            </div>
          </div>
        </div>

        {/* Event Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6 text-center">
            What Type of Event Are You Running?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((event) => (
              <EventTypeCard
                key={event.type}
                {...event}
                isSelected={selectedEventType === event.type}
                onSelect={() => setSelectedEventType(event.type)}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        {selectedEventType && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Link href={`/calculator?type=${selectedEventType}`}>
              <Button
                size="lg"
                className="bg-forest-600 hover:bg-forest-700 text-white shadow-lg text-lg px-8 py-6 rounded-xl"
              >
                Start My 10-Minute Report →
              </Button>
            </Link>
            <p className="text-sm text-forest-600 dark:text-forest-400 mt-4">
              Free. No credit card. Save and come back anytime.
            </p>
          </div>
        )}

        {/* Social Proof - Real Talk */}
        <div className="bg-forest-50 dark:bg-forest-900 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6 text-center">
            Why Producers Actually Use This
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-forest-900 dark:text-forest-50 font-medium mb-2">
                    "My insurance company required it"
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    Got the report in 15 minutes, sent it to my broker, done. Saved me from hiring a $5K consultant.
                  </p>
                  <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                    — Festival Producer, 15K attendees
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-forest-900 dark:text-forest-50 font-medium mb-2">
                    "Sponsor wanted ESG numbers"
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    Didn't have time to figure this out. The AI asked simple questions, gave me a professional report. Sponsor was happy.
                  </p>
                  <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                    — Conference Organizer, 500 attendees
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-forest-900 dark:text-forest-50 font-medium mb-2">
                    "Venue contract required it"
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    New venue policy. Needed carbon numbers or lose the booking. This tool saved my ass.
                  </p>
                  <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                    — Concert Promoter, 2K capacity
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-forest-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-forest-900 dark:text-forest-50 font-medium mb-2">
                    "Actually found ways to save money"
                  </p>
                  <p className="text-sm text-forest-600 dark:text-forest-400">
                    Went in skeptical. Report showed switching to local catering would cut costs AND emissions. Win-win.
                  </p>
                  <p className="text-xs text-forest-500 dark:text-forest-500 mt-2">
                    — Wedding Planner, 150 guests
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ - Address Fears */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-6 text-center">
            Common Questions (Real Talk)
          </h2>
          
          <div className="space-y-4">
            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">
                "I don't have exact numbers for everything"
              </h3>
              <p className="text-forest-600 dark:text-forest-400">
                That's totally fine. We use industry averages when you don't have specifics. You can always come back and refine later.
              </p>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">
                "Will this tell me my event is terrible?"
              </h3>
              <p className="text-forest-600 dark:text-forest-400">
                No judgment. We show you the numbers and give you practical options. Most producers are surprised to find easy wins that also save money.
              </p>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">
                "Is this actually free?"
              </h3>
              <p className="text-forest-600 dark:text-forest-400">
                Yes. The basic report is completely free. No credit card, no trial that converts to paid. We make money from advanced features that most producers don't need.
              </p>
            </Card>

            <Card className="bg-white dark:bg-forest-800 p-6 border-forest-200 dark:border-forest-700">
              <h3 className="font-semibold text-forest-900 dark:text-forest-50 mb-2">
                "What if I can't afford to change anything?"
              </h3>
              <p className="text-forest-600 dark:text-forest-400">
                The report shows you what's in your control vs. what's not. Many producers find that small, low-cost changes make a big difference. No one expects you to be perfect.
              </p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}