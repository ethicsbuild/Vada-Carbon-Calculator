# VEDA Carbon Calculator - Visual Aesthetic Guide

## The New Aesthetic (Phases 3 & 4)

### Core Principles
- **Light, bright, nature-inspired** (not dark/techy)
- **Calm but capable** (professional, not corporate)
- **Grounded, not futuristic** (practical working tool)
- **Breathing room** (generous spacing, not cramped)

---

## Color Palette

### Primary Colors (Nature-Inspired)
```
Emerald (Core Decisions):
- emerald-50: #f0fdf4  (backgrounds)
- emerald-200: #a7f3d0  (borders)
- emerald-300: #6ee7b7  (hover states)
- emerald-600: #059669  (icons, accents)
- emerald-700: #047857  (text)

Blue (Systems Thinking):
- blue-50: #eff6ff     (backgrounds)
- blue-200: #bfdbfe    (borders)
- blue-600: #2563eb    (icons, accents)
- blue-700: #1d4ed8    (text)

Amber (Leverage Points):
- amber-50: #fffbeb    (backgrounds)
- amber-200: #fde68a   (borders)
- amber-600: #d97706   (icons, accents)
- amber-700: #b45309   (text)

Slate (Neutral/Tradeoffs):
- slate-50: #f8fafc    (backgrounds)
- slate-200: #e2e8f0   (borders)
- slate-600: #475569   (secondary text)
- slate-700: #334155   (body text)
- slate-800: #1e293b   (headings)
```

---

## Component Patterns

### 1. Section Headers
```tsx
<div className="space-y-3">
  <h2 className="text-2xl font-semibold text-slate-800">
    Section Title
  </h2>
  <p className="text-slate-600 leading-relaxed">
    Clear, conversational description of what this section is about.
  </p>
</div>
```

### 2. Basic Mode Cards (Core Decisions)
```tsx
<Card className="border-emerald-200 bg-white">
  <CardHeader className="bg-emerald-50/50">
    <CardTitle className="text-lg text-slate-800">Core Strategy</CardTitle>
    <CardDescription className="text-slate-600">
      3-4 questions • ~2 minutes
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6 pt-6">
    {/* Questions here */}
  </CardContent>
</Card>
```

### 3. Detailed Mode Cards (Advanced Options)
```tsx
<Card className="border-amber-200 bg-white">
  <CardHeader className="bg-amber-50/50">
    <CardTitle className="text-lg text-slate-800">Detailed Options</CardTitle>
    <CardDescription className="text-slate-600">
      4-6 additional questions • ~2-3 minutes • More precise modeling
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6 pt-6">
    {/* Detailed questions here */}
  </CardContent>
</Card>
```

### 4. Systems Thinking Callouts
```tsx
<Card className="border-blue-200 bg-blue-50/30">
  <CardContent className="pt-6">
    <div className="flex items-start space-x-3">
      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800">
          Systems Connections
        </p>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• <strong>Section:</strong> How this connects</li>
        </ul>
      </div>
    </div>
  </CardContent>
</Card>
```

### 5. Reality Check / Honesty Callouts
```tsx
<Card className="border-blue-200 bg-blue-50/40">
  <CardContent className="pt-6">
    <div className="flex items-start space-x-3">
      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-800">
          Reality Check Title
        </p>
        <p className="text-sm text-slate-700">
          Honest, grounded explanation of constraints or context.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

### 6. Radio Group Options (Decision Choices)
```tsx
<RadioGroup value={data.field} onValueChange={...}>
  <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-slate-200 hover:border-emerald-300 transition-colors">
    <RadioGroupItem value="option-1" id="option-1" className="mt-1" />
    <div className="flex-1">
      <Label htmlFor="option-1" className="font-medium text-slate-800 cursor-pointer">
        Option Title
      </Label>
      <p className="text-sm text-slate-600 mt-1">
        Clear explanation of what this option means and its implications.
      </p>
    </div>
  </div>
</RadioGroup>
```

### 7. Question Labels with Icons
```tsx
<Label className="text-base font-medium text-slate-800 flex items-center">
  <IconComponent className="h-4 w-4 mr-2 text-emerald-600" />
  Question text
</Label>
<p className="text-sm text-slate-600">
  Context or explanation for the question.
</p>
```

---

## Results Display Patterns

### 1. Impact Summary Cards
```tsx
<Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
  <CardHeader>
    <CardTitle className="text-slate-800">Section Impact</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Impact metrics */}
  </CardContent>
