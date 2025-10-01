/**
 * Unit Translation Engine
 *
 * Converts natural language descriptions to carbon emissions (tCO2e)
 * Examples: "30-foot vinyl backdrop" → 0.125 tCO2e
 *           "10 diesel generators" → calculate based on usage
 *           "catering for 500 people" → estimate based on meal type
 */

import OpenAI from "openai";
import { SageRiverstonePersona, LanguageTier } from "./persona";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface UnitConversion {
  originalDescription: string;
  parsedQuantity: number;
  parsedUnit: string;
  standardUnit: string;
  standardQuantity: number;
  materialType?: string;
}

export interface EmissionCalculation {
  item: string;
  quantity: number;
  unit: string;
  emissionFactor: number;
  emissionFactorUnit: string;
  totalEmissions: number; // in tCO2e
  category: "materials" | "energy" | "transportation" | "waste" | "food" | "other";
  confidence: number;
  explanation: string;
  source: string;
}

export interface TranslationResult {
  originalInput: string;
  conversions: UnitConversion[];
  calculations: EmissionCalculation[];
  totalEmissions: number;
  metaphor: string;
  detailedBreakdown: string;
}

export class UnitTranslatorService {
  // Comprehensive emission factor database for event production items
  private readonly emissionFactorDatabase = {
    // Materials (kgCO2e per unit)
    materials: {
      vinyl_banner: { factor: 4.2, unit: "kg per sqm", source: "ISO 14040 LCA" },
      fabric_banner: { factor: 2.8, unit: "kg per sqm", source: "ISO 14040 LCA" },
      wood_staging: { factor: 0.45, unit: "kg per kg", source: "ICE Database 2025" },
      steel_truss: { factor: 2.1, unit: "kg per kg", source: "ICE Database 2025" },
      aluminum_truss: { factor: 8.2, unit: "kg per kg", source: "ICE Database 2025" },
      plywood_sheet: { factor: 0.65, unit: "kg per sheet (4x8)", source: "ICE Database 2025" },
      carpet_flooring: { factor: 3.5, unit: "kg per sqm", source: "Carpet America 2024" },
      plastic_signage: { factor: 6.0, unit: "kg per kg", source: "Plastics Europe 2024" },
      led_screen: { factor: 150, unit: "kg per sqm per event", source: "Event Industry 2024" },
      paper_program: { factor: 1.2, unit: "kg per kg", source: "Paper Industry 2025" },
    },

    // Energy (kgCO2e per unit)
    energy: {
      diesel_generator: { factor: 2.68, unit: "kg per liter", source: "GHG Protocol 2025" },
      gasoline_generator: { factor: 2.31, unit: "kg per liter", source: "GHG Protocol 2025" },
      grid_electricity_us: { factor: 0.475, unit: "kg per kWh", source: "EPA eGRID 2025" },
      grid_electricity_eu: { factor: 0.295, unit: "kg per kWh", source: "EEA 2025" },
      propane: { factor: 2.96, unit: "kg per kg", source: "GHG Protocol 2025" },
      natural_gas: { factor: 0.185, unit: "kg per kWh", source: "GHG Protocol 2025" },
    },

    // Transportation (kgCO2e per unit)
    transportation: {
      semi_truck_diesel: { factor: 0.85, unit: "kg per km", source: "GHG Protocol 2025" },
      van_diesel: { factor: 0.21, unit: "kg per km", source: "GHG Protocol 2025" },
      car_gasoline: { factor: 0.18, unit: "kg per km", source: "GHG Protocol 2025" },
      bus_diesel: { factor: 0.12, unit: "kg per passenger-km", source: "GHG Protocol 2025" },
      domestic_flight: { factor: 0.25, unit: "kg per passenger-km", source: "DEFRA 2025" },
      international_flight: { factor: 0.18, unit: "kg per passenger-km", source: "DEFRA 2025" },
      train_diesel: { factor: 0.04, unit: "kg per passenger-km", source: "DEFRA 2025" },
      train_electric: { factor: 0.006, unit: "kg per passenger-km", source: "DEFRA 2025" },
    },

    // Food & Catering (kgCO2e per unit)
    food: {
      beef_meal: { factor: 7.2, unit: "kg per meal", source: "Oxford Food Climate 2024" },
      chicken_meal: { factor: 2.9, unit: "kg per meal", source: "Oxford Food Climate 2024" },
      fish_meal: { factor: 3.5, unit: "kg per meal", source: "Oxford Food Climate 2024" },
      vegetarian_meal: { factor: 1.5, unit: "kg per meal", source: "Oxford Food Climate 2024" },
      vegan_meal: { factor: 0.9, unit: "kg per meal", source: "Oxford Food Climate 2024" },
      mixed_catering: { factor: 3.5, unit: "kg per meal", source: "Event Industry 2024" },
      local_catering: { factor: 2.5, unit: "kg per meal", source: "Event Industry 2024" },
      bottled_water: { factor: 0.15, unit: "kg per liter", source: "Beverage Industry 2024" },
      beer_keg: { factor: 0.9, unit: "kg per liter", source: "Beverage Industry 2024" },
      wine_bottle: { factor: 1.8, unit: "kg per bottle", source: "Wine Institute 2024" },
    },

    // Waste (kgCO2e per unit)
    waste: {
      landfill_waste: { factor: 0.5, unit: "kg per kg", source: "EPA WARM 2025" },
      recycled_waste: { factor: 0.1, unit: "kg per kg", source: "EPA WARM 2025" },
      composted_waste: { factor: 0.05, unit: "kg per kg", source: "EPA WARM 2025" },
    },
  };

