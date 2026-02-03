# VEDA Carbon Calculator - Producer-Native Evaluation

## Executive Summary

After comprehensive evaluation of the VEDA Carbon Calculator against the "producer-native" test, I've identified fundamental structural issues that require reframing, not incremental fixes.

**Current State**: The calculator feels like a sustainability audit tool adapted for events, not a production planning tool that happens to track carbon.

**Required State**: A production planning ally that surfaces carbon consequences of real operational decisions.

---

## ARTIFACT 1: REVISED HIGH-LEVEL CALCULATOR OUTLINE

### Current Structure (Abstract/Academic)
```
1. Event Details
2. Venue & Location  
3. Audience Transportation
4. Staff Transportation
5. Artist Transportation
6. Equipment Transportation
7. Power Source
8. Food & Catering ✓ (Recently fixed)
9. Results
```

### Proposed Structure (Producer-Native)

```
1. EVENT FOUNDATION
   Purpose: Establish the operational reality
   Producer Decisions:
   - Event type and scale (not just "festival" but production complexity)
   - Duration and phases (load-in, show, strike)
   - Venue constraints and capabilities
   - What's provided vs. what you're bringing
   
   Questions:
   - "What are you building?" not "What's your event type?"
   - "How many days for load-in, show, strike?" not just "duration"
   - "What does the venue provide?" not just "indoor/outdoor"

2. CREW & OPERATIONS REALITY
   Purpose: Model how people work and move
   Producer Decisions:
   - Crew size and structure (local vs. touring)
   - Call times and shift patterns
   - Overnight stays and accommodation needs
   - Safety and redundancy requirements
   
   Questions:
   - "Are you hiring local or bringing your crew?"
   - "How many overnight stays for crew?"
   - "What's your crew structure?" (not abstract staff counts)

3. HOW PEOPLE GET THERE
   Purpose: Model movement patterns you control vs. influence
   Producer Decisions:
   - Venue accessibility (transit, parking, shuttles you provide)
   - Crew travel logistics (local hire vs. tour)
   - Artist/talent movement (tour bus, flights, local)
   - Equipment transport (consolidated vs. fragmented)
   
   Questions:
   - "Are you providing shuttles from transit?"
   - "Local crew or touring crew?"
   - "Consolidated equipment trucks or multiple vendors?"
   - NOT: "What percentage of attendees will fly?" (you don't control this)

4. HOW THE EVENT IS POWERED (AND BACKED UP)
   Purpose: Model power strategy and redundancy
   Producer Decisions:
   - Primary power source (grid, generator, hybrid)
   - Backup power requirements (safety, redundancy)
   - Power distribution strategy (centralized vs. distributed)
   - Load profile (peak vs. sustained)
   
   Questions:
   - "What's your primary power source?"
   - "Do you need backup generators?" (safety requirement)
   - "Centralized power distribution or distributed?"
   - NOT: "Grid or generator?" (too simplistic)

5. HOW PEOPLE ARE FED ✓
   Purpose: Model food service strategy
   Producer Decisions:
   - Service model and scale
   - Sourcing and logistics
   - Waste handling
   
   [Already redesigned - use as pattern]

6. PRODUCTION BUILD & INFRASTRUCTURE
   Purpose: Model temporary vs. permanent infrastructure
   Producer Decisions:
   - Stage and structure build (temporary vs. venue-provided)
   - AV and lighting rig (bring vs. rent local)
   - Vendor consolidation vs. specialization
   - Build time vs. carbon intensity
   
   Questions:
   - "Are you bringing your full rig or renting locally?"
   - "How many vendors are you coordinating?"
   - "What's the venue providing vs. what are you building?"
   - NOT: "How many trucks?" (consequence, not decision)

7. OPERATIONAL INSIGHTS & TRADEOFFS
   Purpose: Surface consequences and alternatives
   Producer Value:
   - Where emissions hide in your operational choices
   - Highest-leverage changes (cost, time, carbon)
   - Tradeoffs made explicit
   - Comparison to similar events (not moral grades)
```

---

## ARTIFACT 2: SECTIONS THAT FAIL THE PRODUCER-NATIVE TEST

### ❌ CRITICAL FAILURES

#### 1. "Audience Transportation" Section
**Current Questions**:
- "Primary Travel Method" (mixed/local/flying/transit/walking)
- "Average Travel Distance"
- "% Local Travel / % Domestic Flights / % International Flights"

**Why It Fails**:
- Producers don't control how attendees travel
- Asking for percentages producers can't possibly know
- No connection to real producer decisions
- Abstract data that requires guessing

