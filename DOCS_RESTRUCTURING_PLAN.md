# 📋 Documentation Website Restructuring Plan

**Created:** October 27, 2025  
**Owner:** Lars & Elin (Authorization Product Manager)  
**Goal:** Improve navigation, onboard SBSL/TE, and implement user-centric documentation structure

---

## 🎯 Executive Summary

**Problem:** Current docs treat "Authorization" as one monolithic product, but users interact with specific elements (Systembruker, Tilgangsstyring, etc.). Navigation is too deep, search is poor, and onboarding is difficult.

**Solution:** Break Authorization into discrete products, flatten navigation, add AI search, and apply Diataxis consistently.

---

## 📊 Priority Matrix

| Change | Priority | Effort | Impact | Timeline |
|--------|----------|--------|--------|----------|
| **1. Break up Authorization into products** | 🔴 HIGH | Medium | High | Week 1-2 |
| **2. Create Systembruker product page** | 🔴 HIGH | Small | High | Week 1 |
| **3. Integrate AI search** | 🟡 MEDIUM | High | High | Week 3-4 |
| **4. Flatten navigation structure** | 🟡 MEDIUM | Medium | Medium | Week 2 |
| **5. Apply Diataxis consistently** | 🟢 LOW | Medium | Medium | Week 3-4 |
| **6. Add feedback mechanism (Slack integration)** | 🟢 LOW | Medium | Low | Future |

---

## 🚀 Phase 1: Quick Wins (Week 1-2)

### ✅ Task 1.1: Restructure Authorization Products
**Why:** Users think in terms of elements (Systembruker, Tilgangsstyring), not "Authorization"  
**Deliverable:** Updated `products.json` with Authorization split into 4-6 products

**Action Items:**
- [ ] Meet with Elin to confirm exact product names and descriptions
- [ ] Update `products.json` structure (see example below)
- [ ] Create individual product pages for each element
- [ ] Test navigation with Elin's team

**Estimated Time:** 3-4 days

---

### ✅ Task 1.2: Create Systembruker Product Page (Priority)
**Why:** SBSL/TE onboarding depends on clear Systembruker documentation  
**Deliverable:** Dedicated Systembruker product with Diataxis structure

**Action Items:**
- [ ] Create `/systembruker` route
- [ ] Build product landing page with sections:
  - 📖 **Explanation:** "Om Systembruker" (concepts, use cases)
  - 🚀 **Tutorial:** "Kom i gang" (onboarding guide for SBSL/TE)
  - 📚 **How-to:** Task-based guides (create, manage, permissions)
  - 📑 **Reference:** API docs, technical specs
- [ ] Coordinate content with Elin's team (they're writing in VS Code w/ Copilot)
- [ ] Deploy and share for feedback

**Estimated Time:** 2-3 days

---

### ✅ Task 1.3: Flatten Navigation
**Why:** Current structure too deep ("rotet struktur, vanskelig å finne")  
**Deliverable:** Homepage shows all main products directly (no nested dropdowns)

**Action Items:**
- [ ] Update homepage to show Authorization elements as separate cards
- [ ] Reduce max nesting to 2 levels
- [ ] Test with users (can they find Systembruker quickly?)

**Estimated Time:** 1 day

---

## 🔍 Phase 2: Search & Discoverability (Week 3-4)

### ✅ Task 2.1: Integrate AI Search
**Why:** Users give up due to poor search ("low-hanging fruit" per Elin)  
**Owner:** Bjorn Erik (backend), Lars (frontend integration)  
**Deliverable:** AI-powered search that generates relevant URLs

**Action Items:**
- [ ] Coordinate with Bjorn Erik on API/integration
- [ ] Replace current search component with AI search
- [ ] Configure ranking (article titles > body content)
- [ ] Test search quality with Authorization team
- [ ] Monitor usage and feedback