  /**
   * Main translation function: natural language → tCO2e
   */
  async translateToEmissions(
    naturalInput: string,
    eventContext?: Record<string, any>
  ): Promise<TranslationResult> {
    // Step 1: Parse natural language to extract quantities and items
    const parsed = await this.parseNaturalLanguage(naturalInput, eventContext);

    // Step 2: Convert units to standard formats
    const conversions = await this.convertUnits(parsed);

    // Step 3: Calculate emissions for each item
    const calculations = await this.calculateEmissions(conversions, eventContext);

    // Step 4: Sum total emissions
    const totalEmissions = calculations.reduce((sum, calc) => sum + calc.totalEmissions, 0);

    // Step 5: Generate metaphor and explanation
    const metaphor = SageRiverstonePersona.generateMetaphor(totalEmissions);
    const detailedBreakdown = this.generateDetailedBreakdown(calculations);

    return {
      originalInput: naturalInput,
      conversions,
      calculations,
      totalEmissions,
      metaphor,
      detailedBreakdown,
    };
  }

  /**
   * Parse natural language to extract structured data
   */
  private async parseNaturalLanguage(
    input: string,
    context?: Record<string, any>
  ): Promise<any[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting quantities, units, and materials from event production descriptions.

Extract all items mentioned with their quantities and units. Be specific about materials and dimensions.

Examples:
- "30-foot vinyl backdrop" → {quantity: 30, unit: "feet", item: "vinyl backdrop", material: "vinyl"}
- "10 diesel generators running 8 hours" → {quantity: 10, unit: "generators", item: "diesel generator", duration: 8, duration_unit: "hours"}
- "catering for 500 people, mostly chicken" → {quantity: 500, unit: "meals", item: "catering", meal_type: "chicken"}
- "3 semi-trucks driving 200 miles" → {quantity: 3, unit: "trucks", item: "semi-truck", distance: 200, distance_unit: "miles"}

Context: ${JSON.stringify(context || {})}

Return JSON array of items with: {quantity, unit, item, material, duration, distance, specifications}`
          },
          {
            role: "user",
            content: input
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.items || [];
    } catch (error) {
      console.error("Error parsing natural language:", error);
      return [];
    }
  }

  /**
   * Convert various units to standard formats
   */
  private async convertUnits(parsedItems: any[]): Promise<UnitConversion[]> {
    const conversions: UnitConversion[] = [];

    for (const item of parsedItems) {
      const conversion = await this.convertSingleUnit(item);
      if (conversion) {
        conversions.push(conversion);
      }
    }

    return conversions;
  }

  /**
   * Convert a single item's units to standard format
   */
  private async convertSingleUnit(item: any): Promise<UnitConversion | null> {
    const description = `${item.quantity} ${item.unit} ${item.item}`;

    // Handle dimensional conversions
    if (item.unit === "feet" && (item.item.includes("backdrop") || item.item.includes("banner"))) {
      // Assume standard height (8 feet for backdrops)
      const lengthFeet = item.quantity;
      const heightFeet = item.height || 8;
      const sqft = lengthFeet * heightFeet;
      const sqm = sqft * 0.092903; // Convert to square meters

      return {
        originalDescription: description,
        parsedQuantity: item.quantity,
        parsedUnit: item.unit,
        standardUnit: "sqm",
        standardQuantity: sqm,
        materialType: item.material || "vinyl",
      };
    }

    // Handle weight conversions
    if (["lbs", "pounds", "lb"].includes(item.unit?.toLowerCase())) {
      return {
        originalDescription: description,
        parsedQuantity: item.quantity,
        parsedUnit: item.unit,
        standardUnit: "kg",
        standardQuantity: item.quantity * 0.453592,
        materialType: item.material,
      };
    }

    // Handle distance conversions
    if (["miles", "mi"].includes(item.unit?.toLowerCase())) {
      return {
        originalDescription: description,
        parsedQuantity: item.quantity,
        parsedUnit: item.unit,
        standardUnit: "km",
        standardQuantity: item.quantity * 1.60934,
        materialType: item.item,
      };
    }

    // Handle volume conversions (gallons to liters)
    if (["gallons", "gal"].includes(item.unit?.toLowerCase())) {
      return {
        originalDescription: description,
        parsedQuantity: item.quantity,
        parsedUnit: item.unit,
        standardUnit: "liters",
        standardQuantity: item.quantity * 3.78541,
        materialType: item.material,
      };
    }

    // Already in standard units or no conversion needed
    return {
      originalDescription: description,
      parsedQuantity: item.quantity,
      parsedUnit: item.unit,
      standardUnit: item.unit,
      standardQuantity: item.quantity,
      materialType: item.material,
    };
  }

  /**
   * Calculate emissions for converted items
   */
  private async calculateEmissions(
    conversions: UnitConversion[],
    context?: Record<string, any>
  ): Promise<EmissionCalculation[]> {
    const calculations: EmissionCalculation[] = [];

    for (const conversion of conversions) {
      const calculation = await this.calculateSingleEmission(conversion, context);
      if (calculation) {
        calculations.push(calculation);
      }
    }

    return calculations;
  }

  /**
   * Calculate emissions for a single item
   */
  private async calculateSingleEmission(
    conversion: UnitConversion,
    context?: Record<string, any>
  ): Promise<EmissionCalculation | null> {
    const itemLower = conversion.originalDescription.toLowerCase();

    // Materials
    if (itemLower.includes("backdrop") || itemLower.includes("banner")) {
      const material = conversion.materialType?.toLowerCase() || "vinyl";
      const factor = material.includes("fabric")
        ? this.emissionFactorDatabase.materials.fabric_banner
        : this.emissionFactorDatabase.materials.vinyl_banner;

      const emissions = (conversion.standardQuantity * factor.factor) / 1000; // Convert to tonnes

      return {
        item: conversion.originalDescription,
        quantity: conversion.standardQuantity,
        unit: conversion.standardUnit,
        emissionFactor: factor.factor,
        emissionFactorUnit: factor.unit,
        totalEmissions: emissions,
        category: "materials",
        confidence: 0.85,
        explanation: `${material} banner production and disposal`,
        source: factor.source,
      };
    }

    // Generators
    if (itemLower.includes("generator") && itemLower.includes("diesel")) {
      // Need to estimate fuel consumption
      // Typical generator: 50kW uses ~15L/hour
      const hours = this.extractNumber(itemLower, "hour") || 8; // Default 8 hours
      const generatorCount = conversion.parsedQuantity;
      const litersPerHour = 15;
      const totalLiters = generatorCount * hours * litersPerHour;

      const factor = this.emissionFactorDatabase.energy.diesel_generator;
      const emissions = (totalLiters * factor.factor) / 1000;

      return {
        item: conversion.originalDescription,
        quantity: totalLiters,
        unit: "liters",
        emissionFactor: factor.factor,
        emissionFactorUnit: factor.unit,
        totalEmissions: emissions,
        category: "energy",
        confidence: 0.7,
        explanation: `Estimated ${totalLiters}L diesel consumption (${generatorCount} generators × ${hours} hours)`,
        source: factor.source,
      };
    }

    // Transportation
    if (itemLower.includes("truck") || itemLower.includes("semi")) {
      const distance = this.extractNumber(itemLower, "km") ||
                      this.extractNumber(itemLower, "mile") * 1.60934 ||
                      conversion.standardQuantity;
      const trucks = conversion.parsedQuantity;

      const factor = this.emissionFactorDatabase.transportation.semi_truck_diesel;
      const emissions = (trucks * distance * factor.factor) / 1000;

      return {
        item: conversion.originalDescription,
        quantity: trucks * distance,
        unit: "truck-km",
        emissionFactor: factor.factor,
        emissionFactorUnit: factor.unit,
        totalEmissions: emissions,
        category: "transportation",
        confidence: 0.8,
        explanation: `${trucks} trucks traveling ${distance.toFixed(0)} km`,
        source: factor.source,
      };
    }

    // Catering
    if (itemLower.includes("catering") || itemLower.includes("meal") || itemLower.includes("food")) {
      const meals = conversion.parsedQuantity;
      const mealType = this.detectMealType(itemLower, context);
      const factor = this.emissionFactorDatabase.food[mealType];

      const emissions = (meals * factor.factor) / 1000;

      return {
        item: conversion.originalDescription,
        quantity: meals,
        unit: "meals",
        emissionFactor: factor.factor,
        emissionFactorUnit: factor.unit,
        totalEmissions: emissions,
        category: "food",
        confidence: 0.75,
        explanation: `${meals} ${mealType.replace('_', ' ')} meals`,
        source: factor.source,
      };
    }

    // Default: try to match to database
    return null;
  }

  /**
   * Extract a number followed by a specific unit from text
   */
  private extractNumber(text: string, unit: string): number | null {
    const patterns = [
      new RegExp(`(\\d+\\.?\\d*)\\s*${unit}`, "i"),
      new RegExp(`${unit}\\s*(\\d+\\.?\\d*)`, "i"),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseFloat(match[1]);
      }
    }

    return null;
  }

  /**
   * Detect meal type from description or context
   */
  private detectMealType(text: string, context?: Record<string, any>): string {
    if (text.includes("beef") || text.includes("steak")) return "beef_meal";
    if (text.includes("chicken") || text.includes("poultry")) return "chicken_meal";
    if (text.includes("fish") || text.includes("seafood")) return "fish_meal";
    if (text.includes("vegetarian")) return "vegetarian_meal";
    if (text.includes("vegan") || text.includes("plant-based")) return "vegan_meal";
    if (text.includes("local")) return "local_catering";

    return "mixed_catering"; // Default
  }

  /**
   * Generate detailed breakdown text
   */
  private generateDetailedBreakdown(calculations: EmissionCalculation[]): string {
    if (calculations.length === 0) {
      return "No emissions calculated.";
    }

    const lines = calculations.map(calc =>
      `- ${calc.item}: ${calc.totalEmissions.toFixed(3)} tonnes (${calc.explanation})`
    );

    return lines.join("\n");
  }

  /**
   * Quick lookup for common event items
   */
  async quickLookup(itemName: string): Promise<EmissionCalculation | null> {
    const quickDatabase: Record<string, { factor: number; unit: string; category: string }> = {
      "standard backdrop": { factor: 0.125, unit: "per backdrop", category: "materials" },
      "pa system small": { factor: 0.5, unit: "per event", category: "energy" },
      "pa system large": { factor: 2.0, unit: "per event", category: "energy" },
      "lighting rig basic": { factor: 0.8, unit: "per event", category: "energy" },
      "lighting rig elaborate": { factor: 3.5, unit: "per event", category: "energy" },
      "video screen": { factor: 1.5, unit: "per sqm per event", category: "energy" },
    };

    const lookup = quickDatabase[itemName.toLowerCase()];
    if (lookup) {
      return {
        item: itemName,
        quantity: 1,
        unit: lookup.unit,
        emissionFactor: lookup.factor,
        emissionFactorUnit: lookup.unit,
        totalEmissions: lookup.factor,
        category: lookup.category as any,
        confidence: 0.6,
        explanation: "Quick estimate based on industry averages",
        source: "Event Industry Database 2024",
      };
    }

    return null;
  }

  /**
   * Format result for Sage Riverstone response
   */
  formatForSageResponse(result: TranslationResult, tier: LanguageTier): string {
    if (tier === "tier3_technical") {
      return `${result.originalInput}
Total emissions: ${result.totalEmissions.toFixed(3)} tCO2e

Breakdown:
${result.detailedBreakdown}`;
    }

    if (tier === "tier2_practical") {
      return `For "${result.originalInput}", that's approximately ${result.totalEmissions.toFixed(2)} tonnes of carbon - ${result.metaphor}.

${result.detailedBreakdown}`;
    }

    // Tier 1 - Campfire
    return `Got it! "${result.originalInput}" creates about ${result.metaphor}.

${result.calculations.length > 1 ? "Here's how that breaks down:\n" + result.detailedBreakdown : ""}`;
  }
}

export const unitTranslatorService = new UnitTranslatorService();
