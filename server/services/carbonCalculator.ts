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

    if (data.businessTravel) {
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
