# Content Sync from Upstream Repository

This documentation portal can automatically sync content from the upstream Altinn Studio Docs repository and update the search index when changes are detected.

## How it works

1. **Sparse checkout**: Only the `Docs` folder from the upstream repo is downloaded to `.upstream-docs/`
2. **Change detection**: The script tracks the last synced commit hash in `.sync-state.json`
3. **Selective reindex**: The search index is only rebuilt if there are actual content changes
4. **Content preservation**: Local modifications to Hugo-specific frontmatter are preserved in `hugo/content/`

## Manual sync

To manually sync content from upstream:

```bash
npm run sync:docs
```

This will:
- Fetch the latest changes from the upstream repository
- Copy content to `hugo/content/`
- Rebuild the search index if needed
- Report the status

## Automated sync

### Option 1: Using cron (Linux/macOS)

Add to your crontab (`crontab -e`):

```bash
# Sync every hour
0 * * * * cd /path/to/docs-page && npm run sync:docs

# Or sync every 30 minutes
*/30 * * * * cd /path/to/docs-page && npm run sync:docs
```

### Option 2: Using GitHub Actions (if hosted)

Create `.github/workflows/sync.yml`:

```yaml
name: Sync Content

on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:  # Allow manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run sync:docs
      
      - name: Commit and push if changed
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git diff --staged --quiet || git commit -m "Auto-sync content from upstream"
          git push
```

### Option 3: Using a simple watch script

For development, you can run a watch script that syncs every N minutes:

```bash
# Create scripts/watch-sync.sh
#!/bin/bash
while true; do
  npm run sync:docs
  echo "Waiting 30 minutes..."
  sleep 1800
done
```

## Configuration

The sync script can be configured by editing `scripts/sync-docs.mjs`:

- `UPSTREAM_REPO`: The Git repository URL to sync from
- `DEFAULT_BRANCH`: Fallback branch if auto-detection fails
- Content paths are configurable at the top of the script

## Troubleshooting

### First run issues

On first run, the script will:
1. Clone the entire repository (sparse checkout of Docs folder only)
2. Copy content to Hugo directory
3. Build initial search index

This may take a few minutes.

### Merge conflicts

The script overwrites `hugo/content/` with upstream content. If you need to preserve local changes:

1. Keep local customizations in a separate folder
2. Create a post-sync script that merges your changes
3. Or use Git branches to manage different content sources

### Network issues

If sync fails due to network issues:
- Check your internet connection
- Verify the upstream repository URL is correct
- Try running the sync manually to see detailed error messages

## Content transformation

If you need to transform upstream content before copying to Hugo:

1. Edit `scripts/sync-docs.mjs`
2. Modify the syncContent() function
3. Add transformation logic before the rsync command

Example transformations:
- Add Hugo-specific frontmatter
- Convert file formats
- Restructure directories
- Filter out unwanted files
