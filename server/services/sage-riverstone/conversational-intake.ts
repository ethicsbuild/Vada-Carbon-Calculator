/**
 * Conversational Intake Service
 *
 * Natural language processing for event carbon tracking
 * Extracts emission-relevant data from conversational input
 */

import OpenAI from "openai";
import { SageRiverstonePersona, LanguageTier } from "./persona";
import { unitTranslatorService } from "./unit-translator";
import { supplierCoordinatorService, SupplierEntity } from "./supplier-coordinator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ExtractedEventData {
  eventType?: string;
  attendance?: number;
  duration?: {
    days: number;
    hoursPerDay: number;
  };
  venue?: {
    type: string;
    location?: string;
    isOutdoor?: boolean;
    capacity?: number;
  };
  power?: {
    source: "grid" | "generator" | "hybrid" | "renewable";
    generatorSize?: string;
    gridUsage?: number;
  };
  staging?: {
    numberOfStages: number;
    stageSize: string;
  };
  audioVisual?: {
    soundSystemSize: string;
    lightingRig: string;
    videoScreens: boolean;
    livestreaming: boolean;
  };
  catering?: {
    mealsServed?: number;
    isLocallySourced?: boolean;
    alcoholServed?: boolean;
    dietaryOptions?: string[];
  };
  staffing?: {
    totalStaff?: number;
    crewSize?: number;
  };
  transportation?: {
    crewTravel?: {
      method: string;
      distance?: number;
    };
    equipmentShipping?: {
      trucks?: number;
      distance?: number;
    };
    audienceTravel?: {
      averageDistance?: number;
      primaryMethod?: string;
    };
  };
  waste?: {
    recyclingProgram?: boolean;
    compostingAvailable?: boolean;
    reductionMeasures?: string[];
  };
  materialItems?: MaterialItem[];
  suppliers?: SupplierEntity[];
}

export interface MaterialItem {
  description: string;
  category: "materials" | "transportation" | "energy" | "waste" | "food";
  quantity?: number;
  unit?: string;
  estimatedEmissions?: number;
  confidence: number;
}

export interface SupplierEntity {
  name: string;
  role: "caterer" | "av_company" | "venue" | "staging" | "transportation" | "other";
  mentioned_in_context: string;
}

export interface ExtractionResult {
  extractedData: ExtractedEventData;
  nextQuestion?: string;
  confidence: number;
  needsClarification?: string[];
  sustainableChoicesDetected?: string[];
  estimatedImpact?: number;
  suppliersIdentified?: SupplierEntity[];
}

