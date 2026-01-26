#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import http from 'node:http';

const BASE_URL = process.env.BASE_URL || 'http://localhost:1313';
const API_URL = process.env.API_URL || 'http://localhost:8000';

function checkService(name, url, path = '/') {
  return new Promise((resolve) => {
    const options = {
      hostname: new URL(url).hostname,
      port: new URL(url).port || (new URL(url).protocol === 'https:' ? 443 : 80),
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      console.log(`✓ ${name}: ${res.statusCode}`);
      resolve(res.statusCode < 400);
    });

    req.on('error', () => {
      console.log(`✗ ${name}: Connection failed`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`✗ ${name}: Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runSmokeTests() {
  console.log('🚀 Running smoke tests...\n');

  const results = [];

  // Check Hugo site
  console.log('Checking Hugo site...');
  results.push(await checkService('Hugo', BASE_URL));

  // Check search API
  console.log('\nChecking Search API...');
  results.push(await checkService('Search API', API_URL, '/api/health'));

  // Check required files
  console.log('\nChecking required files...');
  const requiredFiles = [
    'hugo/hugo.toml',
    'hugo/content/_index.md',
    'search/index/chunks.jsonl',
    'search/search.config.json'
  ];

  for (const file of requiredFiles) {
    if (existsSync(file)) {
      console.log(`✓ ${file}: exists`);
      results.push(true);
    } else {
      console.log(`✗ ${file}: missing`);
      results.push(false);
    }
  }

  // Check environment variables
  console.log('\nChecking environment...');
  const requiredEnv = ['AZURE_OPENAI_ENDPOINT', 'AZURE_OPENAI_API_KEY'];
  let envOk = true;
  
  for (const env of requiredEnv) {
    if (process.env[env]) {
      console.log(`✓ ${env}: set`);
    } else {
      console.log(`⚠ ${env}: not set (may affect search)`);
      envOk = false;
    }
  }
  results.push(envOk);

  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('✅ All smoke tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Check the output above.');
    process.exit(1);
  }
}

// Check if services are running first
async function checkServices() {
  console.log('Checking if services are running...\n');
  
  try {
    // Try to fetch from Hugo
    await checkService('Hugo', BASE_URL);
    
    // Try to fetch from Search API
    await checkService('Search API', API_URL, '/api/health');
    
    console.log('\n✅ Services are running, running smoke tests...\n');
    await runSmokeTests();
  } catch (error) {
    console.log('\n❌ Services are not running!');
    console.log('\nTo start all services:');
    console.log('  npm run dev');
    console.log('\nOr start individually:');
    console.log('  npm run docs:dev    # Hugo on :1313');
    console.log('  npm run search:api  # Express on :8000');
    console.log('  npm run ui:dev      # Vite on :5173');
    process.exit(1);
  }
}

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: npm run smoke-test

Runs smoke tests to verify the documentation portal is working correctly.

Tests:
- Hugo site is accessible
- Search API is responding
- Required files exist
- Environment variables are set

Environment variables:
  BASE_URL    - Hugo site URL (default: http://localhost:1313)
  API_URL     - Search API URL (default: http://localhost:8000)
`);
  process.exit(0);
}

checkServices();
