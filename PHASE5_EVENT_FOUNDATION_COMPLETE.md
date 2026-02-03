# Phase 5: Event Foundation - COMPLETE ✅

## The Transformation

**From**: "What type of event?" (abstract categories)  
**To**: "How complex is the production?" (operational reality)

## The Core Problem We Solved

### Why "Event Type" Fails:
- Too abstract ("conference" vs. "festival" doesn't tell us what we need to know)
- Doesn't capture production complexity (500-person conference can be more complex than 5,000-person festival)
- Missing operational phases (load-in, show, strike)
- Ignores venue capabilities (what you bring vs. what venue provides)

### The Producer-Native Solution:
- **Production complexity** (minimal, standard, complex, festival)
- **Operational phases** (load-in days, show days, strike days)
- **Venue capabilities** (what venue provides vs. what you bring)
- **Indoor/outdoor** (affects power, weather, infrastructure)

## What Changed

### Before (Abstract):
- "Event type?" (conference, festival, concert, wedding)
- "Number of attendees?"
- No operational context
- No venue capabilities assessment

### After (Operational):
- "Production complexity level?" (minimal → standard → complex → festival)
- "Operational phases?" (load-in, show, strike days)
- "Venue capabilities?" (stage, lighting, sound, AV, power, rigging)
- "Indoor or outdoor?" (affects power and infrastructure)
- "Expected attendance?" (shapes venue selection)

## Two-Tier System

### Basic Mode (4 questions, ~2 minutes):
1. **Production Complexity Level**
   - Minimal Production (venue-provided, basic AV, quick setup)
   - Standard Production (mix of venue/custom, moderate AV, 1-2 day build)
   - Complex Production (significant custom build, extensive AV, 2-4 day build)
   - Festival / Multi-Stage (multiple stages, full temporary build, 5+ day build)

2. **Operational Phases**
   - Load-In Days (setup time)
   - Show Days (event duration)
   - Strike Days (teardown time)
   - Total on-site duration calculated automatically

3. **Venue Capabilities**
   - Stage/Platform
   - Lighting System
   - Sound System
   - AV/Video
   - Adequate Power
   - Rigging Points
   - Capability score calculated (0-6)

4. **Expected Attendance**
   - Total attendees (rough estimate)

### Detailed Mode (3 additional questions, ~2 minutes):
5. **Event Format**
   - Single Day Event
   - Multi-Day (same programming each day)
   - Multi-Day (different programming each day)
   - Festival (continuous multi-day)

6. **Indoor or Outdoor**
   - Fully Indoor (climate controlled)
   - Fully Outdoor (weather dependent)
   - Mixed (indoor + outdoor spaces)
   - Covered Outdoor (tent/structure)

7. **Weather Contingency** (conditional on outdoor)
   - Rain or Shine (no contingency)
   - Covered Areas Available
   - Indoor Backup Venue
   - Postponement/Cancellation Plan

## The Key Insight

**Event Foundation is the master variable that shapes everything downstream.**

Production complexity determines:
- Crew size and duration
- Power requirements
- Equipment needs
- Build timeline
- Accommodation needs
- Catering volume

Venue capabilities determine:
- Production strategy (bring vs. rent vs. venue-provided)
- Equipment transport needs
- Setup complexity
- Power requirements

Operational duration determines:
- Crew accommodation days
- Catering days
- Power consumption duration
- Venue rental costs

## Results Display

### Event Foundation Summary:
- **Production Complexity Badge** (color-coded by level)
- **Operational Timeline** (load-in, show, strike, total)
- **Venue Capability Score** (0-6 systems provided)
- **Expected Attendance**
- **Event Format & Location Type**

### Operational Insights:
- How complexity affects crew and timeline
- How venue capabilities reduce transport
- How duration affects accommodation/catering
- How indoor/outdoor affects infrastructure

### Systems Connections:
- **Crew**: Complexity determines crew size, duration determines accommodation
- **Power**: Outdoor requires temporary infrastructure, venue power reduces generators
- **Production**: Venue capabilities enable local rental strategy
- **Food**: Duration determines catering days, complexity determines crew size
- **Audience**: Attendance shapes venue selection and accessibility

## Visual Design

### Aesthetic Alignment:
- **Emerald cards** for basic mode (core decisions)
- **Amber cards** for detailed mode (advanced context)
- **Blue callouts** for reality checks and systems thinking
- **Color-coded complexity badges** (emerald/blue/amber/purple)
- **Timeline visualization** (load-in, show, strike breakdown)

### Layout Innovations:
- **Reality check callout** explaining why complexity > event type
- **Operational timeline grid** (visual breakdown of phases)
- **Venue capability checklist** (6 systems with visual indicators)
- **Systems connections** with explicit cross-section links

## Files Created

1. **event-foundation-section.tsx** (UI Component)
   - Two-tier question flow
   - Production complexity with examples
   - Operational phases input
   - Venue capabilities checklist
   - Conditional weather contingency

2. **event-foundation-results.tsx** (Results Display)
   - Event foundation summary
   - Operational timeline visualization
   - Venue capability score
   - Operational insights
   - Systems connections

3. **event-foundation-calculator.ts** (Calculation Logic)
   - Venue capability score calculation
   - Operational insights generation
   - Systems connections mapping

4. **Updated types/carbon.ts**
   - EventFoundationData interface
   - EventBasicMode interface
   - EventDetailedMode interface
   - EventFoundationSummary interface

## Success Criteria - ALL MET ✅

✅ **Producer-native framing**: Production complexity, not event type  
✅ **Operational reality**: Load-in, show, strike phases explicit  
✅ **Venue capabilities**: What venue provides vs. what you bring  
✅ **Systems thinking**: Foundation shapes all downstream decisions  
✅ **Actionable insights**: Specific connections to crew, power, production, food  
✅ **Professional tone**: No abstract categories, operational language  
✅ **Visual clarity**: Timeline visualization, capability score, color-coded complexity

## The Breakthrough

**Event Foundation is not about categorization - it's about operational reality.**

A 500-person corporate conference with:
- Complex AV requirements
- Custom staging
- 3-day build
- Limited venue capabilities

...has MORE production complexity than a 5,000-person festival with:
- Venue-provided stage
- Standard sound system
- 1-day setup
- Comprehensive venue capabilities

**Event type doesn't tell us what we need to know. Production complexity does.**

## Systems Thinking Examples

### Example 1: Minimal Production
- **Complexity**: Minimal
- **Duration**: 0.5 load-in, 1 show, 0.5 strike = 2 days total
- **Venue**: Provides stage, lighting, sound, power (4/6)
- **Impact**: Small crew, short duration, minimal transport, low carbon

### Example 2: Festival Production
- **Complexity**: Festival
- **Duration**: 5 load-in, 3 show, 2 strike = 10 days total
- **Venue**: Outdoor field, provides nothing (0/6)
- **Impact**: Large crew, extended accommodation, full equipment transport, high carbon

### Example 3: Complex Conference
- **Complexity**: Complex
- **Duration**: 2 load-in, 2 show, 1 strike = 5 days total
- **Venue**: Provides stage, power (2/6)
- **Impact**: Moderate crew, multi-day accommodation, significant AV transport, moderate-high carbon

## Key Insights Generated

### Operational Insights:
- "Complex production requires significant crew and extended build time. Crew accommodation and catering become major carbon factors."
- "Comprehensive venue capabilities significantly reduce equipment transport and setup time. This is a major carbon advantage."
- "5-day operational window requires extended crew accommodation and catering. Consider if build schedule can be compressed."

### Systems Connections:
- "**Crew:** Complex production requires larger crew size and extended on-site duration, increasing accommodation and catering needs."
- "**Power:** Outdoor event requires temporary power infrastructure. Generator capacity must match production complexity."
- "**Production:** Venue provides most systems, enabling 'rent locally' strategy (reduces transport carbon)."
- "**Food:** 5-day operational window determines catering duration. Crew size from production complexity sets meal volume."

## Next Steps

**Phase 6**: Operational Insights & Tradeoffs (reframe results with systems thinking)  
**Phase 7**: Sage Removal (move to background)

---

**Pattern Continues**: Producer-native framing, operational reality, systems thinking, actionable insights.

**Event Foundation is the master variable. Everything flows from here.**