**Producer Reality**:
- "Do I provide shuttles from the train station?"
- "Do I offer parking or encourage transit?"
- "Is the venue accessible by public transport?"

**Recommendation**: Reframe as "Venue Accessibility & Attendee Support"
- Focus on what producers control: shuttles, parking, transit partnerships
- Remove percentage breakdowns (unknowable)
- Model accessibility decisions, not attendee behavior

#### 2. "Staff Transportation" Section
**Current Questions**:
- Add groups with count, mode, distance, overnight stays
- Granular per-group tracking

**Why It Partially Fails**:
- Right idea (granular groups) but wrong framing
- "Number of staff" is fine, but missing context
- No distinction between local hire vs. touring crew
- Missing: crew welfare, accommodation strategy

**Producer Reality**:
- "Am I hiring local crew or bringing my touring team?"
- "How many crew need accommodation?"
- "What's my crew structure?" (department heads, local labor, etc.)

**Recommendation**: Reframe as "Crew & Operations Reality"
- Local hire vs. touring crew decision
- Accommodation needs and overnight stays
- Crew structure and departments
- Surface tradeoff: local hire (lower travel) vs. touring crew (higher control)

#### 3. "Artist Transportation" Section
**Current Questions**:
- Add groups with count, mode, distance, tour bus checkbox

**Why It Partially Fails**:
- Right idea but missing context
- No distinction between headliner vs. local acts
- Tour bus checkbox is good but isolated
- Missing: artist rider requirements, logistics complexity

**Producer Reality**:
- "Is this a touring act or local talent?"
- "Do they have a tour bus or are we arranging travel?"
- "What are their rider requirements?"

**Recommendation**: Merge into "Talent & Performance Logistics"
- Touring vs. local talent decision
- Tour bus vs. arranged travel
- Rider requirements and logistics
- Surface tradeoff: touring acts (higher carbon) vs. local talent (lower carbon)

#### 4. "Equipment Transportation" Section
**Current Questions**:
- "Trucks Required"
- "Average Distance"
- "Freight Flights"

**Why It Fails**:
- Asks for consequences (trucks) not decisions
- No context about what's being transported
- Missing: vendor consolidation vs. fragmentation
- Missing: local rental vs. tour package

**Producer Reality**:
- "Am I bringing my full rig or renting locally?"
- "How many vendors am I coordinating?"
- "Can I consolidate equipment trucks?"

**Recommendation**: Reframe as "Production Build & Infrastructure"
- Bring full rig vs. rent locally decision
- Vendor consolidation vs. specialization
- What venue provides vs. what you're building
- Surface tradeoff: control vs. local resources vs. carbon

#### 5. "Power Source" Section
**Current Questions**:
- Single dropdown: Grid / Generator / Renewable / Hybrid

**Why It Fails**:
- Treats power as a single choice
- Ignores redundancy requirements (backup generators are mandatory for many events)
- No connection to load profile or distribution strategy
- Missing: reliability vs. efficiency tradeoff

**Producer Reality**:
- "Do I need backup generators for safety?"
- "Is the venue power sufficient or do I need supplemental?"
- "Do I centralize power or distribute it?"

**Recommendation**: Reframe as "How the Event Is Powered (and Backed Up)"
- Primary + backup power strategy
- Redundancy requirements (safety-driven)
- Power distribution strategy
- Surface tradeoff: reliability vs. efficiency

### ⚠️ MODERATE ISSUES

#### 6. "Event Details" Section
**Current Questions**:
- Event Type (dropdown)
- Expected Attendance
- Duration (Days)
- Hours per Day

**Why It's Weak**:
- "Event Type" is too abstract (festival ≠ festival)
- "Expected Attendance" is fine but treated as precise
- Missing: load-in/show/strike phases
- Missing: what venue provides vs. what you're bringing

**Producer Reality**:
- "What are you building?" (not just "festival")
- "How many days for load-in, show, strike?"
- "What does the venue provide?"

**Recommendation**: Reframe as "Event Foundation"
- Establish operational phases (load-in, show, strike)
- Clarify venue capabilities vs. temporary build
- Use ranges for attendance, not false precision
- Focus on production complexity, not event category

#### 7. "Venue Type" Section
**Current Questions**:
- Venue Type (Indoor / Outdoor / Mixed)
- Contextual outdoor callout

**Why It's Weak**:
- Venue type is fine but too simplistic
- Outdoor with infrastructure ≠ field with full build
- Missing: venue capabilities and constraints

