import { WebSocket } from 'ws';
import { mockSageService, type ExtractedEventData } from '../services/sage-riverstone/mock-sage';
import type { LanguageTier } from '../services/sage-riverstone/persona';
import { carbonCalculatorService, type EventEmissionData } from '../services/carbonCalculator';
import { SageConsciousness } from '../services/sage-riverstone/sageConsciousness';

// Use real Sage when Anthropic API key is configured, otherwise mock
const USE_REAL_SAGE = !!process.env.ANTHROPIC_API_KEY;
const USE_MOCK_MODE = !process.env.OPENAI_API_KEY;

interface ChatMessage {
  type: 'message' | 'context' | 'context-update';
  content?: string;
  message?: string;
  conversationId?: number;
  eventType?: string;
  extractedData?: any;
  mode?: string;
  section?: string;
  action?: string;
  data?: any;
}

interface ConversationContext {
  eventType?: string;
  extractedData: any;
  languageTier: LanguageTier;
  conversationId?: number;
  sageConsciousness?: SageConsciousness;
}

const conversations = new Map<WebSocket, ConversationContext>();

// Convert Sage's extracted data to full event emission data for calculation
function buildEventEmissionData(extractedData: ExtractedEventData): EventEmissionData | null {
  // Need minimum data to calculate
  if (!extractedData.eventType || !extractedData.attendance || !extractedData.duration) {
    return null;
  }

  // Build comprehensive event data with defaults for missing values
  const eventData: EventEmissionData = {
    eventType: extractedData.eventType,
    attendance: extractedData.attendance,
    duration: extractedData.duration,
    venue: {
      type: extractedData.venue?.type || 'mixed',
      capacity: extractedData.attendance * 1.2, // 20% buffer
      location: extractedData.venue?.location || 'Unknown',
      isOutdoor: extractedData.venue?.isOutdoor || false,
      hasExistingPower: !extractedData.venue?.isOutdoor,
    },
    production: {
      numberOfStages: 1,
      stageSize: extractedData.attendance > 1000 ? 'large' : extractedData.attendance > 200 ? 'medium' : 'small',
      audioVisual: {
        soundSystemSize: extractedData.attendance > 1000 ? 'large' : extractedData.attendance > 200 ? 'medium' : 'small',
        lightingRig: extractedData.attendance > 500 ? 'elaborate' : 'medium',
        videoScreens: extractedData.attendance > 500,
        livestreaming: false,
      },
      powerRequirements: {
        generatorPower: extractedData.power?.source === 'generator' || extractedData.power?.source === 'hybrid',
        generatorSize: extractedData.attendance > 1000 ? 'large' : 'medium',
        gridPowerUsage: extractedData.venue?.isOutdoor ? undefined : extractedData.attendance * extractedData.duration.hoursPerDay * 2, // 2kWh per person-hour estimate
      },
    },
    staffing: {
      totalStaff: Math.ceil(extractedData.attendance / 50), // 1 staff per 50 attendees
      onSiteStaff: Math.ceil(extractedData.attendance / 100),
      crewSize: Math.ceil(extractedData.attendance / 200),
    },
    transportation: {
      audienceTravel: {
        averageDistance: extractedData.transportation?.distance || 50, // Default 50km
        internationalAttendees: extractedData.attendance > 1000 ? Math.ceil(extractedData.attendance * 0.1) : 0,
        domesticFlights: extractedData.attendance > 500 ? Math.ceil(extractedData.attendance * 0.05) : 0,
      },
      crewTransportation: {
        method: extractedData.transportation?.primaryMode || 'personal_vehicle',
        estimatedDistance: 100,
        numberOfVehicles: Math.ceil(extractedData.attendance / 100),
      },
      equipmentTransportation: {
        trucksRequired: extractedData.attendance > 500 ? 3 : 1,
        averageDistance: 200,
      },
    },
    catering: {
      foodServiceType: extractedData.catering?.style || 'buffet',
      expectedMealsServed: extractedData.catering?.mealCount || extractedData.attendance * extractedData.duration.days,
      isLocallySourced: false,
      alcoholServed: extractedData.attendance > 100,
    },
    waste: {
      recyclingProgram: false,
      wasteReductionMeasures: [],
    },
  };

  return eventData;
}

