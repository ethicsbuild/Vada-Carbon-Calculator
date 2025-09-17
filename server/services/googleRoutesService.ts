import { z } from "zod";

export interface Location {
  address: string;
  placeId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RouteOptions {
  travelMode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  polyline?: string;
  legs: Array<{
    startLocation: Location;
    endLocation: Location;
    distanceKm: number;
    durationMinutes: number;
  }>;
}

export interface EmissionCalculation {
  distanceKm: number;
  transportMode: TransportMode;
  co2eKg: number;
  co2eTonnes: number;
  passengerCount: number;
  vehicleType?: string;
}

export type TransportMode = 'car_petrol' | 'car_diesel' | 'car_hybrid' | 'car_electric' | 'flight_domestic' | 'flight_international' | 'train' | 'bus' | 'motorbike';

// Event-specific location and transportation interfaces
export interface EventLocation {
  name: string;
  address: string;
  type: 'venue' | 'hotel' | 'airport' | 'office' | 'warehouse';
  coordinates?: { lat: number; lng: number; };
  capacity?: number;
}

export interface EventTransportationAnalysis {
  audienceTravel: {
    averageDistance: number;
    transportModes: Record<TransportMode, number>; // percentage breakdown
    totalEmissions: number;
  };
  staffTravel: {
    totalDistance: number;
    transportMethod: TransportMode;
    emissions: number;
  };
  equipmentShipping: {
    routes: Array<{
      from: string;
      to: string;
      distance: number;
      emissions: number;
    }>;
    totalEmissions: number;
  };
  recommendations: string[];
}

export class GoogleRoutesService {
  private apiKey: string;
  private baseUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  private placesUrl = 'https://places.googleapis.com/v1/places:searchText';
  
