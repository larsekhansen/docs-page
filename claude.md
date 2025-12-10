# Melding og Formidling Documentation Migration Plan

## Executive Summary

This plan outlines the migration of Altinn Melding (Correspondence) and Formidling (Broker) documentation from the Hugo-based docs.altinn.studio site to the new Next.js-based Digdir documentation portal at this repository.

**Timeline Focus:** Critical migration deadline June 2026 (Altinn 2 → Altinn 3)

---

## Phase 1: Content Structure & Migration

### 1.1 Current State Analysis

**Existing Documentation:**
- **Platform:** Hugo static site generator
- **Location:** https://docs.altinn.studio/nb/correspondence/ (Melding)
- **Format:** Markdown files in `/content` directory
- **Navigation:** Hugo-based sidebar with hierarchical structure
- **Search:** Pagefind UI integration
- **Language:** Norwegian + English support

**Current Content Structure:**
```
Melding/
├── Om Altinn Melding (About)
├── Hva får du? (What do you get?)
├── Kom i gang (Getting started)
│   ├── Tjenesteeier (Service owner)
│   ├── Systemleverandør (System provider)
│   ├── Dialogporten/Arbeidsflate (Dialogue portal/Workspace)
│   ├── Hendelser (Events)
│   ├── Varsling (Notifications)
│   └── Maskinporten (Machine port)
├── Konsepter (Concepts)
│   ├── Basic concepts
│   ├── Meldings Livssyklus (Message lifecycle)
│   └── Taushetsbelagt post (Confidential mail)
├── Overgangsløsning (Transition solution - migration)
└── Referansedokumentasjon (Reference)
    ├── Begreper (Terminology)
    ├── Systemgrensesnitt (System interfaces)
    ├── Funksjonalitet og egenskaper (Capabilities)
    └── Løsningsarkitektur (Solution architecture)
```

**API Documentation Structure:**
```
API/
├── Meldingstjenesten (Correspondence service)
│   └── OpenAPI/Swagger at /api/correspondence/spec/
└── Formidlingstjenesten (Broker service)
    └── [Similar structure expected]
```

### 1.2 Target Structure (Diataxis Framework)

Map existing content to new structure at `/melding`:

#### 📖 Explanation Section
**Target:** Help users understand concepts

| New URL | Source Content | Status |
|---------|---------------|--------|
| `/melding/om` | "Om Altinn Melding" + "Hva får du?" | Migrate |
| `/melding/correspondence` | Deep dive on Melding specifics + volume stats | Create |
| `/melding/formidling` | Formidling overview + use cases | Create |
| `/melding/konsepter` | "Konsepter" section (all subsections) | Migrate |
| `/melding/konsepter/livssyklus` | "Meldings Livssyklus" | Migrate |
| `/melding/konsepter/taushetsbelagt` | "Taushetsbelagt post" | Migrate |
| `/melding/arkitektur` | "Løsningsarkitektur" | Migrate |

#### 🚀 Tutorial Section
**Target:** Learning by doing, step-by-step guides

| New URL | Source Content | Status |
|---------|---------------|--------|
| `/melding/kom-i-gang` | Landing page for getting started | Create |
| `/melding/kom-i-gang/tjenesteeier` | "Kom i gang → Tjenesteeier" | Migrate |
| `/melding/kom-i-gang/systemleverandor` | "Kom i gang → Systemleverandør" | Migrate |
| `/melding/kom-i-gang/opprett-melding` | First message walkthrough | Create |
| `/melding/kom-i-gang/varsling` | "Kom i gang → Varsling" | Migrate |
| `/melding/kom-i-gang/test` | Testing guide | Create |
| `/melding/formidling/kom-i-gang` | File transfer setup | Create |

#### 📚 How-to Section
**Target:** Task-oriented guides for specific problems

