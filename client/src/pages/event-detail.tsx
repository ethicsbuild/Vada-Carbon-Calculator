import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingDown, TrendingUp, Calendar, MapPin, Users, Award } from 'lucide-react';

interface SavedEvent {
  id: number;
  eventName: string;
  eventType: string;
  eventYear: number;
  eventDate: string | null;
  attendance: number;
  location: string | null;
  totalEmissions: string;
  transportationEmissions: string;
  energyEmissions: string;
  cateringEmissions: string;
  wasteEmissions: string;
  productionEmissions: string;
  venueEmissions: string;
  emissionsPerAttendee: string;
  industryAverage: string;
  percentile: number;
  performance: string;
  notes: string | null;
  emissionsChange: string | null;
  createdAt: string;
}

interface ComparisonData {
  currentEvent: SavedEvent;
  previousEvent: SavedEvent | null;
  historicalTrend: Array<{
    year: number;
    totalEmissions: string;
    emissionsPerAttendee: string;
    performance: string;
  }>;
}

export default function EventDetail() {
  const [, params] = useRoute('/event/:id');
  const eventId = params?.id;

  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchComparison(parseInt(eventId));
    }
  }, [eventId]);

  const fetchComparison = async (id: number) => {
    try {
      const response = await fetch(`/api/events/comparison/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event comparison');
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (err) {
      console.error('Failed to fetch comparison:', err);
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-green-400';
      case 'average': return 'text-yellow-400';
      case 'needs improvement': return 'text-orange-400';
      case 'poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'festival': return '🎪';
      case 'conference': return '💼';
      case 'wedding': return '💍';
      case 'concert': return '🎸';
      default: return '🎉';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading event details...</div>
      </div>
    );
  }

  if (error || !comparisonData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
          <p className="text-red-400">{error || 'Event not found'}</p>
          <Link href="/history">
            <Button className="mt-4">Back to History</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { currentEvent, previousEvent, historicalTrend } = comparisonData;
  const emissionsChange = currentEvent.emissionsChange ? parseFloat(currentEvent.emissionsChange) : null;
  const isImprovement = emissionsChange !== null && emissionsChange < 0;

  // Calculate breakdown percentages
  const total = parseFloat(currentEvent.totalEmissions);
  const breakdownData = [
    { label: 'Transportation', value: parseFloat(currentEvent.transportationEmissions), color: 'bg-blue-500' },
    { label: 'Energy', value: parseFloat(currentEvent.energyEmissions), color: 'bg-yellow-500' },
    { label: 'Catering', value: parseFloat(currentEvent.cateringEmissions), color: 'bg-green-500' },
    { label: 'Production', value: parseFloat(currentEvent.productionEmissions), color: 'bg-purple-500' },
    { label: 'Venue', value: parseFloat(currentEvent.venueEmissions), color: 'bg-orange-500' },
    { label: 'Waste', value: parseFloat(currentEvent.wasteEmissions), color: 'bg-red-500' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/history">
            <Button variant="ghost" className="text-slate-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{getEventIcon(currentEvent.eventType)}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{currentEvent.eventName}</h1>
              <p className="text-xl text-slate-400">{currentEvent.eventYear}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Emissions Card */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg text-slate-400 mb-2">Total Carbon Footprint</h2>
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                    {total.toFixed(2)} tCO₂e
                  </div>
                  <p className="text-slate-400 mt-2">
                    {parseFloat(currentEvent.emissionsPerAttendee).toFixed(4)} tCO₂e per attendee
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${getPerformanceColor(currentEvent.performance)}`}>
                  <Award className="w-6 h-6 mb-1" />
                  <div className="text-xs font-semibold capitalize">{currentEvent.performance}</div>
                </div>
              </div>

              {emissionsChange !== null && previousEvent && (
                <div className={`bg-${isImprovement ? 'emerald' : 'orange'}-500/10 border border-${isImprovement ? 'emerald' : 'orange'}-500/20 rounded-lg p-4`}>
                  <div className="flex items-center gap-2">
                    {isImprovement ? (
                      <>
                        <TrendingDown className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">
                          {Math.abs(emissionsChange).toFixed(1)}% reduction from {previousEvent.eventYear}
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-400 font-medium">
                          {Math.abs(emissionsChange).toFixed(1)}% increase from {previousEvent.eventYear}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    Previous year: {parseFloat(previousEvent.totalEmissions).toFixed(2)} tCO₂e
                  </p>
                </div>
              )}
            </Card>

            {/* Emissions Breakdown */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Emissions Breakdown</h3>
              <div className="space-y-4">
                {breakdownData.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-medium">
                          {item.value.toFixed(3)} tCO₂e ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Historical Trend */}
            {historicalTrend.length > 1 && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold text-white mb-4">Historical Trend</h3>
                <div className="space-y-3">
                  {historicalTrend.sort((a, b) => b.year - a.year).map((event, index) => {
                    const isCurrent = event.year === currentEvent.eventYear;
                    return (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isCurrent ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-900/50'}`}>
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-white">{event.year}</div>
                          {isCurrent && <span className="text-xs text-emerald-400 font-semibold">Current</span>}
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{parseFloat(event.totalEmissions).toFixed(2)} tCO₂e</div>
                          <div className={`text-xs capitalize ${getPerformanceColor(event.performance)}`}>
                            {event.performance}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Notes */}
            {currentEvent.notes && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold text-white mb-3">Notes</h3>
                <p className="text-slate-300 whitespace-pre-wrap">{currentEvent.notes}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">Event Details</h3>
              <div className="space-y-3 text-sm">
                {currentEvent.eventDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-slate-400">Date</div>
                      <div className="text-white">{new Date(currentEvent.eventDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-slate-400">Attendance</div>
                    <div className="text-white">{currentEvent.attendance.toLocaleString()} attendees</div>
                  </div>
                </div>
                {currentEvent.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-slate-400">Location</div>
                      <div className="text-white">{currentEvent.location}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Benchmarking */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">Industry Comparison</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Your Performance</div>
                  <div className="text-2xl font-bold text-white">
                    {parseFloat(currentEvent.emissionsPerAttendee).toFixed(4)}
                  </div>
                  <div className="text-xs text-slate-500">tCO₂e per attendee</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Industry Average</div>
                  <div className="text-xl font-medium text-slate-300">
                    {parseFloat(currentEvent.industryAverage).toFixed(4)}
                  </div>
                  <div className="text-xs text-slate-500">tCO₂e per attendee</div>
                </div>
                {currentEvent.percentile && (
                  <div className="pt-3 border-t border-slate-700">
                    <div className="text-sm text-slate-400 mb-1">Percentile Rank</div>
                    <div className="text-xl font-bold text-emerald-400">
                      Top {currentEvent.percentile}%
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
