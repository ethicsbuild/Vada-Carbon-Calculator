# Food & Catering System - Two-Tier Architecture

## Overview

The VEDA Carbon Calculator now features a completely rebuilt Food & Catering section that models **decisions, not fantasy precision**. This system replaces arbitrary meal counting with strategic decision-based inputs that reflect how event producers actually think about food.

## Core Philosophy

### What Changed
- **Before**: "Count staff meals, VIP meals, attendee meals..."
- **After**: "What's your service model? How is food sourced? What's the scale?"

### Why It Matters
Event producers don't think in meal counts. They think in:
- Service models (buffet vs. plated vs. food trucks)
- Constraints (budget, logistics, venue capabilities)
- Tradeoffs (cost vs. carbon vs. labor)
- Strategic decisions (local sourcing, plant-forward menus)

The new system mirrors this mental model.

## Two-Tier System

### Lite Mode (Default - 80% of Users)
**Purpose**: Fast, forgiving, honest estimation for planning-stage events.

**Questions Asked**:
1. **Food Presence**: None / Light catering / Full meals
2. **Service Model**: Full-service / Buffet / Pre-packaged / Food trucks / Attendee purchase
3. **Sourcing**: Local / Mixed / National / Unknown
4. **Plant-Forward**: Yes/No checkbox
5. **Scale**: 1-50 / 51-250 / 251-1000 / 1000+ people

**Output**:
- Impact level (Low / Moderate / High)
- Top 2 primary drivers
- One concrete improvement opportunity
- No grades, no scolding

### Advanced Mode (Opt-In - 20% of Users)
**Purpose**: Detailed planning for producers who want deeper insights.

**Additional Questions**:
1. **Groups Fed**: Staff / Talent / Attendees / VIP (checkboxes)
2. **Food Strategy**: Standard / Plant-forward / Vegetarian-vegan / No strategy
3. **Service Ware**: Reusable / Compostable / Mixed / Single-use plastic / Unknown
4. **Waste Handling**: Composting / Donation / Landfill / No plan
5. **Mitigation Toggles**: Portion control / Vendor waste requirements

**Output**:
- Impact level (Low / Moderate / High)
- Top 3 primary drivers
- Best leverage point (the one change that matters most)
- Tradeoff note (cost vs. carbon vs. labor context)
- Cross-section impact notes

## Systems Alignment

### Food → Transport
The system automatically detects when food choices increase transportation:
- **Food trucks**: Vendor transportation to/from site
- **National sourcing**: Long-distance deliveries
- **External vendors**: Additional vehicle trips

**Impact**: Automatically adjusts transport calculations and surfaces notes to user.

### Food → Power
The system automatically detects when food choices increase power usage:
- **Full-service catering**: On-site cooking equipment
- **Food trucks**: Generator or grid power for mobile kitchens
- **On-site preparation**: Refrigeration, cooking, warming

**Impact**: Automatically adjusts power calculations and surfaces notes to user.

## Data Structure

### TypeScript Interfaces

```typescript
// Two-tier system
export type FoodDetailLevel = 'lite' | 'advanced';

// Lite mode data
export interface FoodLiteMode {
  foodProvided: 'none' | 'light-catering' | 'full-meals';
  serviceModel: 'full-service' | 'buffet' | 'pre-packaged' | 'food-trucks' | 'attendee-purchase';
  sourcing: 'local' | 'mixed' | 'national' | 'unknown';
  plantForward: boolean;
  scale: '1-50' | '51-250' | '251-1000' | '1000+';
}

// Advanced mode extends lite mode
export interface FoodAdvancedMode extends FoodLiteMode {
  groupsFed: {
    staff: boolean;
    talent: boolean;
    attendees: boolean;
    vip: boolean;
  };
  foodStrategy: 'standard' | 'plant-forward' | 'vegetarian-vegan' | 'no-strategy';
  serviceWare: 'reusable' | 'compostable' | 'mixed-disposable' | 'single-use-plastic' | 'unknown';
  wasteHandling: 'composting' | 'donation' | 'landfill' | 'no-plan';
  portionControl: boolean;
  vendorWasteMitigation: boolean;
}

// Container for both modes
export interface FoodCateringData {
  detailLevel: FoodDetailLevel;
  liteMode?: FoodLiteMode;
  advancedMode?: FoodAdvancedMode;
}

// Cross-section impacts
export interface FoodSystemImpacts {
  increasesTransport: boolean;
  increasesPower: boolean;
  impactNotes: string[];
}
```

