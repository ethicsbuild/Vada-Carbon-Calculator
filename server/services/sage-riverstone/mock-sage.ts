/**
 * Mock Sage Service - Zero API Cost
 *
 * Provides realistic conversational responses without OpenAI API calls
 * Uses keyword matching and templates to simulate Sage Riverstone AI
 */

export interface QuickReply {
  label: string;
  value: string;
}

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

export interface SageResponse {
  message: string;
  quickReplies?: QuickReply[];
}

export class MockSageService {
  private conversationState: Map<string, ExtractedEventData> = new Map();

  /**
   * Extract event data from user message using keyword matching
   */
  extractEventData(message: string, existingData: ExtractedEventData = { hasData: false }): ExtractedEventData {
    const lower = message.toLowerCase();
    const data = { ...existingData };

    console.log('🔍 Extracting data from:', message);
    console.log('📊 Existing data:', JSON.stringify(existingData, null, 2));

    // Event type detection - EXPANDED keywords
    if (!data.eventType) {
      if (lower.match(/festival|music|concert|show|gig|performance/)) {
        data.eventType = lower.includes('festival') ? 'festival' : 'concert';
      } else if (lower.match(/conference|corporate|meeting|summit|seminar|workshop|convention/)) {
        data.eventType = 'conference';
      } else if (lower.match(/wedding|marriage|reception|ceremony/)) {
        data.eventType = 'wedding';
      }
      if (data.eventType) console.log('✅ Extracted eventType:', data.eventType);
    }

    // Attendance extraction - IMPROVED patterns
    if (!data.attendance) {
      // Try explicit patterns first
      const attendanceMatch = lower.match(/(\d+[\s,]*(?:people|attendees|guests|person|ppl|folks|individuals))/);
      if (attendanceMatch) {
        const num = parseInt(attendanceMatch[0].replace(/[^\d]/g, ''));
        if (num > 0) {
          data.attendance = num;
          console.log('✅ Extracted attendance:', data.attendance);
        }
      } else {
        // Try standalone numbers (only if context suggests attendance)
        const standaloneNum = lower.match(/\b(\d{2,5})\b/);
        if (standaloneNum && !data.eventType) {
          // Probably attendance if it's a reasonable event size
          const num = parseInt(standaloneNum[1]);
          if (num >= 10 && num <= 100000) {
            data.attendance = num;
            console.log('✅ Extracted attendance (standalone):', data.attendance);
          }
        }
      }
    }

    // Duration extraction - IMPROVED patterns
    if (!data.duration) {
      const dayMatch = lower.match(/(\d+)[\s-]*(day|days|night|nights)/);
      if (dayMatch) {
        data.duration = { days: parseInt(dayMatch[1]) };
        console.log('✅ Extracted duration:', data.duration);
      } else if (lower.match(/single[\s-]*day|one[\s-]*day|1[\s-]*day/)) {
        data.duration = { days: 1 };
        console.log('✅ Extracted duration (single day):', data.duration);
      } else if (lower.match(/multi[\s-]*day|multiple[\s-]*day|several[\s-]*day/)) {
        data.duration = { days: 2 }; // Default to 2 days
        console.log('✅ Extracted duration (multi-day default):', data.duration);
      }
    }

    // Venue type - GREATLY EXPANDED keywords
    if (!data.venue) {
      // Outdoor keywords
      const outdoorKeywords = /outdoor|outside|field|park|garden|lawn|beach|forest|amphitheater|open[\s-]*air|exterior|patio|terrace|courtyard|stadium|arena|fairground/;
      // Indoor keywords
      const indoorKeywords = /indoor|inside|building|hall|center|centre|venue|room|ballroom|auditorium|theater|theatre|facility|space|convention|hotel|church|barn|warehouse|gallery|museum/;

      if (lower.match(outdoorKeywords)) {
        data.venue = { type: 'outdoor', isOutdoor: true };
        console.log('✅ Extracted venue: outdoor');
      } else if (lower.match(indoorKeywords)) {
        data.venue = { type: 'indoor', isOutdoor: false };
        console.log('✅ Extracted venue: indoor');
      }
    }

    // Transportation - GREATLY EXPANDED keywords
    if (!data.transportation) {
      // Flying keywords
      const flyingKeywords = /fly|flying|flight|plane|airplane|aircraft|airport|air[\s-]*travel|jet/;
      // Driving keywords
      const drivingKeywords = /driv|car|auto|vehicle|parking|highway|road/;
      // Transit keywords
      const transitKeywords = /transit|bus|train|subway|metro|rail|public[\s-]*transport|light[\s-]*rail|tram|trolley/;
      // Walking keywords
      const walkingKeywords = /walk|walking|foot|bike|biking|bicycle|local|nearby|neighborhood|close[\s-]*by/;

      if (lower.match(flyingKeywords)) {
        data.transportation = { primaryMode: 'flying' };
        console.log('✅ Extracted transportation: flying');
      } else if (lower.match(transitKeywords)) {
        data.transportation = { primaryMode: 'transit' };
        console.log('✅ Extracted transportation: transit');
      } else if (lower.match(walkingKeywords)) {
        data.transportation = { primaryMode: 'walking' };
        console.log('✅ Extracted transportation: walking');
      } else if (lower.match(drivingKeywords)) {
        data.transportation = { primaryMode: 'driving' };
        console.log('✅ Extracted transportation: driving');
      }
    }

    data.hasData = !!(data.eventType || data.attendance || data.duration);

    console.log('📦 Final extracted data:', JSON.stringify(data, null, 2));
    return data;
  }

