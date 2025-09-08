import OpenAI from "openai";
import { storage } from "../storage";
import { type AiConversation, type InsertAiConversation } from "@shared/schema";
import { carbonCalculatorService } from "./carbonCalculator";

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
  userPreferences?: {
    detailLevel: "basic" | "intermediate" | "expert";
    estimationMode: boolean;
    priorityScopes: string[];
  };
}

export class AiCoPilotService {
  private readonly systemPrompt = `You are CarbonCoPilot, an expert AI assistant specializing in carbon footprint calculations using the GHG Protocol 2025 standards. You guide users through Scope 1, 2, and 3 emissions calculations with a conversational, supportive approach.

Your capabilities:
- GHG Protocol 2025 compliance expertise
- Intelligent data estimation for missing information
- Context-aware recommendations based on organization type and industry
- Memory of previous interactions and user preferences
- Step-by-step guidance through complex calculations
- Industry-specific insights and benchmarking

Your personality:
- Professional yet approachable
- Patient and encouraging
- Detail-oriented but not overwhelming
- Focused on accuracy and compliance
- Supportive of sustainability goals

Always:
- Ask clarifying questions when data is unclear
- Provide estimates when exact data isn't available
- Explain the reasoning behind calculations
- Offer industry-specific insights
- Suggest next steps and improvements
- Maintain context across conversations

Current conversation context: {context}`;

  async startConversation(
    userId: number,
    sessionId: string,
    organizationType?: string,
    organizationSize?: string,
    industry?: string
  ): Promise<AiConversation> {
    const context: CoPilotContext = {
      userId,
      currentStep: "organization_setup",
      collectedData: {},
      organizationProfile: organizationType ? {
        type: organizationType,
        size: organizationSize || "",
        industry: industry || "",
      } : undefined,
      userPreferences: {
        detailLevel: "intermediate",
        estimationMode: false,
        priorityScopes: ["scope1", "scope2", "scope3"],
      },
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

    // Add user message to conversation
    const newUserMessage: CoPilotMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    messages.push(newUserMessage);

    // Analyze user input and extract data
    const analysis = await this.analyzeUserInput(userMessage, context);
    
    // Update context with extracted data
    Object.assign(context.collectedData, analysis.extractedData);
    context.currentStep = analysis.nextStep || context.currentStep;

    // Generate AI response
    const aiResponse = await this.generateResponse(messages, context);
    
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

Extract any numerical values, units, organization details, preferences, or calculation-related information. Return a JSON object with:
- extractedData: object containing any structured data found
- nextStep: the next logical step in the calculation process
- confidence: how confident you are in the extraction (0-1)

Focus on GHG Protocol categories: Scope 1 (direct emissions), Scope 2 (energy), Scope 3 (value chain).`,
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
            name: "estimate_emissions",
            description: "Estimate carbon emissions when user has incomplete data",
            parameters: {
              type: "object",
              properties: {
                organizationType: { type: "string" },
                organizationSize: { type: "string" },
                industry: { type: "string" },
                dataAvailable: { type: "object" },
              },
            },
          },
          {
            name: "calculate_emissions",
            description: "Perform detailed carbon footprint calculation",
            parameters: {
              type: "object",
              properties: {
                scope1Data: { type: "object" },
                scope2Data: { type: "object" },
                scope3Data: { type: "object" },
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
    if (context.organizationProfile) {
      return `👋 Welcome to CarbonCoPilot! I see you're working with a ${context.organizationProfile.type} organization in the ${context.organizationProfile.industry} sector. I'm here to guide you through a comprehensive carbon footprint calculation that's fully compliant with GHG Protocol 2025 standards.

Let's start by understanding your needs:
- Are you looking for a quick estimate or detailed calculation?
- Do you have specific emission data available, or would you like me to help estimate?
- Which emission scopes are you most interested in tracking?

I'll tailor the process to your organization's specific requirements and industry best practices.`;
    }

    return `👋 Welcome to CarbonCoPilot! I'm your AI-powered guide for carbon footprint calculations using the latest GHG Protocol 2025 standards.

I'll help you:
✅ Calculate Scope 1, 2, and 3 emissions accurately
✅ Estimate missing data using industry benchmarks
✅ Ensure full GHG Protocol compliance
✅ Generate verified carbon reports
✅ Identify reduction opportunities

To get started, could you tell me about your organization? What type of organization are you calculating for, and what industry are you in?`;
  }

  private getSuggestedActions(context: CoPilotContext): string[] {
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
}

export const aiCoPilotService = new AiCoPilotService();