export class ConversationalIntakeService {
  /**
   * Extract structured event data from natural language user input
   */
  async extractEventData(
    userMessage: string,
    currentContext: Record<string, any> = {},
    languageTier: LanguageTier = "tier1_campfire"
  ): Promise<ExtractionResult> {
    try {
      const systemPrompt = `You are an expert data extraction system for event carbon footprint calculations. Your job is to extract structured information from conversational messages about event production.

Current context: ${JSON.stringify(currentContext)}

Extract all relevant details about:
1. Event basics: type, attendance, duration, location
2. Venue: type, indoor/outdoor, capacity, location
3. Power: grid/generator/hybrid, sizes, usage
4. Production: stages, A/V equipment, lighting, video
5. Catering: meals, local sourcing, dietary options
6. Staffing: crew size, total staff
7. Transportation: crew travel, equipment shipping, audience travel methods and distances
8. Waste: recycling, composting, reduction measures
9. Material items: any specific items mentioned (backdrops, banners, signage, etc.)
10. Suppliers: any companies mentioned (caterers, AV companies, venues, etc.)

IMPORTANT EXTRACTION RULES:
- Extract numbers with their units: "30-foot backdrop" → quantity: 30, unit: "feet"
- Identify sustainable choices: local sourcing, recycling, public transit, renewable energy
- Recognize event production terminology: load-in, rigging, PA system, FOH, backline, etc.
- Infer reasonable defaults: "small concert" → ~500 attendance, "festival" → multiple days
- Extract supplier names: "working with Joe's Catering" → supplier: {name: "Joe's Catering", role: "caterer"}

Return JSON with:
{
  "extractedData": { /* structured event data */ },
  "materialItems": ["list of specific material items mentioned with quantities"],
  "confidence": 0-1,
  "needsClarification": ["list of ambiguous items"],
  "sustainableChoicesDetected": ["list of sustainable practices mentioned"],
  "estimatedImpact": approximate tCO2e if enough data present,
  "nextQuestion": "suggested next question based on what's missing"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");

      // Process material items through unit translator
      if (result.materialItems && result.materialItems.length > 0) {
        const materialEmissions = await this.processMaterialItems(
          result.materialItems,
          currentContext
        );

        // Add material emissions to estimated impact
        if (materialEmissions > 0) {
          result.estimatedImpact = (result.estimatedImpact || 0) + materialEmissions;
        }
      }

      // Identify suppliers from the conversation
      const suppliersIdentified = await this.identifySuppliersFromMessage(
        userMessage,
        currentContext
      );

      // Generate next question using Sage's language
      if (result.nextQuestion) {
        const nextTopic = this.identifyNextTopic(result.extractedData, currentContext);
        result.nextQuestion = SageRiverstonePersona.createQuestion(
          nextTopic,
          { ...currentContext, ...result.extractedData },
          languageTier
        );
      }

      return {
        extractedData: result.extractedData || {},
        nextQuestion: result.nextQuestion,
        confidence: result.confidence || 0.5,
        needsClarification: result.needsClarification || [],
        sustainableChoicesDetected: result.sustainableChoicesDetected || [],
        estimatedImpact: result.estimatedImpact,
        suppliersIdentified
      };
    } catch (error) {
      console.error("Error extracting event data:", error);
      return {
        extractedData: {},
        confidence: 0,
        nextQuestion: SageRiverstonePersona.createQuestion("event_type", currentContext, languageTier)
      };
    }
  }

  /**
   * Process material items through unit translator
   */
  private async processMaterialItems(
    items: string[],
    context: Record<string, any>
  ): Promise<number> {
    let totalEmissions = 0;

    for (const item of items) {
      try {
        const translation = await unitTranslatorService.translateToEmissions(item, context);
        totalEmissions += translation.totalEmissions;
      } catch (error) {
        console.error(`Error translating material item "${item}":`, error);
      }
    }

    return totalEmissions;
  }

  /**
   * Identify what information is still needed
   */
  private identifyNextTopic(
    extractedData: ExtractedEventData,
    currentContext: Record<string, any>
  ): string {
    const allData = { ...currentContext, ...extractedData };

    // Priority order for event carbon calculation
    if (!allData.eventType) return "event_type";
    if (!allData.attendance) return "attendance";
    if (!allData.venue) return "venue";
    if (!allData.duration) return "duration";
    if (!allData.power) return "power";

    // Event-specific paths
    const eventType = allData.eventType?.toLowerCase();
    if (["concert", "festival", "theater"].includes(eventType) && !allData.staging) {
      return "staging";
    }
    if (["concert", "festival"].includes(eventType) && !allData.audioVisual) {
      return "audio_visual";
    }
    if (["festival", "conference", "corporate_event"].includes(eventType) && !allData.catering) {
      return "catering";
    }

    // Universal requirements
    if (!allData.transportation?.crewTravel) return "crew_travel";
    if (!allData.transportation?.equipmentShipping) return "equipment_shipping";
    if (!allData.transportation?.audienceTravel) return "audience_travel";
    if (!allData.waste) return "waste";

    return "complete"; // All core data collected
  }

  /**
   * Calculate preliminary emissions from partial data
   */
  async estimatePartialEmissions(
    extractedData: ExtractedEventData
  ): Promise<{ total: number; breakdown: Record<string, number>; confidence: string }> {
    const breakdown: Record<string, number> = {};
    let total = 0;

    // Base estimation on event type and attendance if available
    if (extractedData.eventType && extractedData.attendance) {
      const eventMultipliers: Record<string, number> = {
        concert: 0.012,
        festival: 0.025,
        conference: 0.008,
        sports_event: 0.015,
        theater: 0.006,
        wedding: 0.005,
        corporate_event: 0.007,
        trade_show: 0.010,
        other: 0.010
      };

      const multiplier = eventMultipliers[extractedData.eventType.toLowerCase()] || 0.010;
      total = extractedData.attendance * multiplier;

      // Distribute across categories
      breakdown.venue = total * 0.25;
      breakdown.transportation = total * 0.35;
      breakdown.energy = total * 0.20;
      breakdown.catering = total * 0.15;
      breakdown.waste = total * 0.05;
    }

    // Adjust for known details
    if (extractedData.power?.source === "renewable") {
      breakdown.energy = (breakdown.energy || 0) * 0.1; // 90% reduction
      total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    }

    if (extractedData.catering?.isLocallySourced) {
      breakdown.catering = (breakdown.catering || 0) * 0.85; // 15% reduction
      total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    }

    if (extractedData.waste?.recyclingProgram) {
      breakdown.waste = (breakdown.waste || 0) * 0.6; // 40% reduction
      total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    }

    // Adjust for duration
    if (extractedData.duration && extractedData.duration.days > 1) {
      const durationMultiplier = 1 + (extractedData.duration.days - 1) * 0.3;
      Object.keys(breakdown).forEach(key => {
        breakdown[key] *= durationMultiplier;
      });
      total *= durationMultiplier;
    }

    const confidence = this.calculateConfidence(extractedData);

    return { total, breakdown, confidence };
  }

  /**
   * Calculate confidence level based on data completeness
   */
  private calculateConfidence(data: ExtractedEventData): string {
    let score = 0;
    const weights = {
      eventType: 15,
      attendance: 15,
      duration: 10,
      venue: 10,
      power: 10,
      staging: 5,
      audioVisual: 5,
      catering: 10,
      transportation: 15,
      waste: 5
    };

    if (data.eventType) score += weights.eventType;
    if (data.attendance) score += weights.attendance;
    if (data.duration) score += weights.duration;
    if (data.venue) score += weights.venue;
    if (data.power) score += weights.power;
    if (data.staging) score += weights.staging;
    if (data.audioVisual) score += weights.audioVisual;
    if (data.catering) score += weights.catering;
    if (data.transportation) score += weights.transportation;
    if (data.waste) score += weights.waste;

    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    if (score >= 30) return "low";
    return "very_low";
  }

  /**
   * Identify suppliers from current message
   */
  private async identifySuppliersFromMessage(
    userMessage: string,
    context: Record<string, any>
  ): Promise<SupplierEntity[]> {
    try {
      // Build conversation context for supplier identification
      const conversationHistory = [userMessage];

      const suppliers = await supplierCoordinatorService.identifySuppliers(
        userMessage,
        conversationHistory,
        context
      );

      return suppliers;
    } catch (error) {
      console.error("Error identifying suppliers from message:", error);
      return [];
    }
  }

  /**
   * Identify suppliers mentioned in conversation history
   */
  async identifySuppliersFromContext(
    conversationHistory: string[],
    currentExtraction: ExtractedEventData
  ): Promise<SupplierEntity[]> {
    try {
      const eventDescription = JSON.stringify(currentExtraction);

      const suppliers = await supplierCoordinatorService.identifySuppliers(
        eventDescription,
        conversationHistory,
        currentExtraction
      );

      return suppliers;
    } catch (error) {
      console.error("Error identifying suppliers from context:", error);
      return [];
    }
  }

  /**
   * Generate encouragement for sustainable choices
   */
  generateEncouragementResponse(
    sustainableChoices: string[],
    languageTier: LanguageTier
  ): string[] {
    const responses: string[] = [];

    for (const choice of sustainableChoices) {
      const choiceKey = this.mapChoiceToKey(choice);
      const encouragement = SageRiverstonePersona.generateEncouragement(choiceKey);
      responses.push(encouragement);
    }

    return responses;
  }

  /**
   * Map natural language sustainable choice to standard key
   */
  private mapChoiceToKey(choice: string): string {
    const mapping: Record<string, string> = {
      "local sourcing": "local_catering",
      "local catering": "local_catering",
      "local food": "local_catering",
      "recycling": "recycling_program",
      "recycling program": "recycling_program",
      "composting": "recycling_program",
      "grid power": "grid_power",
      "venue electricity": "grid_power",
      "no generators": "grid_power",
      "public transit": "public_transit",
      "shuttle service": "public_transit",
      "carpooling": "public_transit",
      "renewable energy": "renewable_energy",
      "solar power": "renewable_energy",
      "wind power": "renewable_energy"
    };

    const lowerChoice = choice.toLowerCase();
    for (const [key, value] of Object.entries(mapping)) {
      if (lowerChoice.includes(key)) {
        return value;
      }
    }

    return "general";
  }

  /**
   * Format extraction results for Sage's response
   */
  formatExtractionForResponse(
    extraction: ExtractionResult,
    languageTier: LanguageTier
  ): string {
    let response = "";

    // Acknowledge sustainable choices first
    if (extraction.sustainableChoicesDetected && extraction.sustainableChoicesDetected.length > 0) {
      const encouragements = this.generateEncouragementResponse(
        extraction.sustainableChoicesDetected,
        languageTier
      );
      response += encouragements.join(" ") + "\n\n";
    }

    // Provide preliminary impact estimate if available
    if (extraction.estimatedImpact && extraction.estimatedImpact > 0) {
      const metaphor = SageRiverstonePersona.generateMetaphor(extraction.estimatedImpact);

      if (languageTier === "tier1_campfire") {
        response += `Based on what you've told me so far, I estimate your event's footprint at ${metaphor}. `;
      } else if (languageTier === "tier2_practical") {
        response += `Current estimate: ${extraction.estimatedImpact.toFixed(1)} tonnes (${metaphor}). `;
      } else {
        response += `Preliminary calculation: ${extraction.estimatedImpact.toFixed(2)} tCO2e. `;
      }
    }

    // Add clarification requests if needed
    if (extraction.needsClarification && extraction.needsClarification.length > 0) {
      if (languageTier === "tier1_campfire") {
        response += `Quick clarification on ${extraction.needsClarification[0]} - `;
      } else {
        response += `Need clarification: ${extraction.needsClarification.join(", ")}. `;
      }
    }

    return response.trim();
  }

  /**
   * Determine if enough data collected for calculation
   */
  isCalculationReady(extractedData: ExtractedEventData): boolean {
    const requiredFields = [
      extractedData.eventType,
      extractedData.attendance,
      extractedData.duration,
      extractedData.venue
    ];

    return requiredFields.every(field => field !== undefined && field !== null);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(extractedData: ExtractedEventData): number {
    const allFields = [
      "eventType",
      "attendance",
      "duration",
      "venue",
      "power",
      "staging",
      "audioVisual",
      "catering",
      "staffing",
      "transportation",
      "waste"
    ];

    const completedFields = allFields.filter(field => {
      const value = extractedData[field as keyof ExtractedEventData];
      return value !== undefined && value !== null;
    });

    return Math.round((completedFields.length / allFields.length) * 100);
  }
}

export const conversationalIntakeService = new ConversationalIntakeService();