  /**
   * Generate quick reply options based on conversation state
   */
  getQuickReplies(extractedData: ExtractedEventData): QuickReply[] {
    const { eventType, attendance, duration, venue, transportation } = extractedData;

    // Event type selection
    if (!eventType) {
      return [
        { label: '🎵 Music Festival', value: 'music festival' },
        { label: '💼 Corporate Conference', value: 'corporate conference' },
        { label: '💒 Wedding', value: 'wedding' },
        { label: '🎤 Concert', value: 'concert' },
      ];
    }

    // Attendance ranges
    if (eventType && !attendance) {
      return [
        { label: '50-100 people', value: '75 people' },
        { label: '100-500 people', value: '250 people' },
        { label: '500-1,000 people', value: '750 people' },
        { label: '1,000-5,000 people', value: '2500 people' },
        { label: '5,000+ people', value: '7500 people' },
      ];
    }

    // Duration
    if (attendance && !duration) {
      return [
        { label: 'Single day event', value: 'single day' },
        { label: '2-day event', value: '2 days' },
        { label: '3-day event', value: '3 days' },
        { label: 'Week-long event', value: '7 days' },
      ];
    }

    // Venue type
    if (duration && !venue) {
      return [
        { label: '🏛️ Indoor venue', value: 'indoor venue' },
        { label: '🌳 Outdoor venue', value: 'outdoor venue' },
      ];
    }

    // Transportation
    if (venue && !transportation) {
      return [
        { label: '✈️ Most people flying', value: 'flying' },
        { label: '🚗 Most people driving', value: 'driving' },
        { label: '🚇 Public transit/train', value: 'public transit' },
        { label: '🚶 Local/walking distance', value: 'walking' },
      ];
    }

    // After complete data - reduction options
    if (eventType && attendance && duration && venue && transportation) {
      if (!extractedData.shownInitialEstimate) {
        return [];
      }

      if (!extractedData.shownReductions) {
        return [
          { label: 'Yes, show me reduction tips', value: 'yes show me ways to reduce' },
          { label: 'Compare to similar events', value: 'compare to similar events' },
          { label: 'Calculate different scenarios', value: 'calculate different scenarios' },
        ];
      }

      return [
        { label: 'Draft vendor messages', value: 'draft messages to vendors' },
        { label: 'Compare to similar events', value: 'compare to similar events' },
        { label: 'Calculate scenarios', value: 'calculate different scenarios' },
        { label: 'Generate certificate', value: 'save and generate certificate' },
      ];
    }

    return [];
  }

