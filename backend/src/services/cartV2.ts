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
  // Get the product based on the productId
  // TASK: Get the product based on the productId instead of this undefined.
  // Do not use the same function as in carts.ts, look in productsV2.ts for a function that can help us.
  const product: Product | undefined = await getProductV2(db, productId);
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

  // Get the cart from the database, or create a new one if it doesn't exist
  const cart: Cart = (await db.get("carts", cartId)) ?? getEmptyCart(cartId); // TASK: Get the cart from the database here or create a new one if it doesn't exist

  // TASK: Update the cart based on the event
  // Maybe we already have a function for this in services/cart.ts?
  // ...
  updateCart(cart, event);

  // TASK: Store the updated cart in the database
  // ...
  await db.store("carts", cartId, cart);
}

// Part 3
export async function getCartV2(
  db: StorageClient,
  cartId: string
): Promise<Cart> {
  const cart: Cart | undefined = await db.get("carts", cartId); // TASK: Get the cart from the database
  if (!cart) {
    return getEmptyCart(cartId);
  }
  return cart;
}
