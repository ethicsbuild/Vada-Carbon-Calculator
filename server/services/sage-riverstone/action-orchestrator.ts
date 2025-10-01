/**
 * Action Orchestrator Service
 *
 * Connects reduction recommendations to practical implementation
 * Drafts communications for vendors and venues
 * Generates checklists and action plans
 * Provides implementation support and tracking
 */

import { ReductionOpportunity } from "./reduction-advisor";
import { SupplierEntity } from "./supplier-coordinator";
import { LanguageTier } from "./persona";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: "communication" | "procurement" | "logistics" | "planning";
  dueBy: "before_planning" | "during_planning" | "before_event" | "during_event" | "after_event";
  assignedTo?: string;
  status: "not_started" | "in_progress" | "completed" | "blocked";
  relatedOpportunity?: string; // ReductionOpportunity title
  dependencies?: string[]; // Other action IDs
  resources?: string[];
  completedAt?: Date;
}

export interface DraftCommunication {
  id: string;
  recipient: string; // Supplier name or role
  recipientRole?: string;
  subject: string;
  body: string;
  purpose: "data_request" | "reduction_inquiry" | "contract_modification" | "collaboration";
  relatedOpportunity: string;
  urgency: "low" | "medium" | "high";
  template: string;
}

export interface ActionPlan {
  opportunityTitle: string;
  targetSavings: number;
  steps: ActionItem[];
  communications: DraftCommunication[];
  checklist: string[];
  estimatedTimeToImplement: string;
  keySta keholders: string[];
}

export interface ImplementationChecklist {
  category: string;
  items: ChecklistItem[];
  completionPercentage: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
  completedAt?: Date;
}

export class ActionOrchestratorService {
  /**
   * Generate actionable plan for a reduction opportunity
   */
  generateActionPlan(
    opportunity: ReductionOpportunity,
    suppliers: SupplierEntity[],
    eventContext: Record<string, any>
  ): ActionPlan {
    const steps = this.generateActionSteps(opportunity, suppliers, eventContext);
    const communications = this.generateCommunications(opportunity, suppliers);
    const checklist = this.generateChecklist(opportunity);
    const stakeholders = this.identifyStakeholders(opportunity, suppliers);

    return {
      opportunityTitle: opportunity.title,
      targetSavings: opportunity.potentialSavings,
      steps,
      communications,
      checklist,
      estimatedTimeToImplement: this.estimateImplementationTime(opportunity),
      keyStakeholders: stakeholders,
    };
  }

  /**
   * Generate specific action steps
   */
  private generateActionSteps(
    opportunity: ReductionOpportunity,
    suppliers: SupplierEntity[],
    eventContext: Record<string, any>
  ): ActionItem[] {
    const steps: ActionItem[] = [];

    opportunity.implementation.forEach((impl, index) => {
      steps.push({
        id: `${opportunity.category}_${index}`,
        title: impl,
        description: impl,
        category: this.categorizeAction(impl),
        dueBy: this.determineDueDate(opportunity.timeframe, index),
        status: "not_started",
        relatedOpportunity: opportunity.title,
      });
    });

    return steps;
  }

  /**
   * Generate draft communications for vendors
   */
  private generateCommunications(
    opportunity: ReductionOpportunity,
    suppliers: SupplierEntity[]
  ): DraftCommunication[] {
    const communications: DraftCommunication[] = [];

    // Match suppliers to opportunity
    const relevantSuppliers = suppliers.filter(s =>
      opportunity.vendors?.includes(s.name) ||
      this.isSupplierRelevant(s.role, opportunity.category)
    );

    for (const supplier of relevantSuppliers) {
      const draft = this.draftVendorCommunication(opportunity, supplier);
      if (draft) {
        communications.push(draft);
      }
    }

    return communications;
  }

