import { ProductionBuildData, ProductionSystemImpacts, ProductionBasicMode, ProductionDetailedMode } from "@/types/carbon";

/**
 * Calculate production system impacts including control, carbon intensity, and logistics complexity
 */
export function calculateProductionSystemImpacts(data: ProductionBuildData): ProductionSystemImpacts {
  const productionData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;
  
  if (!productionData) {
    return {
      controlLevel: 'low',
      carbonIntensity: 'medium',
      logisticsComplexity: 'low',
      tradeoffNotes: [],
      leveragePoints: [],
    };
  }

  let controlLevel: 'low' | 'medium' | 'high' = 'medium';
  let carbonIntensity: 'low' | 'medium' | 'high' = 'medium';
  let logisticsComplexity: 'low' | 'medium' | 'high' = 'low';
  const tradeoffNotes: string[] = [];
  const leveragePoints: string[] = [];

  // Control level based on build strategy
  switch (productionData.buildStrategy) {
    case 'bring-full-rig':
      controlLevel = 'high';
      carbonIntensity = 'high';
      tradeoffNotes.push(
        "Bringing your full rig maximizes control over production quality but significantly increases transportation emissions and logistics complexity."
      );
      leveragePoints.push(
        "Consider hybrid approach: bring critical custom elements, rent standard equipment locally to reduce transport emissions."
      );
      break;
    case 'hybrid':
      controlLevel = 'medium';
      carbonIntensity = 'medium';
      tradeoffNotes.push(
        "Hybrid approach balances control and carbon—you maintain quality on critical elements while reducing transport for standard gear."
      );
      leveragePoints.push(
        "Optimize your hybrid strategy: identify which elements truly require your touring gear vs. what can be sourced locally."
      );
      break;
    case 'rent-locally':
      controlLevel = 'medium';
      carbonIntensity = 'low';
      tradeoffNotes.push(
        "Local rental reduces transportation emissions significantly but requires advance coordination and may have availability constraints."
      );
      leveragePoints.push(
        "Build relationships with local vendors in key markets to ensure equipment quality and availability."
      );
      break;
    case 'venue-provided':
      controlLevel = 'low';
      carbonIntensity = 'low';
      tradeoffNotes.push(
        "Using venue infrastructure minimizes carbon footprint but limits production capabilities. Verify venue equipment meets your technical requirements."
      );
      leveragePoints.push(
        "Conduct thorough venue tech specs review early—surprises during load-in can force last-minute rentals, increasing both cost and carbon."
      );
      break;
  }

  // Production scale affects carbon intensity
  switch (productionData.productionScale) {
    case 'minimal':
      // Already factored in
      break;
    case 'standard':
      if (carbonIntensity === 'low') carbonIntensity = 'medium';
      break;
    case 'full-production':
    case 'festival':
      if (carbonIntensity === 'low') carbonIntensity = 'medium';
      else if (carbonIntensity === 'medium') carbonIntensity = 'high';
      leveragePoints.push(
        "Large-scale productions amplify the impact of your build strategy. Even small efficiency gains have significant carbon reduction."
      );
      break;
  }

  // Transport requirement affects carbon
  if (productionData.transportRequired) {
    if (carbonIntensity === 'low') carbonIntensity = 'medium';
    leveragePoints.push(
      "Equipment transport is a major emission source. Consolidate shipments and optimize truck loading to maximize efficiency."
    );
  }

  // Detailed mode analysis
  if (data.detailLevel === 'detailed' && data.detailedMode) {
    const detailed = data.detailedMode;

    // Venue provides analysis
    const venueProvidedCount = Object.values(detailed.venueProvides).filter(v => v).length;
    if (venueProvidedCount >= 4) {
      carbonIntensity = 'low';
      leveragePoints.push(
        "Venue provides significant infrastructure—maximize use of existing resources to minimize temporary build emissions."
      );
    }

    // What you're bringing analysis
    const bringingCount = Object.values(detailed.bringingOwn).filter(v => v).length;
    if (bringingCount >= 4) {
      if (carbonIntensity === 'low') carbonIntensity = 'medium';
      else if (carbonIntensity === 'medium') carbonIntensity = 'high';
      tradeoffNotes.push(
        `Bringing ${bringingCount} major production elements increases transport emissions but ensures production quality and consistency.`
      );
    }

    // Vendor strategy affects logistics complexity
    switch (detailed.vendorStrategy.approach) {
      case 'single-vendor':
        logisticsComplexity = 'low';
        leveragePoints.push(
          "Single vendor simplifies coordination and can reduce transport through consolidated delivery."
        );
        break;
      case 'multiple-specialists':
        logisticsComplexity = 'high';
        tradeoffNotes.push(
          "Multiple specialist vendors increase logistics complexity and coordination overhead but may provide best-in-class equipment."
        );
        if (detailed.vendorStrategy.numberOfVendors >= 4) {
          leveragePoints.push(
            `Coordinating ${detailed.vendorStrategy.numberOfVendors} vendors increases complexity. Consider consolidating where quality allows.`
          );
        }
        break;
      case 'hybrid':
        logisticsComplexity = 'medium';
        break;
      case 'in-house':
        logisticsComplexity = 'low';
        controlLevel = 'high';
        tradeoffNotes.push(
          "In-house equipment maximizes control but requires transport and maintenance infrastructure."
        );
        break;
    }

    // Local vendors reduce carbon
    if (detailed.vendorStrategy.localVendors) {
      if (carbonIntensity === 'high') carbonIntensity = 'medium';
      leveragePoints.push(
        "Using local vendors significantly reduces transportation emissions—continue prioritizing local sourcing where possible."
      );
    }

    // Transport logistics analysis
    if (detailed.transportRequired) {
      if (detailed.transportLogistics.consolidatedShipping) {
        leveragePoints.push(
          "Consolidated shipping reduces trips and emissions—excellent logistics planning."
        );
      } else if (detailed.transportLogistics.trucksRequired > 2) {
        leveragePoints.push(
          "Multiple truck shipments increase emissions. Explore consolidated shipping or local rental to reduce transport."
        );
      }

      if (detailed.transportLogistics.freightFlights > 0) {
        carbonIntensity = 'high';
        tradeoffNotes.push(
          "Freight flights have extremely high carbon intensity. Consider surface transport or local rental for international events."
        );
      }
    }

    // Build time affects crew emissions
    const totalBuildDays = detailed.buildTime.loadInDays + detailed.buildTime.strikeDownDays;
    if (totalBuildDays > 5 && detailed.buildTime.crewSize > 20) {
      tradeoffNotes.push(
        `Extended build time (${totalBuildDays} days) with large crew (${detailed.buildTime.crewSize}) increases accommodation and meal emissions. Efficient load-in/strike reduces both cost and carbon.`
      );
      leveragePoints.push(
        "Optimize load-in and strike schedules to minimize crew days on-site. Pre-planning and rehearsals can significantly reduce build time."
      );
    }
  }

  // Add general leverage points if none specific
  if (leveragePoints.length === 0) {
    leveragePoints.push(
      "Consider your production build strategy early in planning—venue selection and equipment decisions have long-term carbon implications."
    );
  }

  return {
    controlLevel,
    carbonIntensity,
    logisticsComplexity,
    tradeoffNotes,
    leveragePoints,
  };
}

