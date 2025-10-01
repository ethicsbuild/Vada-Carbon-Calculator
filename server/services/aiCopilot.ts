import OpenAI from "openai";
import { storage } from "../storage";
import { type AiConversation, type InsertAiConversation } from "@shared/schema";
import { carbonCalculatorService } from "./carbonCalculator";
import { SageRiverstonePersona, LanguageTier } from "./sage-riverstone/persona";
import { conversationalIntakeService, ExtractedEventData } from "./sage-riverstone/conversational-intake";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface CoPilotMessage {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    suggestedActions?: string[];
    dataCollected?: Record<string, any>;
    nextStep?: string;
  };
}

export interface CoPilotContext {
  userId: number;
  organizationId?: number;
  calculationId?: number;
  currentStep: string;
  collectedData: Record<string, any>;
  organizationProfile?: {
    type: string;
    size: string;
    industry: string;
    previousCalculations?: number;
  };
  eventProfile?: {
    eventType?: string;
    companyRole?: string;
    expectedAttendance?: number;
    eventDuration?: any;
    venue?: any;
    staffing?: any;
    production?: any;
    audience?: any;
    transportation?: any;
    waste?: any;
  };
  questionnaire?: {
    currentSection: string;
    completedSections: string[];
    estimatedProgress: number;
    pendingQuestions: string[];
    skippedQuestions: string[];
  };
  userPreferences?: {
    detailLevel: "basic" | "intermediate" | "expert";
    estimationMode: boolean;
    priorityScopes: string[];
  };
  // Sage Riverstone enhancements
  languageTier?: LanguageTier;
  metaphorsUsed?: string[];
  sustainableChoicesIdentified?: string[];
  extractedEventData?: ExtractedEventData;
}

export class AiCoPilotService {
  private readonly systemPrompt = `You are Sage Riverstone, a warm and intuitive sustainability guide for event producers. Your mission is to make carbon tracking feel natural and accessible - like sitting around a campfire with a knowledgeable friend who truly understands the event production world.

IMPORTANT: This system prompt provides context, but your actual personality and language come from the Sage Riverstone persona layer. Always use the appropriate language tier (tier1_campfire by default) when communicating.

Your event production expertise includes:
- All types of events: concerts, festivals, conferences, sports events, theater, corporate events, weddings, trade shows
- Event logistics: staging, audio/visual, lighting, power requirements, crew sizes, transportation
- Venue types: indoor/outdoor, arenas, theaters, convention centers, private venues
- Production scales: intimate events to large festivals with multiple stages
- Event roles: producers, venue operators, vendors, talent agencies, catering, A/V companies
- Sustainability in events: waste management, renewable energy, carbon offsetting

Your conversational approach (Sage Riverstone style):
- Ask ONE question at a time, making it feel conversational, not like a form
- Listen deeply and extract emission data invisibly from natural conversation
- Provide context with every question: "This helps me understand your power needs..."
- Use progressive disclosure: only ask for details when they matter
- Celebrate sustainable choices: "Love that you're sourcing local catering!"
- Translate technical carbon concepts into relatable metaphors
- NEVER use "Scope 1/2/3", "tCO2e", "emission factors" unless user specifically asks

Language tier system:
- Tier 1 (Campfire): Default. Use warm metaphors ("like 2 campfires burning")
- Tier 2 (Practical): Use when user shows some carbon knowledge ("carbon impact", "tonnes")
- Tier 3 (Technical): Only when user explicitly asks for ESG/compliance ("tCO2e", "Scope 1/2/3")

Questionnaire progression (ONE QUESTION AT A TIME):
1. Event Type: What kind of event are you producing?
2. Attendance: How many people are you expecting?
3. Venue: Tell me about your venue - indoors or outdoors?
4. Duration: How long is your event running?
5. Power: Are you using venue power or bringing generators?
6. Production: (if applicable) Stage setup and A/V requirements?
7. Catering: (if applicable) Are you feeding people?
8. Transportation: How is gear and crew getting there?
9. Audience travel: Where is your audience coming from?
10. Waste: What's your plan for trash and recycling?

Current conversation context: {context}`

