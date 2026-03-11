import { Cart, Product } from "../types";
import { getProductV2 } from "./productsV2";
import EventClient from "../clients/eventClient";
import { CartEventTypes, StoreEventTypes } from "../events";
import StorageClient from "../clients/storageClient";
import {
  addItemToStream,
  getEmptyCart,
  getStreamName,
  updateCart,
} from "./cart";

const getCartIdFromStreamName = (streamName: string): string => {
  return streamName.split("cart-")[1] ?? "";
};

// Part 3
export async function addItemToCartV2(
  client: EventClient,
  db: StorageClient,
  cartId: string,
  productId: string
): Promise<void> {
  const streamName = getStreamName(cartId);
  let product: Product | undefined;

  // TASK: Get the product based on the productId.
  // Do not use the same function as in carts.ts, look in productsV2.ts for a function that can help us.

  // product = ...

  if (!product) {
    throw new Error(`Product not found with id: ${productId}`);
  }
  await addItemToStream(client, streamName, product);
}

// Part 3
export async function handleCartEvent(
  streamName: string,
  event: StoreEventTypes,
  db: StorageClient
) {
  // For debugging purposes, log the event
  // console.log("Handling cart event:", event);

  const cartId = getCartIdFromStreamName(streamName);

  let cart: Cart = getEmptyCart(cartId);

  // TASK: Get the cart from the database here or use an empty cart if it doesn't exist in the database
  // cart = ...

  // TASK: Update the cart based on the event
  // Maybe we already have a function for this in services/cart.ts?
  // ...

  // TASK: Store the updated cart in the database
  // ...
}

// Part 3
export async function getCartV2(
  db: StorageClient,
  cartId: string
): Promise<Cart> {
  let cart: Cart | undefined;
  // TASK: Get the cart from the database
  // cart = ...

  if (!cart) {
    return getEmptyCart(cartId);
  }
  return cart;
}
