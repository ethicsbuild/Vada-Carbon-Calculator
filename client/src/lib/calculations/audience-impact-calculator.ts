import type { AudienceAccessDetails } from "@/types/carbon";

interface AudienceImpactResult {
  estimatedCO2e: number;
  perAttendeeCO2e: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  accessibilityScore: 'poor' | 'fair' | 'good' | 'excellent';
  whatYouControl: string[];
  whatYouInfluence: string[];
  leveragePoints: string[];
  tradeoffs: string[];
}

// Emission factors (kg CO2e per person per mile)
const EMISSION_FACTORS = {
  walking: 0,
  biking: 0,
  transit: 0.14, // Bus/rail average
  carSolo: 0.41, // Single occupancy vehicle
  carShared: 0.21, // Average 2 people per car
  rideshare: 0.35, // Uber/Lyft average
  airShortHaul: 0.255, // Under 500 miles
  airMediumHaul: 0.195, // 500-1500 miles
  airLongHaul: 0.150, // Over 1500 miles
};

// Default travel distances by draw geography (miles, round trip)
const DEFAULT_DISTANCES = {
  "hyper-local": 5,
  "city-metro": 30,
  "regional": 200,
  "national": 1000,
  "international": 3000,
};

// Mode split estimates based on venue characteristics
interface ModeSplit {
  walking: number;
  biking: number;
  transit: number;
  carSolo: number;
  carShared: number;
  rideshare: number;
  air: number;
}

export function calculateAudienceImpact(data: AudienceAccessDetails): AudienceImpactResult {
  const attendance = data.expectedAttendance || 0;
  
  if (attendance === 0) {
    return {
      estimatedCO2e: 0,
      perAttendeeCO2e: 0,
      confidenceLevel: 'low',
      accessibilityScore: 'fair',
      whatYouControl: [],
      whatYouInfluence: [],
      leveragePoints: [],
      tradeoffs: []
    };
  }

  // Calculate mode split based on venue characteristics
  const modeSplit = calculateModeSplit(data);
  
  // Estimate average travel distance
  const avgDistance = estimateAverageDistance(data);
  
  // Calculate emissions
  const totalCO2e = calculateEmissions(modeSplit, avgDistance, attendance);
  const perAttendeeCO2e = totalCO2e / attendance;
  
  // Assess confidence level
  const confidenceLevel = assessConfidenceLevel(data);
  
  // Calculate accessibility score
  const accessibilityScore = calculateAccessibilityScore(data);
  
  // Generate insights
  const whatYouControl = generateControlInsights(data);
  const whatYouInfluence = generateInfluenceInsights(data);
  const leveragePoints = generateLeveragePoints(data, modeSplit, accessibilityScore);
  const tradeoffs = generateTradeoffs(data);
  
  return {
    estimatedCO2e: Math.round(totalCO2e),
    perAttendeeCO2e: Math.round(perAttendeeCO2e),
    confidenceLevel,
    accessibilityScore,
    whatYouControl,
    whatYouInfluence,
    leveragePoints,
    tradeoffs
  };
}

function calculateModeSplit(data: AudienceAccessDetails): ModeSplit {
  // Start with baseline based on location type
  let split: ModeSplit = getBaselineModeSplit(data.venueLocationType);
  
  // Adjust for transit accessibility
  split = adjustForTransit(split, data.transitAccessibility);
  
  // Adjust for parking strategy
  split = adjustForParking(split, data.parkingStrategy);
  
  // Adjust for shuttles
  split = adjustForShuttles(split, data.shuttleServices);
  
  // Adjust for draw geography
  split = adjustForDrawGeography(split, data.eventDrawGeography);
  
  // Adjust for carpool incentives
  split = adjustForCarpoolIncentives(split, data.carpoolIncentives);
  
  // Normalize to 100%
  return normalizeSplit(split);
}

function getBaselineModeSplit(locationType: string | undefined): ModeSplit {
  const baselines: Record<string, ModeSplit> = {
    "urban-core": {
      walking: 15,
      biking: 10,
      transit: 35,
      carSolo: 10,
      carShared: 15,
      rideshare: 15,
      air: 0
    },
    "urban-edge": {
      walking: 5,
      biking: 5,
      transit: 20,
      carSolo: 30,
      carShared: 25,
      rideshare: 15,
      air: 0
    },
    "suburban": {
      walking: 2,
      biking: 3,
      transit: 5,
      carSolo: 45,
      carShared: 30,
      rideshare: 15,
      air: 0
    },
    "remote-destination": {
      walking: 0,
      biking: 0,
      transit: 0,
      carSolo: 30,
      carShared: 40,
      rideshare: 5,
      air: 25
    }
  };
  
  return baselines[locationType || "suburban"] || baselines.suburban;
}

