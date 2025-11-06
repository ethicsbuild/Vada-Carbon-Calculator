import { storage } from "../storage";
import { type CarbonCalculation, type InsertCarbonCalculation } from "@shared/schema";

export interface Scope1Data {
  // Direct emissions
  naturalGas?: number; // kWh
  propane?: number; // kg
  fuelOil?: number; // liters
  gasoline?: number; // liters
  diesel?: number; // liters
  refrigerants?: number; // kg CO2e
  processEmissions?: number; // tCO2e
}

export interface Scope2Data {
  // Indirect energy emissions
  electricity?: number; // kWh
  heating?: number; // kWh
  cooling?: number; // kWh
  steam?: number; // kWh
  gridEmissionFactor?: number; // kgCO2e/kWh
}

export interface Scope3Data {
  // Value chain emissions
  businessTravel?: number; // km
  employeeCommuting?: number; // km
  wasteGenerated?: number; // kg
  paperConsumption?: number; // kg
  waterConsumption?: number; // liters
  purchasedGoods?: number; // USD value
  transportationDistribution?: number; // km
  investmentsFinanced?: number; // USD value
}

export interface CalculationResult {
  scope1: number; // tCO2e
  scope2: number; // tCO2e
  scope3: number; // tCO2e
  total: number; // tCO2e
  breakdown: {
    scope1Details: Record<string, number>;
    scope2Details: Record<string, number>;
    scope3Details: Record<string, number>;
  };
}


// Influence weights for each emission category (0-100, representing % of control)
export interface InfluenceWeights {
  venue: number;
  energy: number;
  catering: number;
  waste: number;
  production: number;
  staffTravel: number;
  venueLocation: number;
  attendeeTravel: number;
  equipmentTransport: number;
}

export const DEFAULT_INFLUENCE_WEIGHTS: InfluenceWeights = {
  venue: 85,              // High control: venue selection and operations
  energy: 95,             // Very high control: direct energy choices
  catering: 90,           // Very high control: menu and sourcing decisions
  waste: 90,              // Very high control: waste management programs
  production: 95,         // Very high control: equipment and setup choices
  staffTravel: 60,        // Medium control: can encourage carpools, provide shuttles
  venueLocation: 50,      // Medium control: affects attendee travel patterns
  equipmentTransport: 70, // Medium-high control: logistics planning
  attendeeTravel: 10,     // Low control: mostly individual attendee choices
};

export interface InfluenceTierEmissions {
  total: number;
  categories: Record<string, number>;
  breakdown: Record<string, number>;
}

// Event-specific emission calculation interfaces
export interface EventEmissionData {
  eventType: string;
  attendance: number;
  duration: { days: number; hoursPerDay: number; };
  venue: {
    type: string;
    capacity: number;
    location: string;
    isOutdoor: boolean;
    hasExistingPower: boolean;
  };
  production: {
    numberOfStages: number;
    stageSize: string;
    audioVisual: {
      soundSystemSize: string;
      lightingRig: string;
      videoScreens: boolean;
      livestreaming: boolean;
    };
    powerRequirements: {
      generatorPower: boolean;
      generatorSize?: string;
      gridPowerUsage?: number;
    };
  };
  staffing: {
    totalStaff: number;
    onSiteStaff: number;
    crewSize: number;
  };
  transportation: {
    audienceTravel: {
      averageDistance: number;
      internationalAttendees?: number;
      domesticFlights?: number;
    };
    crewTransportation: {
      method: string;
      estimatedDistance: number;
      numberOfVehicles: number;
    };
    equipmentTransportation: {
      trucksRequired: number;
      averageDistance: number;
    };
  };
  catering: {
    foodServiceType: string;
    expectedMealsServed: number;
    isLocallySourced: boolean;
    alcoholServed: boolean;
  };
  waste: {
    recyclingProgram: boolean;
    wasteReductionMeasures: string[];
  };
}

export interface EventCalculationResult {
  venue: number;
  transportation: number;
  energy: number;
  catering: number;
  waste: number;
  accommodation?: number;
  production: number;
  total: number;
  breakdown: {
    venueDetails: Record<string, number>;
    transportationDetails: Record<string, number>;
    energyDetails: Record<string, number>;
    cateringDetails: Record<string, number>;
    wasteDetails: Record<string, number>;
    productionDetails: Record<string, number>;
  };
  emissionsPerAttendee: number;
  benchmarkComparison: {
    industryAverage: number;
    percentile: number;
    performance: string;
  };
    // New influence score fields
    influenceScore: number;
    highInfluenceEmissions: InfluenceTierEmissions;
    mediumInfluenceEmissions: InfluenceTierEmissions;
    lowInfluenceEmissions: InfluenceTierEmissions;
    influenceInsights: {
      category: string;
      message: string;
      impact: 'high' | 'medium' | 'low';
      actionable: boolean;
    }[];
}

