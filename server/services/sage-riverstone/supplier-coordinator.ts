/**
 * Supplier Intelligence & Coordination Service
 *
 * Automatically identifies suppliers from event descriptions
 * Generates data request messages for suppliers
 * Tracks responses and translates supplier data into system format
 */

import OpenAI from "openai";
import { SageRiverstonePersona, LanguageTier } from "./persona";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface SupplierEntity {
  id?: string;
  name: string;
  role: "caterer" | "venue" | "av_company" | "staging" | "transportation" | "accommodation" | "other";
  contactInfo?: string;
  identifiedFrom: "user_mentioned" | "ai_inferred" | "database_lookup";
  confidence: number;
  eventId?: number;
}

export interface SupplierDataRequest {
  id?: string;
  supplierId: string;
  supplierName: string;
  eventName: string;
  producerName: string;
  requestType: string[];
  draftMessage: string;
  status: "draft" | "pending_approval" | "sent" | "responded" | "integrated" | "declined";
  sentAt?: Date;
  responseReceived?: Date;
  responseData?: Record<string, any>;
  trackingLink?: string;
}

export interface SupplierResponse {
  supplierId: string;
  requestId: string;
  rawResponse: string;
  extractedData: Record<string, any>;
  emissions?: number;
  confidence: number;
}

export interface DataNeed {
  category: "energy" | "transportation" | "food" | "materials" | "waste";
  specificQuestions: string[];
  supplierRole: string;
  priority: "critical" | "important" | "nice_to_have";
}