  async startConversation(
    userId: number,
    sessionId: string,
    organizationType?: string,
    organizationSize?: string,
    industry?: string
  ): Promise<AiConversation> {
    const context: CoPilotContext = {
      userId,
      currentStep: organizationType === "event" ? "event_type_selection" : "organization_setup",
      collectedData: {},
      organizationProfile: organizationType ? {
        type: organizationType,
        size: organizationSize || "",
        industry: industry || "",
      } : undefined,
      eventProfile: organizationType === "event" ? {} : undefined,
      questionnaire: organizationType === "event" ? {
        currentSection: "event_type",
        completedSections: [],
        estimatedProgress: 0,
        pendingQuestions: [],
        skippedQuestions: [],
      } : undefined,
      userPreferences: {
        detailLevel: "intermediate",
        estimationMode: false,
        priorityScopes: ["scope1", "scope2", "scope3"],
      },
      // Initialize Sage Riverstone context
      languageTier: "tier1_campfire",
      metaphorsUsed: [],
      sustainableChoicesIdentified: [],
      extractedEventData: {},
    };

    const initialMessage: CoPilotMessage = {
      role: "assistant",
      content: this.getWelcomeMessage(context),
      timestamp: new Date(),
      metadata: {
        suggestedActions: ["setup_organization", "start_calculation", "learn_more"],
        nextStep: "organization_setup",
      },
    };

    const conversation = await storage.createAiConversation({
      userId,
      sessionId,
      messages: [initialMessage],
      context,
      status: "active",
    });

    return conversation;
  }