  // Emission factors in kgCO2e per km per passenger
  private readonly emissionFactors: Record<TransportMode, number> = {
    car_petrol: 0.171,      // Average petrol car
    car_diesel: 0.164,      // Average diesel car  
    car_hybrid: 0.109,      // Hybrid vehicle
    car_electric: 0.047,    // Electric vehicle (grid average)
    flight_domestic: 0.255, // Domestic flight
    flight_international: 0.195, // International flight (more efficient per km)
    train: 0.041,          // Electric/diesel train
    bus: 0.089,            // Public bus
    motorbike: 0.113,      // Motorcycle
  };

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_ROUTES_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Routes API key not found. Service will be disabled.');
    }
  }

  /**
   * Search for places/locations using Google Places API
   */
  async searchLocations(query: string, region?: string): Promise<Array<{
    name: string;
    address: string;
    placeId: string;
    coordinates: { lat: number; lng: number };
    types: string[];
  }>> {
    if (!this.apiKey) {
      // Graceful fallback with mock data for demo
      return this.getMockLocationResults(query);
    }

    try {
      const response = await fetch(this.placesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.location,places.types'
        },
        body: JSON.stringify({
          textQuery: query,
          regionCode: region || 'US',
          maxResultCount: 10,
          includedType: 'establishment'
        })
      });

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.places || []).map((place: any) => ({
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        placeId: place.id || '',
        coordinates: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0
        },
        types: place.types || []
      }));
    } catch (error) {
      console.error('Location search error:', error);
      throw new Error('Failed to search locations');
    }
  }

  /**
   * Calculate route between two locations
   */
  async calculateRoute(
    origin: Location,
    destination: Location,
    options: RouteOptions = { travelMode: 'DRIVE' }
  ): Promise<RouteResult> {
    if (!this.apiKey) {
      // Graceful fallback with estimated distance for demo
      return this.getMockRouteResult(origin, destination);
    }

    try {
      const requestBody = {
        origin: this.formatLocationForAPI(origin),
        destination: this.formatLocationForAPI(destination),
        travelMode: options.travelMode,
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: options.avoidTolls || false,
          avoidHighways: options.avoidHighways || false,
          avoidFerries: options.avoidFerries || false
        },
        units: 'METRIC'
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Routes API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found between the specified locations');
      }

      const route = data.routes[0];
      const distanceKm = (route.distanceMeters || 0) / 1000;
      const durationMinutes = parseInt(route.duration?.replace('s', '') || '0') / 60;

      return {
        distanceKm,
        durationMinutes,
        polyline: route.polyline?.encodedPolyline,
        legs: (route.legs || []).map((leg: any) => ({
          startLocation: origin,
          endLocation: destination,
          distanceKm: (leg.distanceMeters || 0) / 1000,
          durationMinutes: parseInt(leg.duration?.replace('s', '') || '0') / 60
        }))
      };
    } catch (error) {
      console.error('Route calculation error:', error);
      throw error;
    }
  }

  /**
   * Calculate multiple routes (for multi-stop journeys)
   */
  async calculateMultiStopRoute(
    locations: Location[],
    options: RouteOptions = { travelMode: 'DRIVE' }
  ): Promise<{
    totalDistanceKm: number;
    totalDurationMinutes: number;
    routes: RouteResult[];
  }> {
    if (locations.length < 2) {
      throw new Error('At least 2 locations required for route calculation');
    }

    const routes: RouteResult[] = [];
    let totalDistanceKm = 0;
    let totalDurationMinutes = 0;

    // Calculate routes between consecutive locations
    for (let i = 0; i < locations.length - 1; i++) {
      const route = await this.calculateRoute(locations[i], locations[i + 1], options);
      routes.push(route);
      totalDistanceKm += route.distanceKm;
      totalDurationMinutes += route.durationMinutes;
    }

    return {
      totalDistanceKm,
      totalDurationMinutes,
      routes
    };
  }

  /**
   * Calculate carbon emissions for a journey
   */
  calculateEmissions(
    distanceKm: number,
    transportMode: TransportMode,
    passengerCount: number = 1,
    vehicleType?: string
  ): EmissionCalculation {
    const emissionFactor = this.emissionFactors[transportMode];
    const co2eKg = distanceKm * emissionFactor * passengerCount;
    
    return {
      distanceKm,
      transportMode,
      co2eKg,
      co2eTonnes: co2eKg / 1000,
      passengerCount,
      vehicleType
    };
  }

  /**
   * Calculate comprehensive travel emissions for business trips
   */
  async calculateTravelEmissions(
    journeys: Array<{
      origin: Location;
      destination: Location;
      transportMode: TransportMode;
      passengerCount?: number;
      vehicleType?: string;
      roundTrip?: boolean;
    }>
  ): Promise<{
    totalDistanceKm: number;
    totalCO2eKg: number;
    totalCO2eTonnes: number;
    journeyBreakdown: Array<EmissionCalculation & { route: RouteResult }>;
  }> {
    const journeyBreakdown: Array<EmissionCalculation & { route: RouteResult }> = [];
    let totalDistanceKm = 0;
    let totalCO2eKg = 0;

    for (const journey of journeys) {
      try {
        // For flights, use direct distance calculation
        let route: RouteResult;
        if (journey.transportMode.includes('flight')) {
          const distance = this.calculateHaversineDistance(journey.origin, journey.destination);
          route = {
            distanceKm: distance,
            durationMinutes: 0, // Flight duration not calculated here
            legs: [{
              startLocation: journey.origin,
              endLocation: journey.destination,
              distanceKm: distance,
              durationMinutes: 0
            }]
          };
        } else {
          route = await this.calculateRoute(journey.origin, journey.destination, {
            travelMode: this.mapTransportModeToRouteMode(journey.transportMode)
          });
        }

        const distance = journey.roundTrip ? route.distanceKm * 2 : route.distanceKm;
        const emissions = this.calculateEmissions(
          distance,
          journey.transportMode,
          journey.passengerCount || 1,
          journey.vehicleType
        );

        journeyBreakdown.push({
          ...emissions,
          route: {
            ...route,
            distanceKm: distance
          }
        });

        totalDistanceKm += distance;
        totalCO2eKg += emissions.co2eKg;
      } catch (error) {
        console.error(`Failed to calculate route for journey:`, error);
        // Continue with other journeys
      }
    }

    return {
      totalDistanceKm,
      totalCO2eKg,
      totalCO2eTonnes: totalCO2eKg / 1000,
      journeyBreakdown
    };
  }

  /**
   * Get emission factors for different transport modes
   */
  getEmissionFactors(): Record<TransportMode, number> {
    return { ...this.emissionFactors };
  }

  /**
   * Get supported transport modes with descriptions
   */
  getTransportModes(): Array<{ mode: TransportMode; name: string; description: string }> {
    return [
      { mode: 'car_petrol', name: 'Petrol Car', description: 'Average petrol/gasoline vehicle' },
      { mode: 'car_diesel', name: 'Diesel Car', description: 'Average diesel vehicle' },
      { mode: 'car_hybrid', name: 'Hybrid Car', description: 'Petrol-electric hybrid vehicle' },
      { mode: 'car_electric', name: 'Electric Car', description: 'Battery electric vehicle' },
      { mode: 'flight_domestic', name: 'Domestic Flight', description: 'Flights within country' },
      { mode: 'flight_international', name: 'International Flight', description: 'International flights' },
      { mode: 'train', name: 'Train', description: 'Electric or diesel train' },
      { mode: 'bus', name: 'Bus', description: 'Public bus transport' },
      { mode: 'motorbike', name: 'Motorcycle', description: 'Motorcycle or scooter' },
    ];
  }

  private formatLocationForAPI(location: Location): any {
    if (location.placeId) {
      return { placeId: location.placeId };
    } else if (location.coordinates) {
      return {
        location: {
          latLng: {
            latitude: location.coordinates.lat,
            longitude: location.coordinates.lng
          }
        }
      };
    } else {
      return { address: location.address };
    }
  }

  private mapTransportModeToRouteMode(transportMode: TransportMode): RouteOptions['travelMode'] {
    if (transportMode.startsWith('car') || transportMode === 'motorbike') {
      return 'DRIVE';
    } else if (transportMode === 'train' || transportMode === 'bus') {
      return 'TRANSIT';
    }
    return 'DRIVE'; // Default fallback
  }

  private calculateHaversineDistance(location1: Location, location2: Location): number {
    if (!location1.coordinates || !location2.coordinates) {
      throw new Error('Coordinates required for distance calculation');
    }

    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(location2.coordinates.lat - location1.coordinates.lat);
    const dLon = this.toRad(location2.coordinates.lng - location1.coordinates.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(location1.coordinates.lat)) * Math.cos(this.toRad(location2.coordinates.lat)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  // Event-specific transportation analysis methods
  async analyzeEventTransportation(
    eventLocation: EventLocation,
    expectedAttendance: number,
    staffLocations: EventLocation[] = [],
    equipmentOrigins: EventLocation[] = []
  ): Promise<EventTransportationAnalysis> {
    if (!this.apiKey) {
      return this.getEstimatedEventTransportation(eventLocation, expectedAttendance);
    }

    try {
      // Analyze audience travel patterns
      const audienceAnalysis = await this.analyzeAudienceTravel(eventLocation, expectedAttendance);
      
      // Calculate staff transportation
      const staffAnalysis = await this.calculateStaffTransportation(eventLocation, staffLocations);
      
      // Calculate equipment shipping
      const equipmentAnalysis = await this.calculateEquipmentShipping(eventLocation, equipmentOrigins);
      
      // Generate recommendations
      const recommendations = this.generateTransportRecommendations(audienceAnalysis, staffAnalysis, equipmentAnalysis);

      return {
        audienceTravel: audienceAnalysis,
        staffTravel: staffAnalysis,
        equipmentShipping: equipmentAnalysis,
        recommendations
      };
    } catch (error) {
      console.error('Event transportation analysis error:', error);
      return this.getEstimatedEventTransportation(eventLocation, expectedAttendance);
    }
  }

  private async analyzeAudienceTravel(
    eventLocation: EventLocation,
    expectedAttendance: number
  ): Promise<EventTransportationAnalysis['audienceTravel']> {
    const averageDistance = 50; // Simplified for demo
    const transportModes: Record<TransportMode, number> = {
      car_petrol: 0.65,
      car_diesel: 0.10,
      car_hybrid: 0.05,
      car_electric: 0.03,
      flight_domestic: 0.05,
      flight_international: 0.02,
      train: 0.05,
      bus: 0.03,
      motorbike: 0.02
    };

    const totalEmissions = expectedAttendance * averageDistance * 
      Object.entries(transportModes).reduce((sum, [mode, percentage]) => 
        sum + percentage * this.emissionFactors[mode as TransportMode], 0
      ) / 1000;

    return {
      averageDistance,
      transportModes,
      totalEmissions
    };
  }

  private async calculateStaffTransportation(
    eventLocation: EventLocation,
    staffLocations: EventLocation[]
  ): Promise<EventTransportationAnalysis['staffTravel']> {
    const totalDistance = staffLocations.length * 100; // Simplified
    const emissions = totalDistance * this.emissionFactors.car_petrol / 1000;

    return {
      totalDistance,
      transportMethod: 'car_petrol' as TransportMode,
      emissions
    };
  }

  private async calculateEquipmentShipping(
    eventLocation: EventLocation,
    equipmentOrigins: EventLocation[]
  ): Promise<EventTransportationAnalysis['equipmentShipping']> {
    const routes = equipmentOrigins.map(origin => ({
      from: origin.address,
      to: eventLocation.address,
      distance: 200, // Simplified
      emissions: 0.17 // Simplified truck emissions
    }));

    const totalEmissions = routes.reduce((sum, route) => sum + route.emissions, 0);

    return { routes, totalEmissions };
  }

  private generateTransportRecommendations(
    audienceAnalysis: EventTransportationAnalysis['audienceTravel'],
    staffAnalysis: EventTransportationAnalysis['staffTravel'], 
    equipmentAnalysis: EventTransportationAnalysis['equipmentShipping']
  ): string[] {
    return [
      "Encourage carpooling and public transportation for attendees",
      "Consider group transportation for staff from same locations",
      "Consolidate equipment shipments to reduce truck trips",
      "Offer parking incentives for electric/hybrid vehicles"
    ];
  }

  private getEstimatedEventTransportation(
    eventLocation: EventLocation,
    expectedAttendance: number
  ): EventTransportationAnalysis {
    const averageDistance = 50;
    const transportModes: Record<TransportMode, number> = {
      car_petrol: 0.60, car_diesel: 0.15, car_hybrid: 0.08, car_electric: 0.05,
      flight_domestic: 0.05, flight_international: 0.02, train: 0.03, bus: 0.02, motorbike: 0.00
    };

    const totalEmissions = expectedAttendance * averageDistance * 
      Object.entries(transportModes).reduce((sum, [mode, percentage]) => 
        sum + percentage * this.emissionFactors[mode as TransportMode], 0
      ) / 1000;

    return {
      audienceTravel: { averageDistance, transportModes, totalEmissions },
      staffTravel: { totalDistance: 200, transportMethod: 'car_petrol', emissions: 0.034 },
      equipmentShipping: { routes: [], totalEmissions: 0.5 },
      recommendations: [
        "Enable API access for more accurate transportation analysis",
        "Encourage sustainable transportation options"
      ]
    };
  }

  /**
   * Mock location results for demo when API key is not available
   */
  private getMockLocationResults(query: string): Array<{
    name: string;
    address: string;
    placeId: string;
    coordinates: { lat: number; lng: number };
    types: string[];
  }> {
    const mockLocations = [
      {
        name: `${query} Convention Center`,
        address: `123 ${query} Street, Demo City, DC 12345`,
        placeId: `mock_${query.replace(/\s/g, '_')}_1`,
        coordinates: { lat: 40.7128, lng: -74.0060 },
        types: ['establishment', 'point_of_interest']
      },
      {
        name: `${query} Airport`,
        address: `Airport Road, ${query}, DC 12346`,
        placeId: `mock_${query.replace(/\s/g, '_')}_2`,
        coordinates: { lat: 40.6892, lng: -74.1745 },
        types: ['airport', 'establishment']
      },
      {
        name: `Downtown ${query}`,
        address: `Downtown ${query}, DC 12347`,
        placeId: `mock_${query.replace(/\s/g, '_')}_3`,
        coordinates: { lat: 40.7589, lng: -73.9851 },
        types: ['locality', 'political']
      }
    ];
    
    return mockLocations.slice(0, 3);
  }

  /**
   * Mock route result for demo when API key is not available
   */
  private getMockRouteResult(origin: Location, destination: Location): RouteResult {
    // Simple distance estimation based on coordinates if available
    let distanceKm = 50; // Default fallback
    
    if (origin.coordinates && destination.coordinates) {
      distanceKm = this.calculateHaversineDistance(origin, destination);
    }
    
    const durationMinutes = Math.max(30, distanceKm * 1.2); // Rough time estimate
    
    return {
      distanceKm,
      durationMinutes,
      polyline: 'mock_polyline_data', 
      legs: [{
        startLocation: origin,
        endLocation: destination,
        distanceKm,
        durationMinutes
      }]
    };
  }
}

// Export singleton instance
export const googleRoutesService = new GoogleRoutesService();