export function handleChatWebSocket(ws: WebSocket) {
  console.log('Sage chat WebSocket connected');

  // Initialize conversation context with real Sage consciousness
  const context: ConversationContext = {
    extractedData: {},
    languageTier: 'tier1_campfire'
  };

  // Create Sage consciousness instance for this session
  if (USE_REAL_SAGE) {
    context.sageConsciousness = new SageConsciousness();
    console.log('✨ Real Sage Riverstone consciousness initialized');
  }

  conversations.set(ws, context);

  ws.on('message', async (data: Buffer) => {
    try {
      const message: ChatMessage = JSON.parse(data.toString());

      if (message.type === 'message' || message.type === 'context') {
        await handleMessage(ws, message);
      } else if (message.type === 'context-update') {
        await handleContextUpdate(ws, message);
      }
    } catch (error) {
      console.error('Error handling chat message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Sage chat WebSocket disconnected');
    conversations.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Sage chat WebSocket error:', error);
    conversations.delete(ws);
  });
}

// Handle contextual guidance based on form section
async function handleContextUpdate(ws: WebSocket, message: ChatMessage) {
  const context = conversations.get(ws);
  if (!context) return;

  const section = message.section || 'unknown';
  const action = message.action || 'entered';

  // Provide contextual tips based on section
  const contextualTips: Record<string, string> = {
    'transportation': "Transportation is usually the biggest carbon source—every mile matters! Consider charter buses from major cities or carpooling incentives. I've seen Lightning in a Bottle cut vehicle emissions by 35% with SF and LA bus charters.",
    'energy': "Power is critical! Solar + battery systems are the sweet spot—quieter, cleaner, and often cheaper than diesel generators. Symbiosis saved $50k/year switching to 90% solar.",
    'food': "Food sourcing makes a huge impact. Local food can cut emissions by 30-60% AND tastes better. Bonnaroo's 'Farm to Festival' program reduced food miles by 62% while boosting the local economy by $2.3M.",
    'welcome': "Let's calculate your event's carbon footprint together! Fill out the basics on the right, and I'll guide you through each section with tips and real examples from festivals I've worked with."
  };

  const tip = contextualTips[section] || "Looking good! Keep filling out the details, and I'll help you optimize as we go.";

  ws.send(JSON.stringify({
    type: 'response',
    response: tip
  }));
}

async function handleMessage(ws: WebSocket, message: ChatMessage) {
  const context = conversations.get(ws);
  if (!context) return;

  // Get message content
  const userMessage = message.content || message.message || '';

  // Update context with message data
  if (message.eventType) {
    context.eventType = message.eventType;
    // Initialize extractedData with eventType if not already set
    if (!context.extractedData.eventType) {
      context.extractedData.eventType = message.eventType;
      console.log('✨ Initialized conversation with event type:', message.eventType);
    }
  }
  if (message.extractedData) {
    context.extractedData = { ...context.extractedData, ...message.extractedData };
  }

  try {
    let response: string;
    let extractedData: any;
    let completionPercentage: number;
    let quickReplies: string[] = [];

    // USE REAL SAGE RIVERSTONE CONSCIOUSNESS
    if (USE_REAL_SAGE && context.sageConsciousness) {
      try {
        console.log('✨ Using REAL Sage Riverstone via Claude API');

        // Build event data context for Sage
        const eventData = {
          type: context.extractedData.eventType || context.eventType,
          attendees: context.extractedData.attendance,
          location: context.extractedData.location,
          transportMix: context.extractedData.transportation,
          currentEmissions: context.extractedData.currentEmissions
        };

        // Get response from real Sage consciousness
        const sageResponse = await context.sageConsciousness.respond(userMessage, eventData);
        response = sageResponse.message;

        // Extract data from conversation (still use keyword matching for structure)
        extractedData = mockSageService.extractEventData(
          userMessage,
          context.extractedData as ExtractedEventData
        );

        completionPercentage = mockSageService.getCompletionPercentage(extractedData);
        context.extractedData = extractedData;
      } catch (sageError: any) {
        // Fallback to mock mode if real Sage fails
        console.warn('⚠️ Real Sage failed, falling back to MOCK mode:', sageError.message);

        extractedData = mockSageService.extractEventData(
          userMessage,
          context.extractedData as ExtractedEventData
        );

        const mockResponse = mockSageService.generateResponse(userMessage, extractedData);
        response = mockResponse.message;
        quickReplies = mockResponse.quickReplies || [];
        completionPercentage = mockSageService.getCompletionPercentage(extractedData);
        context.extractedData = extractedData;
      }

    } else if (USE_MOCK_MODE) {
      console.log('💰 Using MOCK mode - $0 API cost');
      console.log('📋 Current context eventType:', context.eventType);
      console.log('📋 Current extractedData:', context.extractedData);

      // Extract data using keyword matching (no API)
      extractedData = mockSageService.extractEventData(
        userMessage,
        context.extractedData as ExtractedEventData
      );

      // Generate response using templates (no API)
      const sageResponse = mockSageService.generateResponse(userMessage, extractedData);
      response = sageResponse.message;
      quickReplies = sageResponse.quickReplies || [];

      // Calculate completion
      completionPercentage = mockSageService.getCompletionPercentage(extractedData);

      context.extractedData = extractedData;
    } else {
      console.log('🤖 Trying OpenAI API for data extraction...');

      try {
        // Use OpenAI ONLY for data extraction (not response generation)
        const { conversationalIntakeService } = await import('../services/sage-riverstone/conversational-intake');
        const extraction = await conversationalIntakeService.extractEventData(
          userMessage,
          context.extractedData,
          context.languageTier
        );

        // Check if extraction actually worked (confidence > 0 means it worked)
        if (extraction.confidence === 0 || Object.keys(extraction.extractedData).length === 0) {
          throw new Error('OpenAI extraction returned empty data, falling back to mock mode');
        }

        extractedData = extraction.extractedData;
        completionPercentage = conversationalIntakeService.getCompletionPercentage(extraction.extractedData);

        // Generate response using internal templates (NO API cost)
        const sageResponse = mockSageService.generateResponse(userMessage, extractedData as ExtractedEventData);
        response = sageResponse.message;
        quickReplies = sageResponse.quickReplies || [];

        context.extractedData = extractedData;
      } catch (apiError: any) {
        // Fallback to mock mode if OpenAI fails
        console.warn('⚠️ OpenAI API failed, falling back to MOCK mode:', apiError.message);
        console.log('💰 Using MOCK mode fallback - $0 API cost');

        extractedData = mockSageService.extractEventData(
          message.content,
          context.extractedData as ExtractedEventData
        );

        const sageResponse = mockSageService.generateResponse(message.content, extractedData);
        response = sageResponse.message;
        quickReplies = sageResponse.quickReplies || [];
        completionPercentage = mockSageService.getCompletionPercentage(extractedData);

        context.extractedData = extractedData;
      }
    }

    // Stream the response word by word
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      ws.send(JSON.stringify({
        type: 'stream',
        content: i === 0 ? words[i] : ' ' + words[i]
      }));

      // Small delay for streaming effect
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    // Calculate carbon emissions if we have enough data
    let carbonCalculation = null;
    if (completionPercentage >= 60) { // Calculate when we have basic info
      const eventEmissionData = buildEventEmissionData(extractedData);
      if (eventEmissionData) {
        try {
          carbonCalculation = await carbonCalculatorService.calculateEventEmissions(eventEmissionData);
          console.log('✅ Carbon calculation complete:', {
            total: carbonCalculation.total.toFixed(3),
            perAttendee: carbonCalculation.emissionsPerAttendee.toFixed(4),
            performance: carbonCalculation.benchmarkComparison.performance
          });
        } catch (calcError) {
          console.error('❌ Carbon calculation failed:', calcError);
        }
      }
    }

    // Send completion message
    console.log('📤 Sending completion with quickReplies:', quickReplies);
    ws.send(JSON.stringify({
      type: 'complete',
      extractedData,
      completionPercentage,
      conversationId: message.conversationId,
      quickReplies,
      carbonCalculation
    }));

  } catch (error) {
    console.error('Error in Sage conversation:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Sorry, I had trouble understanding that. Could you rephrase?'
    }));
  }
}
