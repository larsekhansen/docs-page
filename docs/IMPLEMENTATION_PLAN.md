# Implementation Plan for Multi-Source Content Ingestion

## Overview

This document outlines the technical implementation steps to extend the documentation portal from a single git source to multiple content sources (git repos, web scraping, APIs).

## Phase 1: Foundation (Week 1)

### 1.1 Create Source Configuration System

```bash
# Files to create/modify
- config/sources.json (based on sources.json.example)
- lib/sources/SourceAdapter.ts (base interface)
- lib/sources/GitAdapter.ts
- lib/sources/ScrapeAdapter.ts
- lib/sources/ApiAdapter.ts
- lib/sources/SourceManager.ts
```

**Key Implementation Details:**

```typescript
// SourceManager.ts
class SourceManager {
  private adapters: Map<string, ContentSource> = new Map();
  
  async loadSources(configPath: string): Promise<void> {
    const config = await this.loadConfig(configPath);
    for (const sourceConfig of config.sources) {
      const adapter = this.createAdapter(sourceConfig);
      this.adapters.set(sourceConfig.id, adapter);
    }
  }
  
  async syncAll(): Promise<SyncResult> {
    const results = await Promise.allSettled(
      Array.from(this.adapters.values()).map(a => a.sync())
    );
    return this.aggregateResults(results);
  }
}
```

### 1.2 Refactor Existing Sync Script

```bash
# Modify
- scripts/sync-docs.mjs → scripts/sync-all.mjs
```

Changes:
- Load sources from sources.json
- Use SourceManager instead of hardcoded git logic
- Add parallel sync with configurable concurrency
- Implement proper error handling and reporting

## Phase 2: Web Scraping Implementation (Week 2)

### 2.1 Choose Scraping Technology

**Recommendation: Playwright** (over Puppeteer/Cheerio)
- Better for JS-heavy sites
- Built-in waiting mechanisms
- Cross-browser support
- Excellent TypeScript support

```bash
npm install playwright
npm install -D @playwright/test
```

### 2.2 Implement Scraper Adapter

```typescript
// lib/sources/ScrapeAdapter.ts
class ScrapeAdapter implements ContentSource {
  private browser: Browser;
  private page: Page;
  
  async initialize(): Promise<void> {
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
    
    // Respect robots.txt
    await this.configureRespectfulScraping();
  }
  
  async fetch(): Promise<ContentItem[]> {
    const urls = await this.discoverPages();
    const items: ContentItem[] = [];
    
    for (const url of urls) {
      try {
        await this.page.goto(url, { waitUntil: 'networkidle' });
        const content = await this.extractContent();
        items.push(content);
        
        // Rate limiting
        await this.page.waitForTimeout(this.config.delay || 1000);
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
      }
    }
    
    return items;
  }
  
  private async extractContent(): Promise<ContentItem> {
    // Use configured selectors
    const title = await this.page.textContent(this.config.selectors.title);
    const content = await this.page.$eval(
      this.config.selectors.content, 
      el => el.innerHTML
    );
    
    // Convert to markdown
    const markdown = await this.htmlToMarkdown(content);
    
    return {
      id: this.generateId(this.page.url()),
      url: this.page.url(),
      rawContent: markdown,
      metadata: { title, extractedAt: new Date() },
      lastModified: new Date()
    };
  }
}
```

### 2.3 Content Transformation Pipeline

