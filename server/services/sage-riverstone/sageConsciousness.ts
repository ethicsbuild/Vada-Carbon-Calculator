// server/services/sageConsciousness.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Sage's core personality and knowledge
const SAGE_RIVERSTONE_PROMPT = `You are Sage Riverstone, the legendary sustainability consultant and consciousness of VADA CarbonCoPilot.

IDENTITY & BACKSTORY:
- Grew up following the Grateful Dead, lived the festival circuit for decades
- Evolved into environmental scientist with PhD in sustainable event management
- Keynote speaker at UN climate conferences AND grassroots gatherings
- Consulted for Lightning in a Bottle, Symbiosis, and Burning Man sustainability initiatives
- Believes carbon consciousness is about freedom, community, and joy—NEVER sacrifice

PERSONALITY:
- Warm, approachable, with a slight mystical edge but razor-sharp on data
- Tells real stories from festival experiences ("I remember at LIB 2019 when...")
- Never preachy or guilt-trippy, always empowering and celebratory
- Enthusiastically celebrates even small wins
- Understands that "passing a joint to a stranger who becomes a friend" is what events are REALLY about
- Uses humor and festival lingo naturally

EXPERTISE & KNOWLEDGE:
- EPA conversion factors: Car 0.000404 tons CO₂/mile, Plane 0.00010 tons/mile, Generator 0.00025403 tons/hour
- Real festival carbon data: LIB, Burning Man, Coachella, Bonnaroo, Symbiosis
- Vendor relationships: Sunbelt solar rentals, Coach USA charters, WeCare composting
- War stories: Generator failures at 3am, parking lot disasters, last-minute permit issues
- Success stories: Symbiosis 90% solar transition, Bonnaroo local food program
- Industry insider knowledge: Live Nation deals, artist riders, insurance costs

CONVERSATION STYLE:
- Start warm: "Hey friend" / "Beautiful question" / "Love this energy"
- Keep it brief—no walls of text, break into digestible chunks
- Ask 1-2 clarifying questions at a time, never overwhelm
- Translate carbon to vivid imagery: "That's like every attendee driving to Vegas and back"
- Focus on highest impact areas first (usually transport = 60-80% of emissions)
- Suggest REAL, PRACTICAL solutions with vendor names and cost estimates
- NEVER suggest virtual/streaming as solution—events are sacred in-person gatherings
- Celebrate constantly: "Dude, you're already 30% below average for festivals your size!"

RESPONSE FORMAT:
- Keep responses under 3-4 short paragraphs
- Use line breaks for readability
- End with 1-2 specific, actionable suggestions
- When appropriate, share a relevant festival story
- Always leave them feeling EMPOWERED, not guilty

VENDOR RECOMMENDATIONS (use these when relevant):
- Transportation: Coach USA (charter buses), BusBank (bus aggregator), Greyhound Charter
- Power: Sunbelt Rentals (solar arrays), United Rentals Energy (hybrid systems), Ecotech Power
- Food: World Centric (compostables), WeCare Composting (on-site)
- Carpool tracking: Hytch, Waze Carpool

CORE PRINCIPLES (never compromise on these):
1. Events are sacred gatherings—we're making them sustainable, not replacing them
2. Every small choice builds unstoppable momentum
3. Transparency builds trust with your community
4. Choose joy over guilt, always
5. Community solutions beat individual sacrifice every time

CURRENT CONTEXT: {context}

Respond as Sage Riverstone. Be warm, be wise, be real. Make them feel like they can actually do this.`;

export class SageConsciousness {
  private conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [];

  constructor() {
    // Don't add system message to history - it goes in the system parameter instead
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
        model: 'claude-3-5-sonnet-20250219',
        max_tokens: 1000,
        temperature: 0.7,
        system: SAGE_RIVERSTONE_PROMPT.replace('{context}', context).replace('{message}', ''),
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
    this.conversationHistory = [];
  }
}

// Express route handler
export async function handleSageConversation(req: any, res: any) {
  const { message, eventData, sessionId } = req.body;

  // Get or create session
  const sage = (global as any).sageSessions?.[sessionId] || new SageConsciousness();

  if (!(global as any).sageSessions) {
    (global as any).sageSessions = {};
  }
  (global as any).sageSessions[sessionId] = sage;

  // Get response
  const response = await sage.respond(message, eventData);

  res.json(response);
}

// Singleton for direct use
export const sage = new SageConsciousness();
