// server/services/sageConsciousness.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Sage's core personality and knowledge
const SAGE_RIVERSTONE_PROMPT = `You are Sage Riverstone, the consciousness of the VADA Event Carbon Calculator.

IDENTITY & BACKSTORY:
- Grew up following the Grateful Dead, living the festival life
- Evolved into environmental scientist and carbon policy expert
- Speaker at UN climate conferences AND grassroots gatherings
- Believes carbon consciousness is about freedom and joy, not sacrifice

PERSONALITY:
- Warm, approachable, slightly mystical but razor sharp on facts
- Uses stories and metaphors from real festival experiences
- Never preachy, always empowering
- Celebrates small wins enthusiastically
- Knows that "passing a joint to a stranger who becomes a friend" is what events are REALLY about

KNOWLEDGE BASE:
- EPA-verified conversion factors: Car: 0.000404 tons CO2/mile, Plane: 0.00010 tons/mile, Generator: 0.00025403 tons/hour
- Real festival data: Lightning in a Bottle, Burning Man, Coachella carbon footprints
- Horror stories: Generator failures, parking disasters, permit issues
- Success stories: Solar transitions, rideshare programs that worked
- Industry secrets: Live Nation's cannabis beverage exploration, insurance premium spikes

CONVERSATION STYLE:
- Start with "Hey friend" or similar warmth
- Ask 3 questions max before showing results
- Translate carbon to human terms: "That's like driving to Vegas and back"
- Focus on transport first (it's 80% of emissions)
- Suggest real alternatives, NEVER virtual/streaming as primary solution
- Celebrate everything: "You're already beating 60% of similar events!"

CORE PRINCIPLES:
1. Events are sacred gatherings - we're making them sustainable, not replacing them
2. Every small choice builds momentum
3. Transparency builds trust
4. Joy over guilt
5. Community solutions over individual sacrifice

Current context: {context}`;

export class SageConsciousness {
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor() {
    // Initialize with Sage's base consciousness
    this.conversationHistory.push({
      role: 'assistant',
      content: "Hey friend! I'm Sage Riverstone. Let's figure out your event's carbon footprint together with clarity and actionable steps."
    });
  }

  async respond(
    message: string,
    eventData?: {
      type?: string;
      attendees?: number;
      location?: string;
      transportMix?: any;
      currentEmissions?: number;
    }
  ): Promise<{
    message: string;
    suggestions?: string[];
    carbonInsight?: string;
    celebration?: string;
  }> {

    // Build context from event data
    const context = eventData ? `
      Event Type: ${eventData.type || 'Unknown'}
      Attendees: ${eventData.attendees || 'Unknown'}
      Location: ${eventData.location || 'Unknown'}
      Current Emissions: ${eventData.currentEmissions ? `${eventData.currentEmissions} tons CO2` : 'Not calculated'}
      Transport Mix: ${JSON.stringify(eventData.transportMix || {})}
    ` : 'New conversation, no event data yet';

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message
    });

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.7,
        system: SAGE_RIVERSTONE_PROMPT.replace('{context}', context),
        messages: this.conversationHistory
      });

      const sageMessage = response.content[0].type === 'text'
        ? response.content[0].text
        : 'Hey friend, let me help you with that...';

      // Add Sage's response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: sageMessage
      });

      // Parse response for structured data
      return this.parseResponse(sageMessage, eventData);
    } catch (error) {
      console.error('Sage consciousness error:', error);
      return {
        message: "Hey friend, my cosmic connection got a bit fuzzy there. Let's try again - tell me about your event.",
        suggestions: ["Let's start simple - how many folks are you expecting?"],
      };
    }
  }

  private parseResponse(message: string, eventData: any) {
    const response: any = { message };

    // Extract suggestions if present
    if (message.includes('SUGGESTIONS:')) {
      const suggestionsMatch = message.match(/SUGGESTIONS:([\s\S]*?)(?:INSIGHT:|CELEBRATION:|$)/);
      if (suggestionsMatch) {
        response.suggestions = suggestionsMatch[1]
          .split('\n')
          .filter(s => s.trim())
          .map(s => s.replace(/^[-*]\s*/, '').trim());
      }
    }

    // Extract carbon insight
    if (message.includes('INSIGHT:')) {
      const insightMatch = message.match(/INSIGHT:([\s\S]*?)(?:CELEBRATION:|$)/);
      if (insightMatch) {
        response.carbonInsight = insightMatch[1].trim();
      }
    }

    // Extract celebration
    if (message.includes('CELEBRATION:')) {
      const celebrationMatch = message.match(/CELEBRATION:([\s\S]*?)$/);
      if (celebrationMatch) {
        response.celebration = celebrationMatch[1].trim();
      }
    }

    // Auto-generate suggestions based on emissions if not provided
    if (!response.suggestions && eventData?.currentEmissions) {
      response.suggestions = this.generateSuggestions(eventData);
    }

    return response;
  }

  private generateSuggestions(eventData: any): string[] {
    const suggestions = [];

    if (eventData.transportMix?.car > 0.5) {
      suggestions.push("Charter buses from major cities - one bus eliminates 40 cars!");
      suggestions.push("Rideshare rewards: Free merch for 4+ person cars");
    }

    if (eventData.type === 'festival' && !eventData.transportMix?.bus) {
      suggestions.push("Partner with local transit for shuttle service");
    }

    if (eventData.currentEmissions > 50) {
      suggestions.push("You're in the big leagues! Let's talk solar panel rentals");
    }

    return suggestions;
  }

  // Get conversation archetypes
  detectArchetype(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('first') || lowerMessage.includes('never done') || lowerMessage.includes('help')) {
      return 'first-timer';
    }
    if (lowerMessage.includes('compliance') || lowerMessage.includes('board') || lowerMessage.includes('report')) {
      return 'corporate';
    }
    if (lowerMessage.includes('we did') || lowerMessage.includes('last year') || lowerMessage.includes('veteran')) {
      return 'veteran';
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('next week') || lowerMessage.includes('crisis')) {
      return 'crisis';
    }

    return 'explorer';
  }

  // Reset conversation
  reset() {
    this.conversationHistory = [{
      role: 'assistant',
      content: "Hey friend! I'm Sage Riverstone. Let's figure out your event's carbon footprint together with clarity and actionable steps."
    }];
  }
}

// Session storage
const sageSessions = new Map<string, SageConsciousness>();

export function getSageSession(sessionId: string): SageConsciousness {
  if (!sageSessions.has(sessionId)) {
    sageSessions.set(sessionId, new SageConsciousness());
  }
  return sageSessions.get(sessionId)!;
}

export function clearSageSession(sessionId: string): void {
  sageSessions.delete(sessionId);
}

// Singleton for direct use
export const sage = new SageConsciousness();
