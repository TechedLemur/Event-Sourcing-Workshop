# Part 4 - New Requirements

Someone has decided that we need to include currency in the cart. Your team lead has decided that we will solve this by creating a new version of `ProductAddedToCartEvent` that includes currency as part of the `productPrice` field.

`ProductAddedToCartEventV2` is already defined in [events.ts](../backend/src/events.ts).

## Task 1 - ProductAddedToCartEventV2

When a product is added to the cart, we should now create this new event.

Your task is to change the `addItemToCartStream` function in [CartService](../backend/src/services/cart.ts) so that it creates `ProductAddedToCartEventV2` instead of `ProductAddedToCartEvent`.
Currency is already part of the `Product` object, so you can use it to get all the values you need.

## Task 2 - Handle ProductAddedToCartEventV2

One of the characteristics of event sourcing is that we cannot change or delete events. This means that we still need to handle the old event, `ProductAddedToCartEvent`, while also handling the new event, `ProductAddedToCartEventV2`.

Your task is to change the `updateCart` function in [CartService](../backend/src/services/cart.ts) so that it handles both events. If you receive V2 of the event, set the `productCurrency` field on the `CartItem` object to the `currency` field from the event's `productPrice`.

Acceptance criteria:

- `updateCart` should handle both V1 and V2 of the event.
- The frontend should show currency in the cart for new items that are added to the cart.

---

## Orders

### Order Task 6 - Order Reactor

A major advantage of event sourcing is that we can easily split the system into isolated pieces that work independently, a bit like an assembly line. We can produce an event and have a service listen for that event, perform a side effect based on it, and then produce a new event. This works very similarly to a projector, but an important distinction is that it has a side effect. Depending on how important the side effect is, we may have strict requirements to deliver it at least once or, for example in banking, exactly once. That is why it is especially important in this context to keep checkpoints or IDs for individual events so that we do not end up creating duplicates. (In this task, it is not that critical, but it is worth thinking about!)

Event sourcing often goes hand in hand with orchestration patterns such as sagas and workflows for the very central parts of an application.

In this task, you will produce an invoice, but if you have your own idea you can follow that instead. (For example, sending a confirmation email, etc.)

Acceptance criteria:

- You should create a subscription that listens for the `OrderCreated` event.
- When an `OrderCreated` event is produced, an `InvoiceCreated` event should be produced shortly after.

The event must contain the following:

```json
{
  "invoiceId": "someId",
  "orderId": "orderId",
  "dueDate": "2026-11-03T12:34:56.789Z",
  "amount": 123.45,
  "status": "Created"
}
```

Optional criteria:

- Think through or create a reactor that sends a reminder 2 days before the due date.

### Order Task 7 - Server-Sent Events

One effect of having the entire system sourced from events is that, in theory, we can expose the events directly to a client or integration. This allows us to get real-time updates. In this task, you will implement real-time updates for the graph. In general, we would never expose the raw events, but instead expose a derived representation that we have more control over. This makes it easier to introduce new versions of an event or functionality without causing breaking changes.

Server-Sent Events let you essentially keep a GET connection open to a server from the client's perspective. This lets you send updates in a way that is simpler than WebSockets. The admin page is set up to connect to an SSE endpoint at `GET /orders/live` and expects the following data structure for the events.

Note: This cannot easily be tested with `requests.http` because it is a persistent connection.

Acceptance criteria:

- `GET /orders/live` should respond as an SSE endpoint.
- The admin interface should update live when you perform a checkout. (Open two tabs to verify.)

Example payload:

```json
{
  "orderId": "123",
  "items": [{ "productId": "123123", "productName": "Kaffi", "price": 100 }],
  "totalAmount": 100,
  "createdAt": "2024-05-04T13:45:00.000Z"
}
```

Here is a short example of how you can expose server-sent events (SSE) in Express on the `/orders/live` endpoint:

```js
router.get("/orders/live", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Here you can send new orders as they come in:
  const orderEvent = {
    orderId: "123",
    items: [{ productId: "123123", productName: "Kaffi", price: 100 }],
    totalAmount: 100,
    createdAt: new Date().toISOString(),
  };
  res.write(`data: ${JSON.stringify(orderEvent)}\n\n`);

  // Close the connection when the client disconnects
  req.on("close", () => res.end());
});
```
