# Design System Fix Directive - Non-Negotiable

## Current State Assessment

**Problems Identified**:
1. No design tokens - colors hardcoded in every file
2. Color system overactive - too many semantic meanings
3. Borders too thick and too frequent - feels like slide deck
4. Unverified percentage claims (50-70%, 40-60%) - credibility leak
5. Phases 1-5 have inconsistent styling
6. aesthetic-preview.html is a demo page, not a system

## Required Deliverables

### A) Create Token-Based Design System

**File 1: `client/src/styles/tokens.css`**
```css
:root {
  /* Neutral (Default UI) */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  --color-border-subtle: #f1f5f9;
  --color-text: #334155;
  --color-text-muted: #64748b;
  --color-text-heading: #1e293b;
  
  /* Evergreen (Primary Actions) */
  --color-primary: #059669;
  --color-primary-light: #d1fae5;
  --color-primary-border: #a7f3d0;
  
  /* Information (Blue) */
  --color-info: #2563eb;
  --color-info-light: #dbeafe;
  --color-info-border: #bfdbfe;
  
  /* Warning/Tradeoff (Amber) */
  --color-warning: #d97706;
  --color-warning-light: #fef3c7;
  --color-warning-border: #fde68a;
  
  /* Spacing */
  --space-section: 1.5rem;
  --space-card: 1rem;
  --space-element: 0.75rem;
  
  /* Borders */
  --border-width: 1px;
  --border-radius: 0.5rem;
  --border-radius-lg: 0.75rem;
}
```

**File 2: Update `tailwind.config.ts`**
```typescript
colors: {
  primary: {
    DEFAULT: 'var(--color-primary)',
    light: 'var(--color-primary-light)',
    border: 'var(--color-primary-border)',
  },
  info: {
    DEFAULT: 'var(--color-info)',
    light: 'var(--color-info-light)',
    border: 'var(--color-info-border)',
  },
  warning: {
    DEFAULT: 'var(--color-warning)',
    light: 'var(--color-warning-light)',
    border: 'var(--color-warning-border)',
  },
}
```

**File 3: `client/src/components/ui/section-card.tsx`**
```typescript
// Shared component for all section cards
// Variants: default, detailed
// No hardcoded colors
```

**File 4: `client/src/components/ui/callout.tsx`**
```typescript
// Shared component for callouts
// Variants: info, warning, neutral
// Uses tokens only
```

**Acceptance Criteria**:
- [ ] No phase file contains hardcoded hex colors
- [ ] All colors reference CSS variables
- [ ] Visual changes made by editing tokens.css only
- [ ] Shared components used in all 5 phases

---

### B) Fix Calculation Integrity

**For Each Calculator File**:
1. Separate pure calculation logic from UI
2. Export deterministic functions
3. Add confidence/assumptions object to outputs
4. Create test file with minimum 3 tests

**Example: `event-foundation-calculator.ts`**
```typescript
export interface CalculationOutput {
  value: number;
  confidence: 'low' | 'medium' | 'high';
  assumptions: string[];
  sources?: string[];
}
```

**Acceptance Criteria**:
- [ ] Calculation logic is pure (no side effects)
- [ ] UI changes don't affect numeric outputs
- [ ] Every output includes confidence level
- [ ] Test files exist and pass

---

### C) Remove Unverified Claims

**Current Problems**:
- "reduce by 50-70%" (no source)
- "freight 40-60%" (no source)
- Stated as facts, not scenarios

**Required Fix Options** (choose one):

**Option 1: Scenario Framing**
```
"Venue location can significantly impact travel carbon. 
Urban core venues with transit access often see 40-70% 
lower per-attendee travel emissions compared to suburban 
car-dependent venues, depending on baseline mode share."
```

**Option 2: Source Citations**
```
"Urban venues can reduce travel carbon by 50-70% 
[Source: Event Carbon Study 2023]"
```

**Acceptance Criteria**:
- [ ] No numeric claim without source OR scenario framing
- [ ] All percentages include "typical range" or "depends on" language
- [ ] Optional: Add "Assumptions" disclosure drawer

---

### D) Color System Discipline

**Strict Semantic Rules**:

| Color | Use Case | NOT Used For |
|-------|----------|--------------|
| Slate | Default UI, neutral cards | N/A |
| Evergreen | Primary actions, confirmations | Section themes, leverage points |
| Amber | Warnings, tradeoffs only | Detailed mode, opportunities |
| Blue | Information, systems thinking | Questions, results |

**Border Rules**:
- Default cards: 1px slate-200, subtle shadow
- Accent: Left bar (4px) or small header chip
- Full colored border: Exceptional states only

**Acceptance Criteria**:
- [ ] No "amber = leverage" theme usage
- [ ] No thick (2px+) colored borders on standard cards
- [ ] Color usage matches semantic table exactly

---

### E) Status Reporting Format

**Required Template for All Updates**:

```markdown
## [PHASE NAME] - [STATUS]

**Commit**: [short SHA]
**PR**: [link if applicable]
**Deployment**: [Railway ID or timestamp]

**Files Changed**:
- [file path] (added/modified/deleted)
- [file path] (added/modified/deleted)

**Verification Steps**:
1. [specific action]
2. [expected result]
3. [how to confirm]

**Known Issues**:
- [issue 1]
- [issue 2]

**Next Steps**:
- [task 1]
- [task 2]
```

**Acceptance Criteria**:
- [ ] No "deployment triggered" without ID/timestamp
- [ ] No "build successful" without commit SHA
- [ ] No tool chatter in status updates
- [ ] Verification steps are specific and testable

---

### F) VEDA vs VADA Consistency

**Directive**: Lock the name. One spelling everywhere.

**Files to Check**:
- package.json
- index.html title
- Navigation component
- README
- All documentation

**Acceptance Criteria**:
- [ ] Single spelling used consistently
- [ ] No mixed usage in any file

---

## Implementation Order

1. **Stop forward momentum** - No Phase 6 until foundation fixed
2. **Create design system** (tokens.css, tailwind config, shared components)
3. **Update Phase 5** as reference implementation
4. **Update Phases 1-4** to match
5. **Fix calculation integrity** (pure functions, tests, confidence levels)
6. **Remove unverified claims** (scenario framing or sources)
7. **Verify** using status reporting template
8. **Then** proceed to Phase 6

---

## Non-Negotiable Rules

1. No emojis in output
2. No "breakthrough" language without proof
3. No claims without commit SHA + verification
4. No tool chatter in status updates
5. No "we'll fix it later" on consistency
6. No hardcoded colors after tokens exist
7. No percentage claims without sources or scenario framing

---

## Success Criteria

**Design System**:
- Tokens file exists and is used
- Shared components exist and are used
- All 5 phases use consistent styling
- Visual changes made by editing tokens only

**Calculation Integrity**:
- Pure functions, testable
- Confidence levels on all outputs
- Test files exist and pass

**Credibility**:
- No unverified percentage claims
- Scenario framing or sources provided
- Assumptions disclosed

**Consistency**:
- VEDA/VADA locked to one spelling
- Status reports follow template
- No style fragmentation

---

**This is the foundation. Fix it before continuing.**