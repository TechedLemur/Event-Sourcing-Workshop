# Part 2

In this part, we will implement the functionality for reading the state of the cart from EventStore.
We will also look at one of the most useful parts of event sourcing: creating a snapshot of the state at an arbitrary point in time.

## Task 1 - Read the Cart State

We will now implement the `getCart` function in [CartService](../backend/src/services/cart.ts).

Acceptance criteria:

- `GET /cart/:id` should read the cart state from EventStore.
- The cart in the frontend should show new products that are added to the cart.
- When the Trash icon is clicked, the product should be removed from the cart in the UI.

Your task is to implement the `updateCart` function in [CartService](../backend/src/services/cart.ts), which is used by `getCart`.

You need to figure out which events are relevant for updating the cart and implement the logic for updating the cart based on those events.

## Task 2 - Time Travel

We will now look at the magic of event sourcing: being able to go back in time and see what happened at a point in the past.

Acceptance criteria:

- `GET /cart/positioned/:id?maxCount=X` should read the cart state from EventStore, but only read the first X events.
- The Time Travel Slider in the frontend should work. To activate it, click "Time Travel" in the menu at the top of the page.

Your task is to implement the `readCartStream` function in [CartService](../backend/src/services/cart.ts), which is used by `getCartPositioned`. As you may notice, `getCartPositioned` does exactly the same thing as `getCart`, except it only reads the first X events. To clean this up, you can simplify `getCart` so that it only calls `readCartStream` without a maxCount parameter.

To read the first X events, you need to use a given parameter in the `readStream` function. See the [EventStore API](https://docs.kurrent.io/clients/node/v1.1/reading-events.html#maxcount) for more information.

The workshop continues in [Part 3](part3.md).

---

## Orders

### Order Task 2 - New Orders

The interface has a tab called Admin. This is an example of an administration interface and shows various information we are interested in. In this task, we will look more closely at fetching recent orders.

Acceptance criteria:

- `GET /orders?limit=X` should return the latest X orders sorted from newest to oldest. See [OrderRoutes](../backend/src/routes/order.ts).
- The latest orders should appear under "Recent Orders" in the admin interface.

The response should look like this:

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

### Order Task 3 - Popular Products

In the same interface, we also find "Popular Items". In this task, you will fetch the X most popular products sorted from most popular to least popular.

Acceptance criteria:

- `GET /orders/popular?limit=X` should return the top X products sorted from most popular to least popular.
- The most popular products should appear in the admin interface.

The response should look like this:

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

### Order Task 4 - Orders Over Time Graph

The last overview in the admin interface is orders over time. Here, we want to see the flow of orders. We want this graph to return data points for every 15 minutes and show how many orders were produced during that time period. If there are no orders, you do not need to return a data point.

Acceptance criteria:

- `GET /orders/graph` should return a list of data points. Each data point contains a timestamp and an order count for that timestamp.
- A graph should be shown in the admin interface.

The response should look like this:

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

The workshop continues in [Part 3](part3.md).
