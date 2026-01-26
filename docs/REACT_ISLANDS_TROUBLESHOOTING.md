# React Islands Troubleshooting Guide

**CRITICAL ISSUE**: React islands are not mounting in the Hugo documentation portal. This blocks the entire React + Hugo architecture and may require a tech stack change if not resolved.

## Problem Summary

- Bundle `islands.js` loads successfully (confirmed via curl)
- Mount points exist in HTML: `<div data-react-island="SearchTrigger">`
- Components don't render - divs remain empty
- Even simple test components with inline styles fail
- No errors visible via curl/Playwright (can't see browser console)

## What We've Tried

### ✅ Confirmed Working
- Hugo site renders correctly
- Vite builds successfully (300KB bundle)
- Designsystemet CSS loads
- Bundle contains React code and mount logic
- Search API works independently

### ❌ Failed Attempts
1. **Vite Dev Server**: "@vitejs/plugin-react can't detect preamble" error
   - Fixed with `jsxImportSource: 'react'` in vite.config.ts
   - Still doesn't mount components

2. **Production Bundle**: Self-executing ES module format
   - Bundle ends with `mountAll()` call and MutationObserver setup
   - Components still don't mount

3. **Simple Test Component**: Basic div with red background
   - Added to registry and HTML
   - Failed to render (rules out Designsystemet issues)

4. **Debug Logging**: Added console.log statements
   - Survive production build
   - Can't verify if they execute without browser console

## Theories (Most Likely First)

### 1. Bundle Format Issue ⭐⭐⭐⭐⭐
**Theory**: ES module format doesn't self-execute properly in Hugo context
- Vite defaults to ES format with `rollupOptions.input`
- May need IIFE format for immediate execution

**Test**: Add `format: 'iife'` to Vite output config
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      format: 'iife',  // Add this
      entryFileNames: 'islands.js',
    }
  }
}
```

### 2. Module Loading Timing ⭐⭐⭐⭐
**Theory**: Script in head executes before DOM is ready
- Module scripts are deferred, but timing might still be off
- DOM readyState check might not work as expected

**Test**: Move script to end of body
```html
<!-- Move from head.html to end of baseof.html -->
<script type="module" src="{{ "ui/islands.js" | relURL }}"></script>
```

### 3. Import/Runtime Error ⭐⭐⭐⭐
**Theory**: Uncaught JavaScript error prevents execution
- Could be React import, createRoot, or component import
- No way to see without browser DevTools

**Test**: Add global error handler and debug flag
```javascript
// Add to end of main.tsx
window.ISLANDS_LOADED = true;
window.addEventListener('error', (e) => {
  console.error('Islands error:', e.error);
});
```

### 4. React 18 createRoot API Issue ⭐⭐⭐
**Theory**: createRoot fails silently in certain conditions
- Maybe container element isn't valid
- React 18 strict mode causing issues

**Test**: Try React 17 render API
```javascript
import { render } from 'react-dom';
// Instead of createRoot
render(<Comp {...props} />, el);
```

### 5. Hugo Server-Side Rendering Conflict ⭐⭐
**Theory**: Hugo's server rendering interferes with client-side mounting
- Hugo might be modifying the DOM after React mounts
- Double hydration attempt

**Test**: Check if Hugo is doing anything to the mount points

## Systematic Debugging Steps

### Step 0: Open Browser DevTools (CRITICAL)
All debugging so far used curl/Playwright which can't show client-side errors.

1. Open http://localhost:1313 in Chrome
2. Open DevTools (F12)
3. Check Console tab for ANY errors
4. Check Network tab that islands.js loads (200 OK)
5. In Console, type: `window.ISLANDS_LOADED` (if added)

### Step 1: Verify Bundle Execution
Add this to the VERY END of `ui/main.tsx`:
```javascript
// Add after all other code
window.ISLANDS_DEBUG = {
  loaded: true,
  timestamp: new Date().toISOString(),
  readyState: document.readyState,
  mountPoints: document.querySelectorAll('[data-react-island]').length
};
console.log('React islands debug:', window.ISLANDS_DEBUG);
```

Rebuild and check in browser console.

### Step 2: Test Bundle Format
Edit `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      format: 'iife',  // Force IIFE format
      entryFileNames: 'islands.js',
    }
  }
}
```

Rebuild: `npm run ui:build`

### Step 3: Move Script Position
Edit `hugo/layouts/_default/baseof.html`:
```html
<body>
  <!-- existing content -->
  
  <!-- MOVE TO HERE -->
  <script type="module" src="{{ "ui/islands.js" | relURL }}"></script>
</body>
```

Remove from `head.html`.

### Step 4: Isolate from Hugo
Create standalone test file `debug-islands.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/ui/islands.js"></script>
</head>
<body>
  <div data-react-island="SearchTrigger" data-props='{"label":"Test"}'></div>
  <script>
    setTimeout(() => {
      console.log('Debug check:');
      console.log('- ISLANDS_DEBUG:', window.ISLANDS_DEBUG);
      console.log('- Mount point:', document.querySelector('[data-react-island]'));
      console.log('- Children:', document.querySelector('[data-react-island]')?.children.length);
    }, 2000);
  </script>
</body>
</html>
```

Open directly: http://localhost:1313/debug-islands.html

### Step 5: Try React 17
If React 18 is the issue:
```bash
npm install react@17 react-dom@17
```

Update `ui/main.tsx`:
```javascript
import { render } from 'react-dom';
// Replace createRoot calls with:
render(<Comp {...props} />, el);
```

## Quick Fixes to Try

1. **Add IIFE format** (5 minutes)
2. **Move script to body** (2 minutes)
3. **Check browser console** (1 minute) - MOST IMPORTANT

## Alternative Approaches

If React islands continue to fail:

### Option 1: Vanilla JS Islands
Replace React with vanilla JavaScript:
- Remove React dependencies
- Use `innerHTML` or `appendChild` directly
- Simpler, more reliable

### Option 2: Different Build Tool
Replace Vite with:
- Webpack (more explicit config)
- esbuild (simpler)
- Rollup directly

### Option 3: Full React App
Abandon islands architecture:
- Use React Router for entire site
- Hugo becomes just a data source
- More complex but fully functional

## Files to Check/Modify

- `ui/main.tsx` - Main islands logic
- `vite.config.ts` - Build configuration
- `hugo/layouts/partials/head.html` - Script loading
- `hugo/layouts/_default/baseof.html` - HTML structure
- `ui/islands/SearchTrigger.tsx` - Example component

## Contact/Help

If none of these steps work:
1. Check if this is a known Vite + Hugo issue
2. Consider if the tech stack is viable
3. May need to abandon React islands for vanilla JS

## Timeline

- **First 30 minutes**: Steps 0-3 (console, IIFE, move script)
- **Next hour**: Step 4-5 (isolate, React 17)
- **If still failing**: Consider alternative approaches

The React islands architecture is critical for this project. If it can't be made to work reliably, consider switching to a simpler vanilla JS approach or a full React application.
