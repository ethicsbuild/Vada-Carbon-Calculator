import { Card } from '@/components/ui/card';
import { TrendingDown, Award, Users } from 'lucide-react';

const caseStudies = [
  {
    festival: "Symbiosis Gathering",
    year: "2019",
    location: "California",
    icon: "🌞",
    attendees: "10,000",
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
    festival: "Lightning in a Bottle",
    year: "2018",
    location: "California",
    icon: "🚌",
    attendees: "20,000",
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
    festival: "Bonnaroo Music Festival",
    year: "2017-Present",
    location: "Tennessee",
    icon: "🌾",
    attendees: "80,000",
    challenge: "Food from national distributors trucked in from hundreds of miles away",
    solution: "'Farm to Festival' program requiring vendors to source 50%+ from local farms",
    results: [
      { metric: "Food Miles Reduced", value: "62%", icon: TrendingDown },
      { metric: "Local Economy Impact", value: "$2.3M", icon: Award },
      { metric: "Food Quality Rating", value: "+28%", icon: Users }
    ],
    quote: "Attendees didn't just taste the difference—they felt connected to the region. Local farms became part of our story.",
    author: "Dave Ewers, Sustainability Team"
  }
];

export function CaseStudies() {
  return (
    <div className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Real Festivals. Real Results.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            These aren't hypotheticals—they're proven strategies from festivals that succeeded.
            Learn from their wins (and mistakes).
          </p>
        </div>

        {/* Case Studies */}
        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{study.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{study.festival}</h3>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
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
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-red-400 mb-2">🚨 THE CHALLENGE</div>
                    <p className="text-slate-300 text-sm">{study.challenge}</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <div className="text-xs font-semibold text-emerald-400 mb-2">💡 THE SOLUTION</div>
                    <p className="text-slate-300 text-sm">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {study.results.map((result, i) => {
                    const Icon = result.icon;
                    return (
                      <div key={i} className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-emerald-400" />
                          <div className="text-xs font-semibold text-slate-400">{result.metric}</div>
                        </div>
                        <div className="text-2xl font-bold text-white">{result.value}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Quote */}
                <div className="border-l-4 border-emerald-500/50 pl-4 py-2 bg-slate-900/30 rounded-r-lg">
                  <p className="text-slate-300 italic mb-2">"{study.quote}"</p>
                  <p className="text-sm text-slate-500">— {study.author}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border-emerald-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Your Festival Could Be Next
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            These festivals started exactly where you are now. They calculated their footprint,
            picked 2-3 high-impact actions, and made it happen. You can too.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/calculator">
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all">
                Calculate Your Footprint
              </button>
            </a>
            <a href="/resources">
              <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all">
                Read More Case Studies
              </button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
