# Del 1

I denne første delen skal vi sette opp prosjektet og lage våre første eventer.

## Oppsett

Følg instruksene i [README.md](../README.md) for å sette opp prosjektet. Hvis du har gjort alt riktig skal du nå ha en backend som kjører på [http://localhost:3002](http://localhost:3002), en frontend som kjører på [http://localhost:3000](http://localhost:3000) og noen docker-containere som kjører eventstore og mongoDB.

Gå til [http://localhost:2113/web/index.html#/dashboard](http://localhost:2113/web/index.html#/dashboard) for å se at eventstore kjører korrekt.

## Oppgave 0 - Hello Event

Først skal vi teste at backenden vår fungerer og kan kommunisere med EventStore.

I [requests.http](../backend/requests.http) finner du en liste med http-requests som du kan bruke til å teste backenden. Disse kan enkelt kjøres med [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) i VS Code. Eventuelt bruk Curl, Postman eller et annet verktøy om du vil.

1. Kjør `POST {{baseUrl}}/example` for å lage en eksempel-event.
2. Gå til [http://localhost:2113/web/index.html#/streams](http://localhost:2113/web/index.html#/streams) for å se at eventen er lagt til i eventstore. Det skal nå være en stream med navnet `hello-event-stream` som vi kan trykke på for å se eventene.
3. Kjør `GET {{baseUrl}}/example` for å sjekke at vi kan lese eventen fra eventstore.

## Oppgave 1 - Legg produkt i handlekurven

Vi skal nå starte på funksjonaliteten for å legge produkter i handlekurven.

Acceptance criteria:

- `POST /cart/:id/addItem` skal legge til et produkt i en `cart-<id>` stream.
- `ProductAddedToCart` event skal dukke opp i dashboardet i eventstore.

Din oppgave er å implementere funksjonene `addItemToCart` og `addItemToCartStream` i [CartService](../backend/src/services/cart.ts). Gjerne se på `createProduct` i [ProductService](../backend/src/services/products.ts) for inspirasjon.
Du skal i utgangspunktet bare trenge å legge til kode i blokkene der det står en `// TASK: ...` kommentar.

For å kalle endepunktet for å legge til produkt kan du klikke på "Add to Cart" på et produkt i frontenden. Du vil ikke se noen endringer i frontenden (denne oppgaven kommer snart), men du kan se at eventen er lagt til i eventstore.

Hint: `type` til eventen skal være `CartEventTypes.ProductAddedToCart`. Hvis du lager et objekt med `{ type: CartEventTypes.ProductAddedToCart, ... }` i `events`-array i `addItemToCartStream`, så skal typescript sine feilmeldinger gi deg informasjon om hva mer som mangler.

Hint: `subject`-feltet i eventen kan settes til `cartId`.

## Oppgave 2 - Slett produkt fra handlekurven

Vi skal nå implementere funksjonen `removeItemFromCart` i [CartService](../backend/src/services/cart.ts). Gjerne se på `deleteProduct` i [ProductService](../backend/src/services/products.ts) for inspirasjon.

Acceptance criteria:

- `DELETE /cart/:id/removeItem/:itemId` skal fjerne et produkt fra en `cart-<id>` stream.
- `ProductRemovedFromCart` event skal dukke opp i dashboardet i eventstore.

Din oppgave er å implementere funksjonen `removeItemFromCart` i [CartService](../backend/src/services/cart.ts).

Siden `getCart` ikke er implementert enda, kan du ikke bruke frontend for å teste funksjonen. Du kan kjøre http-requests i [requests.http](../backend/requests.http) i stedet. For å kalle riktig endepunkt må du ha både `cartId` og `itemId` som parametre. Du kan finne disse ved å se i EventStore dashboardet for en cart-stream og undersøke `ProductAddedToCart` eventen.

Workshoppen fortsetter i [Del 2](part2.md).

---

## Ordre

Gjennom workshoppen vil det gå et parallelt løp med helt valgfrie oppgaver som innebærer å produsere et ordreløp. Tanken bak disse oppgavene er at du skal selv måtte ta valg som omhandler event sourcing og føle litt på hva som funker og hva som ikke funker. Disse oppgavene vil ikke få svarene utdelt i hver del, så om du ikke får til en oppgave så kan du ikke alltid gå videre til neste del. Fokuser på å fullføre oppgavene som er del av workshoppen og se på disse oppgavene om du blir raskt ferdig og ønsker se mer på event sourcing.

### Ordre oppgave 1 - Lage ordre eventer

I denne oppgaven skal du lage helt egne eventer for ordre basert på det som blir bestilt fra en handlekurv. I butikken så kan en bruker klikke "Checkout", dette vil kalle endepunktet `POST /order/checkout/:cartId`. Vi har laget selve endepunktet i [OrderRoute](../backend/src/routes/order.ts). Du skal implementere denne routen slik at en ordre-event blir produsert til EventStore.

Når du lager ordre-eventen, tenk gjerne gjennom hvor det gir mening at informasjonen lever mtp. business caset. E.g. gir det mening å kopiere produkt navnet eller burde dette leve i ordren?

Acceptance criteria:

- `POST /orders/checkout/:cartId` skal opprette en ny ordre
- En event relatert til ordre skal dukke opp i dashboardet i eventstore

Optional criteria:

- Tømme handlekurven når en ordre blir opprettet

Workshoppen fortsetter i [Del 2](part2.md).
