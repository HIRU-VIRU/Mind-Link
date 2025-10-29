# Testing Instructions for Judges

## Google Chrome Built-in AI Challenge 2025
## PhishGuard Vision - Complete Testing Guide

---

## Prerequisites

### 1. Chrome Version Required
- **Minimum:** Chrome Canary 120+
- **Recommended:** Chrome Dev 121+

### 2. Enable Chrome AI APIs (CRITICAL)

**Step-by-step:**

1. Open Chrome flags:
   ```
   chrome://flags/
   ```

2. Search and enable these flags:
   - `#optimization-guide-on-device-model` → **Enabled**
   - `#prompt-api-for-gemini-nano` → **Enabled**
   - `#summarization-api-for-gemini-nano` → **Enabled**
   - `#rewriter-api-for-gemini-nano` → **Enabled**
   - `#translation-api` → **Enabled**

3. Restart Chrome

4. Wait for Gemini Nano download (automatic, ~1-2 minutes)
   - Check: `chrome://components/`
   - Look for "Optimization Guide On Device Model"
   - Should show "Up-to-date"

---

## Installation

### Load Extension

1. Open Extensions page:
   ```
   chrome://extensions/
   ```

2. Enable "Developer mode" (top-right toggle)

3. Click "Load unpacked"

4. Select the project folder

5. Verify:
   - Extension icon appears in toolbar
   - No errors in console

---

## Test Suite (10-15 minutes)

### TEST 1: Popup Dashboard ✅

**Time:** 2 minutes

**Steps:**
1. Click extension icon in toolbar
2. Verify you see:
   - Modern gradient header "PhishGuard Vision"
   - Circular trust score visualization
   - Statistics grid (Ads Blocked, Threats Blocked)
   - Language selector dropdown
   - "Refresh Analysis" button

**Expected Result:**
- ✅ Clean, modern UI loads
- ✅ All elements visible
- ✅ No console errors

**Screenshot:** [Take screenshot for your report]

---

### TEST 2: Multi-Language Support 🌍

**Time:** 1 minute

**Steps:**
1. Open popup
2. Click language dropdown
3. Select "Español" (Spanish)
4. Verify labels change:
   - "Trust Score" → "Puntuación de Confianza"
   - "Refresh Analysis" → "Actualizar Análisis"
5. Try other languages (French, German, Japanese)

**Expected Result:**
- ✅ Language changes instantly
- ✅ Preference saved (reload popup, still Spanish)
- ✅ No layout breaks

**API Verified:** ✅ Translator API

---

### TEST 3: Phishing Detection (Legitimate Site) 🟢

**Time:** 2 minutes

**Steps:**
1. Visit: `https://github.com`
2. Wait 3 seconds
3. Observe:
   - No warning banner
   - Page loads normally
4. Open popup
5. Verify:
   - Trust score: 4-5 (green)
   - Label: "Safe"
   - Message: "This site appears safe"

**Expected Result:**
- ✅ No false positives
- ✅ Fast analysis (<3s)
- ✅ Green trust score

**API Verified:** ✅ Prompt API (Domain Analysis)

**Console Logs to Check:**
```
[Mind-Link] Skipping analysis - top global site: github.com
```

---

### TEST 4: Phishing Detection (Suspicious Site) 🔴

**Time:** 3 minutes

**Steps:**
1. Visit a suspicious site (example: `http://bet83067.com`)
   - OR create a test HTML page with:
     - "paypa1.com" in title
     - "Act now! Account suspended!" text
     - Password input field
2. Wait 5-10 seconds for full analysis
3. Observe:
   - Red warning banner at top
   - Title: "🛑 DANGER: This site looks very suspicious"
   - Detailed findings
4. Open popup
5. Verify:
   - Trust score: 1-2 (red)
   - Circular progress shows low score
   - "Threats Blocked" counter increased

**Expected Result:**
- ✅ Warning banner appears
- ✅ Clear, actionable message
- ✅ Red trust score in popup

**API Verified:** 
- ✅ Prompt API (Domain + Text Analysis)
- ✅ Prompt API (Multimodal - if screenshot captured)

