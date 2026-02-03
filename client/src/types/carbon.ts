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

// Food & Catering - Two-Tier System
export type FoodDetailLevel = 'lite' | 'advanced';

export interface FoodLiteMode {
  foodProvided: 'none' | 'light-catering' | 'full-meals';
  serviceModel: 'full-service' | 'buffet' | 'pre-packaged' | 'food-trucks' | 'attendee-purchase';
  sourcing: 'local' | 'mixed' | 'national' | 'unknown';
  plantForward: boolean;
  scale: '1-50' | '51-250' | '251-1000' | '1000+';
}

export interface FoodAdvancedMode extends FoodLiteMode {
  groupsFed: {
    staff: boolean;
    talent: boolean;
    attendees: boolean;
    vip: boolean;
  };
  foodStrategy: 'standard' | 'plant-forward' | 'vegetarian-vegan' | 'no-strategy';
  serviceWare: 'reusable' | 'compostable' | 'mixed-disposable' | 'single-use-plastic' | 'unknown';
  wasteHandling: 'composting' | 'donation' | 'landfill' | 'no-plan';
  portionControl: boolean;
  vendorWasteMitigation: boolean;
}

export interface FoodCateringData {
  detailLevel: FoodDetailLevel;
  liteMode?: FoodLiteMode;
  advancedMode?: FoodAdvancedMode;
}

// Cross-section impact flags for systems alignment
export interface FoodSystemImpacts {
  increasesTransport: boolean; // food trucks, external vendors, national sourcing
  increasesPower: boolean; // full-service, on-site cooking, food trucks
  impactNotes: string[];
}

// Power System - Producer-Native Model
export type PowerDetailLevel = 'basic' | 'detailed';

export interface PowerBasicMode {
  primarySource: 'grid' | 'generator' | 'renewable' | 'hybrid';
  backupRequired: boolean;
  estimatedLoad: 'small' | 'medium' | 'large' | 'festival';
}

export interface PowerDetailedMode extends PowerBasicMode {
  backupStrategy: {
    hasBackup: boolean;
    backupType: 'generator' | 'battery' | 'redundant-grid' | 'none';
    backupCapacity: 'partial' | 'full' | 'critical-only';
  };
  distribution: {
    strategy: 'centralized' | 'distributed' | 'hybrid';
    zones: number;
  };
  loadProfile: {
    peakLoad: 'low' | 'medium' | 'high' | 'extreme';
    sustainedLoad: 'low' | 'medium' | 'high';
    criticalSystems: boolean; // lighting, sound, safety
  };
  venueCapabilities: {
    gridAvailable: boolean;
    gridCapacity: 'insufficient' | 'adequate' | 'abundant';
    existingInfrastructure: boolean;
  };
}

export interface PowerSystemData {
  detailLevel: PowerDetailLevel;
  basicMode?: PowerBasicMode;
  detailedMode?: PowerDetailedMode;
}

// Power system impacts
export interface PowerSystemImpacts {
  reliabilityScore: 'low' | 'medium' | 'high';
  efficiencyScore: 'low' | 'medium' | 'high';
  carbonIntensity: 'low' | 'medium' | 'high';
  tradeoffNotes: string[];
  leveragePoints: string[];
}

// Production Build & Infrastructure - Producer-Native Model
export type ProductionDetailLevel = 'basic' | 'detailed';

export interface ProductionBasicMode {
  buildStrategy: 'bring-full-rig' | 'rent-locally' | 'hybrid' | 'venue-provided';
  productionScale: 'minimal' | 'standard' | 'full-production' | 'festival';
  transportRequired: boolean;
}

export interface ProductionDetailedMode extends ProductionBasicMode {
  venueProvides: {
    stage: boolean;
    lighting: boolean;
    sound: boolean;
    video: boolean;
    power: boolean;
    rigging: boolean;
  };
  bringingOwn: {
    stage: boolean;
    lighting: boolean;
    sound: boolean;
    video: boolean;
    specialEffects: boolean;
    customRigging: boolean;
  };
  vendorStrategy: {
    approach: 'single-vendor' | 'multiple-specialists' | 'hybrid' | 'in-house';
    numberOfVendors: number;
    localVendors: boolean;
  };
  transportLogistics: {
    trucksRequired: number;
    averageDistance: number;
    consolidatedShipping: boolean;
    freightFlights: number;
  };
  buildTime: {
    loadInDays: number;
    strikeDownDays: number;
    crewSize: number;
  };
}

export interface ProductionBuildData {
  detailLevel: ProductionDetailLevel;
  basicMode?: ProductionBasicMode;
  detailedMode?: ProductionDetailedMode;
}

// Production system impacts
export interface ProductionSystemImpacts {
  controlLevel: 'low' | 'medium' | 'high';
  carbonIntensity: 'low' | 'medium' | 'high';
  logisticsComplexity: 'low' | 'medium' | 'high';
  tradeoffNotes: string[];
  leveragePoints: string[];
}

// Crew &amp; Operations Reality - Producer-Native Model
export type CrewDetailLevel = 'basic' | 'detailed';

export interface CrewBasicMode {
  staffingModel: 'local-hire' | 'touring-core' | 'full-touring' | 'hybrid-regional';
  totalCrewSize: number;
  accommodationStrategy: 'hotel-standard' | 'tour-bus' | 'local-commute' | 'mixed';
}

export interface CrewDetailedMode extends CrewBasicMode {
  travelModeDistribution: {
    air: number;
    ground: number;
    local: number;
  };
  averageTravelDistance: number;
  distanceUnit: 'miles' | 'kilometers';
  buildDays: number;
  strikeDays: number;
  crewWelfarePriority: 'cost-minimum' | 'standard-comfort' | 'premium-welfare';
  localHiringConstraint: 'no-constraint' | 'skill-availability' | 'consistency-required' | 'union-requirements' | 'trust-relationships';
  notes?: string;
}

export interface CrewOperationsData {
  detailLevel: CrewDetailLevel;
  basicMode?: CrewBasicMode;
  detailedMode?: CrewDetailedMode;
}

// Crew system impacts
export interface CrewSystemImpacts {
  travelCO2e: number;
  accommodationCO2e: number;
  totalCO2e: number;
  perPersonCO2e: number;
  leveragePoints: string[];
  tradeoffs: string[];
}

// Legacy interface for backward compatibility
export interface CrewOperationsDetails {
  staffingModel?: 'local-hire' | 'touring-core' | 'full-touring' | 'hybrid-regional';
  totalCrewSize?: number;
  accommodationStrategy?: 'hotel-standard' | 'tour-bus' | 'local-commute' | 'mixed';
  travelModeDistribution?: {
    air: number;
    ground: number;
    local: number;
  };
  averageTravelDistance?: number;
  distanceUnit?: 'miles' | 'kilometers';
  buildDays?: number;
  strikeDays?: number;
  crewWelfarePriority?: 'cost-minimum' | 'standard-comfort' | 'premium-welfare';
  localHiringConstraint?: 'no-constraint' | 'skill-availability' | 'consistency-required' | 'union-requirements' | 'trust-relationships';
  notes?: string;
}
