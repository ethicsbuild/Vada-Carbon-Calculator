import { FoodCateringData, FoodSystemImpacts, FoodLiteMode, FoodAdvancedMode } from "@/types/carbon";

/**
 * Calculate cross-section impacts from food choices
 * This determines how food decisions affect transport and power
 */
export function calculateFoodSystemImpacts(data: FoodCateringData): FoodSystemImpacts {
  const impacts: FoodSystemImpacts = {
    increasesTransport: false,
    increasesPower: false,
    impactNotes: [],
  };

  const foodData = data.detailLevel === 'advanced' ? data.advancedMode : data.liteMode;
  
  if (!foodData || foodData.foodProvided === 'none') {
    return impacts;
  }

  // Transport impacts
  if (foodData.serviceModel === 'food-trucks') {
    impacts.increasesTransport = true;
    impacts.impactNotes.push(
      "Food trucks require vendor transportation to and from the event site."
    );
  }

  if (foodData.sourcing === 'national') {
    impacts.increasesTransport = true;
    impacts.impactNotes.push(
      "National sourcing increases transportation emissions through long-distance deliveries."
    );
  }

  // Power impacts
  if (foodData.serviceModel === 'full-service' || foodData.serviceModel === 'food-trucks') {
    impacts.increasesPower = true;
    impacts.impactNotes.push(
      "On-site food preparation typically increases temporary power or fuel use."
    );
  }

  return impacts;
}

/**
 * Generate impact drivers and recommendations based on food choices
 */
export function generateFoodImpactAnalysis(data: FoodCateringData): {
  impactLevel: 'low' | 'moderate' | 'high';
  primaryDrivers: string[];
  leveragePoint: string;
  tradeoffNote?: string;
} {
  const foodData = data.detailLevel === 'advanced' ? data.advancedMode : data.liteMode;
  
  if (!foodData || foodData.foodProvided === 'none') {
    return {
      impactLevel: 'low',
      primaryDrivers: ['No food provided'],
      leveragePoint: 'Consider providing light refreshments to improve attendee experience.',
    };
  }

  const drivers: string[] = [];
  let impactScore = 0;

  // Service model impact
  if (foodData.serviceModel === 'full-service') {
    drivers.push('Full-service catering (higher resource use)');
    impactScore += 3;
  } else if (foodData.serviceModel === 'buffet') {
    drivers.push('Buffet service (moderate resource use)');
    impactScore += 2;
  } else if (foodData.serviceModel === 'pre-packaged') {
    drivers.push('Pre-packaged service (packaging waste)');
    impactScore += 2;
  } else if (foodData.serviceModel === 'food-trucks') {
    drivers.push('Food trucks (vendor transportation + on-site power)');
    impactScore += 3;
  }

  // Sourcing impact
  if (foodData.sourcing === 'national') {
    drivers.push('National sourcing (long-distance transportation)');
    impactScore += 3;
  } else if (foodData.sourcing === 'mixed') {
    drivers.push('Mixed sourcing (moderate transportation)');
    impactScore += 2;
  } else if (foodData.sourcing === 'local') {
    drivers.push('Local sourcing (reduced transportation)');
    impactScore += 0;
  }

  // Plant-forward benefit
  if (foodData.plantForward) {
    drivers.push('Plant-forward menu (reduced agricultural emissions)');
    impactScore -= 1;
  }

  // Advanced mode factors
  if (data.detailLevel === 'advanced' && data.advancedMode) {
    const advanced = data.advancedMode;

    // Service ware impact
    if (advanced.serviceWare === 'single-use-plastic') {
      drivers.push('Single-use plastics (high waste impact)');
      impactScore += 2;
    } else if (advanced.serviceWare === 'reusable') {
      drivers.push('Reusable dishware (minimal waste)');
      impactScore -= 1;
    } else if (advanced.serviceWare === 'compostable') {
      drivers.push('Compostable serviceware (reduced waste)');
      impactScore -= 0.5;
    }

    // Waste handling
    if (advanced.wasteHandling === 'composting' || advanced.wasteHandling === 'donation') {
      drivers.push('Waste mitigation strategy in place');
      impactScore -= 1;
    } else if (advanced.wasteHandling === 'no-plan') {
      drivers.push('No waste management plan');
      impactScore += 1;
    }

    // Food strategy
    if (advanced.foodStrategy === 'vegetarian-vegan') {
      drivers.push('Fully vegetarian/vegan menu (lowest agricultural impact)');
      impactScore -= 2;
    }
  }

  // Determine impact level
  let impactLevel: 'low' | 'moderate' | 'high';
  if (impactScore <= 2) {
    impactLevel = 'low';
  } else if (impactScore <= 5) {
    impactLevel = 'moderate';
  } else {
    impactLevel = 'high';
  }

  // Generate leverage point (the one change that matters most)
  const leveragePoint = generateLeveragePoint(foodData, data.detailLevel === 'advanced' ? data.advancedMode : undefined);

  // Generate tradeoff note if applicable
  const tradeoffNote = generateTradeoffNote(foodData, data.detailLevel === 'advanced' ? data.advancedMode : undefined);

  return {
    impactLevel,
    primaryDrivers: drivers.slice(0, 3), // Top 3 drivers
    leveragePoint,
    tradeoffNote,
  };
}