function adjustForTransit(split: ModeSplit, transit: string | undefined): ModeSplit {
  const adjustments: Record<string, number> = {
    "excellent": 1.5,
    "good": 1.2,
    "limited": 0.8,
    "none": 0.3
  };
  
  const multiplier = adjustments[transit || "limited"] || 1.0;
  const transitBoost = (split.transit * multiplier) - split.transit;
  
  return {
    ...split,
    transit: split.transit * multiplier,
    carSolo: Math.max(0, split.carSolo - transitBoost * 0.6),
    carShared: Math.max(0, split.carShared - transitBoost * 0.4)
  };
}

function adjustForParking(split: ModeSplit, parking: string | undefined): ModeSplit {
  const adjustments: Record<string, number> = {
    "abundant-free": 1.3, // Encourages driving
    "available-paid": 1.0,
    "limited-expensive": 0.7, // Discourages driving
    "none": 0.4 // Strongly discourages
  };
  
  const multiplier = adjustments[parking || "available-paid"] || 1.0;
  const carReduction = ((split.carSolo + split.carShared) * (1 - multiplier));
  
  return {
    ...split,
    carSolo: split.carSolo * multiplier,
    carShared: split.carShared * multiplier,
    transit: split.transit + carReduction * 0.5,
    rideshare: split.rideshare + carReduction * 0.3,
    walking: split.walking + carReduction * 0.2
  };
}

function adjustForShuttles(split: ModeSplit, shuttles: any): ModeSplit {
  if (!shuttles) return split;
  
  let shuttleBoost = 0;
  if (shuttles.hotelShuttles) shuttleBoost += 5;
  if (shuttles.transitHubShuttles) shuttleBoost += 5;
  if (shuttles.parkingLotShuttles) shuttleBoost += 3;
  
  if (shuttleBoost === 0) return split;
  
  return {
    ...split,
    transit: split.transit + shuttleBoost,
    carSolo: Math.max(0, split.carSolo - shuttleBoost * 0.7),
    rideshare: Math.max(0, split.rideshare - shuttleBoost * 0.3)
  };
}

function adjustForDrawGeography(split: ModeSplit, geography: string | undefined): ModeSplit {
  if (!geography) return split;
  
  const airPercentages: Record<string, number> = {
    "hyper-local": 0,
    "city-metro": 0,
    "regional": 10,
    "national": 40,
    "international": 70
  };
  
  const airPercent = airPercentages[geography] || 0;
  
  if (airPercent === 0) return split;
  
  // Redistribute to air travel
  const reduction = airPercent / 100;
  return {
    walking: split.walking * (1 - reduction),
    biking: split.biking * (1 - reduction),
    transit: split.transit * (1 - reduction),
    carSolo: split.carSolo * (1 - reduction),
    carShared: split.carShared * (1 - reduction),
    rideshare: split.rideshare * (1 - reduction),
    air: airPercent
  };
}

function adjustForCarpoolIncentives(split: ModeSplit, incentives: string | undefined): ModeSplit {
  if (!incentives || incentives === "none") return split;
  
  const shifts: Record<string, number> = {
    "strong": 0.3, // 30% of solo drivers shift to shared
    "moderate": 0.15 // 15% shift
  };
  
  const shiftPercent = shifts[incentives] || 0;
  const soloToShared = split.carSolo * shiftPercent;
  
  return {
    ...split,
    carSolo: split.carSolo - soloToShared,
    carShared: split.carShared + soloToShared
  };
}

function normalizeSplit(split: ModeSplit): ModeSplit {
  const total = Object.values(split).reduce((sum, val) => sum + val, 0);
  if (total === 0) return split;
  
  const factor = 100 / total;
  return {
    walking: split.walking * factor,
    biking: split.biking * factor,
    transit: split.transit * factor,
    carSolo: split.carSolo * factor,
    carShared: split.carShared * factor,
    rideshare: split.rideshare * factor,
    air: split.air * factor
  };
}

