export interface BenchmarkData {
  eventType: string;
  region: 'global' | 'north_america' | 'europe' | 'asia' | 'oceania';
  
  // Emissions per attendee (tCO₂e)
  emissionsPerAttendee: {
    excellent: number;    // Top 10%
    good: number;         // Top 25%
    average: number;      // 50th percentile
    belowAverage: number; // 75th percentile
    poor: number;         // 90th percentile
  };
  
  // Category breakdowns (percentage of total)
  categoryBreakdown: {
    transportation: { min: number; max: number; average: number };
    energy: { min: number; max: number; average: number };
    catering: { min: number; max: number; average: number };
    waste: { min: number; max: number; average: number };
    production: { min: number; max: number; average: number };
    venue: { min: number; max: number; average: number };
  };
  
  // Best practices adoption rates
  bestPractices: {
    practice: string;
    adoptionRate: number; // percentage
    averageImpact: number; // percentage reduction
  }[];
  
  // Trends
  trends: {
    year: number;
    averageEmissions: number;
    changeFromPreviousYear: number; // percentage
  }[];
  
  sampleSize: number;
  lastUpdated: string;
}

export const industryBenchmarks: BenchmarkData[] = [
  {
    eventType: 'festival',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.012,   // Top 10% - Highly sustainable festivals
      good: 0.018,        // Top 25% - Above average sustainability
      average: 0.025,     // 50th percentile - Industry average
      belowAverage: 0.035, // 75th percentile - Below average
      poor: 0.050         // 90th percentile - Needs significant improvement
    },
    
    categoryBreakdown: {
      transportation: { min: 30, max: 60, average: 45 },
      energy: { min: 15, max: 35, average: 25 },
      catering: { min: 10, max: 25, average: 15 },
      waste: { min: 5, max: 15, average: 8 },
      production: { min: 3, max: 10, average: 5 },
      venue: { min: 2, max: 8, average: 2 }
    },
    
    bestPractices: [
      { practice: 'Renewable energy use', adoptionRate: 35, averageImpact: 60 },
      { practice: 'Reusable cup systems', adoptionRate: 28, averageImpact: 70 },
      { practice: 'Plant-based menu options', adoptionRate: 45, averageImpact: 40 },
      { practice: 'Comprehensive recycling', adoptionRate: 68, averageImpact: 50 },
      { practice: 'Public transport partnerships', adoptionRate: 52, averageImpact: 15 },
      { practice: 'Local food sourcing', adoptionRate: 41, averageImpact: 25 },
      { practice: 'Composting programs', adoptionRate: 33, averageImpact: 35 },
      { practice: 'Digital ticketing', adoptionRate: 89, averageImpact: 5 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.032, changeFromPreviousYear: -5 },
      { year: 2021, averageEmissions: 0.029, changeFromPreviousYear: -9 },
      { year: 2022, averageEmissions: 0.027, changeFromPreviousYear: -7 },
      { year: 2023, averageEmissions: 0.025, changeFromPreviousYear: -7 },
      { year: 2024, averageEmissions: 0.023, changeFromPreviousYear: -8 }
    ],
    
    sampleSize: 847,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'conference',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.005,
      good: 0.010,
      average: 0.015,
      belowAverage: 0.025,
      poor: 0.040
    },
    
    categoryBreakdown: {
      transportation: { min: 35, max: 65, average: 50 },
      energy: { min: 10, max: 25, average: 18 },
      catering: { min: 8, max: 20, average: 12 },
      waste: { min: 3, max: 10, average: 5 },
      production: { min: 5, max: 15, average: 10 },
      venue: { min: 2, max: 8, average: 5 }
    },
    
    bestPractices: [
      { practice: 'LEED-certified venues', adoptionRate: 42, averageImpact: 35 },
      { practice: 'Hybrid/virtual options', adoptionRate: 67, averageImpact: 45 },
      { practice: 'Plant-based catering', adoptionRate: 38, averageImpact: 50 },
      { practice: 'Paperless events', adoptionRate: 78, averageImpact: 15 },
      { practice: 'Carbon offset programs', adoptionRate: 31, averageImpact: 100 },
      { practice: 'Local accommodation partnerships', adoptionRate: 55, averageImpact: 20 },
      { practice: 'Reusable signage', adoptionRate: 44, averageImpact: 10 },
      { practice: 'LED lighting', adoptionRate: 82, averageImpact: 25 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.022, changeFromPreviousYear: -3 },
      { year: 2021, averageEmissions: 0.019, changeFromPreviousYear: -14 },
      { year: 2022, averageEmissions: 0.017, changeFromPreviousYear: -11 },
      { year: 2023, averageEmissions: 0.015, changeFromPreviousYear: -12 },
      { year: 2024, averageEmissions: 0.014, changeFromPreviousYear: -7 }
    ],
    
    sampleSize: 1243,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'concert',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.008,
      good: 0.012,
      average: 0.018,
      belowAverage: 0.028,
      poor: 0.042
    },
    
    categoryBreakdown: {
      transportation: { min: 40, max: 70, average: 55 },
      energy: { min: 12, max: 30, average: 20 },
      catering: { min: 5, max: 15, average: 8 },
      waste: { min: 3, max: 12, average: 7 },
      production: { min: 5, max: 15, average: 8 },
      venue: { min: 1, max: 5, average: 2 }
    },
    
    bestPractices: [
      { practice: 'Venue renewable energy', adoptionRate: 48, averageImpact: 55 },
      { practice: 'Public transit promotion', adoptionRate: 61, averageImpact: 18 },
      { practice: 'Reusable cups', adoptionRate: 34, averageImpact: 65 },
      { practice: 'LED stage lighting', adoptionRate: 76, averageImpact: 40 },
      { practice: 'Local catering', adoptionRate: 52, averageImpact: 22 },
      { practice: 'Recycling stations', adoptionRate: 71, averageImpact: 45 },
      { practice: 'Digital tickets', adoptionRate: 94, averageImpact: 3 },
      { practice: 'Bike parking', adoptionRate: 39, averageImpact: 8 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.025, changeFromPreviousYear: -4 },
      { year: 2021, averageEmissions: 0.022, changeFromPreviousYear: -12 },
      { year: 2022, averageEmissions: 0.020, changeFromPreviousYear: -9 },
      { year: 2023, averageEmissions: 0.018, changeFromPreviousYear: -10 },
      { year: 2024, averageEmissions: 0.017, changeFromPreviousYear: -6 }
    ],
    
    sampleSize: 2156,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'sports_event',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.010,
      good: 0.015,
      average: 0.022,
      belowAverage: 0.032,
      poor: 0.048
    },
    
    categoryBreakdown: {
      transportation: { min: 45, max: 75, average: 60 },
      energy: { min: 10, max: 25, average: 18 },
      catering: { min: 5, max: 15, average: 10 },
      waste: { min: 4, max: 12, average: 7 },
      production: { min: 2, max: 8, average: 3 },
      venue: { min: 1, max: 5, average: 2 }
    },
    
    bestPractices: [
      { practice: 'Stadium renewable energy', adoptionRate: 38, averageImpact: 50 },
      { practice: 'Public transit integration', adoptionRate: 72, averageImpact: 25 },
      { practice: 'Reusable containers', adoptionRate: 41, averageImpact: 60 },
      { practice: 'LED stadium lighting', adoptionRate: 68, averageImpact: 45 },
      { practice: 'Local food vendors', adoptionRate: 59, averageImpact: 20 },
      { practice: 'Comprehensive recycling', adoptionRate: 77, averageImpact: 50 },
      { practice: 'Water refill stations', adoptionRate: 64, averageImpact: 15 },
      { practice: 'Carpool incentives', adoptionRate: 28, averageImpact: 12 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.028, changeFromPreviousYear: -3 },
      { year: 2021, averageEmissions: 0.026, changeFromPreviousYear: -7 },
      { year: 2022, averageEmissions: 0.024, changeFromPreviousYear: -8 },
      { year: 2023, averageEmissions: 0.022, changeFromPreviousYear: -8 },
      { year: 2024, averageEmissions: 0.021, changeFromPreviousYear: -5 }
    ],
    
    sampleSize: 892,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'wedding',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.015,
      good: 0.030,
      average: 0.050,
      belowAverage: 0.075,
      poor: 0.120
    },
    
    categoryBreakdown: {
      transportation: { min: 25, max: 55, average: 40 },
      energy: { min: 8, max: 20, average: 12 },
      catering: { min: 20, max: 45, average: 30 },
      waste: { min: 5, max: 15, average: 10 },
      production: { min: 3, max: 10, average: 5 },
      venue: { min: 2, max: 8, average: 3 }
    },
    
    bestPractices: [
      { practice: 'Outdoor/natural venues', adoptionRate: 45, averageImpact: 30 },
      { practice: 'Local seasonal flowers', adoptionRate: 38, averageImpact: 25 },
      { practice: 'Plant-based menu options', adoptionRate: 32, averageImpact: 45 },
      { practice: 'Digital invitations', adoptionRate: 56, averageImpact: 20 },
      { practice: 'Donated/composted flowers', adoptionRate: 28, averageImpact: 35 },
      { practice: 'Shuttle services', adoptionRate: 41, averageImpact: 40 },
      { practice: 'Reusable decor', adoptionRate: 35, averageImpact: 30 },
      { practice: 'Local accommodation', adoptionRate: 67, averageImpact: 15 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.065, changeFromPreviousYear: -2 },
      { year: 2021, averageEmissions: 0.060, changeFromPreviousYear: -8 },
      { year: 2022, averageEmissions: 0.055, changeFromPreviousYear: -8 },
      { year: 2023, averageEmissions: 0.050, changeFromPreviousYear: -9 },
      { year: 2024, averageEmissions: 0.047, changeFromPreviousYear: -6 }
    ],
    
    sampleSize: 3421,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'corporate_event',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.004,
      good: 0.008,
      average: 0.012,
      belowAverage: 0.020,
      poor: 0.035
    },
    
    categoryBreakdown: {
      transportation: { min: 30, max: 60, average: 45 },
      energy: { min: 12, max: 28, average: 20 },
      catering: { min: 10, max: 25, average: 15 },
      waste: { min: 4, max: 12, average: 8 },
      production: { min: 5, max: 15, average: 10 },
      venue: { min: 1, max: 5, average: 2 }
    },
    
    bestPractices: [
      { practice: 'Green-certified venues', adoptionRate: 51, averageImpact: 40 },
      { practice: 'Hybrid event format', adoptionRate: 73, averageImpact: 50 },
      { practice: 'Plant-forward catering', adoptionRate: 44, averageImpact: 45 },
      { practice: 'Paperless materials', adoptionRate: 84, averageImpact: 18 },
      { practice: 'Carbon reporting', adoptionRate: 39, averageImpact: 0 },
      { practice: 'Sustainable swag', adoptionRate: 47, averageImpact: 12 },
      { practice: 'Public transit incentives', adoptionRate: 58, averageImpact: 22 },
      { practice: 'Reusable name badges', adoptionRate: 62, averageImpact: 8 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.018, changeFromPreviousYear: -5 },
      { year: 2021, averageEmissions: 0.015, changeFromPreviousYear: -17 },
      { year: 2022, averageEmissions: 0.014, changeFromPreviousYear: -7 },
      { year: 2023, averageEmissions: 0.012, changeFromPreviousYear: -14 },
      { year: 2024, averageEmissions: 0.011, changeFromPreviousYear: -8 }
    ],
    
    sampleSize: 1876,
    lastUpdated: '2024-12-01'
  },
  
  {
    eventType: 'trade_show',
    region: 'global',
    
    emissionsPerAttendee: {
      excellent: 0.006,
      good: 0.010,
      average: 0.015,
      belowAverage: 0.024,
      poor: 0.038
    },
    
    categoryBreakdown: {
      transportation: { min: 35, max: 65, average: 50 },
      energy: { min: 15, max: 30, average: 22 },
      catering: { min: 8, max: 18, average: 12 },
      waste: { min: 5, max: 15, average: 10 },
      production: { min: 3, max: 10, average: 4 },
      venue: { min: 1, max: 5, average: 2 }
    },
    
    bestPractices: [
      { practice: 'Reusable booth materials', adoptionRate: 36, averageImpact: 55 },
      { practice: 'Digital catalogs', adoptionRate: 71, averageImpact: 25 },
      { practice: 'LED exhibition lighting', adoptionRate: 68, averageImpact: 35 },
      { practice: 'Sustainable catering', adoptionRate: 49, averageImpact: 30 },
      { practice: 'Recycling program', adoptionRate: 79, averageImpact: 45 },
      { practice: 'Public transit promotion', adoptionRate: 54, averageImpact: 18 },
      { practice: 'Material donation program', adoptionRate: 42, averageImpact: 40 },
      { practice: 'Virtual exhibitor options', adoptionRate: 38, averageImpact: 35 }
    ],
    
    trends: [
      { year: 2020, averageEmissions: 0.021, changeFromPreviousYear: -4 },
      { year: 2021, averageEmissions: 0.019, changeFromPreviousYear: -10 },
      { year: 2022, averageEmissions: 0.017, changeFromPreviousYear: -11 },
      { year: 2023, averageEmissions: 0.015, changeFromPreviousYear: -12 },
      { year: 2024, averageEmissions: 0.014, changeFromPreviousYear: -7 }
    ],
    
    sampleSize: 654,
    lastUpdated: '2024-12-01'
  }
];