function generateLeveragePoint(liteData: FoodLiteMode, advancedData?: FoodAdvancedMode): string {
  // Prioritize recommendations based on highest impact potential

  // Check sourcing first (often biggest lever)
  if (liteData.sourcing === 'national') {
    return "Switching to local or regional vendors would significantly reduce transportation emissions without changing menu quality.";
  }

  // Check service model
  if (liteData.serviceModel === 'pre-packaged') {
    return "Shifting to bulk service (buffet or plated) could reduce packaging waste while maintaining service quality.";
  }

  if (liteData.serviceModel === 'food-trucks') {
    return "Consider consolidated catering to reduce vendor transportation and on-site power requirements.";
  }

  // Check advanced factors
  if (advancedData) {
    if (advancedData.serviceWare === 'single-use-plastic') {
      return "Switching to compostable serviceware or reusables would reduce food-related emissions more than menu changes alone.";
    }

    if (advancedData.wasteHandling === 'no-plan' || advancedData.wasteHandling === 'landfill') {
      return "Implementing composting or food donation programs would significantly reduce waste-related emissions.";
    }

    if (advancedData.foodStrategy === 'standard' && !liteData.plantForward) {
      return "Emphasizing plant-forward menu options could reduce agricultural emissions without eliminating all animal products.";
    }
  }

  // Default positive reinforcement
  return "Your current food strategy shows good consideration for environmental impact. Continue monitoring portion sizes to minimize waste.";
}

function generateTradeoffNote(liteData: FoodLiteMode, advancedData?: FoodAdvancedMode): string | undefined {
  // Generate context about cost vs carbon vs labor tradeoffs

  if (liteData.serviceModel === 'full-service' && advancedData?.serviceWare === 'reusable') {
    return "Reusable dishware reduces waste but requires additional labor and water for cleaning.";
  }

  if (liteData.sourcing === 'local' && liteData.serviceModel === 'full-service') {
    return "Local sourcing and full-service catering optimize for quality and sustainability but typically increase costs.";
  }

  if (advancedData?.serviceWare === 'compostable') {
    return "Compostable serviceware reduces landfill waste but requires proper composting infrastructure to realize benefits.";
  }

  return undefined;
}

/**
 * Estimate food-related emissions in kg CO2e
 * This is a simplified model based on decision patterns, not precise accounting
 */
export function estimateFoodEmissions(data: FoodCateringData): number {
  const foodData = data.detailLevel === 'advanced' ? data.advancedMode : data.liteMode;
  
  if (!foodData || foodData.foodProvided === 'none') {
    return 0;
  }

  // Base emissions per person per meal (kg CO2e)
  let baseEmissionsPerMeal = 3.0; // Standard mixed meal

  // Adjust for food strategy
  if (data.detailLevel === 'advanced' && data.advancedMode) {
    if (data.advancedMode.foodStrategy === 'vegetarian-vegan') {
      baseEmissionsPerMeal = 1.5; // ~50% reduction
    } else if (data.advancedMode.foodStrategy === 'plant-forward') {
      baseEmissionsPerMeal = 2.0; // ~33% reduction
    }
  } else if (foodData.plantForward) {
    baseEmissionsPerMeal = 2.0;
  }

  // Adjust for sourcing
  let sourcingMultiplier = 1.0;
  if (foodData.sourcing === 'national') {
    sourcingMultiplier = 1.3; // +30% for transportation
  } else if (foodData.sourcing === 'local') {
    sourcingMultiplier = 0.9; // -10% for reduced transportation
  }

  // Adjust for service model
  let serviceMultiplier = 1.0;
  if (foodData.serviceModel === 'full-service') {
    serviceMultiplier = 1.2; // +20% for energy and waste
  } else if (foodData.serviceModel === 'pre-packaged') {
    serviceMultiplier = 1.15; // +15% for packaging
  } else if (foodData.serviceModel === 'food-trucks') {
    serviceMultiplier = 1.25; // +25% for transportation and energy
  }

  // Adjust for serviceware (advanced mode)
  let servicewareMultiplier = 1.0;
  if (data.detailLevel === 'advanced' && data.advancedMode) {
    if (data.advancedMode.serviceWare === 'single-use-plastic') {
      servicewareMultiplier = 1.2; // +20% for plastic production and waste
    } else if (data.advancedMode.serviceWare === 'reusable') {
      servicewareMultiplier = 0.95; // -5% (water/energy for cleaning offset by reuse)
    } else if (data.advancedMode.serviceWare === 'compostable') {
      servicewareMultiplier = 1.05; // +5% (production cost, but better end-of-life)
    }
  }

  // Estimate number of people fed
  let peopleFed = 0;
  switch (foodData.scale) {
    case '1-50':
      peopleFed = 25;
      break;
    case '51-250':
      peopleFed = 150;
      break;
    case '251-1000':
      peopleFed = 500;
      break;
    case '1000+':
      peopleFed = 2000;
      break;
  }

  // Estimate meals per person
  let mealsPerPerson = 1;
  if (foodData.foodProvided === 'full-meals') {
    mealsPerPerson = 2; // Assume 2 meals for full catering
  } else if (foodData.foodProvided === 'light-catering') {
    mealsPerPerson = 0.5; // Light catering = half a meal equivalent
  }

  // Calculate total emissions
  const totalEmissions = 
    baseEmissionsPerMeal * 
    sourcingMultiplier * 
    serviceMultiplier * 
    servicewareMultiplier * 
    peopleFed * 
    mealsPerPerson;

  return Math.round(totalEmissions);
}