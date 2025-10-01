/**
 * Reduction Advisor Service
 *
 * Provides contextual, actionable carbon reduction recommendations
 * Translates technical opportunities into producer-friendly language
 * Calculates impact of specific reduction strategies
 */

import { SageRiverstonePersona, LanguageTier } from "./persona";
import { EmissionCalculation } from "./unit-translator";

export interface ReductionOpportunity {
  category: "energy" | "transportation" | "food" | "materials" | "waste";
  title: string;
  currentEmissions: number; // tCO2e
  potentialSavings: number; // tCO2e
  savingsPercentage: number;
  difficulty: "easy" | "moderate" | "challenging";
  cost: "free" | "low" | "medium" | "high";
  timeframe: "immediate" | "short_term" | "long_term"; // before event, planning stage, future events
  specificAction: string;
  implementation: string[];
  vendors?: string[]; // Suppliers who can help
  priority: number; // 1-10, higher = more impact
}

export interface ReductionStrategy {
  opportunities: ReductionOpportunity[];
  totalPotentialSavings: number;
  quickWins: ReductionOpportunity[]; // Easy + high impact
  biggestImpact: ReductionOpportunity[]; // Highest savings
  summary: string;
}

export interface BenchmarkComparison {
  eventType: string;
  yourEmissions: number;
  industryAverage: number;
  topPerformers: number; // 25th percentile
  performance: "excellent" | "good" | "average" | "needs_improvement" | "poor";
  percentile: number;
  message: string;
}

export class ReductionAdvisorService {
  /**
   * Generate personalized reduction recommendations
   */
  async generateRecommendations(
    emissionBreakdown: Record<string, number>,
    eventContext: Record<string, any>,
    suppliers: any[] = []
  ): Promise<ReductionStrategy> {
    const opportunities: ReductionOpportunity[] = [];

    // Analyze each emission category
    if (emissionBreakdown.energy || emissionBreakdown.venue) {
      opportunities.push(...this.analyzeEnergyReductions(emissionBreakdown, eventContext, suppliers));
    }

    if (emissionBreakdown.transportation) {
      opportunities.push(...this.analyzeTransportationReductions(emissionBreakdown, eventContext, suppliers));
    }

    if (emissionBreakdown.catering || emissionBreakdown.food) {
      opportunities.push(...this.analyzeFoodReductions(emissionBreakdown, eventContext, suppliers));
    }

    if (emissionBreakdown.waste) {
      opportunities.push(...this.analyzeWasteReductions(emissionBreakdown, eventContext, suppliers));
    }

    if (emissionBreakdown.materials || emissionBreakdown.production) {
      opportunities.push(...this.analyzeMaterialReductions(emissionBreakdown, eventContext, suppliers));
    }

    // Sort by priority (impact × feasibility)
    opportunities.sort((a, b) => b.priority - a.priority);

    // Identify quick wins (easy + good savings)
    const quickWins = opportunities.filter(
      opp => opp.difficulty === "easy" && opp.savingsPercentage >= 10
    ).slice(0, 3);

    // Identify biggest impact (regardless of difficulty)
    const biggestImpact = [...opportunities]
      .sort((a, b) => b.potentialSavings - a.potentialSavings)
      .slice(0, 3);

    const totalPotentialSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);

    const summary = this.generateStrategySummary(opportunities, totalPotentialSavings, quickWins);

