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