**Console Logs to Check:**
```
[Mind-Link] Domain legitimacy result: {isLikelyLegitimate: false, confidence: 2}
[Mind-Link] Trust score calculation: {domain: 1, textual: 1, visual: 2, finalScore: 1}
[Mind-Link] Trust score stored: 1
```

---

### TEST 5: T&C Analysis (3-Stage Pipeline) 📄

**Time:** 3 minutes

**Steps:**
1. Visit a pricing/subscription page:
   - Example: `https://www.mcafee.com/pricing` (if available)
   - OR use test HTML with 500+ words of T&C text

2. Look for fixed button in bottom-right corner

3. Wait for automatic analysis OR click "Analyze Terms" button

4. Wait 15-30 seconds (3 AI stages running)

5. Observe:
   - Button shows "Analyzing..." (orange)
   - Then changes to "View T&C Analysis" (green)
   - If hidden fees found: Warning banner appears

6. Click "View T&C Analysis" button

7. Verify modal shows:
   - **Section 1:** Summary (~200 words)
   - **Section 2:** Simplified version (plain language)
   - **Section 3:** Key findings (bullet points)

**Expected Result:**
- ✅ Three distinct stages visible
- ✅ Summary is shorter than original
- ✅ Simplified version is easy to understand
- ✅ Key findings highlight hidden fees

**APIs Verified:** 
- ✅ Summarizer API (Stage 1)
- ✅ Rewriter API (Stage 2)
- ✅ Prompt API (Stage 3)

**Console Logs to Check:**
```
[Mind-Link Terms Analyzer] Stage 1: Summarizing T&C...
[Mind-Link Terms Analyzer] Stage 2: Simplifying language...
[Mind-Link Terms Analyzer] Stage 3: Detecting hidden fees...
[Mind-Link Terms Analyzer] Analysis complete
```

---

### TEST 6: Ad Blocking 🚫

**Time:** 2 minutes

**Steps:**
1. Visit ad-heavy news site:
   - Example: `https://www.cnn.com` or `https://www.forbes.com`

2. Wait 5 seconds

3. Observe:
   - Fewer ads compared to no extension
   - "Ads Blocked" count in popup

4. Open browser console (F12)

5. Check for:
   ```
   [Mind-Link] Ad learning started
   [Mind-Link] Found 5 potential ad elements
   [Mind-Link] Blocked: div.advertisement
   ```

6. Open popup

7. Verify "Ads Blocked" count increased

**Expected Result:**
- ✅ Ads blocked dynamically
- ✅ Count updates in real-time
- ✅ Page still loads correctly

**API Verified:** ✅ Prompt API (Ad Pattern Learning)

---

### TEST 7: Performance & Caching ⚡

**Time:** 2 minutes

**Steps:**
1. Visit `https://github.com` (first time)
2. Note analysis time in console (~3 seconds)
3. Close tab
4. Visit `https://github.com` again (second time)
5. Note analysis time (~<1 second, cached)

6. Check console:
   ```
   [Mind-Link] Using cached domain analysis (age: 2 minutes)
   ```

7. Try visiting same domain 3 times rapidly
8. Verify rate limiting:
   ```
   [Mind-Link] Rate limit: Check throttled (retry in 4s)
   ```

**Expected Result:**
- ✅ First visit: Full analysis
- ✅ Second visit: Instant (cached)
- ✅ Rapid visits: Throttled

**Optimization Verified:**
- ✅ 24-hour domain caching
- ✅ 5-second rate limiting

---

## Advanced Testing (Optional)

### TEST 8: Multimodal Image Analysis 📸

**Requirements:** Active tab with suspicious visual elements

**Steps:**
1. Create test page with:
   - Blurry PayPal logo
   - Fake "Download" button
   - Misspelled "Security Badge"

2. Visit page (must be active tab)

3. Wait for analysis

4. Check console:
   ```
   [Mind-Link] Capturing screenshot for visual analysis
   [Mind-Link] Screenshot captured successfully
   [Mind-Link] Visual analysis: {visualSuspicious: true, visualTrustScore: 2}
   ```