  /**
   * Draft vendor-specific communication
   */
  private draftVendorCommunication(
    opportunity: ReductionOpportunity,
    supplier: SupplierEntity
  ): DraftCommunication | null {
    let template = "";
    let subject = "";
    let purpose: DraftCommunication["purpose"] = "reduction_inquiry";

    // Energy/Power opportunities
    if (opportunity.category === "energy" && supplier.role === "venue") {
      if (opportunity.title.includes("grid power")) {
        subject = "Grid Power Capacity Question";
        template = `Hi ${supplier.name},

We're looking into using the venue's grid power instead of bringing generators for our event. This would significantly reduce our carbon footprint.

Could you help with a few questions:
- What's the available power capacity at the venue?
- Where are the main power connection points?
- What's the process for arranging additional power if needed?
- Are there any fees or requirements we should know about?

Looking forward to working with you on making this event more sustainable!`;
      } else if (opportunity.title.includes("renewable")) {
        subject = "Renewable Energy Options";
        template = `Hi ${supplier.name},

We're committed to powering our event with renewable energy where possible. Does your venue offer any of these options:
- On-site solar or wind generation
- Renewable energy from your grid provider
- Renewable Energy Certificate (REC) purchasing

We'd love to explore what's available and how we can work together on this.`;
      }
    }

    // Transportation opportunities
    if (opportunity.category === "transportation") {
      if (opportunity.title.includes("public transit")) {
        subject = "Partnership on Attendee Transportation";
        template = `Hi there,

We're working to reduce the carbon impact of attendee travel for our event at ${supplier.name}. We'd like to explore:

- Promoting public transit connections to your venue
- Potential partnership with local transit authority
- Setting up shuttle services from major transit hubs
- Preferred parking for carpoolers

Do you have experience with other events on this? Would love to collaborate.`;
      } else if (opportunity.title.includes("freight")) {
        subject = "Coordinating Equipment Freight";
        template = `Hi ${supplier.name},

We're looking to optimize freight and reduce the number of trucks needed for the event. Could we:
- Coordinate delivery timing with other vendors
- Share freight space where possible
- Use your most efficient shipping methods

Let's discuss how we can make this work for everyone.`;
      }
    }

    // Food opportunities
    if (opportunity.category === "food" && supplier.role === "caterer") {
      if (opportunity.title.includes("local")) {
        subject = "Local Ingredient Sourcing";
        template = `Hi ${supplier.name},

We're prioritizing local sourcing for our event catering to reduce transportation emissions and support regional producers.

Can you provide a menu featuring ingredients sourced within 100 miles? We'd love to highlight this in our event sustainability messaging.

What percentage of ingredients could be local, and would this affect pricing?`;
      } else if (opportunity.title.includes("plant-based")) {
        subject = "Plant-Based Menu Options";
        template = `Hi ${supplier.name},

We want to offer appealing plant-based options as our default menu, with meat available as an opt-in choice.

Could you create a menu with:
- Substantial vegan and vegetarian entrees (not just salads)
- Plant-based as the default/featured option
- Meat available for those who request it

This could cut our food-related emissions by 40%. Let's make it delicious!`;
      } else if (opportunity.title.includes("compostable")) {
        subject = "Compostable Serviceware Request";
        template = `Hi ${supplier.name},

We're setting up composting at the event and need fully compostable serviceware:
- Plates, bowls, cups
- Utensils
- Food packaging

No plastic or "compostable plastic" - we need materials that will actually break down in commercial composting.

Can you provide this, and what's the cost compared to standard disposables?`;
      }
    }

    // Waste opportunities
    if (opportunity.category === "waste" && supplier.role === "venue") {
      if (opportunity.title.includes("recycling")) {
        subject = "Enhanced Recycling Program";
        template = `Hi ${supplier.name},

We want to implement a comprehensive recycling program for the event. Can the venue support:
- Recycling bins paired with every trash receptacle
- Clear, visual signage for sorting
- Separate collection of recyclables
- Reporting on diversion rate (% recycled vs landfilled)

Happy to work together on setup and monitoring. What do you usually provide?`;
      } else if (opportunity.title.includes("compost")) {
        subject = "Food Waste Composting Services";
        template = `Hi ${supplier.name},

We'd like to compost food waste and compostable serviceware from the event. Does the venue:
- Have existing composting services
- Allow us to arrange our own composting pickup
- Have space for compost collection bins

If the venue doesn't currently compost, would you be open to us setting it up for this event?`;
      }
    }

    // Materials opportunities
    if (opportunity.category === "materials" && supplier.role === "staging") {
      if (opportunity.title.includes("rent")) {
        subject = "Equipment Rental vs Purchase";
        template = `Hi ${supplier.name},

We're focused on reducing material waste and want to rent staging/equipment rather than buying new where possible.

What do you have available for rent that would work for our event? We're particularly interested in:
- Standard truss and staging
- Reusable equipment that you maintain
- Options that avoid custom fabrication

Let's discuss what makes sense for our setup.`;
      } else if (opportunity.title.includes("materials")) {
        subject = "Sustainable Material Choices";
        template = `Hi ${supplier.name},

For our event materials, we're looking for lower-carbon options:
- Fabric banners instead of vinyl
- FSC-certified wood for structures
- Avoiding single-use custom items

What sustainable options can you provide? We're happy to work within your available inventory.`;
      }
    }

    if (!template) {
      return null;
    }

    return {
      id: `comm_${supplier.id}_${Date.now()}`,
      recipient: supplier.name,
      recipientRole: supplier.role,
      subject,
      body: template,
      purpose,
      relatedOpportunity: opportunity.title,
      urgency: opportunity.difficulty === "easy" ? "high" : "medium",
      template,
    };
  }