</Card>
```

### 2. Leverage Points
```tsx
<Card className="border-amber-200 bg-amber-50/30">
  <CardHeader>
    <CardTitle className="text-lg text-slate-800 flex items-center">
      <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
      Leverage Points
    </CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-3">
      {points.map((point, index) => (
        <li key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-amber-200">
          <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-700">{point}</span>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>
```

### 3. Tradeoffs
```tsx
<Card className="border-slate-200">
  <CardHeader>
    <CardTitle className="text-lg text-slate-800">Tradeoffs to Consider</CardTitle>
  </CardHeader>
  <CardContent>
    <ul className="space-y-3">
      {tradeoffs.map((tradeoff, index) => (
        <li key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded">
          <Info className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-700">{tradeoff}</span>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>
```

### 4. Honesty-First Alerts
```tsx
<Alert className="border-amber-200 bg-amber-50/50">
  <AlertTriangle className="h-4 w-4 text-amber-600" />
  <AlertDescription className="text-sm text-slate-700">
    <strong>Important:</strong> Honest acknowledgment of uncertainty or constraints.
  </AlertDescription>
</Alert>
```

---

## Typography

### Headings
```
Section Title: text-2xl font-semibold text-slate-800
Card Title: text-lg text-slate-800
Subsection: text-base font-medium text-slate-800
```

### Body Text
```
Primary: text-slate-700
Secondary: text-slate-600
Tertiary: text-slate-500
```

### Descriptions
```
Card descriptions: text-slate-600
Question context: text-sm text-slate-600
Helper text: text-xs text-slate-500
```

---

## Spacing & Layout

### Section Spacing
```tsx
<div className="space-y-6">  // Between major elements
  <div className="space-y-3">  // Section header group
  <Card className="space-y-6 pt-6">  // Within cards
```

### Card Padding
```tsx
<CardHeader className="bg-emerald-50/50">  // Subtle background
<CardContent className="space-y-6 pt-6">   // Generous internal spacing
```

### Question Spacing
```tsx
<div className="space-y-3">  // Question group
  <Label>...</Label>
  <p className="text-sm">...</p>  // Context
  <RadioGroup className="space-y-3">  // Options
```

---

## Interactive States

### Hover States
```
Radio options: hover:border-emerald-300
Buttons: hover:bg-emerald-50
Cards: hover:shadow-sm (subtle)
```

### Focus States
```
Inputs: focus:ring-emerald-500
Radio: focus:ring-emerald-500
```

### Transitions
```
transition-colors (for border/background changes)
transition-shadow (for elevation changes)
```

---

## Icon Usage

### Section Icons (Larger, Colored)
```tsx
<Zap className="h-5 w-5 text-emerald-600" />  // Section headers
<MapPin className="h-4 w-4 mr-2 text-emerald-600" />  // Question labels
```

### Result Icons (Contextual)
```tsx
<Lightbulb className="h-5 w-5 text-amber-600" />  // Leverage points
<Info className="h-5 w-5 text-blue-600" />  // Systems thinking
<AlertTriangle className="h-4 w-4 text-amber-600" />  // Warnings
```

---

## Before & After Comparison

### OLD (Generic Dashboard)
```tsx
<Card>
  <CardHeader>
    <CardTitle>Power Source</CardTitle>
  </CardHeader>
  <CardContent>
    <Select>...</Select>
  </CardContent>
</Card>
```

### NEW (Nature-Inspired, Contextual)
```tsx
<Card className="border-emerald-200 bg-white">
  <CardHeader className="bg-emerald-50/50">
    <CardTitle className="text-lg text-slate-800 flex items-center">
      <Zap className="h-5 w-5 text-emerald-600 mr-2" />
      How the Event Is Powered (and Backed Up)
    </CardTitle>
    <CardDescription className="text-slate-600">
      3 questions • ~2 minutes
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6 pt-6">
    <div className="space-y-3">
      <Label className="text-base font-medium text-slate-800">
        Primary power source
      </Label>
      <p className="text-sm text-slate-600">
        What powers the event under normal conditions?
      </p>
      <RadioGroup className="space-y-3">
        {/* Options with descriptions */}
      </RadioGroup>
    </div>
  </CardContent>
</Card>
```

---

## Key Differences from Generic Dashboards

1. **Color Purpose**: Colors have meaning (emerald = decisions, blue = systems, amber = opportunities)
2. **Breathing Room**: Generous spacing (space-y-6, not space-y-4)
3. **Context Everywhere**: Every question has explanatory text
4. **Subtle Backgrounds**: /50 opacity for gentle visual separation
5. **Icon Integration**: Icons add visual clarity, not decoration
6. **Honest Tone**: Language is conversational, not corporate
7. **Progressive Disclosure**: Basic first, detailed optional
8. **Systems Thinking**: Explicit connections between sections

---

## Implementation Checklist

When creating/updating a section:
- [ ] Use emerald for core decision cards
- [ ] Use amber for detailed/advanced cards
- [ ] Use blue for systems thinking callouts
- [ ] Add icons to section headers and question labels
- [ ] Include context text for every question
- [ ] Use space-y-6 for major spacing
- [ ] Add bg-{color}-50/50 to card headers
- [ ] Include time estimates in card descriptions
- [ ] Add systems thinking footer
- [ ] Use conversational, honest language

---

**This is a working tool for producers, not a marketing site.**
**Light, bright, nature-inspired. Calm but capable. Grounded, not futuristic.**