# Del 2

I denne delen skal vi implementere funksjonaliteten for å lese ut tilstanden til handlekurven fra EventStore.
Vi skal også se på et av de nyttigste elementene i Event Sourcing; å lage et snapshot av tilstanden på et vilkårlig tidspunkt.

## Oppgave 1 - Lese ut tilstanden til handlekurven

Vi skal nå implementere funksjonen `getCart` i [CartService](../backend/src/services/cart.ts).

Acceptance criteria:

- `GET /cart/:id` skal lese ut tilstanden til handlekurven fra EventStore.
- Handlekurven i Frontend skal vise nye produkter som legges til i handlekurven.
- Når man trykker på Trash-ikonet, skal produktet fjernes fra handlekurven i UI.

Din oppgave er å implementere funksjonen `updateCart` i [CartService](../backend/src/services/cart.ts) som brukes av `getCart`.

Du må finne ut hvilke eventer som er relevante for å oppdatere handlekurven og implementere logikken for å oppdatere handlekurven basert på disse eventene.

## Oppgave 2 - Tidsreiser

Vi skal nå se på magien i Event Sourcing; å kunne gå tilbake i tid og se hva som skjedde på et tidspunkt i fortiden.

Acceptance criteria:

- `GET /cart/positioned/:id?maxCount=X` skal lese ut tilstanden til handlekurven fra EventStore, men bare lese de første X eventene.
- Time Travel Slider i frontend skal fungere. For å aktivere denne må du trykke på "Time Travel" i menyen på toppen av siden.

Din oppgave er å implementere funksjonen `readCartStream` i [CartService](../backend/src/services/cart.ts) som brukes av `getCartPositioned`. Som du kanskje ser vil `getCartPositioned` gjøre nøyaktig det samme som `getCart`, men bare lese de første X eventene. For å rydde opp kan du forenkle `getCart` slik at den bare kaller `readCartStream` uten en maxCount parameter.

For å lese ut de første X eventene må du bruke en gitt parameter i `readStream`-funksjonen. Se [EventStore API](https://docs.kurrent.io/clients/node/v1.1/reading-events.html#maxcount) for mer informasjon.

Workshoppen fortsetter i [Del 3](part3.md).

---

## Ordre

### Ordre oppgave 2 - Nye ordrer

I grensesnittet har vi en fane som heter Admin. Dette er et eksempel på et administrasjonsgrensesnitt og viser litt diverse informasjon vi er interessert i. I denne oppgaven skal vi se nærmere på å hente ut nylige ordrer.

Acceptance criteria:

- `GET /orders?limit=X` skal returnere de nyeste X ordrene sortert fra nyest til eldst. Se [OrderRoutes](../backend/src/routes/order.ts)
- De nyeste ordrene skal dukke opp på "Recent Orders" i admin grensesnittet

Reponsen skal ligne på denne:

```json
[
  {
    "orderId": "SomeID",
    "totalAmount": 19.99,
    "createdAt": "2023-11-03T12:34:56.789Z",
    "items": [
      {
        "productName": "Kaffi"
      },
      {
        "productName": "Bolle"
      }
    ]
  }
]
```

### Ordre oppgave 3 - Populære produkter

I samme grensesnittet finner vi også "Popular Items". I denne oppgaven skal du hente ut de X mest populære produktene sortert fra mest populær til minst populær.

Acceptance criteria:

- `GET /orders/popular?limit=X` skal returnere de nyeste X produktene sortert fra mest populær til minst populær.
- De mest populære produktene skal dukke opp i admin grensesnittet

Responsen skal ligne på denne:

```json
[
  {
    "productName": "Kaffi",
    "totalQuantity": 1
  },
  {
    "productName": "Bolle",
    "totalQuantity": 1
  }
]
```

### Ordre oppgave 4 - Orders over time graf

Den siste oversikten i admin grensesnittet er ordre over tid. Her ønsker vi å kunne se flyten av ordrer. Vi ønsker at denne grafen returnerer datapunkter for hvert 15. minutt og hvor mange ordrer som ble produsert i det tidsrommet. Om der ikke er noen orderer trenger du ikke returnere et datapunkt.

Acceptance criteria:

- `GET /orders/graph` skal returnere en liste med datapunkter. Hvert datapunkt inneholder et tidspunkt og et antall ordre for det tidspunktet.
- En graf skal vise i admin grensesnittet

Responsen skal ligne på denne:

```json
{
  "points": [
    {
      "timestamp": "2023-11-03T12:34:00.000Z",
      "orderCount": 2
    },
    {
      "timestamp": "2023-11-03T12:35:00.000Z",
      "orderCount": 1
    }
  ]
}
```

Workshoppen fortsetter i [Del 3](part3.md).