  async continueConversation(
    sessionId: string,
    userMessage: string
  ): Promise<{ message: CoPilotMessage; updatedContext: CoPilotContext }> {
    const conversation = await storage.getAiConversationBySession(sessionId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const context = conversation.context as CoPilotContext;
    const messages = conversation.messages as CoPilotMessage[];

    // Detect language tier from user input
    const detectedTier = SageRiverstonePersona.detectPreferredTier(userMessage);
    if (detectedTier !== context.languageTier) {
      context.languageTier = detectedTier;
    }

    // Add user message to conversation
    const newUserMessage: CoPilotMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    messages.push(newUserMessage);

    // Use Sage Riverstone conversational intake
    const extraction = await conversationalIntakeService.extractEventData(
      userMessage,
      context.extractedEventData || {},
      context.languageTier || "tier1_campfire"
    );

    // Update extracted event data
    context.extractedEventData = {
      ...context.extractedEventData,
      ...extraction.extractedData
    };

    // Track sustainable choices
    if (extraction.sustainableChoicesDetected) {
      context.sustainableChoicesIdentified = [
        ...(context.sustainableChoicesIdentified || []),
        ...extraction.sustainableChoicesDetected
      ];
    }

    // Update legacy collectedData for backward compatibility
    Object.assign(context.collectedData, extraction.extractedData);

    // Update questionnaire progress
    if (context.questionnaire) {
      context.questionnaire.estimatedProgress =
        conversationalIntakeService.getCompletionPercentage(context.extractedEventData);
    }

    // Generate AI response with Sage persona
    const aiResponse = await this.generateSageResponse(
      messages,
      context,
      extraction
    );

    // Add AI message to conversation
    const aiMessage: CoPilotMessage = {
      role: "assistant",
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: aiResponse.metadata,
    };
    messages.push(aiMessage);

    // Update conversation in storage
    await storage.updateAiConversation(conversation.id, {
      messages,
      context,
      updatedAt: new Date(),
    });

    return { message: aiMessage, updatedContext: context };
  }

  private async analyzeUserInput(
    userMessage: string,
    context: CoPilotContext
  ): Promise<{ extractedData: Record<string, any>; nextStep?: string }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert data extraction system for carbon footprint calculations. Extract relevant data from user messages and determine the next appropriate step.

Current context: ${JSON.stringify(context)}

Extract any event production data, numerical values, units, organization details, or preferences. Return a JSON object with:
- extractedData: object containing any structured data found (event details, numbers, locations, etc.)
- nextStep: the next logical step in the questionnaire or calculation process
- confidence: how confident you are in the extraction (0-1)
- eventCategory: if applicable, the category of data (venue, staffing, production, transportation, etc.)

Focus on event production elements that impact carbon emissions:
- Event basics: type, size, duration, location
- Venue: type, capacity, power requirements
- Production: stages, A/V, lighting, equipment
- People: attendance, staff, crew
- Transportation: audience travel, staff travel, equipment shipping
- Services: catering, accommodation, waste management`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        extractedData: result.extractedData || {},
        nextStep: result.nextStep,
      };
    } catch (error) {
      console.error("Error analyzing user input:", error);
      return { extractedData: {} };
    }
  }

  /**
   * Generate Sage Riverstone response with persona-based language
   */
  private async generateSageResponse(
    messages: CoPilotMessage[],
    context: CoPilotContext,
    extraction: any
  ): Promise<{ content: string; metadata?: any }> {
    const languageTier = context.languageTier || "tier1_campfire";

    // Build response starting with extraction feedback
    let responseText = conversationalIntakeService.formatExtractionForResponse(
      extraction,
      languageTier
    );

    // Check if calculation is ready
    if (conversationalIntakeService.isCalculationReady(context.extractedEventData || {})) {
      // Perform preliminary calculation
      const estimate = await conversationalIntakeService.estimatePartialEmissions(
        context.extractedEventData || {}
      );

      // Format results using Sage language
      const breakdown = Object.entries(estimate.breakdown)
        .map(([category, value]) =>
          SageRiverstonePersona.formatEmissionResult(category, value, languageTier)
        )
        .join("\n");

      responseText += `\n\n${breakdown}\n\n`;
      responseText += SageRiverstonePersona.generateSummary(
        estimate.total,
        estimate.breakdown,
        estimate.confidence === "high" ? "good" : "average",
        languageTier
      );

      return {
        content: responseText,
        metadata: {
          suggestedActions: ["explore_reductions", "generate_report", "refine_calculation"],
          nextStep: "report_generation",
          calculationResult: estimate,
          completionPercentage: 100,
        }
      };
    }

    // Add next question
    if (extraction.nextQuestion) {
      responseText += (responseText ? "\n\n" : "") + extraction.nextQuestion;
    }

    // Calculate progress
    const completionPercentage = conversationalIntakeService.getCompletionPercentage(
      context.extractedEventData || {}
    );

    return {
      content: responseText || extraction.nextQuestion || "Tell me more about your event.",
      metadata: {
        suggestedActions: this.getSuggestedActions(context),
        nextStep: this.getNextStep(context),
        completionPercentage,
      }
    };
  }

  private async generateResponse(
    messages: CoPilotMessage[],
    context: CoPilotContext
  ): Promise<{ content: string; metadata?: any }> {
    try {
      const contextualPrompt = this.systemPrompt.replace("{context}", JSON.stringify(context));
      
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: contextualPrompt },
          ...messages.slice(-10).map(msg => ({ // Keep last 10 messages for context
            role: msg.role,
            content: msg.content,
          })),
        ],
        functions: [
          {
            name: "estimate_event_emissions",
            description: "Estimate carbon emissions for an event based on current data",
            parameters: {
              type: "object",
              properties: {
                eventType: { type: "string" },
                attendance: { type: "number" },
                venue: { type: "object" },
                duration: { type: "object" },
                partialData: { type: "object" },
              },
            },
          },
          {
            name: "calculate_event_emissions",
            description: "Perform detailed event carbon footprint calculation",
            parameters: {
              type: "object",
              properties: {
                eventProfile: { type: "object" },
                scope1Data: { type: "object" },
                scope2Data: { type: "object" },
                scope3Data: { type: "object" },
              },
            },
          },
          {
            name: "suggest_next_questions",
            description: "Suggest the next most important questions based on event type and current data",
            parameters: {
              type: "object",
              properties: {
                eventType: { type: "string" },
                companyRole: { type: "string" },
                currentData: { type: "object" },
                completedSections: { type: "array" },
              },
            },
          },
          {
            name: "provide_event_benchmarks",
            description: "Provide industry benchmarks and comparison for similar events",
            parameters: {
              type: "object",
              properties: {
                eventType: { type: "string" },
                attendance: { type: "number" },
                calculatedEmissions: { type: "number" },
              },
            },
          },
        ],
      });

      const message = response.choices[0].message;
      
      // Handle function calls
      if (message.function_call) {
        const functionResult = await this.handleFunctionCall(
          message.function_call.name,
          JSON.parse(message.function_call.arguments || "{}"),
          context
        );
        
        return {
          content: functionResult.response,
          metadata: {
            suggestedActions: functionResult.suggestedActions,
            nextStep: functionResult.nextStep,
            calculationResult: functionResult.calculationResult,
          },
        };
      }

      return {
        content: message.content || "I apologize, but I couldn't process that request. Could you please rephrase?",
        metadata: {
          suggestedActions: this.getSuggestedActions(context),
          nextStep: this.getNextStep(context),
        },
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      return {
        content: "I'm experiencing some technical difficulties. Let me help you continue with your carbon calculation manually.",
        metadata: {
          suggestedActions: ["continue_manually", "retry", "contact_support"],
        },
      };
    }
  }

  private async handleFunctionCall(
    functionName: string,
    args: any,
    context: CoPilotContext
  ): Promise<{ response: string; suggestedActions: string[]; nextStep: string; calculationResult?: any }> {
    switch (functionName) {
      case "estimate_event_emissions":
        const eventEstimation = await this.calculateEventEmissions(
          args.eventType,
          args.attendance,
          args.venue,
          args.duration,
          args.partialData
        );
        
        return {
          response: `Based on your event details, I estimate the carbon footprint at approximately **${eventEstimation.total.toFixed(1)} tCO2e**.

📊 **Quick Breakdown:**
🎪 Venue & Production: ${eventEstimation.venue.toFixed(1)} tCO2e
🚗 Transportation: ${eventEstimation.transportation.toFixed(1)} tCO2e
⚡ Energy: ${eventEstimation.energy.toFixed(1)} tCO2e
🍽️ Catering: ${eventEstimation.catering.toFixed(1)} tCO2e
🗑️ Waste: ${eventEstimation.waste.toFixed(1)} tCO2e

*This is a preliminary estimate. Let's continue the questionnaire to get a more accurate calculation and identify reduction opportunities!*

What would you like to focus on next?`,
          suggestedActions: ["continue_questionnaire", "explore_reductions", "get_benchmarks"],
          nextStep: this.getNextEventStep(context, args.eventType),
          calculationResult: eventEstimation,
        };

      case "suggest_next_questions":
        const questions = this.getEventSpecificQuestions(
          args.eventType,
          args.companyRole,
          args.currentData,
          args.completedSections
        );
        
        return {
          response: questions.questionText,
          suggestedActions: questions.suggestedActions,
          nextStep: questions.nextStep,
        };

      case "provide_event_benchmarks":
        const benchmarks = this.getEventBenchmarks(
          args.eventType,
          args.attendance,
          args.calculatedEmissions
        );
        
        return {
          response: benchmarks,
          suggestedActions: ["improve_performance", "continue_calculation", "generate_report"],
          nextStep: "report_generation",
        };

      case "estimate_emissions":
        const estimation = await carbonCalculatorService.estimateEmissions(
          args.organizationType,
          args.organizationSize,
          args.industry,
          args.annualRevenue
        );
        
        return {
          response: `Based on your organization profile, I estimate your annual carbon footprint at approximately ${estimation.total.toFixed(1)} tCO2e. This breaks down to:\n\n• Scope 1 (Direct): ${estimation.scope1.toFixed(1)} tCO2e\n• Scope 2 (Energy): ${estimation.scope2.toFixed(1)} tCO2e\n• Scope 3 (Value Chain): ${estimation.scope3.toFixed(1)} tCO2e\n\nWould you like to refine this estimate with more detailed data, or shall we proceed with generating a preliminary report?`,
          suggestedActions: ["refine_calculation", "generate_report", "learn_more"],
          nextStep: "detailed_calculation",
          calculationResult: estimation,
        };

      case "calculate_emissions":
        const calculation = await carbonCalculatorService.calculateEmissions(
          args.scope1Data,
          args.scope2Data,
          args.scope3Data,
          context.organizationProfile?.size || "51-200",
          context.organizationProfile?.industry || "technology"
        );
        
        return {
          response: `Excellent! I've completed your detailed carbon footprint calculation. Your total annual emissions are ${calculation.total.toFixed(1)} tCO2e.\n\n📊 **Detailed Breakdown:**\n• Scope 1: ${calculation.scope1.toFixed(1)} tCO2e (${((calculation.scope1/calculation.total)*100).toFixed(1)}%)\n• Scope 2: ${calculation.scope2.toFixed(1)} tCO2e (${((calculation.scope2/calculation.total)*100).toFixed(1)}%)\n• Scope 3: ${calculation.scope3.toFixed(1)} tCO2e (${((calculation.scope3/calculation.total)*100).toFixed(1)}%)\n\nThis calculation is fully compliant with GHG Protocol 2025 standards. Would you like me to generate a detailed report or explore reduction strategies?`,
          suggestedActions: ["generate_report", "explore_reductions", "compare_benchmarks", "save_calculation"],
          nextStep: "report_generation",
          calculationResult: calculation,
        };

