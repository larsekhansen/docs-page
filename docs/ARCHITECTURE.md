# Documentation Portal Architecture

## System Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Content       │     │   Content       │     │   Content       │
│   Sources       │     │   Sources       │     │   Sources       │
│   (Git/Scrape)  │     │   (Git/Scrape)  │     │   (Git/Scrape)  │
└─────────┬───────┘     └─────────┬───────┘     └─────────┬───────┘
          │                       │                       │
          └───────────────────────┴───────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Source Adapter      │
                    │   (Unified Interface) │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Content Pipeline    │
                    │   (Transform/Validate)│
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
    │   Hugo    │        │  Search   │        │  Health   │
    │   Static  │        │   Index   │        │ Monitor   │
    │   Site    │        │           │        │           │
    └─────┬─────┘        └─────┬─────┘        └─────┬─────┘
          │                    │                    │
    ┌─────▼─────┐        ┌─────▼─────┐        ┌─────▼─────┐
    │   React   │        │  Express  │        │  Status   │
    │  Islands  │        │   API     │        │  API      │
    └───────────┘        └───────────┘        └───────────┘
```

## Source Adapter Pattern

### Interface Definition

```typescript
interface ContentSource {
  id: string;
  name: string;
  type: 'git' | 'scrape' | 'api';
  enabled: boolean;
  
  // Core methods
  initialize(): Promise<void>;
  fetch(): Promise<ContentItem[]>;
  transform(items: ContentItem[]): Promise<HugoContent[]>;
  getHealth(): Promise<SourceHealth>;
  
  // Configuration
  config: SourceConfig;
}

interface ContentItem {
  id: string;
  url: string;
  rawContent: string;
  metadata: Record<string, any>;
  lastModified: Date;
}

interface HugoContent {
  path: string;           // Output path in Hugo content dir
  content: string;        // Markdown content
  frontmatter: Record<string, any>;
}
```

### Git Adapter Implementation

```typescript
class GitAdapter implements ContentSource {
  async fetch(): Promise<ContentItem[]> {
    // Use sparse checkout for efficiency
    // Track last synced commit
    // Only fetch changed files
  }
  
  async transform(items: ContentItem[]): Promise<HugoContent[]> {
    // Convert to markdown if needed
    // Add Hugo frontmatter
    // Handle image references
  }
}
```

### Scrape Adapter Implementation

```typescript
class ScrapeAdapter implements ContentSource {
  async fetch(): Promise<ContentItem[]> {
    // Use Playwright/Puppeteer for JS-heavy sites
    // Respect robots.txt
    // Handle rate limiting
  }
  
  async transform(items: ContentItem[]): Promise<HugoContent[]> {
    // Convert HTML to markdown
    // Clean up unnecessary elements
    // Extract metadata
  }
}
```

## Content Pipeline

### 1. Fetch Phase
- Parallel fetching from all enabled sources
- Rate limiting per source
- Retry logic with exponential backoff
- Progress tracking

### 2. Transform Phase
- Content normalization
- Frontmatter generation
- Link resolution
- Image optimization

### 3. Validation Phase
- Markdown syntax validation
- Required frontmatter fields
- Link checking
- Accessibility checks

### 4. Index Phase
- Update search index
- Generate navigation
- Build taxonomies
- Create sitemap

## Health Monitoring

### Metrics to Track

```typescript
interface HealthMetrics {
  sources: {
    [sourceId: string]: {
      status: 'healthy' | 'warning' | 'error';
      lastSync: Date;
      lastSuccess: Date;
      errorCount: number;
      contentCount: number;
      syncDuration: number;
    };
  };
  
  overall: {
    totalSources: number;
    healthySources: number;
    lastFullSync: Date;
    indexSize: number;
    buildTime: number;
  };
}
```

### Health Check Endpoint

```typescript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2024-01-26T10:00:00Z",
  "sources": {
    "altinn-studio": {
      "status": "healthy",
      "lastSync": "2024-01-26T09:00:00Z",
      "contentCount": 1234
    },
    "docs-digdir": {
      "status": "warning",
      "lastError": "Selector not found: .content-area",
      "errorCount": 3
    }
  }
}
```

## Self-Healing Scraper Design

### 1. Anomaly Detection

```typescript
class AnomalyDetector {
  detectChanges(metrics: HealthMetrics): Alert[] {
    // Significant drop in content count
    // Increase in error rate
    // Changes in page structure
  }
  
  async analyzePageStructure(url: string): Promise<StructureAnalysis> {
    // Use ML to identify content patterns
    // Compare with historical structure
    // Suggest selector updates
  }
}
```

### 2. Auto-Repair Flow

```typescript
class SelfHealing {
  async handleBrokenScraper(sourceId: string): Promise<void> {
    // 1. Analyze current page structure
    // 2. Generate new selectors using LLM
    // 3. Test selectors on sample pages
    // 4. Create pull request with changes
    // 5. Notify maintainers
  }
}
```

### 3. Fallback Strategies

- Multiple selector patterns per source
- Cached content for critical pages
- Manual review queue for automated changes
- Gradual rollout of new selectors

## CI/CD Pipeline Architecture

### Triggers
1. **Scheduled**: Every 6 hours
2. **Manual**: On-demand sync
3. **Webhook**: Source repository updates
4. **Health Alert**: Automatic retry on failures

### Pipeline Stages

```yaml
stages:
  - prepare:
      - checkout
      - setup node
      - load secrets
  
  - sync:
      - run: npm run sync:all
      - upload: artifacts/contents/
  
  - validate:
      - run: npm run validate:content
      - run: npm run check:links
  
  - build:
      - run: npm run build
      - upload: artifacts/dist/
  
  - deploy:
      - deploy to staging
      - run smoke tests
      - deploy to production
  
  - monitor:
      - run: npm run health:check
      - notify on failures
```

## Performance Considerations

### 1. Search Optimization
- Incremental index updates
- Result pagination
- Caching frequent queries
- Pre-computed rankings

### 2. Build Optimization
- Parallel content processing
- Incremental Hugo builds
- Asset optimization
- CDN deployment

### 3. Sync Optimization
- Delta sync for git sources
- Concurrent scraping
- Smart retry logic
- Bandwidth throttling

## Security Considerations

### 1. Content Security
- Sanitize scraped HTML
- Validate markdown
- CSP headers for static site
- Subresource integrity

### 2. API Security
- Rate limiting
- API key rotation
- Request signing
- Audit logging

### 3. Dependency Security
- Automated vulnerability scanning
- Pinned dependency versions
- Security updates workflow
- Supply chain analysis

## Migration Path to Astro

The current architecture is designed for easy migration to Astro:

1. **Hugo → Astro**: Similar content structure
2. **React Islands**: Direct compatibility with Astro islands
3. **Express API**: Can remain unchanged
4. **Build Pipeline**: Minor adjustments needed

```typescript
// Future Astro island (minimal changes)
import SearchTrigger from './SearchTrigger.jsx';

// In Astro template
<SearchTrigger client:load />
```

## Decision Log

| Decision | Reason | Date |
|----------|--------|------|
| Hugo over Astro | Mature, fast builds, Norwegian docs | 2024-01 |
| React Islands | Designsystemet accessibility | 2024-01 |
| Express Search | Decoupled, scalable | 2024-01 |
| Sparse Checkout | Efficient git sync | 2024-01 |
| Playwright for Scraping | JS-heavy sites support | Planned |
