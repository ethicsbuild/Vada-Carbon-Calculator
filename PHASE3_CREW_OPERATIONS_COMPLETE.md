# Phase 3: Crew & Operations Reality - COMPLETE ✅

## Transformation Summary

**From**: "Staff Transportation" (consequence counting)  
**To**: "Crew & Operations Reality" (strategic decision modeling)

## What Changed

### Before (Abstract/Consequence-Based):
- "How many staff?"
- "How do they travel?"
- "Trucks required?"
- Isolated from other decisions
- No acknowledgment of real constraints

### After (Producer-Native/Decision-Based):
- "What's your staffing model?" (local hire vs. touring crew)
- "Accommodation strategy" (hotel vs. tour bus vs. local commute)
- "What limits local hiring?" (skill availability, consistency needs, union requirements)
- Connected to food, power, production decisions
- Honest about tradeoffs (consistency vs. carbon, welfare vs. cost)

## Two-Tier System

### Basic Mode (3 questions, ~2 minutes):
1. **Staffing Model**
   - Local Hire (Venue Market)
   - Touring Core + Local Support
   - Full Touring Crew
   - Hybrid/Regional Model

2. **Crew Size Estimate**
   - Total crew (rough estimate)
   - Ranges accepted

3. **Accommodation Strategy**
   - Standard Hotel Rooms
   - Tour Bus/Mobile Accommodation
   - Local Commute (No Accommodation)
   - Mixed Strategy

### Detailed Mode (6 additional questions, ~3 minutes):
4. **Travel Mode Distribution**
   - Air travel percentage
   - Ground transport percentage
   - Local commute percentage

5. **Average Travel Distance**
   - Distance per crew member
   - Miles or kilometers

6. **Build/Strike Duration**
   - Build days
   - Strike days

7. **Crew Welfare Priorities**
   - Cost Minimum (budget-constrained)
   - Standard Comfort (industry baseline)
   - Premium Welfare (crew retention priority)

8. **Local Hiring Constraints**
   - No major constraint
   - Skill availability
   - Consistency required
   - Union/contract requirements
   - Trust/relationship-based

9. **Additional Context** (optional)
   - Free-form notes

## Producer-Native Framing

### Recognition Test: ✅ PASSES
Real producers would recognize these as actual decisions they make:
- "Do we bring our touring crew or hire locally?"
- "Where does crew stay?"
- "What prevents us from hiring more locally?"
- "How do we balance crew welfare with budget?"

### Systems Thinking Connections:
- **Food**: Crew size and duration determine catering needs
- **Power**: Accommodation strategy affects venue power load
- **Production**: Local hiring enables venue-provided equipment use
- **Transport**: Touring crew requires freight coordination

## Calculation Logic

### Travel Impact Calculation:
- **Detailed mode**: Uses actual travel mode distribution
- **Basic mode**: Estimates based on staffing model
  - Local hire: Primarily local commute
  - Touring core: Mix of air/ground/local
  - Full touring: Air + ground transport
  - Hybrid: Regional mix

### Accommodation Impact Calculation:
- **Hotel standard**: 30 kg CO₂e per person per night
- **Tour bus**: 45 kg CO₂e per person per night (fuel + idling)
- **Local commute**: 0 kg (no accommodation)
- **Mixed**: Weighted average

### Adjustments:
- Crew welfare priority affects accommodation emissions
- Build/strike duration affects total nights
- Distance and mode affect travel emissions

## Results Display

### Impact Summary:
- Total crew carbon (kg CO₂e)
- Per person impact
- Travel vs. accommodation breakdown
- Strategy summary

### Leverage Points:
- Identified based on actual data
- Examples:
  - "Shifting to 'Touring Core + Local Support' could reduce travel impact by 30-40%"
  - "Local hiring enables venue-provided equipment (reduces production freight)"
  - "Extended on-site duration increases accommodation impact"

### Tradeoffs:
- Honest about constraints
- Examples:
  - "Full touring crew: Maximum consistency, highest travel carbon"
  - "Local hiring: Lowest carbon, requires strong local network"
  - "Premium welfare: Increases carbon but supports crew retention"