```typescript
// lib/transformers/HtmlToMarkdown.ts
class HtmlToMarkdownTransformer {
  async transform(html: string): Promise<string> {
    // Use turndown for HTML → Markdown
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    // Custom rules for Digdir sites
    turndown.addRule('digdirAlerts', {
      filter: (node) => node.classList?.contains('alert'),
      replacement: (content, node) => {
        const type = node.classList.contains('alert--info') ? 'info' : 'warning';
        return `> **${type.toUpperCase()**: ${content}\n\n`;
      }
    });
    
    return turndown.turndown(html);
  }
}
```

## Phase 3: Health Monitoring (Week 3)

### 3.1 Health Check Endpoint

```typescript
// server/routes/health.ts
app.get('/api/health', async (req, res) => {
  const sourceManager = getSourceManager();
  const health = await sourceManager.getHealth();
  
  const overallStatus = Object.values(health.sources).every(s => 
    s.status === 'healthy'
  ) ? 'healthy' : 'degraded';
  
  res.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    ...health
  });
});
```

### 3.2 Metrics Collection

```typescript
// lib/monitoring/MetricsCollector.ts
class MetricsCollector {
  async recordSyncMetrics(sourceId: string, metrics: SyncMetrics): Promise<void> {
    // Store in time-series database or simple JSON
    await this.storage.save({
      sourceId,
      timestamp: new Date(),
      duration: metrics.duration,
      contentCount: metrics.contentCount,
      errorCount: metrics.errorCount
    });
  }
  
  async detectAnomalies(sourceId: string): Promise<Alert[]> {
    const history = await this.getHistory(sourceId, 30); // 30 days
    const alerts: Alert[] = [];
    
    // Detect content count drops
    const recentCount = history[history.length - 1].contentCount;
    const avgCount = history.reduce((sum, h) => sum + h.contentCount, 0) / history.length;
    
    if (recentCount < avgCount * 0.8) {
      alerts.push(new Alert(
        'content_drop',
        `Content count dropped by ${Math.round((1 - recentCount/avgCount) * 100)}%`
      ));
    }
    
    return alerts;
  }
}
```

## Phase 4: CI/CD Pipeline (Week 4)

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/sync.yml
name: Content Sync and Deploy

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:
  push:
    paths:
      - 'config/sources.json'
      - '.github/workflows/sync.yml'

jobs:
  sync:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install chromium
        
      - name: Sync content
        env:
          IDPORTEN_API_TOKEN: ${{ secrets.IDPORTEN_API_TOKEN }}
        run: npm run sync:all
        
      - name: Validate content
        run: npm run validate:content
        
      - name: Build site
        run: npm run build
        
      - name: Deploy to staging
        run: |
          # Deployment logic here
          # Could be to GitHub Pages, Netlify, or custom CDN
          
      - name: Run smoke tests
        run: npm run test:smoke
        
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          # Production deployment
          
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: failure
          channel: '#docs-portal'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 4.2 Environment Configuration

```bash
# .env.example
# Search
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=text-embedding-3-large

# External APIs
IDPORTEN_API_TOKEN=your-token

# Scraping
SCRAPING_DELAY=1000
SCRAPING_CONCURRENCY=3
SCRAPING_USER_AGENT=DigdirDocsPortal/1.0

# Monitoring
SLACK_WEBHOOK=your-webhook-url
HEALTH_CHECK_ENDPOINT=https://your-domain.com/api/health
```

## Phase 5: Self-Healing (Future Enhancement)

### 5.1 Structure Analysis with AI

```typescript
// lib/ai/StructureAnalyzer.ts
class StructureAnalyzer {
  async analyzePageChanges(sourceId: string): Promise<SelectorSuggestion[]> {
    const current = await this.getCurrentStructure(sourceId);
    const expected = await this.getExpectedStructure(sourceId);
    
    const prompt = `
      Analyze the differences between these HTML structures:
      
      Expected selectors:
      ${JSON.stringify(expected.selectors, null, 2)}
      
      Current page structure:
      ${this.extractStructure(current.html)}
      
      Suggest updated selectors that would work with the current structure.
      Return only valid CSS selectors.
    `;
    
    const response = await this.openai.generate(prompt);
    return this.parseSuggestions(response);
  }
}
```

### 5.2 Automated PR Creation

```typescript
// lib/automation/HealingAgent.ts
class HealingAgent {
  async handleBrokenSource(sourceId: string): Promise<void> {
    // 1. Analyze what broke
    const analysis = await this.analyzer.analyzePageChanges(sourceId);
    
    // 2. Generate fix
    const fix = await this.generateFix(sourceId, analysis);
    
    // 3. Create PR
    const pr = await this.github.createPR({
      title: `Fix: Update selectors for ${sourceId}`,
      body: this.generatePRDescription(analysis),
      changes: fix
    });
    
    // 4. Notify team
    await this.notifyTeam(pr);
  }
}
```

## Testing Strategy

### Unit Tests
```bash
# Test each adapter in isolation
npm run test:unit

# Test content transformations
npm run test:transform

# Test health monitoring
npm run test:monitoring
```

### Integration Tests
```bash
# Test full sync pipeline
npm run test:sync

# Test with mock external services
npm run test:integration
```

### E2E Tests
```bash
# Test actual scraping (careful with rate limits)
npm run test:e2e

# Test deployed site
npm run test:smoke
```

## Migration Checklist

- [ ] Backup current content
- [ ] Install new dependencies
- [ ] Create sources.json from example
- [ ] Test with single new source
- [ ] Gradually add all sources
- [ ] Monitor sync performance
- [ ] Set up alerts
- [ ] Document source-specific quirks

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Source site blocks scraper | High | Respect robots.txt, use official APIs when available |
| Content format changes | Medium | Versioned transforms, rollback capability |
| Performance issues | Medium | Incremental sync, caching, rate limiting |
| Legal/compliance issues | High | Review terms of service, obtain permissions |

## Success Metrics

- All sources syncing successfully
- Sync completion time < 10 minutes
- 99%+ search result accuracy
- Zero manual interventions per week
- Content freshness < 6 hours