function estimateAverageDistance(data: AudienceAccessDetails): number {
  // Use draw geography if provided
  if (data.eventDrawGeography) {
    return DEFAULT_DISTANCES[data.eventDrawGeography] || DEFAULT_DISTANCES["city-metro"];
  }
  
  // Otherwise estimate from location type
  const locationDistances: Record<string, number> = {
    "urban-core": 20,
    "urban-edge": 40,
    "suburban": 60,
    "remote-destination": 500
  };
  
  return locationDistances[data.venueLocationType || "suburban"] || 40;
}

function calculateEmissions(split: ModeSplit, distance: number, attendance: number): number {
  const emissions = 
    (split.walking / 100) * attendance * distance * EMISSION_FACTORS.walking +
    (split.biking / 100) * attendance * distance * EMISSION_FACTORS.biking +
    (split.transit / 100) * attendance * distance * EMISSION_FACTORS.transit +
    (split.carSolo / 100) * attendance * distance * EMISSION_FACTORS.carSolo +
    (split.carShared / 100) * attendance * distance * EMISSION_FACTORS.carShared +
    (split.rideshare / 100) * attendance * distance * EMISSION_FACTORS.rideshare +
    (split.air / 100) * attendance * distance * getAirEmissionFactor(distance);
  
  return emissions;
}

function getAirEmissionFactor(distance: number): number {
  if (distance < 500) return EMISSION_FACTORS.airShortHaul;
  if (distance < 1500) return EMISSION_FACTORS.airMediumHaul;
  return EMISSION_FACTORS.airLongHaul;
}

