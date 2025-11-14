import { Card } from '@/components/ui/card';
import { Car, Plane, TreePine, Zap, Home, Flame } from 'lucide-react';

interface HumanScaleComparisonsProps {
  totalEmissions: number; // in tons CO₂e
  perAttendee: number; // in tons CO₂e
  attendance?: number;
}

interface Comparison {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: string;
}

export function HumanScaleComparisons({ totalEmissions, perAttendee, attendance }: HumanScaleComparisonsProps) {
  // Calculate meaningful comparisons
  const comparisons: Comparison[] = [];

  // Car emissions (average car: 4.6 tons CO₂/year)
  const carsPerYear = totalEmissions / 4.6;
  comparisons.push({
    icon: <Car className="w-6 h-6" />,
    title: "Cars Driven for a Year",
    value: Math.round(carsPerYear).toLocaleString(),
    description: `Your event's footprint equals ${Math.round(carsPerYear)} cars running for an entire year`,
    color: "text-blue-400"
  });

  // Flights (roundtrip LA to NYC: ~1.2 tons CO₂ per person)
  const crossCountryFlights = totalEmissions / 1.2;
  comparisons.push({
    icon: <Plane className="w-6 h-6" />,
    title: "Cross-Country Flights",
    value: Math.round(crossCountryFlights).toLocaleString(),
    description: `Same as ${Math.round(crossCountryFlights)} roundtrip flights from LA to NYC`,
    color: "text-sky-400"
  });

  // Trees needed to offset (one tree absorbs ~0.06 tons CO₂/year)
  const treesNeeded = totalEmissions / 0.06;
  comparisons.push({
    icon: <TreePine className="w-6 h-6" />,
    title: "Trees Needed to Offset",
    value: Math.round(treesNeeded).toLocaleString(),
    description: `Would require ${Math.round(treesNeeded)} trees growing for one year to absorb this CO₂`,
    color: "text-emerald-400"
  });

  // Home electricity (average US home: 11.5 tons CO₂/year)
  const homesPerYear = totalEmissions / 11.5;
  comparisons.push({
    icon: <Home className="w-6 h-6" />,
    title: "Homes Powered for a Year",
    value: Math.round(homesPerYear).toLocaleString(),
    description: `Equals the annual electricity use of ${Math.round(homesPerYear)} average US homes`,
    color: "text-yellow-400"
  });

  // Gasoline burned (1 gallon gas = 0.0088 tons CO₂)
  const gallonsGasoline = totalEmissions / 0.0088;
  comparisons.push({
    icon: <Flame className="w-6 h-6" />,
    title: "Gallons of Gasoline",
    value: Math.round(gallonsGasoline).toLocaleString(),
    description: `Same emissions as burning ${Math.round(gallonsGasoline)} gallons of gasoline`,
    color: "text-orange-400"
  });

  // Smartphone charges (1 charge = ~0.000008 tons CO₂)
  const phoneCharges = totalEmissions / 0.000008;
  comparisons.push({
    icon: <Zap className="w-6 h-6" />,
    title: "Smartphone Charges",
    value: (phoneCharges / 1000000).toFixed(1) + "M",
    description: `Could charge a smartphone ${(phoneCharges / 1000000).toFixed(1)} million times`,
    color: "text-purple-400"
  });

  // Per attendee comparison
  const perAttendeeComparisons = [];

  // Miles driven per attendee
  const milesPerAttendee = (perAttendee / 0.000404); // EPA: 0.000404 tons CO₂/mile
  if (milesPerAttendee > 100) {
    perAttendeeComparisons.push({
      icon: <Car className="w-5 h-5" />,
      title: "Per Attendee",
      value: `${Math.round(milesPerAttendee)} miles`,
      description: `Each attendee's share = driving ${Math.round(milesPerAttendee)} miles (${Math.round(milesPerAttendee / 60)} hours at 60mph)`,
      color: "text-blue-400"
    });
  } else {
    // Show days of home electricity instead
    const daysElectricity = (perAttendee / (11.5 / 365));
    perAttendeeComparisons.push({
      icon: <Home className="w-5 h-5" />,
      title: "Per Attendee",
      value: `${Math.round(daysElectricity)} days`,
      description: `Each attendee's share = ${Math.round(daysElectricity)} days of home electricity`,
      color: "text-yellow-400"
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-2">What Does This Actually Mean?</h3>
        <p className="text-sage-600 dark:text-sage-400 text-sm">
          {totalEmissions.toFixed(1)} tons of CO₂ is hard to visualize. Here's what it equals in real-world terms:
        </p>
      </div>

      {/* Main Comparisons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisons.slice(0, 6).map((comp, index) => (
          <Card key={index} className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-4 hover:border-emerald-500/30 transition-all">
            <div className="flex items-start gap-3">
              <div className={comp.color}>
                {comp.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs text-sage-600 dark:text-sage-400 mb-1">{comp.title}</div>
                <div className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-1">{comp.value}</div>
                <div className="text-xs text-sage-600 dark:text-sage-400 leading-relaxed">{comp.description}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Per Attendee Highlight */}
      {perAttendeeComparisons.length > 0 && (
        <Card className="bg-gradient-to-br from-violet-500/20 to-emerald-500/20 border-violet-500/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={perAttendeeComparisons[0].color}>
                {perAttendeeComparisons[0].icon}
              </div>
              <div>
                <div className="text-sm text-violet-300 font-semibold mb-1">
                  {perAttendeeComparisons[0].title}
                </div>
                <div className="text-3xl font-bold text-forest-900 dark:text-forest-50 mb-1">
                  {perAttendeeComparisons[0].value}
                </div>
                <div className="text-sm text-sage-700 dark:text-sage-300">
                  {perAttendeeComparisons[0].description}
                </div>
              </div>
            </div>
            {attendance && (
              <div className="text-right">
                <div className="text-sm text-sage-600 dark:text-sage-400">Total Attendees</div>
                <div className="text-2xl font-bold text-forest-900 dark:text-forest-50">{attendance.toLocaleString()}</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Context Note */}
      <div className="bg-sage-50 dark:bg-forest-900/50 rounded-lg p-4 border border-forest-200 dark:border-forest-700/50">
        <p className="text-xs text-sage-600 dark:text-sage-400 leading-relaxed">
          <span className="font-semibold text-sage-700 dark:text-sage-300">Note:</span> These comparisons use EPA and DOE conversion factors.
          One tree absorbs ~60kg CO₂/year, average car emits 4.6 tons/year, average home uses 11,500 kWh/year.
          Your mileage (literally) may vary based on specific vehicle types, home sizes, and tree species.
        </p>
      </div>
    </div>
  );
}