  /**
   * Generate contextual response based on conversation state
   */
  generateResponse(message: string, extractedData: ExtractedEventData): SageResponse {
    const { eventType, attendance, duration, venue, transportation } = extractedData;

    console.log('🗣️ Generating response for state:', { eventType, attendance, duration, venue, transportation });

    const quickReplies = this.getQuickReplies(extractedData);
    console.log('🔘 Generated quick replies:', quickReplies);

    // Greeting
    if (message.length < 20 && (message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello'))) {
      return {
        message: "Hey there! I'm here to help you figure out your event's carbon footprint. Tell me a bit about what you're planning - what kind of event is it?",
        quickReplies
      };
    }

    // Just got event type
    if (eventType && !attendance) {
      const eventResponses: Record<string, string> = {
        festival: "Nice! A music festival. Those can range quite a bit. How many people are you expecting?",
        conference: "Got it, a corporate conference. How many attendees are you planning for?",
        wedding: "A wedding celebration! How many guests will you have?",
        concert: "A concert - exciting! How many people do you expect?"
      };
      return {
        message: eventResponses[eventType] || "Interesting! How many people are coming?",
        quickReplies
      };
    }

    // Need event type still
    if (!eventType && !attendance && !duration) {
      return {
        message: "I'd love to help! First, what type of event are you planning? (like a festival, conference, wedding, concert, etc.)",
        quickReplies
      };
    }

    // Got attendance
    if (attendance && !duration) {
      return {
        message: `${attendance.toLocaleString()} people - okay! Is this a single-day event, or does it span multiple days?`,
        quickReplies
      };
    }

    // Need attendance
    if (eventType && !attendance) {
      return {
        message: "Got it! And how many people are you expecting at this event?",
        quickReplies
      };
    }

    // Got duration
    if (duration && !venue) {
      const days = duration.days === 1 ? "a single day" : `${duration.days} days`;
      return {
        message: `Cool, ${days}. Is this happening indoors or outdoors?`,
        quickReplies
      };
    }

    // Need duration
    if (attendance && !duration) {
      return {
        message: "Perfect! Is this a single-day event, or multiple days?",
        quickReplies
      };
    }

    // Got venue
    if (venue && !transportation) {
      const venueType = venue.isOutdoor ? 'outdoor' : 'indoor';
      return {
        message: `Nice, an ${venueType} event! Last question - how are most people getting there? (driving, flying, public transit, or walking/biking)`,
        quickReplies
      };
    }

    // Need venue
    if (duration && !venue) {
      return {
        message: "Great! Is the venue indoors or outdoors?",
        quickReplies
      };
    }

    // Need transportation
    if (venue && !transportation) {
      return {
        message: "Almost there! How are most attendees getting to the event? (driving, flying, transit, or local/walking)",
        quickReplies
      };
    }

    // Have complete data
    if (eventType && attendance && duration && venue && transportation) {
      const estimate = this.calculateMockEmissions(extractedData);

      // If we haven't shown the initial estimate yet, show it
      if (!extractedData.shownInitialEstimate) {
        extractedData.shownInitialEstimate = true;
        return {
          message: `Alright, I've got a good picture! Based on what you've told me:

- ${eventType === 'festival' ? 'Music festival' : eventType === 'conference' ? 'Corporate conference' : eventType === 'wedding' ? 'Wedding celebration' : 'Concert'} with ${attendance.toLocaleString()} attendees
- ${duration.days}-day event, ${venue.isOutdoor ? 'outdoor' : 'indoor'} venue
- Most people ${transportation.primaryMode === 'flying' ? 'flying in' : transportation.primaryMode === 'transit' ? 'using public transit' : 'driving'}

I've calculated your event's carbon footprint using **GHG Protocol compliant emission factors**. Check out the detailed breakdown showing total emissions, per-attendee impact, and how you compare to industry benchmarks!

The calculator analyzes venue energy, transportation (including international flights for large events), catering, waste, and production equipment emissions.

Want to explore ways to reduce that footprint?`,
          quickReplies
        };
      }

      // Check if user is asking about reductions
      const lowerMsg = message.toLowerCase();
      if (!extractedData.shownReductions && (
        lowerMsg.includes('reduce') ||
        lowerMsg.includes('lower') ||
        lowerMsg.includes('yes') ||
        lowerMsg.includes('yeah') ||
        lowerMsg.includes('sure') ||
        lowerMsg.includes('ok') ||
        lowerMsg.includes('okay') ||
        lowerMsg.includes('please') ||
        lowerMsg.includes('how') ||
        lowerMsg.includes('way') ||
        lowerMsg.includes('tip') ||
        lowerMsg.includes('help')
      )) {
        extractedData.shownReductions = true;
        return {
          message: `Great! Here are your biggest opportunities to cut emissions:

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

Want me to draft messages to your caterer or venue about any of these?`,
          quickReplies
        };
      }

      // Handle vendor communication requests
      if (lowerMsg.match(/draft|message|email|caterer|venue|vendor|supplier|write/)) {
        return {
          message: `Sure! Here's a draft message you can send to your vendors:

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

Would you like me to adjust these messages or help with anything else?`,
          quickReplies
        };
      }

      // Handle comparison requests
      if (lowerMsg.match(/compare|similar|average|typical|benchmark|other/)) {
        const avgEmissions = estimate.total * 1.3; // Mock: current is 30% below average
        return {
          message: `Your event is doing pretty well! Here's how you compare:

**Your Event:** ${estimate.total.toFixed(1)} tons CO₂ (${estimate.perPerson.toFixed(3)} tons/person)
**Similar Events Average:** ${avgEmissions.toFixed(1)} tons CO₂ (${(avgEmissions / attendance).toFixed(3)} tons/person)

You're already **23% below average** for a ${eventType} of this size! 🎉

The biggest difference-makers are usually:
1. Transportation choices (you chose ${transportation.primaryMode})
2. Energy sources
3. Food & waste management

Want specific tips to improve even more?`,
          quickReplies
        };
      }

      // Handle scenario/calculation requests
      if (lowerMsg.match(/scenario|calculate|if|what[\s-]*if|different|change/)) {
        return {
          message: `I can help you model different scenarios! For example:

**If you switched to public transit:**
- Current emissions: ${estimate.total.toFixed(1)} tons
- With 70% public transit: ~${(estimate.total * 0.65).toFixed(1)} tons (-35%)

**If you added renewable energy:**
- Current emissions: ${estimate.total.toFixed(1)} tons
- With solar/wind power: ~${(estimate.total * 0.85).toFixed(1)} tons (-15%)

Want me to calculate a specific scenario for you? Just describe what you'd like to change!`,
          quickReplies
        };
      }

      // Handle certificate/save requests
      if (lowerMsg.match(/certificate|save|export|download|pdf|report/)) {
        return {
          message: `Perfect! I'll prepare a certificate for your ${eventType} with these details:

📊 **Event Carbon Footprint Summary**
- Event: ${eventType === 'festival' ? 'Music Festival' : eventType === 'conference' ? 'Corporate Conference' : eventType === 'wedding' ? 'Wedding' : 'Concert'}
- Attendance: ${attendance.toLocaleString()} people
- Duration: ${duration.days} day${duration.days > 1 ? 's' : ''}
- Total Emissions: ${estimate.total.toFixed(1)} tons CO₂e
- Per Person: ${estimate.perPerson.toFixed(3)} tons CO₂e

🏆 **Performance:**
- 23% below average for similar events
- Breakdown: Transport (${estimate.transport.toFixed(1)}t), Energy (${estimate.energy.toFixed(1)}t), Food (${estimate.food.toFixed(1)}t)

Your certificate is ready! In a full version, I would generate a PDF here with a unique verification code. For now, you can screenshot this summary to share with stakeholders.

Want to explore more reduction opportunities before finalizing?`,
          quickReplies
        };
      }

      // General conversational follow-up - avoid repeating the same prompt
      if (extractedData.shownReductions) {
        // After showing reductions, give helpful contextual responses
        if (lowerMsg.match(/thank|thanks|great|appreciate|awesome|perfect/)) {
          return {
            message: `You're welcome! Feel free to reach out if you need anything else as you plan your ${eventType}. Good luck making it a sustainable event!`,
            quickReplies: []
          };
        }

        // General question
        return {
          message: `Happy to help with that! Just let me know what you'd like to know more about - I can explain reduction strategies, help draft vendor messages, calculate different scenarios, or compare your event to similar ones.`,
          quickReplies
        };
      }

      // Haven't shown reductions yet, offer to show them
      return {
        message: `I've got all your event details. Would you like to see ways to reduce your carbon footprint?`,
        quickReplies
      };
    }

    // Default follow-up
    return {
      message: "Tell me more about your event - any detail helps! How many people, how many days, indoor or outdoor?",
      quickReplies
    };
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
