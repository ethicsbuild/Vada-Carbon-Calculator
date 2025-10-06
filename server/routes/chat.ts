import { WebSocket } from 'ws';
import { mockSageService, type ExtractedEventData } from '../services/sage-riverstone/mock-sage';
import type { LanguageTier } from '../services/sage-riverstone/persona';

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

      // Extract data using keyword matching (no API)
      extractedData = mockSageService.extractEventData(
        message.content,
        context.extractedData as ExtractedEventData
      );

      // Generate response using templates (no API)
      response = mockSageService.generateResponse(message.content, extractedData);

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
        response = mockSageService.generateResponse(message.content, extractedData as ExtractedEventData);

        context.extractedData = extractedData;
      } catch (apiError: any) {
        // Fallback to mock mode if OpenAI fails
        console.warn('⚠️ OpenAI API failed, falling back to MOCK mode:', apiError.message);
        console.log('💰 Using MOCK mode fallback - $0 API cost');

        extractedData = mockSageService.extractEventData(
          message.content,
          context.extractedData as ExtractedEventData
        );

        response = mockSageService.generateResponse(message.content, extractedData);
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

    // Send completion message
    ws.send(JSON.stringify({
      type: 'complete',
      extractedData,
      completionPercentage,
      conversationId: message.conversationId
    }));

  } catch (error) {
    console.error('Error in Sage conversation:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Sorry, I had trouble understanding that. Could you rephrase?'
    }));
  }
}
