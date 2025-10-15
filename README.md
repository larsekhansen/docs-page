# Digdir Dokumentasjonsportal

Felles dokumentasjonsplattform for Altinn-produkter og tjenester fra Digitaliseringsdirektoratet.

## Features

- **Reusable produktstruktur** - Enkelt å legge til nye produkter
- **Gjenbrukbar template** - Konsistent landingsside for alle produkter basert på Diataxis
- **Designsystemet** - Bygget med Digdir's offisielle designsystem
- **Responsiv** - Fungerer på mobil, tablet og desktop
- **Tilgjengelig** - WCAG 2.1 AA-kompatibel
- **Rask** - Bygget med Next.js for optimal ytelse
- **Markdown-støtte** - Enkel redigering av innhold

## Project Structure

```
/
├── components/
│   ├── product-landing/  # Gjenbrukbar produktlandingsside-template
│   │   ├── ProductLandingPage.tsx
│   │   ├── NavigationCard.tsx
│   │   └── *.module.css
│   ├── homepage/         # Homepage-komponenter
│   │   ├── Homepage.tsx
│   │   ├── ProductCard.tsx
│   │   └── *.module.css
│   └── layout/           # Layout-komponenter (navbar, sidebar)
├── data/
│   └── products.json     # Produktmetadata
├── pages/
│   ├── _app.tsx          # Next.js app wrapper
│   ├── index.tsx         # Forside
│   ├── produkter/        # Produktoversikt
│   └── [produkt]/        # Dynamiske produktsider
├── styles/
│   └── globals.css       # Globale styles
└── types/
    └── product.ts        # TypeScript types

## Getting Started

### Installation

```bash
# Installer avhengigheter
npm install

# Start dev-server
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) for å se resultatet.

### Bygg for produksjon

```bash
# Bygg prosjektet
npm run build

# Start produksjonsserver
npm start
```

### Static export (for enkel self-hosting)

```bash
# Legg til i package.json scripts:
"export": "next export"

# Bygg statisk site
npm run build && npm run export
```

Dette genererer en `/out` mappe med statiske filer som kan hostes hvor som helst.

## 🎨 Designsystemet

Prosjektet bruker [Designsystemet](https://designsystemet.no/) - Norges offisielle designsystem fra Digdir.

**Pakker:**
- `@digdir/designsystemet-react` - React-komponenter (Card, Heading, Paragraph, etc.)
- `@digdir/designsystemet-theme` - Design tokens (farger, spacing, typografi)
- `@digdir/designsystemet-css` - Base-styles

**Tilgjengelige komponenter:**
- Card, Button, Heading, Paragraph
- Accordion, Alert, Badge, Breadcrumbs
- [Se alle komponenter](https://designsystemet.no/komponenter)

## 📝 Legg til nytt produkt

### 1. Oppdater `data/products.json`

```json
{
  "id": "mitt-produkt",
  "title": "Mitt Produkt",
  "shortDescription": "Kort beskrivelse",
  "description": "Lengre beskrivelse av produktet",
  "url": "/mitt-produkt",
  "sections": [
    {
      "type": "explanation",
      "title": "Om Mitt Produkt",
      "description": "Lær om konseptene",
      "url": "/mitt-produkt/om",
      "icon": "information"
    },
    {
      "type": "tutorial",
      "title": "Kom i gang",
      "description": "Sett opp produktet",
      "url": "/mitt-produkt/kom-i-gang",
      "icon": "rocket",
      "highlighted": true
    }
  ]
}
```

### 2. Opprett produktside

Opprett `/pages/mitt-produkt/index.tsx`:

```tsx
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import productsData from '@/data/products.json';

export default function MittProduktPage() {
  const product = productsData.products.find(p => p.id === 'mitt-produkt');
  return <ProductLandingPage product={product} />;
}
```

Ferdig! Produktet dukker nå opp på forsiden og har egen landingsside.

## 🧭 Diataxis-rammeverket

Produktlandingssider følger [Diataxis](https://diataxis.fr/) dokumentasjonsrammeverk:

- **Explanation** (Forklaring) - Konseptuell forståelse
  - "Om [Produkt]", "Hva får du?"
- **Tutorial** (Opplæring) - Læring ved å gjøre
  - "Kom i gang"
- **How-to** (Veiledning) - Løse spesifikke oppgaver
  - "Guider"
- **Reference** (Referanse) - Teknisk informasjon
  - "Referanse", "API-dokumentasjon"

## 🎯 Jobs to be Done (JTBD)

Innholdsstrukturen er designet rundt brukernes behov:

1. **"Jeg vil forstå hva dette er"** → Om-seksjonen
2. **"Jeg vil komme i gang raskt"** → Kom i gang (highlighted)
3. **"Jeg vil løse et spesifikt problem"** → Guider
4. **"Jeg trenger teknisk referanse"** → Referanse

## 📐 Design-prinsipper

1. **Konsistens** - Samme struktur på tvers av alle produkter
2. **Tilgjengelighet** - WCAG 2.1 AA standard
3. **Ytelse** - Rask lasting, minimal JavaScript
4. **Vedlikeholdbarhet** - Enkelt å oppdatere og utvide
5. **Progressiv forbedring** - Fungerer uten JavaScript
6. **Skalerbarhet** - Designet for å vokse med flere produkter

## 🔗 Inspirasjon

- [GOV.UK Design System](https://design-system.service.gov.uk) - Offentlig sektor, tilgjengelighetsfokus
- [Aksel (NAV)](https://aksel.nav.no) - Norsk designsystem og dokumentasjon
- [Designsystemet](https://designsystemet.no/) - Digdir's designsystem
- [Microsoft Azure Docs](https://learn.microsoft.com/en-us/azure/) - Multi-produkt struktur
- [Stripe Docs](https://docs.stripe.com) - Utvikleropplevelse