**Producer Reality**:
- "Venue has grid power but limited capacity"
- "Outdoor with permanent stage vs. field with full build"
- "What infrastructure exists vs. what am I building?"

**Recommendation**: Merge into "Event Foundation"
- Focus on venue capabilities and constraints
- Model what's provided vs. what you're building
- Surface infrastructure decisions, not just location

### ✅ SECTIONS THAT WORK

#### 8. "Food & Catering" Section ✓
**Why It Works**:
- Decision-based, not count-based
- Two-tier system (Lite/Advanced) respects producer time
- Honest about uncertainty (ranges, not precision)
- Surfaces tradeoffs (cost vs. carbon vs. labor)
- Professional tone, no scolding

**Keep and Use as Pattern**: This is the model for all other sections.

---

## ARTIFACT 3: SAGE RIVERSTONE RECOMMENDATION

### Current State Assessment

**Sage Riverstone is currently in limbo**: Present but not purposeful.

**Evidence from Code**:
```typescript
// From sage-greeting.tsx
"Hey friend, planning something special?"
"I'm Sage Riverstone. Let's figure out your event's carbon footprint together 
with clarity and actionable steps."

// From progressive-onboarding.tsx
"Hey there! Welcome to VEDA 👋"
"First things first—is this your first time calculating carbon for an event?"
```

**Problems**:
1. **Generic sustainability platitudes**: "Let's figure out your carbon footprint"
2. **No connection to production reality**: Doesn't speak producer language
3. **Appears constantly but adds little value**: Onboarding, greeting, chat
4. **Breaks immersion with academic tone**: "carbon footprint" not "operational impact"
5. **Feels like a sustainability consultant, not a production guide**

**The Test**: Would a seasoned producer want Sage's input?
**Answer**: Not in her current form.

### Recommendation: **OPTION B - Move Sage to the Background**

**Reasoning**:

1. **A weak guide is worse than no guide**
   - Current Sage doesn't understand production reality
   - Generic advice undermines credibility
   - Better to have no personality than a mismatched one

2. **The calculator should stand on its own**
   - Producer-native framing doesn't need a translator
   - Clear questions and tradeoffs speak for themselves
   - Results should be self-explanatory

3. **Sage can return when she's ready**
   - Keep the infrastructure for future use
   - Redesign her role with production expertise
   - Bring her back when she can add real value

### Implementation Plan

**Phase 1: Remove from Primary UI**
- Remove Sage from navigation
- Remove Sage from onboarding (replace with direct questions)
- Remove Sage greeting from calculator
- Remove floating Sage chat
- Keep backend logic for future use

**Phase 2: Preserve for Future Activation**
- Keep Sage's conversation system
- Keep her data analysis capabilities
- Document what she would need to be useful:
  - Production expertise, not sustainability platitudes
  - Contextual insights, not constant presence
  - Blind spot identification, not obvious advice

**Phase 3: Future Sage (If Reactivated)**
If Sage returns, she must:
- Speak like an experienced production manager
- Surface blind spots producers commonly miss
- Connect sections (e.g., "Your food trucks will need generator power")
- Appear contextually, not constantly
- Never moralize or scold

**Example of Future Sage Done Right**:
```
Current Sage: 
"Let's calculate your carbon footprint and make sustainable choices!"

Future Sage: 
"I notice you're bringing generators for backup power but also using food trucks. 
That's two separate generator loads—have you considered consolidating power 
distribution? Could save you fuel costs and reduce emissions."
```

### Alternative: Keep Sage as Silent Guide

If removing Sage entirely feels too drastic:
- Keep her as a silent presence (icon only)
- Use her for contextual tooltips and help text
- No personality, just helpful production insights
- Think: "Production notes" not "AI companion"

**My Strong Recommendation**: Move Sage to the background. The calculator should be strong enough to stand alone.

---

## ARTIFACT 4: DESIGN DOCTRINE (Non-Negotiable Principles)

### 1. **Producer-Native Framing**
Every section must answer: "Would a real producer recognize this as a decision they actually make?"
- If no: reframe, redesign, or remove
- Test: Show it to a working producer without explanation
- Language: Use production terminology, not sustainability jargon

### 2. **Model Decisions, Not Objects**
Stop counting things (trucks, meals, generators).
Start modeling choices (consolidation vs. fragmentation, redundancy vs. efficiency, local vs. touring).
- Emissions are consequences of operational decisions
- Surface the tradeoffs, not just the numbers
- Focus on what producers control

