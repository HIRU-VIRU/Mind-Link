# 🎭 Demo Test Sites - PhishGuard Vision

These HTML files are **realistic test sites** designed to demonstrate PhishGuard Vision's AI-powered threat detection capabilities. Use these for:
- 📹 Demo video recording
- 🧪 Testing extension features
- 👨‍⚖️ Showing judges how the extension works
- 🎓 Educational purposes

---

## 📂 **Files Included**

### 1. **fake-paypal.html** - Phishing Detection Demo
**Purpose:** Demonstrates multi-tier phishing detection (Prompt API multimodal)

**What it simulates:**
- ✅ Lookalike domain phishing (`paypa1.com` instead of `paypal.com`)
- ✅ Suspicious TLD (`.tk` domain)
- ✅ Blurry/wrong logo (intentionally degraded for AI detection)
- ✅ Wrong brand colors (#0070BA instead of #003087)
- ✅ Urgency language ("IMMEDIATE ACTION REQUIRED")
- ✅ Fake countdown timer (creates panic)
- ✅ Suspicious form fields (asks for SSN and credit card)
- ✅ Multiple confusing buttons (common phishing tactic)
- ✅ HTTP instead of HTTPS (insecure connection)

**Expected PhishGuard Behavior:**
- 🛑 **Trust Score: 1/5** (Critical Threat)
- Red warning overlay appears
- Detects domain spoofing, visual anomalies, suspicious forms
- Blocks user from proceeding

**Demo Instructions:**
1. Open `fake-paypal.html` in Chrome (with extension installed)
2. Wait 2-3 seconds for analysis
3. Extension should show red warning
4. Capture this for demo video (0:40-1:25 section)

---

### 2. **fake-antivirus-subscription.html** - Hidden Fee Detection Demo
**Purpose:** Demonstrates 3-stage AI pipeline (Summarizer → Rewriter → Prompt API)

**What it simulates:**
- ✅ Deceptive "$1 trial" offer (actually $99.99/month after trial)
- ✅ 5000+ word Terms & Conditions (tiny font, dense legalese)
- ✅ Hidden auto-renewal clause (buried in Section 2.1)
- ✅ Non-refundable fees (Section 3.1)
- ✅ Difficult cancellation process (certified mail only, 7 days notice)
- ✅ Additional hidden fees (maintenance, support, data recovery)
- ✅ Price increase clause (can raise prices without notice)
- ✅ Urgency tactics (countdown timer, "LIMITED TIME")

**Expected PhishGuard Behavior:**
- 🔍 Detects T&C page automatically
- Shows "Analyze Terms" button
- Runs 3-stage pipeline:
  - **Stage 1:** Summarizer API condenses 5000 words → 200 words
  - **Stage 2:** Rewriter API simplifies legal jargon
  - **Stage 3:** Prompt API detects hidden fees
- Shows side panel with findings and risk warnings

**Demo Instructions:**
1. Open `fake-antivirus-subscription.html` in Chrome
2. Scroll to Terms & Conditions section
3. Click "Analyze Terms" button (bottom-right of page)
4. Wait for 3-stage analysis (15-30 seconds)
5. View results in side panel
6. Capture this for demo video (1:25-2:00 section)

---

### 3. **complex-legal-terms.html** - Language Simplification Demo
**Purpose:** Demonstrates Rewriter API for simplifying complex legal text

**What it simulates:**
- ✅ Software EULA (End User License Agreement)
- ✅ Dense legal jargon ("party of the first part", "hereinafter referred to as")
- ✅ Hidden costs ($500 initial + $250/year)
- ✅ Auto-renewal with price increases (15% per year)
- ✅ No refunds policy (buried in legalese)
- ✅ Difficult cancellation (90 days notice, certified mail only)
- ✅ Binding arbitration clause (can't join class actions)
- ✅ Complex terminology that elderly users can't understand

**Expected PhishGuard Behavior:**
- 💡 Detects complex legal text automatically
- Shows "Simplify This Legal Text" button (bottom-right)
- Uses Rewriter API to convert legalese → plain English
- Shows side-by-side comparison:
  - **Original:** Legal jargon
  - **Simplified:** 5th-grade reading level
- Highlights red flags (costs, auto-renewal, no refunds)

**Demo Instructions:**
1. Open `complex-legal-terms.html` in Chrome
2. Scroll through the dense legal text
3. Click "💡 Simplify This Legal Text" button
4. View side panel with simplified comparisons
5. Show how each clause is made understandable
6. Capture this for demo video (bonus feature showcase)

---

## 🚀 **How to Use These Test Sites**

### **Method 1: Open Locally (Recommended)**
```bash
# Navigate to project directory
cd /Users/gauthamkrishna/Projects/Mind-Link

# Open any test site in Chrome
open -a "Google Chrome" demo-test-sites/fake-paypal.html
open -a "Google Chrome" demo-test-sites/fake-antivirus-subscription.html
open -a "Google Chrome" demo-test-sites/complex-legal-terms.html
```

### **Method 2: Host on GitHub Pages (For Submission)**
1. Push this repo to GitHub (already done)
2. Go to repo Settings → Pages
3. Enable GitHub Pages (deploy from `main` branch)
4. Access via: `https://HIRU-VIRU.github.io/Mind-Link/demo-test-sites/fake-paypal.html`

### **Method 3: Use Python SimpleHTTPServer**
```bash
cd demo-test-sites
python3 -m http.server 8080
# Then open: http://localhost:8080/fake-paypal.html
```

---

## 🎥 **Recording Tips for Demo Video**

### **For Fake PayPal (Phishing Detection):**
1. **BEFORE showing the page:**
   - Show a fake email (create in Gmail or mockup tool)
   - Hover over the link to show suspicious URL
   - Click the link

2. **DURING page load:**
   - Capture the moment extension badge changes color
   - Show the analysis popup appearing
   - Capture the red warning overlay

3. **AFTER detection:**
   - Show the full warning message
   - Click "Close This Tab" to show protection
   - Cut to Sarah smiling (relief)

### **For Fake Antivirus (Hidden Fees):**
1. **SHOW the bait:**
   - Land on page with big "$1 TRIAL" banner
   - Scroll to Terms & Conditions
   - Show how tiny and long the text is

2. **TRIGGER analysis:**
   - Click "Analyze Terms" button
   - Show loading stages (may need to animate in post)
   - Show progress indicators

3. **REVEAL findings:**
   - Side panel slides in
   - Show original text (complex)
   - Show simplified text (plain English)
   - Highlight "$99.99/month" in red
   - Show "Decline Offer" click

### **For Complex Legal (Simplification):**
1. **SHOW the problem:**
   - Scroll through dense legal text
   - Zoom in on confusing paragraph
   - Show confused expression (if showing face)

2. **TRIGGER simplification:**
   - Click "Simplify This Legal Text" button
   - Panel slides in

3. **SHOW the solution:**
   - Before/After comparison
   - Highlight how much clearer it is
   - Show elderly user understanding it

---

## ⚠️ **Important Notes**

### **For Hackathon Judges:**
These sites are **intentionally malicious-looking** for demonstration purposes. They include:
- Fake phishing indicators (for AI detection testing)
- Hidden subscription traps (to show summarization/analysis)
- Complex legal text (to demonstrate simplification)

**No actual data is collected.** All forms have `onsubmit="return false"` to prevent submission.

### **Safety Disclaimers:**
Each test site includes a disclaimer at the bottom:
> "⚠️ This is a FAKE site for demo purposes only ⚠️"

This ensures:
- Users know it's a test environment
- No accidental data entry
- Clear educational purpose

### **Ethical Considerations:**
- These sites are for **testing/education only**
- Never use for actual phishing
- Never deploy on public internet without clear warnings
- Only use in controlled demo environments

---

## 🧪 **Testing Extension Features**

### **Test Checklist for Fake PayPal:**
- [ ] Domain analysis detects `.tk` TLD
- [ ] Detects "paypa1" lookalike
- [ ] Visual analysis catches blurry logo
- [ ] Detects wrong brand colors
- [ ] Flags password field on HTTP
- [ ] Identifies suspicious form fields (SSN, credit card)
- [ ] Shows red warning overlay
- [ ] Trust score = 1/5

### **Test Checklist for Fake Antivirus:**
- [ ] Detects T&C page automatically
- [ ] Shows "Analyze Terms" button
- [ ] Summarizer condenses 5000 words
- [ ] Rewriter simplifies legal jargon
- [ ] Prompt API detects hidden fees
- [ ] Shows $99.99/month auto-renewal
- [ ] Highlights "non-refundable" clause
- [ ] Shows risk indicators

### **Test Checklist for Complex Legal:**
- [ ] Detects complex legal text
- [ ] Shows "Simplify" button
- [ ] Rewriter converts to plain English
- [ ] Shows side-by-side comparison
- [ ] Identifies all hidden costs
- [ ] Flags difficult cancellation terms
- [ ] Highlights binding arbitration

---

## 📝 **Customization Tips**

Want to create your own test sites? Here's what makes them effective:

### **For Phishing Sites:**
- Use lookalike domains in HTML comments
- Slightly wrong logos (blur, wrong color)
- Urgency language ("act now", "suspended")
- Multiple buttons (confusing UI)
- Request sensitive info (SSN, credit card)
- Fake countdown timers
- HTTP instead of HTTPS (in comments/metadata)

### **For Subscription Traps:**
- Large flashy offer ($1 trial)
- VERY long T&C (3000+ words)
- Bury hidden fees in middle sections
- Use complex legal language
- Include auto-renewal clause
- Non-refundable policy
- Difficult cancellation process

### **For Complex Legal:**
- Use legal jargon ("hereinafter", "party of first part")
- Long sentences (50+ words)
- Multiple nested clauses
- Hidden important terms in dense paragraphs
- Formal language (not conversational)
- Confusing structure

---

## 🎬 **Demo Video Shot List**

Use these test sites for these specific shots:

| Test Site | Video Timestamp | Shot Purpose |
|-----------|----------------|--------------|
| `fake-paypal.html` | 0:40 - 1:25 | Phishing detection demo (Feature #1) |
| `fake-antivirus-subscription.html` | 1:25 - 2:00 | Hidden fee detection demo (Feature #2) |
| `complex-legal-terms.html` | Bonus/Extra | Language simplification showcase (Feature #3) |

---

## ✅ **Quick Start for Demo Day**

1. **Install extension** in Chrome (load unpacked from repo)
2. **Bookmark these test sites:**
   - fake-paypal.html
   - fake-antivirus-subscription.html
   - complex-legal-terms.html
3. **Test each feature** works correctly
4. **Record screen captures** following VIDEO_PRODUCTION_GUIDE.md
5. **Edit into final video** following DEMO_SCRIPT.md

---

## 🏆 **Why These Test Sites Win**

**Authentic-looking:** Judges will see real-world scenarios, not toy examples

**Comprehensive:** Cover all extension features (phishing, hidden fees, simplification)

**Dramatic:** Create "wow moments" when extension catches threats

**Educational:** Show clear before/after comparisons

**Professional:** High-quality HTML/CSS, realistic design

---

## 📞 **Questions?**

If any test site doesn't work as expected:
1. Check extension is installed and enabled
2. Check browser console for errors (F12 → Console)
3. Verify API bridge is loaded (check Network tab)
4. Test on a fresh Chrome profile (to rule out conflicts)

---

**Ready to film your winning demo? Let's go! 🎬🚀**
