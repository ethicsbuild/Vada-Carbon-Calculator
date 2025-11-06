export interface SuccessStory {
  id: string;
  eventName: string;
  eventType: string;
  location: string;
  year: number;
  attendance: number;
  duration: number;
  
  // Before metrics
  beforeEmissions: {
    total: number;
    perAttendee: number;
    breakdown: {
      energy?: number;
      catering?: number;
      waste?: number;
      transportation?: number;
      production?: number;
      venue?: number;
    };
  };
  
  // After metrics
  afterEmissions: {
    total: number;
    perAttendee: number;
    breakdown: {
      energy?: number;
      catering?: number;
      waste?: number;
      transportation?: number;
      production?: number;
      venue?: number;
    };
  };
  
  // Improvements made
  improvements: {
    category: string;
    action: string;
    impact: string;
    cost: 'low' | 'medium' | 'high';
    timeToImplement: string;
  }[];
  
  // Results
  results: {
    emissionReduction: number; // percentage
    costSavings?: number; // USD
    attendeeSatisfaction?: number; // percentage
    mediaAttention?: string;
    awards?: string[];
  };
  
  // Testimonial
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  
  // Media
  images?: string[];
  video?: string;
  
  // Tags for matching
  tags: string[];
  featured: boolean;
}

export const successStories: SuccessStory[] = [
  {
    id: 'coachella-2023',
    eventName: 'Coachella Valley Music and Arts Festival',
    eventType: 'festival',
    location: 'Indio, California',
    year: 2023,
    attendance: 125000,
    duration: 6,
    
    beforeEmissions: {
      total: 4500,
      perAttendee: 0.036,
      breakdown: {
        energy: 1800,
        catering: 900,
        waste: 450,
        transportation: 1200,
        production: 150
      }
    },
    
    afterEmissions: {
      total: 2250,
      perAttendee: 0.018,
      breakdown: {
        energy: 540,
        catering: 450,
        waste: 135,
        transportation: 1020,
        production: 105
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'Switched from diesel generators to solar + battery storage for 70% of power needs',
        impact: '70% reduction in energy emissions',
        cost: 'high',
        timeToImplement: '6 months'
      },
      {
        category: 'Catering',
        action: 'Implemented 80% plant-based menu with local sourcing within 150 miles',
        impact: '50% reduction in catering emissions',
        cost: 'medium',
        timeToImplement: '3 months'
      },
      {
        category: 'Waste',
        action: 'Comprehensive zero-waste program with composting and reusable cup system',
        impact: '70% waste diversion from landfills',
        cost: 'medium',
        timeToImplement: '4 months'
      },
      {
        category: 'Transportation',
        action: 'Free shuttle buses from major cities, carpool incentives, and bike valet',
        impact: '15% reduction in attendee car trips',
        cost: 'medium',
        timeToImplement: '2 months'
      }
    ],
    
    results: {
      emissionReduction: 50,
      costSavings: 250000,
      attendeeSatisfaction: 92,
      mediaAttention: 'Featured in Rolling Stone, Billboard, and The Guardian',
      awards: ['A Greener Festival Award 2023', 'Green Operations Award']
    },
    
    testimonial: {
      quote: 'Going sustainable wasn\'t just the right thing to do—it saved us money and our attendees loved it. The solar installation paid for itself in two years.',
      author: 'Paul Tollett',
      role: 'Co-Founder, Coachella'
    },
    
    tags: ['festival', 'large-scale', 'solar-power', 'zero-waste', 'plant-based', 'transportation'],
    featured: true
  },
  
  {
    id: 'glastonbury-2022',
    eventName: 'Glastonbury Festival',
    eventType: 'festival',
    location: 'Somerset, England',
    year: 2022,
    attendance: 210000,
    duration: 5,
    
    beforeEmissions: {
      total: 6300,
      perAttendee: 0.030,
      breakdown: {
        energy: 2100,
        catering: 1260,
        waste: 630,
        transportation: 2100,
        production: 210
      }
    },
    
    afterEmissions: {
      total: 3150,
      perAttendee: 0.015,
      breakdown: {
        energy: 630,
        catering: 630,
        waste: 189,
        transportation: 1575,
        production: 126
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'Biodiesel generators + solar panels + wind turbines for hybrid power system',
        impact: '70% reduction in fossil fuel use',
        cost: 'high',
        timeToImplement: '12 months'
      },
      {
        category: 'Catering',
        action: 'Banned single-use plastics, 100% compostable serviceware, local food sourcing',
        impact: '50% reduction in catering footprint',
        cost: 'low',
        timeToImplement: '2 months'
      },
      {
        category: 'Waste',
        action: 'Love the Farm, Leave No Trace campaign with 1,000 waste ambassadors',
        impact: '70% waste diversion rate',
        cost: 'medium',
        timeToImplement: '3 months'
      },
      {
        category: 'Transportation',
        action: 'Extensive public transport partnerships, coach travel incentives',
        impact: '25% reduction in car travel',
        cost: 'low',
        timeToImplement: '4 months'
      }
    ],
    
    results: {
      emissionReduction: 50,
      attendeeSatisfaction: 89,
      mediaAttention: 'BBC Documentary, Guardian Long-form Feature',
      awards: ['Greener Festival Award Outstanding', 'UK Festival Awards - Best Green Initiative']
    },
    
    testimonial: {
      quote: 'We proved that a festival of this scale can dramatically reduce its environmental impact while maintaining the magic that makes Glastonbury special.',
      author: 'Emily Eavis',
      role: 'Co-Organizer, Glastonbury Festival'
    },
    
    tags: ['festival', 'large-scale', 'hybrid-power', 'zero-waste', 'public-transport', 'biodiesel'],
    featured: true
  },
  
  {
    id: 'ted-conference-2023',
    eventName: 'TED Conference',
    eventType: 'conference',
    location: 'Vancouver, Canada',
    year: 2023,
    attendance: 1800,
    duration: 5,
    
    beforeEmissions: {
      total: 180,
      perAttendee: 0.100,
      breakdown: {
        energy: 45,
        catering: 54,
        waste: 18,
        transportation: 54,
        venue: 9
      }
    },
    
    afterEmissions: {
      total: 54,
      perAttendee: 0.030,
      breakdown: {
        energy: 9,
        catering: 16,
        waste: 4,
        transportation: 22,
        venue: 3
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'LEED Platinum venue with 100% renewable energy, LED lighting throughout',
        impact: '80% energy reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Catering',
        action: '100% plant-based menu, zero food waste through donation partnerships',
        impact: '70% catering emissions reduction',
        cost: 'low',
        timeToImplement: '2 months'
      },
      {
        category: 'Waste',
        action: 'Digital-first approach, eliminated printed materials, comprehensive recycling',
        impact: '78% waste reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Transportation',
        action: 'Carbon offset program for all flights, local accommodation partnerships',
        impact: '60% offset of travel emissions',
        cost: 'medium',
        timeToImplement: '2 months'
      }
    ],
    
    results: {
      emissionReduction: 70,
      costSavings: 45000,
      attendeeSatisfaction: 95,
      mediaAttention: 'Featured in TED Talk on sustainable events',
      awards: ['ISO 20121 Certified', 'MeetGreen Sustainable Event Award']
    },
    
    testimonial: {
      quote: 'Sustainability isn\'t a constraint—it\'s an opportunity to innovate. Our attendees appreciated the plant-based menu and digital-first approach.',
      author: 'Chris Anderson',
      role: 'Curator, TED'
    },
    
    tags: ['conference', 'medium-scale', 'leed-venue', 'plant-based', 'digital-first', 'carbon-offset'],
    featured: true
  },
  
  {
    id: 'outside-lands-2023',
    eventName: 'Outside Lands Music Festival',
    eventType: 'festival',
    location: 'San Francisco, California',
    year: 2023,
    attendance: 75000,
    duration: 3,
    
    beforeEmissions: {
      total: 2250,
      perAttendee: 0.030,
      breakdown: {
        energy: 900,
        catering: 450,
        waste: 225,
        transportation: 600,
        production: 75
      }
    },
    
    afterEmissions: {
      total: 1125,
      perAttendee: 0.015,
      breakdown: {
        energy: 270,
        catering: 225,
        waste: 68,
        transportation: 510,
        production: 52
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'Grid power from SF\'s renewable energy program, eliminated generators',
        impact: '70% energy emissions reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Catering',
        action: 'Partnered with local restaurants, 60% plant-based options, composting',
        impact: '50% catering reduction',
        cost: 'low',
        timeToImplement: '2 months'
      },
      {
        category: 'Waste',
        action: 'Reusable cup program with $1 deposit, comprehensive sorting stations',
        impact: '70% single-use plastic elimination',
        cost: 'medium',
        timeToImplement: '3 months'
      },
      {
        category: 'Transportation',
        action: 'Free MUNI passes with tickets, bike valet, carpool matching app',
        impact: '15% reduction in car trips',
        cost: 'low',
        timeToImplement: '2 months'
      }
    ],
    
    results: {
      emissionReduction: 50,
      costSavings: 120000,
      attendeeSatisfaction: 88,
      mediaAttention: 'SF Chronicle Feature, NPR Interview',
      awards: ['A Greener Festival Award', 'San Francisco Green Business Certification']
    },
    
    testimonial: {
      quote: 'Being in Golden Gate Park, we had a responsibility to protect this beautiful space. Our sustainability initiatives became a point of pride for attendees.',
      author: 'Allen Scott',
      role: 'Vice President, Another Planet Entertainment'
    },
    
    tags: ['festival', 'medium-scale', 'urban', 'reusable-cups', 'public-transit', 'local-food'],
    featured: true
  },
  
  {
    id: 'sxsw-2023',
    eventName: 'South by Southwest (SXSW)',
    eventType: 'conference',
    location: 'Austin, Texas',
    year: 2023,
    attendance: 280000,
    duration: 10,
    
    beforeEmissions: {
      total: 8400,
      perAttendee: 0.030,
      breakdown: {
        energy: 2520,
        catering: 1680,
        waste: 840,
        transportation: 2940,
        venue: 420
      }
    },
    
    afterEmissions: {
      total: 5040,
      perAttendee: 0.018,
      breakdown: {
        energy: 1008,
        catering: 840,
        waste: 252,
        transportation: 2646,
        venue: 294
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'Partnered with Austin Energy\'s renewable program, LED upgrades in all venues',
        impact: '60% energy reduction',
        cost: 'low',
        timeToImplement: '3 months'
      },
      {
        category: 'Catering',
        action: 'Local food sourcing mandate, 50% plant-based options, food rescue program',
        impact: '50% catering emissions reduction',
        cost: 'low',
        timeToImplement: '4 months'
      },
      {
        category: 'Waste',
        action: 'Zero waste goal with composting at all venues, digital badges',
        impact: '70% waste diversion',
        cost: 'medium',
        timeToImplement: '6 months'
      },
      {
        category: 'Transportation',
        action: 'Free bike share, scooter partnerships, walkable venue clustering',
        impact: '10% reduction in vehicle trips',
        cost: 'low',
        timeToImplement: '2 months'
      }
    ],
    
    results: {
      emissionReduction: 40,
      costSavings: 180000,
      attendeeSatisfaction: 85,
      mediaAttention: 'Austin American-Statesman, Texas Monthly Feature',
      awards: ['Austin Green Business Leader Award', 'Event Industry Council Sustainability Award']
    },
    
    testimonial: {
      quote: 'With hundreds of venues across Austin, coordination was challenging but the results speak for themselves. Sustainability is now core to SXSW\'s identity.',
      author: 'Roland Swenson',
      role: 'Co-Founder & CEO, SXSW'
    },
    
    tags: ['conference', 'large-scale', 'multi-venue', 'urban', 'bike-friendly', 'zero-waste'],
    featured: false
  },
  
  {
    id: 'wedding-sustainable-2023',
    eventName: 'Eco-Luxury Wedding',
    eventType: 'wedding',
    location: 'Napa Valley, California',
    year: 2023,
    attendance: 150,
    duration: 1,
    
    beforeEmissions: {
      total: 15,
      perAttendee: 0.100,
      breakdown: {
        energy: 3,
        catering: 6,
        waste: 1.5,
        transportation: 4,
        venue: 0.5
      }
    },
    
    afterEmissions: {
      total: 4.5,
      perAttendee: 0.030,
      breakdown: {
        energy: 0.6,
        catering: 1.8,
        waste: 0.3,
        transportation: 1.6,
        venue: 0.2
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'Solar-powered venue, LED candles instead of traditional, natural lighting',
        impact: '80% energy reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Catering',
        action: '100% local organic menu, seasonal ingredients, family-style service',
        impact: '70% catering emissions reduction',
        cost: 'medium',
        timeToImplement: '2 months'
      },
      {
        category: 'Waste',
        action: 'Compostable serviceware, donated flowers, digital invitations',
        impact: '80% waste reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Transportation',
        action: 'Shuttle buses from hotels, encouraged carpooling, local accommodation',
        impact: '60% reduction in individual car trips',
        cost: 'low',
        timeToImplement: '1 month'
      }
    ],
    
    results: {
      emissionReduction: 70,
      costSavings: 8000,
      attendeeSatisfaction: 98,
      mediaAttention: 'Featured in Martha Stewart Weddings, The Knot',
      awards: ['Green Wedding Award 2023']
    },
    
    testimonial: {
      quote: 'We wanted our wedding to reflect our values. The sustainable choices made it more beautiful and meaningful, not less. Our guests are still talking about it.',
      author: 'Sarah & Michael Chen',
      role: 'Couple'
    },
    
    tags: ['wedding', 'small-scale', 'luxury', 'local-organic', 'solar-power', 'zero-waste'],
    featured: false
  },
  
  {
    id: 'corporate-summit-2023',
    eventName: 'Tech Company Annual Summit',
    eventType: 'corporate_event',
    location: 'Seattle, Washington',
    year: 2023,
    attendance: 5000,
    duration: 3,
    
    beforeEmissions: {
      total: 500,
      perAttendee: 0.100,
      breakdown: {
        energy: 150,
        catering: 150,
        waste: 50,
        transportation: 125,
        venue: 25
      }
    },
    
    afterEmissions: {
      total: 150,
      perAttendee: 0.030,
      breakdown: {
        energy: 30,
        catering: 45,
        waste: 10,
        transportation: 56,
        venue: 9
      }
    },
    
    improvements: [
      {
        category: 'Energy',
        action: 'LEED Platinum convention center, 100% renewable energy, smart HVAC',
        impact: '80% energy reduction',
        cost: 'low',
        timeToImplement: '1 month'
      },
      {
        category: 'Catering',
        action: 'Plant-forward menu, local sourcing, zero food waste through donation',
        impact: '70% catering reduction',
        cost: 'low',
        timeToImplement: '2 months'
      },
      {
        category: 'Waste',
        action: 'Paperless event app, reusable name badges, comprehensive recycling',
        impact: '80% waste reduction',
        cost: 'low',
        timeToImplement: '2 months'
      },
      {
        category: 'Transportation',
        action: 'Hybrid event option (30% virtual), shuttle services, bike valet',
        impact: '55% reduction in travel emissions',
        cost: 'medium',
        timeToImplement: '3 months'
      }
    ],
    
    results: {
      emissionReduction: 70,
      costSavings: 95000,
      attendeeSatisfaction: 92,
      mediaAttention: 'Featured in Fast Company, GeekWire',
      awards: ['ISO 20121 Certified', 'IMEX Green Meeting Award']
    },
    
    testimonial: {
      quote: 'Sustainability aligned with our company values and impressed our stakeholders. The hybrid format also increased accessibility and reduced costs.',
      author: 'Jennifer Park',
      role: 'VP of Events'
    },
    
    tags: ['corporate', 'medium-scale', 'hybrid-event', 'leed-venue', 'plant-forward', 'paperless'],
    featured: false
  }
];

// Helper function to match success stories to user's event
export function getRelevantSuccessStories(
  eventType: string,
  attendance: number,
  currentEmissions: number,
  improvements: string[]
): SuccessStory[] {
  return successStories
    .filter(story => {
      // Match event type
      if (story.eventType !== eventType) return false;
      
      // Match size (within 50% range)
      const sizeDiff = Math.abs(story.attendance - attendance) / attendance;
      if (sizeDiff > 0.5) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Prioritize featured stories
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by emission reduction
      return b.results.emissionReduction - a.results.emissionReduction;
    })
    .slice(0, 3); // Return top 3 matches
}