/**
 * Attendee Tracking Service
 *
 * Tracks individual attendee carbon choices and impact
 * Gamification: leaderboards, achievements, rewards
 * Individual carbon footprint calculations
 */

import { SageRiverstonePersona, LanguageTier } from "./persona";

export interface AttendeeProfile {
  id: string;
  eventId: number;
  name?: string;
  email?: string;
  ticketId?: string;
  totalFootprint: number; // tCO2e
  choices: AttendeeChoice[];
  rank?: number;
  achievements: AttendeeAchievement[];
  rewardsEarned: Reward[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendeeChoice {
  id: string;
  category: "transportation" | "food" | "accommodation" | "waste" | "merchandise";
  choice: string;
  emissions: number; // tCO2e for this choice
  comparedToAverage: number; // % difference from average choice
  timestamp: Date;
  verified: boolean;
}

export interface AttendeeAchievement {
  id: string;
  type: "low_impact_travel" | "plant_based" | "zero_waste" | "local_support" | "public_transit" | "carbon_champion";
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  footprintReduction: number; // How much this saved
}

export interface Reward {
  id: string;
  type: "discount" | "upgrade" | "merchandise" | "access" | "recognition";
  title: string;
  description: string;
  value?: number;
  code?: string;
  expiresAt?: Date;
  redeemed: boolean;
  redeemedAt?: Date;
}

export interface LeaderboardEntry {
  rank: number;
  attendeeId: string;
  name: string;
  footprint: number;
  percentBetterThanAverage: number;
  achievements: number;
  displayName: string; // May be anonymized
}

export interface EventLeaderboard {
  eventId: number;
  eventName: string;
  totalAttendees: number;
  averageFootprint: number;
  topPerformers: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface ProducerLeaderboard {
  producerId: number;
  producerName: string;
  eventsCount: number;
  totalAttendees: number;
  averageFootprintPerAttendee: number;
  trend: "improving" | "stable" | "declining";
  rank?: number;
  topEvents: EventSummary[];
}

export interface EventSummary {
  eventId: number;
  eventName: string;
  date: Date;
  attendees: number;
  averageFootprint: number;
  performance: "excellent" | "good" | "average" | "needs_improvement";
}

export interface TransportChoice {
  mode: "walk" | "bike" | "public_transit" | "carpool" | "drive_alone" | "rideshare" | "flight";
  distance: number; // km
  passengers?: number; // For carpool
}

export interface FoodChoice {
  type: "vegan" | "vegetarian" | "pescatarian" | "meat" | "local" | "standard";
  meals: number;
}

export interface WasteChoice {
  recycled: boolean;
  composted: boolean;
  reusableContainer: boolean;
  refillStation: boolean;
}

export class AttendeeTrackingService {
  // Emission factors for attendee choices (kgCO2e)
  private readonly transportEmissions = {
    walk: 0,
    bike: 0,
    public_transit: 0.04, // per km
    carpool: 0.045, // per km per person (4 passengers avg)
    drive_alone: 0.18, // per km
    rideshare: 0.15, // per km (slight efficiency vs solo)
    flight_domestic: 0.25, // per km
    flight_international: 0.18, // per km
  };

  private readonly foodEmissions = {
    vegan: 0.9, // per meal
    vegetarian: 1.5,
    pescatarian: 2.2,
    meat: 3.5,
    local: -0.5, // Bonus reduction
    standard: 0,
  };

  /**
   * Calculate attendee footprint from their choices
   */
  calculateAttendeeFootprint(
    transport: TransportChoice,
    food: FoodChoice,
    waste?: WasteChoice,
    accommodation?: { nights: number }
  ): number {
    let total = 0;

    // Transportation
    const transportFactor = this.transportEmissions[transport.mode] || 0.18;
    let transportEmissions = transport.distance * transportFactor;

    if (transport.mode === "carpool" && transport.passengers) {
      transportEmissions = transportEmissions / transport.passengers;
    }

    total += transportEmissions / 1000; // Convert to tonnes

    // Food
    const foodFactor = this.foodEmissions[food.type] || this.foodEmissions.standard;
    const localBonus = food.type.includes("local") ? this.foodEmissions.local : 0;
    const foodEmissions = (foodFactor + localBonus) * food.meals;

    total += foodEmissions / 1000;

    // Waste reduction bonus
    if (waste) {
      let wasteReduction = 0;
      if (waste.recycled) wasteReduction += 0.2;
      if (waste.composted) wasteReduction += 0.3;
      if (waste.reusableContainer) wasteReduction += 0.1;
      if (waste.refillStation) wasteReduction += 0.1;

      total -= wasteReduction / 1000;
    }

    // Accommodation (if staying overnight)
    if (accommodation && accommodation.nights > 0) {
      const accommodationEmissions = accommodation.nights * 20; // 20 kg per night
      total += accommodationEmissions / 1000;
    }

    return Math.max(0, total); // Never negative
  }

  /**
   * Compare attendee to event average
   */
  compareToAverage(
    attendeeFootprint: number,
    eventAverageFootprint: number
  ): {
    percentDifference: number;
    better: boolean;
    message: string;
  } {
    const diff = ((eventAverageFootprint - attendeeFootprint) / eventAverageFootprint) * 100;
    const better = diff > 0;

    let message = "";
    if (better) {
      if (diff >= 50) {
        message = `Amazing! Your footprint is ${diff.toFixed(0)}% lower than the average attendee. You're a sustainability champion!`;
      } else if (diff >= 25) {
        message = `Great work! You're ${diff.toFixed(0)}% below the average attendee.`;
      } else {
        message = `Nice! You're ${diff.toFixed(0)}% better than average.`;
      }
    } else {
      message = `Your footprint is ${Math.abs(diff).toFixed(0)}% above average. Check out ways to reduce it!`;
    }

    return {
      percentDifference: diff,
      better,
      message,
    };
  }

  /**
   * Check and award achievements
   */
  checkAchievements(
    choices: AttendeeChoice[],
    footprint: number,
    eventAverage: number
  ): AttendeeAchievement[] {
    const achievements: AttendeeAchievement[] = [];

    // Low impact travel
    const transportChoice = choices.find(c => c.category === "transportation");
    if (transportChoice && ["walk", "bike", "public_transit"].includes(transportChoice.choice)) {
      achievements.push({
        id: `achievement_${Date.now()}_1`,
        type: "low_impact_travel",
        title: "Sustainable Traveler",
        description: "Chose low-carbon transportation",
        icon: "directions_transit",
        unlockedAt: new Date(),
        footprintReduction: transportChoice.emissions,
      });
    }

    // Plant-based eating
    const foodChoice = choices.find(c => c.category === "food");
    if (foodChoice && ["vegan", "vegetarian"].some(type => foodChoice.choice.includes(type))) {
      achievements.push({
        id: `achievement_${Date.now()}_2`,
        type: "plant_based",
        title: "Plant-Powered",
        description: "Chose plant-based meals",
        icon: "eco",
        unlockedAt: new Date(),
        footprintReduction: 0.002, // ~2kg saved per plant-based meal
      });
    }

    // Zero waste
    const wasteChoice = choices.find(c => c.category === "waste");
    if (wasteChoice && wasteChoice.choice.includes("recycled")) {
      achievements.push({
        id: `achievement_${Date.now()}_3`,
        type: "zero_waste",
        title: "Zero Waste Warrior",
        description: "Participated in recycling and composting",
        icon: "recycling",
        unlockedAt: new Date(),
        footprintReduction: 0.0005,
      });
    }

    // Carbon Champion (50% below average)
    const percentBelow = ((eventAverage - footprint) / eventAverage) * 100;
    if (percentBelow >= 50) {
      achievements.push({
        id: `achievement_${Date.now()}_4`,
        type: "carbon_champion",
        title: "Carbon Champion",
        description: "50% lower footprint than average attendee",
        icon: "emoji_events",
        unlockedAt: new Date(),
        footprintReduction: eventAverage - footprint,
      });
    }

    return achievements;
  }

  /**
   * Generate rewards based on performance
   */
  generateRewards(
    achievements: AttendeeAchievement[],
    footprintReduction: number
  ): Reward[] {
    const rewards: Reward[] = [];

    // Rewards tier based on footprint reduction
    if (footprintReduction >= 0.010) {
      // Saved 10kg or more
      rewards.push({
        id: `reward_${Date.now()}_1`,
        type: "discount",
        title: "15% Merchandise Discount",
        description: "For your outstanding sustainability efforts",
        value: 15,
        code: `GREEN${Math.random().toString(36).substring(7).toUpperCase()}`,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        redeemed: false,
      });
    }

    // Achievement-based rewards
    if (achievements.some(a => a.type === "carbon_champion")) {
      rewards.push({
        id: `reward_${Date.now()}_2`,
        type: "upgrade",
        title: "VIP Lounge Access",
        description: "Complimentary access for next event",
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
        redeemed: false,
      });
    }

    if (achievements.some(a => a.type === "low_impact_travel")) {
      rewards.push({
        id: `reward_${Date.now()}_3`,
        type: "recognition",
        title: "Sustainability Leader Badge",
        description: "Display on your event profile",
        redeemed: false,
      });
    }

    return rewards;
  }

  /**
   * Build event leaderboard
   */
  buildEventLeaderboard(
    attendees: AttendeeProfile[],
    eventId: number,
    eventName: string,
    topCount: number = 10
  ): EventLeaderboard {
    const averageFootprint = attendees.reduce((sum, a) => sum + a.totalFootprint, 0) / attendees.length;

    // Sort by lowest footprint
    const sorted = [...attendees].sort((a, b) => a.totalFootprint - b.totalFootprint);

    const topPerformers = sorted.slice(0, topCount).map((attendee, index) => ({
      rank: index + 1,
      attendeeId: attendee.id,
      name: attendee.name || `Attendee ${attendee.id}`,
      footprint: attendee.totalFootprint,
      percentBetterThanAverage: ((averageFootprint - attendee.totalFootprint) / averageFootprint) * 100,
      achievements: attendee.achievements.length,
      displayName: this.anonymizeName(attendee.name),
    }));

    return {
      eventId,
      eventName,
      totalAttendees: attendees.length,
      averageFootprint,
      topPerformers,
      lastUpdated: new Date(),
    };
  }

  /**
   * Build producer leaderboard
   */
  buildProducerLeaderboard(
    producers: Array<{
      id: number;
      name: string;
      events: EventSummary[];
    }>
  ): ProducerLeaderboard[] {
    const leaderboard: ProducerLeaderboard[] = [];

    for (const producer of producers) {
      const totalAttendees = producer.events.reduce((sum, e) => sum + e.attendees, 0);
      const weightedFootprint = producer.events.reduce(
        (sum, e) => sum + e.averageFootprint * e.attendees,
        0
      );
      const averageFootprintPerAttendee = weightedFootprint / totalAttendees;

      // Determine trend (compare most recent to oldest)
      let trend: "improving" | "stable" | "declining" = "stable";
      if (producer.events.length >= 2) {
        const recent = producer.events[0].averageFootprint;
        const older = producer.events[producer.events.length - 1].averageFootprint;
        const change = ((older - recent) / older) * 100;

        if (change > 5) trend = "improving";
        else if (change < -5) trend = "declining";
      }

      leaderboard.push({
        producerId: producer.id,
        producerName: producer.name,
        eventsCount: producer.events.length,
        totalAttendees,
        averageFootprintPerAttendee,
        trend,
        topEvents: producer.events.slice(0, 3),
      });
    }

    // Sort by best average footprint
    leaderboard.sort((a, b) => a.averageFootprintPerAttendee - b.averageFootprintPerAttendee);

    // Assign ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return leaderboard;
  }

  /**
   * Format attendee footprint for display
   */
  formatAttendeeFootprint(
    footprint: number,
    eventAverage: number,
    tier: LanguageTier = "tier1_campfire"
  ): string {
    const comparison = this.compareToAverage(footprint, eventAverage);
    const metaphor = SageRiverstonePersona.generateMetaphor(footprint);

    if (tier === "tier3_technical") {
      return `Your footprint: ${footprint.toFixed(3)} tCO2e
Event average: ${eventAverage.toFixed(3)} tCO2e
Difference: ${comparison.percentDifference.toFixed(1)}%`;
    }

    if (tier === "tier2_practical") {
      return `Your event footprint: ${footprint.toFixed(2)} tonnes
Event average: ${eventAverage.toFixed(2)} tonnes

${comparison.message}`;
    }

    // Tier 1 - Campfire
    return `Your footprint for this event is ${metaphor}.

${comparison.message}`;
  }

  /**
   * Format leaderboard for display
   */
  formatLeaderboard(
    leaderboard: EventLeaderboard,
    tier: LanguageTier = "tier1_campfire"
  ): string {
    if (tier === "tier3_technical") {
      const entries = leaderboard.topPerformers
        .map(e => `${e.rank}. ${e.displayName}: ${e.footprint.toFixed(3)} tCO2e (${e.percentBetterThanAverage.toFixed(1)}% below avg)`)
        .join("\n");

      return `Event: ${leaderboard.eventName}
Total attendees: ${leaderboard.totalAttendees}
Average footprint: ${leaderboard.averageFootprint.toFixed(3)} tCO2e

Top performers:
${entries}`;
    }

    if (tier === "tier2_practical") {
      const entries = leaderboard.topPerformers
        .map(e => `${e.rank}. ${e.displayName} - ${e.percentBetterThanAverage.toFixed(0)}% better than average`)
        .join("\n");

      return `${leaderboard.eventName} Sustainability Leaderboard

${entries}

${leaderboard.totalAttendees} total attendees`;
    }

    // Tier 1 - Campfire
    const topThree = leaderboard.topPerformers.slice(0, 3);
    const entries = topThree
      .map((e, i) => {
        const medals = ["🥇", "🥈", "🥉"];
        return `${medals[i] || e.rank}. ${e.displayName} - ${e.percentBetterThanAverage.toFixed(0)}% lower impact than average`;
      })
      .join("\n");

    return `${leaderboard.eventName} - Sustainability Champions

${entries}

These attendees made the lowest-impact choices. Want to see how you compare?`;
  }

  /**
   * Generate shareable impact card
   */
  generateImpactCard(attendee: AttendeeProfile, eventName: string): string {
    const metaphor = SageRiverstonePersona.generateMetaphor(attendee.totalFootprint);

    return `${eventName} - My Sustainable Impact

My footprint: ${metaphor}

My sustainable choices:
${attendee.choices.map(c => `- ${c.choice}`).join("\n")}

Achievements unlocked: ${attendee.achievements.length}
${attendee.achievements.map(a => `- ${a.title}`).join("\n")}

Join me in making events more sustainable!`;
  }

  /**
   * Helper: Anonymize names for leaderboard
   */
  private anonymizeName(name?: string): string {
    if (!name) return "Anonymous";

    // Show first name + last initial
    const parts = name.split(" ");
    if (parts.length === 1) return name;

    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }

  /**
   * Calculate potential savings if attendee makes better choices
   */
  calculatePotentialImprovement(
    currentChoice: AttendeeChoice,
    category: string
  ): { betterChoice: string; savings: number; message: string } | null {
    if (category === "transportation") {
      if (currentChoice.choice === "drive_alone") {
        return {
          betterChoice: "public_transit",
          savings: 0.010, // Typical 10kg savings
          message: "If you took public transit instead, you'd save about 10kg - like planting a tree!",
        };
      }
      if (currentChoice.choice === "carpool") {
        return {
          betterChoice: "public_transit",
          savings: 0.003,
          message: "Public transit could save you another 3kg compared to carpooling.",
        };
      }
    }

    if (category === "food") {
      if (currentChoice.choice.includes("meat")) {
        return {
          betterChoice: "vegetarian",
          savings: 0.002,
          message: "Plant-based meals save about 2kg per meal compared to meat.",
        };
      }
    }

    return null;
  }
}

export const attendeeTrackingService = new AttendeeTrackingService();
