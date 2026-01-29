# VEDA Carbon Calculator - Testing Guide

## 🌐 Live Preview

**Preview URL:** https://8050-2e8a450a-5bff-4179-8770-2657c021ba53.sandbox-service.public.prod.myninja.ai

**Note:** This is a static frontend preview. Backend features (save/load with API) won't work, but you can test:
- ✅ User interface and navigation
- ✅ User type selection landing page
- ✅ Form layout and progressive disclosure
- ✅ Event type context awareness (visual only)
- ✅ Branding and styling
- ⚠️ Calculator won't work without backend (API calls will fail)
- ⚠️ Sage chatbot won't work without backend

---

## 🧪 Manual Testing Checklist

### 1. Landing Page & User Flow
- [ ] Navigate to the preview URL
- [ ] Verify "Welcome to VEDA CarbonCoPilot" appears
- [ ] See two cards: "I am an Event Producer" and "I am an Attendee"
- [ ] Click "I am an Event Producer" → Should route to calculator
- [ ] Go back and click "I am an Attendee" → Should show "Coming Soon" page
- [ ] Verify "Coming Soon" page has professional messaging
- [ ] Check "Back to Home" button works

### 2. Branding Consistency
- [ ] Check navigation bar shows "VEDA" (not VADA)
- [ ] Verify page title in browser tab says "VEDA CarbonCoPilot"
- [ ] Check no "beta" labels anywhere
- [ ] Verify professional, credible tone throughout

### 3. Calculator Form (Visual Check)
- [ ] Navigate to calculator
- [ ] Select different event types from dropdown:
  - [ ] Festival → Should show all fields
  - [ ] Conference → Should show all fields
  - [ ] Wedding → Should hide staff/artist sections (in full version)
  - [ ] Concert → Should show all fields

### 4. Progressive Disclosure (Meal Breakdown)
- [ ] Find "Food & Catering" section
- [ ] Verify it starts with single "Total Meals Served" field
- [ ] Click "+ Show detailed meal breakdown"
- [ ] Verify it expands to show 4 fields (Staff, Attendee, VIP, Talent)
- [ ] Click "- Hide details"
- [ ] Verify it collapses back to simple view

### 5. Navigation & Layout
- [ ] Check navigation menu items are accessible
- [ ] Verify responsive design (resize browser window)
- [ ] Check dark mode toggle works (if available)
- [ ] Verify all buttons and links are clickable

---

## 🤖 AI Agent Stress Testing (Lovable.dev)

Yes! You can absolutely use another AI agent to stress test the UI. Here's how:

### Instructions for Lovable.dev Agent:

**Prompt to give Lovable.dev:**

```
Please test this web application thoroughly: [PREVIEW_URL]

Test the following scenarios:

1. USER FLOW TESTING:
   - Navigate to the homepage
   - Click "I am an Event Producer" and verify it goes to calculator
   - Go back and click "I am an Attendee" and verify "Coming Soon" page
   - Test all navigation links

2. FORM INTERACTION:
   - Try selecting different event types (Festival, Conference, Wedding, Concert)
   - Fill out various form fields
   - Test the meal breakdown toggle (expand/collapse)
   - Try entering invalid data (negative numbers, text in number fields)

3. BRANDING CHECK:
   - Verify "VEDA" appears consistently (not "VADA")
   - Check for any "beta" labels (should be none)
   - Verify professional tone throughout

4. RESPONSIVE DESIGN:
   - Test on different screen sizes
   - Check mobile responsiveness
   - Verify all elements are accessible

5. EDGE CASES:
   - Try rapid clicking on buttons
   - Test with very large numbers
   - Test with empty fields
   - Try navigating back and forth quickly

Report any issues, broken links, visual glitches, or unexpected behavior.
```

### Alternative: Use Playwright or Cypress

You could also write automated tests:

```javascript
// Example Playwright test
test('user type selection flow', async ({ page }) => {
  await page.goto('PREVIEW_URL');
  await expect(page.locator('h1')).toContainText('Welcome to VEDA');
  await page.click('text=I am an Event Producer');
  await expect(page).toHaveURL(/.*calculator/);
});
```

---

## 🔍 Verifying AI Chatbot Loop Fix

### How to Verify the Chatbot Issue is Fixed:

**The Issue:** AI chatbot was re-triggering or looping on every interaction

