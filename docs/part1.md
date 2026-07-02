# Part 1

In this first part, we will set up the project and create our first events.

## Setup

Follow the instructions in [README.md](../README.md) to set up the project. If everything is working correctly, you should now have a backend running at [http://localhost:3002](http://localhost:3002), a frontend running at [http://localhost:3000](http://localhost:3000), and some Docker containers running EventStore and MongoDB.

Go to [http://localhost:2113/web/index.html#/dashboard](http://localhost:2113/web/index.html#/dashboard) to verify that EventStore is running correctly.

## Task 0 - Hello Event

First, we will test that our backend works and can communicate with EventStore.

In [requests.http](../backend/requests.http), you will find a list of HTTP requests that you can use to test the backend. These can be run easily with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) in VS Code. Alternatively, use Curl, Postman, or another tool if you prefer.

1. Run `POST {{baseUrl}}/example` to create an example event.
2. Go to [http://localhost:2113/web/index.html#/streams](http://localhost:2113/web/index.html#/streams) to verify that the event has been added to EventStore. There should now be a stream named `hello-event-stream` that we can click to view the events.
3. Run `GET {{baseUrl}}/example` to check that we can read the event from EventStore.

## Task 1 - Add Product to Cart

We will now start building the functionality for adding products to the cart.

Acceptance criteria:

- `POST /cart/:id/addItem` should add a product to a `cart-<id>` stream.
- A `ProductAddedToCart` event should appear in the EventStore dashboard.

Your task is to implement the functions `addItemToCart` and `addItemToCartStream` in [CartService](../backend/src/services/cart.ts). Feel free to look at `createProduct` in [ProductService](../backend/src/services/products.ts) for inspiration.
You should generally only need to add code in the blocks with a `// TASK: ...` comment.

To call the endpoint for adding a product, click "Add to Cart" on a product in the frontend. You will not see any changes in the frontend yet (that task is coming soon), but you can see that the event has been added in EventStore.

Hint: the event `type` should be `CartEventTypes.ProductAddedToCart`. If you create an object with `{ type: CartEventTypes.ProductAddedToCart, ... }` in the `events` array in `addItemToCartStream`, the TypeScript error messages should tell you what else is missing.

Hint: the `subject` field in the event can be set to `cartId`.

## Task 2 - Remove Product from Cart

We will now implement the `removeItemFromCart` function in [CartService](../backend/src/services/cart.ts). Feel free to look at `deleteProduct` in [ProductService](../backend/src/services/products.ts) for inspiration.

Acceptance criteria:

- `DELETE /cart/:id/removeItem/:itemId` should remove a product from a `cart-<id>` stream.
- A `ProductRemovedFromCart` event should appear in the EventStore dashboard.

Your task is to implement the `removeItemFromCart` function in [CartService](../backend/src/services/cart.ts).

Since `getCart` has not been implemented yet, you cannot use the frontend to test this function. You can run HTTP requests in [requests.http](../backend/requests.http) instead. To call the correct endpoint, you need both `cartId` and `itemId` as parameters. You can find these by looking at a cart stream in the EventStore dashboard and inspecting the `ProductAddedToCart` event.

The workshop continues in [Part 2](part2.md).

---

## Orders

Throughout the workshop there will be a parallel track of completely optional tasks for building an order flow. The idea behind these tasks is that you will have to make your own choices related to event sourcing and get a feel for what works and what does not. These tasks will not have answers provided in each part, so if you cannot complete a task you may not always be able to move on to the next one. Focus on completing the main workshop tasks, and look at these tasks if you finish quickly and want to explore event sourcing further.

### Order Task 1 - Create Order Events

In this task, you will create your own events for orders based on what is ordered from a cart. In the shop, a user can click "Checkout", which will call the endpoint `POST /order/checkout/:cartId`. We have created the endpoint itself in [OrderRoute](../backend/src/routes/order.ts). You should implement this route so that an order event is produced to EventStore.

When creating the order event, think about where it makes sense for the information to live from a business perspective. For example, does it make sense to copy the product name, or should that live in the order?

Acceptance criteria:

- `POST /orders/checkout/:cartId` should create a new order.
- An order-related event should appear in the EventStore dashboard.

Optional criteria:

- Empty the cart when an order is created.

The workshop continues in [Part 2](part2.md).
