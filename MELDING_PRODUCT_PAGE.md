# Melding og Formidling Product Page

## Overview
Created a new product page for Team Melding og Formidling, covering both **Altinn Melding** (Correspondence) and **Altinn Formidling** (File Transfer) services.

## What Was Created

### 1. Product Entry in `data/products.json`
- **Product ID:** `melding`
- **Title:** Melding og Formidling
- **URL:** `/melding`
- **Short Description:** Sikker digital kommunikasjon og filoverføring
- **Volume:** Handles 76M+ messages annually

### 2. Product Page at `pages/melding/index.tsx`
- React component using ProductLandingPage
- SEO-optimized with proper meta tags
- Accessibility-friendly with skip-to-content link

## Product Structure (Diataxis Framework)

### 📖 Explanation Sections
1. **Om Melding og Formidling** - Core concepts
2. **Altinn Melding (Correspondence)** - Message exchange with 76M+ annual volume
3. **Altinn Formidling** - Large file transfers via web services/SFTP

### 🚀 Tutorial Sections
1. **Kom i gang med Melding** ⭐ (Highlighted)
   - Subsections:
     - Opprett første melding
     - Konfigurer varsling
     - Test i testmiljø
2. **Kom i gang med Formidling** - File transfer setup

### 📚 How-to Sections
1. **Migrering til Altinn 3** (Critical: Deadline June 2026)
   - Subsections:
     - Migreringsplan
     - API-endringer
     - Testing av migrering
2. **Guider** - Common tasks
   - Subsections:
     - Sende melding med vedlegg
     - Håndtere sikkerhetsnivåer
     - Sette opp varsling (e-post/SMS)
     - Overføre store filer

### 📑 Reference Sections
1. **API-referanse Altinn 3** - REST API for new version
   - Subsections:
     - Autentisering
     - Endpoints
     - Feilkoder
2. **API-referanse Altinn 2 (Legacy)** - Web services/SFTP for existing version

## Key Features Addressed

### From Team Notes:
✅ **Viktor-case:** Landing page for their product
✅ **Dual Product Coverage:** Both Melding and Formidling in one cohesive structure
✅ **Migration Focus:** Dedicated section for Altinn 2 → 3 migration (June 2026 deadline)
✅ **Version Support:** Separate API references for Altinn 2 (legacy) and Altinn 3
✅ **High Volume:** Highlights 76M+ messages/year capability

## Team Information

### Team Members
- **Viktor Olsen** - Produkteier (Brønnøysund)
- **Tore Måsøy** - Scrum Master (Brønnøysund)
- **Erik Hagen** - Arkitekt (Oslo)
- **Marianne Saltnes** - Behovsstiller (Brønnøysund)
- **Roar Mjelde** - Tech Lead, Fullstack (konsulent, Oslo)
- **Andreas Hammerbeck** - Fullstack (konsulent, Oslo)
- **Martin Todorov** - Fullstack (Oslo)
- **Axel Ytterås** - Fullstack (Brønnøysund)
- **Tai Tien Huynh** - Fullstack (konsulent, Oslo)

**Slack Channel:** `#C079AJR5TEX`

### Responsibilities
- **Altinn 2:** Maintenance, bug fixes, feature development
- **Altinn 3:** New development, migration support, user engagement
- **Scope:** Backend, frontend, documentation

## Access the Page

Once the dev server is running:
- **Product Page:** http://localhost:3000/melding
- **Homepage:** Will display new "Melding og Formidling" card

## Next Steps

### Content Creation Needed:
The structure is in place, but actual content pages need to be created:

1. **Explanation Pages:**
   - [ ] `/melding/om` - Overview and concepts
   - [ ] `/melding/correspondence` - Detailed Melding documentation
   - [ ] `/melding/formidling` - Detailed Formidling documentation

2. **Tutorial Pages:**
   - [ ] `/melding/kom-i-gang/opprett-melding` - First message
   - [ ] `/melding/kom-i-gang/varsling` - Notification setup
   - [ ] `/melding/kom-i-gang/test` - Testing guide
   - [ ] `/melding/formidling/kom-i-gang` - File transfer setup

3. **Migration Pages:**
   - [ ] `/melding/migrering/plan` - Migration planning
   - [ ] `/melding/migrering/api-endringer` - API changes
   - [ ] `/melding/migrering/testing` - Migration testing

4. **How-to Guides:**
   - [ ] `/melding/guider/vedlegg` - Attachments guide
   - [ ] `/melding/guider/sikkerhetsnivaa` - Security levels
   - [ ] `/melding/guider/varsling` - Notifications (email/SMS)
   - [ ] `/melding/guider/store-filer` - Large file transfers

5. **API Reference:**
   - [ ] `/melding/api/v3/auth` - Authentication (Altinn 3)
   - [ ] `/melding/api/v3/endpoints` - Endpoints (Altinn 3)
   - [ ] `/melding/api/v3/errors` - Error codes (Altinn 3)
   - [ ] `/melding/api/v2` - Legacy API (Altinn 2)

### Suggested Priority Order:
1. **High Priority** (For new users):
   - Om Melding og Formidling
   - Kom i gang med Melding
   - API-referanse Altinn 3

2. **Medium Priority** (For migration):
   - Migrering til Altinn 3 (all subsections)
   - API-endringer guide

3. **Standard Priority**:
   - All how-to guides
   - Formidling documentation
   - Legacy API reference

## Links to Team Resources

### GitHub:
- **Felles roadmap:** https://github.com/orgs/digdir/projects/8/views/21
- **Sprint backlog:** https://github.com/orgs/Altinn/projects/54/views/12
- **Hovedbacklog:** https://github.com/orgs/Altinn/projects/54/views/36

### Digdir Roadmap:
- Filter: "Melding" or "Formidling" at https://github.com/digdir/roadmap

### Existing Documentation:
- **Altinn Melding:** https://docs.altinn.studio/nb/correspondence/
- **Formidling:** https://samarbeid.digdir.no/altinn/altinn-formidling/2404

### Team Engagement:
- Bi-weekly open meetings for stakeholder input
- Contact: Viktor Olsen (Product Owner), Tore Måsøy (Scrum Master)

## Design Decisions

### Why One Product Page for Both?
- Managed by same team
- Related functionality (communication/data exchange)
- Shared migration timeline
- User journey may involve both services

### Why Highlight Migration?
- Critical deadline: June 2026
- Major pain point for service owners
- Affects all existing users
- Requires dual documentation (Altinn 2 + 3)

### Why Separate API References?
- Different architectures (Web Services vs REST)
- Different authentication mechanisms
- Users need clarity on which version to use
- Supports gradual migration

## Questions for Team Meeting

When meeting with Viktor/the team, consider asking:

1. **Structure:**
   - Does this structure work for your users?
   - Should Melding and Formidling be separate products?
   - Any missing sections?

2. **Migration:**
   - How to best present dual version docs?
   - Deprecation timeline for Altinn 2 docs?
   - Common migration questions to address?

3. **Content:**
   - Who will write the content?
   - Can we access existing docs to migrate?
   - Priority order for content creation?

4. **Users:**
   - Primary user personas?
   - Most common user journeys?
   - Biggest current pain points?