/**
 * Estimate production-related emissions in kg CO2e
 */
export function estimateProductionEmissions(data: ProductionBuildData): number {
  const productionData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;
  
  if (!productionData) {
    return 0;
  }

  let totalEmissions = 0;

  // Base emissions by build strategy (kg CO2e)
  const strategyEmissions = {
    'venue-provided': 100,      // Minimal additional infrastructure
    'rent-locally': 500,         // Local transport and setup
    'hybrid': 2000,              // Mixed transport
    'bring-full-rig': 5000,      // Full touring rig transport
  };

  totalEmissions += strategyEmissions[productionData.buildStrategy];

  // Scale multiplier
  const scaleMultipliers = {
    'minimal': 0.5,
    'standard': 1.0,
    'full-production': 2.0,
    'festival': 4.0,
  };

  totalEmissions *= scaleMultipliers[productionData.productionScale];

  // Detailed mode adjustments
  if (data.detailLevel === 'detailed' && data.detailedMode) {
    const detailed = data.detailedMode;

    // Transport logistics
    if (detailed.transportRequired) {
      // Truck emissions (kg CO2e per truck per km)
      const truckEmissionFactor = 0.8;
      const truckEmissions = 
        detailed.transportLogistics.trucksRequired * 
        detailed.transportLogistics.averageDistance * 
        truckEmissionFactor * 
        2; // Round trip

      totalEmissions += truckEmissions;

      // Freight flight emissions (extremely high)
      if (detailed.transportLogistics.freightFlights > 0) {
        totalEmissions += detailed.transportLogistics.freightFlights * 10000; // 10 tonnes per flight
      }

      // Consolidated shipping reduces emissions
      if (detailed.transportLogistics.consolidatedShipping) {
        totalEmissions *= 0.85; // 15% reduction for efficiency
      }
    }

    // Vendor strategy affects efficiency
    if (detailed.vendorStrategy.approach === 'multiple-specialists') {
      totalEmissions *= 1.2; // 20% increase for coordination inefficiency
    } else if (detailed.vendorStrategy.approach === 'single-vendor') {
      totalEmissions *= 0.9; // 10% reduction for consolidation
    }

    // Local vendors reduce transport
    if (detailed.vendorStrategy.localVendors) {
      totalEmissions *= 0.8; // 20% reduction for local sourcing
    }

    // Build time affects crew emissions
    const totalBuildDays = detailed.buildTime.loadInDays + detailed.buildTime.strikeDownDays;
    const crewEmissions = totalBuildDays * detailed.buildTime.crewSize * 50; // 50 kg CO2e per crew per day (accommodation, meals, local transport)
    totalEmissions += crewEmissions;

    // Venue provides infrastructure reduces emissions
    const venueProvidedCount = Object.values(detailed.venueProvides).filter(v => v).length;
    if (venueProvidedCount >= 4) {
      totalEmissions *= 0.7; // 30% reduction for using venue infrastructure
    } else if (venueProvidedCount >= 2) {
      totalEmissions *= 0.85; // 15% reduction for partial venue infrastructure
    }

    // What you're bringing increases emissions
    const bringingCount = Object.values(detailed.bringingOwn).filter(v => v).length;
    if (bringingCount >= 4) {
      totalEmissions *= 1.3; // 30% increase for extensive touring gear
    } else if (bringingCount >= 2) {
      totalEmissions *= 1.15; // 15% increase for moderate touring gear
    }
  }

  return Math.round(totalEmissions);
}

/**
 * Generate systems thinking connections for production
 */
export function generateProductionSystemConnections(data: ProductionBuildData): string[] {
  const connections: string[] = [];
  const productionData = data.detailLevel === 'detailed' ? data.detailedMode : data.basicMode;

  if (!productionData) return connections;

  // Power connection
  connections.push(
    "Your production build affects power requirements—more equipment means higher power loads and potentially more backup generators."
  );

  // Crew connection
  if (productionData.buildStrategy === 'bring-full-rig') {
    connections.push(
      "Bringing your full rig requires touring crew—this increases crew travel and accommodation emissions."
    );
  } else if (productionData.buildStrategy === 'rent-locally') {
    connections.push(
      "Local rental allows for local crew hire—this reduces crew travel emissions significantly."
    );
  }

  // Transport connection
  if (productionData.transportRequired) {
    connections.push(
      "Equipment transport is a major emission source—consider consolidating with other shipments or exploring local rental options."
    );
  }

  // Venue connection
  connections.push(
    "Venue capabilities directly affect your production build strategy—venues with existing infrastructure reduce temporary build emissions."
  );

  return connections;
}