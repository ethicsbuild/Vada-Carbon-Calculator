/**
 * Sage Riverstone Persona Module
 *
 * Implements tiered language approach for conversational carbon tracking:
 * - Tier 1: Campfire metaphors, gentle guidance (zero carbon literacy required)
 * - Tier 2: Practical steps, producer language (no jargon)
 * - Tier 3: Technical compliance (GHG Protocol, only when needed)
 */

export type LanguageTier = "tier1_campfire" | "tier2_practical" | "tier3_technical";

export interface SageResponse {
  message: string;
  tier: LanguageTier;
  metaphorsUsed?: string[];
  technicalTermsHidden?: string[];
}

export class SageRiverstonePersona {
  /**
   * Generate Sage Riverstone system prompt based on language tier
   */
  static getSystemPrompt(tier: LanguageTier = "tier1_campfire"): string {
    const basePerson = `You are Sage Riverstone, a warm and intuitive sustainability guide for event producers. Your mission is to make carbon tracking feel natural and accessible - like sitting around a campfire with a knowledgeable friend who truly understands the event production world.

**Core Identity:**
- You're a veteran event producer who discovered sustainability practices organically
- You speak producer language fluently: load-in/load-out, rigging, power distribution, catering riders
- You never use terms like "Scope 1/2/3", "emission factors", or "tCO2e" unless the user asks
- You translate everything into relatable metaphors and practical impacts

**Your Approach:**
- Listen deeply to what producers describe and extract emission data invisibly
- Ask ONE question at a time, making it feel conversational, not like a form
- Provide context with every question: "This helps me understand your power needs..."
- Use progressive disclosure: only ask for details when they matter
- Celebrate sustainable choices: "Love that you're sourcing local catering!"

**Event Production Expertise:**
You understand: stage rigging, audio/visual systems, power distribution, generator sizing, tour logistics, venue contracts, catering operations, waste management, crew transportation, freight coordination, festival site planning, indoor/outdoor venue challenges, union labor requirements, load-in schedules, equipment rental vs ownership.`;

    const tierGuidance = {
      tier1_campfire: `
**Language Tier 1: Campfire Metaphors**
Use warm, visual metaphors to explain carbon impact:
- "That's like 2 campfires burning for your entire event"
- "Switching to local catering saves the carbon of 3 cars driving across the country"
- "Your power setup is like running 50 households for a day"
- "That flight is equivalent to heating 10 homes for a winter month"

NEVER use: tCO2e, emissions, carbon footprint, Scope 1/2/3, GHG Protocol
ALWAYS translate technical concepts into relatable comparisons`,

      tier2_practical: `
**Language Tier 2: Practical Producer Language**
Use concrete, actionable event production terminology:
- "Your generator fuel is your biggest carbon source"
- "Audience travel typically accounts for 40% of event impact"
- "Local catering reduces your impact by about 15%"
- "Diesel generators vs grid power makes a 25% difference"

AVOID: Scope categories, emission factors, technical carbon accounting
FOCUS ON: Practical decisions producers make daily`,

      tier3_technical: `
**Language Tier 3: Technical Compliance**
Only use when user explicitly asks for ESG reporting or technical details:
- "Your Scope 1 emissions from generators total 12.3 tCO2e"
- "This calculation follows GHG Protocol Corporate Standard 2025"
- "Emission factor: 2.68 kg CO2e per liter of diesel"
- "Your Scope 3 Category 6 (Business Travel) represents 45% of total footprint"

USE ONLY WHEN: User asks for "official report", "ESG compliance", "technical breakdown", or similar`
    };

    return basePerson + tierGuidance[tier];
  }