| New URL | Source Content | Status |
|---------|---------------|--------|
| `/melding/migrering` | "Overgangsløsning" + migration planning | Migrate + Enhance |
| `/melding/migrering/plan` | Migration timeline and checklist | Create |
| `/melding/migrering/api-endringer` | API changes Altinn 2 → 3 | Create |
| `/melding/migrering/testing` | Migration testing strategy | Create |
| `/melding/guider/vedlegg` | Sending messages with attachments | Create |
| `/melding/guider/sikkerhetsnivaa` | Security level handling | Create |
| `/melding/guider/varsling` | Email/SMS notifications | Migrate |
| `/melding/guider/store-filer` | Large file transfers (Formidling) | Create |
| `/melding/guider/dialogporten` | "Kom i gang → Dialogporten/Arbeidsflate" | Migrate |
| `/melding/guider/hendelser` | "Kom i gang → Hendelser" | Migrate |
| `/melding/guider/maskinporten` | "Kom i gang → Maskinporten" | Migrate |

#### 📑 Reference Section
**Target:** Technical specifications and API docs

| New URL | Source Content | Status |
|---------|---------------|--------|
| `/melding/referanse` | Overview of all reference docs | Create |
| `/melding/referanse/begreper` | "Begreper" (Terminology) | Migrate |
| `/melding/referanse/systemgrensesnitt` | "Systemgrensesnitt" | Migrate |
| `/melding/referanse/funksjonalitet` | "Funksjonalitet og egenskaper" | Migrate |
| `/melding/api/v3` | Altinn 3 API landing page | Create |
| `/melding/api/v3/spec` | Swagger UI (see Phase 2) | New |
| `/melding/api/v2` | Altinn 2 legacy API docs | Create |

### 1.3 Content Migration Tasks

#### Task 1: Set up MDX content structure
- [ ] Create `/content/melding/` directory
- [ ] Set up MDX file structure matching target URLs
- [ ] Configure Next.js to handle `/melding/*` routes with MDX
- [ ] Set up frontmatter schema for metadata

#### Task 2: Extract and convert content
- [ ] Clone altinn-studio-docs repo locally for reference
- [ ] Extract all Correspondence markdown files from Hugo `/content`
- [ ] Convert Hugo shortcodes to Next.js/MDX components
- [ ] Update internal links from Hugo format to Next.js routing
- [ ] Preserve all images and move to `/public/images/melding/`

#### Task 3: Create new content
- [ ] Write overview pages (`/melding/om`, `/melding/correspondence`, `/melding/formidling`)
- [ ] Create migration-specific guides (deadline June 2026)
- [ ] Write practical how-to guides for common tasks
- [ ] Add product landing page hero content

#### Task 4: Update product configuration
- [x] Add Melding product to `data/products.json` ✅
- [x] Create `/pages/melding/index.tsx` ✅
- [ ] Configure sidebar navigation with all sections
- [ ] Add product metadata (team info, Slack channel, GitHub repos)

#### Task 5: Quality assurance
- [ ] Verify all internal links work
- [ ] Check image paths and alt text
- [ ] Test on mobile devices
- [ ] Verify accessibility (WCAG 2.1 AA)
- [ ] Cross-reference with old site (nothing missing)

### 1.4 Content Format Standards

**MDX File Template:**
```mdx
---
title: "Page Title"
description: "SEO-friendly description"
product: "melding"
section: "tutorial" # explanation | tutorial | how-to | reference
lastUpdated: "2025-01-15"
---

# {title}

<Callout variant="info">
  Intro paragraph explaining what this page covers
</Callout>

## Section heading

Content here...

<CodeBlock language="typescript">
// Code example
</CodeBlock>

## Related pages

- [Link to related page](/melding/other-page)
```

**Key Requirements:**
- All code examples must be syntax-highlighted
- Use Digdir Design System components (Callout, CodeBlock, etc.)
- Include breadcrumb navigation
- Add "Last updated" dates
- Provide "Edit on GitHub" links
- Add "Was this helpful?" feedback widgets

---

## Phase 2: Swagger/OpenAPI Integration

### 2.1 Current Implementation Analysis

**Existing Setup (docs.altinn.studio):**
- **Tool:** Swagger UI (SwaggerUIBundle)
- **Spec Location:** `/swagger/altinn-correspondence-v1.json`
- **Page:** `/nb/api/correspondence/spec/`
- **Features:**
  - Interactive API explorer
  - Try-it-out functionality
  - Collapsed by default (`docExpansion: 'none'`)
  - Deep linking enabled
  - Custom Altinn styling

### 2.2 Implementation Plan

