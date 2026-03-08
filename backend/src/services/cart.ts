import { StreamNotFoundError } from "@kurrent/kurrentdb-client";
import { Cart, Product } from "../types";
import { getProduct } from "./products";
import EventClient from "../clients/eventClient";
import { CartEventTypes, StoreEventTypes } from "../events";

// Helper function
export const getStreamName = (cartId: string): string => `cart-${cartId}`;

// Convenience function to get an empty cart
export const getEmptyCart = (id: string): Cart => {
  return {
    id,
    items: [],
    total: 0,
  };
};

// Part 1
export async function addItemToCart(
  client: EventClient,
  cartId: string,
  productId: string
): Promise<void> {
  const streamName = getStreamName(cartId);
  // Get the product based on the productId
  // TASK: Get the product based on the productId instead of this undefined. Maybe there is a function in products.ts that can help us?
  const product: Product | undefined = await getProduct(client, productId);

  if (!product) {
    throw new Error(`Product not found with id: ${productId}`);
  }

  await addItemToStream(client, streamName, product);
}

// Part 1
export async function addItemToStream(
  client: EventClient,
  streamName: string,
  product: Product
): Promise<void> {
  const events: StoreEventTypes[] = [
    // TASK: Add the ProductAddedToCart event
    // ...
    {
      type: CartEventTypes.ProductAddedToCart,
      subject: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
    },
  ];

  console.info(`Events: ${JSON.stringify(events)}`);

  await client.emit(streamName, events);
  console.info(`Events appended to stream: ${streamName}`);
}

// Part 1
export async function removeItemFromCart(
  client: EventClient,
  cartId: string,
  itemId: string // Id of the item to remove
): Promise<void> {
  const streamName = getStreamName(cartId);

  const events: StoreEventTypes[] = [
    // TASK: Add the ProductRemovedFromCart event
    // ...
    {
      type: CartEventTypes.ProductRemovedFromCart,
      subject: itemId,
    },
  ];

  console.info(`Events: ${JSON.stringify(events)}`);

  await client.emit(streamName, events);
  console.info(`Events appended to stream: ${streamName}`);
}

// Part 2
// Update the cart object based on an event
export function updateCart(cart: Cart, event: StoreEventTypes) {
  // TASK: Select which events to handle in the switch and implement the logic to update the cart
  switch (event.type) {
    case CartEventTypes.ProductAddedToCart:
      cart.items.push({
        id: event.subject,
        productId: event.productId,
        productName: event.productName,
        productPrice: event.productPrice,
      });
      break;
    case CartEventTypes.ProductRemovedFromCart:
      cart.items = cart.items.filter((item) => item.id !== event.subject);
      break;
    default:
      console.warn(`Unexpected event type: ${event.type}`);
      break;
  }
  // TASK: Calculate the total price of the cart
  cart.total = cart.items.reduce((acc, item) => acc + item.productPrice, 0);
  return cart;
}

// Part 2
export async function getCart(
  client: EventClient,
  cartId: string
): Promise<Cart> {
  const cart = readCartStream(client, cartId);
  return cart;
}

// Part 2
export async function getCartPositioned(
  client: EventClient,
  cartId: string,
  maxCount: number
): Promise<Cart> {
  const cart = await readCartStream(client, cartId, maxCount);
  return cart;
}

// Part 2
async function readCartStream(
  client: EventClient,
  cartId: string,
  maxCount?: number
): Promise<Cart> {
  if (maxCount === 0) {
    return getEmptyCart(cartId);
  }
  const streamName = getStreamName(cartId);
  // https://docs.kurrent.io/clients/node/v1.1/reading-events.html#maxcount-1
  const events = client.read(streamName, {
    // TASK: Set the correct parameter here
    maxCount: maxCount,
  });
  const cart = getEmptyCart(cartId);

  // TASK: Update the cart based on the events
  // ...
  for await (const event of events) {
    updateCart(cart, event);
  }

  return cart;
}

export async function getLastEventRevision(
  client: EventClient,
  cartId: string
): Promise<number | undefined> {
  const streamName = getStreamName(cartId);
  const events = client.read(streamName, {
    maxCount: 1,
    fromRevision: "end",
  });
  try {
    for await (const event of events) {
      return Number(event.revision);
    }
  } catch (error) {
    if (error instanceof StreamNotFoundError) {
      // stream does not exist – handle “not found” case here
      console.info("Stream does not exist, returning empty cart:", streamName);
    } else {
      // Throw other errors
      console.error("Error getting cart:", error);
      throw error;
    }
  }
}