function assessConfidenceLevel(data: AudienceAccessDetails): 'low' | 'medium' | 'high' {
  let score = 0;
  
  // More detailed data = higher confidence
  if (data.eventDrawGeography) score += 2;
  if (data.expectedAttendance) score += 2;
  if (data.carpoolIncentives) score += 1;
  if (data.accommodationStrategy) score += 1;
  
  // Clear venue characteristics = higher confidence
  if (data.venueLocationType) score += 1;
  if (data.transitAccessibility) score += 1;
  if (data.parkingStrategy) score += 1;
  
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

function calculateAccessibilityScore(data: AudienceAccessDetails): 'poor' | 'fair' | 'good' | 'excellent' {
  let score = 0;
  
  // Location type scoring
  const locationScores: Record<string, number> = {
    "urban-core": 4,
    "urban-edge": 3,
    "suburban": 1,
    "remote-destination": 0
  };
  score += locationScores[data.venueLocationType || "suburban"] || 1;
  
  // Transit scoring
  const transitScores: Record<string, number> = {
    "excellent": 4,
    "good": 3,
    "limited": 1,
    "none": 0
  };
  score += transitScores[data.transitAccessibility || "limited"] || 1;
  
  // Parking scoring (inverse - less parking = better accessibility)
  const parkingScores: Record<string, number> = {
    "abundant-free": 0,
    "available-paid": 1,
    "limited-expensive": 3,
    "none": 4
  };
  score += parkingScores[data.parkingStrategy || "available-paid"] || 1;
  
  // Shuttle bonus
  if (data.shuttleServices?.hotelShuttles) score += 1;
  if (data.shuttleServices?.transitHubShuttles) score += 1;
  if (data.shuttleServices?.parkingLotShuttles) score += 0.5;
  
  // Convert to rating
  if (score >= 12) return 'excellent';
  if (score >= 8) return 'good';
  if (score >= 4) return 'fair';
  return 'poor';
}

function generateControlInsights(data: AudienceAccessDetails): string[] {
  const insights: string[] = [];
  
  insights.push(`Venue location: ${data.venueLocationType ? 'Selected' : 'Not yet selected'} - This is your highest-leverage decision`);
  
  if (data.transitAccessibility) {
    insights.push(`Transit accessibility: ${data.transitAccessibility} - Shapes mode choice significantly`);
  }
  
  if (data.parkingStrategy) {
    insights.push(`Parking strategy: ${data.parkingStrategy} - Directly influences driving behavior`);
  }
  
  if (data.shuttleServices?.hotelShuttles || 
      data.shuttleServices?.transitHubShuttles || 
      data.shuttleServices?.parkingLotShuttles) {
    insights.push("Shuttle services: Provided - Reduces need for individual vehicles");
  }
  
  return insights;
}

function generateInfluenceInsights(data: AudienceAccessDetails): string[] {
  const insights: string[] = [];
  
  if (data.carpoolIncentives === "strong") {
    insights.push("Strong carpool incentives can shift 20-30% of solo drivers to shared rides");
  } else if (data.carpoolIncentives === "moderate") {
    insights.push("Moderate carpool encouragement may shift 10-15% of solo drivers to shared rides");
  }
  
  if (data.parkingStrategy === "limited-expensive" || data.parkingStrategy === "none") {
    insights.push("Limited/expensive parking nudges attendees toward transit and rideshare");
  }
  
  if (data.transitAccessibility === "excellent" || data.transitAccessibility === "good") {
    insights.push("Good transit access enables mode shift, but doesn't guarantee it");
  }
  
  if (data.eventDrawGeography === "hyper-local" || data.eventDrawGeography === "city-metro") {
    insights.push("Local/metro draw enables walking, biking, and transit - but venue location must support it");
  }
  
  return insights;
}

function generateLeveragePoints(
  data: AudienceAccessDetails, 
  modeSplit: ModeSplit,
  accessibilityScore: string
): string[] {
  const points: string[] = [];
  
  // Venue location leverage
  if (data.venueLocationType === "suburban" || data.venueLocationType === "remote-destination") {
    points.push(
      "Venue location is car-dependent. Selecting an urban core venue with transit access could reduce audience travel carbon by 50-70%."
    );
  }
  
  // Transit leverage
  if (data.transitAccessibility === "limited" || data.transitAccessibility === "none") {
    if (data.venueLocationType !== "remote-destination") {
      points.push(
        "Poor transit access forces driving. Venues near rail/metro stations enable significant mode shift."
      );
    }
  }
  
  // Parking leverage
  if (data.parkingStrategy === "abundant-free") {
    points.push(
      "Free abundant parking encourages driving. Paid/limited parking can shift 20-30% of attendees to transit/rideshare."
    );
  }
  
  // High car usage
  if (modeSplit.carSolo > 40) {
    points.push(
      `${Math.round(modeSplit.carSolo)}% solo driving is high. Carpool incentives, transit improvements, or venue change could reduce this.`
    );
  }
  
  // Shuttle opportunity
  if (!data.shuttleServices?.transitHubShuttles && 
      data.transitAccessibility === "limited" &&
      data.venueLocationType !== "urban-core") {
    points.push(
      "Transit hub shuttles could bridge the gap between transit stations and venue, enabling mode shift."
    );
  }
  
  // Draw geography leverage
  if (data.eventDrawGeography === "national" || data.eventDrawGeography === "international") {
    points.push(
      "National/international draw means significant air travel. Consider regional events or virtual options for distant attendees."
    );
  }
  
  return points;
}

function generateTradeoffs(data: AudienceAccessDetails): string[] {
  const tradeoffs: string[] = [];
  
  // Location tradeoffs
  if (data.venueLocationType === "urban-core") {
    tradeoffs.push(
      "Urban core venue: Excellent transit access and low driving, but may have higher venue costs and capacity constraints."
    );
  } else if (data.venueLocationType === "suburban") {
    tradeoffs.push(
      "Suburban venue: Lower venue costs and ample parking, but forces driving and increases travel carbon."
    );
  } else if (data.venueLocationType === "remote-destination") {
    tradeoffs.push(
      "Remote/destination venue: Unique experience and potentially lower venue costs, but requires long-distance travel and accommodation."
    );
  }
  
  // Parking tradeoffs
  if (data.parkingStrategy === "limited-expensive") {
    tradeoffs.push(
      "Limited/expensive parking: Reduces driving but may frustrate attendees or limit accessibility for those without transit options."
    );
  } else if (data.parkingStrategy === "abundant-free") {
    tradeoffs.push(
      "Abundant free parking: Convenient for attendees but encourages solo driving and increases travel carbon."
    );
  }
  
  // Shuttle tradeoffs
  if (data.shuttleServices?.hotelShuttles || 
      data.shuttleServices?.transitHubShuttles || 
      data.shuttleServices?.parkingLotShuttles) {
    tradeoffs.push(
      "Shuttle services: Reduce individual vehicle use but add operational complexity, cost, and their own emissions."
    );
  }
  
  // Draw geography tradeoffs
  if (data.eventDrawGeography === "hyper-local") {
    tradeoffs.push(
      "Hyper-local draw: Lowest travel carbon but limits audience size and revenue potential."
    );
  } else if (data.eventDrawGeography === "national" || data.eventDrawGeography === "international") {
    tradeoffs.push(
      "National/international draw: Larger audience and revenue but significantly higher travel carbon from air travel."
    );
  }
  
  return tradeoffs;
}