export class CarbonCalculatorService {
  // GHG Protocol 2025 compliant emission factors (kgCO2e per unit)
  private readonly emissionFactors = {
    // Scope 1 factors
    naturalGas: 0.185, // per kWh
    propane: 2.96, // per kg
    fuelOil: 2.52, // per liter
    gasoline: 2.31, // per liter
    diesel: 2.68, // per liter
    
    // Scope 2 factors (grid average - varies by region)
    electricity: 0.475, // per kWh (US average)
    heating: 0.215, // per kWh
    cooling: 0.475, // per kWh
    steam: 0.185, // per kWh
    
    // Scope 3 factors
    businessTravel: 0.21, // per km (average transport)
    employeeCommuting: 0.18, // per km
    wasteGenerated: 0.5, // per kg
    paperConsumption: 1.2, // per kg
    waterConsumption: 0.0003, // per liter
    purchasedGoods: 0.0005, // per USD
    transportationDistribution: 0.12, // per km
    investmentsFinanced: 0.0001, // per USD
  };

  async calculateEmissions(
    scope1Data: Scope1Data,
    scope2Data: Scope2Data,
    scope3Data: Scope3Data,
    organizationSize: string,
    industry: string
  ): Promise<CalculationResult> {
    // Calculate Scope 1 emissions
    const scope1Results = this.calculateScope1(scope1Data);
    
    // Calculate Scope 2 emissions
    const scope2Results = this.calculateScope2(scope2Data);
    
    // Calculate Scope 3 emissions
    const scope3Results = this.calculateScope3(scope3Data, organizationSize, industry);
    
    const total = scope1Results.total + scope2Results.total + scope3Results.total;
    
    return {
      scope1: scope1Results.total,
      scope2: scope2Results.total,
      scope3: scope3Results.total,
      total,
      breakdown: {
        scope1Details: scope1Results.breakdown,
        scope2Details: scope2Results.breakdown,
        scope3Details: scope3Results.breakdown,
      }
    };
  }

  private calculateScope1(data: Scope1Data): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    if (data.naturalGas) {
      const emissions = (data.naturalGas * this.emissionFactors.naturalGas) / 1000; // Convert to tCO2e
      breakdown.naturalGas = emissions;
      total += emissions;
    }

    if (data.propane) {
      const emissions = (data.propane * this.emissionFactors.propane) / 1000;
      breakdown.propane = emissions;
      total += emissions;
    }

    if (data.fuelOil) {
      const emissions = (data.fuelOil * this.emissionFactors.fuelOil) / 1000;
      breakdown.fuelOil = emissions;
      total += emissions;
    }

    if (data.gasoline) {
      const emissions = (data.gasoline * this.emissionFactors.gasoline) / 1000;
      breakdown.gasoline = emissions;
      total += emissions;
    }

    if (data.diesel) {
      const emissions = (data.diesel * this.emissionFactors.diesel) / 1000;
      breakdown.diesel = emissions;
      total += emissions;
    }

    if (data.refrigerants) {
      const emissions = data.refrigerants / 1000; // Already in CO2e
      breakdown.refrigerants = emissions;
      total += emissions;
    }

    if (data.processEmissions) {
      breakdown.processEmissions = data.processEmissions;
      total += data.processEmissions;
    }

