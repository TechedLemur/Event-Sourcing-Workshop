# Part 3 - Cart Service V2

Before you begin this task, click "Shop V2" in the frontend navbar.

In this part, we will implement a projector (also called a denormalizer) to build the cart state and store it in a database. The advantage of this approach is that when we run `getCart`, we can read the cart state directly from the database without having to read the entire cart stream from EventStore for every single request. As the number of events in the stream grows, reading through the events will become slower and slower.

The database will be continuously updated with new events that come into EventStore through a `subscription`. We have already set up subscriptions in [index.ts](../backend/src/index.ts), so you do not need to do this setup yourself.

There is a [ProductsServiceV2](../backend/src/services/productsV2.ts) that stores products in the database. It may be useful to look at for inspiration.

## Task 1 - Add Item to Cart V2

We will now implement version 2 of the `addItemToCart` function.

Acceptance criteria:

- `POST /cart/v2/:id/addItem` should add a product to the cart using data from the database.
- Product information should be fetched from the database, not read directly from EventStore.

Your task is to implement the `addItemToCartV2` function in [CartServiceV2](../backend/src/services/cartV2.ts).

The only thing we need to do in this task is use the correct function from [ProductsServiceV2](../backend/src/services/productsV2.ts) to fetch the product.

## Task 2 - Handle Cart Event

We will now handle events that are read from the cart stream `subscription`.

Acceptance criteria:

- `handleCartEvent` should handle events that come into EventStore and update the cart state in the database.

Your task is to implement the `handleCartEvent` function in [CartServiceV2](../backend/src/services/cartV2.ts). Here, we first need to fetch the cart from the database and then update it based on the event. If the cart does not exist in the database, we should start with a new empty cart.

In Part 2, we implemented a function that will be useful here and can be imported and used to update the cart.

To inspect the database and see what has been stored in it, you can install [MongoDB Compass](https://www.mongodb.com/try/download/compass), for example. After installing Compass, create a new connection to `mongodb://localhost:27017/`. In the database named `test`, you can find the `carts` collection and inspect its contents. (This is optional, but it can be useful for checking that we have added the correct content to the database. You can also continue to task 3 to see whether what is read from the database is correct without checking MongoDB.)

## Task 3 - Get Cart V2

Now that we have stored the cart in the database, we can implement the function for reading the cart.

Acceptance criteria:

- `GET /cart/v2/:id` should read the cart state from the database.
- The cart in the frontend should show new products that are added to the cart.
- When the Trash icon is clicked, the product should be removed from the cart in the UI.

Your task is to implement the `getCartV2` function in [CartServiceV2](../backend/src/services/cartV2.ts).

Only 1 line of code needs to be changed here.

You may find that you need to refresh the frontend to see new products that are added to the cart. Can you think of why this happens? Can you suggest any ways to avoid this problem?

The workshop continues in [Part 4](part4.md).

---

## Bonus Task - Checkpoints

With the current setup, `subscriptions` start from the beginning of the stream every time we restart the application. Once there are a couple million events, this will take a long time, and we do not want the system to stop updating itself for a long period just because an application had to restart.

To avoid starting over every time, we can store `checkpoints` in the database as we read events. When we restart the application, we can read the latest `checkpoint` and start `subscriptions` from there.

In KurrentDB, we use `revision` as the checkpoint. To choose the starting point for `subscriptions`, we can use the `fromRevision` parameter in `SubscribeToStreamOptions`, which is set up in [index.ts](../backend/src/index.ts).

Acceptance criteria:

- `checkpoints` should be stored in the database as we read events.
- `checkpoints` should be read from the database when we restart the application, and the `fromRevision` parameter in `SubscribeToStreamOptions` should be set to this value.

You are fairly free to decide how to implement this functionality. We have set up `checkpoints` as a collection in the database, so you can use this to store and read `checkpoints`. It is okay to use AI here if you get stuck. You can use the `Checkpoint` type defined in [types.ts](../backend/src/types.ts) to store and read `checkpoints`, or you can create your own type.

---

## Orders

### Order Task 5 - Order Projectors

In this task, we will improve the solution from [order tasks 2-4](part2.md) by creating a projector that produces a read model in MongoDB. We want this read model to be fetched directly in the API.

Tip: It may be easier to create multiple projectors :)

Note: You may need to make changes to [storageClient](../backend/src/clients/storageClient.ts).

Acceptance criteria:

- The endpoints should work as they did before the refactoring.
- No traffic should need to go to EventStore when the API receives a request.

Optional criteria:

- Create checkpoints so the application does not need to replay all events on every startup.

The workshop continues in [Part 4](part4.md).