  /**
   * Translate technical carbon terms into Sage's language
   */
  static translateToSageLanguage(
    technicalTerm: string,
    value?: number,
    tier: LanguageTier = "tier1_campfire"
  ): string {
    if (tier === "tier3_technical") {
      return `${value?.toFixed(1) || ''} tCO2e from ${technicalTerm}`;
    }

    const tier1Translations: Record<string, string> = {
      "scope1": "direct energy use at your event",
      "scope2": "electricity and power from the grid",
      "scope3": "everything in your supply chain",
      "tCO2e": "carbon impact",
      "emission_factor": "carbon intensity",
      "ghg_protocol": "sustainability standards",
      "carbon_footprint": "environmental footprint",
      "baseline": "starting point",
      "offset": "balance out",
      "net_zero": "carbon-neutral",
      "generator": "on-site power",
      "grid_power": "venue electricity",
      "diesel_consumption": "fuel for generators",
      "business_travel": "crew and staff travel",
      "freight": "equipment shipping",
      "waste_emissions": "trash and recycling impact"
    };

    const tier2Translations: Record<string, string> = {
      "scope1": "on-site fuel and energy",
      "scope2": "purchased electricity",
      "scope3": "supply chain and travel",
      "tCO2e": "tonnes of carbon",
      "emission_factor": "carbon rate",
      "carbon_footprint": "total carbon impact",
      "baseline": "baseline emissions",
      "offset": "carbon offset",
      "generator": "diesel generators",
      "grid_power": "grid electricity"
    };

    const translations = tier === "tier1_campfire" ? tier1Translations : tier2Translations;
    return translations[technicalTerm] || technicalTerm;
  }

  /**
   * Generate metaphors for carbon quantities
   */
  static generateMetaphor(tonnes: number, context?: string): string {
    // Campfire equivalents (1 campfire burning for 1 hour ≈ 0.005 tCO2e)
    const campfires = Math.round(tonnes / 0.005);

    // Car equivalents (1 car driven 100 miles ≈ 0.04 tCO2e)
    const carMiles = Math.round((tonnes / 0.04) * 100);

    // Home heating equivalents (1 home heated for 1 day ≈ 0.02 tCO2e)
    const homeDays = Math.round(tonnes / 0.02);

    // Tree equivalents (1 tree absorbs ~0.02 tCO2e per year)
    const trees = Math.round(tonnes / 0.02);

    if (tonnes < 0.1) {
      return `like a small campfire burning for your entire event`;
    } else if (tonnes < 1) {
      return `like ${campfires} campfires burning for the duration`;
    } else if (tonnes < 5) {
      return `like heating ${homeDays} homes for a day`;
    } else if (tonnes < 20) {
      return `like driving a car ${carMiles.toLocaleString()} miles`;
    } else if (tonnes < 100) {
      return `like what ${trees} trees absorb in a year`;
    } else {
      const cars = Math.round(tonnes / 4.6); // Average car per year
      return `like ${cars} cars on the road for a year`;
    }
  }

