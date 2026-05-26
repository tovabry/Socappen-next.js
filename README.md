# Socappen - Frontend

## Innehållsförteckning

- [Introduktion](#introduktion)
- [Komma igång](#komma-igång)
  - [Förutsättningar](#förutsättningar)
  - [Klona och installera](#klona-och-installera)
  - [Miljövariabler](#miljövariabler)
  - [Scripts](#scripts)
- [Teknisk dokumentation](#teknisk-dokumentation)
  - [Arkitekturöversikt](#arkitekturöversikt)
  - [Tekniker](#tekniker)
  - [Projektstruktur](#projektstruktur)
  - [Komponentstruktur](#komponentstruktur)
  - [API-integration](#api-integration)
  - [Server Actions](#server-actions)
  - [Autentisering](#autentisering)
  - [Användarroller](#användarroller)
  - [Åtkomstmodell](#åtkomstmodell)
  - [Meddelanden](#meddelanden)
  - [Systemadministration](#systemadministration)
  - [Gemensam bekräftelse för destruktiva actions](#gemensam-bekräftelse-för-destruktiva-actions)
  - [Tester](#tester)
  - [Tekniska beslut](#tekniska-beslut)
  - [Exempel på tekniska flöden](#exempel-på-tekniska-flöden)
  - [Begränsningar och framtida förbättringar](#begränsningar-och-framtida-förbättringar)

## Introduktion

Socappen är en responsiv, mobile-first webbapplikation byggd med Next.js, TypeScript och Tailwind CSS.

Appen är designad för att:

- Skicka och ta emot meddelanden i realtid.
- Skapa, läsa och hantera FAQs.
- Skapa, läsa och hantera posts som en "media-vägg".
- Skapa, läsa och hantera kontakter till andra relevanta webbplatser, kontaktpersoner eller organisationer.
- Hantera användare och konton med roller och behörigheter.

Socappen Frontend fungerar som klient mot en separat backend och ansvarar för användargränssnitt, route-skydd, server actions, API-kommunikation, autentiseringsstate och realtidsuppdateringar i chatten.

Backend-delen av projektet hittas här: https://github.com/tovabry/Socappen

Frontend är beroende av backend-projektet för autentisering, datahantering, behörigheter och WebSocket-kommunikation. Backend måste vara startad innan frontendens skyddade funktioner kan användas fullt ut.

---

## Komma igång

### Förutsättningar

- Node.js 20 eller senare
- npm 10 eller senare
- Backend-API måste vara igång och nåbart
- WebSocket-endpoint måste vara igång för realtidschatten

### Klona och installera

```bash
git clone https://github.com/tovabry/Socappen-next.js.git
cd Socappen-next.js
npm install
```

### Miljövariabler

Skapa en `.env`-fil i projektroten och fyll i:

```env
NEXT_PUBLIC_API_URL=      # Bas-URL till backendens REST API
NEXT_PUBLIC_SOCKET_URL=   # Bas-URL till backendens WebSocket-endpoint
```

### Scripts

| Kommando        | Beskrivning               |
| --------------- | ------------------------- |
| `npm run dev`   | Startar utvecklingsmiljö  |
| `npm run test`  | Kör tester                |
| `npm run lint`  | Kör lint                  |
| `npm run build` | Bygger produktionsversion |
| `npm run start` | Startar produktionsserver |

---

## Teknisk dokumentation

### Arkitekturöversikt

Frontendapplikationen är byggd med Next.js App Router och är uppdelad i tydliga ansvarsområden:

- `app/` innehåller routes, layouts, pages och server actions.
- `components/` innehåller återanvändbara UI-komponenter.
- `lib/` innehåller API-logik, autentiseringshjälpare, permissions-logik och återanvändbara hooks.
- `contexts/` innehåller global klientstate, till exempel inloggad användare via `AuthContext`.
- `test/` innehåller tester för komponenter, hjälpfunktioner och centrala flöden.

Applikationen använder både server-side och client-side logik. Server-side används främst för skyddade routes, datahämtning och mutationer via server actions. Client-side används för interaktiva komponenter, autentiseringsstate och realtidsuppdateringar i chatten.

#### Översiktligt dataflöde

```txt
Användare
   ↓
Next.js route / page
   ↓
Server Component eller Client Component
   ↓
Server Action eller API-helper i lib/
   ↓
Backend REST API
   ↓
Databas / WebSocket / annan backendlogik
```

### Tekniker

- **Next.js**: För server-rendering, routing, App Router och server actions.
- **TypeScript**: För typning och bättre utvecklarupplevelse.
- **Tailwind CSS**: För responsiv mobile-first design.
- **Jest & React Testing Library**: För testning.
- **StompJS/SockJS**: För WebSocket-kommunikation i realtidschatten.

---

### Projektstruktur

Projektet är organiserat enligt följande:

```txt
app/              # Next.js App Router, sidor, layouts och server actions
components/       # Återanvändbara UI-komponenter
contexts/         # React Context, t.ex. AuthContext
lib/              # API-klienter, auth-hjälpare, hooks och utility-funktioner
public/           # Statiska filer och bilder
test/             # Tester för komponenter, lib-funktioner och app-flöden
proxy.ts          # Route-skydd och JWT-validering
```

---

### Komponentstruktur

Komponenter är uppdelade efter återanvändbarhet och ansvar:

- Sidkomponenter i `app/` ansvarar för routing, datahämtning och layout på sidnivå.
- UI-komponenter i `components/` ansvarar för presentation och återanvändbara interaktioner.
- Logik som används på flera ställen flyttas till `lib/` eller hooks.
- Global klientstate hanteras i contexts, till exempel via `AuthContext`.

Exempel:

```txt
app/messages/page.tsx              # Hämtar och visar konversationslistan
app/messages/[conversationId]/     # Visar en specifik konversation
components/ConfirmActionButton.tsx # Återanvänd bekräftelse för delete-actions
lib/useMessages.ts                 # Hanterar WebSocket-prenumerationer
```

---

### API-integration

Frontend kommunicerar med backend via REST-anrop för CRUD-funktioner och via WebSocket för realtidschatten.

#### Gemensamma API-anrop

- **`serverFetch`**
  - En wrapper runt `fetch` som hanterar HTTP-cookies som standard för server-side API-anrop.
- **`getRoles`**
  - Avkodar JWT-token från cookien för att server-side kontrollera användarens roll och behörighet.
- **`getPermissions` / `hasPermission`**
  - Hämtar inloggad användares permissions från `/users/me`.
  - Används för funktionsstyrning i UI, till exempel för att visa eller dölja admin-actions.

#### Unika API-anrop

- CRUD-operationer för posts, contacts och FAQs hanteras i respektive `actions.ts`-fil.
- Meddelandefunktionens konversationer och meddelanden hanteras via separata actions och hooks.

#### Realtidskommunikation

- **StompJS/SockJS** används för WebSocket-anslutning till chattfunktionen.
- Anslutningen hanteras via `useMessages`, som prenumererar på nya meddelanden i realtid.

---

### Server Actions

Projektet använder server actions för mutationer, till exempel när en användare skapar, uppdaterar eller tar bort posts, FAQs eller kontakter.

Ett typiskt server action-flöde ser ut så här:

1. Användaren skickar ett formulär från UI:t.
2. Formuläret anropar en server action i relevant `actions.ts`-fil.
3. Server actionen använder `serverFetch` för att kommunicera med backend.
4. Backend utför operationen och returnerar resultat.
5. Frontend uppdaterar cache eller vy med `revalidatePath`.
6. Användaren skickas vidare med `redirect` vid behov.

Exempel:

```txt
app/post/page.tsx
   ↓
app/post/actions.ts
   ↓
lib/serverFetch.ts
   ↓
Backend API
   ↓
revalidatePath("/post")
```

---

### Autentisering

- JWT-token lagras i en **HTTP-only cookie** efter inloggning.
- `proxy.ts` dekoderar token vid varje request och:
  - Omdirigerar till `/login` om token saknas eller har gått ut.
  - Omdirigerar till `/home` om användaren försöker nå en sida de inte har behörighet till.

#### Autentisering i flera lager

| Lager             | Ansvar                                             |
| ----------------- | -------------------------------------------------- |
| HTTP-only cookie  | Lagrar JWT-token efter inloggning                  |
| `proxy.ts`        | Skyddar routes och omdirigerar obehöriga användare |
| Server Components | Läser roller och permissions server-side           |
| Server Actions    | Validerar känsliga operationer innan API-anrop     |
| Client Components | Visar eller döljer UI baserat på permissions       |

Frontendens permissions-kontroller används främst för att styra användarupplevelsen, till exempel genom att visa eller dölja knappar och vyer. Känsliga operationer måste även valideras i backend, eftersom frontend-kontroller kan kringgås.

#### Klient-side autentiseringsstate

- **`AuthContext`** hanterar den inloggade användarens state på klientsidan.
- Vid appstart hämtar `AuthProvider` den inloggade användaren via `fetchCurrentUser` och exponerar `user`, `loading` och `logout` till hela komponentträdet via React Context.
- Komponenter som behöver tillgång till inloggad användare använder `useAuth()`-hooken.

---

### Användarroller

| Roll            | Åtkomst                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `ROLE_USER`     | Standardåtkomst till användarfunktioner.                                    |
| `ROLE_ADMIN`    | Administrativ åtkomst, inklusive `/sysadmin`-funktioner enligt route-skydd. |
| `ROLE_SYSADMIN` | Utökad administrativ åtkomst, inklusive `/sysadmin`.                        |

---

### Åtkomstmodell

Applikationen använder en kombination av **roller** och **permissions**.

- **Roller** avgör grundåtkomst till delar av systemet.
- **Permissions** avgör vilka specifika funktioner en användare får utföra, till exempel redigera FAQ, hantera användare eller se loggar.

#### Skillnad mellan roller och permissions

| Kontrolltyp | Exempel       | Används för                              |
| ----------- | ------------- | ---------------------------------------- |
| Roll        | `ROLE_ADMIN`  | Ge åtkomst till administrativa vyer      |
| Permission  | `manage_faq`  | Visa eller tillåta FAQ-hantering         |
| Permission  | `manage_user` | Visa användarhantering och admin-actions |

Detta gör att systemet kan skilja på en användares övergripande roll och exakt vilka funktioner en admin får använda.

#### Exempel på permissions

- `manage_user`
- `manage_faq`
- `manage_post`
- `manage_contact`
- `manage_permission`
- `view_logs`

Permissions hämtas via `/users/me` (`getPermissions`/`hasPermission`) och används i frontend för att visa eller dölja actions. För gäster returneras tom permission-set.

---

### Meddelanden

Meddelandefunktionen är roll- och behörighetsstyrd:

- Endast inloggade användare får nå `/messages` via route-skydd i `proxy.ts`.
- Vanliga användare (`ROLE_USER`) ser endast sina egna konversationer.
- Admin/sysadmin kan se alla konversationer i listan.
- För att öppna en specifik konversation krävs deltagarskap, även för admin/sysadmin.
- Endast admin/sysadmin kan gå med i konversationer via `joinConversation`.
- URL-manipulation begränsas genom server-side validering av deltagarskap i konversation.

Åtkomst kontrolleras i flera lager:

1. Route-skydd i `proxy.ts`.
2. Server-side kontroll i `app/messages/[conversationId]/page.tsx`.
3. Server actions i `app/messages/actions.ts`.
4. Backendens slutgiltiga validering.

---

### Systemadministration

Sidan `/sysadmin/users` innehåller:

- Listning av användare.
- Filtrering per roll.
- Promote/demote av administratörsroll.
- Hantering av användarbehörigheter.
- Borttagning av konto med bekräftelse.

UI för olika actions visas endast när användaren har rätt permission.

---

### Gemensam bekräftelse för destruktiva actions

Alla delete-flöden använder en gemensam komponent för bekräftelse (`ConfirmActionButton`), vilket ger:

- Konsekvent UX.
- Återanvändbar kod.
- Minskad risk för oavsiktlig borttagning.

---

### Tester

Projektet använder **Jest** och **React Testing Library** för enhets- och komponenttester.

Testerna fokuserar främst på:

- Rendering och interaktion i UI-komponenter.
- Validerings- och hjälpfunktioner i `lib/`.
- Behörighets- och åtkomstrelaterade flöden, till exempel meddelanden.

Testfiler finns under:

- `test/components/`
- `test/lib/`
- `test/app/`

Kör alla tester med:

```bash
npm run test
```

#### Teststrategi

| Testtyp         | Syfte                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| Komponenttester | Säkerställa att UI renderas och reagerar på användarinteraktion          |
| Lib-tester      | Testa hjälpfunktioner, permissions-logik och validering                  |
| Flödestester    | Testa centrala beteenden, till exempel behörighet i meddelandefunktionen |

Exempel på viktiga testområden:

- Att komponenter renderar rätt beroende på användarroll.
- Att permissions styr vilka actions som visas.
- Att formulärvalidering fungerar innan API-anrop.
- Att meddelandeflöden hanterar deltagarskap korrekt.

---

### Tekniska beslut

#### Next.js App Router

Projektet använder Next.js App Router eftersom den ger stöd för server components, nested layouts och server actions. Detta passar projektet eftersom flera vyer behöver hämta data server-side och samtidigt skyddas baserat på autentisering och behörighet.

#### HTTP-only cookies

JWT-token lagras i en HTTP-only cookie för att minska risken att token exponeras via klientbaserad JavaScript. Det gör också att server-side routes och server actions kan läsa autentiseringsinformationen utan att klienten behöver hantera token direkt.

#### Roll- och behörighetsbaserad åtkomstkontroll

Next.js route-skydd används tillsammans med HTTP-only cookies för grundläggande åtkomstkontroll. Funktioner i UI styrs även av permissions (`hasPermission`) för mer finkornig åtkomst.

#### WebSocket för chatt

Chatten använder WebSocket via StompJS/SockJS eftersom meddelanden behöver kunna skickas och tas emot i realtid utan att klienten kontinuerligt behöver polla backend.

#### Mobile-first design

Applikationen är byggd med mobile-first-tänk. Detta innebär att applikationen i första hand ska fungera och se bra ut på mindre skärmar, som mobiler. Därefter skalas UI:t upp för större skärmar.

#### Caching och prestanda

ISR (Incremental Static Regeneration) används för att förbättra prestanda och minska belastningen på servern.

`revalidatePath` används för att dynamiskt uppdatera sidor när ändringar görs, till exempel när en FAQ uppdateras.

Caching-tider:

- FAQs och kontakter: 20 minuter.
- Posts: 5 minuter.

---

### Exempel på tekniska flöden

#### Post-funktionalitet

1. Skapa ett inlägg:
   - Formulärdata skickas från klienten till `createPost` i `app/post/actions.ts`.
   - `createPost` använder `serverFetch` för att skicka data till backend-API:t.
   - Efter lyckad skapelse uppdateras sidan med `revalidatePath` och användaren omdirigeras.

2. Uppdatera ett inlägg:
   - Liknande flöde som för att skapa ett inlägg, men med en PUT-förfrågan till API:t.

3. Ta bort ett inlägg:
   - `deletePost` skickar en DELETE-förfrågan till API:t och uppdaterar sidan.

#### Behörighetsflöde

1. Route-skydd sker i `proxy.ts` med JWT-cookie.
2. Server components använder `getRoles()` för rollkontroll.
3. UI-funktioner styrs med `hasPermission()` från `/users/me`.
4. Känsliga operationer valideras även i server actions och backend.

#### Meddelandeflöde

1. Konversationslistan hämtas från backend (`/conversations/my` och vid admin även `/conversations`).
2. Öppning av en konversation valideras server-side i `app/messages/[conversationId]/page.tsx`.
3. Meddelandehistorik hämtas med paginering.
4. Nya meddelanden pushas i realtid via WebSocket (`useMessages`).

#### Server Action-flöde

1. Formulär skickas från klienten till en server action i `app/**/actions.ts`.
2. Server action anropar backend via `serverFetch`.
3. Vid lyckad mutation uppdateras UI med `revalidatePath` och eventuell `redirect`.

---

### Begränsningar och framtida förbättringar

Projektet innehåller flera centrala frontendflöden, men det finns områden som kan vidareutvecklas:

- Utökad testtäckning för server actions.
- E2E Tester för ännu mer testtäckning.
- Mer konsekvent hantering av loading- och error-states.
- Tydligare typning av API-responser.
- Email notiser / funktionsbrevlåda påbörjat ui men ingen funktionalitet i backend som fungerar än.
