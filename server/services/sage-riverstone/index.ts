/**
 * Sage Riverstone Module Exports
 *
 * Core differentiation layer for VADA Carbon Calculator
 * Conversational AI-first carbon tracking with zero training requirement
 */

// Phase 1: Conversational Data Capture
export { SageRiverstonePersona, LanguageTier } from './persona';
export {
  conversationalIntakeService,
  ConversationalIntakeService,
  ExtractedEventData,
  MaterialItem,
  ExtractionResult
} from './conversational-intake';
export {
  unitTranslatorService,
  UnitTranslatorService,
  UnitConversion,
  EmissionCalculation,
  TranslationResult
} from './unit-translator';
export {
  supplierCoordinatorService,
  SupplierCoordinatorService,
  SupplierEntity,
  SupplierDataRequest,
  SupplierResponse,
  DataNeed
} from './supplier-coordinator';

// Phase 2: Intelligent Output Layer
export {
  reductionAdvisorService,
  ReductionAdvisorService,
  ReductionOpportunity,
  ReductionStrategy,
  BenchmarkComparison
} from './reduction-advisor';
export {
  actionOrchestratorService,
  ActionOrchestratorService,
  ActionItem,
  DraftCommunication,
  ActionPlan,
  ImplementationChecklist,
  ChecklistItem
} from './action-orchestrator';

// Phase 3: Attendee Engagement Layer
export {
  attendeeTrackingService,
  AttendeeTrackingService,
  AttendeeProfile,
  AttendeeChoice,
  AttendeeAchievement,
  Reward,
  LeaderboardEntry,
  EventLeaderboard,
  ProducerLeaderboard,
  EventSummary,
  TransportChoice,
  FoodChoice,
  WasteChoice
} from './attendee-tracking';

// Phase 4: Verification Layer
export {
  hederaIntegrationService,
  HederaIntegrationService,
  HederaConfig,
  BlockchainRecord,
  VerificationResult,
  ChainOfCustodyEntry,
  CarbonCertificate
} from './hedera-integration';
export {
  verificationLoggerService,
  VerificationLoggerService,
  VerificationWorkflow,
  VerificationStep,
  AuditLog,
  ComplianceReport,
  ComplianceIssue
} from './verification-logger';
