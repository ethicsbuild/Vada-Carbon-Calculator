import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { carbonCalculatorService } from "./services/carbonCalculator";
import { aiCoPilotService } from "./services/aiCopilot";
import { reportGeneratorService } from "./services/reportGenerator";
import {
  insertOrganizationSchema,
  insertCarbonCalculationSchema,
  insertSavedEventSchema,
  insertContactSubmissionSchema,
  eventCalculationSchema,
  contactFormSchema
} from "@shared/schema";
import { handleChatWebSocket } from "./routes/chat";
import { z } from "zod";

// Rate limiting configurations
const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const eventCalculationRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 calculations per minute per IP
  message: { error: 'Too many calculation requests. Please wait a moment before trying again.' },
});

const contactFormRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 contact form submissions per 15 minutes
  message: { error: 'Too many contact form submissions. Please try again later.' },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply general rate limiting to all API routes
  app.use('/api/', strictRateLimit);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Organization routes
  app.get("/api/organizations/:id", async (req, res) => {
    try {
      const orgId = parseInt(req.params.id);
      const organization = await storage.getOrganization(orgId);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  app.post("/api/organizations", async (req, res) => {
    try {
      const validatedData = insertOrganizationSchema.parse(req.body);
      const organization = await storage.createOrganization(validatedData);
      res.status(201).json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid organization data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create organization" });
    }
  });

  app.get("/api/organizations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const organizations = await storage.getOrganizationsByOwner(userId);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user organizations" });
    }
  });

  // Carbon calculation routes
  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const calcId = parseInt(req.params.id);
      const calculation = await storage.getCarbonCalculation(calcId);
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }
      res.json(calculation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calculation" });
    }
  });

  app.get("/api/calculations/organization/:orgId", async (req, res) => {
    try {
      const orgId = parseInt(req.params.orgId);
      const calculations = await storage.getCarbonCalculationsByOrganization(orgId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch organization calculations" });
    }
  });

  app.get("/api/calculations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const calculations = await storage.getCarbonCalculationsByUser(userId);
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user calculations" });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    try {
      const validatedData = insertCarbonCalculationSchema.parse(req.body);
      const calculation = await storage.createCarbonCalculation(validatedData);
      res.status(201).json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid calculation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create calculation" });
    }
  });

  // Carbon calculation engine routes
  app.post("/api/calculate/estimate", async (req, res) => {
    try {
      const { organizationType, organizationSize, industry, annualRevenue } = req.body;
      
      if (!organizationType || !organizationSize || !industry) {
        return res.status(400).json({ 
          message: "Missing required fields: organizationType, organizationSize, industry" 
        });
      }

      const result = await carbonCalculatorService.estimateEmissions(
        organizationType,
        organizationSize,
        industry,
        annualRevenue
      );
      
      res.json(result);
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ message: "Failed to calculate emissions estimate" });
    }
  });

  app.post("/api/calculate/detailed", async (req, res) => {
    try {
      const { scope1Data, scope2Data, scope3Data, organizationSize, industry } = req.body;
      
      if (!organizationSize || !industry) {
        return res.status(400).json({ 
          message: "Missing required fields: organizationSize, industry" 
        });
      }

      const result = await carbonCalculatorService.calculateEmissions(
        scope1Data || {},
        scope2Data || {},
        scope3Data || {},
        organizationSize,
        industry
      );
      
      res.json(result);
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ message: "Failed to calculate detailed emissions" });
    }
  });

  app.post("/api/calculate/save", async (req, res) => {
    try {
      const { userId, organizationId, calculationData, result } = req.body;

      if (!userId || !organizationId || !calculationData || !result) {
        return res.status(400).json({
          message: "Missing required fields: userId, organizationId, calculationData, result"
        });
      }

      const savedCalculation = await carbonCalculatorService.saveCalculation(
        userId,
        organizationId,
        calculationData,
        result
      );

      res.status(201).json(savedCalculation);
    } catch (error) {
      console.error("Save calculation error:", error);
      res.status(500).json({ message: "Failed to save calculation" });
    }
  });

  // Event-specific carbon calculation
  app.post("/api/calculate-event", eventCalculationRateLimit, async (req, res) => {
    try {
      // Validate input with strict schema
      const validatedData = eventCalculationSchema.parse(req.body);

      console.log('📊 Calculating emissions for event:', {
        type: validatedData.eventType,
        attendance: validatedData.attendance,
        duration: validatedData.duration
      });

      const calculation = await carbonCalculatorService.calculateEventEmissions(validatedData as any);

      console.log('✅ Calculation complete:', {
        total: calculation.total.toFixed(3),
        perAttendee: calculation.emissionsPerAttendee.toFixed(4),
        performance: calculation.benchmarkComparison.performance
      });

      res.json(calculation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid event data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      console.error('❌ Calculation error:', error);
      res.status(500).json({ error: 'Failed to calculate emissions' });
    }
  });

  // AI Co-Pilot routes
  app.post("/api/copilot/start", async (req, res) => {
    try {
      const { userId, organizationType, organizationSize, industry } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "Missing required field: userId" });
      }

      const sessionId = `session_${userId}_${Date.now()}`;
      const conversation = await aiCoPilotService.startConversation(
        userId,
        sessionId,
        organizationType,
        organizationSize,
        industry
      );
      
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Co-pilot start error:", error);
      res.status(500).json({ message: "Failed to start AI co-pilot session" });
    }
  });

  app.post("/api/copilot/message", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ message: "Missing required fields: sessionId, message" });
      }

      const response = await aiCoPilotService.continueConversation(sessionId, message);
      res.json(response);
    } catch (error) {
      console.error("Co-pilot message error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  app.get("/api/copilot/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await aiCoPilotService.getConversationHistory(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation history" });
    }
  });

  app.post("/api/copilot/end", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Missing required field: sessionId" });
      }

      await aiCoPilotService.endConversation(sessionId);
      res.json({ message: "Conversation ended successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to end conversation" });
    }
  });

  // Google Routes API integration routes
  app.post("/api/routes/search-locations", async (req, res) => {
    try {
      const { query, region } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const { googleRoutesService } = await import("./services/googleRoutesService");
      const locations = await googleRoutesService.searchLocations(query, region);
      
      res.json(locations);
    } catch (error) {
      console.error("Location search error:", error);
      res.status(500).json({ message: "Failed to search locations" });
    }
  });

  app.post("/api/routes/calculate-route", async (req, res) => {
    try {
      const { origin, destination, options } = req.body;
      
      if (!origin || !destination) {
        return res.status(400).json({ message: "Origin and destination are required" });
      }

      const { googleRoutesService } = await import("./services/googleRoutesService");
      const route = await googleRoutesService.calculateRoute(origin, destination, options);
      
      res.json(route);
    } catch (error) {
      console.error("Route calculation error:", error);
      res.status(500).json({ message: "Failed to calculate route" });
    }
  });

  app.post("/api/routes/calculate-travel-emissions", async (req, res) => {
    try {
      const { journeys } = req.body;
      
      if (!journeys || !Array.isArray(journeys)) {
        return res.status(400).json({ message: "Journeys array is required" });
      }

      const { googleRoutesService } = await import("./services/googleRoutesService");
      const result = await googleRoutesService.calculateTravelEmissions(journeys);
      
      res.json(result);
    } catch (error) {
      console.error("Travel emissions calculation error:", error);
      res.status(500).json({ message: "Failed to calculate travel emissions" });
    }
  });

  app.get("/api/routes/transport-modes", async (req, res) => {
    try {
      const { googleRoutesService } = await import("./services/googleRoutesService");
      const transportModes = googleRoutesService.getTransportModes();
      
      res.json(transportModes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transport modes" });
    }
  });

  app.get("/api/routes/emission-factors", async (req, res) => {
    try {
      const { googleRoutesService } = await import("./services/googleRoutesService");
      const emissionFactors = googleRoutesService.getEmissionFactors();
      
      res.json(emissionFactors);
    } catch (error) {
      res.status(500).json({ message: "Failed to get emission factors" });
    }
  });

  // Report generation routes
  app.post("/api/reports/ghg-protocol", async (req, res) => {
    try {
      const { calculationId, userId, organizationData } = req.body;
      
      if (!calculationId || !userId || !organizationData) {
        return res.status(400).json({ 
          message: "Missing required fields: calculationId, userId, organizationData" 
        });
      }

      const report = await reportGeneratorService.generateGHGProtocolReport(
        calculationId,
        userId,
        organizationData
      );
      
      res.status(201).json(report);
    } catch (error) {
      console.error("GHG Protocol report error:", error);
      res.status(500).json({ message: "Failed to generate GHG Protocol report" });
    }
  });

  app.post("/api/reports/carbon-receipt", async (req, res) => {
    try {
      const { calculationId, userId, offsetData } = req.body;
      
      if (!calculationId || !userId) {
        return res.status(400).json({ 
          message: "Missing required fields: calculationId, userId" 
        });
      }

      const report = await reportGeneratorService.generateCarbonReceipt(
        calculationId,
        userId,
        offsetData
      );
      
      res.status(201).json(report);
    } catch (error) {
      console.error("Carbon receipt error:", error);
      res.status(500).json({ message: "Failed to generate carbon receipt" });
    }
  });

  app.post("/api/reports/csv-export", async (req, res) => {
    try {
      const { calculationId, userId } = req.body;
      
      if (!calculationId || !userId) {
        return res.status(400).json({ 
          message: "Missing required fields: calculationId, userId" 
        });
      }

      const report = await reportGeneratorService.generateCSVExport(calculationId, userId);
      res.status(201).json(report);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ message: "Failed to generate CSV export" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await reportGeneratorService.getReport(reportId);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.get("/api/reports/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await reportGeneratorService.getUserReports(userId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });

  app.post("/api/reports/verify/:id", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const blockchainHash = await reportGeneratorService.verifyOnBlockchain(reportId);
      res.json({ blockchainHash, verified: true });
    } catch (error) {
      console.error("Blockchain verification error:", error);
      res.status(500).json({ message: "Failed to verify on blockchain" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Emission factors routes
  app.get("/api/emission-factors", async (req, res) => {
    try {
      const { category } = req.query;
      const factors = category
        ? await storage.getEmissionFactorsByCategory(category as string)
        : await storage.getEmissionFactors();
      res.json(factors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emission factors" });
    }
  });

  // Saved events routes
  app.post("/api/events/save", async (req, res) => {
    try {
      const eventData = req.body;

      // Check if this event already exists (same name + year for user)
      if (eventData.userId && eventData.eventName && eventData.eventYear) {
        const existingEvent = await storage.getSavedEventsByNameAndYear(
          eventData.userId,
          eventData.eventName,
          eventData.eventYear
        );

        // If exists and they want to track year-over-year, link to previous
        if (existingEvent) {
          // Update existing event instead of creating new
          const updatedEvent = await storage.updateSavedEvent(existingEvent.id, eventData);
          return res.json(updatedEvent);
        }
      }

      // Look for previous year's event for comparison
      if (eventData.userId && eventData.eventName && eventData.eventYear) {
        const previousYear = eventData.eventYear - 1;
        const previousEvent = await storage.getSavedEventsByNameAndYear(
          eventData.userId,
          eventData.eventName,
          previousYear
        );

        if (previousEvent && previousEvent.totalEmissions && eventData.totalEmissions) {
          const currentEmissions = parseFloat(eventData.totalEmissions);
          const previousEmissions = parseFloat(previousEvent.totalEmissions);
          const change = ((currentEmissions - previousEmissions) / previousEmissions) * 100;

          eventData.previousEventId = previousEvent.id;
          eventData.emissionsChange = change.toFixed(2);
        }
      }

      const validatedData = insertSavedEventSchema.parse(eventData);
      const savedEvent = await storage.createSavedEvent(validatedData);

      console.log('💾 Event saved:', {
        name: savedEvent.eventName,
        year: savedEvent.eventYear,
        total: savedEvent.totalEmissions
      });

      res.status(201).json(savedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      console.error('❌ Save event error:', error);
      res.status(500).json({ message: "Failed to save event" });
    }
  });

  app.get("/api/events/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const events = await storage.getSavedEventsByUser(userId);
      res.json(events);
    } catch (error) {
      console.error('Failed to fetch user events:', error);
      res.status(500).json({ message: "Failed to fetch user events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getSavedEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const updateData = req.body;
      const updatedEvent = await storage.updateSavedEvent(eventId, updateData);

      console.log('📝 Event updated:', {
        id: eventId,
        updates: Object.keys(updateData)
      });

      res.json(updatedEvent);
    } catch (error) {
      console.error('Failed to update event:', error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.get("/api/events/comparison/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getSavedEvent(eventId);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Get previous event if linked
      let previousEvent = null;
      if (event.previousEventId) {
        previousEvent = await storage.getSavedEvent(event.previousEventId);
      }

      // Get all events with same name for this user (historical trend)
      const userId = event.userId;
      const eventName = event.eventName;

      if (userId) {
        const allUserEvents = await storage.getSavedEventsByUser(userId);
        const historicalEvents = allUserEvents.filter(e => e.eventName === eventName);

        res.json({
          currentEvent: event,
          previousEvent,
          historicalTrend: historicalEvents.map(e => ({
            year: e.eventYear,
            totalEmissions: e.totalEmissions,
            emissionsPerAttendee: e.emissionsPerAttendee,
            performance: e.performance
          }))
        });
      } else {
        res.json({
          currentEvent: event,
          previousEvent,
          historicalTrend: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
      res.status(500).json({ message: "Failed to fetch comparison data" });
    }
  });

  // Contact form routes
  app.post("/api/contact", contactFormRateLimit, async (req, res) => {
    try {
      // Use strict contact form schema with sanitization
      const validatedData = contactFormSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);

      console.log('📧 Contact form submitted:', {
        name: submission.name,
        email: submission.email,
        id: submission.id
      });

      res.status(201).json({
        message: "Message sent successfully",
        id: submission.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid contact data",
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }
      console.error('❌ Contact form error:', error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket server for Sage chat
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/api/chat'
  });

  wss.on('connection', (ws) => {
    handleChatWebSocket(ws);
  });

  return httpServer;
}
