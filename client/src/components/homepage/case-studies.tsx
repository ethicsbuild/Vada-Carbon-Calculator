import { Card } from '@/components/ui/card';
import { TrendingDown, TrendingUp, Award, Users, AlertTriangle } from 'lucide-react';

const caseStudies = [
  {
    festival: "Symbiosis Gathering",
    type: "Festival",
    year: "2019",
    location: "California",
    icon: "🌞",
    attendees: "10,000",
    outcome: "success",
    challenge: "100% diesel generators costing $60k, massive carbon footprint",
    solution: "Switched to 90% solar panels + battery banks, 10% biodiesel backup",
    results: [
      { metric: "Carbon Reduction", value: "78%", icon: TrendingDown },
      { metric: "Cost Savings", value: "$50k/year", icon: Award },
      { metric: "Attendee Satisfaction", value: "+35%", icon: Users }
    ],
    quote: "Going solar wasn't just about carbon—our community LOVED the quiet mornings without generator noise. It became part of our identity.",
    author: "Jason Sweeney, Production Director"
  },
  {
    festival: "Tech Summit 2022",
    type: "Conference",
    year: "2022",
    location: "Austin, TX",
    icon: "💼",
    attendees: "5,000",
    outcome: "failure",
    challenge: "Promised carbon-neutral conference with compostable serviceware and local catering",
    solution: "Bought compostable cups/plates but venue had no composting infrastructure—everything went to landfill",
    results: [
      { metric: "Carbon Increase", value: "+12%", icon: TrendingUp },
      { metric: "Wasted Investment", value: "$18k", icon: AlertTriangle },
      { metric: "Attendee Trust", value: "Damaged", icon: AlertTriangle }
    ],
    quote: "We learned the hard way: compostables mean nothing without composting. Now we verify infrastructure BEFORE buying serviceware. Lesson learned.",
    author: "Rachel Kim, Event Director"
  },
  {
    festival: "Bonnaroo Music Festival",
    type: "Festival",
    year: "2017-Present",
    location: "Tennessee",
    icon: "🌾",
    attendees: "80,000",
    outcome: "success",
    challenge: "Food from national distributors trucked in from hundreds of miles away",
    solution: "'Farm to Festival' program requiring vendors to source 50%+ from local farms",
    results: [
      { metric: "Food Miles Reduced", value: "62%", icon: TrendingDown },
      { metric: "Local Economy Impact", value: "$2.3M", icon: Award },
      { metric: "Food Quality Rating", value: "+28%", icon: Users }
    ],
    quote: "Attendees didn't just taste the difference—they felt connected to the region. Local farms became part of our story.",
    author: "Dave Ewers, Sustainability Team"
  },
  {
    festival: "Sarah & Michael's Wedding",
    type: "Wedding",
    year: "2023",
    location: "Vermont",
    icon: "💍",
    attendees: "150",
    outcome: "success",
    challenge: "Guests flying in from 12 different states, huge transportation footprint",
    solution: "Chose venue walking distance from hotel, arranged shuttle service, sent carpool matching list 2 months early",
    results: [
      { metric: "Solo Drivers", value: "-68%", icon: TrendingDown },
      { metric: "Guest Connections", value: "Amazing", icon: Award },
      { metric: "Carbon per Guest", value: "-41%", icon: TrendingDown }
    ],
    quote: "Our carpool matching turned strangers into friends. Three couples who shared rides are now close friends. Sustainability brought our community together.",
    author: "Sarah Martinez, Bride"
  },
  {
    festival: "Lightning in a Bottle",
    type: "Festival",
    year: "2018",
    location: "California",
    icon: "🚌",
    attendees: "20,000",
    outcome: "success",
    challenge: "Attendees driving individually from SF/LA, massive parking and emissions",
    solution: "Partnered with charter bus companies, offered ticket discounts for bus riders",
    results: [
      { metric: "Vehicle Reduction", value: "35%", icon: TrendingDown },
      { metric: "Parking Space Saved", value: "1,200 spots", icon: Award },
      { metric: "Community Building", value: "Priceless", icon: Users }
    ],
    quote: "The bus charters created pre-festival bonding. People met their camp neighbors on the ride up. It solved logistics AND built community.",
    author: "Dede Flemming, Sustainability Coordinator"
  },
  {
    festival: "Corporate Annual Meeting",
    type: "Corporate Event",
    year: "2021",
    location: "Chicago",
    icon: "🏢",
    attendees: "800",
    outcome: "mixed",
    challenge: "International team flying to HQ for 3-day annual meeting, 400+ flights",
    solution: "Made it hybrid—half virtual, half in-person. Flew only senior leadership and regional reps.",
    results: [
      { metric: "Flights Reduced", value: "71%", icon: TrendingDown },
      { metric: "Engagement Drop", value: "-23%", icon: AlertTriangle },
      { metric: "Cost Savings", value: "$340k", icon: Award }
    ],
    quote: "Carbon wins, engagement loss. Next year we're doing regional hubs with virtual connections instead of pure hybrid. Finding the right balance takes iteration.",
    author: "Marcus Johnson, Chief Sustainability Officer"
  }
];

