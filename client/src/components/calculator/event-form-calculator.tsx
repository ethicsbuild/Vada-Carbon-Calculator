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
  transportMode: string;
  transportDistance: number;
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
    transportMode: 'driving',
    transportDistance: 50,
    powerSource: 'grid',
    mealCount: 0,
    localFood: false,
  });

  const [calculation, setCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-calculate when form data changes
  useEffect(() => {
    if (formData.attendance > 0 && formData.eventType) {
      calculateEmissions();
    }
  }, [formData]);

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
            days: formData.durationDays,
            hoursPerDay: formData.durationHours,
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
              averageDistance: formData.transportDistance,
              internationalAttendees: formData.attendance > 1000 ? Math.ceil(formData.attendance * 0.1) : 0,
              domesticFlights: formData.attendance > 500 ? Math.ceil(formData.attendance * 0.05) : 0,
            },
            crewTransportation: {
              method: formData.transportMode,
              estimatedDistance: 100,
              numberOfVehicles: Math.ceil(formData.attendance / 100),
            },
            equipmentTransportation: {
              trucksRequired: formData.attendance > 500 ? 3 : 1,
              averageDistance: 200,
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
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="festival">🎵 Music Festival</SelectItem>
                <SelectItem value="conference">💼 Corporate Conference</SelectItem>
                <SelectItem value="wedding">💍 Wedding</SelectItem>
                <SelectItem value="concert">🎸 Concert/Show</SelectItem>
                <SelectItem value="sports_event">⚽ Sports Event</SelectItem>
                <SelectItem value="trade_show">🏢 Trade Show</SelectItem>
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
                value={formData.durationDays}
                onChange={(e) => updateField('durationDays', parseInt(e.target.value) || 1)}
                min="1"
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Hours per Day</Label>
              <Input
                type="number"
                value={formData.durationHours}
                onChange={(e) => updateField('durationHours', parseInt(e.target.value) || 8)}
                min="1"
                max="24"
                className="bg-slate-900/50 border-slate-700 text-white"
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
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="indoor">🏛️ Indoor Venue</SelectItem>
                <SelectItem value="outdoor">🌳 Outdoor Venue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transportation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Primary Transport</Label>
              <Select value={formData.transportMode} onValueChange={(value) => updateField('transportMode', value)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="flying">✈️ Flying</SelectItem>
                  <SelectItem value="driving">🚗 Driving</SelectItem>
                  <SelectItem value="transit">🚇 Public Transit</SelectItem>
                  <SelectItem value="walking">🚶 Walking/Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Avg Distance (km)</Label>
              <Input
                type="number"
                value={formData.transportDistance}
                onChange={(e) => updateField('transportDistance', parseInt(e.target.value) || 50)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Power Source */}
          <div className="space-y-2">
            <Label className="text-slate-300">Power Source</Label>
            <Select value={formData.powerSource} onValueChange={(value) => updateField('powerSource', value)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="grid">⚡ Grid Power</SelectItem>
                <SelectItem value="generator">⛽ Generator</SelectItem>
                <SelectItem value="hybrid">🔋 Hybrid</SelectItem>
                <SelectItem value="renewable">♻️ Renewable</SelectItem>
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
                onChange={(e) => updateField('mealCount', parseInt(e.target.value) || 0)}
                placeholder={`Default: ${formData.attendance * formData.durationDays}`}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Food Sourcing</Label>
              <Select value={formData.localFood ? 'local' : 'standard'} onValueChange={(value) => updateField('localFood', value === 'local')}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="local">🌾 Local/Organic</SelectItem>
                  <SelectItem value="standard">🍽️ Standard</SelectItem>
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
