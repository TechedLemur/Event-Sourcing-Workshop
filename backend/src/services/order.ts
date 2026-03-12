import EventClient from "../clients/eventClient";
import { CartEventTypes, StoreEventTypes } from "../events";
import { Order, OrderItem, PopularItem } from "../types";
import { getCart } from "./cart";

const getStreamName = (orderId: string): string => `order-${orderId}`;

export async function createOrder(client: EventClient, cartId: string) {
  const cart = await getCart(client, cartId);
  if (!cart) {
    throw new Error(`Cart not found with id: ${cartId}`);
  }
  const orderId = crypto.randomUUID();
  const events: StoreEventTypes[] = [
    {
      type: CartEventTypes.OrderCreated,
      subject: orderId,
      items: cart.items,
      totalAmount: cart.total,
    },
  ];
  await client.emit(getStreamName(orderId), events);
}

export async function getRecentOrders(client: EventClient, limit: number) {
  const events = await client.read("$ce-order");
  const orders: Order[] = [];
  for await (const event of events) {
    if (event.type === CartEventTypes.OrderCreated) {
      orders.unshift({
        orderId: event.subject,
        totalAmount: event.totalAmount,
        items: event.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
        })),
        createdAt: event.createdAt,
      });
    }
  }
  return orders.slice(0, limit);
}

export async function getPopularItems(client: EventClient, limit: number) {
  const events = await client.read("$ce-order");
  const itemMap: Map<string, PopularItem> = new Map();
  for await (const event of events) {
    if (event.type === CartEventTypes.OrderCreated) {
      event.items.forEach((item) => {
        if (itemMap.has(item.productId)) {
          itemMap.get(item.productId)!.totalQuantity += 1;
        } else {
          itemMap.set(item.productId, {
            productId: item.productId,
            productName: item.productName,
            totalQuantity: 1,
          });
        }
      });
    }
  }
  return Array.from(itemMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, limit);
}
