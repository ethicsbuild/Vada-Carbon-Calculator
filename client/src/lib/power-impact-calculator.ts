import { PowerSystemData, PowerSystemImpacts, PowerBasicMode, PowerDetailedMode } from "@/types/carbon";

/**
 * Calculate power system impacts including reliability, efficiency, and carbon intensity
 */
export function calculatePowerSystemImpacts(data: PowerSystemData): PowerSystemImpacts {
  const powerData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;
  
  if (!powerData) {
    return {
      reliabilityScore: 'low',
      efficiencyScore: 'low',
      carbonIntensity: 'medium',
      tradeoffNotes: [],
      leveragePoints: [],
    };
  }

  let reliabilityScore: 'low' | 'medium' | 'high' = 'medium';
  let efficiencyScore: 'low' | 'medium' | 'high' = 'medium';
  let carbonIntensity: 'low' | 'medium' | 'high' = 'medium';
  const tradeoffNotes: string[] = [];
  const leveragePoints: string[] = [];

  // Reliability scoring
  if (powerData.backupRequired) {
    reliabilityScore = 'high';
    tradeoffNotes.push(
      "Backup power increases reliability but adds carbon emissions. This is often non-negotiable for safety and insurance requirements."
    );
  } else {
    reliabilityScore = 'medium';
  }

  // Detailed mode reliability adjustments
  if (data.detailLevel === 'detailed' && data.detailedMode) {
    const detailed = data.detailedMode;
    
    if (detailed.backupStrategy.backupCapacity === 'full') {
      reliabilityScore = 'high';
      tradeoffNotes.push(
        "Full backup capacity maximizes reliability but doubles your power infrastructure carbon footprint."
      );
    }

    if (detailed.loadProfile.criticalSystems) {
      tradeoffNotes.push(
        "Critical systems require uninterrupted power—this is a safety requirement, not an efficiency choice."
      );
    }

    if (detailed.distribution.strategy === 'distributed') {
      reliabilityScore = 'high';
      tradeoffNotes.push(
        "Distributed power reduces single-point failure risk but increases infrastructure complexity and emissions."
      );
    }
  }

  // Carbon intensity scoring
  switch (powerData.primarySource) {
    case 'grid':
      carbonIntensity = 'medium';
      leveragePoints.push(
        "Grid power carbon intensity varies by region. Consider renewable energy credits or time-of-use optimization."
      );
      break;
    case 'generator':
      carbonIntensity = 'high';
      leveragePoints.push(
        "Generators are carbon-intensive. Consider hybrid systems with battery storage or grid connection where possible."
      );
      break;
    case 'renewable':
      carbonIntensity = 'low';
      leveragePoints.push(
        "Renewable power is excellent for carbon reduction. Ensure adequate capacity and backup for reliability."
      );
      break;
    case 'hybrid':
      carbonIntensity = 'medium';
      leveragePoints.push(
        "Hybrid systems balance reliability and carbon. Optimize the ratio of renewable to fossil fuel sources."
      );
      break;
  }

  // Backup power carbon impact
  if (powerData.backupRequired) {
    if (carbonIntensity === 'low') carbonIntensity = 'medium';
    else if (carbonIntensity === 'medium') carbonIntensity = 'high';
    
    leveragePoints.push(
      "Backup generators are often diesel-powered. Consider battery backup or biodiesel where safety allows."
    );
  }

  // Efficiency scoring based on load and strategy
  if (data.detailLevel === 'detailed' && data.detailedMode) {
    const detailed = data.detailedMode;
    
    // Venue capabilities affect efficiency
    if (detailed.venueCapabilities.gridAvailable && detailed.venueCapabilities.gridCapacity === 'abundant') {
      efficiencyScore = 'high';
      leveragePoints.push(
        "Venue has abundant grid power—maximize use of existing infrastructure to reduce temporary power needs."
      );
    } else if (detailed.venueCapabilities.gridCapacity === 'insufficient') {
      efficiencyScore = 'low';
      tradeoffNotes.push(
        "Insufficient venue power requires supplemental generation, increasing both cost and emissions."
      );
    }

    // Distribution strategy affects efficiency
    if (detailed.distribution.strategy === 'centralized' && detailed.venueCapabilities.existingInfrastructure) {
      efficiencyScore = 'high';
      leveragePoints.push(
        "Centralized distribution with existing infrastructure is most efficient—minimal temporary build required."
      );
    } else if (detailed.distribution.strategy === 'distributed' && detailed.distribution.zones > 3) {
      efficiencyScore = 'low';
      tradeoffNotes.push(
        "Multiple power zones increase redundancy but require more infrastructure and cabling, reducing efficiency."
      );
    }

    // Load profile affects efficiency
    if (detailed.loadProfile.peakLoad === 'extreme' && detailed.loadProfile.sustainedLoad === 'low') {
      efficiencyScore = 'low';
      leveragePoints.push(
        "High peak load with low sustained load suggests inefficient power sizing. Consider load balancing or phased power-up."
      );
    }
  }

  // Load size affects carbon
  switch (powerData.estimatedLoad) {
    case 'small':
      // Small load is already factored in
      break;
    case 'medium':
      if (carbonIntensity === 'low') carbonIntensity = 'medium';
      break;
    case 'large':
    case 'festival':
      if (carbonIntensity === 'low') carbonIntensity = 'medium';
      else if (carbonIntensity === 'medium') carbonIntensity = 'high';
      leveragePoints.push(
        "Large power loads amplify the impact of your power source choice. Even small efficiency gains have significant impact."
      );
      break;
  }

  // Add general leverage points if none specific
  if (leveragePoints.length === 0) {
    leveragePoints.push(
      "Consider your power strategy early in planning—venue selection and power infrastructure decisions have long-term carbon implications."
    );
  }

  return {
    reliabilityScore,
    efficiencyScore,
    carbonIntensity,
    tradeoffNotes,
    leveragePoints,
  };
}