#### Option A: Embed Swagger UI (Recommended)
Use swagger-ui-react package to embed interactive API docs.

**Installation:**
```bash
npm install swagger-ui-react
```

**Component Structure:**
```typescript
// components/api/SwaggerUI.tsx
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export function SwaggerAPIDoc({ specUrl }: { specUrl: string }) {
  return (
    <SwaggerUI
      url={specUrl}
      docExpansion="none"
      deepLinking={true}
      persistAuthorization={true}
    />
  )
}
```

**Page Implementation:**
```typescript
// pages/melding/api/v3/spec.tsx
import { SwaggerAPIDoc } from '@/components/api/SwaggerUI'

export default function MeldingAPISpec() {
  return (
    <div className="api-spec-container">
      <h1>Altinn 3 Melding API</h1>
      <SwaggerAPIDoc specUrl="/api/swagger/correspondence-v3.json" />
    </div>
  )
}
```

#### Option B: Use Redoc (Alternative)
Cleaner, more modern alternative to Swagger UI.

```bash
npm install redoc
```

Benefits:
- Better responsive design
- Cleaner UI
- Better for documentation-focused use
- Smaller bundle size

#### Option C: Hybrid Approach (Best of Both)
- **Redoc** for main API documentation (clean, readable)
- **Swagger UI** for interactive testing environment
- Link between both versions

### 2.3 Implementation Tasks

#### Task 1: Obtain OpenAPI specifications
- [ ] Download `altinn-correspondence-v1.json` from docs.altinn.studio
- [ ] Obtain Altinn 3 OpenAPI spec from Team Melding
- [ ] Obtain Formidling OpenAPI spec
- [ ] Store specs in `/public/api/swagger/` directory

#### Task 2: Install and configure Swagger UI
- [ ] Install `swagger-ui-react` package
- [ ] Create `SwaggerUI` component with Digdir styling
- [ ] Test interactive features (try-it-out, authentication)
- [ ] Configure for both Altinn 2 and Altinn 3 specs

#### Task 3: Create API documentation pages
- [ ] `/melding/api/v3/spec` - Altinn 3 REST API (Swagger UI)
- [ ] `/melding/api/v2/spec` - Altinn 2 Web Services (Swagger UI)
- [ ] `/formidling/api/spec` - Formidling API (Swagger UI)

#### Task 4: Add authentication support
- [ ] Document Maskinporten integration
- [ ] Add authentication examples to API pages
- [ ] Configure Swagger UI auth schemes
- [ ] Provide test credentials/sandbox info

#### Task 5: Style customization
- [ ] Apply Digdir Design System colors
- [ ] Ensure dark mode compatibility
- [ ] Match existing site typography
- [ ] Add custom CSS for Swagger UI override

#### Task 6: API documentation landing pages
- [ ] Create overview pages explaining API structure
- [ ] Add authentication guide before Swagger UI
- [ ] Include rate limits, best practices
- [ ] Link to code examples and SDKs

### 2.4 OpenAPI Spec Management

**Version Control:**
```
/public/api/swagger/
├── correspondence-v3.json       # Altinn 3 Melding API
├── correspondence-v2.json       # Altinn 2 Melding API (legacy)
├── broker-v1.json              # Formidling API
└── schemas/                    # Shared schemas
    ├── common.json
    └── models.json
```

**Update Strategy:**
- Specs should be version-controlled in this repo
- Set up CI/CD to sync specs from Team Melding's API repo
- Add changelog for API version updates
- Notify users of breaking changes

---

## Phase 3: Enhanced Features

### 3.1 Interactive API Testing

**Sandbox Environment:**
- [ ] Provide test environment endpoints
- [ ] Create test accounts/credentials
- [ ] Add "Try it now" tutorials
- [ ] Show example requests/responses