export class SupplierCoordinatorService {
  /**
   * Identify suppliers from event description and conversation history
   */
  async identifySuppliers(
    eventDescription: string,
    conversationHistory: string[],
    eventContext: Record<string, any>
  ): Promise<SupplierEntity[]> {
    try {
      const fullContext = conversationHistory.join("\n") + "\n" + eventDescription;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert at identifying suppliers and vendors from event production conversations.

Extract all mentioned or implied suppliers/vendors:
- Caterers (food service, catering companies, restaurants)
- Venues (arenas, theaters, hotels, outdoor spaces, conference centers)
- A/V companies (sound, lighting, video, production)
- Staging companies (truss, risers, platforms)
- Transportation (freight, tour buses, shuttle services)
- Accommodation (hotels for crew/talent)

Look for:
1. Explicit mentions: "working with Joe's Catering", "at the Convention Center"
2. Implied suppliers: "catering 500 people" → catering supplier exists
3. Role-based inference: "I'm the venue operator" → user IS the venue

Return JSON array of suppliers with:
{
  "name": "Company name or 'Unknown [Role]' if not mentioned",
  "role": "caterer|venue|av_company|staging|transportation|accommodation|other",
  "contactInfo": "if mentioned (email, phone)",
  "identifiedFrom": "user_mentioned|ai_inferred|database_lookup",
  "confidence": 0-1
}`
          },
          {
            role: "user",
            content: fullContext
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.suppliers || [];
    } catch (error) {
      console.error("Error identifying suppliers:", error);
      return [];
    }
  }

  /**
   * Determine what data is needed from each supplier
   */
  identifyDataNeeds(
    supplier: SupplierEntity,
    eventContext: Record<string, any>
  ): DataNeed[] {
    const needs: DataNeed[] = [];

    switch (supplier.role) {
      case "caterer":
        needs.push({
          category: "food",
          specificQuestions: [
            "How many meals will you be providing?",
            "What's the menu breakdown? (beef, chicken, fish, vegetarian, vegan)",
            "Are ingredients sourced locally (within 100 miles)?",
            "Will beverages be served? (bottled water, beer, wine)",
            "What's your waste management plan? (composting, recycling)"
          ],
          supplierRole: "caterer",
          priority: "critical"
        });
        needs.push({
          category: "transportation",
          specificQuestions: [
            "How far will food/supplies be transported to the event?",
            "What type of vehicles will you use for delivery?"
          ],
          supplierRole: "caterer",
          priority: "important"
        });
        break;

      case "venue":
        needs.push({
          category: "energy",
          specificQuestions: [
            "Will power come from the venue's grid connection or generators?",
            "If grid: what's your electricity provider and approximate kWh usage for similar events?",
            "If generators: how many, what size (kW), estimated runtime hours?",
            "Do you have renewable energy sources on-site? (solar, wind)",
            "What's your HVAC setup? (heating/cooling systems)"
          ],
          supplierRole: "venue",
          priority: "critical"
        });
        needs.push({
          category: "waste",
          specificQuestions: [
            "What waste services do you provide? (recycling, composting, landfill)",
            "Typical waste volume for similar events?"
          ],
          supplierRole: "venue",
          priority: "important"
        });
        break;

      case "av_company":
        needs.push({
          category: "energy",
          specificQuestions: [
            "What's the total power draw for your equipment? (kW or amps)",
            "How many hours will equipment be running per day?",
            "Are you bringing generators or using venue power?"
          ],
          supplierRole: "av_company",
          priority: "important"
        });
        needs.push({
          category: "transportation",
          specificQuestions: [
            "How far are you traveling to the event?",
            "How many trucks/vans will you need for equipment?"
          ],
          supplierRole: "av_company",
          priority: "important"
        });
        break;

      case "staging":
        needs.push({
          category: "materials",
          specificQuestions: [
            "What materials will you be using? (steel truss, aluminum, wood staging)",
            "Approximate weight or quantity of materials?",
            "Is this rented equipment or newly fabricated?"
          ],
          supplierRole: "staging",
          priority: "nice_to_have"
        });
        needs.push({
          category: "transportation",
          specificQuestions: [
            "How many trucks needed for staging equipment?",
            "Distance traveled to the event?"
          ],
          supplierRole: "staging",
          priority: "important"
        });
        break;

      case "transportation":
        needs.push({
          category: "transportation",
          specificQuestions: [
            "How many vehicles will you be providing?",
            "What type of vehicles? (buses, vans, trucks)",
            "Total estimated mileage for the event?",
            "Fuel type? (diesel, gasoline, electric, hybrid)"
          ],
          supplierRole: "transportation",
          priority: "critical"
        });
        break;

      case "accommodation":
        needs.push({
          category: "energy",
          specificQuestions: [
            "How many room nights will be booked?",
            "Does your hotel have sustainability certifications? (LEED, Green Key)",
            "What's your energy source? (grid, renewable)"
          ],
          supplierRole: "accommodation",
          priority: "nice_to_have"
        });
        break;
    }

    return needs;
  }

  /**
   * Generate supplier data request message
   */
  generateSupplierRequest(
    supplier: SupplierEntity,
    dataNeeds: DataNeed[],
    eventName: string,
    producerName: string,
    languageTier: LanguageTier = "tier2_practical"
  ): SupplierDataRequest {
    const requestTypes = dataNeeds.map(need => need.category);

    // Build question list
    const allQuestions = dataNeeds.flatMap(need => need.specificQuestions);
    const numberedQuestions = allQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join("\n");

    // Generate message based on tier
    let message = "";

    if (languageTier === "tier1_campfire" || languageTier === "tier2_practical") {
      message = `Hi ${supplier.name !== `Unknown ${supplier.role}` ? supplier.name : 'there'},

${producerName} is tracking the environmental footprint for ${eventName}, and we'd love your help gathering some information about your services.

This is part of our commitment to understanding and reducing the event's carbon impact. The data you provide helps us:
- Calculate the event's total environmental footprint
- Identify opportunities to make future events more sustainable
- Report on sustainability efforts to stakeholders

We need a few details about your ${supplier.role.replace('_', ' ')} services:

${numberedQuestions}

Please reply to this message with answers, or use the tracking link below to submit your responses:
[TRACKING_LINK]

Thanks for being part of making this event more sustainable!

Best,
${producerName}
${eventName} Production Team`;
    } else {
      // Tier 3 - Technical
      message = `Subject: Carbon Footprint Data Request - ${eventName}

Dear ${supplier.name},

${producerName} is conducting a GHG Protocol-compliant carbon footprint assessment for ${eventName}. We require emission-relevant data from ${supplier.role.replace('_', ' ')} operations.

Required information:

${numberedQuestions}

Please provide responses via the tracking portal: [TRACKING_LINK]
Or reply directly to this email with the requested data.

Data will be used for Scope 1, 2, and 3 emissions calculation per GHG Protocol Corporate Standard.

Thank you for your cooperation.

${producerName}
Sustainability Coordinator
${eventName}`;
    }

    return {
      supplierId: supplier.id || `temp_${Date.now()}`,
      supplierName: supplier.name,
      eventName,
      producerName,
      requestType: requestTypes,
      draftMessage: message,
      status: "draft",
      trackingLink: `[TRACKING_LINK_PLACEHOLDER_${supplier.id}]`
    };
  }

  /**
   * Auto-generate requests for all identified suppliers
   */
  async generateAllSupplierRequests(
    suppliers: SupplierEntity[],
    eventName: string,
    producerName: string,
    eventContext: Record<string, any>,
    languageTier: LanguageTier = "tier2_practical"
  ): Promise<SupplierDataRequest[]> {
    const requests: SupplierDataRequest[] = [];

    for (const supplier of suppliers) {
      const dataNeeds = this.identifyDataNeeds(supplier, eventContext);

      if (dataNeeds.length > 0) {
        const request = this.generateSupplierRequest(
          supplier,
          dataNeeds,
          eventName,
          producerName,
          languageTier
        );
        requests.push(request);
      }
    }

    return requests;
  }

  /**
   * Parse supplier response and extract data
   */
  async parseSupplierResponse(
    requestId: string,
    rawResponse: string,
    originalRequest: SupplierDataRequest
  ): Promise<SupplierResponse> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting structured data from supplier responses about event sustainability.

Original request context:
${JSON.stringify(originalRequest)}

Extract all relevant data points from the supplier's response:
- Quantities (meals, kWh, gallons, miles, etc.)
- Materials (types, amounts)
- Sourcing information (local vs shipped)
- Sustainability practices (recycling, renewable energy)

Return JSON with:
{
  "extractedData": {structured data extracted},
  "confidence": 0-1,
  "missingData": ["list of questions not answered"],
  "additionalInfo": "any extra relevant details"
}`
          },
          {
            role: "user",
            content: rawResponse
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");

      return {
        supplierId: originalRequest.supplierId,
        requestId,
        rawResponse,
        extractedData: result.extractedData || {},
        confidence: result.confidence || 0.5
      };
    } catch (error) {
      console.error("Error parsing supplier response:", error);
      return {
        supplierId: originalRequest.supplierId,
        requestId,
        rawResponse,
        extractedData: {},
        confidence: 0
      };
    }
  }

