/**
 * Mock Sage Service - Zero API Cost
 *
 * Provides realistic conversational responses without OpenAI API calls
 * Uses keyword matching and templates to simulate Sage Riverstone AI
 */

export interface ExtractedEventData {
  eventType?: string;
  attendance?: number;
  duration?: { days: number; hoursPerDay?: number };
  venue?: { type: string; isOutdoor?: boolean };
  transportation?: { primaryMode: string };
  catering?: { mealCount?: number };
  hasData: boolean;
  shownInitialEstimate?: boolean;
  shownReductions?: boolean;
}

export class MockSageService {
  private conversationState: Map<string, ExtractedEventData> = new Map();

  /**
   * Extract event data from user message using keyword matching
   */
  extractEventData(message: string, existingData: ExtractedEventData = { hasData: false }): ExtractedEventData {
    const lower = message.toLowerCase();
    const data = { ...existingData };

    // Event type detection
    if (!data.eventType) {
      if (lower.includes('festival') || lower.includes('music')) data.eventType = 'festival';
      else if (lower.includes('conference') || lower.includes('corporate')) data.eventType = 'conference';
      else if (lower.includes('wedding')) data.eventType = 'wedding';
      else if (lower.includes('concert') || lower.includes('show')) data.eventType = 'concert';
    }

    // Attendance extraction
    if (!data.attendance) {
      const attendanceMatch = lower.match(/(\d+[\s,]*(?:people|attendees|guests|person))/);
      if (attendanceMatch) {
        const num = parseInt(attendanceMatch[0].replace(/[^\d]/g, ''));
        if (num > 0) data.attendance = num;
      }
    }

    // Duration extraction
    if (!data.duration) {
      const dayMatch = lower.match(/(\d+)[\s-]*(day|days)/);
      if (dayMatch) {
        data.duration = { days: parseInt(dayMatch[1]) };
      }
    }

    // Venue type
    if (!data.venue) {
      if (lower.includes('outdoor') || lower.includes('field') || lower.includes('park')) {
        data.venue = { type: 'outdoor', isOutdoor: true };
      } else if (lower.includes('indoor') || lower.includes('convention') || lower.includes('hall')) {
        data.venue = { type: 'indoor', isOutdoor: false };
      }
    }

    // Transportation
    if (!data.transportation) {
      if (lower.includes('flying') || lower.includes('flight') || lower.includes('plane')) {
        data.transportation = { primaryMode: 'flying' };
      } else if (lower.includes('driving') || lower.includes('car')) {
        data.transportation = { primaryMode: 'driving' };
      } else if (lower.includes('transit') || lower.includes('bus') || lower.includes('train')) {
        data.transportation = { primaryMode: 'transit' };
      }
    }

    data.hasData = !!(data.eventType || data.attendance || data.duration);

    return data;
  }