### 3. **Honest About Uncertainty**
If data isn't knowable at planning time, don't ask for it.
- Use ranges, not false precision
- Accept "unknown" as valid input
- Acknowledge limitations explicitly
- Never force producers to guess

### 4. **Respect Producer Intelligence**
Assume competence and time constraints.
- No explaining obvious concepts
- No patronizing language
- No moralizing or scolding
- Professional tone throughout
- Treat producers as experts in their domain

### 5. **Tradeoffs Over Judgments**
Present consequences and alternatives, not moral grades.
- "This choice increases X but improves Y"
- "Here's the tradeoff you're making"
- Not: "This is bad, you should change it"
- Show cost, time, labor, and carbon together

### 6. **Systems Thinking**
Decisions in one area affect others.
- Food trucks need power
- Crew travel affects accommodation
- Vendor consolidation affects logistics
- Surface these connections explicitly
- Help producers see the whole system

### 7. **Actionable Over Comprehensive**
Better to model 5 things producers control well than 20 things abstractly.
- Focus on high-leverage decisions
- Prioritize what producers can actually change
- Remove sections that don't meet this bar
- Quality over quantity

---

## IMPLEMENTATION ROADMAP

### Phase 1: Structural Reframing (Do Not Code Yet) ✅
1. ✅ Produce evaluation artifacts (this document)
2. ⏳ Get user approval on new structure
3. ⏳ Create detailed wireframes for each new section
4. ⏳ Map old data model to new structure

### Phase 2: Sage Decision ⏳
1. ⏳ Remove Sage from primary UI
2. ⏳ Preserve backend for future use
3. ⏳ Document requirements for future activation

### Phase 3: Section-by-Section Rebuild ⏳
Priority order (based on impact):
1. ⏳ "Event Foundation" (merge Event Details + Venue)
2. ⏳ "How the Event Is Powered" (reframe Power)
3. ⏳ "Production Build & Infrastructure" (reframe Equipment/AV)
4. ⏳ "Crew & Operations Reality" (reframe Staff Transport)
5. ⏳ "How People Get There" (reframe Transportation)
6. ✅ "How People Are Fed" (already done)
7. ⏳ "Operational Insights & Tradeoffs" (reframe Results)

### Phase 4: Testing & Refinement ⏳
1. ⏳ Test with real event producers
2. ⏳ Verify producer-native language
3. ⏳ Ensure tradeoffs are clear
4. ⏳ Validate calculation logic

---

## CRITICAL QUESTIONS FOR USER

Before proceeding with implementation, I need your input on:

1. **Structural Approval**: Does the proposed outline feel right? Any sections missing or misframed?

2. **Sage Decision**: Confirm removal from primary UI? Or prefer "silent guide" approach?

3. **Priority Sections**: Which sections should be rebuilt first after Food?
   - My recommendation: Power → Production Build → Crew Reality

4. **Scope**: Should I proceed with full restructure, or pilot one section first?
   - My recommendation: Pilot "How the Event Is Powered" first

5. **Timeline**: Is this a complete rebuild or phased rollout?
   - My recommendation: Phased rollout, one section per sprint

6. **Breaking Changes**: Are you comfortable with breaking changes to data model?
   - Required for proper reframing

---

## CONCLUSION

The VEDA Carbon Calculator has good bones but needs a fundamental reframing from "sustainability audit tool" to "production planning ally."

**The Food & Catering section proves this is possible**: It's producer-native, decision-based, honest about uncertainty, and respectful of intelligence.

**The path forward is clear**: Apply the same principles to every other section.

**The result will be**: A tool that seasoned producers recognize as understanding their world, respecting their constraints, and helping them make better decisions without pretending certainty.

**Next Step**: Your approval to proceed with the structural rebuild, starting with the highest-priority sections.

---

## APPENDIX: LANGUAGE TRANSFORMATION EXAMPLES

### Before (Abstract/Academic)
- "Transportation"
- "Calculate your carbon footprint"
- "Expected Attendance"
- "Power Source"
- "Equipment Transportation"

### After (Producer-Native)
- "How People Get There"
- "Surface operational impact"
- "Estimated Attendance" (with ranges)
- "How the Event Is Powered (and Backed Up)"
- "Production Build & Infrastructure"

### Before (Judgmental)
- "Your emissions are high"
- "You should reduce travel"
- "This is unsustainable"

### After (Tradeoff-Focused)
- "Touring crew increases travel emissions but improves show quality"
- "Local hire reduces carbon but may limit technical capabilities"
- "Here's the tradeoff you're making: control vs. carbon"

---

**Status**: Evaluation complete. Awaiting user approval to proceed with implementation.