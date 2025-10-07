import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarbonResults } from '@/components/sage/carbon-results';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Calculator, Loader2, Plus, Trash2 } from 'lucide-react';

interface StaffTransportGroup {
  id: string;
  count: number;
  mode: string;
  distance: number;
  overnightStays: number;
}

interface ArtistTransportGroup {
  id: string;
  count: number;
  mode: string;
  distance: number;
  tourBus: boolean;
}

interface MealBreakdown {
  staffMeals: number;
  attendeeFood: number;
  vipCatering: number;
  talentCatering: number;
}

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
  // Staff Transportation (granular)
  staffTransportGroups: StaffTransportGroup[];
  // Artist/Performer Transportation (granular)
  artistTransportGroups: ArtistTransportGroup[];
  // Equipment Transportation
  equipmentTrucksRequired: number;
  equipmentTransportDistance: number;
  equipmentFreightFlights: number;
  // Power and Food
  powerSource: string;
  meals: MealBreakdown;
  localFood: boolean;
}

interface EventFormCalculatorProps {
  initialEventType?: string;
  onSectionChange?: (section: string) => void;
}

export function EventFormCalculator({ initialEventType, onSectionChange }: EventFormCalculatorProps) {
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
    // Staff Transportation (granular groups)
    staffTransportGroups: [],
    // Artist/Performer Transportation (granular groups)
    artistTransportGroups: [],
    // Equipment Transportation
    equipmentTrucksRequired: 0,
    equipmentTransportDistance: 200,
    equipmentFreightFlights: 0,
    // Power and Food
    powerSource: 'grid',
    meals: {
      staffMeals: 0,
      attendeeFood: 0,
      vipCatering: 0,
      talentCatering: 0,
    },
    localFood: false,
  });

  const [calculation, setCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Helper functions for managing transport groups
  const addStaffGroup = () => {
    const newGroup: StaffTransportGroup = {
      id: Date.now().toString(),
      count: 1,
      mode: 'driving',
      distance: 50,
      overnightStays: 0,
    };
    setFormData(prev => ({
      ...prev,
      staffTransportGroups: [...prev.staffTransportGroups, newGroup]
    }));
  };

  const removeStaffGroup = (id: string) => {
    setFormData(prev => ({
      ...prev,
      staffTransportGroups: prev.staffTransportGroups.filter(g => g.id !== id)
    }));
  };

  const updateStaffGroup = (id: string, field: keyof StaffTransportGroup, value: any) => {
    setFormData(prev => ({
      ...prev,
      staffTransportGroups: prev.staffTransportGroups.map(g =>
        g.id === id ? { ...g, [field]: value } : g
      )
    }));
  };

  const addArtistGroup = () => {
    const newGroup: ArtistTransportGroup = {
      id: Date.now().toString(),
      count: 1,
      mode: 'flying',
      distance: 200,
      tourBus: false,
    };
    setFormData(prev => ({
      ...prev,
      artistTransportGroups: [...prev.artistTransportGroups, newGroup]
    }));
  };

  const removeArtistGroup = (id: string) => {
    setFormData(prev => ({
      ...prev,
      artistTransportGroups: prev.artistTransportGroups.filter(g => g.id !== id)
    }));
  };

  const updateArtistGroup = (id: string, field: keyof ArtistTransportGroup, value: any) => {
    setFormData(prev => ({
      ...prev,
      artistTransportGroups: prev.artistTransportGroups.map(g =>
        g.id === id ? { ...g, [field]: value } : g
      )
    }));
  };

  const updateMealField = (field: keyof MealBreakdown, value: number) => {
    setFormData(prev => ({
      ...prev,
      meals: { ...prev.meals, [field]: value }
    }));
  };

  const calculateEmissions = async () => {
    setIsCalculating(true);
    try {
      // Aggregate staff transport data from all groups
      const totalStaffCount = formData.staffTransportGroups.reduce((sum, g) => sum + g.count, 0);
      const avgStaffDistance = formData.staffTransportGroups.length > 0
        ? formData.staffTransportGroups.reduce((sum, g) => sum + (g.distance * g.count), 0) / totalStaffCount
        : 50;
      const totalStaffOvernightStays = formData.staffTransportGroups.reduce((sum, g) => sum + g.overnightStays, 0);

      // Aggregate artist transport data from all groups
      const totalArtistCount = formData.artistTransportGroups.reduce((sum, g) => sum + g.count, 0);
      const avgArtistDistance = formData.artistTransportGroups.length > 0
        ? formData.artistTransportGroups.reduce((sum, g) => sum + (g.distance * g.count), 0) / totalArtistCount
        : 200;

      // Total meals served
      const totalMealsServed = formData.meals.staffMeals + formData.meals.attendeeFood +
                               formData.meals.vipCatering + formData.meals.talentCatering;

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
            totalStaff: totalStaffCount || Math.ceil(formData.attendance / 50),
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
              method: formData.staffTransportGroups[0]?.mode || 'driving',
              estimatedDistance: avgStaffDistance,
              numberOfVehicles: totalStaffCount > 0
                ? Math.ceil(totalStaffCount / 1)
                : Math.ceil(formData.attendance / 100),
              staffCount: totalStaffCount || Math.ceil(formData.attendance / 50),
              overnightStays: totalStaffOvernightStays,
              // Include granular groups for detailed calculation
              staffGroups: formData.staffTransportGroups,
            },
            artistTransportation: {
              artistCount: totalArtistCount,
              method: formData.artistTransportGroups[0]?.mode || 'flying',
              distance: avgArtistDistance,
              tourBus: formData.artistTransportGroups.some(g => g.tourBus),
              // Include granular groups for detailed calculation
              artistGroups: formData.artistTransportGroups,
            },
            equipmentTransportation: {
              trucksRequired: formData.equipmentTrucksRequired,
              averageDistance: formData.equipmentTransportDistance,
              freightFlights: formData.equipmentFreightFlights,
            },
          },
          catering: {
            foodServiceType: 'buffet',
            expectedMealsServed: totalMealsServed || formData.attendance * formData.durationDays,
            isLocallySourced: formData.localFood,
            alcoholServed: formData.attendance > 100,
            // Include meal breakdown for detailed calculation
            mealBreakdown: formData.meals,
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
          <div
            className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50"
            onFocus={() => onSectionChange?.('transportation')}
          >
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

          {/* Staff Transportation - Granular Groups */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between" onFocus={() => onSectionChange?.('staff-transportation')}>
              <h3 className="text-lg font-semibold text-violet-400">👷 Staff Transportation</h3>
              <InfoTooltip content="Break down your staff by how they travel. E.g., 18 local staff driving + 2 flying in from out of state. Add as many groups as you need." />
            </div>

            {formData.staffTransportGroups.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-600 rounded-lg">
                <p className="text-slate-400 mb-3">No staff transport added yet</p>
                <Button
                  type="button"
                  onClick={addStaffGroup}
                  className="bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Group
                </Button>
              </div>
            ) : (
              <>
                {formData.staffTransportGroups.map((group, index) => (
                  <div key={group.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-violet-300">Staff Group {index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => removeStaffGroup(group.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm"># of Staff</Label>
                        <Input
                          type="number"
                          value={group.count || ''}
                          onChange={(e) => updateStaffGroup(group.id, 'count', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 18"
                          className="bg-slate-900/50 border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Transport Mode</Label>
                        <Select value={group.mode} onValueChange={(value) => updateStaffGroup(group.id, 'mode', value)}>
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

                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Distance (km)</Label>
                        <Input
                          type="number"
                          value={group.distance || ''}
                          onChange={(e) => updateStaffGroup(group.id, 'distance', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 20"
                          className="bg-slate-900/50 border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Overnight Stays</Label>
                        <Input
                          type="number"
                          value={group.overnightStays || ''}
                          onChange={(e) => updateStaffGroup(group.id, 'overnightStays', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="bg-slate-900/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addStaffGroup}
                  className="w-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Staff Group
                </Button>
              </>
            )}
          </div>

          {/* Artist/Performer Transportation - Granular Groups */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between" onFocus={() => onSectionChange?.('artist-transportation')}>
              <h3 className="text-lg font-semibold text-amber-400">🎤 Artist/Performer Transportation</h3>
              <InfoTooltip content="Break down performers by how they arrive. E.g., 5 artists flying commercially + 1 headliner on private jet. Each group can have different transport modes and distances." />
            </div>

            {formData.artistTransportGroups.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-600 rounded-lg">
                <p className="text-slate-400 mb-3">No artist transport added yet</p>
                <Button
                  type="button"
                  onClick={addArtistGroup}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Artist Group
                </Button>
              </div>
            ) : (
              <>
                {formData.artistTransportGroups.map((group, index) => (
                  <div key={group.id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-300">Artist Group {index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => removeArtistGroup(group.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm"># of Artists</Label>
                        <Input
                          type="number"
                          value={group.count || ''}
                          onChange={(e) => updateArtistGroup(group.id, 'count', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 5"
                          className="bg-slate-900/50 border-slate-700 text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Transport Mode</Label>
                        <Select value={group.mode} onValueChange={(value) => updateArtistGroup(group.id, 'mode', value)}>
                          <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="flying" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">✈️ Commercial Flight</SelectItem>
                            <SelectItem value="tour_bus" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚌 Tour Bus</SelectItem>
                            <SelectItem value="driving" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🚗 Driving</SelectItem>
                            <SelectItem value="private_jet" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🛩️ Private Jet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300 text-sm">Distance (km)</Label>
                        <Input
                          type="number"
                          value={group.distance || ''}
                          onChange={(e) => updateArtistGroup(group.id, 'distance', parseInt(e.target.value) || 0)}
                          placeholder="e.g., 500"
                          className="bg-slate-900/50 border-slate-700 text-white"
                        />
                      </div>

                      {group.mode === 'tour_bus' && (
                        <div className="flex items-center gap-2 p-2 bg-slate-900/30 rounded col-span-2">
                          <input
                            type="checkbox"
                            checked={group.tourBus}
                            onChange={(e) => updateArtistGroup(group.id, 'tourBus', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <Label className="text-slate-300 text-sm">Overnight in tour bus (reduces hotel emissions)</Label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addArtistGroup}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Artist Group
                </Button>
              </>
            )}
          </div>

          {/* Equipment Transportation */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between" onFocus={() => onSectionChange?.('equipment-transportation')}>
              <h3 className="text-lg font-semibold text-cyan-400">📦 Equipment Transportation</h3>
              <InfoTooltip content="Be realistic about production scale. Major festivals often need 20-100+ trucks for staging, sound, lighting, and vendor equipment. Small events might need 1-5 trucks." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Number of Trucks</Label>
                <Input
                  type="number"
                  value={formData.equipmentTrucksRequired || ''}
                  onChange={(e) => updateField('equipmentTrucksRequired', parseInt(e.target.value) || 0)}
                  placeholder="Enter realistic number (1-100+)"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                  min="0"
                  max="500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Avg Distance (km)</Label>
                <Input
                  type="number"
                  value={formData.equipmentTransportDistance || ''}
                  onChange={(e) => updateField('equipmentTransportDistance', e.target.value === '' ? 0 : parseInt(e.target.value))}
                  placeholder="200"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-slate-300">Freight Flights (international shipping)</Label>
                <InfoTooltip content="If equipment is flown in internationally (e.g., bringing gear from overseas for a touring artist), specify number of cargo flights." />
              </div>
              <Input
                type="number"
                value={formData.equipmentFreightFlights || ''}
                onChange={(e) => updateField('equipmentFreightFlights', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="0"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Power Source */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-slate-300">Power Source</Label>
              <InfoTooltip
                title="Power Source Options"
                content="Grid: Building's electrical service. Generator: Diesel/propane units for outdoor/remote events. Hybrid: Mix of grid + backup generators. Renewable: Solar panels, battery banks, biodiesel generators."
              />
            </div>
            <Select value={formData.powerSource} onValueChange={(value) => updateField('powerSource', value)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="grid" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">⚡ Grid Power (venue electrical)</SelectItem>
                <SelectItem value="generator" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">⛽ Generator (diesel/propane)</SelectItem>
                <SelectItem value="hybrid" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🔋 Hybrid (grid + backup)</SelectItem>
                <SelectItem value="renewable" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">♻️ Renewable (solar/biodiesel)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Catering - Granular Breakdown */}
          <div className="space-y-4 p-4 bg-slate-900/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center justify-between" onFocus={() => onSectionChange?.('food')}>
              <h3 className="text-lg font-semibold text-orange-400">🍽️ Food & Catering</h3>
              <InfoTooltip content="Break down meals by category: crew meals (breakfast/lunch/dinner for staff), attendee food service (concessions, food vendors), VIP catering (hospitality lounges), and talent catering (green room, artist meals)." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Staff/Crew Meals</Label>
                <Input
                  type="number"
                  value={formData.meals.staffMeals || ''}
                  onChange={(e) => updateMealField('staffMeals', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 150 (50 staff × 3 meals)"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Attendee Food Service</Label>
                <Input
                  type="number"
                  value={formData.meals.attendeeFood || ''}
                  onChange={(e) => updateMealField('attendeeFood', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 2000 (food vendors/concessions)"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">VIP Catering</Label>
                <Input
                  type="number"
                  value={formData.meals.vipCatering || ''}
                  onChange={(e) => updateMealField('vipCatering', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 100 (VIP lounge meals)"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Artist/Talent Catering</Label>
                <Input
                  type="number"
                  value={formData.meals.talentCatering || ''}
                  onChange={(e) => updateMealField('talentCatering', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 30 (green room/backstage)"
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-slate-300">Food Sourcing</Label>
                <InfoTooltip
                  title="Food Sourcing Options"
                  content="Standard: Commercial suppliers like Sysco, US Foods, GFS (bulk shipped from distribution centers). Local/Organic: Locally sourced from farms within 100 miles, organic/sustainable practices (lower transportation emissions)."
                />
              </div>
              <Select value={formData.localFood ? 'local' : 'standard'} onValueChange={(value) => updateField('localFood', value === 'local')}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="local" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🌾 Local/Organic (from nearby farms)</SelectItem>
                  <SelectItem value="standard" className="text-white hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white">🍽️ Standard (Sysco/US Foods/GFS)</SelectItem>
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
        <CarbonResults
          calculation={calculation}
          eventData={{
            attendance: formData.attendance,
            eventType: formData.eventType,
            location: 'Unknown'
          }}
        />
      )}
    </div>
  );
}
