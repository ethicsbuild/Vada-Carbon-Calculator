import type { CrewOperationsDetails } from "@/lib/types/carbon";

interface CrewImpactResult {
  travelCO2e: number;
  accommodationCO2e: number;
  totalCO2e: number;
  perPersonCO2e: number;
  leveragePoints: string[];
  tradeoffs: string[];
}

// Emission factors (kg CO2e)
const EMISSION_FACTORS = {
  // Travel (per person per mile)
  air: 0.255, // Short-haul flight
  ground: 0.12, // Tour bus/van
  local: 0.04, // Personal vehicle commute
  
  // Accommodation (per person per night)
  hotel: 30, // Standard hotel room
  tourBus: 45, // Tour bus overnight (fuel + idling)
  shared: 20, // Shared accommodation
  
  // Default assumptions
  defaultTravelDistance: 500, // miles
  defaultBuildDays: 2,
  defaultStrikeDays: 1,
};

export function calculateCrewImpact(data: CrewOperationsDetails): CrewImpactResult {
  const crewSize = data.totalCrewSize || 0;
  
  if (crewSize === 0) {
    return {
      travelCO2e: 0,
      accommodationCO2e: 0,
      totalCO2e: 0,
      perPersonCO2e: 0,
      leveragePoints: [],
      tradeoffs: []
    };
  }

  // Calculate travel impact
  const travelCO2e = calculateTravelImpact(data, crewSize);
  
  // Calculate accommodation impact
  const accommodationCO2e = calculateAccommodationImpact(data, crewSize);
  
  // Total impact
  const totalCO2e = travelCO2e + accommodationCO2e;
  const perPersonCO2e = totalCO2e / crewSize;
  
  // Generate insights
  const leveragePoints = generateLeveragePoints(data, travelCO2e, accommodationCO2e);
  const tradeoffs = generateTradeoffs(data);
  
  return {
    travelCO2e,
    accommodationCO2e,
    totalCO2e,
    perPersonCO2e,
    leveragePoints,
    tradeoffs
  };
}

function calculateTravelImpact(data: CrewOperationsDetails, crewSize: number): number {
  const distance = data.averageTravelDistance || EMISSION_FACTORS.defaultTravelDistance;
  const distanceInMiles = data.distanceUnit === "kilometers" ? distance * 0.621371 : distance;
  
  // If detailed travel mode distribution provided
  if (data.travelModeDistribution) {
    const airPercent = data.travelModeDistribution.air / 100;
    const groundPercent = data.travelModeDistribution.ground / 100;
    const localPercent = data.travelModeDistribution.local / 100;
    
    const airCrew = crewSize * airPercent;
    const groundCrew = crewSize * groundPercent;
    const localCrew = crewSize * localPercent;
    
    return (
      (airCrew * distanceInMiles * EMISSION_FACTORS.air * 2) + // Round trip
      (groundCrew * distanceInMiles * EMISSION_FACTORS.ground * 2) +
      (localCrew * distanceInMiles * EMISSION_FACTORS.local * 2)
    );
  }
  
  // Otherwise estimate based on staffing model
  let avgEmissionFactor = 0;
  
  switch (data.staffingModel) {
    case "local-hire":
      avgEmissionFactor = EMISSION_FACTORS.local;
      break;
    case "touring-core":
      // Mix: 30% air, 40% ground, 30% local
      avgEmissionFactor = (0.3 * EMISSION_FACTORS.air) + 
                         (0.4 * EMISSION_FACTORS.ground) + 
                         (0.3 * EMISSION_FACTORS.local);
      break;
    case "full-touring":
      // Mix: 50% air, 50% ground
      avgEmissionFactor = (0.5 * EMISSION_FACTORS.air) + 
                         (0.5 * EMISSION_FACTORS.ground);
      break;
    case "hybrid-regional":
      // Mix: 20% air, 50% ground, 30% local
      avgEmissionFactor = (0.2 * EMISSION_FACTORS.air) + 
                         (0.5 * EMISSION_FACTORS.ground) + 
                         (0.3 * EMISSION_FACTORS.local);
      break;
    default:
      avgEmissionFactor = EMISSION_FACTORS.ground;
  }
  
  return crewSize * distanceInMiles * avgEmissionFactor * 2; // Round trip
}

