# Documentation Portal - Handover Guide

## Overview

This is a multi-product documentation portal built with Hugo, React islands (via Vite), and Express. It's designed to aggregate content from multiple Digdir sources into a single searchable portal.

## Current Implementation Status

### ✅ What's Working

1. **Core Architecture**
   - Hugo static site generator for content
   - Vite + React islands for dynamic UI components
   - Express search API with semantic + lexical search
   - Designsystemet integration for accessibility

2. **Search System**
   - Hybrid search (vector embeddings + keyword matching)
   - Real-time search with highlighting
   - Grouped results by source
   - Keyboard navigation (Ctrl/Cmd+K, arrows, Esc)

3. **Content Sync**
   - Basic sync from altinn-studio-docs repo
   - Change detection via commit hash tracking
   - Automatic reindexing on content changes
   - Cross-platform compatibility (rsync + Node.js fallback)

4. **Development Workflow**
   - `npm run dev` - runs all services together
   - Hot module replacement for React components
   - TypeScript support throughout

### 🚧 What's Missing

1. **Multi-Source Content**
   - No ingestion from docs.digdir.no
   - No ingestion from minid.no
   - No ingestion from uutilsynet.no
   - No ingestion from idporten documentation
   - No web scraping capability

2. **CI/CD & Automation**
   - No automated deployment pipeline
   - No scheduled sync jobs
   - No health monitoring

3. **Content Management**
   - No content transformation pipeline
   - No version control of synced content
   - No conflict resolution for overlapping content

4. **Monitoring & Debugging**
   - No sync status dashboard
   - No error reporting system
   - No performance metrics

## Architecture Decisions

### Why Hugo?
- Fast build times
- Excellent multilingual support
- Simple content management via markdown
- Easy to deploy (static files)
- Future migration path to Astro (similar concepts)

### Why React Islands?
- Allows using Designsystemet React components with built-in accessibility
- Keeps most of the site static (Hugo)
- Easy migration path to Astro islands
- Enables hot module replacement in development

### Why Express Search API?
- Decoupled from Hugo build process
- Can be scaled independently
- Easy to add new search features
- Works with any frontend framework

## File Structure

```
docs-page/
├── hugo/                    # Hugo site
│   ├── content/            # Content files (markdown)
│   ├── layouts/            # Hugo templates
│   └── static/             # Static assets (CSS, JS, built islands)
├── ui/                     # React islands source
│   ├── main.tsx           # Islands bootstrap
│   └── islands/           # Individual island components
├── search/                 # Search system
│   ├── server/            # Express API
│   └── indexer.mjs        # Content indexer
├── scripts/               # Utility scripts
│   └── sync-docs.mjs      # Content sync from git repos
└── vite.config.ts         # Vite configuration
```

## Key Configuration Files

- `hugo/hugo.toml` - Hugo site configuration
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration

## Development Setup

```bash
# Install dependencies
npm install

# Run all services in development
npm run dev

# Individual services
npm run docs:dev      # Hugo dev server
npm run search:api    # Express search API
npm run ui:dev        # Vite dev server for islands
```

## Content Sources Strategy

### Current Implementation
The current sync script only handles git repositories with sparse checkout.

### Planned Multi-Source Architecture

1. **sources.json Configuration**
   ```json
   {
     "sources": [
       {
         "id": "altinn-studio",
         "type": "git",
         "url": "https://github.com/altinn/altinn-studio-docs.git",
         "contentPath": "Docs",
         "transform": "hugo-frontmatter"
       },
       {
         "id": "docs-digdir",
         "type": "scrape",
         "url": "https://docs.digdir.no",
         "selectors": { /* CSS selectors */ },
         "transform": "markdown"
       }
     ]
   }
   ```

2. **Adapter Pattern**
   - Each source type implements a common interface
   - `GitAdapter` for repository sources
   - `ScrapeAdapter` for web sources
   - `ApiAdapter` for API-based sources

3. **Content Pipeline**
   - Fetch → Transform → Validate → Index → Deploy

## CI/CD Pipeline Design

### GitHub Actions Workflow

```yaml
name: Sync and Deploy
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Sync all sources
        run: npm run sync:all
      
      - name: Build site
        run: npm run build
      
      - name: Deploy to production
        run: # Deployment steps
      
      - name: Report status
        run: npm run health:report
```

## Self-Healing Scraper Concept

### Problem
Web scrapers break when source sites change their HTML structure.

### Proposed Solution
1. **Health Monitoring**
   - Track scraped content metrics (number of pages, average content length)
   - Alert on significant deviations

2. **AI-Powered Adaptation**
   - Use LLM to analyze page structure changes
   - Generate updated selectors automatically
   - Validate with human approval loop

3. **Fallback Strategies**
   - Multiple selector strategies per source
   - Cached content as fallback
   - Manual override capability

## Next Steps for New Team

1. **Immediate (Week 1)**
   - Set up development environment
   - Review existing code and documentation
   - Identify all content sources to ingest

2. **Short Term (Month 1)**
   - Implement sources.json configuration
   - Create adapters for git and scrape sources
   - Set up basic CI/CD pipeline

3. **Medium Term (Month 2-3)**
   - Implement web scrapers for all Digdir sites
   - Add content transformation pipeline
   - Create health monitoring dashboard

4. **Long Term (Month 3+)**
   - Implement self-healing scraper
   - Add advanced search features
   - Optimize performance and SEO

## Important Notes

1. **Content Ownership**
   - Verify rights to scrape/host each source
   - Consider API alternatives where available

2. **Performance Considerations**
   - Search index size grows with content
   - Consider pagination for large result sets
   - Monitor build times as content grows

3. **Accessibility**
   - All React components should use Designsystemet
   - Test keyboard navigation thoroughly
   - Ensure proper ARIA labels

4. **Security**
   - Sanitize scraped content
   - Rate limit external requests
   - Keep dependencies updated

## Contact Information

- Original developer: [Your contact]
- Project repository: [GitHub URL]
- Documentation: [Docs URL]

---

*This document should be updated as the project evolves. Keep it in sync with the actual implementation.*
