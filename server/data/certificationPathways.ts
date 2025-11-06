export interface CertificationRequirement {
  category: string;
  requirement: string;
  currentStatus?: 'met' | 'partial' | 'not_met';
  howToAchieve: string;
  estimatedCost: string;
  timeToImplement: string;
}

export interface CertificationPathway {
  id: string;
  name: string;
  shortName: string;
  description: string;
  certifyingBody: string;
  website: string;
  
  // Eligibility
  eligibleEventTypes: string[];
  minimumInfluenceScore: number;
  
  // Requirements
  requirements: CertificationRequirement[];
  
  // Benefits
  benefits: string[];
  
  // Process
  process: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  
  // Costs
  costs: {
    applicationFee: string;
    certificationFee: string;
    annualFee: string;
    consultingCosts: string;
    totalEstimate: string;
  };
  
  // Timeline
  timeline: {
    preparation: string;
    application: string;
    review: string;
    certification: string;
    total: string;
  };
  
  // ROI
  roi: {
    marketingValue: string;
    costSavings: string;
    attendeeAppeal: string;
    sponsorshipValue: string;
  };
  
  // Success rate
  successRate: number;
  averageTimeToAchieve: string;
  
  // Difficulty
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Recognition
  industryRecognition: 'high' | 'medium' | 'low';
  
  featured: boolean;
}

