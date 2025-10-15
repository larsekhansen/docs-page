# Template-guide for produktlandingssider

Denne guiden forklarer hvordan du bruker produktlandingsside-templaten for å lage konsistente dokumentasjonssider.

## 🎯 Hensikten med templaten

Templaten sikrer at alle produkter har:
- **Konsistent struktur** - Samme layout og navigasjon
- **Diataxis-kompatibel** - Følger beste praksis for dokumentasjon
- **JTBD-fokusert** - Strukturert rundt brukerens behov
- **Tilgjengelig** - WCAG 2.1 AA-kompatibel
- **Responsiv** - Fungerer på alle enheter

## 📋 Anatomien til en produktlandingsside

```
┌─────────────────────────────────────────┐
│ Hero-seksjon                            │
│ • Produkttittel                         │
│ • Produktbeskrivelse (2-3 setninger)   │
└─────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📖 Om        │ │ ✨ Hva får   │ │ 🚀 Kom i     │
│   [Produkt]  │ │    du?       │ │    gang      │
│              │ │              │ │ (highlighted)│
│ Explanation  │ │ Explanation  │ │ Tutorial     │
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ 📚 Guider    │ │ 📑 Referanse │
│              │ │              │
│ How-to       │ │ Reference    │
└──────────────┘ └──────────────┘
```

## 🔧 Steg-for-steg: Legg til nytt produkt

### Steg 1: Planlegg innholdet

Før du begynner, tenk gjennom:

**Diataxis-kategoriene:**
- Hva trenger brukeren å **forstå**? (Explanation)
- Hva trenger brukeren å **lære**? (Tutorial)
- Hvilke **oppgaver** må brukeren løse? (How-to)
- Hvilken **teknisk informasjon** trengs? (Reference)

**Jobs to be Done:**
1. "Jeg vil forstå hva dette er" → Om-seksjon
2. "Jeg vil komme i gang raskt" → Kom i gang
3. "Jeg vil løse et spesifikt problem" → Guider
4. "Jeg trenger teknisk referanse" → Referanse/API-docs

### Steg 2: Legg til produktmetadata

Rediger `data/products.json` og legg til ditt produkt:

```json
{
  "id": "mitt-produkt",
  "title": "Mitt Produkt",
  "shortDescription": "Kort beskrivelse for produktkortet (maks 100 tegn)",
  "description": "Lengre beskrivelse for landingssiden (2-3 setninger som forklarer hva produktet er og hvem det er for)",
  "url": "/mitt-produkt",
  "sections": [
    {
      "type": "explanation",
      "title": "Om Mitt Produkt",
      "description": "Lær om konseptene og arkitekturen",
      "url": "/mitt-produkt/om",
      "icon": "information"
    },
    {
      "type": "explanation",
      "title": "Hva får du?",
      "description": "Oversikt over funksjoner og komponenter",
      "url": "/mitt-produkt/features",
      "icon": "bulb"
    },
    {
      "type": "tutorial",
      "title": "Kom i gang",
      "description": "Sett opp og kom i gang med produktet",
      "url": "/mitt-produkt/kom-i-gang",
      "icon": "rocket",
      "highlighted": true
    },
    {
      "type": "how-to",
      "title": "Guider",
      "description": "Steg-for-steg guider for vanlige oppgaver",
      "url": "/mitt-produkt/guider",
      "icon": "book"
    },
    {
      "type": "reference",
      "title": "Referanse",
      "description": "Teknisk dokumentasjon og API-referanse",
      "url": "/mitt-produkt/referanse",
      "icon": "code"
    }
  ]
}
```

**Viktige felt:**
- `id`: Unik identifikator (lowercase, bindestrek for mellomrom)
- `title`: Visningstittelen
- `shortDescription`: Vises på produktkortet på forsiden
- `description`: Vises øverst på produktlandingssiden
- `sections`: Array av navigasjonskort

### Steg 3: Opprett produktside

Opprett filen `pages/mitt-produkt/index.tsx`:

```tsx
import Head from 'next/head';
import { ProductLandingPage } from '@/components/product-landing/ProductLandingPage';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';

export default function MittProduktPage() {
  const product = productsData.products.find(
    (p) => p.id === 'mitt-produkt'
  ) as Product;

  if (!product) {
    return <div>Produkt ikke funnet</div>;
  }

  return (
    <>
      <Head>
        <title>{product.title} - Digdir Dokumentasjon</title>
        <meta name="description" content={product.description} />
      </Head>
      <main id="main-content">
        <a href="#main-content" className="skip-to-main">
          Hopp til hovedinnhold
        </a>
        <ProductLandingPage product={product} />
      </main>
    </>
  );
}
```

### Steg 4: Opprett innholdssider

For hver seksjon, opprett tilsvarende side:

```
pages/
└── mitt-produkt/
    ├── index.tsx         (Landingsside)
    ├── om.tsx            (Om-seksjon)
    ├── features.tsx      (Hva får du?)
    ├── kom-i-gang.tsx    (Kom i gang tutorial)
    ├── guider/
    │   ├── index.tsx     (Guideoversikt)
    │   ├── guide-1.tsx
    │   └── guide-2.tsx
    └── referanse/
        ├── index.tsx     (API-oversikt)
        └── api.tsx
```

## 🎨 Tilpass designet

### Ikoner

Tilgjengelige ikoner (foreløpig emojis, kan byttes med Designsystemet sine ikoner):
- `information` → 📖
- `bulb` → ✨
- `rocket` → 🚀
- `book` → 📚
- `code` → 📑

For å legge til nye ikoner, rediger `getIconForType()` i `components/product-landing/NavigationCard.tsx`.

### Highlight kort

Bruk `"highlighted": true` for å fremheve det viktigste kortet (vanligvis "Kom i gang"):

```json
{
  "type": "tutorial",
  "title": "Kom i gang",
  "highlighted": true
}
```

### Fleksibilitet

Du kan ha **3-6 seksjoner** per produkt. De vanligste strukturene:

**Minimal (3 seksjoner):**
- Kom i gang (tutorial)
- Guider (how-to)
- Referanse (reference)

**Standard (5 seksjoner)** - Anbefalt:
- Om [Produkt] (explanation)
- Hva får du? (explanation)
- Kom i gang (tutorial)
- Guider (how-to)
- Referanse (reference)

**Utvidet (6+ seksjoner):**
Legg til flere seksjoner som:
- FAQ (how-to)
- Eksempler (tutorial)
- Arkitektur (explanation)

## ✅ Sjekkliste

Før du publiserer en ny produktside:

- [ ] Produktmetadata lagt til i `products.json`
- [ ] Produktlandingsside opprettet (`pages/[produkt]/index.tsx`)
- [ ] Alle seksjonssider opprettet
- [ ] Beskrivelser er klare og konsise
- [ ] "Kom i gang" er markert som highlighted
- [ ] Alle lenker fungerer
- [ ] Testet på mobil, tablet og desktop
- [ ] Tilgjengelighetstestet (keyboard navigation, screen reader)
- [ ] SEO-metadata (title, description) er på plass

## 🔍 Eksempel: Authorization

Se `pages/authorization/index.tsx` for et komplett eksempel på hvordan templaten brukes.

## 💡 Tips

1. **Hold beskrivelsene korte** - Brukeren skal raskt forstå hva hver seksjon handler om
2. **Bruk aktive verb** - "Sett opp", "Lær", "Utforsk", ikke "Informasjon om"
3. **Prioriter "Kom i gang"** - Dette er ofte det første brukeren trenger
4. **Konsistens** - Bruk samme struktur og terminologi på tvers av produkter
5. **Test med ekte brukere** - Få tilbakemelding på om strukturen gir mening

## 🆘 Trenger du hjelp?

- Se [README.md](./README.md) for teknisk dokumentasjon
- Se eksempelimplementasjonen i `/pages/authorization/`
- Kontakt team for spørsmål om struktur og innhold
