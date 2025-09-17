export interface OrganizationProfile {
  id?: number;
  name: string;
  type: 'corporate' | 'government' | 'ngo' | 'university' | 'event';
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  industry: string;
  country?: string;
  website?: string;
  description?: string;
}

export interface Scope1Data {
  naturalGas?: number;
  propane?: number;
  fuelOil?: number;
  gasoline?: number;
  diesel?: number;
  refrigerants?: number;
  processEmissions?: number;
}

export interface Scope2Data {
  electricity?: number;
  heating?: number;
  cooling?: number;
  steam?: number;
  gridEmissionFactor?: number;
}

export interface Scope3Data {
  businessTravel?: number;
  employeeCommuting?: number;
  wasteGenerated?: number;
  paperConsumption?: number;
  waterConsumption?: number;
  purchasedGoods?: number;
  transportationDistribution?: number;
  investmentsFinanced?: number;
  // Detailed journey emissions data - preserves transport mode precision
  journeyEmissions?: {
    totalCO2eTonnes: number;
    totalCO2eKg: number;
    totalDistanceKm: number;
    journeyBreakdown: Array<{
      transportMode: string;
      distanceKm: number;
      co2eKg: number;
      co2eTonnes: number;
      passengerCount: number;
    }>;
  };
}

export interface CalculationResult {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  breakdown: {
    scope1Details: Record<string, number>;
    scope2Details: Record<string, number>;
    scope3Details: Record<string, number>;
  };
}

export interface CarbonCalculation {
  id: number;
  organizationId: number;
  userId: number;
  reportingYear: number;
  calculationMethod: 'guided' | 'estimation' | 'detailed';
  status: 'in_progress' | 'completed' | 'verified';
  scope1Data?: Scope1Data;
  scope2Data?: Scope2Data;
  scope3Data?: Scope3Data;
  scope1Emissions?: string;
  scope2Emissions?: string;
  scope3Emissions?: string;
  totalEmissions?: string;
  ghgProtocolVersion?: string;
  calculatedAt?: string;
  verifiedAt?: string;
  blockchainHash?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestedActions?: string[];
    dataCollected?: Record<string, any>;
    nextStep?: string;
    calculationResult?: CalculationResult;
  };
}

export interface CoPilotSession {
  id: number;
  sessionId: string;
  userId: number;
  calculationId?: number;
  messages: AiMessage[];
  context: {
    userId: number;
    organizationId?: number;
    calculationId?: number;
    currentStep: string;
    collectedData: Record<string, any>;
    organizationProfile?: OrganizationProfile;
    eventProfile?: Partial<EventProfile>;
    userPreferences?: {
      detailLevel: 'basic' | 'intermediate' | 'expert';
      estimationMode: boolean;
      priorityScopes: string[];
    };
    questionnaire?: {
      currentSection: string;
      completedSections: string[];
      estimatedProgress: number;
      pendingQuestions: string[];
      skippedQuestions: string[];
    };
  };
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: number;
  userId: number;
  achievementType: string;
  title: string;
  description?: string;
  icon?: string;
  unlockedAt: string;
  createdAt: string;
}

export interface CarbonReport {
  id: number;
  calculationId: number;
  userId: number;
  type: 'ghg_protocol' | 'carbon_receipt' | 'custom';
  format: 'pdf' | 'csv' | 'json';
  title: string;
  content?: any;
  filePath?: string;
  isBlockchainVerified: boolean;
  blockchainHash?: string;
  generatedAt: string;
  createdAt: string;
}

export interface EmissionFactor {
  id: number;
  category: string;
  subcategory?: string;
  activity: string;
  unit: string;
  factor: string;
  source: string;
  region?: string;
  year: number;
  isActive: boolean;
  createdAt: string;
}

export type CalculationStep = 
  | 'organization_setup'
  | 'event_type_selection'
  | 'event_basic_info'
  | 'event_staff_logistics'
  | 'event_venue_setup'
  | 'event_transportation'
  | 'event_equipment_av'
  | 'event_audience_catering'
  | 'scope1_calculation'
  | 'scope2_calculation'
  | 'scope3_calculation'
  | 'report_generation'
  | 'completed';

export interface ProgressState {
  currentStep: CalculationStep;
  completedSteps: CalculationStep[];
  progress: number;
  organizationSetup: boolean;
  eventInfoComplete: boolean;
  scope1Complete: boolean;
  scope2Complete: boolean;
  scope3Complete: boolean;
  calculationComplete: boolean;
}