export const certificationPathways: CertificationPathway[] = [
  {
    id: 'iso-20121',
    name: 'ISO 20121 - Event Sustainability Management System',
    shortName: 'ISO 20121',
    description: 'The international standard for sustainable event management, covering social, economic, and environmental impacts. Used by major events worldwide including the Olympics.',
    certifyingBody: 'International Organization for Standardization (ISO)',
    website: 'https://www.iso.org/iso-20121-sustainable-events.html',
    
    eligibleEventTypes: ['festival', 'conference', 'sports_event', 'corporate_event', 'trade_show', 'concert'],
    minimumInfluenceScore: 60,
    
    requirements: [
      {
        category: 'Management System',
        requirement: 'Establish documented sustainability management system',
        howToAchieve: 'Create policies, procedures, and documentation for sustainability management',
        estimatedCost: '$5,000-$15,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Stakeholder Engagement',
        requirement: 'Identify and engage with all stakeholders on sustainability',
        howToAchieve: 'Map stakeholders, conduct surveys, establish communication channels',
        estimatedCost: '$2,000-$5,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Supply Chain',
        requirement: 'Implement sustainable procurement policies',
        howToAchieve: 'Create supplier code of conduct, vet suppliers, track sustainability metrics',
        estimatedCost: '$3,000-$8,000',
        timeToImplement: '2-4 months'
      },
      {
        category: 'Carbon Management',
        requirement: 'Measure, reduce, and offset carbon emissions',
        howToAchieve: 'Use VADA calculator, implement reduction strategies, purchase offsets',
        estimatedCost: '$5,000-$20,000',
        timeToImplement: '3-6 months'
      },
      {
        category: 'Waste Management',
        requirement: 'Implement comprehensive waste reduction and diversion program',
        howToAchieve: 'Set up recycling/composting, track waste metrics, aim for 70%+ diversion',
        estimatedCost: '$3,000-$10,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Continuous Improvement',
        requirement: 'Establish monitoring, measurement, and improvement processes',
        howToAchieve: 'Set KPIs, conduct regular audits, document improvements',
        estimatedCost: '$2,000-$5,000',
        timeToImplement: '1-2 months'
      }
    ],
    
    benefits: [
      'International recognition and credibility',
      'Competitive advantage in bidding for major events',
      'Improved operational efficiency and cost savings',
      'Enhanced reputation with stakeholders',
      'Framework for continuous improvement',
      'Increased sponsor and partner interest',
      'Alignment with UN Sustainable Development Goals',
      'Risk management and compliance'
    ],
    
    process: [
      {
        step: 1,
        title: 'Gap Analysis',
        description: 'Assess current practices against ISO 20121 requirements',
        duration: '2-4 weeks'
      },
      {
        step: 2,
        title: 'System Development',
        description: 'Develop policies, procedures, and documentation',
        duration: '2-3 months'
      },
      {
        step: 3,
        title: 'Implementation',
        description: 'Roll out sustainability management system across organization',
        duration: '3-6 months'
      },
      {
        step: 4,
        title: 'Internal Audit',
        description: 'Conduct internal audit to ensure readiness',
        duration: '2-4 weeks'
      },
      {
        step: 5,
        title: 'Certification Audit',
        description: 'External auditor reviews system and practices',
        duration: '1-2 weeks'
      },
      {
        step: 6,
        title: 'Certification',
        description: 'Receive ISO 20121 certification',
        duration: '2-4 weeks'
      }
    ],
    
    costs: {
      applicationFee: '$500-$1,000',
      certificationFee: '$8,000-$25,000',
      annualFee: '$2,000-$5,000',
      consultingCosts: '$15,000-$50,000 (optional)',
      totalEstimate: '$25,000-$80,000 first year'
    },
    
    timeline: {
      preparation: '3-6 months',
      application: '2-4 weeks',
      review: '4-8 weeks',
      certification: '2-4 weeks',
      total: '6-12 months'
    },
    
    roi: {
      marketingValue: 'High - International recognition',
      costSavings: '$20,000-$100,000+ annually through efficiency',
      attendeeAppeal: '15-25% increase in sustainability-conscious attendees',
      sponsorshipValue: '10-20% increase in sponsor interest'
    },
    
    successRate: 78,
    averageTimeToAchieve: '9 months',
    difficulty: 'advanced',
    industryRecognition: 'high',
    featured: true
  },
  
  {
    id: 'greener-festival',
    name: 'A Greener Festival Award',
    shortName: 'AGF Award',
    description: 'Internationally recognized award for festivals demonstrating outstanding commitment to environmental sustainability. Includes certification levels from Bronze to Outstanding.',
    certifyingBody: 'A Greener Festival',
    website: 'https://www.agreenerfestival.com',
    
    eligibleEventTypes: ['festival', 'concert', 'outdoor_event'],
    minimumInfluenceScore: 35,
    
    requirements: [
      {
        category: 'Energy',
        requirement: 'Minimize fossil fuel use, maximize renewable energy',
        howToAchieve: 'Use grid power, solar, biodiesel; avoid diesel generators where possible',
        estimatedCost: '$5,000-$50,000',
        timeToImplement: '3-6 months'
      },
      {
        category: 'Waste',
        requirement: 'Achieve 60%+ waste diversion rate',
        howToAchieve: 'Implement recycling, composting, reusable systems',
        estimatedCost: '$3,000-$15,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Water',
        requirement: 'Minimize water use and provide free drinking water',
        howToAchieve: 'Install water refill stations, use water-efficient systems',
        estimatedCost: '$2,000-$8,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Travel',
        requirement: 'Promote sustainable travel options',
        howToAchieve: 'Public transport partnerships, shuttle services, bike parking',
        estimatedCost: '$5,000-$20,000',
        timeToImplement: '2-4 months'
      },
      {
        category: 'Food',
        requirement: 'Sustainable food and beverage options',
        howToAchieve: 'Local sourcing, plant-based options, reusable containers',
        estimatedCost: '$2,000-$10,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Communication',
        requirement: 'Educate attendees about sustainability initiatives',
        howToAchieve: 'Signage, social media, on-site ambassadors',
        estimatedCost: '$1,000-$5,000',
        timeToImplement: '1-2 months'
      }
    ],
    
    benefits: [
      'International festival industry recognition',
      'Marketing and PR value',
      'Networking with sustainable festival community',
      'Access to best practice resources',
      'Attendee loyalty and satisfaction',
      'Sponsor appeal',
      'Progressive certification levels (Bronze to Outstanding)',
      'Annual awards ceremony recognition'
    ],
    
    process: [
      {
        step: 1,
        title: 'Self-Assessment',
        description: 'Complete online self-assessment questionnaire',
        duration: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Application',
        description: 'Submit application with supporting evidence',
        duration: '2-3 weeks'
      },
      {
        step: 3,
        title: 'Site Visit',
        description: 'AGF assessor visits festival (for higher levels)',
        duration: '1 day'
      },
      {
        step: 4,
        title: 'Review',
        description: 'Assessment team reviews application and site visit',
        duration: '2-4 weeks'
      },
      {
        step: 5,
        title: 'Award',
        description: 'Receive certification level and award',
        duration: '1-2 weeks'
      }
    ],
    
    costs: {
      applicationFee: '$500-$2,000',
      certificationFee: '$1,000-$5,000',
      annualFee: '$500-$2,000',
      consultingCosts: '$5,000-$15,000 (optional)',
      totalEstimate: '$7,000-$24,000 first year'
    },
    
    timeline: {
      preparation: '2-4 months',
      application: '2-3 weeks',
      review: '4-6 weeks',
      certification: '1-2 weeks',
      total: '4-6 months'
    },
    
    roi: {
      marketingValue: 'High - Festival industry recognition',
      costSavings: '$10,000-$50,000 annually',
      attendeeAppeal: '20-30% increase in eco-conscious attendees',
      sponsorshipValue: '15-25% increase in green sponsor interest'
    },
    
    successRate: 85,
    averageTimeToAchieve: '5 months',
    difficulty: 'intermediate',
    industryRecognition: 'high',
    featured: true
  },
  
  {
    id: 'leed-events',
    name: 'LEED for Events',
    shortName: 'LEED Events',
    description: 'Leadership in Energy and Environmental Design certification specifically for events. Focuses on venue selection, materials, waste, and attendee experience.',
    certifyingBody: 'U.S. Green Building Council (USGBC)',
    website: 'https://www.usgbc.org/leed',
    
    eligibleEventTypes: ['conference', 'corporate_event', 'trade_show', 'wedding'],
    minimumInfluenceScore: 55,
    
    requirements: [
      {
        category: 'Venue Selection',
        requirement: 'Use LEED-certified or green-certified venue',
        howToAchieve: 'Select venue with LEED certification or equivalent',
        estimatedCost: '$0 (venue selection)',
        timeToImplement: '1 month'
      },
      {
        category: 'Materials',
        requirement: 'Use sustainable materials and minimize waste',
        howToAchieve: 'Reusable signage, digital materials, sustainable swag',
        estimatedCost: '$2,000-$10,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Waste Diversion',
        requirement: 'Achieve 75%+ waste diversion rate',
        howToAchieve: 'Comprehensive recycling, composting, donation programs',
        estimatedCost: '$3,000-$12,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Food & Beverage',
        requirement: 'Sustainable catering with local/organic options',
        howToAchieve: 'Local sourcing, plant-based options, minimal packaging',
        estimatedCost: '$2,000-$8,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Transportation',
        requirement: 'Promote alternative transportation',
        howToAchieve: 'Public transit info, bike parking, carpool incentives',
        estimatedCost: '$1,000-$5,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Communication',
        requirement: 'Educate attendees on sustainability features',
        howToAchieve: 'Signage, digital communications, sustainability tours',
        estimatedCost: '$1,000-$3,000',
        timeToImplement: '1 month'
      }
    ],
    
    benefits: [
      'USGBC brand recognition',
      'Alignment with corporate sustainability goals',
      'Venue partnership opportunities',
      'Attendee satisfaction and engagement',
      'Marketing differentiation',
      'Measurable environmental impact',
      'Certification levels (Certified, Silver, Gold, Platinum)',
      'Access to LEED professional network'
    ],
    
    process: [
      {
        step: 1,
        title: 'Registration',
        description: 'Register event with USGBC',
        duration: '1 week'
      },
      {
        step: 2,
        title: 'Planning',
        description: 'Plan event to meet LEED requirements',
        duration: '2-4 months'
      },
      {
        step: 3,
        title: 'Implementation',
        description: 'Execute event with sustainability measures',
        duration: 'Event duration'
      },
      {
        step: 4,
        title: 'Documentation',
        description: 'Collect evidence and complete documentation',
        duration: '2-4 weeks'
      },
      {
        step: 5,
        title: 'Submission',
        description: 'Submit application with supporting materials',
        duration: '1-2 weeks'
      },
      {
        step: 6,
        title: 'Review',
        description: 'USGBC reviews application',
        duration: '4-8 weeks'
      },
      {
        step: 7,
        title: 'Certification',
        description: 'Receive LEED certification level',
        duration: '1-2 weeks'
      }
    ],
    
    costs: {
      applicationFee: '$1,200-$2,500',
      certificationFee: '$2,500-$7,500',
      annualFee: '$0',
      consultingCosts: '$5,000-$20,000 (optional)',
      totalEstimate: '$8,700-$30,000'
    },
    
    timeline: {
      preparation: '2-4 months',
      application: '2-4 weeks',
      review: '6-10 weeks',
      certification: '1-2 weeks',
      total: '4-7 months'
    },
    
    roi: {
      marketingValue: 'High - USGBC brand recognition',
      costSavings: '$15,000-$60,000 through efficiency',
      attendeeAppeal: '25-35% increase in corporate attendees',
      sponsorshipValue: '20-30% increase in sustainability-focused sponsors'
    },
    
    successRate: 82,
    averageTimeToAchieve: '6 months',
    difficulty: 'intermediate',
    industryRecognition: 'high',
    featured: true
  },
  
  {
    id: 'green-key',
    name: 'Green Key Eco-Label',
    shortName: 'Green Key',
    description: 'International eco-label for venues and events, focusing on environmental management, staff engagement, and guest communication.',
    certifyingBody: 'Foundation for Environmental Education (FEE)',
    website: 'https://www.greenkey.global',
    
    eligibleEventTypes: ['conference', 'corporate_event', 'wedding', 'trade_show'],
    minimumInfluenceScore: 45,
    
    requirements: [
      {
        category: 'Environmental Policy',
        requirement: 'Documented environmental policy and action plan',
        howToAchieve: 'Create policy, set targets, assign responsibilities',
        estimatedCost: '$1,000-$3,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Energy Management',
        requirement: 'Monitor and reduce energy consumption',
        howToAchieve: 'Track usage, implement efficiency measures, use renewables',
        estimatedCost: '$2,000-$10,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Water Management',
        requirement: 'Monitor and reduce water consumption',
        howToAchieve: 'Install efficient fixtures, track usage, educate staff',
        estimatedCost: '$1,500-$8,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Waste Management',
        requirement: 'Implement waste reduction and recycling program',
        howToAchieve: 'Set up sorting systems, track metrics, reduce single-use',
        estimatedCost: '$2,000-$8,000',
        timeToImplement: '2-3 months'
      },
      {
        category: 'Staff Training',
        requirement: 'Train staff on environmental practices',
        howToAchieve: 'Develop training program, conduct regular sessions',
        estimatedCost: '$1,000-$5,000',
        timeToImplement: '1-2 months'
      },
      {
        category: 'Guest Communication',
        requirement: 'Inform guests about environmental initiatives',
        howToAchieve: 'Signage, website, in-event communications',
        estimatedCost: '$500-$2,000',
        timeToImplement: '1 month'
      }
    ],
    
    benefits: [
      'International recognition in 65+ countries',
      'Marketing tool for eco-conscious clients',
      'Cost savings through efficiency',
      'Staff engagement and pride',
      'Competitive advantage',
      'Continuous improvement framework',
      'Network of certified venues',
      'Annual recognition'
    ],
    
    process: [
      {
        step: 1,
        title: 'Application',
        description: 'Submit application to national Green Key coordinator',
        duration: '1-2 weeks'
      },
      {
        step: 2,
        title: 'Self-Assessment',
        description: 'Complete detailed questionnaire',
        duration: '2-3 weeks'
      },
      {
        step: 3,
        title: 'Site Visit',
        description: 'Coordinator conducts on-site assessment',
        duration: '1 day'
      },
      {
        step: 4,
        title: 'Review',
        description: 'National jury reviews application',
        duration: '2-4 weeks'
      },
      {
        step: 5,
        title: 'Certification',
        description: 'Receive Green Key certification',
        duration: '1-2 weeks'
      }
    ],
    
    costs: {
      applicationFee: '$300-$800',
      certificationFee: '$500-$2,000',
      annualFee: '$300-$1,500',
      consultingCosts: '$3,000-$10,000 (optional)',
      totalEstimate: '$4,100-$14,300 first year'
    },
    
    timeline: {
      preparation: '2-3 months',
      application: '1-2 weeks',
      review: '4-6 weeks',
      certification: '1-2 weeks',
      total: '3-5 months'
    },
    
    roi: {
      marketingValue: 'Medium-High - International recognition',
      costSavings: '$8,000-$30,000 annually',
      attendeeAppeal: '15-20% increase in eco-conscious bookings',
      sponsorshipValue: '10-15% increase in green partnerships'
    },
    
    successRate: 88,
    averageTimeToAchieve: '4 months',
    difficulty: 'beginner',
    industryRecognition: 'medium',
    featured: false
  },
  
  {
    id: 'carbon-neutral',
    name: 'Carbon Neutral Event Certification',
    shortName: 'Carbon Neutral',
    description: 'Certification for events that have measured, reduced, and offset all carbon emissions to achieve net-zero impact.',
    certifyingBody: 'Various (Climate Neutral, Carbon Trust, etc.)',
    website: 'https://www.climateneutral.org',
    
    eligibleEventTypes: ['festival', 'conference', 'corporate_event', 'concert', 'sports_event', 'wedding', 'trade_show'],
    minimumInfluenceScore: 30,
    
    requirements: [
      {
        category: 'Measurement',
        requirement: 'Comprehensive carbon footprint calculation',
        howToAchieve: 'Use VADA calculator or equivalent, include all scopes',
        estimatedCost: '$500-$3,000',
        timeToImplement: '2-4 weeks'
      },
      {
        category: 'Reduction',
        requirement: 'Implement emission reduction strategies',
        howToAchieve: 'Focus on high-impact areas, document reductions',
        estimatedCost: '$5,000-$50,000',
        timeToImplement: '3-6 months'
      },
      {
        category: 'Offsetting',
        requirement: 'Purchase verified carbon offsets for remaining emissions',
        howToAchieve: 'Buy offsets from Gold Standard or VCS certified projects',
        estimatedCost: '$15-$30 per tCO₂e',
        timeToImplement: '1-2 weeks'
      },
      {
        category: 'Verification',
        requirement: 'Third-party verification of calculations and offsets',
        howToAchieve: 'Hire accredited verifier to audit carbon accounting',
        estimatedCost: '$2,000-$10,000',
        timeToImplement: '2-4 weeks'
      },
      {
        category: 'Communication',
        requirement: 'Transparent communication of carbon neutral status',
        howToAchieve: 'Display certification, share methodology, report annually',
        estimatedCost: '$500-$2,000',
        timeToImplement: '1-2 weeks'
      }
    ],
    
    benefits: [
      'Immediate climate impact',
      'Strong marketing message',
      'Attendee and sponsor appeal',
      'Corporate responsibility alignment',
      'Media attention',
      'Competitive differentiation',
      'Contribution to global climate goals',
      'Relatively quick to achieve'
    ],
    
    process: [
      {
        step: 1,
        title: 'Baseline Measurement',
        description: 'Calculate complete carbon footprint',
        duration: '2-4 weeks'
      },
      {
        step: 2,
        title: 'Reduction Plan',
        description: 'Implement emission reduction strategies',
        duration: '3-6 months'
      },
      {
        step: 3,
        title: 'Offset Purchase',
        description: 'Buy verified carbon offsets for remaining emissions',
        duration: '1-2 weeks'
      },
      {
        step: 4,
        title: 'Verification',
        description: 'Third-party audit of calculations and offsets',
        duration: '2-4 weeks'
      },
      {
        step: 5,
        title: 'Certification',
        description: 'Receive carbon neutral certification',
        duration: '1-2 weeks'
      }
    ],
    
    costs: {
      applicationFee: '$0-$500',
      certificationFee: '$1,000-$5,000',
      annualFee: '$500-$2,000',
      consultingCosts: 'Offset costs vary by emissions',
      totalEstimate: '$10,000-$100,000+ (depends on emissions)'
    },
    
    timeline: {
      preparation: '3-6 months',
      application: '1-2 weeks',
      review: '2-4 weeks',
      certification: '1-2 weeks',
      total: '4-8 months'
    },
    
    roi: {
      marketingValue: 'Very High - Clear, simple message',
      costSavings: 'Varies by reduction strategies',
      attendeeAppeal: '30-40% increase in climate-conscious attendees',
      sponsorshipValue: '25-35% increase in sustainability sponsors'
    },
    
    successRate: 92,
    averageTimeToAchieve: '6 months',
    difficulty: 'beginner',
    industryRecognition: 'high',
    featured: true
  }
];