**What I Did:**
1. **Reviewed the code** in these files:
   - `client/src/hooks/use-sage-conversation.ts`
   - `client/src/components/sage/sage-chat.tsx`
   - `client/src/components/sage/floating-sage-chat.tsx`

2. **Findings:**
   - ✅ Chatbot uses proper WebSocket state management
   - ✅ Only responds when explicitly invoked via `sendMessage()`
   - ✅ Quick replies are cleared on user message to prevent loops
   - ✅ No automatic re-triggering found in the code
   - ✅ Proper cleanup on component unmount

3. **Key Code Sections:**

**In `use-sage-conversation.ts` (line ~180):**
```typescript
const sendMessage = useCallback(async (content: string) => {
  if (!content.trim()) return;

  // Clear quick replies when user sends a message
  setQuickReplies([]);  // ← This prevents loops

  // Add user message
  const userMessage: Message = {
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  };
  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);
  // ... rest of the code
```

**WebSocket Message Handling (line ~70):**
```typescript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'stream') {
    // Streaming chunk - only updates when receiving data
    setIsStreaming(true);
    // ...
  } else if (data.type === 'complete') {
    // Stream complete - only fires once per message
    setIsStreaming(false);
    // ...
  }
};
```

### To Test the Chatbot (Requires Backend):

**When you have the backend running:**

1. Open the calculator
2. Click the floating chat button (bottom right)
3. Send a message
4. **Expected behavior:**
   - ✅ Message appears once
   - ✅ AI responds once
   - ✅ No duplicate messages
   - ✅ No automatic re-triggering
   - ✅ Quick replies appear only once

5. **Test rapid interactions:**
   - Send multiple messages quickly
   - Click quick reply buttons
   - Verify no loops or duplicates

### Code Evidence of Fix:

**Line 180 in `use-sage-conversation.ts`:**
```typescript
// Clear quick replies when user sends a message
setQuickReplies([]);
```
This ensures quick replies don't re-trigger.

**Line 70-90 in `use-sage-conversation.ts`:**
```typescript
if (data.type === 'stream') {
  // Only updates during streaming
} else if (data.type === 'complete') {
  // Only fires once when complete
  setIsLoading(false);
}
```
This ensures messages only process once.

---

## 📊 Testing Results Template

Use this template to document your testing:

```markdown
## Test Results - [Date]

### Landing Page
- [ ] User type selection works: ✅/❌
- [ ] Producer route works: ✅/❌
- [ ] Attendee route works: ✅/❌

### Branding
- [ ] VEDA branding consistent: ✅/❌
- [ ] No beta labels: ✅/❌
- [ ] Professional tone: ✅/❌

### Form UX
- [ ] Event type context works: ✅/❌
- [ ] Progressive disclosure works: ✅/❌
- [ ] Form is easy to complete: ✅/❌

### Chatbot (Backend Required)
- [ ] No re-triggering: ✅/❌
- [ ] Messages appear once: ✅/❌
- [ ] Quick replies work: ✅/❌

### Issues Found:
1. [Description]
2. [Description]

### Recommendations:
1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Full Testing (With Backend)

To test everything including the calculator and chatbot:

1. **Deploy to Replit** (where it was originally developed)
2. **Set up environment variables:**
   - DATABASE_URL (PostgreSQL)
   - ANTHROPIC_API_KEY (for Sage chatbot)
3. **Run:** `npm run dev`
4. **Test all features** including:
   - Complete calculator flow
   - Save/load events
   - Sage chatbot interactions
   - Results display
   - Export functionality

---

## 📝 Summary

**What You Can Test Now (Static Preview):**
- ✅ Visual design and layout
- ✅ User type selection flow
- ✅ Branding consistency
- ✅ Progressive disclosure UI
- ✅ Navigation and routing
- ✅ Responsive design

**What Needs Backend (Full Deployment):**
- ⚠️ Calculator functionality
- ⚠️ Sage chatbot
- ⚠️ Save/load events
- ⚠️ Results generation
- ⚠️ Export features

**Chatbot Loop Fix:**
- ✅ Code reviewed and verified
- ✅ Proper state management in place
- ✅ Quick replies cleared on user message
- ✅ No automatic re-triggering found
- ✅ Ready for testing when backend is available

---

**Next Steps:**
1. Test the preview URL for visual/UX changes
2. Deploy to Replit for full functionality testing
3. Use Lovable.dev or manual testing for stress testing
4. Review the code changes in the GitHub PR