# 📐 Left Sidebar Navigation - Implementation Guide

## 🎯 Overview

The left sidebar navigation appears **ONLY** on individual product pages (like Systembruker, Tilgangsstyring), similar to NAV's Aksel and Nais documentation.

---

## 🏗️ Where the Sidebar Appears

### ✅ **Show Sidebar:**
- `/systembruker` → Systembruker sidebar
- `/systembruker/kom-i-gang` → Systembruker sidebar  
- `/tilgangsstyring/guider/gi-tilgang` → Tilgangsstyring sidebar
- `/altinn-studio/tutorial` → Altinn Studio sidebar

### ❌ **NO Sidebar:**
- `/` (homepage) → Full-width cards
- `/produkter` (overview) → Full-width grid
- `/kom-i-gang` (general page) → No product context
- `/om` (about page) → No product context

---

## 📊 Visual Layout Examples

### Homepage (NO sidebar)
```
┌─────────────────────────────────────────────┐
│              NAVBAR                          │
├─────────────────────────────────────────────┤
│                                              │
│          HERO SECTION (full width)           │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│     [Card] [Card] [Card]  (3 columns)        │
│     [Card] [Card] [Card]                     │
│                                              │
└─────────────────────────────────────────────┘
```

### Product Page (WITH sidebar)
```
┌─────────────────────────────────────────────┐
│              NAVBAR                          │
├────────┬────────────────────────────────────┤
│ LEFT   │                                     │
│ SIDE   │         CONTENT                     │
│ BAR    │                                     │
│        │  # Systembruker                     │
│ 🏠 Over│  Welcome to...                      │
│ 📖 Om  │                                     │
│ 🚀 Kom │  ## Getting Started                 │
│   ▶Sub1│  Follow these steps...              │
│    Sub2│                                     │
│ 📚 Gui │                                     │
│ 📑 API │                                     │
│        │                                     │
│ ━━━━━━━│                                     │
│ 💬 Feed│                                     │
│ 🐛 Bug │                                     │
└────────┴────────────────────────────────────┘
```

---

## 🎨 Sidebar Features

### 1. **Product Header**
- Product title (linked to overview)
- Short description
- Visual separation

### 2. **Navigation Sections**
- 🏠 Overview (always first)
- 📖 Explanation sections
- 🚀 Tutorial (highlighted)
- 📚 How-to guides
- 📑 Reference/API

### 3. **Expandable Subsections**
```
📚 Guider  ▶
  (collapsed)

📚 Guider  ▼
   → Opprett systembruker
   → Administrere rettigheter
   → Slette systembruker
  (expanded)
```

### 4. **Active State Indicators**
- Blue highlight on current page
- Blue left border on active item
- Bold text for active item

### 5. **Footer Links**
- 💬 Gi tilbakemelding
- 🐛 Rapporter feil
- Links to GitHub issues/Slack

---

## 💻 How to Use in Code

### Example: Systembruker Product Page

```tsx
// pages/systembruker/index.tsx
import { ProductLayout } from '@/components/layout/ProductLayout';
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import productsData from '@/data/products.json';

export default function SystembrukerPage() {
  const product = productsData.products.find(p => p.id === 'systembruker');

  return (
    <ProductLayout product={product}>
      <ProductLandingPage product={product} />
    </ProductLayout>
  );
}
```

### Example: Content Page with Sidebar

```tsx
// pages/systembruker/kom-i-gang.tsx
import { ProductLayout } from '@/components/layout/ProductLayout';
import productsData from '@/data/products.json';

export default function KomIGangPage() {
  const product = productsData.products.find(p => p.id === 'systembruker');

  return (
    <ProductLayout product={product}>
      <article>
        <h1>Kom i gang med Systembruker</h1>
        <p>Denne guiden hjelper SBSL og TE med onboarding...</p>
        {/* Content here */}
      </article>
    </ProductLayout>
  );
}
```

---

## 🔄 How It Works

### 1. **ProductLayout Component**
- Wraps product pages
- Renders sidebar + content area
- Handles responsive layout

### 2. **ProductSidebar Component**
- Reads product data
- Generates navigation automatically
- Highlights active page
- Manages expand/collapse state

### 3. **Automatic Active States**
- Uses `useRouter()` to detect current URL
- Compares with section URLs
- Applies `.active` class automatically

---

## 📱 Responsive Behavior

### Desktop (> 768px)
```
[Sidebar (280px)] [Content (flex-grow)]
```

### Mobile (< 768px)
```
[Full-width content]
(Sidebar hidden - use mobile menu instead)
```

---

## 🎯 Benefits of This Approach

| Benefit | How It Helps |
|---------|--------------|
| **Context Awareness** | Users always know which product they're in |
| **Quick Navigation** | Jump between sections without going back |
| **Discoverability** | See all available docs at a glance |
| **Reduced Clicks** | Direct access to nested content |
| **Scoped Focus** | Only show relevant navigation |
| **Consistent UX** | Same pattern across all products |

---

## 🏗️ Authorization Team Structure Example

When you visit `/systembruker`:

```
Sidebar shows:
├── 🏠 Oversikt
├── 📖 Om Systembruker
├── 🚀 Kom i gang ⭐ (highlighted)
│   ├── Opprett systembruker
│   ├── Konfigurer autentisering
│   └── Første API-kall
├── 📚 Guider
│   ├── Gi API-tilgang
│   ├── Administrere rettigheter
│   ├── Rotere API-nøkler
│   └── Slette systembruker
└── 📑 API Reference
    ├── Autentisering
    ├── Endpoints
    └── Feilkoder
```

When you visit `/tilgangsstyring`:

```
Sidebar shows:
├── 🏠 Oversikt
├── 📖 Om Tilgangsstyring
├── 🚀 Kom i gang ⭐
├── 📚 Guider
│   ├── Gi tilgang til bruker
│   ├── Trekke tilgang
│   └── Administrere grupper
└── 📑 Reference
```

**Different products = Different sidebars!**

---

## ✅ Next Steps

1. **Update `products.json`** with new structure (see `AUTHORIZATION_STRUCTURE_EXAMPLE.json`)
2. **Wrap product pages** with `<ProductLayout>`
3. **Test navigation** - click around, verify active states
4. **Add subsections** to products that need deeper navigation
5. **Deploy and gather feedback** from Elin's team

---

## 🎨 Design Tokens Used

All styling uses Designsystemet tokens for consistency:

```css
/* Colors */
--ds-color-surface-default
--ds-color-text-default
--ds-color-text-subtle
--ds-color-accent-surface-default
--ds-color-accent-text-default

/* Spacing */
--ds-size-1, --ds-size-2, --ds-size-4, --ds-size-6, --ds-size-8

/* Typography */
--ds-font-size-sm, --ds-font-size-md, --ds-font-size-lg
--ds-font-weight-regular, --ds-font-weight-medium, --ds-font-weight-semibold

/* Borders & Radius */
--ds-border-radius-sm
--ds-color-border-subtle
```

---

## 🔍 References

**Similar Examples:**
- [NAV Aksel](https://aksel.nav.no/komponenter/core) - Single product with left nav
- [Nais](https://doc.nais.io) - Product-focused docs with sidebar
- [Stripe Docs](https://docs.stripe.com) - Multi-product with contextual nav

**Your implementation:**
- Sidebar ONLY on product pages
- Automatic from `products.json` data
- Consistent with Designsystemet
- Mobile-friendly (hides on small screens)

---

**Questions? Check the code:**
- `components/layout/ProductSidebar.tsx` - Sidebar component
- `components/layout/ProductLayout.tsx` - Layout wrapper
- `types/product.ts` - TypeScript definitions