function calculateAccommodationImpact(data: CrewOperationsDetails, crewSize: number): number {
  const buildDays = data.buildDays || EMISSION_FACTORS.defaultBuildDays;
  const strikeDays = data.strikeDays || EMISSION_FACTORS.defaultStrikeDays;
  const totalNights = buildDays + strikeDays;
  
  let emissionFactor = 0;
  
  switch (data.accommodationStrategy) {
    case "hotel-standard":
      emissionFactor = EMISSION_FACTORS.hotel;
      break;
    case "tour-bus":
      emissionFactor = EMISSION_FACTORS.tourBus;
      break;
    case "local-commute":
      emissionFactor = 0; // No accommodation needed
      break;
    case "mixed":
      // Estimate: 50% hotel, 30% tour bus, 20% local
      emissionFactor = (0.5 * EMISSION_FACTORS.hotel) + 
                      (0.3 * EMISSION_FACTORS.tourBus);
      break;
    default:
      emissionFactor = EMISSION_FACTORS.hotel;
  }
  
  // Adjust for crew welfare priority (affects room sharing, amenities)
  if (data.crewWelfarePriority === "cost-minimum") {
    emissionFactor *= 0.8; // More room sharing, fewer amenities
  } else if (data.crewWelfarePriority === "premium-welfare") {
    emissionFactor *= 1.2; // Individual rooms, more amenities
  }
  
  return crewSize * totalNights * emissionFactor;
}

function generateLeveragePoints(
  data: CrewOperationsDetails, 
  travelCO2e: number, 
  accommodationCO2e: number
): string[] {
  const points: string[] = [];
  
  // Travel-related leverage points
  if (data.staffingModel === "full-touring") {
    points.push(
      "Shifting to 'Touring Core + Local Support' model could reduce travel impact by 30-40% while maintaining consistency for key roles."
    );
  }
  
  if (data.staffingModel === "touring-core" || data.staffingModel === "full-touring") {
    if (!data.localHiringConstraint || data.localHiringConstraint === "no-constraint") {
      points.push(
        "Increasing local hiring percentage appears feasible and would significantly reduce travel carbon."
      );
    }
  }
  
  if (travelCO2e > accommodationCO2e * 2) {
    points.push(
      "Travel is your dominant crew carbon source. Focus on reducing travel distance or increasing local hiring."
    );
  }
  
  // Accommodation-related leverage points
  if (data.accommodationStrategy === "tour-bus") {
    points.push(
      "Tour bus accommodation has high carbon impact due to idling. Consider hotel rooms for multi-day builds."
    );
  }
  
  if (data.accommodationStrategy === "mixed" || data.accommodationStrategy === "hotel-standard") {
    if ((data.buildDays || 0) + (data.strikeDays || 0) > 3) {
      points.push(
        "Extended on-site duration increases accommodation impact. Consider compressed build schedule if operationally feasible."
      );
    }
  }
  
  // Systems thinking leverage points
  if (data.staffingModel !== "local-hire") {
    points.push(
      "Local hiring enables use of venue-provided equipment (reduces production freight) and eliminates accommodation needs."
    );
  }
  
  return points;
}

function generateTradeoffs(data: CrewOperationsDetails): string[] {
  const tradeoffs: string[] = [];
  
  // Staffing model tradeoffs
  switch (data.staffingModel) {
    case "local-hire":
      tradeoffs.push(
        "Local hiring: Lowest carbon, but requires strong local network and may limit consistency across tour dates."
      );
      break;
    case "touring-core":
      tradeoffs.push(
        "Touring core + local support: Balances consistency with carbon reduction, but requires coordination across multiple labor sources."
      );
      break;
    case "full-touring":
      tradeoffs.push(
        "Full touring crew: Maximum consistency and control, but highest travel carbon and accommodation costs."
      );
      break;
    case "hybrid-regional":
      tradeoffs.push(
        "Hybrid/regional model: Flexible but complex to coordinate. Carbon impact varies significantly by execution."
      );
      break;
  }
  
  // Accommodation tradeoffs
  switch (data.accommodationStrategy) {
    case "hotel-standard":
      tradeoffs.push(
        "Hotel accommodation: Moderate carbon, standard crew welfare, predictable costs."
      );
      break;
    case "tour-bus":
      tradeoffs.push(
        "Tour bus accommodation: High carbon due to idling, but enables tight touring schedules and reduces hotel costs."
      );
      break;
    case "local-commute":
      tradeoffs.push(
        "Local commute: Zero accommodation carbon, but only viable with local hiring strategy."
      );
      break;
    case "mixed":
      tradeoffs.push(
        "Mixed accommodation: Flexible but requires careful planning to balance crew welfare with carbon/cost."
      );
      break;
  }
  
  // Constraint-based tradeoffs
  if (data.localHiringConstraint === "skill-availability") {
    tradeoffs.push(
      "Specialized skill requirements limit local hiring. Consider investing in regional crew development or training programs."
    );
  }
  
  if (data.localHiringConstraint === "consistency-required") {
    tradeoffs.push(
      "Consistency requirements favor touring crew. Consider which roles truly need consistency vs. which could be locally hired."
    );
  }
  
  if (data.crewWelfarePriority === "cost-minimum") {
    tradeoffs.push(
      "Cost-minimum approach reduces carbon (more sharing, fewer amenities) but may affect crew retention and morale."
    );
  }
  
  if (data.crewWelfarePriority === "premium-welfare") {
    tradeoffs.push(
      "Premium welfare approach increases carbon (individual rooms, more amenities) but supports crew retention and performance."
    );
  }
  
  return tradeoffs;
}