  /**
   * Generate implementation checklist
   */
  private generateChecklist(opportunity: ReductionOpportunity): string[] {
    const checklist: string[] = [];

    // Add implementation steps as checklist items
    opportunity.implementation.forEach(step => {
      checklist.push(step);
    });

    // Add standard follow-up items
    checklist.push("Document baseline (current emissions)");
    checklist.push("Get quotes/responses from vendors");
    checklist.push("Update contracts or agreements");
    checklist.push("Verify implementation");
    checklist.push("Measure results");

    return checklist;
  }

  /**
   * Draft specific communication types
   */
  draftVenueEnergyAudit(venueName: string, eventName: string): DraftCommunication {
    return {
      id: `venue_energy_${Date.now()}`,
      recipient: venueName,
      recipientRole: "venue",
      subject: "Energy Audit for Sustainable Event Planning",
      body: `Hi ${venueName} team,

We're planning ${eventName} and want to understand the venue's energy systems to minimize our carbon footprint.

Could you provide or help us gather:
- Available grid power capacity and connection points
- Current energy provider and renewable energy options
- HVAC system specifications and estimated usage
- Any existing sustainability initiatives or certifications
- Historical energy usage data for similar events

This information will help us make informed decisions about power sources, equipment needs, and overall sustainability strategy.

Would it be possible to schedule a brief walkthrough to discuss these details?

Thank you!`,
      purpose: "data_request",
      relatedOpportunity: "Venue energy optimization",
      urgency: "high",
      template: "venue_energy_audit",
    };
  }

  draftCatererPlantBasedMenu(catererName: string, attendeeCount: number): DraftCommunication {
    return {
      id: `caterer_menu_${Date.now()}`,
      recipient: catererName,
      recipientRole: "caterer",
      subject: "Plant-Based Menu Development",
      body: `Hi ${catererName},

We're catering for approximately ${attendeeCount} people and want to feature plant-based options as our primary menu, with meat available for those who specifically request it.

Our goals:
- Delicious, substantial vegan and vegetarian entrees
- Plant-based as the default/featured choice
- Meat available as an opt-in alternative
- Local ingredients where possible

This approach typically reduces food-related emissions by 40% compared to traditional catering.

Could you create a sample menu for our event? We'd love to highlight this sustainable choice in our event promotion.

What's your experience with plant-forward events, and how does pricing compare?

Looking forward to collaborating!`,
      purpose: "reduction_inquiry",
      relatedOpportunity: "Plant-based catering",
      urgency: "medium",
      template: "caterer_plant_based",
    };
  }

  draftTransportationPartnership(transitAuthority: string, eventName: string): DraftCommunication {
    return {
      id: `transit_partnership_${Date.now()}`,
      recipient: transitAuthority,
      recipientRole: "transportation",
      subject: `Partnership Opportunity: ${eventName} Sustainable Transportation`,
      body: `Hi ${transitAuthority} team,

We're organizing ${eventName} and want to make public transit the easiest choice for attendees, reducing car trips and parking demand.

We'd like to explore:
- Increased service frequency on event days
- Co-promotion in our marketing materials
- Discounted or bundled transit passes with tickets
- Wayfinding and connection information
- Post-event service extensions

Previous events have seen 25% of attendees choose public transit when well-promoted, significantly reducing carbon emissions and traffic congestion.

Is this something your team would be interested in discussing?

Best regards`,
      purpose: "collaboration",
      relatedOpportunity: "Public transit promotion",
      urgency: "medium",
      template: "transit_partnership",
    };
  }

  /**
   * Helper: Categorize action by type
   */
  private categorizeAction(action: string): ActionItem["category"] {
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes("contact") || lowerAction.includes("ask") || lowerAction.includes("communicate")) {
      return "communication";
    }
    if (lowerAction.includes("rent") || lowerAction.includes("purchase") || lowerAction.includes("arrange")) {
      return "procurement";
    }
    if (lowerAction.includes("coordinate") || lowerAction.includes("schedule") || lowerAction.includes("plan")) {
      return "logistics";
    }

