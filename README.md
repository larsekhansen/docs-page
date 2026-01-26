# Digdir Documentation Portal

A unified documentation portal built with Hugo, React islands, and Express search API.

## Quick Start Checklist

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd docs-page
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure OpenAI credentials
   ```

3. **Build search index**
   ```bash
   npm run search:index
   ```

4. **Run all services**
   ```bash
   npm run dev
   ```

5. **Verify it works**
   ```bash
   npm run smoke-test
   ```

6. **Visit the site**
   - Hugo site: http://localhost:1313
   - Search API: http://localhost:8000/api/health

## What's Implemented

- ✅ Hugo static site with Designsystemet styling
- ✅ React islands for dynamic UI (Vite + TypeScript)
- ✅ Semantic + keyword search with highlighting
- ✅ Basic sync from altinn-studio-docs repo
- ✅ Hot module replacement in development

## What's Missing

- 🚧 Multi-source content ingestion (docs.digdir.no, minid.no, etc.)
- 🚧 Web scraping capability
- 🚧 CI/CD pipeline for automated updates
- 🚧 Health monitoring dashboard

## Development

```bash
# Individual services
npm run docs:dev      # Hugo dev server (localhost:1313)
npm run search:api    # Express search API (localhost:8000)
npm run ui:dev        # Vite dev server (localhost:5173)

# Content management
npm run sync:docs     # Sync from git repos
npm run search:index  # Rebuild search index

# Production
npm run build         # Build everything
```

## Architecture

```
Hugo (Static Site) ←→ React Islands ←→ Vite (Build Tool)
        ↓
Express Search API ←→ Azure OpenAI (Embeddings)
        ↓
Content Sources ←→ Sync Scripts ←→ CI/CD
```

## Documentation

- [Handover Guide](docs/HANDOVER.md) - Complete project overview for new team
- [Architecture](docs/ARCHITECTURE.md) - Technical design and patterns
- [Content Sync](docs/SYNC.md) - How to add new content sources

## Project Status

**Ready for handover** - Core infrastructure is complete. Next team should focus on:
1. Implementing multi-source content adapters
2. Setting up CI/CD pipeline
3. Adding web scraping for remaining Digdir sites

## License

[License information]