  /**
   * Create contextual question with Sage's conversational style
   */
  static createQuestion(
    topic: string,
    context: Record<string, any> = {},
    tier: LanguageTier = "tier1_campfire"
  ): string {
    const eventType = context.eventType || "event";
    const questions: Record<string, { tier1: string; tier2: string; tier3: string }> = {
      event_type: {
        tier1: "Let's start at the beginning - what kind of event are you producing? Is it a concert, festival, conference, or something else? I want to understand your world so I can ask the right questions.",
        tier2: "What type of event are you working on? (concert, festival, conference, corporate event, etc.)",
        tier3: "Event classification for carbon categorization?"
      },

      attendance: {
        tier1: `For your ${eventType}, about how many people are you expecting? Even a rough guess helps me understand the scale we're working with.`,
        tier2: `Expected attendance for this ${eventType}?`,
        tier3: "Total attendee count for per-capita emissions calculation?"
      },

      venue: {
        tier1: `Tell me about your venue - is it indoors or outdoors? A theater, arena, field, or something unique? And where is it located?`,
        tier2: `Venue details: indoor/outdoor, type (arena/theater/field), and location?`,
        tier3: "Venue classification and geographic coordinates for grid emission factors?"
      },

      power: {
        tier1: `Now for the fun part - power! Are you plugging into the venue's electricity, bringing in generators, or doing a mix of both? Generator size if you know it?`,
        tier2: `Power source: grid electricity, generators (size?), or hybrid setup?`,
        tier3: "Scope 1 generator capacity (kW) and Scope 2 grid consumption (kWh)?"
      },

      staging: {
        tier1: `Let's talk about your stage setup. How many stages are you building? Small club stage, medium festival stage, or multiple main stages?`,
        tier2: `Number of stages and approximate size (small/medium/large/festival)?`,
        tier3: "Stage infrastructure specifications for material and energy modeling?"
      },

      audio_visual: {
        tier1: `What's your audio and visual setup like? Simple PA system or full festival production with video walls and elaborate lighting?`,
        tier2: `A/V setup: sound system size, lighting rig scale, video screens?`,
        tier3: "Audio/visual equipment inventory for power consumption modeling?"
      },

      catering: {
        tier1: `Are you feeding people at this event? If so, how many meals roughly, and is it local catering or does food travel from far away?`,
        tier2: `Catering: number of meals, local vs shipped, dietary options?`,
        tier3: "Food service scope: meal count, sourcing radius, menu composition for Scope 3 Category 1?"
      },

      crew_travel: {
        tier1: `How is your crew getting to the venue? Are they local, or traveling from across the country? Any flights involved?`,
        tier2: `Crew transportation: local team, regional travel, or flights? Distance estimate?`,
        tier3: "Scope 3 Category 6 business travel: crew size, transport modes, distances?"
      },

      equipment_shipping: {
        tier1: `How's your gear getting there? Local pickup with sprinter vans, regional semi-trucks, or cross-country tour freight?`,
        tier2: `Equipment shipping: number of trucks, approximate distance, rental or owned fleet?`,
        tier3: "Scope 3 Category 4 upstream transportation: freight mode, vehicle count, distance?"
      },

      audience_travel: {
        tier1: `Where do you think most of your audience is coming from? Mostly local within an hour's drive, or are you drawing people from across the region or country?`,
        tier2: `Audience origin: average travel distance, percentage driving vs flying vs public transit?`,
        tier3: "Scope 3 Category 15 attendee travel: distribution by transport mode and distance bands?"
      },

      waste: {
        tier1: `What's your plan for trash and recycling? Are you setting up recycling stations, composting, or working with the venue's standard waste management?`,
        tier2: `Waste management: recycling program, compost, standard waste service? Any reduction strategies?`,
        tier3: "Scope 3 Category 5 waste: estimated generation rate, diversion percentage, disposal methods?"
      },

      duration: {
        tier1: `How long is your event running? Is it a single evening, a full weekend, or multiple days? And about how many hours per day?`,
        tier2: `Event duration: number of days and approximate hours per day?`,
        tier3: "Temporal scope: days of operation and daily operational hours for energy modeling?"
      }
    };

    const questionSet = questions[topic];
    if (!questionSet) {
      return `Tell me more about the ${topic} for your event.`;
    }

    const tierMap = {
      tier1_campfire: "tier1",
      tier2_practical: "tier2",
      tier3_technical: "tier3"
    };

    return questionSet[tierMap[tier]] || questionSet.tier1;
  }

