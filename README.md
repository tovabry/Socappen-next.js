# Socappen

## Introduktion

Socappen är en responsiv, mobile-first webbapplikation byggd med Next.js och Tailwind CSS.

Appen är designad för att:

- Skicka och ta emot meddelanden i realtid.
- Skapa, läsa och hantera FAQs.
- Skapa, läsa och hantera posts som en "media-vägg".
- Skapa, läsa och hantera kontakter till andra relevanta webbplatser, kontaktpersoner eller organisationer.
- Hantera användare och konton med roller och behörigheter.

---

## Komma igång

### Klona och installera

```bash
git clone https://github.com/tovabry/Socappen-next.js.git
cd Socappen-next.js
npm install
```

### Miljövariabler

Skapa en `.env`-fil i projektroten och fyll i:

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
```

### Starta dev-miljö

```bash
npm run dev
```

### Köra tester

```bash
npm run test
```

---

## Teknisk Dokumentation

### Tekniker

- **Next.js**: För server-rendering och routing.
- **Tailwind CSS**: För responsiv design.
- **Jest**: För testning.
- **TypeScript**: För typning och bättre utvecklarupplevelse.
- **StompJS/SockJS**: För Websocket till realtids-chatten.

---

### Projektstruktur

Projektet är organiserat enligt följande:

- app/ → Next.js sidor och routing
- components/ → Återanvändbara React-komponenter
- lib/ → Hjälpfunktioner och API-anrop
- test/ → Jest-tester

---

### Designbeslut

1. **Responsiv design**:
   - Applikationen är byggd med "Mobile-first"-tänk. Detta innebär att applikationen i första hand ska fungera och se bra ut på mindre skärmar, som mobiler. Därefter skalas UI:et upp för större skärmar.

2. **Rollbaserad åtkomstkontroll**:
   - Next.js Middleware används tillsammans med HTTP-only cookies för att säkerställa att användare endast kan komma åt sidor och funktioner som de har behörighet till.

3. **Caching och prestanda**:
   - **ISR (Incremental Static Regeneration)** används för att förbättra prestanda och minska belastningen på servern.
   - **`revalidatePath`** används för att dynamiskt uppdatera sidor när ändringar görs, t.ex. när en FAQ uppdateras.
   - **Caching-tider**:
     - FAQs och kontakter: 20 minuter.
     - Posts: 5 minuter.

---

### Autentisering

- JWT-token lagras i en **HTTP-only cookie** efter inloggning.
- `proxy.ts` dekoderar token vid varje request och:
  - Omdirigerar till `/login` om token saknas eller har gått ut.
  - Omdirigerar till `/home` om användaren försöker nå en sida de inte har behörighet till.

#### Klient-side autentiseringsstate

- **`AuthContext`** hanterar den inloggade användarens state på klientsidan.
- Vid appstart hämtar `AuthProvider` den inloggade användaren via `fetchCurrentUser` och exponerar `user`, `loading` och `logout` till hela komponentträdet via React Context.
- Komponenter som behöver tillgång till inloggad användare använder `useAuth()`-hooken.

---

### Användarroller

| Roll            | Åtkomst                             |
| --------------- | ----------------------------------- |
| `ROLE_USER`     | Standard-åtkomst till appen.        |
| `ROLE_ADMIN`    | Åtkomst till `/admin` och `/logs`.  |
| `ROLE_SYSADMIN` | Full åtkomst inklusive `/sysadmin`. |

---

### API-Integration

#### Gemensamma API-anrop

- **`serverFetch`**:
  - En wrapper runt `fetch` som hanterar HTTP-cookies som standard för alla API-anrop.
- **`getRoles`**:
  - Avkodar JWT-token från cookien för att server-side kontrollera användarens roll och behörigheter.

#### Unika API-anrop

- **CRUD-operationer**:
  - Varje funktionalitet (t.ex. posts, contacts, FAQs) har sina egna API-anrop som hanteras i respektive `actions.ts`-fil.
- **Exempel**:
  - Skapa och hantera konversationer i `messages/actions.ts`.

#### Realtidskommunikation

- **StompJS/SockJS** används för WebSocket-anslutning till chattfunktionen.
- Anslutningen hanteras i `lib/` via `useMessages`-hooken som prenumererar på meddelanden i realtid.

---

### Exempel: Hur en funktion är byggd

#### Post-funktionalitet

1. **Skapa ett inlägg**:
   - Formulärdata skickas från klienten till `createPost` i `app/post/actions.ts`.
   - `createPost` använder `serverFetch` för att skicka data till backend-API:t.
   - Efter lyckad skapelse uppdateras sidan med `revalidatePath` och användaren omdirigeras.

2. **Uppdatera ett inlägg**:
   - Liknande flöde som för att skapa ett inlägg, men med en PUT-förfrågan till API:t.

3. **Ta bort ett inlägg**:
   - `deletePost` skickar en DELETE-förfrågan till API:t och uppdaterar sidan.

---
