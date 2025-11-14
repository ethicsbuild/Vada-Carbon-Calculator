import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CarbonResults } from '@/components/sage/carbon-results';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Calculator, Loader2, Plus, Trash2, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

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
  onCalculationComplete?: (data: EventFormData, result: any) => void;
}

export function EventFormCalculator({ initialEventType, onSectionChange, onCalculationComplete }: EventFormCalculatorProps) {
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState('event-details');
  const { toast } = useToast();

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

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.eventType) {
      errors.eventType = 'Event type is required';
    }
    
    if (!formData.attendance || formData.attendance <= 0) {
      errors.attendance = 'Attendance is required and must be greater than 0';
    }
    
    if (!formData.durationDays || formData.durationDays <= 0) {
      errors.durationDays = 'Duration days is required and must be greater than 0';
    }
    
    if (!formData.durationHours || formData.durationHours <= 0) {
      errors.durationHours = 'Hours per day is required and must be greater than 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateEmissions = async () => {
    // Validate form before calculation
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields before calculating.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    setCalculation(null); // Clear previous results
    
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
        
        // Notify parent component of calculation completion
        if (onCalculationComplete) {
          onCalculationComplete(formData, result);
        }
        
        // Show success toast
        toast({
          title: "Calculation Complete",
          description: "Your event's carbon footprint has been calculated successfully.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Calculation Failed",
          description: errorData.error || "Failed to calculate emissions. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Network Error",
        description: "Failed to connect to the calculation service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field when it's updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Section navigation
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  // Export functions
  const exportToPDF = () => {
    if (!calculation) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.text('Carbon Footprint Calculation Report', 105, 20, { align: 'center' });
    
    // Add event details
    doc.setFontSize(16);
    doc.text('Event Details', 20, 35);
    
    doc.setFontSize(12);
    doc.text(`Event Type: ${formData.eventType}`, 20, 45);
    doc.text(`Attendance: ${formData.attendance}`, 20, 55);
    doc.text(`Duration: ${formData.durationDays} days, ${formData.durationHours} hours/day`, 20, 65);
    
    // Add results
    doc.setFontSize(16);
    doc.text('Calculation Results', 20, 85);
    
    doc.setFontSize(12);
    doc.text(`Total Carbon Footprint: ${calculation.total.toFixed(2)} tCO₂e`, 20, 95);
    doc.text(`Per Attendee: ${calculation.emissionsPerAttendee.toFixed(4)} tCO₂e`, 20, 105);
    doc.text(`Performance Rating: ${calculation.benchmarkComparison.performance}`, 20, 115);
    
    // Add breakdown
    doc.setFontSize(14);
    doc.text('Emissions Breakdown', 20, 135);
    
    doc.setFontSize(12);
    doc.text(`Venue: ${calculation.venue.toFixed(2)} tCO₂e`, 20, 145);
    doc.text(`Transportation: ${calculation.transportation.toFixed(2)} tCO₂e`, 20, 155);
    doc.text(`Energy: ${calculation.energy.toFixed(2)} tCO₂e`, 20, 165);
    doc.text(`Catering: ${calculation.catering.toFixed(2)} tCO₂e`, 20, 175);
    doc.text(`Waste: ${calculation.waste.toFixed(2)} tCO₂e`, 20, 185);
    doc.text(`Production: ${calculation.production.toFixed(2)} tCO₂e`, 20, 195);
    
    // Save the PDF
    doc.save(`carbon-footprint-${formData.eventType}-${new Date().toISOString().slice(0, 10)}.pdf`);
    
    toast({
      title: "Export Successful",
      description: "Your carbon footprint report has been exported as PDF.",
    });
  };

  const exportToCSV = () => {
    if (!calculation) return;
    
    // Create CSV content
    let csvContent = "Category,Value (tCO₂e)\\n";
    csvContent += `Total,${calculation.total.toFixed(2)}\\n`;
    csvContent += `Venue,${calculation.venue.toFixed(2)}\\n`;
    csvContent += `Transportation,${calculation.transportation.toFixed(2)}\\n`;
    csvContent += `Energy,${calculation.energy.toFixed(2)}\\n`;
    csvContent += `Catering,${calculation.catering.toFixed(2)}\\n`;
    csvContent += `Waste,${calculation.waste.toFixed(2)}\\n`;
    csvContent += `Production,${calculation.production.toFixed(2)}\\n`;
    csvContent += `Per Attendee,${calculation.emissionsPerAttendee.toFixed(4)}\\n`;
    csvContent += `Performance Rating,${calculation.benchmarkComparison.performance}\\n`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-footprint-${formData.eventType}-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Your carbon footprint report has been exported as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-6 h-6 text-forest-400" />
          <h2 className="text-2xl font-bold text-forest-900 dark:text-forest-100">Event Carbon Calculator</h2>
        </div>
        
        <div className="mb-6 p-4 bg-sage-50 dark:bg-sage-900/50 rounded-xl border border-forest-300 dark:border-forest-700/50">
          <p className="text-sage-500 dark:text-sage-500 text-sm">
            <span className="text-forest-400 font-semibold">Required fields:</span> Event Type, Attendance, Duration Days, and Hours per Day are marked with an asterisk (*). 
            <br />
            <span className="text-violet-400 font-semibold">Optional fields:</span> You can still get an estimate even if you leave optional fields blank.
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-sage-600 dark:text-sage-400 mb-2">
            <span>Event Details</span>
            <span>Transportation</span>
            <span>Production</span>
            <span>Food & Power</span>
          </div>
          <div className="w-full bg-sage-100 dark:bg-sage-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-forest-500 to-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: currentSection === 'event-details' ? '25%' : 
                       currentSection === 'transportation' ? '50%' : 
                       currentSection === 'production' ? '75%' : '100%' 
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Event Type */}
          <div className="space-y-2" onClick={() => handleSectionChange('event-details')}>
            <div className="flex items-center gap-2">
              <Label className="text-sage-500 dark:text-sage-500">Event Type *</Label>
              {validationErrors.eventType && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.eventType}
                </div>
              )}
            </div>
            <Select value={formData.eventType} onValueChange={(value) => updateField('eventType', value)}>
              <SelectTrigger className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent className="bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectItem value="festival" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🎪 Music Festival</SelectItem>
                <SelectItem value="conference" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">📋 Corporate Conference</SelectItem>
                <SelectItem value="wedding" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">💍 Wedding</SelectItem>
                <SelectItem value="concert" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🎸 Concert/Show</SelectItem>
                <SelectItem value="sports_event" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">⚽ Sports Event</SelectItem>
                <SelectItem value="trade_show" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🏢 Trade Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sage-500 dark:text-sage-500">Expected Attendance *</Label>
              {validationErrors.attendance && (
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.attendance}
                </div>
              )}
            </div>
            <Input
              type="number"
              value={formData.attendance || ''}
              onChange={(e) => updateField('attendance', parseInt(e.target.value) || 0)}
              placeholder="Number of attendees"
              className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sage-500 dark:text-sage-500">Duration (Days) *</Label>
                {validationErrors.durationDays && (
                  <div className="flex items-center gap-1 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.durationDays}
                  </div>
                )}
              </div>
              <Input
                type="number"
                value={formData.durationDays || ''}
                onChange={(e) => updateField('durationDays', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="1"
                className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100 placeholder:text-sage-500 dark:text-sage-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sage-500 dark:text-sage-500">Hours per Day *</Label>
                {validationErrors.durationHours && (
                  <div className="flex items-center gap-1 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {validationErrors.durationHours}
                  </div>
                )}
              </div>
              <Input
                type="number"
                value={formData.durationHours || ''}
                onChange={(e) => updateField('durationHours', e.target.value === '' ? 0 : parseInt(e.target.value))}
                placeholder="8"
                className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100 placeholder:text-sage-500 dark:text-sage-500"
              />
            </div>
          </div>

          {/* Venue Type */}
          <div className="space-y-2">
            <Label className="text-sage-500 dark:text-sage-500">Venue Type</Label>
            <Select value={formData.venueType} onValueChange={(value) => updateField('venueType', value)}>
              <SelectTrigger className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent className="bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectItem value="indoor" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🏢 Indoor Venue</SelectItem>
                <SelectItem value="outdoor" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🌳 Outdoor Space</SelectItem>
                <SelectItem value="mixed" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🔄 Mixed Indoor/Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Outdoor Venue Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOutdoor"
              checked={formData.isOutdoor}
              onChange={(e) => updateField('isOutdoor', e.target.checked)}
              className="w-4 h-4 text-forest-400 bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 rounded focus:ring-emerald-400"
            />
            <Label htmlFor="isOutdoor" className="text-sage-500 dark:text-sage-500">
              Outdoor Event
              <InfoTooltip 
                title="Outdoor Events"
                content="Outdoor events typically have different energy requirements and may need additional infrastructure like temporary power or shelter."
              />
            </Label>
          </div>

          {/* Attendee Transportation */}
          <div className="space-y-4 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('transportation')}>
            <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100">Audience Transportation</h3>
            
            <div className="space-y-2">
              <Label className="text-sage-500 dark:text-sage-500">Primary Travel Method</Label>
              <Select value={formData.attendeeTransportMode} onValueChange={(value) => updateField('attendeeTransportMode', value)}>
                <SelectTrigger className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                  <SelectValue placeholder="Select travel method" />
                </SelectTrigger>
                <SelectContent className="bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                  <SelectItem value="mixed" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🔄 Mixed (Local/Regional/Flying)</SelectItem>
                  <SelectItem value="local" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🚗 Local/Regional Travel</SelectItem>
                  <SelectItem value="flying" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">✈️ Flying (Domestic/International)</SelectItem>
                  <SelectItem value="transit" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🚇 Public Transit</SelectItem>
                  <SelectItem value="walking" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🚶 Walking/Biking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Average Travel Distance (km)</Label>
                <Input
                  type="number"
                  value={formData.attendeeTransportDistance}
                  onChange={(e) => updateField('attendeeTransportDistance', parseInt(e.target.value) || 0)}
                  placeholder="50"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
            </div>

            {formData.attendeeTransportMode === 'mixed' && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sage-500 dark:text-sage-500">% Local Travel</Label>
                  <Input
                    type="number"
                    value={formData.attendeeLocalPercentage}
                    onChange={(e) => updateField('attendeeLocalPercentage', parseInt(e.target.value) || 0)}
                    placeholder="60"
                    className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sage-500 dark:text-sage-500">% Domestic Flights</Label>
                  <Input
                    type="number"
                    value={formData.attendeeDomesticFlightPercentage}
                    onChange={(e) => updateField('attendeeDomesticFlightPercentage', parseInt(e.target.value) || 0)}
                    placeholder="30"
                    className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sage-500 dark:text-sage-500">% International Flights</Label>
                  <Input
                    type="number"
                    value={formData.attendeeInternationalFlightPercentage}
                    onChange={(e) => updateField('attendeeInternationalFlightPercentage', parseInt(e.target.value) || 0)}
                    placeholder="10"
                    className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Staff Transportation */}
          <div className="space-y-4 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('transportation')}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100">Staff Transportation</h3>
              <Button 
                onClick={addStaffGroup}
                variant="outline" 
                size="sm"
                className="border-emerald-400/50 text-forest-400 hover:bg-emerald-400/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Group
              </Button>
            </div>

            {formData.staffTransportGroups.length === 0 ? (
              <div className="text-sage-600 dark:text-sage-400 text-sm">
                No staff transportation groups added. Click "Add Group" to specify how your staff will travel.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.staffTransportGroups.map((group) => (
                  <Card key={group.id} className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700/50 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-forest-900 dark:text-forest-100">Staff Group</h4>
                      <Button 
                        onClick={() => removeStaffGroup(group.id)}
                        variant="ghost"
                        size="sm"
                        className="text-sage-600 dark:text-sage-400 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Number of Staff</Label>
                        <Input
                          type="number"
                          value={group.count}
                          onChange={(e) => updateStaffGroup(group.id, 'count', parseInt(e.target.value) || 0)}
                          className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Travel Method</Label>
                        <Select value={group.mode} onValueChange={(value) => updateStaffGroup(group.id, 'mode', value)}>
                          <SelectTrigger className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-100 dark:bg-forest-800 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                            <SelectItem value="driving" className="text-forest-900 dark:text-forest-100">🚗 Driving</SelectItem>
                            <SelectItem value="transit" className="text-forest-900 dark:text-forest-100">🚇 Public Transit</SelectItem>
                            <SelectItem value="flying" className="text-forest-900 dark:text-forest-100">✈️ Flying</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Average Distance (km)</Label>
                        <Input
                          type="number"
                          value={group.distance}
                          onChange={(e) => updateStaffGroup(group.id, 'distance', parseInt(e.target.value) || 0)}
                          className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Overnight Stays</Label>
                        <Input
                          type="number"
                          value={group.overnightStays}
                          onChange={(e) => updateStaffGroup(group.id, 'overnightStays', parseInt(e.target.value) || 0)}
                          className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Artist/Performer Transportation */}
          <div className="space-y-4 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('transportation')}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100">Artist Transportation</h3>
              <Button 
                onClick={addArtistGroup}
                variant="outline" 
                size="sm"
                className="border-emerald-400/50 text-forest-400 hover:bg-emerald-400/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Group
              </Button>
            </div>

            {formData.artistTransportGroups.length === 0 ? (
              <div className="text-sage-600 dark:text-sage-400 text-sm">
                No artist transportation groups added. Click "Add Group" to specify how performers will travel.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.artistTransportGroups.map((group) => (
                  <Card key={group.id} className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700/50 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-forest-900 dark:text-forest-100">Artist Group</h4>
                      <Button 
                        onClick={() => removeArtistGroup(group.id)}
                        variant="ghost"
                        size="sm"
                        className="text-sage-600 dark:text-sage-400 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Number of Artists</Label>
                        <Input
                          type="number"
                          value={group.count}
                          onChange={(e) => updateArtistGroup(group.id, 'count', parseInt(e.target.value) || 0)}
                          className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Travel Method</Label>
                        <Select value={group.mode} onValueChange={(value) => updateArtistGroup(group.id, 'mode', value)}>
                          <SelectTrigger className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-forest-100 dark:bg-forest-800 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                            <SelectItem value="driving" className="text-forest-900 dark:text-forest-100">🚗 Driving</SelectItem>
                            <SelectItem value="transit" className="text-forest-900 dark:text-forest-100">🚇 Public Transit</SelectItem>
                            <SelectItem value="flying" className="text-forest-900 dark:text-forest-100">✈️ Flying</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sage-500 dark:text-sage-500">Average Distance (km)</Label>
                        <Input
                          type="number"
                          value={group.distance}
                          onChange={(e) => updateArtistGroup(group.id, 'distance', parseInt(e.target.value) || 0)}
                          className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`tourBus-${group.id}`}
                          checked={group.tourBus}
                          onChange={(e) => updateArtistGroup(group.id, 'tourBus', e.target.checked)}
                          className="w-4 h-4 text-forest-400 bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 rounded focus:ring-emerald-400"
                        />
                        <Label htmlFor={`tourBus-${group.id}`} className="text-sage-500 dark:text-sage-500">
                          Tour Bus
                        </Label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Transportation */}
          <div className="space-y-4 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('transportation')}>
            <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100">Equipment Transportation</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Trucks Required</Label>
                <Input
                  type="number"
                  value={formData.equipmentTrucksRequired}
                  onChange={(e) => updateField('equipmentTrucksRequired', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Average Distance (km)</Label>
                <Input
                  type="number"
                  value={formData.equipmentTransportDistance}
                  onChange={(e) => updateField('equipmentTransportDistance', parseInt(e.target.value) || 0)}
                  placeholder="200"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Freight Flights</Label>
                <Input
                  type="number"
                  value={formData.equipmentFreightFlights}
                  onChange={(e) => updateField('equipmentFreightFlights', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
            </div>
          </div>

          {/* Power Source */}
          <div className="space-y-2 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('production')}>
            <Label className="text-sage-500 dark:text-sage-500">Power Source</Label>
            <Select value={formData.powerSource} onValueChange={(value) => updateField('powerSource', value)}>
              <SelectTrigger className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectValue placeholder="Select power source" />
              </SelectTrigger>
              <SelectContent className="bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100">
                <SelectItem value="grid" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🔌 Grid Power</SelectItem>
                <SelectItem value="generator" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">⚡ Generator</SelectItem>
                <SelectItem value="renewable" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">☀️ Renewable Energy</SelectItem>
                <SelectItem value="hybrid" className="text-forest-900 dark:text-forest-100 hover:bg-forest-100 dark:bg-forest-800 hover:text-forest-900 dark:text-forest-100 focus:bg-forest-100 dark:bg-forest-800 focus:text-forest-900 dark:text-forest-100">🔄 Hybrid (Grid + Renewable)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Food & Catering */}
          <div className="space-y-4 pt-4 border-t border-forest-300 dark:border-forest-700/50" onClick={() => handleSectionChange('food-power')}>
            <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100">Food & Catering</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Staff Meals</Label>
                <Input
                  type="number"
                  value={formData.meals.staffMeals}
                  onChange={(e) => updateMealField('staffMeals', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Attendee Food</Label>
                <Input
                  type="number"
                  value={formData.meals.attendeeFood}
                  onChange={(e) => updateMealField('attendeeFood', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">VIP Catering</Label>
                <Input
                  type="number"
                  value={formData.meals.vipCatering}
                  onChange={(e) => updateMealField('vipCatering', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sage-500 dark:text-sage-500">Talent Catering</Label>
                <Input
                  type="number"
                  value={formData.meals.talentCatering}
                  onChange={(e) => updateMealField('talentCatering', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="bg-sage-50 dark:bg-sage-900/50 border-forest-300 dark:border-forest-700 text-forest-900 dark:text-forest-100"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="localFood"
                checked={formData.localFood}
                onChange={(e) => updateField('localFood', e.target.checked)}
                className="w-4 h-4 text-forest-400 bg-sage-50 dark:bg-sage-900 border-forest-300 dark:border-forest-700 rounded focus:ring-emerald-400"
              />
              <Label htmlFor="localFood" className="text-sage-500 dark:text-sage-500">
                Locally Sourced Food
                <InfoTooltip 
                  title="Locally Sourced Food"
                  content="Using locally sourced food can significantly reduce transportation emissions from your catering."
                />
              </Label>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="pt-6 border-t border-forest-300 dark:border-forest-700/50">
          <Button 
            onClick={calculateEmissions}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-forest-500 to-violet-500 hover:from-forest-600 hover:to-violet-600 text-forest-900 dark:text-forest-100"
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
        <div className="space-y-6">
          <CarbonResults
            calculation={calculation}
            eventData={{
              attendance: formData.attendance,
              eventType: formData.eventType,
              location: 'Unknown'
            }}
          />
          
          {/* Export Buttons */}
          <Card className="bg-forest-100 dark:bg-forest-800/50 border-forest-300 dark:border-forest-700/50 backdrop-blur-sm p-6">
            <h3 className="text-lg font-semibold text-forest-900 dark:text-forest-100 mb-4">Export Results</h3>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={exportToPDF}
                variant="outline"
                className="border-emerald-400/50 text-forest-400 hover:bg-emerald-400/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button 
                onClick={exportToCSV}
                variant="outline"
                className="border-violet-400/50 text-violet-400 hover:bg-violet-400/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}