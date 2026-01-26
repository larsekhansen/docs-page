# Troubleshooting Guide

## Common Setup Issues

### TypeScript/IDE Errors After Fresh Install

**Problem**: "Cannot find module 'react' / 'vite' / etc." errors in IDE

**Solution**: 
```bash
npm install
```
The errors occur because TypeScript server runs before dependencies are installed. After running `npm install`, the errors should disappear.

### rsync Command Not Found (Windows)

**Problem**: `sync:docs` script fails with "rsync not available"

**Solution**: 
- Install rsync via WSL: `sudo apt-get install rsync`
- Or use Git Bash which includes rsync
- The script will automatically fall back to Node.js implementation if rsync is missing

### Port Already in Use

**Problem**: "Port 1313/8000/5173 already in use"

**Solution**: 
```bash
# Find and kill process on port
lsof -ti:1313 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :1313  # Windows

# Or use different ports
HUGO_PORT=1314 npm run docs:dev
```

### Search API Not Responding

**Problem**: Search shows "Noe gikk galt ved søk"

**Checklist**:
1. Is search API running? `npm run search:api`
2. Check Azure OpenAI credentials in `.env`
3. Verify search index exists: `npm run search:index`
4. Check CORS: API should allow requests from Hugo dev server

### Content Sync Issues

**Problem**: `sync:docs` fails or doesn't update content

**Debug steps**:
```bash
# Check git access
git ls-remote https://github.com/altinn/altinn-studio-docs.git

# Clear sync state and retry
rm .sync-state.json
npm run sync:docs

# Check permissions
ls -la .upstream-docs/
ls -la hugo/content/
```

## Development Issues

### Hot Module Replacement Not Working

**Problem**: React islands don't update in browser

**Solution**:
1. Ensure Vite dev server is running: `npm run ui:dev`
2. Check browser console for WebSocket errors
3. Verify Hugo is running in development mode: `npm run docs:dev`
4. Check that `head.html` includes Vite client script

### Build Failures

**Problem**: `npm run build` fails

**Common causes**:
- Missing environment variables
- Node.js version mismatch (requires Node 20+)
- Disk space full
- Permissions issue on `hugo/static/ui/`

**Solution**:
```bash
# Clean build
rm -rf hugo/static/ui/ hugo/public/ .hugo_build.lock
npm run build
```

## Performance Issues

### Slow Search Response

**Problem**: Search takes > 2 seconds

**Solutions**:
1. Check search index size: `ls -la search/index/`
2. Reduce `k` parameter in search query
3. Consider caching frequent queries
4. Upgrade Azure OpenAI deployment tier

### Long Build Times

**Problem**: Hugo build takes > 30 seconds

**Solutions**:
1. Reduce content size
2. Enable Hugo cache: `hugo --source hugo --cacheDir`
3. Use `--minify` only in production
4. Consider incremental builds

## Content Issues

### Broken Images After Sync

**Problem**: Images show as broken after content sync

**Check**:
1. Image paths in markdown vs actual file locations
2. Base URL configuration in `hugo.toml`
3. Image formats supported (webp, png, jpg)

**Fix**: Update image paths or copy images to correct location during sync.

### Search Results Not Highlighting

**Problem**: Search keywords not highlighted in results

**Debug**:
1. Check `search.config.json` highlight settings
2. Verify search query contains valid terms
3. Check browser console for JavaScript errors

## Deployment Issues

### 404 Errors After Deploy

**Problem**: Pages return 404 on production

**Common causes**:
1. Incorrect `baseURL` in `hugo.toml`
2. Missing `.htaccess` or server config
3. Trailing slash mismatch
4. Case sensitivity (Linux servers)

### Search API CORS in Production

**Problem**: Search requests blocked by CORS

**Solution**: Update Express server CORS config:
```javascript
app.use(cors({
  origin: ['https://docs.digdir.no', 'https://staging.docs.digdir.no'],
  credentials: true
}));
```

## Getting Help

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run dev
HUGO_DEBUG=1 npm run docs:dev
```

### Health Check

Check system health:
```bash
curl http://localhost:8000/api/health
```

### Log Locations

- Search API logs: Console output
- Hugo build logs: Console output  
- Sync logs: Console output (add file logging if needed)
- Browser logs: F12 → Console tab

### Report Issues

When reporting issues, include:
1. Operating system and Node.js version
2. Steps to reproduce
3. Error messages (full stack trace)
4. Configuration used (sources.json, .env)
5. Browser console errors (if applicable)

## Quick Fixes

### Reset Everything
```bash
# Clean slate
rm -rf node_modules .upstream-docs hugo/public hugo/static/ui
npm install
npm run sync:docs
npm run build
```

### Check All Services
```bash
# Run health check script
npm run health:check  # (add this script to package.json)
```

### Common Commands
```bash
# Rebuild search index
npm run search:index

# Sync specific source
npm run sync:source -- --source=altinn-studio

# Build without minification
npm run build:dev

# Run with specific environment
NODE_ENV=production npm run dev
```
