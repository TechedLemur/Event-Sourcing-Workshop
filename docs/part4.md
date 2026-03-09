# Del 4 - Nye krav

Noen har bestemt at vi skal ha med valutta i handlekurven. Din teamlead har bestemt at vi løser dette ved å lage en ny versjon av `ProductAddedToCartEvent` som inneholder valutta som en del av `price`-feltet.

`ProductAddedToCartEventV2` er allerede definert i [events.ts](../backend/src/events.ts).

## Oppgave 1 - ProductAddedToCartEventV2

Når man legger til et produkt i handlekurven, skal vi nå opprette denne nye eventen.

Din oppgave er å endre funksjonen `addItemToStream` i [CartService](../backend/src/services/cart.ts) slik at den oppretter `ProductAddedToCartEventV2` i stedet for `ProductAddedToCartEvent`.
Valutta er allerede en del av `Product`-objektet, så du kan bruke denne for å få alle verdient du trenger.

## Oppgave 2 - Håndtere ProductAddedToCartEventV2

En av karakteristikkene i Event Sourcing er at vi ikke kan endre eller slette eventer. Dette betyr at vi må fremdeles håndtere den gamle eventen, `ProductAddedToCartEvent`, samtidig som vi håndterer den nye eventen, `ProductAddedToCartEventV2`.

Din oppgave er å endre funksjonen `updateCart` i [CartService](../backend/src/services/cart.ts) slik at den håndterer begge eventene. Hvis du får V2 av eventen skal du sette `productCurrency`-feltet på `CartItem`-objektet til `currency`-feltet fra eventen sin `price`.

Acceptance criteria:

- `updateCart` skal håndtere både V1 og V2 av eventen.
- Frontend skal vise valutta i handlekurven for nye elementer som legges til i handlekurven.

## Ordre oppgave 6 - Order reactor

En stor fordel med Event Sourcing er at vi enkelt kan bryte opp systemet i isolerte biter som jobber isolert, litt som et samlebånd. Vi kan produsere en event også ha en tjeneste som lytter på denne eventen og basert på den utfører en side effekt og produserer en ny event. I utgangspunktet funker den veldig likt en projector, men en viktig distinksjon er at den har en sideeffekt. Basert på hvor viktig sideeffekten er så kan vi ha strenge krav til å levere den minst en gang eller i e.g bank, levere bare en gang. Derfor er det ekstra viktig i denne sammenheng å holde checkpoints eller id på enkelt eventer slik at man ikke ender opp med å lage duplikater. (I denne oppgaven er det ikke så krise, men verdt å tenke på!)

Event Sourcing går ofte veldig hånd i hånd med bruk av orkestreringspatterns som saga og workflow på det som er veldig sentrale biter av applikasjonen.

I denne oppgaven skal du produsere en invoice, men om du har en egen ide er det bare å følge denne. (e.g sende bekreftelses epost e.l.)

Acceptance criteria:

- Du skal opprette en subscription som lytter på `OrderCreated` eventen
- Når en `OrderCreated` event blir produsert, skal en `InnvoiceCreated` event produseres kort tid etter

Eventen må inneholde følgende:
```json
{
    "innvoiceId": "someId",
    "orderId": "orderId",
    "dueDate": "2026-11-03T12:34:56.789Z",
    "amount": 123.45,
    "status": "Created"
}
```

Optional criteria:

- Tenk gjennom / lag en reactor som purrer 2 dager før fristen

## Ordre oppgave 7 - Server sent events

En effekt av at hele systemet er sourcet fra events er at vi i teorien kan eksponere eventene direkte til en klient eller integrasjon. Dette gjør at vi kan få sanntidsoppdatering. I denne oppgaven skal du implementere sanntidsoppdatering av grafen. Generelt vil vi aldri eksponere eventene rå, men gjennom et derivat som vi har mer kontroll på. På denne måten gjør vi det enklere å introdusere nye versjoner av en event eller funksjonalitet uten at det fører til breaking changes.

Server Sent Events lar deg i grunn holde en get connection mot en server (sett fra klienten sitt perspektiv). Dette lar deg sende oppdateringer på en måte som er enklere enn web sockets. Admin siden er satt opp til å kunne koble seg mot et SSE endepunkt på `GET /orders/live` og forventer følgende datastruktur på eventene.

NB: Denne kan ikke lett testes med requests.http da det er en persistert connection.

Acceptance criteria:

- `GET /orders/live` responderer som et SSE endepunkt
- Admin grensesnittet oppdateres live når du gjør en checkout. (Åpne to tabs for å verifisere)

Eksempel payload:

```json
{
  "orderId": "123",
  "items": [
    { "productId": "123123", "productName": "Kaffi", "price": 100 }
  ],
  "totalAmount": 100,
  "createdAt": "2024-05-04T13:45:00.000Z"
}
```

Her er et kort eksempel på hvordan du kan eksponere server-sent events (SSE) i Express, på endepunktet `/orders/live`:

```js

router.get('/orders/live', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Her kan du sende nye ordre når de kommer inn:
  const orderEvent = {
    orderId: "123",
    items: [{ productId: "123123", productName: "Kaffi", price: 100 }],
    totalAmount: 100,
    createdAt: new Date().toISOString(),
  };
  res.write(`data: ${JSON.stringify(orderEvent)}\n\n`);

  // Lukk forbindelsen når klienten kobler fra
  req.on('close', () => res.end());
});

```