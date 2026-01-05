---
title: Autentisering
description: Autentiseringskomponenten tilbyr funksjonalitet for å autentisere brukere og systemer som får tilgang til Altinn Apps og Altinn-plattformen.
weight: 10
---

Autentiseringskomponenten er ikke en ID-leverandør og oppretter kun autentiseringssesjoner basert på eksterne ID-leverandører som:

- [ID-porten](https://eid.difi.no/nb/id-porten)
- [Maskinporten](https://samarbeid.digdir.no/maskinporten/maskinporten/25)
- [Feide](https://www.feide.no/).

Autentiseringskomponenten oppretter JWT-tokene med påstander om brukeren og systemet.

Repository for Altinn-autentisering finner du [her](https://github.com/Altinn/altinn-authentication).

Backlog med åpne saker finner du [her](https://github.com/Altinn/altinn-authentication/issues).

## Tokenutveksling for Altinn-portalen

Når en bruker logger inn i Altinn-portalen (gammel løsning), utstedes en informasjonskapsel (cookie) som inneholder informasjon om den autentiserte brukeren. Denne informasjonskapselen bruker [et proprietært format for ASP.NET](https://support.microsoft.com/en-us/help/301240/how-to-implement-forms-based-authentication-in-your-asp-net-applicatio) (Full rammeverk) og kan kun tolkes av applikasjoner bygget på .NET Framework som har tilgang til den symmetriske krypteringsnøkkelen.

Altinn-plattformen er basert på ASP.NET Core og kan ikke tolke informasjonskapselen.

## Tokenutveksling for Maskinporten

Organisasjoner autentisert i Maskinporten kan bytte sitt JWT mot et gyldig Altinn-plattform JWT.

## Tokenutveksling for ID-porten

Sluttbrukere autentisert gjennom ID-porten kan bytte sitt JWT mot et gyldig Altinn-plattform JWT.

## Bytt et JWT fra en ekstern tokenleverandør

Godkjente leverandører inkluderer: `Maskinporten` og `id-porten`.
Forespørselen må inkludere et bearer-token i autorisasjonsheaderen.

> **Info:** Et token fra ID-porten inneholder både et ID-token og et access-token. Kun access-token skal byttes ved hjelp av dette endepunktet.

```http
GET /exchange/{tokenProvider}?test={bool}
```

## Arkitektur

Se [Arkitektur](/authorization/reference/architecture/) for detaljer.