## Visual Design Approach

### Aesthetic Alignment:
- **Light, nature-inspired palette**: Emerald greens, soft blues, warm earth tones
- **Calm but capable**: Professional without being corporate
- **Grounded, not futuristic**: Practical working tool aesthetic

### Layout Principles:
- **Progressive disclosure**: Basic mode first, detailed optional
- **Clear hierarchy**: Questions → Results → Insights
- **Breathing room**: Generous spacing, not cramped
- **Visual feedback**: Color-coded cards for different question types

### Component Structure:
- **Section cards**: Distinct visual containers for basic vs. detailed
- **Radio groups**: Clear decision options with descriptions
- **Systems callout**: Blue info card showing cross-section connections
- **Results cards**: Gradient backgrounds for visual interest

## Files Created

1. **crew-operations-section.tsx** (UI Component)
   - Two-tier question flow
   - Progressive disclosure
   - Systems thinking callout
   - Nature-inspired design

2. **crew-impact-results.tsx** (Results Display)
   - Impact summary with breakdown
   - Leverage points identification
   - Tradeoffs analysis
   - Detailed metrics (when available)

3. **crew-impact-calculator.ts** (Calculation Logic)
   - Travel impact calculation
   - Accommodation impact calculation
   - Leverage point generation
   - Tradeoff analysis

4. **Updated types/carbon.ts**
   - CrewOperationsData interface
   - CrewBasicMode interface
   - CrewDetailedMode interface
   - CrewSystemImpacts interface

## Integration Points

### Connects To:
- **Food & Catering**: Crew size determines meal needs
- **Power System**: Accommodation affects venue load
- **Production Build**: Local hiring enables venue equipment use
- **Event Foundation**: Operational phases determine crew duration

### Data Flow:
```
User Input (Crew Section)
  ↓
CrewOperationsData
  ↓
crew-impact-calculator.ts
  ↓
CrewSystemImpacts
  ↓
Results Display + Systems Connections
```

## Success Criteria - ALL MET ✅

✅ **Producer-native framing**: Passes recognition test  
✅ **Decision-based modeling**: Not counting objects, modeling choices  
✅ **Honest about uncertainty**: Ranges accepted, constraints acknowledged  
✅ **Tradeoffs explicit**: Consistency vs. carbon, welfare vs. cost  
✅ **Systems thinking**: Cross-section connections identified  
✅ **Actionable insights**: Leverage points specific and practical  
✅ **Professional tone**: No scolding, no moralizing  
✅ **Visual freedom**: Light/bright/nature-inspired, not bound to existing patterns

## Key Insights

### What Makes This Producer-Native:
1. **Recognizable decisions**: "Do we tour crew or hire locally?" is a real question producers ask
2. **Constraint acknowledgment**: "What limits local hiring?" respects real operational constraints
3. **Welfare consideration**: Crew welfare is a real priority, not just a carbon variable
4. **Systems awareness**: Crew decisions affect food, power, production, transport

### What Makes This Honest:
1. **Tradeoffs, not judgments**: "Full touring crew: Maximum consistency, highest carbon" (not "bad")
2. **Constraint respect**: Acknowledges skill availability, union requirements, trust relationships
3. **Range acceptance**: "Rough estimate" and "ranges are fine" throughout
4. **Context capture**: Optional notes field for nuance

### What Makes This Actionable:
1. **Specific leverage points**: "Shifting to 'Touring Core + Local Support' could reduce travel by 30-40%"
2. **Systems connections**: "Local hiring enables venue-provided equipment use"
3. **Practical tradeoffs**: "Premium welfare increases carbon but supports crew retention"

## Next Steps

**Phase 4**: Audience Transportation Reality  
- Reframe "How People Get There"
- Model venue accessibility and producer control
- Distinguish what producers can influence vs. what they can't
- Connect to venue selection and event timing decisions

---

**Pattern Established**: Section-by-section rebuild with producer-native framing, systems thinking, and honest tradeoff analysis. Visual freedom exercised within light/bright/nature-inspired constraint.