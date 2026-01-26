#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Configuration
const UPSTREAM_REPO = 'https://github.com/altinn/altinn-studio-docs.git';
const UPSTREAM_DIR = join(projectRoot, '.upstream-docs');
const STATE_FILE = join(projectRoot, '.sync-state.json');
const CONTENT_SOURCE_DIR = join(UPSTREAM_DIR, 'Docs');
const CONTENT_TARGET_DIR = join(projectRoot, 'hugo/content');

// Default branch (fallback if we can't detect)
const DEFAULT_BRANCH = 'main';

function execCommand(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', ...options });
  } catch (error) {
    console.error(`Failed to execute: ${cmd}`);
    console.error(error.stdout?.toString() || error.message);
    throw error;
  }
}

function checkRsyncAvailable() {
  try {
    execSync('rsync --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function copyDirectoryRecursive(source, target) {
  // Ensure target directory exists
  if (!existsSync(target)) {
    execSync(`mkdir -p "${target}"`);
  }

  // Get all items in source
  const items = readdirSync(source);
  
  // Get all items in target for deletion check
  const targetItems = new Set(readdirSync(target));

  for (const item of items) {
    const sourcePath = join(source, item);
    const targetPath = join(target, item);
    
    targetItems.delete(item); // This item exists in source, don't delete it
    
    const stat = statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      cpSync(sourcePath, targetPath, { force: true });
    }
  }

  // Delete items in target that don't exist in source (mimic rsync --delete)
  for (const item of targetItems) {
    const targetPath = join(target, item);
    const stat = statSync(targetPath);
    
    if (stat.isDirectory()) {
      rmSync(targetPath, { recursive: true, force: true });
    } else {
      rmSync(targetPath);
    }
  }
}

function getRemoteBranch() {
  try {
    // Try to get the default branch from the remote
    const remoteInfo = execCommand(`git ls-remote --symref ${UPSTREAM_REPO} HEAD`);
    const match = remoteInfo.match(/ref: refs\/heads\/([^\s]+)\s+HEAD/);
    return match ? match[1] : DEFAULT_BRANCH;
  } catch {
    return DEFAULT_BRANCH;
  }
}

function getLastSyncedCommit() {
  if (existsSync(STATE_FILE)) {
    try {
      const state = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
      return state.lastCommit || null;
    } catch {
      return null;
    }
  }
  return null;
}

function saveSyncState(commit) {
  const state = {
    lastCommit: commit,
    lastSync: new Date().toISOString(),
  };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function initUpstreamRepo() {
  console.log('Initializing upstream repository...');
  
  // Create directory if it doesn't exist
  if (!existsSync(UPSTREAM_DIR)) {
    execCommand(`mkdir -p ${UPSTREAM_DIR}`);
  }

  // Check if already a git repo
  const isGitRepo = existsSync(join(UPSTREAM_DIR, '.git'));
  
  if (!isGitRepo) {
    // Init with sparse checkout
    execCommand('git init', { cwd: UPSTREAM_DIR });
    execCommand('git remote add origin ' + UPSTREAM_REPO, { cwd: UPSTREAM_DIR });
    
    // Configure sparse checkout to only get the Docs folder
    execCommand('git config core.sparseCheckout true', { cwd: UPSTREAM_DIR });
    execCommand('echo "Docs" > .git/info/sparse-checkout', { cwd: UPSTREAM_DIR });
  }
}

function syncContent() {
  console.log('Syncing content from upstream...');
  
  const branch = getRemoteBranch();
  console.log(`Using branch: ${branch}`);
  
  // Fetch latest changes
  execCommand(`git fetch origin ${branch}`, { cwd: UPSTREAM_DIR });
  
  // Get the latest commit hash
  const latestCommit = execCommand(`git rev-parse origin/${branch}`, { cwd: UPSTREAM_DIR }).trim();
  const lastSynced = getLastSyncedCommit();
  
  if (latestCommit === lastSynced) {
    console.log('No new changes to sync.');
    return false;
  }
  
  console.log(`New changes detected: ${lastSynced ? lastSynced.substring(0, 7) : 'none'} -> ${latestCommit.substring(0, 7)}`);
  
  // Pull the latest changes
  execCommand(`git pull origin ${branch}`, { cwd: UPSTREAM_DIR });
  
  // Copy content to Hugo directory
  if (existsSync(CONTENT_SOURCE_DIR)) {
    console.log('Copying content to Hugo directory...');
    
    // Try rsync first (faster), fall back to Node.js implementation
    if (checkRsyncAvailable()) {
      execCommand(`rsync -av --delete ${CONTENT_SOURCE_DIR}/ ${CONTENT_TARGET_DIR}/`);
    } else {
      console.log('rsync not available, using built-in copy method...');
      copyDirectoryRecursive(CONTENT_SOURCE_DIR, CONTENT_TARGET_DIR);
    }
    
    // Run the indexer
    console.log('Reindexing search...');
    execCommand('npm run search:index', { cwd: projectRoot });
    
    // Save the new state
    saveSyncState(latestCommit);
    console.log('Sync completed successfully!');
    return true;
  } else {
    console.error('Source content directory not found:', CONTENT_SOURCE_DIR);
    return false;
  }
}

// Main execution
try {
  initUpstreamRepo();
  const hasChanges = syncContent();
  
  if (hasChanges) {
    console.log('\n✅ Content updated and reindexed');
  } else {
    console.log('\n✅ Content is up to date');
  }
} catch (error) {
  console.error('\n❌ Sync failed:', error.message);
  process.exit(1);
}
