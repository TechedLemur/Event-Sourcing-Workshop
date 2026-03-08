# Del 1

I denne første delen skal vi sette opp prosjektet og lage våre første eventer.

## Oppsett

Følg instruksene i [README.md](../README.md) for å sette opp prosjektet. Hvis du har gjort alt riktig skal du nå ha en backend som kjører på [http://localhost:3002](http://localhost:3002), en frontend som kjører på [http://localhost:3000](http://localhost:3000) og noen docker-containere som kjører eventstore og mongoDB.

Gå til [http://localhost:2113/web/index.html#/dashboard](http://localhost:2113/web/index.html#/dashboard) for å se at eventstore kjører korrekt.

## Oppgave 0 - Hello Event

Først skal vi teste at backended vår fungerer og kan kommunisere med eventstore.

I [requests.http](../backend/requests.http) finner du en liste med http-requests som du kan bruke til å teste backenden. Disse kan enkelt kjøres med [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) i VS Code. Eventuelt bruk Curl, Postman eller et annet verktøy om du vil.

1. Kjør `POST {{baseUrl}}/example` for å lage en eksempel-event.
2. Gå til [http://localhost:2113/web/index.html#/streams](http://localhost:2113/web/index.html#/streams) for å se at eventen er lagt til i eventstore. Det skal nå være en stream med navnet `hello-event-stream` som vi kan trykke på for å se eventene.
3. Kjør `GET {{baseUrl}}/example` for å sjekke at vi kan lese eventen fra eventstore.

## Oppgave 1 - Legg produkt i handlekurven

Vi skal nå starte på funksjonaliteten for å legge produkter i handlekurven.

Acceptance criteria:

- `POST /cart/:id/addItem` skal legge til et produkt i en `cart-<id>` stream.
- `ProductAddedToCart` event skal dukke opp i dashboardet i eventstore.

Din oppgave er å implementere funksjonene `addItemToCart` og `addItemToStream` i [CartService](../backend/src/services/cart.ts). Gjerne se på `createProduct` i [ProductService](../backend/src/services/products.ts) for inspirasjon.
Du skal i utgangspunktet bare trenge å legge til kode i blokkene der det står en `// TASK: ...` kommentar.

For å kalle endepunktet for å legge til produkt kan du klikke på "Add to Cart" på et produkt i frontenden. Du vil ikke se noen endringer i frontenden (denne oppgaven kommer snart), men du kan se at eventen er lagt til i eventstore.

Hint: `type` til eventen skal være `CartEventTypes.ProductAddedToCart`. Hvis du lager et objekt med `{ type: type: CartEventTypes.ProductAddedToCart, ... }` i `events`-array i `addItemToStream`, så skal typescript sine feilmeldinger gi deg informasjon om hva mer som mangler.

## Oppgave 2 - Slett produkt fra handlekurven

Vi skal nå implementere funksjonen `removeItemFromCart` i [CartService](../backend/src/services/cart.ts). Gjerne se på `deleteProduct` i [ProductService](../backend/src/services/products.ts) for inspirasjon.

Acceptance criteria:

- `DELETE /cart/:id/removeItem/:itemId` skal fjerne et produkt fra en `cart-<id>` stream.
- `ProductRemovedFromCart` event skal dukke opp i dashboardet i eventstore.

Din oppgave er å implementere funksjonen `removeItemFromCart` i [CartService](../backend/src/services/cart.ts).

Siden `getCart` ikke er implementert enda, kan du ikke bruke frontend for å teste funksjonen. Du kan kjøre http-requests i [requests.http](../backend/requests.http) i stedet. For å kalle riktig endepunkt må du ha både `cartId` og `itemId` som parametre. Du kan finne disse ved å se i EventStore dashboardet for en cart-stream og undersøke `ProduktAddedToCart` eventen.

Hint: Bruk `subject`-feltet i eventen for itemId. Denne skal være unik for hver instans av et produkt i handlekurven. Hvis du ikke gjorde dette i oppgave 1, bør du vurdere å ta en kikk tilbake på `addItemToCart` for å sette en fornuftig `subject`-verdi.

Workshoppen fortsetter i [Del 2](part2.md).