export function CaseStudies() {
  return (
    <div className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forest-900 dark:text-forest-50 mb-4">
            Real Events. Real Results.
          </h2>
          <p className="text-lg text-sage-600 dark:text-sage-400 max-w-2xl mx-auto">
            These aren't hypotheticals—they're real stories from event producers who tried, succeeded,
            and sometimes failed. Learn from both the wins and the mistakes.
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <Card key={index} className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{study.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-1">{study.festival}</h3>
                      <div className="flex items-center gap-3 text-sm text-sage-600 dark:text-sage-400">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          study.outcome === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                          study.outcome === 'failure' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {study.type}
                        </span>
                        <span>{study.location}</span>
                        <span>•</span>
                        <span>{study.year}</span>
                        <span>•</span>
                        <span>{study.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-sage-50 dark:bg-forest-900/50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-red-400 mb-2">🚨 THE CHALLENGE</div>
                    <p className="text-sage-700 dark:text-sage-300 text-sm">{study.challenge}</p>
                  </div>
                  <div className="bg-sage-50 dark:bg-forest-900/50 rounded-lg p-4">
                    <div className={`text-xs font-semibold mb-2 ${
                      study.outcome === 'success' ? 'text-emerald-400' :
                      study.outcome === 'failure' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {study.outcome === 'success' ? '💡 THE SOLUTION' :
                       study.outcome === 'failure' ? '⚠️ WHAT HAPPENED' :
                       '🔄 WHAT THEY TRIED'}
                    </div>
                    <p className="text-sage-700 dark:text-sage-300 text-sm">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {study.results.map((result, i) => {
                    const Icon = result.icon;
                    const isNegative = result.icon === TrendingUp || result.icon === AlertTriangle;
                    return (
                      <div key={i} className={`bg-gradient-to-br ${
                        isNegative
                          ? 'from-red-500/10 to-orange-500/10 border-red-500/20'
                          : 'from-emerald-500/10 to-violet-500/10 border-emerald-500/20'
                      } border rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${isNegative ? 'text-orange-400' : 'text-emerald-400'}`} />
                          <div className="text-xs font-semibold text-sage-600 dark:text-sage-400">{result.metric}</div>
                        </div>
                        <div className={`text-2xl font-bold ${isNegative ? 'text-orange-300' : 'text-forest-900 dark:text-forest-50'}`}>
                          {result.value}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quote */}
                <div className={`border-l-4 pl-4 py-2 bg-sage-50 dark:bg-forest-900/30 rounded-r-lg ${
                  study.outcome === 'success' ? 'border-emerald-500/50' :
                  study.outcome === 'failure' ? 'border-orange-500/50' :
                  'border-yellow-500/50'
                }`}>
                  <p className="text-sage-700 dark:text-sage-300 italic mb-2">"{study.quote}"</p>
                  <p className="text-sm text-slate-500">— {study.author}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border-emerald-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Your Event Could Be Next
          </h3>
          <p className="text-slate-800 mb-6 max-w-2xl mx-auto">
            Whether you're planning a festival, conference, wedding, or corporate event—these producers
            started exactly where you are. They calculated, tried things, learned from mistakes, and improved. You can too.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/calculator">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-forest-900 dark:text-forest-50 font-semibold rounded-lg transition-all">
                Calculate Your Footprint
              </button>
            </a>
            <a href="/resources">
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-forest-900 dark:text-forest-50 font-semibold rounded-lg transition-all">
                Read More Case Studies
              </button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