5. Verify warning mentions visual issues:
   "Logo is blurry and low quality"

**API Verified:** ✅ Prompt API (Multimodal - Image Input)

---

### TEST 9: Translation of Warnings 🌐

**Steps:**
1. Change popup language to Spanish
2. Visit suspicious site
3. Verify warning banner is in Spanish:
   - "🛑 PELIGRO: Este sitio parece muy sospechoso"

**API Verified:** ✅ Translator API (Warning Translation)

---

## Troubleshooting

### Issue: "Chrome AI not available"

**Solution:**
1. Check flags are enabled (see Prerequisites)
2. Verify Gemini Nano downloaded:
   - `chrome://components/`
   - "Optimization Guide On Device Model" = "Up-to-date"
3. Restart Chrome
4. Wait 2-3 minutes after restart

### Issue: Screenshot capture fails

**Solution:**
- Make sure tab is **active/visible**
- Chrome can only capture visible tabs
- Switch to suspicious tab before analysis

### Issue: No warning on scam site

**Solution:**
1. Check console for errors
2. Verify trust score stored:
   ```javascript
   chrome.storage.local.get(null, (data) => console.log(data))
   ```
3. Try manual recheck (click "Refresh Analysis")

---

## Expected Console Output (Clean Run)

```
[Mind-Link Bridge] Initializing...
[Mind-Link Bridge] api.js injected into MAIN world
[Mind-Link Translator] Initializing...
[Mind-Link Translator] Detected language: en
[Mind-Link Translator] Initialized successfully
[Mind-Link] Checking domain legitimacy for: example.com
[Mind-Link] Domain legitimacy result: {isLikelyLegitimate: true, confidence: 4}
[Mind-Link] Domain appears legitimate with high confidence (4/5)
[Mind-Link] Trust score stored: 4
```

**No errors, no warnings.**

---

## Performance Benchmarks

### Expected Timings

| Operation | Time | Notes |
|-----------|------|-------|
| Popup load | <500ms | Instant |
| Domain analysis (first) | 2-4s | AI processing |
| Domain analysis (cached) | <100ms | Cache hit |
| T&C 3-stage pipeline | 10-15s | 3 AI calls |
| Screenshot capture | 1-2s | If tab active |
| Warning translation | 500ms-1s | Per language |

### Memory Usage

- **Extension:** ~20-40MB
- **Gemini Nano:** ~100-200MB (shared)
- **Total:** <250MB

---

## Checklist for Judges

**Before submitting evaluation:**

- [ ] All flags enabled and Gemini Nano downloaded
- [ ] Extension loaded without errors
- [ ] Popup dashboard displays correctly
- [ ] Language selector works (tested 2+ languages)
- [ ] Phishing detection works on safe site
- [ ] Phishing detection works on suspicious site
- [ ] T&C analysis 3-stage pipeline completes
- [ ] Ad blocking works on news site
- [ ] Caching and rate limiting verified
- [ ] Console shows no critical errors

---

## Support

If you encounter any issues during testing:

1. **Check Console:** Open DevTools (F12) → Console tab
2. **Export Logs:** Right-click console → "Save as..."
3. **Contact:** [your.email@example.com]

---

## Expected Test Results Summary

| Test | API Used | Expected Outcome | Time |
|------|----------|------------------|------|
| 1. Popup UI | - | Modern dashboard loads | 2min |
| 2. Multi-language | Translator | 10 languages work | 1min |
| 3. Safe site | Prompt | Green trust score | 2min |
| 4. Scam site | Prompt | Red warning banner | 3min |
| 5. T&C analysis | Summarizer + Rewriter + Prompt | 3-stage pipeline | 3min |
| 6. Ad blocking | Prompt + declarativeNetRequest | Ads blocked | 2min |
| 7. Performance | - | Caching works | 2min |

**Total Testing Time:** 15 minutes

---

**Thank you for testing PhishGuard Vision!** 🛡️

*Built to protect elderly users from online scams*