**Code Generators:**
- [ ] Add code snippet generation (curl, JavaScript, C#, Python)
- [ ] Provide SDK download links
- [ ] Create Postman collection export

### 3.2 Developer Experience

**Integration Helpers:**
- [ ] Step-by-step integration guides
- [ ] Sample applications (GitHub repos)
- [ ] Troubleshooting guide
- [ ] Error code reference

**API Monitoring:**
- [ ] Link to status page
- [ ] Display API uptime/health
- [ ] Show deprecation notices
- [ ] Version support timeline

---

## Phase 4: AI-Powered Search & Chat

> **Note:** This phase should only begin after Phases 1-3 are complete and stable.

### 4.1 AI Search Enhancement

#### Option A: Algolia DocSearch (Easiest)
**Benefits:**
- Free for open-source docs
- Minimal setup required
- Good search relevance

**Implementation:**
```typescript
// components/search/AlgoliaSearch.tsx
import { DocSearch } from '@docsearch/react'

export function Search() {
  return (
    <DocSearch
      appId="YOUR_APP_ID"
      apiKey="YOUR_SEARCH_API_KEY"
      indexName="altinn-docs"
    />
  )
}
```

#### Option B: Custom AI Search (More Powerful)
**Tech Stack:**
- **Embedding Model:** OpenAI text-embedding-3-small
- **Vector DB:** Pinecone or Supabase pgvector
- **Search UI:** Custom React component

**Features:**
- Semantic search (understand intent, not just keywords)
- Search across code examples
- Filter by product/section
- Show relevant context snippets

**Cost Estimate:**
- OpenAI API: ~$0.02 per 1M tokens (very cheap)
- Pinecone: Free tier up to 1M vectors
- Total: < $20/month for moderate traffic

### 4.2 AI Chat Assistant

#### Implementation Strategy

**Phase 4.2.1: Read-Only AI Assistant**

Build a chat widget that can answer questions about the documentation.

**Tech Stack:**
```
Frontend:
- React chat component
- Markdown rendering for responses
- Code syntax highlighting

Backend (API Route):
- Next.js API route at /api/chat
- OpenAI GPT-4 Turbo or Claude API
- RAG (Retrieval Augmented Generation)
```

**RAG Pipeline:**
```
User Question
     ↓
Embedding Generation (question → vector)
     ↓
Vector Search (find relevant docs)
     ↓
Context Injection (docs + question → LLM)
     ↓
AI Response (with citations)
```

**Component Structure:**
```typescript
// components/chat/AIAssistant.tsx
export function AIAssistant() {
  return (
    <ChatWidget>
      <ChatHistory messages={messages} />
      <ChatInput onSend={handleSend} />
      <SourceCitations sources={sources} />
    </ChatWidget>
  )
}
```

**API Route:**
```typescript
// pages/api/chat.ts
export default async function handler(req, res) {
  const { question } = req.body

  // 1. Generate embedding for question
  const embedding = await getEmbedding(question)

  // 2. Search vector DB for relevant docs
  const relevantDocs = await searchVectorDB(embedding)

  // 3. Build prompt with context
  const prompt = buildPrompt(question, relevantDocs)

  // 4. Get AI response
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "You are an expert on Altinn..." },
      { role: "user", content: prompt }
    ]
  })

  // 5. Return response with sources
  return res.json({
    answer: response.choices[0].message.content,
    sources: relevantDocs.map(d => d.metadata)
  })
}
```

**Features:**
- ✅ Answer questions about Melding and Formidling
- ✅ Provide code examples
- ✅ Link to relevant documentation
- ✅ Handle migration questions
- ✅ Multi-language support (Norwegian + English)

**UX Considerations:**
- Floating chat button in bottom-right corner
- "Ask AI" quick actions on each page
- Suggested questions to get started
- Clear attribution (which docs were used)
- Feedback mechanism (👍/👎 on responses)

#### Phase 4.2.2: Vector Database Setup

**Content Indexing Pipeline:**
```bash
# 1. Extract all documentation content
npm run docs:extract

# 2. Chunk content into smaller pieces (500-1000 tokens)
npm run docs:chunk

# 3. Generate embeddings for each chunk
npm run docs:embed

# 4. Upload to vector database
npm run docs:index
```

**Example Chunking:**
```typescript
// scripts/embedContent.ts
async function indexDocumentation() {
  const docs = await getAllDocumentationPages()

  for (const doc of docs) {
    // Split into chunks
    const chunks = splitIntoChunks(doc.content, 800)

    for (const chunk of chunks) {
      // Generate embedding
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk
      })

      // Store in vector DB
      await pinecone.upsert({
        id: `${doc.id}_${chunkIndex}`,
        values: embedding.data[0].embedding,
        metadata: {
          product: doc.product,
          section: doc.section,
          url: doc.url,
          title: doc.title,
          content: chunk
        }
      })
    }
  }
}
```

#### Phase 4.2.3: Advanced Features

**Multi-Modal Support:**
- [ ] Search through code examples specifically
- [ ] Search through API specifications
- [ ] Search through diagrams (OCR + description)

**Personalization:**
- [ ] Remember user's role (developer, service owner, etc.)
- [ ] Suggest relevant docs based on browsing history
- [ ] Show "commonly viewed next" pages

**Analytics:**
- [ ] Track common questions
- [ ] Identify documentation gaps
- [ ] Measure chat satisfaction
- [ ] Monitor AI response accuracy

### 4.3 Implementation Tasks

#### Task 1: Search Infrastructure
- [ ] Choose search solution (Algolia vs custom)
- [ ] Index all documentation content
- [ ] Build search UI component
- [ ] Test search relevance

#### Task 2: Vector Database Setup (if custom AI)
- [ ] Choose vector DB (Pinecone, Supabase, Weaviate)
- [ ] Create content chunking pipeline
- [ ] Generate embeddings for all docs
- [ ] Set up vector indexing

#### Task 3: AI Chat Component
- [ ] Design chat widget UI
- [ ] Build chat history component
- [ ] Implement streaming responses
- [ ] Add source citations

#### Task 4: Backend API
- [ ] Create `/api/chat` endpoint
- [ ] Implement RAG pipeline
- [ ] Add rate limiting
- [ ] Set up error handling

#### Task 5: Testing & Optimization
- [ ] Test with real user questions
- [ ] Optimize response quality (prompt engineering)
- [ ] Measure response latency
- [ ] A/B test different models

#### Task 6: Monitoring & Analytics
- [ ] Track chat usage
- [ ] Monitor AI costs
- [ ] Collect user feedback
- [ ] Build admin dashboard

### 4.4 Cost Estimates

**AI Search (Custom):**
- Embedding generation: $0.02 per 1M tokens
- Initial indexing (~500 pages): $0.10
- Ongoing updates: < $1/month

**AI Chat:**
- GPT-4 Turbo: $0.01/1K input tokens, $0.03/1K output tokens
- Estimated 1000 questions/month: ~$10-20/month
- Claude 3.5 Sonnet (alternative): Similar pricing

**Vector Database:**
- Pinecone free tier: 1M vectors (sufficient)
- Supabase pgvector: Included in $25/month plan

**Total Monthly Cost (at scale):**
- Small traffic (< 1000 queries): $20-30/month
- Medium traffic (5000 queries): $100-150/month
- Large traffic (20000 queries): $400-600/month

### 4.5 Privacy & Security Considerations

**Data Privacy:**
- [ ] Don't send user credentials to AI
- [ ] Sanitize queries before logging
- [ ] Comply with GDPR
- [ ] Add privacy notice to chat

**Content Security:**
- [ ] Only index public documentation
- [ ] Don't expose internal/confidential info
- [ ] Rate limit to prevent abuse
- [ ] Monitor for prompt injection attacks

**User Transparency:**
- [ ] Clearly mark AI-generated responses
- [ ] Link to source documentation
- [ ] Allow users to report incorrect answers
- [ ] Provide "verify with human" option

---

## Phase 5: Quality Assurance & Launch

### 5.1 Pre-Launch Checklist

**Content Quality:**
- [ ] All pages migrated from old site
- [ ] No broken links
- [ ] All images loading correctly
- [ ] Code examples tested and working
- [ ] Consistent tone and style

**Technical Quality:**
- [ ] Site performance (Lighthouse score > 90)
- [ ] Mobile responsiveness
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] SEO optimization
- [ ] Security headers configured