// Event-specific types
export type EventType = 
  | 'concert' 
  | 'festival' 
  | 'conference' 
  | 'sports_event' 
  | 'theater_performance' 
  | 'wedding' 
  | 'corporate_event' 
  | 'trade_show' 
  | 'community_event' 
  | 'outdoor_event' 
  | 'other';

export type CompanyRole = 
  | 'event_producer' 
  | 'venue_operator' 
  | 'vendor_supplier' 
  | 'talent_agency' 
  | 'catering_company' 
  | 'av_company' 
  | 'security_company' 
  | 'transportation_company' 
  | 'marketing_agency' 
  | 'other';

export type VenueType = 
  | 'indoor_arena' 
  | 'outdoor_stadium' 
  | 'concert_hall' 
  | 'convention_center' 
  | 'hotel_ballroom' 
  | 'outdoor_field' 
  | 'theater' 
  | 'warehouse' 
  | 'rooftop' 
  | 'private_residence' 
  | 'multiple_venues' 
  | 'other';

export interface EventProfile {
  // Basic event information
  eventType: EventType;
  eventName?: string;
  companyRole: CompanyRole;
  expectedAttendance: number;
  eventDuration: {
    days: number;
    hoursPerDay: number;
    setupDays?: number;
    strikedownDays?: number;
  };
  
  // Venue and location
  venue: {
    type: VenueType;
    location: {
      address: string;
      city: string;
      state?: string;
      country: string;
      coordinates?: { lat: number; lng: number; };
    };
    capacity: number;
    isOutdoor: boolean;
    hasExistingPower: boolean;
    hasExistingAV: boolean;
  };
  
  // Staff and logistics
  staffing: {
    totalStaff: number;
    onSiteStaff: number;
    crewSize?: number;
    securityStaff?: number;
    cateringStaff?: number;
    volunteerCount?: number;
  };
  
  // Production details
  production: {
    numberOfStages?: number;
    stageSize?: string; // small, medium, large, festival_main
    audioVisual: {
      soundSystemSize: 'small' | 'medium' | 'large' | 'festival';
      lightingRig: 'basic' | 'medium' | 'elaborate' | 'festival';
      videoScreens: boolean;
      videoScreenCount?: number;
      livestreaming: boolean;
      recordingEquipment: boolean;
    };
    powerRequirements: {
      generatorPower: boolean;
      generatorSize?: 'small' | 'medium' | 'large' | 'multiple';
      gridPowerUsage?: number; // kWh estimated
    };
  };
  
  // Audience and catering
  audience: {
    allAges: boolean;
    alcoholServed: boolean;
    foodService: {
      type: 'none' | 'catered' | 'food_trucks' | 'full_restaurant' | 'concessions';
      expectedMealsServed?: number;
      isLocallySourced?: boolean;
    };
    merchandising: boolean;
  };
  
  // Transportation and logistics
  transportation: {
    publicTransportAccess: boolean;
    parkingSpaces?: number;
    shuttleService: boolean;
    crewTransportation: {
      method: 'local' | 'buses' | 'flights' | 'mixed';
      estimatedDistance?: number;
      numberOfVehicles?: number;
    };
    equipmentTransportation: {
      trucksRequired: number;
      averageDistance: number;
      freight: boolean;
    };
    audienceTravel: {
      estimatedAverageDistance: number;
      internationalAttendees?: number;
      domesticFlights?: number;
    };
  };
  
  // Waste and sustainability
  waste: {
    wasteManagement: {
      recyclingProgram: boolean;
      compostingProgram: boolean;
      wasteReductionMeasures: string[];
    };
    sustainabilityInitiatives: {
      carbonOffsets: boolean;
      renewableEnergyUse: boolean;
      sustainableVendors: boolean;
      digitalTicketing: boolean;
      reusableItems: boolean;
    };
  };
}

export interface EventCalculationData {
  eventProfile: EventProfile;
  calculatedEmissions: {
    venue: number;
    transportation: number;
    energy: number;
    catering: number;
    waste: number;
    accommodation?: number;
    production: number;
    total: number;
  };
  recommendations: string[];
  benchmarkComparison?: {
    averageForEventType: number;
    percentile: number;
    similarEvents: number;
  };
}
