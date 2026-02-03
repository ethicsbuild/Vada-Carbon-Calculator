import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { TrendingDown, TrendingUp, Calendar, MapPin, Users, ChevronRight, ArrowLeft } from 'lucide-react';

interface SavedEvent {
  id: number;
  eventName: string;
  eventType: string;
  eventYear: number;
  eventDate: string | null;
  attendance: number;
  location: string | null;
  totalEmissions: string;
  emissionsPerAttendee: string;
  performance: string;
  emissionsChange: string | null;
  createdAt: string;
}

export default function History() {
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // TODO: Get actual userId from auth context (for now using mock)
      const userId = 1;

      const response = await fetch(`/api/events/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'good': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'average': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'needs improvement': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'poor': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-sage-600 dark:text-sage-400 border-slate-500/30';
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

  // Group events by name for easy identification
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.eventName]) {
      acc[event.eventName] = [];
    }
    acc[event.eventName].push(event);
    return acc;
  }, {} as Record<string, SavedEvent[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950 flex items-center justify-center">
        <div className="text-forest-900 dark:text-forest-50">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-forest-50 to-moss-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-sage-600 dark:text-sage-400 hover:text-forest-900 dark:hover:text-forest-50 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-forest-900 dark:text-forest-50 mb-4">
            Your Event History
          </h1>
          <p className="text-lg text-sage-600 dark:text-sage-400 max-w-2xl">
            Track your progress over time and see how your events are improving.
          </p>
        </div>

        {error && (
          <Card className="bg-red-500/10 border-red-500/20 p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </Card>
        )}

        {events.length === 0 ? (
          <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-2">No Events Yet</h2>
            <p className="text-sage-600 dark:text-sage-400 mb-6">
              Calculate your first event's carbon footprint to start tracking your progress.
            </p>
            <Link href="/calculator">
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-forest-900 dark:text-forest-50">
                Calculate Your First Event
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Show events grouped by name */}
            {Object.entries(groupedEvents).map(([eventName, eventGroup]) => (
              <div key={eventName}>
                <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-50 mb-4 flex items-center gap-2">
                  <span>{getEventIcon(eventGroup[0].eventType)}</span>
                  {eventName}
                  {eventGroup.length > 1 && (
                    <span className="text-sm text-sage-600 dark:text-sage-400 font-normal">
                      ({eventGroup.length} years tracked)
                    </span>
                  )}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventGroup.map((event) => {
                    const emissionsChange = event.emissionsChange ? parseFloat(event.emissionsChange) : null;
                    const isImprovement = emissionsChange !== null && emissionsChange < 0;

                    return (
                      <Link key={event.id} href={`/event/${event.id}`}>
                        <Card className="bg-forest-50 dark:bg-forest-800/50 border-forest-200 dark:border-forest-700/50 backdrop-blur-sm hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                          <div className="p-6 space-y-4">
                            {/* Year and Performance */}
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="text-3xl font-bold text-forest-900 dark:text-forest-50">{event.eventYear}</div>
                                <div className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold mt-2 capitalize ${getPerformanceColor(event.performance)}`}>
                                  {event.performance}
                                </div>
                              </div>
                              {emissionsChange !== null && (
                                <div className={`flex items-center gap-1 text-sm font-medium ${isImprovement ? 'text-emerald-400' : 'text-orange-400'}`}>
                                  {isImprovement ? (
                                    <TrendingDown className="w-4 h-4" />
                                  ) : (
                                    <TrendingUp className="w-4 h-4" />
                                  )}
                                  {Math.abs(emissionsChange).toFixed(1)}%
                                </div>
                              )}
                            </div>

                            {/* Emissions */}
                            <div>
                              <div className="text-sm text-sage-600 dark:text-sage-400 mb-1">Total Emissions</div>
                              <div className="text-2xl font-bold text-forest-900 dark:text-forest-50">
                                {parseFloat(event.totalEmissions).toFixed(2)} <span className="text-sm text-sage-600 dark:text-sage-400">tCO₂e</span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {parseFloat(event.emissionsPerAttendee).toFixed(4)} per attendee
                              </div>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-2 text-sm text-sage-600 dark:text-sage-400">
                              {event.eventDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(event.eventDate).toLocaleDateString()}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {event.attendance.toLocaleString()} attendees
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                              )}
                            </div>

                            {/* View Details Link */}
                            <div className="pt-2 border-t border-forest-200 dark:border-forest-700/50">
                              <div className="flex items-center justify-between text-sm text-emerald-400 hover:text-emerald-300">
                                <span>View Details</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
