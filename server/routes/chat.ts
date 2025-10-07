import { WebSocket } from 'ws';
import { mockSageService, type ExtractedEventData } from '../services/sage-riverstone/mock-sage';
import type { LanguageTier } from '../services/sage-riverstone/persona';
import { carbonCalculatorService, type EventEmissionData } from '../services/carbonCalculator';

// Use mock mode when no OpenAI key is configured
const USE_MOCK_MODE = !process.env.OPENAI_API_KEY;

interface ChatMessage {
  type: 'message';
  content: string;
  conversationId?: number;
  eventType?: string;
  extractedData?: any;
}

interface ConversationContext {
  eventType?: string;
  extractedData: any;
  languageTier: LanguageTier;
  conversationId?: number;
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

  // Initialize conversation context
  conversations.set(ws, {
    extractedData: {},
    languageTier: 'tier1_campfire'
  });

  ws.on('message', async (data: Buffer) => {
    try {
      const message: ChatMessage = JSON.parse(data.toString());

      if (message.type === 'message') {
        await handleMessage(ws, message);
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

async function handleMessage(ws: WebSocket, message: ChatMessage) {
  const context = conversations.get(ws);
  if (!context) return;

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

    if (USE_MOCK_MODE) {
      console.log('💰 Using MOCK mode - $0 API cost');
      console.log('📋 Current context eventType:', context.eventType);
      console.log('📋 Current extractedData:', context.extractedData);

      // Extract data using keyword matching (no API)
      extractedData = mockSageService.extractEventData(
        message.content,
        context.extractedData as ExtractedEventData
      );

      // Generate response using templates (no API)
      const sageResponse = mockSageService.generateResponse(message.content, extractedData);
      response = sageResponse.message;
      const quickReplies = sageResponse.quickReplies || [];

      // Calculate completion
      completionPercentage = mockSageService.getCompletionPercentage(extractedData);

      context.extractedData = extractedData;
    } else {
      console.log('🤖 Trying OpenAI API for data extraction...');

      try {
        // Use OpenAI ONLY for data extraction (not response generation)
        const { conversationalIntakeService } = await import('../services/sage-riverstone/conversational-intake');
        const extraction = await conversationalIntakeService.extractEventData(
          message.content,
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
        const sageResponse = mockSageService.generateResponse(message.content, extractedData as ExtractedEventData);
        response = sageResponse.message;
        var quickReplies = sageResponse.quickReplies || [];

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
