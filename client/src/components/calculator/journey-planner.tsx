import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { LocationPicker } from '@/components/ui/location-picker';
import { Trash2, Plus, Route, Car, Plane, Train, Bus, Truck, Ship, Calculator } from 'lucide-react';
import type { Location } from '@/components/ui/location-picker';

export interface Journey {
  id: string;
  origin: Location | null;
  destination: Location | null;
  transportMode: TransportMode;
  passengerCount: number;
  vehicleType?: string;
  roundTrip: boolean;
  distanceKm?: number;
  co2eKg?: number;
  co2eTonnes?: number;
}

export type TransportMode = 'car_petrol' | 'car_diesel' | 'car_hybrid' | 'car_electric' | 'van_petrol' | 'van_diesel' | 'truck_diesel' | 'ferry' | 'flight_domestic' | 'flight_international' | 'train' | 'bus' | 'motorbike';

export interface JourneyPlannerResult {
  totalDistanceKm: number;
  totalCO2eKg: number;
  totalCO2eTonnes: number;
  journeyBreakdown: Journey[];
}

interface JourneyPlannerProps {
  onCalculate: (result: JourneyPlannerResult) => void;
  isLoading?: boolean;
  initialJourneys?: Journey[];
  className?: string;
}

const transportModes = [
  { mode: 'car_petrol' as TransportMode, name: 'Petrol Car', icon: Car, color: 'text-red-600' },
  { mode: 'car_diesel' as TransportMode, name: 'Diesel Car', icon: Car, color: 'text-orange-600' },
  { mode: 'car_hybrid' as TransportMode, name: 'Hybrid Car', icon: Car, color: 'text-blue-600' },
  { mode: 'car_electric' as TransportMode, name: 'Electric Car', icon: Car, color: 'text-green-600' },
  { mode: 'van_petrol' as TransportMode, name: 'Petrol Van', icon: Truck, color: 'text-amber-600' },
  { mode: 'van_diesel' as TransportMode, name: 'Diesel Van', icon: Truck, color: 'text-amber-700' },
  { mode: 'truck_diesel' as TransportMode, name: 'Diesel Truck', icon: Truck, color: 'text-stone-600' },
  { mode: 'ferry' as TransportMode, name: 'Ferry', icon: Ship, color: 'text-cyan-600' },
  { mode: 'flight_domestic' as TransportMode, name: 'Domestic Flight', icon: Plane, color: 'text-purple-600' },
  { mode: 'flight_international' as TransportMode, name: 'International Flight', icon: Plane, color: 'text-indigo-600' },
  { mode: 'train' as TransportMode, name: 'Train', icon: Train, color: 'text-green-700' },
  { mode: 'bus' as TransportMode, name: 'Bus', icon: Bus, color: 'text-yellow-600' },
  { mode: 'motorbike' as TransportMode, name: 'Motorcycle', icon: Car, color: 'text-gray-600' },
];