// Helper function to get benchmark for specific event
export function getBenchmark(eventType: string, region: string = 'global'): BenchmarkData | undefined {
  return industryBenchmarks.find(
    b => b.eventType === eventType && b.region === region
  );
}

// Helper function to calculate percentile
export function calculatePercentile(
  emissionsPerAttendee: number,
  benchmark: BenchmarkData
): { percentile: number; rating: string; message: string } {
  const { excellent, good, average, belowAverage, poor } = benchmark.emissionsPerAttendee;
  
  if (emissionsPerAttendee <= excellent) {
    return {
      percentile: 5,
      rating: 'Exceptional',
      message: `You're in the top 10% of ${benchmark.eventType}s globally! Outstanding sustainability performance.`
    };
  } else if (emissionsPerAttendee <= good) {
    return {
      percentile: 17,
      rating: 'Excellent',
      message: `You're in the top 25% of ${benchmark.eventType}s. Great work on sustainability!`
    };
  } else if (emissionsPerAttendee <= average) {
    return {
      percentile: 50,
      rating: 'Good',
      message: `You're performing at or above the industry average for ${benchmark.eventType}s.`
    };
  } else if (emissionsPerAttendee <= belowAverage) {
    return {
      percentile: 75,
      rating: 'Fair',
      message: `You're below the industry average. Focus on high-impact improvements to move up.`
    };
  } else {
    return {
      percentile: 90,
      rating: 'Needs Improvement',
      message: `There's significant room for improvement. Start with quick wins for fast results.`
    };
  }
}

// Helper function to get trend analysis
export function getTrendAnalysis(benchmark: BenchmarkData): {
  direction: 'improving' | 'stable' | 'declining';
  averageYearlyChange: number;
  message: string;
} {
  const recentTrends = benchmark.trends.slice(-3);
  const averageChange = recentTrends.reduce((sum, t) => sum + t.changeFromPreviousYear, 0) / recentTrends.length;
  
  let direction: 'improving' | 'stable' | 'declining';
  let message: string;
  
  if (averageChange < -5) {
    direction = 'improving';
    message = `The industry is improving rapidly, with average emissions decreasing by ${Math.abs(averageChange).toFixed(1)}% per year. Stay ahead of the curve!`;
  } else if (averageChange < -2) {
    direction = 'improving';
    message = `The industry is steadily improving, with emissions decreasing by ${Math.abs(averageChange).toFixed(1)}% per year.`;
  } else if (averageChange <= 2) {
    direction = 'stable';
    message = `Industry emissions are relatively stable. Be a leader by implementing innovative sustainability practices.`;
  } else {
    direction = 'declining';
    message = `Industry emissions are increasing. This is your opportunity to differentiate through sustainability leadership.`;
  }
  
  return { direction, averageYearlyChange: averageChange, message };
}