    return { total, breakdown };
  }

  private calculateScope2(data: Scope2Data): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    const emissionFactor = data.gridEmissionFactor || this.emissionFactors.electricity;

    if (data.electricity) {
      const emissions = (data.electricity * emissionFactor) / 1000;
      breakdown.electricity = emissions;
      total += emissions;
    }

    if (data.heating) {
      const emissions = (data.heating * this.emissionFactors.heating) / 1000;
      breakdown.heating = emissions;
      total += emissions;
    }

    if (data.cooling) {
      const emissions = (data.cooling * this.emissionFactors.cooling) / 1000;
      breakdown.cooling = emissions;
      total += emissions;
    }

    if (data.steam) {
      const emissions = (data.steam * this.emissionFactors.steam) / 1000;
      breakdown.steam = emissions;
      total += emissions;
    }

    return { total, breakdown };
  }

  private calculateScope3(
    data: Scope3Data, 
    organizationSize: string, 
    industry: string
  ): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Apply industry and size multipliers for more accurate estimates
    const industryMultiplier = this.getIndustryMultiplier(industry);
    const sizeMultiplier = this.getSizeMultiplier(organizationSize);

    // Prioritize detailed journey emissions for accuracy
    if (data.journeyEmissions && data.journeyEmissions.totalCO2eTonnes > 0) {
      // Use pre-calculated mode-specific emissions from Journey Planner
      const emissions = data.journeyEmissions.totalCO2eTonnes * sizeMultiplier;
      breakdown.businessTravel = emissions;
      
      // Add detailed breakdown for each transport mode
      data.journeyEmissions.journeyBreakdown.forEach((journey, index) => {
        const key = `businessTravel_${journey.transportMode}_${index + 1}`;
        breakdown[key] = (journey.co2eTonnes * sizeMultiplier);
      });
      
      total += emissions;
    } else if (data.businessTravel) {
      // Fallback to distance-based calculation for backward compatibility
      const emissions = (data.businessTravel * this.emissionFactors.businessTravel * sizeMultiplier) / 1000;
      breakdown.businessTravel = emissions;
      total += emissions;
    }

    if (data.employeeCommuting) {
      const emissions = (data.employeeCommuting * this.emissionFactors.employeeCommuting * sizeMultiplier) / 1000;
      breakdown.employeeCommuting = emissions;
      total += emissions;
    }

    if (data.wasteGenerated) {
      const emissions = (data.wasteGenerated * this.emissionFactors.wasteGenerated) / 1000;
      breakdown.wasteGenerated = emissions;
      total += emissions;
    }

    if (data.paperConsumption) {
      const emissions = (data.paperConsumption * this.emissionFactors.paperConsumption) / 1000;
      breakdown.paperConsumption = emissions;
      total += emissions;
    }

    if (data.waterConsumption) {
      const emissions = (data.waterConsumption * this.emissionFactors.waterConsumption) / 1000;
      breakdown.waterConsumption = emissions;
      total += emissions;
    }

    if (data.purchasedGoods) {
      const emissions = (data.purchasedGoods * this.emissionFactors.purchasedGoods * industryMultiplier) / 1000;
      breakdown.purchasedGoods = emissions;
      total += emissions;
    }

    if (data.transportationDistribution) {
      const emissions = (data.transportationDistribution * this.emissionFactors.transportationDistribution) / 1000;
      breakdown.transportationDistribution = emissions;
      total += emissions;
    }

    if (data.investmentsFinanced) {
      const emissions = (data.investmentsFinanced * this.emissionFactors.investmentsFinanced) / 1000;
      breakdown.investmentsFinanced = emissions;
      total += emissions;
    }

    return { total, breakdown };
  }

  private getIndustryMultiplier(industry: string): number {
    const multipliers: Record<string, number> = {
      manufacturing: 1.5,
      energy: 2.0,
      transportation: 1.8,
      construction: 1.3,
      agriculture: 1.2,
      technology: 0.8,
      finance: 0.7,
      healthcare: 0.9,
      retail: 1.1,
      other: 1.0,
    };
    return multipliers[industry] || 1.0;
  }

  private getSizeMultiplier(size: string): number {
    const multipliers: Record<string, number> = {
      "1-10": 0.5,
      "11-50": 0.8,
      "51-200": 1.0,
      "201-500": 1.2,
      "501-1000": 1.5,
      "1000+": 2.0,
    };
    return multipliers[size] || 1.0;
  }

  async estimateEmissions(
    organizationType: string,
    organizationSize: string,
    industry: string,
    annualRevenue?: number
  ): Promise<CalculationResult> {
    // AI-powered estimation based on industry benchmarks
    const baselineEmissions = this.getIndustryBaseline(industry, organizationSize);
    
    // Adjust based on organization type
    const typeMultiplier = this.getTypeMultiplier(organizationType);
    
    const estimatedTotal = baselineEmissions * typeMultiplier;
    
    // Typical breakdown ratios
    const scope1 = estimatedTotal * 0.25;
    const scope2 = estimatedTotal * 0.45;
    const scope3 = estimatedTotal * 0.30;
    
    return {
      scope1,
      scope2,
      scope3,
      total: estimatedTotal,
      breakdown: {
        scope1Details: { estimated: scope1 },
        scope2Details: { estimated: scope2 },
        scope3Details: { estimated: scope3 },
      }
    };
  }

  private getIndustryBaseline(industry: string, size: string): number {
    // Industry baselines in tCO2e per year based on size
    const baselines: Record<string, Record<string, number>> = {
      technology: {
        "1-10": 5,
        "11-50": 25,
        "51-200": 100,
        "201-500": 300,
        "501-1000": 600,
        "1000+": 1500,
      },
      manufacturing: {
        "1-10": 15,
        "11-50": 75,
        "51-200": 300,
        "201-500": 900,
        "501-1000": 1800,
        "1000+": 4500,
      },
      retail: {
        "1-10": 8,
        "11-50": 40,
        "51-200": 160,
        "201-500": 480,
        "501-1000": 960,
        "1000+": 2400,
      },
      finance: {
        "1-10": 6,
        "11-50": 30,
        "51-200": 120,
        "201-500": 360,
        "501-1000": 720,
        "1000+": 1800,
      },
      healthcare: {
        "1-10": 10,
        "11-50": 50,
        "51-200": 200,
        "201-500": 600,
        "501-1000": 1200,
        "1000+": 3000,
      },
    };
    
    return baselines[industry]?.[size] || baselines.technology[size] || 100;
  }

  private getTypeMultiplier(type: string): number {
    const multipliers: Record<string, number> = {
      corporate: 1.0,
      government: 0.8,
      ngo: 0.6,
      university: 0.7,
      event: 0.3,
    };
    return multipliers[type] || 1.0;
  }

  // Event-specific emission calculation methods

  // Calculate influence score and tier emissions
  private calculateInfluenceMetrics(
    venueEmissions: number,
    transportationResults: { total: number; breakdown: Record<string, number> },
    energyEmissions: number,
    cateringEmissions: number,
    wasteEmissions: number,
    productionEmissions: number,
    eventData: EventEmissionData
  ): {
    influenceScore: number;
    highInfluenceEmissions: InfluenceTierEmissions;
    mediumInfluenceEmissions: InfluenceTierEmissions;
    lowInfluenceEmissions: InfluenceTierEmissions;
    influenceInsights: { category: string; message: string; impact: 'high' | 'medium' | 'low'; actionable: boolean }[];
  } {
    const weights = DEFAULT_INFLUENCE_WEIGHTS;

    // Categorize emissions by influence level
    const highInfluence: InfluenceTierEmissions = {
      total: 0,
      categories: {},
      breakdown: {}
    };

    const mediumInfluence: InfluenceTierEmissions = {
      total: 0,
      categories: {},
      breakdown: {}
    };

    const lowInfluence: InfluenceTierEmissions = {
      total: 0,
      categories: {},
      breakdown: {}
    };

    // High influence (85-100%)
    if (weights.venue >= 85) {
      highInfluence.categories.venue = venueEmissions;
      highInfluence.total += venueEmissions;
    }
    if (weights.energy >= 85) {
      highInfluence.categories.energy = energyEmissions;
      highInfluence.total += energyEmissions;
    }
    if (weights.catering >= 85) {
      highInfluence.categories.catering = cateringEmissions;
      highInfluence.total += cateringEmissions;
    }
    if (weights.waste >= 85) {
      highInfluence.categories.waste = wasteEmissions;
      highInfluence.total += wasteEmissions;
    }
    if (weights.production >= 85) {
      highInfluence.categories.production = productionEmissions;
      highInfluence.total += productionEmissions;
    }

    // Medium influence (40-84%)
    // Extract staff and equipment travel from transportation breakdown
    const staffTravel = transportationResults.breakdown.crewTransport || 0;
    const equipmentTransport = transportationResults.breakdown.equipmentShipping || 0;
    const attendeeTravel = transportationResults.total - staffTravel - equipmentTransport;

    if (weights.staffTravel >= 40 && weights.staffTravel < 85) {
      mediumInfluence.categories.staffTravel = staffTravel;
      mediumInfluence.total += staffTravel;
    }
    if (weights.equipmentTransport >= 40 && weights.equipmentTransport < 85) {
      mediumInfluence.categories.equipmentTransport = equipmentTransport;
      mediumInfluence.total += equipmentTransport;
    }
    if (weights.venueLocation >= 40 && weights.venueLocation < 85) {
      // Venue location influence is reflected in attendee travel patterns
      const venueLocationImpact = attendeeTravel * (weights.venueLocation / 100);
      mediumInfluence.categories.venueLocation = venueLocationImpact;
      mediumInfluence.total += venueLocationImpact;
    }

    // Low influence (<40%)
    if (weights.attendeeTravel < 40) {
      lowInfluence.categories.attendeeTravel = attendeeTravel;
      lowInfluence.total += attendeeTravel;
    }

    // Calculate influence score (0-100)
    // Score based on performance in high-influence areas compared to benchmarks
    const highInfluencePerAttendee = highInfluence.total / eventData.attendance;
    const benchmarks: Record<string, number> = {
      concert: 0.005,
      festival: 0.008,
      conference: 0.004,
      sports_event: 0.006,
      theater_performance: 0.003,
      wedding: 0.002,
      corporate_event: 0.003,
      trade_show: 0.005,
      community_event: 0.002,
      outdoor_event: 0.007,
      other: 0.005
    };

    const highInfluenceBenchmark = benchmarks[eventData.eventType] || 0.005;
    const performanceRatio = highInfluencePerAttendee / highInfluenceBenchmark;

    // Convert to 0-100 score (lower emissions = higher score)
    let influenceScore = 100;
    if (performanceRatio <= 0.5) {
      influenceScore = 100; // Excellent
    } else if (performanceRatio <= 0.75) {
      influenceScore = 90; // Very good
    } else if (performanceRatio <= 1.0) {
      influenceScore = 75; // Good
    } else if (performanceRatio <= 1.5) {
      influenceScore = 60; // Fair
    } else if (performanceRatio <= 2.0) {
      influenceScore = 40; // Needs improvement
    } else {
      influenceScore = 20; // Poor
    }

    // Generate insights
    const insights: { category: string; message: string; impact: 'high' | 'medium' | 'low'; actionable: boolean }[] = [];

    // High influence insights
    if (energyEmissions > 0) {
      const hasRenewable = eventData.production?.powerRequirements?.gridPowerUsage && !eventData.production?.powerRequirements?.generatorPower;
      if (hasRenewable) {
        insights.push({
          category: 'Energy',
          message: 'Excellent use of grid power over generators. Consider renewable energy certificates for even greater impact.',
          impact: 'high',
          actionable: true
        });
      } else {
        insights.push({
          category: 'Energy',
          message: 'Switching from generators to grid power or renewable sources could significantly reduce your footprint.',
          impact: 'high',
          actionable: true
        });
      }
    }

    if (cateringEmissions > 0) {
      const isLocallySourced = eventData.catering?.isLocallySourced;
      if (isLocallySourced) {
        insights.push({
          category: 'Catering',
          message: 'Great job sourcing locally! Consider increasing plant-based options for additional impact.',
          impact: 'high',
          actionable: true
        });
      } else {
        insights.push({
          category: 'Catering',
          message: 'Local sourcing and plant-based menu options can reduce catering emissions by up to 50%.',
          impact: 'high',
          actionable: true
        });
      }
    }

    if (wasteEmissions > 0) {
      const hasRecycling = eventData.waste?.recyclingProgram;
      if (hasRecycling) {
        insights.push({
          category: 'Waste',
          message: 'Your recycling program is making a difference! Consider adding composting for organic waste.',
          impact: 'high',
          actionable: true
        });
      } else {
        insights.push({
          category: 'Waste',
          message: 'Implementing a comprehensive recycling and composting program could reduce waste emissions by 40%.',
          impact: 'high',
          actionable: true
        });
      }
    }

    // Medium influence insights
    if (staffTravel > 0) {
      insights.push({
        category: 'Staff Travel',
        message: 'Consider organizing carpools or shuttle services for staff to reduce transportation emissions.',
        impact: 'medium',
        actionable: true
      });
    }

    // Low influence context
    if (attendeeTravel > 0) {
      const percentOfTotal = (attendeeTravel / (highInfluence.total + mediumInfluence.total + lowInfluence.total)) * 100;
      insights.push({
        category: 'Attendee Travel',
        message: `Attendee travel represents ${percentOfTotal.toFixed(0)}% of your total footprint. While largely outside your control, your transit-accessible venue choice helps minimize this impact.`,
        impact: 'low',
        actionable: false
      });
    }

    return {
      influenceScore,
      highInfluenceEmissions: highInfluence,
      mediumInfluenceEmissions: mediumInfluence,
      lowInfluenceEmissions: lowInfluence,
      influenceInsights: insights
    };
  }

  async calculateEventEmissions(eventData: EventEmissionData): Promise<EventCalculationResult> {
    // Calculate emissions for each category
    const venueResults = this.calculateVenueEmissions(eventData);
    const transportationResults = this.calculateEventTransportation(eventData);
    const energyResults = this.calculateEventEnergy(eventData);
    const cateringResults = this.calculateEventCatering(eventData);
    const wasteResults = this.calculateEventWaste(eventData);
    const productionResults = this.calculateEventProduction(eventData);

    const total = venueResults.total + transportationResults.total + energyResults.total + 
                 cateringResults.total + wasteResults.total + productionResults.total;

    const emissionsPerAttendee = total / eventData.attendance;
    const benchmarkComparison = this.getEventBenchmarkComparison(eventData.eventType, emissionsPerAttendee);

    // Calculate influence metrics
    const influenceMetrics = this.calculateInfluenceMetrics(
      venueResults.total,
      transportationResults,
      energyResults.total,
      cateringResults.total,
      wasteResults.total,
      productionResults.total,
      eventData
    );

    return {
      venue: venueResults.total,
      transportation: transportationResults.total,
      energy: energyResults.total,
      catering: cateringResults.total,
      waste: wasteResults.total,
      production: productionResults.total,
      total,
      breakdown: {
        venueDetails: venueResults.breakdown,
        transportationDetails: transportationResults.breakdown,
        energyDetails: energyResults.breakdown,
        cateringDetails: cateringResults.breakdown,
        wasteDetails: wasteResults.breakdown,
        productionDetails: productionResults.breakdown,
      },
        ...influenceMetrics,
      emissionsPerAttendee,
      benchmarkComparison,
    };
  }

  private calculateVenueEmissions(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Defensive check for venue and duration data
    if (!eventData.venue || !eventData.duration) {
      // Fallback: Use attendance as proxy for venue capacity
      const estimatedCapacity = eventData.attendance * 1.2;
      const estimatedDays = typeof eventData.duration === 'number' ? eventData.duration : 1;
      const venueBaseEmissions = estimatedCapacity * 0.001 * estimatedDays;
      breakdown.venueBase = venueBaseEmissions;
      total += venueBaseEmissions;
      return { total, breakdown };
    }

    // Base venue emissions (heating, cooling, lighting)
    const capacity = eventData.venue.capacity || eventData.attendance * 1.2;
    const days = eventData.duration.days || 1;
    const venueBaseEmissions = capacity * 0.001 * days; // tCO2e
    breakdown.venueBase = venueBaseEmissions;
    total += venueBaseEmissions;

    // Outdoor venue additional emissions (temporary structures, security)
    if (eventData.venue.isOutdoor) {
      const outdoorMultiplier = 1.3;
      const outdoorEmissions = venueBaseEmissions * 0.3;
      breakdown.outdoorStructures = outdoorEmissions;
      total += outdoorEmissions;
    }

    return { total, breakdown };
  }

  private calculateEventTransportation(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Defensive check for transportation data
    if (!eventData.transportation) {
      // Minimal fallback based on attendance
      const estimatedEmissions = eventData.attendance * 0.05; // Rough estimate
      breakdown.estimatedTransport = estimatedEmissions;
      total += estimatedEmissions;
      return { total, breakdown };
    }

    // Audience travel emissions
    const avgDistance = eventData.transportation.audienceTravel?.averageDistance || 50; // Default 50km
    const audienceEmissions = eventData.attendance * avgDistance * 0.21 / 1000; // tCO2e
    breakdown.audienceTravel = audienceEmissions;
    total += audienceEmissions;

    // International attendees (flights)
    if (eventData.transportation.audienceTravel?.internationalAttendees) {
      const intlFlightEmissions = eventData.transportation.audienceTravel.internationalAttendees * 2.5; // avg international flight
      breakdown.internationalFlights = intlFlightEmissions;
      total += intlFlightEmissions;
    }

    // Crew transportation
    if (eventData.staffing && eventData.transportation.crewTransportation) {
      const totalStaff = eventData.staffing.totalStaff || Math.ceil(eventData.attendance / 50);
      const crewDistance = eventData.transportation.crewTransportation.estimatedDistance || 30;
      const crewTransportEmissions = totalStaff * crewDistance * 0.21 / 1000;
      breakdown.crewTransport = crewTransportEmissions;
      total += crewTransportEmissions;
    }

    // Equipment transportation
    if (eventData.transportation.equipmentTransportation) {
      const trucks = eventData.transportation.equipmentTransportation.trucksRequired || 0;
      const distance = eventData.transportation.equipmentTransportation.averageDistance || 0;
      const equipmentEmissions = trucks * distance * 0.85 / 1000; // Heavy truck factor
      breakdown.equipmentShipping = equipmentEmissions;
      total += equipmentEmissions;
    }

    return { total, breakdown };
  }

  private calculateEventEnergy(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Defensive check for production data
    if (!eventData.production || !eventData.production.powerRequirements) {
      // Minimal fallback energy estimate
      const days = eventData.duration?.days || (typeof eventData.duration === 'number' ? eventData.duration : 1);
      const estimatedPower = eventData.attendance * 0.5 * days / 1000; // Rough estimate
      breakdown.estimatedEnergy = estimatedPower;
      total += estimatedPower;
      return { total, breakdown };
    }

    // Generator power emissions (if used)
    if (eventData.production.powerRequirements.generatorPower) {
      const generatorSizeMultipliers = { small: 50, medium: 150, large: 400, multiple: 800 }; // kW
      const generatorSize = generatorSizeMultipliers[eventData.production.powerRequirements.generatorSize || 'medium'];
      const days = eventData.duration?.days || 1;
      const hoursPerDay = eventData.duration?.hoursPerDay || 8;
      const generatorHours = days * hoursPerDay + 4; // Include setup
      const generatorEmissions = generatorSize * generatorHours * 0.75 / 1000; // Diesel generator factor
      breakdown.generatorPower = generatorEmissions;
      total += generatorEmissions;
    }

    // Grid power usage
    if (eventData.production.powerRequirements.gridPowerUsage) {
      const gridEmissions = eventData.production.powerRequirements.gridPowerUsage * 0.475 / 1000; // Grid factor
      breakdown.gridPower = gridEmissions;
      total += gridEmissions;
    }

    return { total, breakdown };
  }

  private calculateEventCatering(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Defensive check for catering data
    if (!eventData.catering) {
      // Minimal fallback estimate
      const days = eventData.duration?.days || (typeof eventData.duration === 'number' ? eventData.duration : 1);
      const estimatedMeals = eventData.attendance * days;
      const estimatedEmissions = estimatedMeals * 3.5 / 1000; // Mid-range estimate
      breakdown.estimatedCatering = estimatedEmissions;
      total += estimatedEmissions;
      return { total, breakdown };
    }

    const mealsServed = eventData.catering.expectedMealsServed || 0;
    if (mealsServed > 0) {
      // Base catering emissions per meal
      const baseEmissionPerMeal = eventData.catering.isLocallySourced ? 2.5 : 4.0; // kgCO2e per meal
      const cateringEmissions = mealsServed * baseEmissionPerMeal / 1000;
      breakdown.foodService = cateringEmissions;
      total += cateringEmissions;

      // Alcohol service additional emissions
      if (eventData.catering.alcoholServed) {
        const alcoholEmissions = eventData.attendance * 0.5 / 1000; // Additional alcohol transport/cooling
        breakdown.alcoholService = alcoholEmissions;
        total += alcoholEmissions;
      }
    }

    return { total, breakdown };
  }

  private calculateEventWaste(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Base waste generation (kg per attendee per day)
    const wastePerAttendeePerDay = 2.5;
    const days = eventData.duration?.days || (typeof eventData.duration === 'number' ? eventData.duration : 1);
    const totalWaste = eventData.attendance * wastePerAttendeePerDay * days;

    // Recycling program reduces emissions
    const hasRecycling = eventData.waste?.recyclingProgram || false;
    const wasteEmissionFactor = hasRecycling ? 0.3 : 0.5; // kgCO2e per kg waste
    const wasteEmissions = totalWaste * wasteEmissionFactor / 1000;
    breakdown.wasteGeneration = wasteEmissions;
    total += wasteEmissions;

    return { total, breakdown };
  }

  private calculateEventProduction(eventData: EventEmissionData): { total: number; breakdown: Record<string, number> } {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Defensive check for production data
    if (!eventData.production || !eventData.production.audioVisual) {
      // Minimal fallback estimate
      const estimatedProduction = eventData.attendance * 0.01; // Rough estimate
      breakdown.estimatedProduction = estimatedProduction;
      total += estimatedProduction;
      return { total, breakdown };
    }

    // Audio/Visual equipment emissions
    const soundSystemMultipliers = { small: 0.5, medium: 1.0, large: 2.0, festival: 4.0 };
    const lightingMultipliers = { basic: 0.3, medium: 0.8, elaborate: 1.5, festival: 3.0 };

    const soundEmissions = soundSystemMultipliers[eventData.production.audioVisual.soundSystemSize] || 1.0;
    const lightingEmissions = lightingMultipliers[eventData.production.audioVisual.lightingRig] || 0.8;

    breakdown.audioSystem = soundEmissions;
    breakdown.lightingSystem = lightingEmissions;
    total += soundEmissions + lightingEmissions;

    // Video screens
    if (eventData.production.audioVisual.videoScreens) {
      const days = eventData.duration?.days || 1;
      const videoEmissions = 0.5 * days;
      breakdown.videoScreens = videoEmissions;
      total += videoEmissions;
    }

    // Livestreaming additional equipment
    if (eventData.production.audioVisual.livestreaming) {
      const days = eventData.duration?.days || 1;
      const streamingEmissions = 0.3 * days;
      breakdown.livestreaming = streamingEmissions;
      total += streamingEmissions;
    }

    return { total, breakdown };
  }

  private getEventBenchmarkComparison(eventType: string, emissionsPerAttendee: number): { industryAverage: number; percentile: number; performance: string } {
    const benchmarks: Record<string, number> = {
      concert: 0.012,
      festival: 0.025,
      conference: 0.008,
      sports_event: 0.015,
      theater_performance: 0.006,
      wedding: 0.005,
      corporate_event: 0.007,
      trade_show: 0.010,
      community_event: 0.004,
      outdoor_event: 0.020,
      other: 0.010
    };

    const industryAverage = benchmarks[eventType] || 0.010;
    const ratio = emissionsPerAttendee / industryAverage;
    
    let percentile = 50;
    let performance = "average";
    
    if (ratio <= 0.75) {
      percentile = 25;
      performance = "excellent";
    } else if (ratio <= 1.0) {
      percentile = 40;
      performance = "good";
    } else if (ratio <= 1.5) {
      percentile = 75;
      performance = "needs improvement";
    } else {
      percentile = 90;
      performance = "poor";
    }

    return { industryAverage, percentile, performance };
  }

  async saveCalculation(
    userId: number,
    organizationId: number,
    calculationData: InsertCarbonCalculation,
    result: CalculationResult
  ): Promise<CarbonCalculation> {
    const calculation = await storage.createCarbonCalculation({
      ...calculationData,
      userId,
      organizationId,
      scope1Emissions: result.scope1.toString(),
      scope2Emissions: result.scope2.toString(),
      scope3Emissions: result.scope3.toString(),
      totalEmissions: result.total.toString(),
      calculatedAt: new Date(),
      status: "completed",
    });

    // Award achievements
    await this.checkAndAwardAchievements(userId, calculation);

    return calculation;
  }

  private async checkAndAwardAchievements(userId: number, calculation: CarbonCalculation): Promise<void> {
    const userCalculations = await storage.getCarbonCalculationsByUser(userId);
    const existingAchievements = await storage.getUserAchievements(userId);
    const achievementTypes = existingAchievements.map(a => a.achievementType);

    // First calculation achievement
    if (userCalculations.length === 1 && !achievementTypes.includes("first_calculation")) {
      await storage.createUserAchievement({
        userId,
        achievementType: "first_calculation",
        title: "Carbon Pioneer",
        description: "Completed your first carbon footprint calculation",
        icon: "emoji_events",
      });
    }

    // Scope 3 master achievement
    if (calculation.scope3Data && !achievementTypes.includes("scope3_master")) {
      await storage.createUserAchievement({
        userId,
        achievementType: "scope3_master",
        title: "Scope 3 Master",
        description: "Completed comprehensive Scope 3 emissions calculation",
        icon: "eco",
      });
    }

    // Trend tracker achievement (multiple calculations)
    if (userCalculations.length >= 3 && !achievementTypes.includes("trend_tracker")) {
      await storage.createUserAchievement({
        userId,
        achievementType: "trend_tracker",
        title: "Trend Tracker",
        description: "Tracked carbon emissions over multiple periods",
        icon: "timeline",
      });
    }
  }
}

export const carbonCalculatorService = new CarbonCalculatorService();
