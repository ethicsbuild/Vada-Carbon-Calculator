import type { EventFoundationDetails } from "@/types/carbon";

interface EventFoundationSummary {
  totalDays: number;
  complexityLevel: string;
  venueCapabilityScore: number;
  operationalInsights: string[];
  systemsConnections: string[];
}

export function calculateEventFoundation(data: EventFoundationDetails): EventFoundationSummary {
  // Calculate total days
  const totalDays = (data.loadInDays || 0) + (data.showDays || 0) + (data.strikeDays || 0);
  
  // Get complexity level
  const complexityLevel = data.productionComplexity || "standard";
  
  // Calculate venue capability score
  const venueCapabilityScore = calculateVenueCapabilityScore(data.venueProvides);
  
  // Generate operational insights
  const operationalInsights = generateOperationalInsights(data, totalDays, venueCapabilityScore);
  
  // Generate systems connections
  const systemsConnections = generateSystemsConnections(data, totalDays, complexityLevel);
  
  return {
    totalDays,
    complexityLevel,
    venueCapabilityScore,
    operationalInsights,
    systemsConnections
  };
}

function calculateVenueCapabilityScore(venueProvides: any): number {
  if (!venueProvides) return 0;
  
  let score = 0;
  if (venueProvides.stage) score++;
  if (venueProvides.lighting) score++;
  if (venueProvides.sound) score++;
  if (venueProvides.av) score++;
  if (venueProvides.power) score++;
  if (venueProvides.rigging) score++;
  
  return score;
}

function generateOperationalInsights(
  data: EventFoundationDetails, 
  totalDays: number,
  venueCapabilityScore: number
): string[] {
  const insights: string[] = [];
  
  // Production complexity insights
  if (data.productionComplexity === "minimal") {
    insights.push(
      "Minimal production complexity enables quick setup and smaller crew, reducing operational carbon and costs."
    );
  } else if (data.productionComplexity === "standard") {
    insights.push(
      "Standard production requires balanced crew size and moderate build time. Consider local equipment rental to reduce transport."
    );
  } else if (data.productionComplexity === "complex") {
    insights.push(
      "Complex production requires significant crew and extended build time. Crew accommodation and catering become major carbon factors."
    );
  } else if (data.productionComplexity === "festival") {
    insights.push(
      "Festival-scale production requires extensive crew, multi-day accommodation, and significant infrastructure. This is your highest operational carbon category."
    );
  }
  
  // Duration insights
  if (totalDays > 5) {
    insights.push(
      `${totalDays}-day operational window requires extended crew accommodation and catering. Consider if build schedule can be compressed.`
    );
  } else if (totalDays > 0 && totalDays <= 2) {
    insights.push(
      `${totalDays}-day operational window is efficient. Short duration reduces crew accommodation and catering needs.`
    );
  }
  
  // Venue capability insights
  if (venueCapabilityScore >= 5) {
    insights.push(
      "Comprehensive venue capabilities significantly reduce equipment transport and setup time. This is a major carbon advantage."
    );
  } else if (venueCapabilityScore >= 3) {
    insights.push(
      "Moderate venue capabilities reduce some transport needs. Consider maximizing use of venue-provided systems."
    );
  } else if (venueCapabilityScore <= 1) {
    insights.push(
      "Limited venue capabilities require bringing most equipment. This increases transport carbon and setup complexity."
    );
  }
  
  // Indoor/outdoor insights
  if (data.indoorOutdoor === "fully-outdoor") {
    insights.push(
      "Fully outdoor event requires complete temporary infrastructure (power, shelter, facilities). Weather contingency adds complexity."
    );
  } else if (data.indoorOutdoor === "covered-outdoor") {
    insights.push(
      "Covered outdoor structure requires temporary power and infrastructure but provides weather protection."
    );
  }
  
  // Event format insights
  if (data.eventFormat === "multi-day-different") {
    insights.push(
      "Multi-day event with different programming each day requires flexible crew scheduling and potentially higher staffing levels."
    );
  } else if (data.eventFormat === "festival") {
    insights.push(
      "Festival format with continuous programming requires 24/7 crew presence and extended accommodation/catering."
    );
  }
  
  return insights;
}

function generateSystemsConnections(
  data: EventFoundationDetails,
  totalDays: number,
  complexityLevel: string
): string[] {
  const connections: string[] = [];
  
  // Crew connections
  if (complexityLevel === "complex" || complexityLevel === "festival") {
    connections.push(
      "**Crew:** Complex production requires larger crew size and extended on-site duration, increasing accommodation and catering needs."
    );
  } else if (complexityLevel === "minimal") {
    connections.push(
      "**Crew:** Minimal production enables smaller crew size and shorter on-site duration, reducing accommodation carbon."
    );
  }
  
  // Power connections
  if (data.indoorOutdoor === "fully-outdoor" || data.indoorOutdoor === "covered-outdoor") {
    connections.push(
      "**Power:** Outdoor event requires temporary power infrastructure. Generator capacity must match production complexity."
    );
  }
  
  if (data.venueProvides?.power) {
    connections.push(
      "**Power:** Venue provides adequate power, reducing need for generators and enabling grid power use (lower carbon)."
    );
  }
  
  // Production connections
  if (data.venueProvides) {
    const providedCount = calculateVenueCapabilityScore(data.venueProvides);
    if (providedCount >= 4) {
      connections.push(
        "**Production:** Venue provides most systems, enabling 'rent locally' or 'venue-provided' strategy (reduces transport carbon)."
      );
    } else if (providedCount <= 1) {
      connections.push(
        "**Production:** Limited venue capabilities require 'bring full rig' strategy, increasing equipment transport carbon."
      );
    }
  }
  
  // Food connections
  if (totalDays > 0) {
    connections.push(
      `**Food:** ${totalDays}-day operational window determines catering duration. Crew size from production complexity sets meal volume.`
    );
  }
  
  // Audience connections
  if (data.expectedAttendance) {
    connections.push(
      `**Audience:** ${data.expectedAttendance.toLocaleString()} expected attendees shapes venue selection, which determines transit accessibility.`
    );
  }
  
  // Duration connections
  if (totalDays >= 3) {
    connections.push(
      "**Duration:** Multi-day event increases crew accommodation needs, catering requirements, and power consumption."
    );
  }
  
  return connections;
}