import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarbonResults } from '@/components/sage/carbon-results';
import { Calculator, Loader2 } from 'lucide-react';

interface EventFormData {
  eventType: string;
  attendance: number;
  durationDays: number;
  durationHours: number;
  venueType: string;
  isOutdoor: boolean;
  // Attendee Transportation
  attendeeTransportMode: string;
  attendeeTransportDistance: number;
  attendeeLocalPercentage: number;
  attendeeDomesticFlightPercentage: number;
  attendeeInternationalFlightPercentage: number;
  // Staff Transportation
  staffCount: number;
  staffTransportMode: string;
  staffTransportDistance: number;
  staffOvernightStays: number;
  // Artist/Performer Transportation
  artistCount: number;
  artistTransportMode: string;
  artistTransportDistance: number;
  artistTourBus: boolean;
  // Equipment Transportation
  equipmentTrucksRequired: number;
  equipmentTransportDistance: number;
  equipmentFreightFlights: number;
  // Power and Food
  powerSource: string;
  mealCount: number;
  localFood: boolean;
}

interface EventFormCalculatorProps {
  initialEventType?: string;
}

export function EventFormCalculator({ initialEventType }: EventFormCalculatorProps) {
  const [formData, setFormData] = useState<EventFormData>({
    eventType: initialEventType || '',
    attendance: 0,
    durationDays: 1,
    durationHours: 8,
    venueType: 'indoor',
    isOutdoor: false,
    // Attendee Transportation
    attendeeTransportMode: 'mixed',
    attendeeTransportDistance: 50,
    attendeeLocalPercentage: 60,
    attendeeDomesticFlightPercentage: 30,
    attendeeInternationalFlightPercentage: 10,
    // Staff Transportation
    staffCount: 0,
    staffTransportMode: 'driving',
    staffTransportDistance: 50,
    staffOvernightStays: 0,
    // Artist/Performer Transportation
    artistCount: 0,
    artistTransportMode: 'driving',
    artistTransportDistance: 200,
    artistTourBus: false,
    // Equipment Transportation
    equipmentTrucksRequired: 0,
    equipmentTransportDistance: 200,
    equipmentFreightFlights: 0,
    // Power and Food
    powerSource: 'grid',
    mealCount: 0,
    localFood: false,
  });

  const [calculation, setCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEmissions = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/calculate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: formData.eventType,
          attendance: formData.attendance,
          duration: {
            days: formData.durationDays || 1,
            hoursPerDay: formData.durationHours || 8,
          },
          venue: {
            type: formData.venueType,
            capacity: formData.attendance * 1.2,
            location: 'Unknown',
            isOutdoor: formData.isOutdoor,
            hasExistingPower: !formData.isOutdoor,
          },
          production: {
            numberOfStages: 1,
            stageSize: formData.attendance > 1000 ? 'large' : formData.attendance > 200 ? 'medium' : 'small',
            audioVisual: {
              soundSystemSize: formData.attendance > 1000 ? 'large' : 'medium',
              lightingRig: formData.attendance > 500 ? 'elaborate' : 'medium',
              videoScreens: formData.attendance > 500,
              livestreaming: false,
            },
            powerRequirements: {
              generatorPower: formData.powerSource === 'generator' || formData.powerSource === 'hybrid',
              generatorSize: formData.attendance > 1000 ? 'large' : 'medium',
              gridPowerUsage: formData.powerSource === 'grid' ? formData.attendance * formData.durationHours * 2 : undefined,
            },
          },
          staffing: {
            totalStaff: Math.ceil(formData.attendance / 50),
            onSiteStaff: Math.ceil(formData.attendance / 100),
            crewSize: Math.ceil(formData.attendance / 200),
          },
          transportation: {
            audienceTravel: {
              averageDistance: formData.attendeeTransportDistance,
              internationalAttendees: formData.attendeeTransportMode === 'mixed'
                ? Math.ceil(formData.attendance * (formData.attendeeInternationalFlightPercentage / 100))
                : formData.attendeeTransportMode === 'flying' ? Math.ceil(formData.attendance * 0.3) : 0,
              domesticFlights: formData.attendeeTransportMode === 'mixed'
                ? Math.ceil(formData.attendance * (formData.attendeeDomesticFlightPercentage / 100))
                : formData.attendeeTransportMode === 'flying' ? Math.ceil(formData.attendance * 0.7) : 0,
              localTransit: formData.attendeeTransportMode === 'mixed'
                ? Math.ceil(formData.attendance * (formData.attendeeLocalPercentage / 100))
                : formData.attendeeTransportMode === 'transit' || formData.attendeeTransportMode === 'walking'
                  ? formData.attendance : 0,
            },
            crewTransportation: {
              method: formData.staffTransportMode,
              estimatedDistance: formData.staffTransportDistance,
              numberOfVehicles: formData.staffCount > 0
                ? Math.ceil(formData.staffCount / (formData.staffTransportMode === 'carpool' ? 4 : 1))
                : Math.ceil(formData.attendance / 100),
              staffCount: formData.staffCount || Math.ceil(formData.attendance / 50),
              overnightStays: formData.staffOvernightStays,
            },
            artistTransportation: {
              artistCount: formData.artistCount,
              method: formData.artistTransportMode,
              distance: formData.artistTransportDistance,
              tourBus: formData.artistTourBus,
            },
            equipmentTransportation: {
              trucksRequired: formData.equipmentTrucksRequired || (formData.attendance > 500 ? 3 : 1),
              averageDistance: formData.equipmentTransportDistance,
              freightFlights: formData.equipmentFreightFlights,
            },
          },
          catering: {
            foodServiceType: 'buffet',
            expectedMealsServed: formData.mealCount || formData.attendance * formData.durationDays,
            isLocallySourced: formData.localFood,
            alcoholServed: formData.attendance > 100,
          },
          waste: {
            recyclingProgram: false,
            wasteReductionMeasures: [],
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCalculation(result);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">Event Carbon Calculator</h2>
        </div>

        <div className="space-y-6">
          {/* Event Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Event Type</Label>
            <Select value={formData.eventType} onValueChange={(value) => updateField('eventType', value)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="festival" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🎵 Music Festival</SelectItem>
                <SelectItem value="conference" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">💼 Corporate Conference</SelectItem>
                <SelectItem value="wedding" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">💍 Wedding</SelectItem>
                <SelectItem value="concert" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🎸 Concert/Show</SelectItem>
                <SelectItem value="sports_event" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">⚽ Sports Event</SelectItem>
                <SelectItem value="trade_show" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🏢 Trade Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendance */}
          <div className="space-y-2">
            <Label className="text-slate-300">Expected Attendance</Label>
            <Input
              type="number"
              value={formData.attendance || ''}
              onChange={(e) => updateField('attendance', parseInt(e.target.value) || 0)}
              placeholder="Number of attendees"
              className="bg-slate-900/50 border-slate-700 text-white"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Duration (Days)</Label>
              <Input
                type="number"
                value={formData.durationDays || ''}
                onChange={(e) => updateField('durationDays', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="1"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Hours per Day</Label>
              <Input
                type="number"
                value={formData.durationHours || ''}
                onChange={(e) => updateField('durationHours', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="8"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Venue Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Venue Type</Label>
            <Select value={formData.isOutdoor ? 'outdoor' : 'indoor'} onValueChange={(value) => {
              updateField('isOutdoor', value === 'outdoor');
              updateField('venueType', value);
            }}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="indoor" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🏛️ Indoor Venue</SelectItem>
                <SelectItem value="outdoor" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🌳 Outdoor Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendee/Guest Transportation */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-emerald-400">👥 Attendee Transportation</h3>

            <div className="space-y-2">
              <Label className="text-slate-300">Primary Mode</Label>
              <Select value={formData.attendeeTransportMode} onValueChange={(value) => updateField('attendeeTransportMode', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="mixed" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🔀 Mixed (Multiple Modes)</SelectItem>
                  <SelectItem value="flying" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">✈️ Flying</SelectItem>
                  <SelectItem value="driving" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚗 Driving</SelectItem>
                  <SelectItem value="transit" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚇 Public Transit</SelectItem>
                  <SelectItem value="walking" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚶 Walking/Local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.attendeeTransportMode === 'mixed' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">% Local/Transit</Label>
                  <Input
                    type="number"
                    value={formData.attendeeLocalPercentage || ''}
                    onChange={(e) => updateField('attendeeLocalPercentage', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="60"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">% Domestic Flight</Label>
                  <Input
                    type="number"
                    value={formData.attendeeDomesticFlightPercentage || ''}
                    onChange={(e) => updateField('attendeeDomesticFlightPercentage', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="30"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm">% International</Label>
                  <Input
                    type="number"
                    value={formData.attendeeInternationalFlightPercentage || ''}
                    onChange={(e) => updateField('attendeeInternationalFlightPercentage', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="10"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-slate-300">Average Distance (km)</Label>
              <Input
                type="number"
                value={formData.attendeeTransportDistance || ''}
                onChange={(e) => updateField('attendeeTransportDistance', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="50"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Staff Transportation */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-violet-400">👷 Staff Transportation</h3>

            <div className="space-y-2">
              <Label className="text-slate-300">Number of Staff</Label>
              <Input
                type="number"
                value={formData.staffCount || ''}
                onChange={(e) => updateField('staffCount', parseInt(e.target.value) || 0)}
                placeholder={`Suggested: ${Math.ceil(formData.attendance / 50)}`}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            {formData.staffCount > 0 && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Staff Transport Mode</Label>
                  <Select value={formData.staffTransportMode} onValueChange={(value) => updateField('staffTransportMode', value)}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="driving" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚗 Driving</SelectItem>
                      <SelectItem value="flying" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">✈️ Flying</SelectItem>
                      <SelectItem value="transit" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚇 Public Transit</SelectItem>
                      <SelectItem value="carpool" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚙 Carpool/Shuttle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Avg Distance (km)</Label>
                    <Input
                      type="number"
                      value={formData.staffTransportDistance || ''}
                      onChange={(e) => updateField('staffTransportDistance', e.target.value === '' ? 0 : parseInt(e.target.value))}
                      placeholder="50"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Overnight Stays</Label>
                    <Input
                      type="number"
                      value={formData.staffOvernightStays || ''}
                      onChange={(e) => updateField('staffOvernightStays', e.target.value === '' ? 0 : parseInt(e.target.value))}
                      placeholder="0"
                      className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Artist/Performer Transportation */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-amber-400">🎤 Artist/Performer Transportation</h3>

            <div className="space-y-2">
              <Label className="text-slate-300">Number of Artists/Performers</Label>
              <Input
                type="number"
                value={formData.artistCount || ''}
                onChange={(e) => updateField('artistCount', parseInt(e.target.value) || 0)}
                placeholder="0 if none"
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            {formData.artistCount > 0 && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Artist Transport Mode</Label>
                  <Select value={formData.artistTransportMode} onValueChange={(value) => updateField('artistTransportMode', value)}>
                    <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                      <SelectItem value="flying" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">✈️ Flying</SelectItem>
                      <SelectItem value="tour_bus" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚌 Tour Bus</SelectItem>
                      <SelectItem value="driving" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚗 Driving</SelectItem>
                      <SelectItem value="private_jet" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🛩️ Private Jet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Travel Distance (km)</Label>
                  <Input
                    type="number"
                    value={formData.artistTransportDistance || ''}
                    onChange={(e) => updateField('artistTransportDistance', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="200"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                {formData.artistTransportMode === 'tour_bus' && (
                  <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.artistTourBus}
                      onChange={(e) => updateField('artistTourBus', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label className="text-slate-300 text-sm">Overnight in tour bus (reduces hotel emissions)</Label>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Equipment Transportation */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-cyan-400">📦 Equipment Transportation</h3>

            <div className="space-y-2">
              <Label className="text-slate-300">Number of Trucks Required</Label>
              <Input
                type="number"
                value={formData.equipmentTrucksRequired || ''}
                onChange={(e) => updateField('equipmentTrucksRequired', parseInt(e.target.value) || 0)}
                placeholder={`Suggested: ${formData.attendance > 500 ? 3 : 1}`}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            {formData.equipmentTrucksRequired > 0 && (
              <>
                <div className="space-y-2">
                  <Label className="text-slate-300">Equipment Transport Distance (km)</Label>
                  <Input
                    type="number"
                    value={formData.equipmentTransportDistance || ''}
                    onChange={(e) => updateField('equipmentTransportDistance', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="200"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Freight Flights (if international)</Label>
                  <Input
                    type="number"
                    value={formData.equipmentFreightFlights || ''}
                    onChange={(e) => updateField('equipmentFreightFlights', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="0"
                    className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Power Source */}
          <div className="space-y-2">
            <Label className="text-slate-300">Power Source</Label>
            <Select value={formData.powerSource} onValueChange={(value) => updateField('powerSource', value)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="grid" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">⚡ Grid Power</SelectItem>
                <SelectItem value="generator" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">⛽ Generator</SelectItem>
                <SelectItem value="hybrid" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🔋 Hybrid</SelectItem>
                <SelectItem value="renewable" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">♻️ Renewable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Catering */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Meals Served</Label>
              <Input
                type="number"
                value={formData.mealCount || ''}
                onChange={(e) => updateField('mealCount', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder={`Default: ${formData.attendance * formData.durationDays}`}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Food Sourcing</Label>
              <Select value={formData.localFood ? 'local' : 'standard'} onValueChange={(value) => updateField('localFood', value === 'local')}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="local" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🌾 Local/Organic</SelectItem>
                  <SelectItem value="standard" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🍽️ Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculate Button */}
          <Button
            onClick={calculateEmissions}
            disabled={!formData.eventType || formData.attendance === 0 || isCalculating}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            size="lg"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Carbon Footprint
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Results */}
      {calculation && (
        <CarbonResults calculation={calculation} />
      )}
    </div>
  );
}
