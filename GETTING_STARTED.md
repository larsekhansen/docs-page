# 🚀 Kom i gang

Denne guiden hjelper deg raskt i gang med dokumentasjonsportalen.

## ✅ Forhåndskrav

- **Node.js** >= 18.x (sjekk med `node --version`)
- **npm** >= 9.x (sjekk med `npm --version`)

## 📦 Installasjon

```bash
cd /Users/larseirikkorsgaardhansen/projects/altinn-docs

# Installer avhengigheter
npm install
```

## 🎯 Kjør prosjektet

```bash
# Start development server
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## 🏗️ Prosjektstruktur

Slik er prosjektet organisert:

```
altinn-docs/
├── components/          # React-komponenter
│   ├── homepage/        # Forside-komponenter
│   │   ├── Homepage.tsx
│   │   ├── FeatureCard.tsx
│   │   └── ProductCard.tsx
│   └── product-landing/ # Produktlandingsside-template
│       ├── ProductLandingPage.tsx
│       └── NavigationCard.tsx
│
├── data/
│   └── products.json    # Produktmetadata (EDIT THIS!)
│
├── pages/               # Next.js sider
│   ├── index.tsx        # Forside
│   ├── produkter.tsx    # Produktoversikt
│   ├── authorization/   # Authorization produktside
│   ├── kom-i-gang.tsx   # Kom i gang-side
│   └── om.tsx           # Om dokumentasjonen
│
├── styles/              # CSS-filer
│   ├── globals.css
│   └── *.module.css     # CSS modules
│
└── types/
    └── product.ts       # TypeScript types
```

## 🎨 Hva er bygget

### 1. **Forside** (`/`)
- Hero-seksjon med tittel og beskrivelse
- 3 store feature-kort:
  - Produkter → `/produkter`
  - Kom i gang → `/kom-i-gang`
  - Om dokumentasjonen → `/om`
- Utvalgte produkter (viser første 4)
- "Se alle produkter"-lenke

### 2. **Produktoversikt** (`/produkter`)
- Grid-visning av alle produkter
- Responsivt design (1-4 kolonner)
- Støtte for eksterne lenker (f.eks. Designsystemet)

### 3. **Produktlandingsside-template** (`/authorization`)
- Gjenbrukbar template basert på Diataxis
- 5 navigasjonskort:
  - Om [Produkt] (Explanation)
  - Hva får du? (Explanation)
  - Kom i gang (Tutorial - highlighted)
  - Guider (How-to)
  - Referanse (Reference)
- Fullstendig responsivt

### 4. **Innholdssider**
- Kom i gang-side med onboarding-info
- Om-side med Diataxis og JTBD forklaring

## 📝 Neste steg

### Legg til nytt produkt

1. **Rediger `data/products.json`:**
```json
{
  "id": "mitt-produkt",
  "title": "Mitt Produkt",
  "shortDescription": "Kort beskrivelse",
  "description": "Lengre beskrivelse",
  "url": "/mitt-produkt",
  "sections": [...]
}
```

2. **Opprett `pages/mitt-produkt/index.tsx`:**
```tsx
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import productsData from '@/data/products.json';

export default function MittProduktPage() {
  const product = productsData.products.find(p => p.id === 'mitt-produkt');
  return <ProductLandingPage product={product} />;
}
```

3. **Ferdig!** Produktet vises nå automatisk på forsiden og produktoversikten.

Se [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) for full dokumentasjon.

## 🎨 Designsystemet

Prosjektet bruker [Designsystemet](https://designsystemet.no/) fra Digdir.

**Tilgjengelige komponenter:**
- `Card`, `Button`, `Heading`, `Paragraph`
- `Accordion`, `Alert`, `Badge`, `Breadcrumbs`
- [Se alle komponenter](https://designsystemet.no/komponenter)

**Design tokens:**
Alle farger, spacing, typografi osv. kommer fra Designsystemet:
```css
var(--ds-color-accent-base)
var(--ds-spacing-4)
var(--ds-font-size-heading-large)
```

## 🏗️ Bygg for produksjon

```bash
# Bygg prosjektet
npm run build

# Test produksjonsbygget lokalt
npm start
```

### Static export (for enkel self-hosting)

Legg til i `package.json`:
```json
{
  "scripts": {
    "export": "next export"
  }
}
```

Deretter:
```bash
npm run build && npm run export
```

Dette genererer en `/out` mappe med statiske filer som kan hostes hvor som helst (f.eks. nginx, Apache, eller CDN).

## 🐛 Feilsøking

### `Module not found: Can't resolve '@/...'`

Sørg for at `tsconfig.json` har riktige paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Designsystemet-styles vises ikke

Sjekk at disse importene er i `pages/_app.tsx`:
```tsx
import '@digdir/designsystemet-theme';
import '@digdir/designsystemet-css';
```

### Inter font laster ikke

Sjekk at font-linken er i `pages/_app.tsx`:
```tsx
<link
  rel="stylesheet"
  href="https://altinncdn.no/fonts/inter/v4.1/inter.css"
  crossOrigin="anonymous"
/>
```

## 📚 Dokumentasjon

- [README.md](./README.md) - Oversikt og teknisk dokumentasjon
- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) - Guide for å lage produktsider
- [Designsystemet docs](https://designsystemet.no/) - Komponentdokumentasjon

## 🤝 Bidra

For å legge til nytt innhold eller endre eksisterende:

1. Rediger filene direkte
2. Test lokalt med `npm run dev`
3. Bygg med `npm run build` for å sjekke at alt fungerer
4. Commit og push til Git

## 🎯 Hva mangler?

Følgende er **ikke** implementert enda, men kan legges til senere:

- [ ] Navbar med logo og søk
- [ ] Left sidebar med navigasjon
- [ ] Markdown-støtte for innholdssider
- [ ] Søkefunksjonalitet
- [ ] Breadcrumbs
- [ ] Footerseksjon
- [ ] Dark mode
- [ ] i18n (flerspråklig støtte er satt opp, men ikke brukt)

Disse kan legges til inkrementelt basert på behov.

## 💡 Tips

- Bruk Designsystemet sine komponenter hvor mulig for konsistens
- Hold beskrivelser korte og konsise
- Test alltid responsivitet (mobil, tablet, desktop)
- Bruk "Kom i gang" som highlighted kort for nye brukere
- Følg Diataxis-strukturen for produktlandingssider

## 🆘 Trenger du hjelp?

- Se eksempelimplementasjonen i `/pages/authorization/`
- Sjekk [Designsystemet](https://designsystemet.no/) for komponenter
- Se [Next.js docs](https://nextjs.org/docs) for rammeverket

Lykke til! 🚀