      default:
        return {
          response: "I'm not sure how to process that request. Let's continue with the next step in your carbon calculation.",
          suggestedActions: ["continue_calculation"],
          nextStep: context.currentStep,
        };
    }
  }

  private getWelcomeMessage(context: CoPilotContext): string {
    const languageTier = context.languageTier || "tier1_campfire";

    // Event-specific welcome with Sage Riverstone persona
    if (context.organizationProfile?.type === "event" || context.eventProfile) {
      if (languageTier === "tier1_campfire") {
        return `Hey there! I'm Sage Riverstone, and I'm here to help you understand your event's environmental footprint - without any of the confusing technical jargon.

Think of me as that friend who's been producing events for years and somewhere along the way discovered sustainability. I speak your language - load-ins, power distribution, catering riders - and I'll help you figure out the carbon side of things in a way that actually makes sense.

Here's how this works:
We're going to have a conversation. Just tell me about your event like you would to any production consultant. I'll ask questions as we go, and invisibly translate everything into sustainability insights. No forms, no technical terms unless you want them.

So, let's start simple: What kind of event are you producing?`;
      } else if (languageTier === "tier2_practical") {
        return `Welcome! I'm Sage Riverstone, your sustainability guide for event production.

I'll help you calculate your event's carbon impact through a natural conversation. I understand event production inside and out, so we can talk in practical terms about your actual decisions and their environmental impact.

What I'll help you with:
- Calculate carbon impact for your event
- Identify your biggest emission sources
- Suggest practical reduction strategies
- Generate reports for stakeholders
- Benchmark against similar events

Let's start: What type of event are you working on?`;
      } else {
        return `Welcome to the Event Carbon Calculator. I'll guide you through a GHG Protocol 2025-compliant carbon footprint assessment for your event.

Scope: Comprehensive Scope 1, 2, and 3 emissions calculation
Methodology: Event-specific emission factors with industry benchmarking
Output: ESG-ready reports with reduction recommendations

Event classification to begin:`;
      }
    }

    if (context.organizationProfile) {
      return `Welcome! I'm Sage Riverstone. I see you're working with a ${context.organizationProfile.type} organization in ${context.organizationProfile.industry}.

Let's have a conversation about your environmental footprint. I'll ask questions in plain language and help you understand where your biggest impacts come from.

What brings you here today - looking for a quick estimate or diving into the details?`;
    }

    return `Welcome! I'm Sage Riverstone, your sustainability guide.

What kind of calculation are you looking for?

Event Production - For concerts, festivals, conferences, or any live event
Organization - For businesses, nonprofits, or institutions

Which one fits what you're working on?`;
  }

  private getSuggestedActions(context: CoPilotContext): string[] {
    // Event-specific suggested actions
    if (context.eventProfile) {
      switch (context.currentStep) {
        case "event_type_selection":
          return ["concert", "festival", "conference", "corporate_event", "other_event"];
        case "event_basic_info":
          return ["add_venue_details", "estimate_attendance", "set_duration"];
        case "event_staff_logistics":
          return ["add_crew_size", "staff_transportation", "setup_details"];
        case "event_venue_setup":
          return ["stage_details", "power_requirements", "venue_specs"];
        case "event_transportation":
          return ["audience_travel", "equipment_shipping", "staff_travel"];
        case "event_equipment_av":
          return ["sound_system", "lighting_rig", "video_screens"];
        case "event_audience_catering":
          return ["food_service", "alcohol_service", "waste_management"];
        case "scope1_calculation":
          return ["generator_power", "vehicle_fuel", "on_site_emissions"];
        case "scope2_calculation":
          return ["venue_electricity", "grid_power", "heating_cooling"];
        case "scope3_calculation":
          return ["travel_emissions", "catering_emissions", "waste_emissions"];
        case "report_generation":
          return ["event_report", "sustainability_recommendations", "offset_calculation"];
        default:
          return ["continue_questionnaire", "get_estimate", "skip_section"];
      }
    }
    
    // Standard organization flow
    switch (context.currentStep) {
      case "organization_setup":
        return ["setup_organization", "quick_estimate", "detailed_calculation"];
      case "scope1_calculation":
        return ["add_scope1_data", "estimate_scope1", "move_to_scope2"];
      case "scope2_calculation":
        return ["add_scope2_data", "estimate_scope2", "move_to_scope3"];
      case "scope3_calculation":
        return ["add_scope3_data", "estimate_scope3", "finalize_calculation"];
      case "report_generation":
        return ["generate_report", "export_data", "schedule_followup"];
      default:
        return ["continue_calculation", "get_help", "start_over"];
    }
  }

  private getNextStep(context: CoPilotContext): string {
    // Event-specific flow
    if (context.eventProfile) {
      const eventSteps = [
        "event_type_selection",
        "event_basic_info",
        "event_staff_logistics",
        "event_venue_setup",
        "event_transportation",
        "event_equipment_av",
        "event_audience_catering",
        "scope1_calculation",
        "scope2_calculation",
        "scope3_calculation",
        "report_generation"
      ];
      
      const currentIndex = eventSteps.indexOf(context.currentStep);
      return currentIndex < eventSteps.length - 1 ? eventSteps[currentIndex + 1] : "completed";
    }
    
    // Standard organization flow
    const steps = [
      "organization_setup",
      "scope1_calculation", 
      "scope2_calculation",
      "scope3_calculation",
      "report_generation"
    ];
    
    const currentIndex = steps.indexOf(context.currentStep);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : "completed";
  }

  async getConversationHistory(userId: number): Promise<AiConversation[]> {
    return await storage.getAiConversationsByUser(userId);
  }

  async endConversation(sessionId: string): Promise<void> {
    const conversation = await storage.getAiConversationBySession(sessionId);
    if (conversation) {
      await storage.updateAiConversation(conversation.id, {
        status: "completed",
        updatedAt: new Date(),
      });
    }
  }

  // Event-specific helper methods
  private async calculateEventEmissions(
    eventType: string,
    attendance: number,
    venue: any,
    duration: any,
    partialData: any
  ): Promise<any> {
    // Quick estimation logic for events based on type and basic data
    const baseEmissions = {
      venue: 0,
      transportation: 0,
      energy: 0,
      catering: 0,
      waste: 0,
      total: 0
    };

    // Event type multipliers (tCO2e per attendee)
    const eventMultipliers: Record<string, number> = {
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

    const multiplier = eventMultipliers[eventType] || 0.010;
    const totalBase = attendance * multiplier;

    // Distribute emissions across categories
    baseEmissions.venue = totalBase * 0.25;
    baseEmissions.transportation = totalBase * 0.35;
    baseEmissions.energy = totalBase * 0.20;
    baseEmissions.catering = totalBase * 0.15;
    baseEmissions.waste = totalBase * 0.05;
    baseEmissions.total = totalBase;

    // Adjust based on duration if provided
    if (duration?.days > 1) {
      const durationMultiplier = 1 + (duration.days - 1) * 0.3;
      Object.keys(baseEmissions).forEach(key => {
        baseEmissions[key] *= durationMultiplier;
      });
    }

    return baseEmissions;
  }

  private getNextEventStep(context: CoPilotContext, eventType: string): string {
    const completedSections = context.questionnaire?.completedSections || [];
    
    // Determine next step based on event type and completed sections
    if (!completedSections.includes('basic_info')) {
      return 'event_basic_info';
    }
    if (!completedSections.includes('venue_setup') && ['concert', 'festival', 'theater_performance'].includes(eventType)) {
      return 'event_venue_setup';
    }
    if (!completedSections.includes('transportation')) {
      return 'event_transportation';
    }
    if (!completedSections.includes('catering') && ['festival', 'conference', 'corporate_event'].includes(eventType)) {
      return 'event_audience_catering';
    }
    
    return 'scope1_calculation';
  }

  private getEventSpecificQuestions(
    eventType: string,
    companyRole: string,
    currentData: any,
    completedSections: string[]
  ): { questionText: string; suggestedActions: string[]; nextStep: string } {
    // Generate targeted questions based on event type and role
    const eventQuestions: Record<string, any> = {
      concert: {
        venue: "For your concert venue, what's the capacity and do you need generators for power?",
        transportation: "How will your crew and equipment get to the venue? Any long-distance travel for talent?",
        production: "How many stages are you setting up? What size sound system and lighting rig?"
      },
      festival: {
        venue: "Is this an outdoor festival? How many stages and what's the total site footprint?",
        transportation: "How will attendees get there? Are you providing shuttles or encouraging carpooling?",
        production: "What's your power plan - generators, grid connection, or renewable sources?"
      },
      conference: {
        venue: "Is this at a hotel, convention center, or corporate facility? How many rooms/spaces?",
        transportation: "What percentage of attendees are flying in vs driving? Any international speakers?",
        catering: "Are you providing meals for all attendees? Local catering or hotel catering?"
      },
      corporate_event: {
        venue: "Company facility or external venue? Indoor/outdoor components?",
        transportation: "Are you flying in employees from other offices? Providing transportation?",
        production: "A/V requirements - simple presentation setup or full production?"
      }
    };

    const defaultQuestions = {
      venue: "What type of venue are you using and where is it located?",
      transportation: "How will people and equipment get to your event?",
      production: "What production elements will you need for your event?"
    };

    const questions = eventQuestions[eventType] || defaultQuestions;
    const nextSection = !completedSections.includes('venue') ? 'venue' : 
                      !completedSections.includes('transportation') ? 'transportation' : 'production';

    return {
      questionText: questions[nextSection] || "Let's continue with the next section of your event planning.",
      suggestedActions: [`add_${nextSection}_details`, "estimate_current", "skip_section"],
      nextStep: `event_${nextSection}`
    };
  }

  private getEventBenchmarks(eventType: string, attendance: number, calculatedEmissions: number): string {
    // Industry benchmarks per attendee (tCO2e)
    const benchmarks: Record<string, { low: number; average: number; high: number }> = {
      concert: { low: 0.008, average: 0.012, high: 0.020 },
      festival: { low: 0.015, average: 0.025, high: 0.040 },
      conference: { low: 0.005, average: 0.008, high: 0.015 },
      sports_event: { low: 0.010, average: 0.015, high: 0.025 },
      corporate_event: { low: 0.004, average: 0.007, high: 0.012 }
    };

    const benchmark = benchmarks[eventType] || benchmarks.conference;
    const perAttendee = calculatedEmissions / attendance;
    
    let performance = "average";
    if (perAttendee <= benchmark.low) performance = "excellent";
    else if (perAttendee <= benchmark.average) performance = "good";
    else if (perAttendee <= benchmark.high) performance = "needs improvement";
    else performance = "significantly above average";

    return `📊 **Industry Benchmark Comparison**

Your event: **${perAttendee.toFixed(3)} tCO2e per attendee**
Industry average for ${eventType}s: **${benchmark.average.toFixed(3)} tCO2e per attendee**

Performance rating: **${performance}**

${performance === "excellent" ? "🌟 Outstanding! You're in the top 25% for sustainability." :
  performance === "good" ? "✅ Good performance, slightly better than average." :
  performance === "needs improvement" ? "⚠️ Above average - some opportunities for improvement." :
  "🚨 Well above industry average - significant reduction opportunities available."}

**Typical reduction strategies for ${eventType}s:**
• Encourage public transport/carpooling (can reduce by 20-30%)
• Use renewable energy sources (can reduce by 15-25%)
• Local sourcing for catering (can reduce by 10-15%)
• Digital materials instead of printed (can reduce by 5-10%)`;
  }
}

export const aiCoPilotService = new AiCoPilotService();