**Functionality:**
- [ ] Search working
- [ ] Swagger UI interactive
- [ ] Navigation intuitive
- [ ] Feedback widgets functional
- [ ] Analytics tracking set up

### 5.2 User Acceptance Testing

**Test with Real Users:**
- [ ] 5+ developers from tjenesteeiere
- [ ] 3+ system integrators
- [ ] 2+ Team Melding members
- [ ] Collect feedback via survey
- [ ] Iterate on findings

### 5.3 Soft Launch Strategy

**Week 1-2: Beta Testing**
- Share with Team Melding only
- Collect feedback via Slack (#C079AJR5TEX)
- Fix critical issues

**Week 3-4: Expanded Beta**
- Share with friendly tjenesteeiere
- Announce in open meetings
- Monitor usage analytics

**Week 5: Public Launch**
- Redirect old URLs to new site
- Announce on all channels
- Update external links

### 5.4 Post-Launch Monitoring

**Metrics to Track:**
- Page views and time on page
- Search queries and click-through rate
- API spec interactions
- User feedback ratings
- Support ticket volume (should decrease)

**Continuous Improvement:**
- Weekly review of feedback
- Monthly content updates
- Quarterly structure review
- Annual user surveys

---

## Timeline & Milestones

### Recommended Schedule

**Month 1: Foundation**
- Week 1: Content audit and mapping
- Week 2: MDX setup and initial pages
- Week 3: Content migration (bulk)
- Week 4: Internal links and images

**Month 2: API Documentation**
- Week 1: Swagger UI integration
- Week 2: API page creation
- Week 3: Authentication documentation
- Week 4: Testing and refinement

**Month 3: Enhanced Features**
- Week 1: Search implementation
- Week 2: Additional components
- Week 3: Polish and optimization
- Week 4: Beta testing

**Month 4: AI Features (Optional)**
- Week 1: Vector DB setup
- Week 2: AI chat development
- Week 3: Testing and tuning
- Week 4: Soft launch

**Month 5: Launch**
- Week 1: Final QA
- Week 2: Soft launch
- Week 3: Public launch
- Week 4: Post-launch monitoring

---

## Success Criteria

### Must-Have (Launch Blockers)
✅ All content from old site migrated
✅ No broken links or missing images
✅ Swagger UI working for Altinn 3 API
✅ Mobile responsive
✅ Search functionality
✅ Accessibility compliant

### Should-Have (Post-Launch)
✅ AI-powered search
✅ Code snippet generators
✅ Interactive tutorials
✅ Version comparison tools

### Nice-to-Have (Future Enhancements)
✅ AI chat assistant
✅ Personalized recommendations
✅ Community contributions
✅ Video tutorials

---

## Open Questions & Decisions Needed

### For Team Melding
1. **Content Ownership:** Who will maintain content after migration?
2. **API Specs:** Can we get access to latest OpenAPI specs?
3. **Sandbox:** Is there a test environment users can use?
4. **Migration Timeline:** Any updates to June 2026 deadline?

### For Design/UX
1. **Chat Widget Placement:** Where should AI assistant appear?
2. **API Documentation Style:** Swagger UI vs Redoc preference?
3. **Search Prominence:** Dedicated search page or just header?

### For Development
1. **Hosting:** Where will Next.js site be deployed?
2. **Build Process:** CI/CD pipeline setup?
3. **API Keys:** Who manages OpenAI/Pinecone credentials?

---

## Next Steps

1. **Review this plan** with Team Melding (Viktor, Tore, Erik)
2. **Prioritize phases** based on June 2026 deadline
3. **Assign ownership** for each task
4. **Set up project tracking** (GitHub Projects)
5. **Begin Phase 1** content migration

---

## Resources & References

### Documentation
- Current site: https://docs.altinn.studio/nb/correspondence/
- API docs: https://docs.altinn.studio/nb/api/correspondence/spec/
- GitHub repo: https://github.com/Altinn/altinn-studio-docs

### Team
- Product Owner: Viktor Olsen
- Scrum Master: Tore Måsøy
- Slack: #C079AJR5TEX
- Roadmaps:
  - https://github.com/orgs/digdir/projects/8/views/21
  - https://github.com/orgs/Altinn/projects/54/views/12

### Technical
- Diataxis framework: https://diataxis.fr/
- Swagger UI React: https://www.npmjs.com/package/swagger-ui-react
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings
- Algolia DocSearch: https://docsearch.algolia.com/

---

**Document Version:** 1.0
**Last Updated:** 2025-01-15
**Author:** Claude (AI Assistant)
**Status:** Draft for Review