  /**
   * Generate contextual response based on conversation state
   */
  generateResponse(message: string, extractedData: ExtractedEventData): string {
    const { eventType, attendance, duration, venue, transportation } = extractedData;

    // Greeting
    if (message.length < 20 && (message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello'))) {
      return "Hey there! I'm here to help you figure out your event's carbon footprint. Tell me a bit about what you're planning - what kind of event is it?";
    }

    // Just got event type
    if (eventType && !attendance) {
      const eventResponses: Record<string, string> = {
        festival: "Nice! A music festival. Those can range quite a bit. How many people are you expecting?",
        conference: "Got it, a corporate conference. How many attendees are you planning for?",
        wedding: "A wedding celebration! How many guests will you have?",
        concert: "A concert - exciting! How many people do you expect?"
      };
      return eventResponses[eventType] || "Interesting! How many people are coming?";
    }

    // Got attendance
    if (attendance && !duration) {
      return `${attendance.toLocaleString()} people - okay! Is this a single-day event, or does it span multiple days?`;
    }

    // Got duration
    if (duration && !venue) {
      const days = duration.days === 1 ? "a single day" : `${duration.days} days`;
      return `${days} event, got it. Is this happening indoors or outdoors?`;
    }

    // Got venue
    if (venue && !transportation) {
      return "Perfect! One more thing - how are most people getting there? Driving, flying in, or taking public transit?";
    }

    // Have complete data
    if (eventType && attendance && duration && venue && transportation) {
      const estimate = this.calculateMockEmissions(extractedData);

      // If we haven't shown the initial estimate yet, show it
      if (!extractedData.shownInitialEstimate) {
        extractedData.shownInitialEstimate = true;
        return `Alright, I've got a good picture! Based on what you've told me:

- ${eventType === 'festival' ? 'Music festival' : eventType === 'conference' ? 'Corporate conference' : eventType === 'wedding' ? 'Wedding celebration' : 'Concert'} with ${attendance.toLocaleString()} attendees
- ${duration.days}-day event, ${venue.isOutdoor ? 'outdoor' : 'indoor'} venue
- Most people ${transportation.primaryMode === 'flying' ? 'flying in' : transportation.primaryMode === 'transit' ? 'using public transit' : 'driving'}

Your estimated footprint is around **${estimate.total.toFixed(1)} tons CO₂**. That breaks down to about ${estimate.perPerson.toFixed(3)} tons per person.

Want to explore ways to reduce that?`;
      }

      // Check if user is asking about reductions
      const lowerMsg = message.toLowerCase();
      if (!extractedData.shownReductions && (lowerMsg.includes('reduce') || lowerMsg.includes('lower') || lowerMsg.includes('yes') || lowerMsg.includes('how') || lowerMsg.includes('way'))) {
        extractedData.shownReductions = true;
        return `Great! Here are your biggest opportunities to cut emissions:

**Transport (${estimate.transport.toFixed(1)} tons)** - Your biggest impact! Try:
- Shuttle buses from nearby cities
- Carpool incentives (free parking for 3+ people)
- Partner with public transit for event passes

**Energy (${estimate.energy.toFixed(1)} tons)** - Switch from generators to:
- Grid power if available
- Solar panels + battery backup
- LED lighting everywhere

**Food (${estimate.food.toFixed(1)} tons)** - Offer more plant-based options:
- 70% vegetarian menu = 40% reduction
- Local sourcing within 100 miles
- Compostable everything

Want me to draft messages to your caterer or venue about any of these?`;
      }

      // Handle vendor communication requests
      if (lowerMsg.includes('draft') || lowerMsg.includes('message') || lowerMsg.includes('email') || lowerMsg.includes('caterer') || lowerMsg.includes('venue')) {
        return `Sure! Here's a draft message you can send to your vendors:

**To Caterer:**
"Hi! We're planning a ${attendance}-person ${eventType} and want to minimize our environmental impact. Could you provide menu options with:
- At least 70% plant-based dishes
- Local ingredients (within 100 miles)
- Compostable serving materials
Thanks!"

**To Venue:**
"Hello! For our ${duration.days}-day event, we'd like to explore sustainable energy options. Do you offer:
- Grid power instead of diesel generators?
- LED lighting throughout?
- Solar backup options?
We're aiming to reduce our carbon footprint significantly."

Would you like me to adjust these messages or help with anything else?`;
      }

      // General follow-up
      return `I'm here to help! You can ask me to:
- Explain any of the reduction strategies in more detail
- Draft messages to your vendors
- Calculate different scenarios (like changing transport modes)
- Compare your event to similar ones

What would you like to explore?`;
    }

    // Default follow-up
    return "Tell me more about your event - any detail helps! How many people, how many days, indoor or outdoor?";
  }

  /**
   * Calculate mock emissions (deterministic, no API)
   */
  private calculateMockEmissions(data: ExtractedEventData) {
    const basePerPerson = this.getBaseEmissions(data.eventType || 'festival');
    const transportMultiplier = this.getTransportMultiplier(data.transportation?.primaryMode || 'driving');
    const durationMultiplier = (data.duration?.days || 1);

    const perPerson = basePerPerson * transportMultiplier * Math.sqrt(durationMultiplier);
    const total = perPerson * (data.attendance || 100);

    return {
      total,
      perPerson,
      transport: total * 0.65,
      energy: total * 0.15,
      food: total * 0.15,
      materials: total * 0.05
    };
  }

  private getBaseEmissions(eventType: string): number {
    const base: Record<string, number> = {
      festival: 0.041,
      conference: 0.38,
      wedding: 0.15,
      concert: 0.025
    };
    return base[eventType] || 0.1;
  }

  private getTransportMultiplier(mode: string): number {
    const multipliers: Record<string, number> = {
      flying: 3.5,
      driving: 1.8,
      transit: 0.6,
      walking: 0.1
    };
    return multipliers[mode] || 1.0;
  }

  /**
   * Calculate completion percentage
   */
  getCompletionPercentage(data: ExtractedEventData): number {
    let completed = 0;
    const total = 5;

    if (data.eventType) completed++;
    if (data.attendance) completed++;
    if (data.duration) completed++;
    if (data.venue) completed++;
    if (data.transportation) completed++;

    return Math.round((completed / total) * 100);
  }
}

export const mockSageService = new MockSageService();