    return "planning";
  }

  /**
   * Helper: Determine due date based on timeframe
   */
  private determineDueDate(
    timeframe: ReductionOpportunity["timeframe"],
    stepIndex: number
  ): ActionItem["dueBy"] {
    if (timeframe === "immediate") {
      return stepIndex === 0 ? "during_planning" : "before_event";
    }
    if (timeframe === "short_term") {
      return "before_event";
    }

    return "during_planning";
  }

  /**
   * Helper: Check if supplier is relevant to opportunity category
   */
  private isSupplierRelevant(supplierRole: string, category: string): boolean {
    const relevance: Record<string, string[]> = {
      energy: ["venue", "av_company"],
      transportation: ["venue", "transportation"],
      food: ["caterer"],
      waste: ["venue", "caterer"],
      materials: ["staging", "av_company"],
    };

    return relevance[category]?.includes(supplierRole) || false;
  }

  /**
   * Helper: Identify key stakeholders
   */
  private identifyStakeholders(
    opportunity: ReductionOpportunity,
    suppliers: SupplierEntity[]
  ): string[] {
    const stakeholders: string[] = ["Event Producer"];

    if (opportunity.vendors && opportunity.vendors.length > 0) {
      stakeholders.push(...opportunity.vendors);
    }

    // Add relevant supplier roles
    const relevantSuppliers = suppliers.filter(s =>
      this.isSupplierRelevant(s.role, opportunity.category)
    );

    relevantSuppliers.forEach(s => {
      if (!stakeholders.includes(s.name)) {
        stakeholders.push(s.name);
      }
    });

    return stakeholders;
  }

  /**
   * Helper: Estimate implementation time
   */
  private estimateImplementationTime(opportunity: ReductionOpportunity): string {
    if (opportunity.timeframe === "immediate" && opportunity.difficulty === "easy") {
      return "1-2 weeks";
    }
    if (opportunity.timeframe === "immediate") {
      return "2-4 weeks";
    }
    if (opportunity.timeframe === "short_term") {
      return "1-2 months";
    }

    return "3+ months (plan for future events)";
  }

  /**
   * Generate master implementation checklist
   */
  generateMasterChecklist(
    opportunities: ReductionOpportunity[],
    suppliers: SupplierEntity[]
  ): ImplementationChecklist[] {
    const checklists: ImplementationChecklist[] = [];

    const categories = ["energy", "transportation", "food", "waste", "materials"];

    for (const category of categories) {
      const categoryOpps = opportunities.filter(opp => opp.category === category);

      if (categoryOpps.length > 0) {
        const items: ChecklistItem[] = [];

        categoryOpps.forEach(opp => {
          opp.implementation.forEach((impl, index) => {
            items.push({
              id: `${category}_${opp.title}_${index}`,
              text: `${opp.title}: ${impl}`,
              completed: false,
            });
          });
        });

        checklists.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          items,
          completionPercentage: 0,
        });
      }
    }

    return checklists;
  }

  /**
   * Format action plan for Sage response
   */
  formatActionPlan(plan: ActionPlan, tier: LanguageTier): string {
    if (tier === "tier3_technical") {
      return `Action Plan: ${plan.opportunityTitle}
Target savings: ${plan.targetSavings.toFixed(2)} tCO2e
Implementation time: ${plan.estimatedTimeToImplement}
Stakeholders: ${plan.keyStakeholders.join(", ")}

Steps: ${plan.steps.length}
Communications needed: ${plan.communications.length}`;
    }

    if (tier === "tier2_practical") {
      return `Here's your action plan for "${plan.opportunityTitle}":

Timeline: ${plan.estimatedTimeToImplement}
Key people: ${plan.keyStakeholders.join(", ")}

${plan.steps.length} steps to implement
${plan.communications.length} vendor conversations to have

Want me to show you the specific steps or draft those vendor messages?`;
    }

    // Tier 1 - Campfire
    return `Alright, let's make "${plan.opportunityTitle}" happen!

This should take about ${plan.estimatedTimeToImplement} to pull together.

You'll need to work with: ${plan.keyStakeholders.join(", ")}

I've got ${plan.communications.length} messages ready to send to your vendors, and a ${plan.checklist.length}-item checklist to keep everything on track.

Want to see the vendor messages first, or dive into the step-by-step plan?`;
  }
}

export const actionOrchestratorService = new ActionOrchestratorService();