**Estimated Time:** 5-7 days (depends on Bjorn Erik's delivery)

---

### ✅ Task 2.2: Add Search Placeholder (Interim)
**Why:** Show users search is coming  
**Deliverable:** Enhanced search UI ready for AI backend

**Action Items:**
- [ ] Design search component with loading states
- [ ] Add "Powered by AI" badge
- [ ] Implement frontend without backend (mockup)

**Estimated Time:** 1 day

---

## 📐 Phase 3: Content Structure (Week 3-4)

### ✅ Task 3.1: Apply Diataxis Consistently
**Why:** Users need clear mental models ("what can I do here?")  
**Deliverable:** All products follow Diataxis 4-part structure

**Action Items:**
- [ ] Audit existing content for Diataxis compliance
- [ ] Restructure pages into 4 categories:
  - 📖 Explanation (concepts)
  - 🚀 Tutorial (learning-oriented)
  - 📚 How-to (problem-solving)
  - 📑 Reference (information-oriented)
- [ ] Add visual indicators for each type
- [ ] Train Elin's team on structure

**Estimated Time:** 3-4 days

---

### ✅ Task 3.2: Create Content Templates
**Why:** Consistency across products + easier for teams to write  
**Deliverable:** Markdown templates for each Diataxis type

**Action Items:**
- [ ] Create `templates/` folder with:
  - `explanation-template.md`
  - `tutorial-template.md`
  - `howto-template.md`
  - `reference-template.md`
- [ ] Add to `agents.md` for Copilot assistance
- [ ] Share with Authorization team for testing

**Estimated Time:** 2 days

---

## 🔮 Phase 4: Future Enhancements

### 💡 Task 4.1: Slack Feedback Integration
**Why:** Capture missing docs from "Digdir samarbeid" Slack  
**Deliverable:** Automated Slack → GitHub issues

**Action Items:**
- [ ] Set up Slack webhook listener
- [ ] Create issue template
- [ ] Add bot to detect doc-related messages
- [ ] Test with small channel first

**Estimated Time:** TBD (Nice to have)

---

### 💡 Task 4.2: In-Page Chatbot
**Why:** Guide users who are lost  
**Deliverable:** AI assistant embedded in docs

**Action Items:**
- [ ] Evaluate chatbot platforms
- [ ] Connect to documentation corpus
- [ ] Test in Studio (closed environment first)
- [ ] Deploy publicly if successful

**Estimated Time:** TBD (Exploration phase)

---

## 📝 Authorization Product Breakdown (Example)

### Current Structure (❌ Wrong)
```
Authorization (1 product)
  ├── Om Autorisasjon
  ├── Hva får du?
  ├── Kom i gang
  ├── Guider
  └── Referanse
```

### New Structure (✅ Correct)
```
Authorization Elements (6 products):

1. Systembruker
   ├── 📖 Om Systembruker
   ├── 🚀 Kom i gang (SBSL/TE onboarding)
   ├── 📚 Guider (create, manage, permissions)
   └── 📑 API Reference

2. Tilgangsstyring
   ├── 📖 Om Tilgangsstyring
   ├── 🚀 Kom i gang
   ├── 📚 Guider
   └── 📑 API Reference

3. Rettighetsregister
   ├── 📖 Konsepter
   ├── 🚀 Kom i gang
   ├── 📚 Guider
   └── 📑 Reference

4. Delegering
   ├── 📖 Om Delegering
   ├── 🚀 Kom i gang
   ├── 📚 Guider
   └── 📑 Reference

5. Samtykke
   ├── 📖 Om Samtykke
   ├── 🚀 Kom i gang
   ├── 📚 Guider
   └── 📑 Reference

6. Roller og Rettigheter
   ├── 📖 Oversikt
   ├── 🚀 Kom i gang
   ├── 📚 Guider
   └── 📑 Reference
```

**Note:** Exact names/products to be confirmed with Elin

---

## 🎯 Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Time to find Systembruker docs | Unknown | < 10 seconds | User testing |
| Search success rate | Low | > 80% | Analytics |
| SBSL/TE onboarding time | Unknown | < 30 min | Feedback survey |
| Slack doc questions | High | -50% | Slack message count |
| Navigation depth (clicks to content) | 3-4 | < 2 | Analytics |

---

## 🚧 Blockers & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Elin's team availability for feedback | HIGH | Schedule recurring check-ins |
| AI search backend delays | MEDIUM | Build frontend first, mock responses |
| Content migration effort underestimated | MEDIUM | Start with Systembruker only, scale later |
| Users resistant to new structure | LOW | A/B test, gather feedback early |

---

## 📅 Timeline Overview

```
Week 1-2: Quick Wins
├── Day 1-3: Meet Elin, restructure products.json
├── Day 4-6: Build Systembruker page
└── Day 7-10: Flatten navigation, deploy

Week 3-4: Search & Polish
├── Day 11-15: Integrate AI search (w/ Bjorn Erik)
├── Day 16-18: Apply Diataxis consistently
└── Day 19-20: Create templates, train team

Future: Enhancements
└── Slack integration, chatbot, vector DB
```

---

## 🤝 Stakeholders & Responsibilities

| Person | Role | Responsibility |
|--------|------|----------------|
| **Lars** | Developer | Website changes, integration, deployment |
| **Elin** | Product Manager | Prioritization, content review, user feedback |
| **Bjorn Erik** | Developer | AI search backend implementation |
| **Authorization Team** | Content Owners | Writing docs in VS Code, QA |
| **Erik** | Coordinator | Update task force, track progress |
| **Benjamin** | Lab Team | agents.md templates, training |

---

## ✅ Definition of Done

For each phase:
- [ ] Changes deployed to Vercel
- [ ] Reviewed and approved by Elin
- [ ] User tested (if applicable)
- [ ] Documentation updated
- [ ] Team trained (if needed)

---

## 📞 Next Steps

1. **Schedule meeting with Elin** (this week)
   - Confirm Authorization product breakdown
   - Review Systembruker priorities
   
2. **Start coding** (immediately after meeting)
   - Update products.json
   - Create Systembruker page
   
3. **Sync with Bjorn Erik** (this week)
   - AI search timeline
   - API spec

4. **Weekly check-ins** (ongoing)
   - Monday: Plan week
   - Friday: Demo progress to Elin

---

**Questions? Contact Lars or Elin**