/**
 * Estimate power-related emissions in kg CO2e
 */
export function estimatePowerEmissions(data: PowerSystemData): number {
  const powerData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;
  
  if (!powerData) {
    return 0;
  }

  // Base emissions per kWh by source (kg CO2e)
  const emissionFactors = {
    grid: 0.5,        // Average grid (varies by region)
    generator: 0.9,   // Diesel generator
    renewable: 0.05,  // Solar/wind/battery
    hybrid: 0.4,      // Weighted average
  };

  // Estimated power consumption by load size (kWh per day)
  const loadEstimates = {
    small: 500,
    medium: 2000,
    large: 8000,
    festival: 20000,
  };

  const baseFactor = emissionFactors[powerData.primarySource];
  const baseLoad = loadEstimates[powerData.estimatedLoad];

  let totalEmissions = baseFactor * baseLoad;

  // Backup power adds emissions
  if (powerData.backupRequired) {
    // Backup generators typically diesel, assume 20% additional capacity
    totalEmissions += 0.9 * baseLoad * 0.2;
  }

  // Detailed mode adjustments
  if (data.detailLevel === 'detailed' && data.detailedMode) {
    const detailed = data.detailedMode;

    // Backup capacity multiplier
    if (detailed.backupStrategy.backupCapacity === 'full') {
      totalEmissions += 0.9 * baseLoad * 0.5; // Full backup adds 50% more
    } else if (detailed.backupStrategy.backupCapacity === 'partial') {
      totalEmissions += 0.9 * baseLoad * 0.3; // Partial backup adds 30% more
    } else if (detailed.backupStrategy.backupCapacity === 'critical-only') {
      totalEmissions += 0.9 * baseLoad * 0.1; // Critical only adds 10% more
    }

    // Distribution strategy affects efficiency
    if (detailed.distribution.strategy === 'distributed') {
      totalEmissions *= 1.15; // 15% increase for distribution losses
    } else if (detailed.distribution.strategy === 'hybrid') {
      totalEmissions *= 1.08; // 8% increase for hybrid distribution
    }

    // Venue capabilities affect efficiency
    if (!detailed.venueCapabilities.gridAvailable) {
      totalEmissions *= 1.3; // 30% increase if no grid (all generators)
    } else if (detailed.venueCapabilities.gridCapacity === 'insufficient') {
      totalEmissions *= 1.2; // 20% increase for supplemental power
    } else if (detailed.venueCapabilities.existingInfrastructure) {
      totalEmissions *= 0.9; // 10% reduction for using existing infrastructure
    }

    // Peak load affects sizing efficiency
    if (detailed.loadProfile.peakLoad === 'extreme' && detailed.loadProfile.sustainedLoad === 'low') {
      totalEmissions *= 1.25; // 25% increase for inefficient sizing
    }
  }

  return Math.round(totalEmissions);
}

/**
 * Generate systems thinking connections for power
 */
export function generatePowerSystemConnections(data: PowerSystemData): string[] {
  const connections: string[] = [];
  const powerData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;

  if (!powerData) return connections;

  // Food trucks connection
  connections.push(
    "If you're using food trucks, they'll need power—either from your main distribution or separate generators."
  );

  // Outdoor venue connection
  connections.push(
    "Outdoor venues typically require temporary power infrastructure, increasing both setup time and emissions."
  );

  // Production build connection
  if (powerData.estimatedLoad === 'large' || powerData.estimatedLoad === 'festival') {
    connections.push(
      "Large production builds require significant power infrastructure—consider this when deciding to bring your full rig vs. rent locally."
    );
  }

  // Backup power connection
  if (powerData.backupRequired) {
    connections.push(
      "Backup power requirements affect your entire power strategy—this is often driven by insurance, safety codes, or venue requirements, not just preference."
    );
  }

  return connections;
}