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
    userPreferences?: {
      detailLevel: 'basic' | 'intermediate' | 'expert';
      estimationMode: boolean;
      priorityScopes: string[];
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
  scope1Complete: boolean;
  scope2Complete: boolean;
  scope3Complete: boolean;
  calculationComplete: boolean;
}