  /**
   * Generate encouraging feedback for sustainable choices
   */
  static generateEncouragement(choice: string, impact?: number): string {
    const encouragements: Record<string, string[]> = {
      local_catering: [
        "Love that you're sourcing local catering! That's going to reduce your food impact significantly.",
        "Local sourcing is huge - you're cutting out all that shipping carbon right there.",
        "Smart move on local catering. Your audience gets fresher food and you reduce impact."
      ],
      recycling_program: [
        "Setting up recycling stations shows real commitment. Your waste impact just dropped.",
        "Recycling programs can cut your waste footprint in half - great choice!",
        "Love seeing a proper recycling plan. That's producer-level sustainability thinking."
      ],
      grid_power: [
        "Using grid power instead of generators is one of the best decisions for carbon impact.",
        "Grid electricity beats diesel generators every time - excellent choice!",
        "That venue power connection just saved you a ton of generator fuel and carbon."
      ],
      public_transit: [
        "Encouraging public transit or shuttles? That's where the big wins happen!",
        "Audience travel is usually the biggest carbon source - you're tackling it head-on.",
        "Smart thinking on transit. If even 20% take public transport, you'll see real impact reduction."
      ],
      renewable_energy: [
        "Renewable energy at an event? You're setting the bar high!",
        "Solar or wind power on-site is next-level sustainability. Seriously impressive.",
        "Renewable energy is the gold standard. You're showing the industry what's possible."
      ]
    };

    const messages = encouragements[choice] || [
      "That's a thoughtful choice for sustainability.",
      "I like how you're thinking about this.",
      "Good call - that'll help reduce your impact."
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    if (impact && impact > 0) {
      return `${message} That choice saves approximately ${this.generateMetaphor(impact)}.`;
    }

    return message;
  }

  /**
   * Determine appropriate language tier based on user input
   */
  static detectPreferredTier(userMessage: string): LanguageTier {
    const tier3Keywords = [
      "scope 1", "scope 2", "scope 3", "tco2e", "ghg protocol",
      "emission factor", "esg report", "compliance", "verification",
      "carbon accounting", "baseline inventory"
    ];

    const tier2Keywords = [
      "carbon footprint", "emissions", "sustainability report",
      "carbon impact", "tonnes", "co2", "offset"
    ];

    const lowerMessage = userMessage.toLowerCase();

    if (tier3Keywords.some(keyword => lowerMessage.includes(keyword))) {
      return "tier3_technical";
    }

    if (tier2Keywords.some(keyword => lowerMessage.includes(keyword))) {
      return "tier2_practical";
    }

    return "tier1_campfire";
  }

  /**
   * Format emission result using appropriate language tier
   */
  static formatEmissionResult(
    category: string,
    tonnes: number,
    tier: LanguageTier = "tier1_campfire"
  ): string {
    if (tier === "tier3_technical") {
      return `${category}: ${tonnes.toFixed(2)} tCO2e`;
    }

    const categoryNames = {
      tier1_campfire: {
        venue: "venue and production",
        transportation: "travel and shipping",
        energy: "power and generators",
        catering: "food service",
        waste: "trash and recycling",
        total: "total environmental footprint"
      },
      tier2_practical: {
        venue: "venue operations",
        transportation: "transportation",
        energy: "energy consumption",
        catering: "catering",
        waste: "waste management",
        total: "total carbon impact"
      }
    };

    const names = tier === "tier1_campfire" ? categoryNames.tier1_campfire : categoryNames.tier2_practical;
    const name = names[category as keyof typeof names] || category;
    const metaphor = this.generateMetaphor(tonnes);

    if (tier === "tier1_campfire") {
      return `Your ${name} is ${metaphor}`;
    } else {
      return `${name}: ${tonnes.toFixed(1)} tonnes (${metaphor})`;
    }
  }

  /**
   * Generate summary with celebration or guidance
   */
  static generateSummary(
    totalEmissions: number,
    breakdown: Record<string, number>,
    benchmarkPerformance: string,
    tier: LanguageTier = "tier1_campfire"
  ): string {
    if (tier === "tier3_technical") {
      const breakdownText = Object.entries(breakdown)
        .map(([key, value]) => `  - ${key}: ${value.toFixed(2)} tCO2e`)
        .join("\n");

      return `Total emissions: ${totalEmissions.toFixed(2)} tCO2e\n\nBreakdown:\n${breakdownText}\n\nBenchmark performance: ${benchmarkPerformance}`;
    }

    const metaphor = this.generateMetaphor(totalEmissions);
    const biggestSource = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];

    if (tier === "tier1_campfire") {
      const celebration = benchmarkPerformance === "excellent"
        ? "You're doing amazing - your event is in the top 25% for sustainability!"
        : benchmarkPerformance === "good"
        ? "Solid work! You're beating the industry average."
        : "You're on the right track, and I see some great opportunities to improve.";

      return `Here's the story of your event's footprint:

Your event's total environmental impact is ${metaphor}.

The biggest contributor? ${this.translateToSageLanguage(biggestSource[0], biggestSource[1], tier)} - that's where we'll find the best opportunities for improvement.

${celebration}

Want to explore ways to reduce your impact, or should I prepare your sustainability summary?`;
    } else {
      return `Total carbon impact: ${totalEmissions.toFixed(1)} tonnes

Biggest source: ${biggestSource[0]} at ${biggestSource[1].toFixed(1)} tonnes (${((biggestSource[1]/totalEmissions)*100).toFixed(0)}%)

Performance: ${benchmarkPerformance}

Ready to explore reduction strategies or generate your report?`;
    }
  }
}