  /**
   * Format supplier coordination status for Sage response
   */
  formatSupplierStatus(
    suppliers: SupplierEntity[],
    requests: SupplierDataRequest[],
    languageTier: LanguageTier
  ): string {
    if (suppliers.length === 0) {
      return "";
    }

    if (languageTier === "tier1_campfire") {
      const supplierList = suppliers
        .map(s => s.name !== `Unknown ${s.role}` ? s.name : `your ${s.role.replace('_', ' ')}`)
        .join(", ");

      return `I've identified some key partners for your event: ${supplierList}.

I can help you reach out to them to gather the sustainability details we need - things like energy usage, transportation distances, and sourcing information. Want me to draft those messages for you?`;
    }

    if (languageTier === "tier2_practical") {
      const statusSummary = requests.map(req => {
        const status = req.status === "draft" ? "ready to send" :
                      req.status === "sent" ? "waiting for response" :
                      req.status === "responded" ? "response received" :
                      req.status;
        return `- ${req.supplierName}: ${status}`;
      }).join("\n");

      return `Supplier coordination status:

${statusSummary}

${requests.filter(r => r.status === "draft").length > 0 ? "I've drafted data requests that you can review and send." : ""}`;
    }

    // Tier 3 - Technical
    const byStatus = {
      draft: requests.filter(r => r.status === "draft").length,
      sent: requests.filter(r => r.status === "sent").length,
      responded: requests.filter(r => r.status === "responded").length,
      integrated: requests.filter(r => r.status === "integrated").length
    };

    return `Supplier Data Collection Status:
Draft: ${byStatus.draft}
Sent: ${byStatus.sent}
Responded: ${byStatus.responded}
Integrated: ${byStatus.integrated}

Total suppliers identified: ${suppliers.length}`;
  }

  /**
   * Get completion percentage for supplier data collection
   */
  getSupplierDataCompleteness(requests: SupplierDataRequest[]): number {
    if (requests.length === 0) return 100;

    const responded = requests.filter(r =>
      r.status === "responded" || r.status === "integrated"
    ).length;

    return Math.round((responded / requests.length) * 100);
  }

  /**
   * Suggest next steps for supplier coordination
   */
  suggestNextSteps(
    suppliers: SupplierEntity[],
    requests: SupplierDataRequest[]
  ): string[] {
    const suggestions: string[] = [];

    const draftRequests = requests.filter(r => r.status === "draft");
    const sentRequests = requests.filter(r => r.status === "sent");
    const respondedRequests = requests.filter(r => r.status === "responded");

    if (suppliers.length === 0) {
      suggestions.push("Mention suppliers or vendors you're working with");
    }

    if (draftRequests.length > 0) {
      suggestions.push(`Review and send ${draftRequests.length} supplier data requests`);
    }

    if (sentRequests.length > 0) {
      suggestions.push(`Follow up with ${sentRequests.length} suppliers awaiting response`);
    }

    if (respondedRequests.length > 0) {
      suggestions.push(`Process ${respondedRequests.length} supplier responses`);
    }

    if (requests.length > 0 && requests.every(r => r.status === "integrated")) {
      suggestions.push("Supplier data collection complete");
    }

    return suggestions;
  }
}

export const supplierCoordinatorService = new SupplierCoordinatorService();
