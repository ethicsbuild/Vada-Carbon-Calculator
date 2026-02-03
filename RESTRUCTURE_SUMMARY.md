# VEDA Carbon Calculator - Restructure Summary

## The Core Problem

**Current State**: The calculator feels like a sustainability audit tool adapted for events.

**Required State**: A production planning ally that surfaces carbon consequences of real operational decisions.

---

## The Test

> "Would a real producer recognize this as a decision they actually make during planning or execution?"

If the answer is **NO** → Reframe, redesign, or remove.

---

## What Needs to Change

### 1. Section Structure

#### ❌ Current (Abstract)
```
Event Details
Venue & Location
Audience Transportation (you don't control this)
Staff Transportation (partially right)
Artist Transportation (partially right)
Equipment Transportation (asks for consequences, not decisions)
Power Source (too simplistic)
Food & Catering ✓ (recently fixed - use as model)
Results
```

#### ✅ Proposed (Producer-Native)
```
1. EVENT FOUNDATION
   What are you building? Load-in/show/strike phases?
   What does venue provide vs. what are you bringing?

2. CREW & OPERATIONS REALITY
   Local hire or touring crew?
   Accommodation needs? Crew structure?

3. HOW PEOPLE GET THERE
   Shuttles? Parking? Transit partnerships?
   Crew travel logistics? Equipment consolidation?

4. HOW THE EVENT IS POWERED (AND BACKED UP)
   Primary + backup power? Redundancy requirements?
   Centralized or distributed power?

5. HOW PEOPLE ARE FED ✓
   [Already redesigned - use as pattern]

6. PRODUCTION BUILD & INFRASTRUCTURE
   Bring full rig or rent locally?
   Vendor consolidation? What's venue-provided?

7. OPERATIONAL INSIGHTS & TRADEOFFS
   Where do emissions hide? Highest-leverage changes?
   Tradeoffs: cost vs. time vs. labor vs. carbon
```

---

## Critical Failures

### Failure #1: "Audience Transportation"
**Current**: "What percentage of attendees will fly?"
**Problem**: Producers don't control or know this
**Fix**: "Are you providing shuttles? Is venue transit-accessible?"

### Failure #2: "Equipment Transportation"
**Current**: "How many trucks?"
**Problem**: Asks for consequence, not decision
**Fix**: "Bringing full rig or renting locally? Consolidating vendors?"

### Failure #3: "Power Source"
**Current**: Single dropdown (Grid/Generator/Renewable)
**Problem**: Ignores backup power requirements
**Fix**: "Primary + backup power? Redundancy for safety?"

### Failure #4: Sage Riverstone
**Current**: Generic sustainability platitudes
**Problem**: Doesn't speak producer language
**Fix**: Remove from primary UI (or redesign completely)

---

## What Works

### ✅ Food & Catering Section
**Why it works**:
- Decision-based, not count-based
- Two-tier system (Lite/Advanced)
- Honest about uncertainty (ranges)
- Surfaces tradeoffs (cost vs. carbon vs. labor)
- Professional tone, no scolding

**Use as pattern for all other sections**

---

## Design Doctrine

### 1. Producer-Native Framing
Every section must pass the producer recognition test.

### 2. Model Decisions, Not Objects
Stop counting trucks. Start modeling consolidation vs. fragmentation.

### 3. Honest About Uncertainty
Use ranges. Accept "unknown". Never force guessing.

### 4. Respect Producer Intelligence
No patronizing. No moralizing. Professional tone.

### 5. Tradeoffs Over Judgments
"This increases X but improves Y" not "This is bad"

### 6. Systems Thinking
Food trucks need power. Crew travel affects accommodation.

### 7. Actionable Over Comprehensive
5 things done well > 20 things done abstractly

---

## Sage Riverstone Decision

### Recommendation: Move to Background

**Why**:
- Current Sage doesn't understand production reality
- Generic advice undermines credibility
- Calculator should stand on its own

**What to do**:
- Remove from primary UI
- Preserve backend for future use
- Bring back only when she can speak producer language

**Future Sage (if reactivated)**:
```
Current: "Let's calculate your carbon footprint!"
Future: "You're bringing generators for backup AND using food trucks. 
That's two generator loads—considered consolidating power distribution?"
```

---

## Implementation Priority

### Phase 1: Evaluation ✅
- ✅ Produce evaluation artifacts
- ⏳ Get user approval

### Phase 2: Sage Removal ⏳
- Remove from primary UI
- Preserve backend

### Phase 3: Section Rebuild ⏳
**Priority order**:
1. "How the Event Is Powered" (high impact, clear fix)
2. "Production Build & Infrastructure" (reframe equipment)
3. "Crew & Operations Reality" (reframe staff)
4. "How People Get There" (reframe transportation)
5. "Event Foundation" (merge event details + venue)
6. "Operational Insights" (reframe results)

### Phase 4: Testing ⏳
- Test with real producers
- Verify language
- Validate tradeoffs

---

## Language Transformation

### Before → After

| Abstract/Academic | Producer-Native |
|------------------|-----------------|
| "Transportation" | "How People Get There" |
| "Calculate carbon footprint" | "Surface operational impact" |
| "Expected Attendance" | "Estimated Attendance (ranges)" |
| "Power Source" | "How the Event Is Powered (and Backed Up)" |
| "Equipment Transportation" | "Production Build & Infrastructure" |
| "Your emissions are high" | "Touring crew increases travel but improves quality" |
| "You should reduce travel" | "Local hire reduces carbon but may limit capabilities" |

---

## Success Criteria

A seasoned event producer should feel:

> "This understands my world.
> This respects my constraints.
> This helps me make better decisions without pretending certainty."

---

## Next Steps

1. **User Approval**: Confirm structural direction
2. **Sage Decision**: Confirm removal from primary UI
3. **Priority Sections**: Confirm rebuild order
4. **Pilot Section**: Start with "How the Event Is Powered"
5. **Phased Rollout**: One section per sprint

---

## Key Insight

**The Food & Catering section proves this transformation is possible.**

It went from:
- "Count staff meals, VIP meals, attendee meals"
- Abstract numbers producers had to guess

To:
- "What's your service model? How is food sourced?"
- Strategic decisions producers actually make

**Apply this same transformation to every other section.**

---

**Status**: Evaluation complete. Ready to proceed with user approval.

**Full Details**: See `PRODUCER_NATIVE_EVALUATION.md`