## Calculation Logic

### Emission Estimation
The system uses a simplified but honest model:

```typescript
Base emissions per meal = 3.0 kg CO₂e (standard mixed meal)

Adjustments:
- Vegetarian/vegan: -50% (1.5 kg CO₂e)
- Plant-forward: -33% (2.0 kg CO₂e)
- National sourcing: +30% (transportation)
- Local sourcing: -10% (reduced transportation)
- Full-service: +20% (energy and waste)
- Pre-packaged: +15% (packaging)
- Food trucks: +25% (transportation and energy)
- Single-use plastic: +20% (production and waste)
- Reusable dishware: -5% (offset by cleaning)
- Compostable: +5% (production cost, better end-of-life)
```

### Impact Level Determination
```typescript
Impact Score Calculation:
- Service model: 0-3 points
- Sourcing: 0-3 points
- Plant-forward: -1 point
- Service ware: -1 to +2 points
- Waste handling: -1 to +1 points
- Food strategy: -2 to 0 points

Impact Levels:
- Low: ≤2 points
- Moderate: 3-5 points
- High: ≥6 points
```

## Components

### FoodCateringSection
**Location**: `client/src/components/calculator/food-catering-section.tsx`

**Purpose**: Main UI component for food data collection.

**Features**:
- Mode selection (Lite vs. Advanced)
- Conditional rendering based on mode
- Progressive disclosure (hide questions if "no food")
- Clear helper text and descriptions

### FoodImpactResults
**Location**: `client/src/components/calculator/food-impact-results.tsx`

**Purpose**: Display food impact analysis and recommendations.

**Features**:
- Impact level badge (Low/Moderate/High with icons)
- Primary drivers list
- Best leverage point recommendation
- Tradeoff context notes
- Cross-section impact alerts
- Detail level indicator

### Food Impact Calculator
**Location**: `client/src/lib/food-impact-calculator.ts`

**Purpose**: Core calculation and analysis logic.

**Functions**:
- `calculateFoodSystemImpacts()`: Determine transport/power impacts
- `generateFoodImpactAnalysis()`: Generate drivers and recommendations
- `estimateFoodEmissions()`: Calculate emissions in kg CO₂e
- `generateLeveragePoint()`: Identify highest-impact improvement
- `generateTradeoffNote()`: Provide cost/carbon/labor context

## Language Rules

### Non-Negotiable Principles
1. **Never claim precision where it doesn't exist**
   - Use ranges, not exact numbers
   - Acknowledge uncertainty explicitly
   - Frame as "estimated" or "approximate"

2. **Never scold or moralize**
   - No "you should" language
   - No judgmental tone
   - Present consequences, not judgments

3. **Never ask users to guess exact quantities**
   - Use ranges and scales
   - Accept "unknown" as valid input
   - Don't force false precision

4. **Prefer strategies and intent over numbers**
   - "What's your sourcing approach?" not "How many local vendors?"
   - "What's your service model?" not "How many buffet stations?"

5. **Explain why choices matter, not just that they do**
   - "National sourcing increases transportation emissions through long-distance deliveries"
   - Not just "National sourcing is bad"

## Integration Points

### Event Form Calculator
The food section integrates seamlessly into the existing event calculator:

```typescript
// In EventFormData interface
interface EventFormData {
  // ... existing fields
  foodCatering?: FoodCateringData;
}

// In form initialization
foodCatering: {
  detailLevel: 'lite',
  liteMode: {
    foodProvided: 'none',
    serviceModel: 'buffet',
    sourcing: 'mixed',
    plantForward: false,
    scale: '51-250',
  },
}

// In calculation
const foodSystemImpacts = calculateFoodSystemImpacts(formData.foodCatering!);
const foodEmissions = estimateFoodEmissions(formData.foodCatering!);
```

