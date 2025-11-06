# VADA Carbon Calculator - Influence Score Implementation

## The Influence Score Concept
Instead of rating events on total emissions (which penalizes unavoidable travel), we rate them on **how well they're doing on things they CAN control**.

## Core Innovation
Each emission category gets an "influence weight" representing how much control organizers have:
- **High Influence (90-100%)**: Venue energy, catering, waste, production
- **Medium Influence (40-70%)**: Staff travel, venue location, local logistics
- **Low Influence (5-15%)**: Attendee travel (mostly informational)

The **Influence Score** measures performance on controllable elements, while still showing full footprint for transparency.

## Implementation Tasks

### [x] 1. Define Influence Weights System
- [x] Create influence weight constants for each emission category
- [x] Document the rationale for each weight
- [x] Make weights configurable for future refinement

### [x] 2. Update Backend Calculation Logic
- [x] Modify `calculateEventCarbon` to separate emissions by influence level
- [x] Calculate three emission totals: High/Medium/Low influence
- [x] Compute Influence Score (0-100) based on performance in controllable areas
- [x] Keep existing total emissions calculation for transparency
- [x] Update performance rating to focus on high-influence areas only

### [x] 3. Create New Results Data Structure
- [x] Add `influenceScore` to calculation results
- [x] Add `highInfluenceEmissions` object with breakdown
- [x] Add `mediumInfluenceEmissions` object with breakdown
- [x] Add `lowInfluenceEmissions` object (context only)
- [x] Add `influenceInsights` array with actionable recommendations

### [x] 4. Redesign Results Display Component
- [x] Create prominent Influence Score display (0-100 with visual indicator)
- [x] Create three-tier results layout (High/Medium/Low influence)
- [x] Show High Influence areas with star rating (excellent/good/fair/poor)
- [x] Show Medium Influence areas with "good/could improve" feedback
- [x] Show Low Influence areas as informational context (no rating)
- [x] Add visual separators between influence tiers
- [x] Include comparison to industry benchmarks for high-influence areas only

### [x] 5. Update Recommendations Engine
- [x] Prioritize recommendations by influence level
- [x] Focus primary recommendations on high-influence areas
- [x] Add "influence impact" indicator to each recommendation
- [x] Provide context for low-influence areas without guilt
- [x] Show "what you did well" before "what to improve"

### [ ] 6. Update Sage AI Guidance
- [ ] Modify Sage prompts to emphasize influence-based approach
- [ ] Focus chat guidance on controllable actions
- [ ] Provide encouraging feedback for high-influence achievements
- [ ] Contextualize travel impact without penalizing
- [ ] Update success story references to highlight influence scores

### [ ] 7. Update UI/UX Elements
- [ ] Add Influence Score explanation tooltip
- [ ] Update form field descriptions to indicate influence level
- [ ] Add visual indicators (icons) for high/medium/low influence fields
- [ ] Create "Your Control" indicator in form sections
- [ ] Update export functionality to include influence breakdown

### [ ] 8. Testing & Validation
- [ ] Test with various event scenarios
- [ ] Verify influence scores are fair and motivating
- [ ] Ensure high-influence ratings reflect actual performance
- [ ] Test that low-influence areas don't dominate results
- [ ] Validate that total emissions are still accurately reported

### [ ] 9. Documentation & Communication
- [ ] Update API documentation with new response structure
- [ ] Create user-facing explanation of Influence Score
- [ ] Document influence weight rationale for future reference
- [ ] Add examples of good vs. poor influence scores

## Influence Weight Definitions

### High Influence (90-100% controllable)
- **Venue Energy (95%)**: Direct choice of energy source
- **Catering (90%)**: Direct menu and sourcing decisions
- **Waste Management (90%)**: Direct waste handling choices
- **Production/Staging (95%)**: Direct equipment and setup choices

### Medium Influence (40-70% controllable)
- **Staff Travel (60%)**: Can encourage carpools, provide shuttles
- **Venue Location (50%)**: Affects attendee travel, transit access
- **Local Logistics (70%)**: Vendor selection, delivery methods

### Low Influence (5-15% controllable)
- **Attendee Travel (10%)**: Can influence through incentives, but mostly individual choice
- **Artist/Performer Travel (15%)**: Some negotiation possible, but limited

## Design Philosophy
- **Empower, don't discourage**: Focus on what organizers CAN improve
- **Transparency**: Show all data but contextualize appropriately
- **Actionable insights**: Clear next steps for high-influence improvements
- **Honest**: Acknowledge low-influence realities without guilt
- **Innovative**: Unique approach that differentiates from competitors