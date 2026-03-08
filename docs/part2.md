# Del 2

I denne delen skal vi implementere funksjonaliteten for å lese ut tilstanded til handlekurven fra eventstore.
Vi skal også se på et av de nyttigste elementene i Event Sourcing; å lage et snapshot av tilstanden på et vilkårlig tidspunkt.

## Oppgave 1 - Lese ut tilstanden til handlekurven

Vi skal nå implementere funksjonen `getCart` i [CartService](../backend/src/services/cart.ts).

Acceptance criteria:

- `GET /cart/:id` skal lese ut tilstanden til handlekurven fra eventstore.
- Handlekurven i Frontend skal vise nye produkter som legges til i handlekurven.
- Når man trykker på Trash-ikonet, skal produktet fjernes fra handlekurven i UI.

Din oppgave er å implementere funksjonen `updateCart` i [CartService](../backend/src/services/cart.ts) som brukes av `getCart`.

Du må finne ut hvilke eventer som er relevante for å oppdatere handlekurven og implementere logikken for å oppdatere handlekurven basert på disse eventene.

## Oppgave 2 - Tidsreiser

Vi skal nå se på magien i Event Sourcing; å kunne gå tilbake i tid og se hva som skjedde på et tidspunkt i fortiden.

Acceptance criteria:

- `GET /cart/positioned/:id?maxCount=X` skal lese ut tilstanden til handlekurven fra eventstore, men bare lese de første X eventene.
- Time Travel Slider i frontend skal fungere. For å aktivere denne må du trykke på "Time Travel" i menyen på toppen av siden.

Din oppgave er å implementere funksjonen `readCartStream` i [CartService](../backend/src/services/cart.ts) som brukes av `getCartPositioned`. Som du kanskje ser vil `getCartPositioned` gjøre nøyaktig det samme som `getCart`, men bare lese de første X eventene. For å rydde opp kan du forenkle `getCart` slik at den bare kaller `readCartStream` uten en maxCount parameter.

For å lese ut de første X eventene må du bruke en gitt parameter i `readStream`-funksjonen. Se [EventStore API](https://docs.kurrent.io/clients/node/v1.1/reading-events.html#maxcount-1) for mer informasjon.

Workshoppen fortsetter i [Del 3](part3.md).