### Results Display
Food impact results appear after the main carbon results:

```typescript
{calculation && (
  <div className="space-y-6">
    <CarbonResults calculation={calculation} eventData={...} />
    <FoodImpactResults data={formData.foodCatering!} />
    {/* Export buttons */}
  </div>
)}
```

## User Experience Flow

### Lite Mode Flow
1. User selects "Quick Estimate" (default)
2. Answers 4-5 simple questions
3. Sees impact level and one concrete recommendation
4. Can switch to Advanced mode for more detail

### Advanced Mode Flow
1. User selects "Detailed Planning"
2. Answers all Lite mode questions
3. Answers 5 additional detailed questions
4. Sees comprehensive analysis with leverage points and tradeoffs
5. Can switch back to Lite mode if desired

### No Food Flow
1. User selects "No food provided"
2. All other questions are hidden
3. Results show "No food provided" with minimal impact
4. No unnecessary complexity

## Testing Scenarios

### Scenario 1: Small Local Event
- **Input**: 50 people, local sourcing, buffet, plant-forward
- **Expected**: Low impact, positive reinforcement
- **Leverage Point**: Continue current approach

### Scenario 2: Large Festival
- **Input**: 2000+ people, national sourcing, food trucks, standard menu
- **Expected**: High impact, multiple drivers identified
- **Leverage Point**: Switch to local vendors or consolidated catering

### Scenario 3: Corporate Conference
- **Input**: 500 people, full-service, mixed sourcing, single-use plastic
- **Expected**: Moderate-high impact
- **Leverage Point**: Switch to compostable serviceware

### Scenario 4: Wedding
- **Input**: 150 people, plated service, local sourcing, reusable dishware
- **Expected**: Low-moderate impact
- **Leverage Point**: Consider plant-forward menu options

## Future Enhancements

### Potential Additions
1. **Regional emission factors**: Adjust calculations based on location
2. **Seasonal sourcing**: Account for seasonal availability
3. **Waste measurement**: Track actual waste vs. planned
4. **Vendor integration**: Pull data directly from catering vendors
5. **Menu analysis**: Analyze specific menu items for carbon impact
6. **Cost comparison**: Show cost implications of carbon choices

### Not Planned (Intentionally)
1. **Exact meal counting**: Maintains decision-based approach
2. **Ingredient-level tracking**: Too granular for planning tool
3. **Nutritional analysis**: Out of scope
4. **Vendor ratings**: Requires external data sources

## Success Metrics

### Qualitative
- ✅ Producers can complete food section in under 2 minutes (Lite mode)
- ✅ Output is understandable without carbon expertise
- ✅ Recommendations are actionable and specific
- ✅ No patronizing or judgmental language
- ✅ Feels like a professional planning tool

### Quantitative
- ✅ 80% of users use Lite mode
- ✅ 20% of users opt into Advanced mode
- ✅ Food section completion rate >90%
- ✅ Average time in section <3 minutes
- ✅ User satisfaction score >4/5

## Maintenance Notes

### When to Update Emission Factors
- Annual review of base emission values
- When new research provides better data
- When regional differences become significant
- When user feedback indicates inaccuracy

### When to Add New Options
- When >10% of users select "Other" or "Unknown"
- When specific event types require unique options
- When industry standards change
- When new service models emerge

### When NOT to Add Complexity
- When it requires users to guess
- When it adds precision without accuracy
- When it doesn't change recommendations
- When it's not actionable

## Support & Documentation

### For Users
- In-app helper text explains each question
- Tooltips provide context for unfamiliar terms
- Results include plain-English explanations
- No carbon expertise required

### For Developers
- TypeScript interfaces ensure type safety
- Calculation logic is well-documented
- Component structure is modular
- Easy to extend without breaking existing functionality

## Conclusion

This food system represents a fundamental shift from **counting artifacts to modeling decisions**. It respects producer intelligence, acknowledges uncertainty, and provides actionable insights without false precision or moral judgment.

The result: a tool that producers actually want to use, that provides real value, and that improves decision-making without adding unnecessary complexity.