export function JourneyPlanner({ 
  onCalculate, 
  isLoading = false, 
  initialJourneys = [],
  className = ""
}: JourneyPlannerProps) {
  const [journeys, setJourneys] = useState<Journey[]>(
    initialJourneys.length > 0 ? initialJourneys : [createEmptyJourney()]
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function createEmptyJourney(): Journey {
    return {
      id: `journey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      origin: null,
      destination: null,
      transportMode: 'car_petrol',
      passengerCount: 1,
      roundTrip: false,
    };
  }

  const addJourney = () => {
    setJourneys([...journeys, createEmptyJourney()]);
  };

  const removeJourney = (id: string) => {
    if (journeys.length > 1) {
      setJourneys(journeys.filter(j => j.id !== id));
    }
  };

  const updateJourney = (id: string, updates: Partial<Journey>) => {
    setJourneys(journeys.map(journey => 
      journey.id === id ? { ...journey, ...updates } : journey
    ));
  };

  const calculateAllJourneys = async () => {
    const validJourneys = journeys.filter(j => j.origin && j.destination);
    
    if (validJourneys.length === 0) {
      setError('Please add at least one journey with origin and destination');
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const response = await fetch('/api/routes/calculate-travel-emissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journeys: validJourneys.map(journey => ({
            origin: journey.origin!,
            destination: journey.destination!,
            transportMode: journey.transportMode,
            passengerCount: journey.passengerCount,
            vehicleType: journey.vehicleType,
            roundTrip: journey.roundTrip
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to calculate journey emissions');
      }

      const result = await response.json();
      
      // Update journeys with calculated data
      const updatedJourneys = journeys.map((journey, index) => {
        const calculatedData = result.journeyBreakdown[index];
        if (calculatedData) {
          return {
            ...journey,
            distanceKm: calculatedData.distanceKm,
            co2eKg: calculatedData.co2eKg,
            co2eTonnes: calculatedData.co2eTonnes
          };
        }
        return journey;
      });

      setJourneys(updatedJourneys);
      
      onCalculate({
        totalDistanceKm: result.totalDistanceKm,
        totalCO2eKg: result.totalCO2eKg,
        totalCO2eTonnes: result.totalCO2eTonnes,
        journeyBreakdown: updatedJourneys.filter(j => j.distanceKm !== undefined)
      });

    } catch (err) {
      console.error('Journey calculation error:', err);
      setError('Failed to calculate journey emissions. Please check your internet connection and try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const getTotalEmissions = () => {
    return journeys
      .filter(j => j.co2eTonnes !== undefined)
      .reduce((total, journey) => total + (journey.co2eTonnes || 0), 0);
  };

  const getTotalDistance = () => {
    return journeys
      .filter(j => j.distanceKm !== undefined)
      .reduce((total, journey) => total + (journey.distanceKm || 0), 0);
  };

  const getTransportModeInfo = (mode: TransportMode) => {
    return transportModes.find(t => t.mode === mode) || transportModes[0];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Route className="w-5 h-5 mr-2 text-blue-600" />
          Journey Planner & Emission Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {journeys.map((journey, index) => {
          const modeInfo = getTransportModeInfo(journey.transportMode);
          const Icon = modeInfo.icon;

          return (
            <Card key={journey.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${modeInfo.color}`} />
                    <h4 className="font-medium text-gray-900 dark:text-forest-900 dark:text-forest-50">
                      Journey {index + 1}
                    </h4>
                    {journey.co2eTonnes !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {journey.co2eTonnes.toFixed(3)} tCO2e
                      </Badge>
                    )}
                  </div>
                  {journeys.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeJourney(journey.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`remove-journey-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">From</Label>
                    <LocationPicker
                      value={journey.origin}
                      onChange={(location) => updateJourney(journey.id, { origin: location })}
                      placeholder="Select origin location..."
                      data-testid={`journey-${index}-origin`}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">To</Label>
                    <LocationPicker
                      value={journey.destination}
                      onChange={(location) => updateJourney(journey.id, { destination: location })}
                      placeholder="Select destination location..."
                      data-testid={`journey-${index}-destination`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Transport Mode</Label>
                    <Select 
                      value={journey.transportMode}
                      onValueChange={(value: TransportMode) => 
                        updateJourney(journey.id, { transportMode: value })
                      }
                    >
                      <SelectTrigger data-testid={`journey-${index}-transport-mode`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transportModes.map(mode => {
                          const ModeIcon = mode.icon;
                          return (
                            <SelectItem key={mode.mode} value={mode.mode}>
                              <div className="flex items-center">
                                <ModeIcon className={`w-4 h-4 mr-2 ${mode.color}`} />
                                {mode.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Passengers</Label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={journey.passengerCount}
                      onChange={(e) => updateJourney(journey.id, { 
                        passengerCount: parseInt(e.target.value) || 1 
                      })}
                      data-testid={`journey-${index}-passengers`}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={journey.roundTrip}
                        onCheckedChange={(checked) => updateJourney(journey.id, { roundTrip: checked })}
                        data-testid={`journey-${index}-round-trip`}
                      />
                      <Label className="text-sm">Round trip</Label>
                    </div>
                  </div>
                </div>

                {journey.distanceKm !== undefined && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 dark:text-green-300">Distance:</span>
                        <span className="font-medium text-green-900 dark:text-green-100 ml-2">
                          {journey.distanceKm.toFixed(1)} km
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300">Emissions:</span>
                        <span className="font-medium text-green-900 dark:text-green-100 ml-2">
                          {(journey.co2eKg || 0).toFixed(1)} kg CO2e
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={addJourney}
            className="flex-1"
            data-testid="add-journey"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Journey
          </Button>
          
          <Button
            onClick={calculateAllJourneys}
            disabled={isCalculating || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            data-testid="calculate-journeys"
          >
            {isCalculating ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Calculating...
              </div>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Emissions
              </>
            )}
          </Button>
        </div>

        {getTotalEmissions() > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Total Journey Summary
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {getTotalDistance().toFixed(1)} km
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Distance
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {getTotalEmissions().toFixed(3)} tCO2e
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Emissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}