// Helper function to recommend certifications based on event profile
export function recommendCertifications(
  eventType: string,
  influenceScore: number,
  budget: 'low' | 'medium' | 'high'
): CertificationPathway[] {
  return certificationPathways
    .filter(cert => {
      // Check event type eligibility
      if (!cert.eligibleEventTypes.includes(eventType)) return false;
      
      // Check influence score requirement
      if (influenceScore < cert.minimumInfluenceScore) return false;
      
      // Check budget fit
      const costEstimate = parseInt(cert.costs.totalEstimate.replace(/[^0-9]/g, ''));
      if (budget === 'low' && costEstimate > 20000) return false;
      if (budget === 'medium' && costEstimate > 50000) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Prioritize featured certifications
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // Then by industry recognition
      const recognitionOrder = { high: 0, medium: 1, low: 2 };
      return recognitionOrder[a.industryRecognition] - recognitionOrder[b.industryRecognition];
    });
}

// Helper function to assess readiness for certification
export function assessCertificationReadiness(
  certification: CertificationPathway,
  currentPractices: {
    hasEnergyPolicy: boolean;
    wasteD diversionRate: number;
    usesRenewableEnergy: boolean;
    hasRecyclingProgram: boolean;
    tracksSustainabilityMetrics: boolean;
    hasStakeholderEngagement: boolean;
  }
): {
  readinessScore: number;
  readyRequirements: string[];
  partialRequirements: string[];
  notMetRequirements: string[];
  estimatedTimeToReady: string;
} {
  let readyCount = 0;
  let partialCount = 0;
  let notMetCount = 0;
  
  const readyRequirements: string[] = [];
  const partialRequirements: string[] = [];
  const notMetRequirements: string[] = [];
  
  // Simple assessment logic (can be expanded)
  certification.requirements.forEach(req => {
    if (req.category === 'Waste' && currentPractices.wasteDiversionRate >= 60) {
      readyCount++;
      readyRequirements.push(req.requirement);
    } else if (req.category === 'Energy' && currentPractices.usesRenewableEnergy) {
      readyCount++;
      readyRequirements.push(req.requirement);
    } else if (req.category === 'Waste' && currentPractices.hasRecyclingProgram) {
      partialCount++;
      partialRequirements.push(req.requirement);
    } else {
      notMetCount++;
      notMetRequirements.push(req.requirement);
    }
  });
  
  const totalRequirements = certification.requirements.length;
  const readinessScore = Math.round(((readyCount + partialCount * 0.5) / totalRequirements) * 100);
  
  let estimatedTimeToReady: string;
  if (readinessScore >= 80) {
    estimatedTimeToReady = '1-2 months';
  } else if (readinessScore >= 60) {
    estimatedTimeToReady = '3-4 months';
  } else if (readinessScore >= 40) {
    estimatedTimeToReady = '5-8 months';
  } else {
    estimatedTimeToReady = '9-12 months';
  }
  
  return {
    readinessScore,
    readyRequirements,
    partialRequirements,
    notMetRequirements,
    estimatedTimeToReady
  };
}