    return {
      opportunities,
      totalPotentialSavings,
      quickWins,
      biggestImpact,
      summary,
    };
  }

  /**
   * Analyze energy reduction opportunities
   */
  private analyzeEnergyReductions(
    breakdown: Record<string, number>,
    context: Record<string, any>,
    suppliers: any[]
  ): ReductionOpportunity[] {
    const opportunities: ReductionOpportunity[] = [];
    const energyEmissions = breakdown.energy || breakdown.venue || 0;

    // Generator → Grid power
    if (context.power?.source === "generator" || context.power?.generatorPower) {
      const savings = energyEmissions * 0.40; // ~40% reduction switching to grid

      opportunities.push({
        category: "energy",
        title: "Switch from generators to grid power",
        currentEmissions: energyEmissions,
        potentialSavings: savings,
        savingsPercentage: 40,
        difficulty: "moderate",
        cost: "medium",
        timeframe: "planning",
        specificAction: "Use venue's grid electricity instead of diesel generators",
        implementation: [
          "Contact venue about available power capacity and connection points",
          "Calculate total power draw for your equipment",
          "Arrange for sufficient breaker capacity and distribution",
          "Plan cable runs and power distribution setup",
        ],
        vendors: suppliers.filter(s => s.role === "venue").map(s => s.name),
        priority: 8,
      });
    }

    // Renewable energy
    if (context.power?.source === "grid" || context.power?.source === "generator") {
      const savings = energyEmissions * 0.80; // ~80% reduction with renewables

      opportunities.push({
        category: "energy",
        title: "Use renewable energy sources",
        currentEmissions: energyEmissions,
        potentialSavings: savings,
        savingsPercentage: 80,
        difficulty: "challenging",
        cost: "high",
        timeframe: "long_term",
        specificAction: "Power event with solar, wind, or purchase renewable energy credits",
        implementation: [
          "Explore solar generator rentals or mobile solar arrays",
          "Check if venue offers renewable energy options",
          "Consider purchasing Renewable Energy Credits (RECs) for grid power",
          "For future events, choose venues with on-site renewable energy",
        ],
        vendors: suppliers.filter(s => s.role === "venue").map(s => s.name),
        priority: 9,
      });
    }

    // LED lighting efficiency
    if (context.production?.audioVisual?.lightingRig) {
      const lightingEmissions = energyEmissions * 0.25; // Assume 25% from lighting
      const savings = lightingEmissions * 0.30; // 30% reduction with LED

      opportunities.push({
        category: "energy",
        title: "Use LED lighting exclusively",
        currentEmissions: lightingEmissions,
        potentialSavings: savings,
        savingsPercentage: 30,
        difficulty: "easy",
        cost: "low",
        timeframe: "immediate",
        specificAction: "Specify LED fixtures for all lighting needs",
        implementation: [
          "Request LED-only lighting package from A/V vendor",
          "Avoid tungsten, halogen, and other inefficient fixtures",
          "Use smart dimming to reduce power when full brightness not needed",
        ],
        vendors: suppliers.filter(s => s.role === "av_company").map(s => s.name),
        priority: 7,
      });
    }

    return opportunities;
  }

  /**
   * Analyze transportation reduction opportunities
   */
  private analyzeTransportationReductions(
    breakdown: Record<string, number>,
    context: Record<string, any>,
    suppliers: any[]
  ): ReductionOpportunity[] {
    const opportunities: ReductionOpportunity[] = [];
    const transportEmissions = breakdown.transportation || 0;

    // Audience travel is typically 40-60% of transport emissions
    const audienceEmissions = transportEmissions * 0.5;

    // Public transit / shuttles for audience
    opportunities.push({
      category: "transportation",
      title: "Encourage public transit and provide shuttles",
      currentEmissions: audienceEmissions,
      potentialSavings: audienceEmissions * 0.25, // 25% take public transit = 25% reduction
      savingsPercentage: 25,
      difficulty: "moderate",
      cost: "medium",
      timeframe: "planning",
      specificAction: "If 25% of attendees use public transit instead of driving alone, save significant emissions",
      implementation: [
        "Partner with local transit authority for event service",
        "Provide detailed public transit directions on event website",
        "Offer shuttle service from major transit hubs",
        "Create carpooling incentives (preferred parking, discounts)",
        "Include transit info in all event communications",
      ],
      priority: 9,
    });

    // Crew/staff travel optimization
    if (context.staffing?.crewSize) {
      const crewEmissions = transportEmissions * 0.20;

      opportunities.push({
        category: "transportation",
        title: "Optimize crew travel with shared transportation",
        currentEmissions: crewEmissions,
        potentialSavings: crewEmissions * 0.30,
        savingsPercentage: 30,
        difficulty: "easy",
        cost: "free",
        timeframe: "immediate",
        specificAction: "Coordinate crew transportation to minimize individual vehicles",
        implementation: [
          "Arrange crew buses or vans instead of individual cars",
          "Group crew by hotel location for shared rides",
          "Hire local crew when possible to reduce travel",
        ],
        priority: 6,
      });
    }

    // Equipment freight consolidation
    const freightEmissions = transportEmissions * 0.30;

    opportunities.push({
      category: "transportation",
      title: "Consolidate equipment freight",
      currentEmissions: freightEmissions,
      potentialSavings: freightEmissions * 0.20,
      savingsPercentage: 20,
      difficulty: "moderate",
      cost: "low",
      timeframe: "planning",
      specificAction: "Reduce number of trucks through better load planning",
      implementation: [
        "Coordinate with all vendors to optimize truck usage",
        "Use shared freight when multiple vendors shipping to same venue",
        "Rent equipment locally when possible to avoid shipping",
      ],
      vendors: suppliers.filter(s => s.role === "staging" || s.role === "av_company").map(s => s.name),
      priority: 5,
    });

    // Flights → trains for crew
    if (context.transportation?.crewTravel?.method === "flight") {
      const flightEmissions = transportEmissions * 0.25;

      opportunities.push({
        category: "transportation",
        title: "Use trains instead of flights where practical",
        currentEmissions: flightEmissions,
        potentialSavings: flightEmissions * 0.70, // Trains ~70% lower than flights
        savingsPercentage: 70,
        difficulty: "moderate",
        cost: "low",
        timeframe: "planning",
        specificAction: "For distances under 500 miles, trains can save 70% of flight emissions",
        implementation: [
          "Compare train schedules and travel times vs flights",
          "Book crew on trains for regional travel",
          "Build extra travel time into schedule for train journeys",
        ],
        priority: 8,
      });
    }

    return opportunities;
  }

  /**
   * Analyze food/catering reduction opportunities
   */
  private analyzeFoodReductions(
    breakdown: Record<string, number>,
    context: Record<string, any>,
    suppliers: any[]
  ): ReductionOpportunity[] {
    const opportunities: ReductionOpportunity[] = [];
    const foodEmissions = breakdown.catering || breakdown.food || 0;

    // Local sourcing
    if (!context.catering?.isLocallySourced) {
      opportunities.push({
        category: "food",
        title: "Source food locally (within 100 miles)",
        currentEmissions: foodEmissions,
        potentialSavings: foodEmissions * 0.15,
        savingsPercentage: 15,
        difficulty: "easy",
        cost: "free",
        timeframe: "immediate",
        specificAction: "Choose caterer who sources ingredients locally",
        implementation: [
          "Ask caterers about local sourcing practices",
          "Specify 'local ingredients' in catering contract",
          "Feature local sourcing in event sustainability messaging",
        ],
        vendors: suppliers.filter(s => s.role === "caterer").map(s => s.name),
        priority: 7,
      });
    }

    // Plant-based menu options
    opportunities.push({
      category: "food",
      title: "Increase plant-based menu options",
      currentEmissions: foodEmissions,
      potentialSavings: foodEmissions * 0.40, // If 50% choose plant-based
      savingsPercentage: 40,
      difficulty: "easy",
      cost: "free",
      timeframe: "immediate",
      specificAction: "If half your meals are plant-based instead of meat, cut food emissions by 40%",
      implementation: [
        "Make plant-based the default with meat as optional",
        "Create appealing vegan/vegetarian options (not just salad)",
        "Label menu items with carbon impact or sustainability badges",
        "Feature plant-based options prominently",
      ],
      vendors: suppliers.filter(s => s.role === "caterer").map(s => s.name),
      priority: 8,
    });

    // Eliminate single-use plastics
    opportunities.push({
      category: "food",
      title: "Use reusable or compostable serviceware",
      currentEmissions: foodEmissions * 0.10, // Packaging ~10% of food emissions
      potentialSavings: (foodEmissions * 0.10) * 0.80,
      savingsPercentage: 8,
      difficulty: "easy",
      cost: "low",
      timeframe: "immediate",
      specificAction: "Replace disposable plastics with compostable or reusable items",
      implementation: [
        "Specify compostable plates, cups, utensils in catering contract",
        "Use real dishes and silverware for VIP areas",
        "Eliminate plastic water bottles (use water stations)",
        "Provide clearly labeled bins for compostables",
      ],
      vendors: suppliers.filter(s => s.role === "caterer").map(s => s.name),
      priority: 6,
    });

    return opportunities;
  }

  /**
   * Analyze waste reduction opportunities
   */
  private analyzeWasteReductions(
    breakdown: Record<string, number>,
    context: Record<string, any>,
    suppliers: any[]
  ): ReductionOpportunity[] {
    const opportunities: ReductionOpportunity[] = [];
    const wasteEmissions = breakdown.waste || 0;

    // Comprehensive recycling program
    if (!context.waste?.recyclingProgram) {
      opportunities.push({
        category: "waste",
        title: "Implement comprehensive recycling program",
        currentEmissions: wasteEmissions,
        potentialSavings: wasteEmissions * 0.40,
        savingsPercentage: 40,
        difficulty: "easy",
        cost: "low",
        timeframe: "immediate",
        specificAction: "Set up clearly labeled recycling stations throughout venue",
        implementation: [
          "Partner with venue on recycling services",
          "Place recycling bins next to every trash can",
          "Use clear, visual signage showing what goes where",
          "Brief staff on sorting and monitoring bins",
          "Track diversion rate (weight recycled vs landfilled)",
        ],
        vendors: suppliers.filter(s => s.role === "venue").map(s => s.name),
        priority: 7,
      });
    }

    // Composting food waste
    opportunities.push({
      category: "waste",
      title: "Compost food waste and compostable serviceware",
      currentEmissions: wasteEmissions,
      potentialSavings: wasteEmissions * 0.50,
      savingsPercentage: 50,
      difficulty: "moderate",
      cost: "medium",
      timeframe: "planning",
      specificAction: "Food waste composting cuts emissions by 50% vs landfill",
      implementation: [
        "Find commercial composting service in your area",
        "Coordinate with caterer on composting collection",
        "Use only compostable serviceware (no plastic contamination)",
        "Set up separate compost collection at food areas",
        "Educate attendees with clear bin labels",
      ],
      vendors: suppliers.filter(s => s.role === "caterer" || s.role === "venue").map(s => s.name),
      priority: 8,
    });

    // Reusable signage and materials
    opportunities.push({
      category: "waste",
      title: "Use reusable event materials",
      currentEmissions: wasteEmissions * 0.20,
      potentialSavings: (wasteEmissions * 0.20) * 0.90,
      savingsPercentage: 18,
      difficulty: "moderate",
      cost: "medium",
      timeframe: "long_term",
      specificAction: "Invest in reusable banners, signage, and decor for future events",
      implementation: [
        "Design generic branded materials that work across multiple events",
        "Use modular signage with interchangeable elements",
        "Store and maintain materials for reuse",
        "Digital signage instead of printed where possible",
      ],
      priority: 5,
    });

    return opportunities;
  }

  /**
   * Analyze material/production reduction opportunities
   */
  private analyzeMaterialReductions(
    breakdown: Record<string, number>,
    context: Record<string, any>,
    suppliers: any[]
  ): ReductionOpportunity[] {
    const opportunities: ReductionOpportunity[] = [];
    const materialEmissions = breakdown.materials || breakdown.production || 0;

    // Rent vs buy staging
    opportunities.push({
      category: "materials",
      title: "Rent staging and equipment instead of buying new",
      currentEmissions: materialEmissions,
      potentialSavings: materialEmissions * 0.60,
      savingsPercentage: 60,
      difficulty: "easy",
      cost: "free",
      timeframe: "immediate",
      specificAction: "Rented equipment spreads emissions across many events",
      implementation: [
        "Rent truss, staging, rigging from local suppliers",
        "Avoid custom-built one-time-use structures",
        "Choose standard sizes that vendors stock",
      ],
      vendors: suppliers.filter(s => s.role === "staging").map(s => s.name),
      priority: 7,
    });

    // Sustainable materials
    opportunities.push({
      category: "materials",
      title: "Choose lower-carbon materials",
      currentEmissions: materialEmissions,
      potentialSavings: materialEmissions * 0.30,
      savingsPercentage: 30,
      difficulty: "moderate",
      cost: "low",
      timeframe: "planning",
      specificAction: "Fabric banners instead of vinyl, wood instead of aluminum",
      implementation: [
        "Specify fabric banners (50% less carbon than vinyl)",
        "Use FSC-certified wood for temporary structures",
        "Choose aluminum over steel for lighter transport weight",
        "Avoid single-use custom fabrication",
      ],
      priority: 6,
    });

    // Digital programs
    if (context.materials?.includes("printed programs")) {
      opportunities.push({
        category: "materials",
        title: "Replace printed programs with digital",
        currentEmissions: materialEmissions * 0.05,
        potentialSavings: (materialEmissions * 0.05) * 0.95,
        savingsPercentage: 5,
        difficulty: "easy",
        cost: "free",
        timeframe: "immediate",
        specificAction: "Event app or website instead of printed programs",
        implementation: [
          "Create mobile-friendly event schedule page",
          "QR codes on signage linking to digital info",
          "Event app with schedule, maps, and updates",
          "Print minimal programs only for VIP/backstage",
        ],
        priority: 5,
      });
    }

    return opportunities;
  }

  /**
   * Generate strategy summary with Sage's language
   */
  private generateStrategySummary(
    opportunities: ReductionOpportunity[],
    totalSavings: number,
    quickWins: ReductionOpportunity[]
  ): string {
    const metaphor = SageRiverstonePersona.generateMetaphor(totalSavings);

    return `I've identified ${opportunities.length} opportunities to reduce your event's footprint. If you implemented all of them, you could save ${metaphor}.

Your quick wins - easy changes with solid impact:
${quickWins.map((qw, i) => `${i + 1}. ${qw.title} (save ${qw.savingsPercentage}%)`).join("\n")}

Want to dive into any of these?`;
  }

  /**
   * Format single opportunity for Sage response
   */
  formatOpportunity(
    opportunity: ReductionOpportunity,
    tier: LanguageTier
  ): string {
    const savings = SageRiverstonePersona.generateMetaphor(opportunity.potentialSavings);

    if (tier === "tier3_technical") {
      return `${opportunity.title}
Current: ${opportunity.currentEmissions.toFixed(2)} tCO2e
Potential savings: ${opportunity.potentialSavings.toFixed(2)} tCO2e (${opportunity.savingsPercentage}%)
Difficulty: ${opportunity.difficulty}
Cost: ${opportunity.cost}
Implementation: ${opportunity.implementation.join("; ")}`;
    }

    if (tier === "tier2_practical") {
      return `${opportunity.title}

This could save ${opportunity.savingsPercentage}% - about ${savings}.

Difficulty: ${opportunity.difficulty} | Cost: ${opportunity.cost} | Timeframe: ${opportunity.timeframe}

${opportunity.specificAction}

How to make it happen:
${opportunity.implementation.map((step, i) => `${i + 1}. ${step}`).join("\n")}`;
    }

    // Tier 1 - Campfire
    return `${opportunity.title}

${opportunity.specificAction}

This would save ${savings} - that's a ${opportunity.savingsPercentage}% reduction in that category.

It's ${opportunity.difficulty} to pull off${opportunity.cost !== "free" ? ` and costs ${opportunity.cost}` : " and won't cost you extra"}.

Here's how you'd do it:
${opportunity.implementation.map((step, i) => `${i + 1}. ${step}`).join("\n")}

${opportunity.vendors && opportunity.vendors.length > 0 ? `Your ${opportunity.vendors.join(", ")} could help with this.` : ""}`;
  }

  /**
   * Calculate benchmark comparison
   */
  calculateBenchmark(
    eventType: string,
    attendance: number,
    totalEmissions: number
  ): BenchmarkComparison {
    const perAttendee = totalEmissions / attendance;

    // Industry benchmarks (tCO2e per attendee)
    const benchmarks: Record<string, { average: number; topPerformers: number }> = {
      concert: { average: 0.012, topPerformers: 0.008 },
      festival: { average: 0.025, topPerformers: 0.015 },
      conference: { average: 0.008, topPerformers: 0.005 },
      sports_event: { average: 0.015, topPerformers: 0.010 },
      theater: { average: 0.006, topPerformers: 0.004 },
      corporate_event: { average: 0.007, topPerformers: 0.004 },
      wedding: { average: 0.005, topPerformers: 0.003 },
      trade_show: { average: 0.010, topPerformers: 0.006 },
      other: { average: 0.010, topPerformers: 0.006 },
    };

    const benchmark = benchmarks[eventType] || benchmarks.other;
    const ratio = perAttendee / benchmark.average;

    let performance: BenchmarkComparison["performance"];
    let percentile: number;
    let message: string;

    if (perAttendee <= benchmark.topPerformers) {
      performance = "excellent";
      percentile = 15;
      message = "You're in the top 25% of sustainable events for your category. Seriously impressive work!";
    } else if (perAttendee <= benchmark.average * 0.85) {
      performance = "good";
      percentile = 35;
      message = "You're doing better than average - your event is more sustainable than most.";
    } else if (perAttendee <= benchmark.average * 1.15) {
      performance = "average";
      percentile = 50;
      message = "You're right in the middle of the pack - there's some good opportunities to improve.";
    } else if (perAttendee <= benchmark.average * 1.5) {
      performance = "needs_improvement";
      percentile = 75;
      message = "You're above average for emissions - but that means there's a lot of room for improvement, and big savings are within reach.";
    } else {
      performance = "poor";
      percentile = 90;
      message = "Your event has significantly higher emissions than typical. The good news? That means you have huge opportunities to make a difference.";
    }

    return {
      eventType,
      yourEmissions: perAttendee,
      industryAverage: benchmark.average,
      topPerformers: benchmark.topPerformers,
      performance,
      percentile,
      message,
    };
  }
}

export const reductionAdvisorService = new ReductionAdvisorService();
