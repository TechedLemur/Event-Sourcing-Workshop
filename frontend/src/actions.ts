"use server";

import { revalidatePath } from "next/cache";
import { API_VERSION } from "./queries";

const API_URL = process.env.API_URL;
export async function addItemToCart(
  cartId: string,
  productId: string,
  version: API_VERSION = "v1",
) {
  const response = await fetch(`${API_URL}/cart/${version}/${cartId}/addItem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  revalidatePath("/"); // Force a refetching of the cart data
  return response.json();
}

export async function removeItemFromCart(cartId: string, itemId: string) {
  const response = await fetch(
    `${API_URL}/cart/${cartId}/removeItem/${itemId}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to remove item from cart: ${response.statusText}`);
  }

  revalidatePath("/"); // Force a refetching of the cart data
}

export async function checkout(cartId: string) {
  const response = await fetch(`${API_URL}/orders/checkout/${cartId}`, {
    method: "POST",
  });
  if (response.status === 501) {
    return {
      success: false,
      message: "Checkout not implemented",
    };
  }
  if (!response.ok) {
    return {
      success: false,
      message: `Failed to checkout: ${response.statusText}`,
    };
  }
  return {
    success: true,
    message: "Order created",
  };
}
