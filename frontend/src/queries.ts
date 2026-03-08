import "server-only";

import {
  Cart,
  OrderGraphData,
  PopularItem,
  Product,
  RecentOrder,
} from "./types";

const API_URL = process.env.API_URL;

export type API_VERSION = "v1" | "v2";

export async function getProducts(version: API_VERSION = "v1") {
  try {
    const response = await fetch(`${API_URL}/products/${version}`);
    return { data: (await response.json()) as Product[] };
  } catch {
    return { error: "Failed to get products" };
  }
}

export async function getCart(cartId: string, version: API_VERSION = "v1") {
  try {
    const response = await fetch(`${API_URL}/cart/${version}/${cartId}`);
    return { data: (await response.json()) as Cart };
  } catch {
    return { error: "Failed to get cart" };
  }
}

export async function getCartPositioned(cartId: string, revision: number) {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("maxCount", revision.toString());
    const response = await fetch(
      `${API_URL}/cart/positioned/${cartId}?${searchParams.toString()}`,
    );
    return { data: (await response.json()) as Cart };
  } catch {
    return { error: "Failed to get cart" };
  }
}

export async function getLastEventRevision(cartId: string) {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}/lastEventRevision`);
    const data = await response.json();
    return data.lastEventRevision as number | undefined;
  } catch {
    console.error(`Failed to get last event revision for cart ${cartId}`);
    return undefined;
  }
}

export async function getOrderGraph(): Promise<OrderGraphData | null> {
  try {
    const response = await fetch(`${API_URL}/orders/graph`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as OrderGraphData;
  } catch {
    return null;
  }
}

export async function getRecentOrders(
  limit = 10,
): Promise<RecentOrder[] | null> {
  try {
    const response = await fetch(`${API_URL}/orders?limit=${limit}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as RecentOrder[];
  } catch {
    return null;
  }
}

export async function getPopularItems(
  limit = 10,
): Promise<PopularItem[] | null> {
  try {
    const response = await fetch(`${API_URL}/orders/popular?limit=${limit}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as PopularItem[];
  } catch {
    return null;
  }
}
