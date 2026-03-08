# Del 3 - Cart Service V2

Før du begynner på denne oppgaven, trykk på "Shop V2" i frontend navbar.

I denne delen skal vi implementere en projector (også kalt denormalizer) for å bygge tilstanden til handlekurven, og lagre denne i en database. Fordelen med denne tilnærmingen er at når vi gjør `getCart` kan vi lese ut tilstanden til handlekurven fra databasen direkte, uten å måtte lese ut hele cart-streamen fra eventstore for hver eneste request. Etter hvert som antall eventer i streamen vokser, vil det gå tregere og tregere å lese gjennom eventene.

Databasen vil kontinuerlig bli oppdatert med nye eventer som kommer inn i eventstore gjennom en `subscription`. Vi har allerede satt opp subscriptions i [index.ts](../backend/src/index.ts), så du trenger ikke å gjøre dette oppsettet selv.

Det er laget en [ProductServiceV2](../backend/src/services/productsV2.ts) som lagrer produkter i databasen, denne kan være nyttig å se på for inspirasjon.

## Oppgave 1 - Add Item to Cart V2

Vi skal nå implementere versjon 2 av `addItemToCart` funksjonen.

Acceptance criteria:

- `POST /cart/v2/:id/addItem` skal legge til et produkt i handlekurven fra databasen.
- Info om produktet hentes fra databasen, ikke leses direkte fra eventstore.

Din oppgave er å implementere funksjonen `addItemToCartV2` i [CartServiceV2](../backend/src/services/cartV2.ts).

Det eneste vi trenger å gjøre i denne oppgaven er å bruke riktig funksjon fra [ProductsServiceV2](../backend/src/services/productsV2.ts) for å hente ut produktet.

## Oppgave 2 - Handle Cart Event

Vi skal nå håndtere eventer som blir lest ut fra `subscription` av cart-streamen.

Acceptance criteria:

- `handleCartEvent` skal håndtere eventer som kommer inn i eventstore og oppdatere tilstanden til handlekurven i databasen.

Din oppgave er å implementere funksjonen `handleCartEvent` i [CartServiceV2](../backend/src/services/cartV2.ts). Her må vi først hente ut handlekurven fra databasen, og så oppdatere den basert på eventen. Hvis handlekurven ikke finnes i databasen, skal vi starte med en ny tom handlekurv.

I del 2 implementerte vi en funksjon som vil være nyttig her, som kan importes og brukes for å oppdatere handlekurven.

For å inspisere databasen og se hva som er lagret i den, kan du for eksempel installere [MongoDB Compass](https://www.mongodb.com/try/download/compass). Når du har installert Compass, lager du en ny tilkobling til `mongodb://localhost:27017/`. I databasen som hete `test` kan du finne `carts` collection og inspisere innholdet. (Dette er valgfritt, men kan være nyttig for å sjekke at vi har lagt til riktig innhold i databasen. Du kan også fortsette til oppgave 3 for å se om det som blir lest fra databasen er riktig uten å sjekke MongoDB.)

## Oppgave 3 - Get Cart V2

Nå som vi har lagret handlekurven i databasen, kan vi implementere funksjonen for å lese ut handlekurven.

Acceptance criteria:

- `GET /cart/v2/:id` skal lese ut tilstanden til handlekurven fra databasen.
- Handlekurven i Frontend skal vise nye produkter som legges til i handlekurven.
- Når man trykker på Trash-ikonet, skal produktet fjernes fra handlekurven i UI.

Din oppgave er å implementere funksjonen `getCartV2` i [CartServiceV2](../backend/src/services/cartV2.ts).

Her er det bare 1 linje med kode som trenger å endres.

Du kan oppleve at du må refreshe frontend for å se nye produkter som legges til i handlekurven. Kan du tenke deg hvorfor dette skjer? Kan du komme på noen forslag til hvordan vi kan unngå dette problemet?

## Bonusoppgave - Checkpoints

Slike oppsettet er nå, starter `subscriptions` fra starten av streamen hver gang vi starter applikasjonen på nytt. Etter hver som det blir et par millioner eventer vil dette ta lang tid, og vi øsnker ikke at systemet skal slutte å oppdatere seg over lengre tid bare fordi en applikasjon måtte restartes.

For å unngå å starte på nytt hver gang, kan vil lagre `checkpoints` i databasen etter hvert som vil leser eventer. Når vi starter applikasjonen på nytt, kan vi lese ut siste `checkpoint` og starte `subscriptions` fra der.

I kurrentDb bruker vi `revision` som checkpoint. For å velge startpunktet for `subscriptions` kan vi bruke `fromRevision` parameter i `SubscribeToStreamOptions` som er satt opp i [index.ts](../backend/src/index.ts). Dette må være en BigInt, så bruk `BigInt(n)` for å deklarere en BigInt av tallet `n`.

Acceptance criteria:

- `checkpoints` skal lagres i databasen etter hvert som vi leser eventer.
- `checkpoints` skal leses ut fra databasen når vi starter applikasjonen på nytt, og sette `fromRevision` parameter i `SubscribeToStreamOptions` til dette.

Her står du ganske fritt til hvordan du implementerer denne funksjonaliteten. Vi har satt opp `checkpoints` som en collection i databasen, så du kan bruke denne for å lagre og lese ut `checkpoints`. Her er det lov å bruke AI hvis man sitter fast.

Workshoppen fortsetter i [Del 4](part4.md).
