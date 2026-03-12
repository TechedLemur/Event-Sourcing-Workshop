import { Router, Request, Response } from "express";
import EventClient from "../clients/eventClient";
import {
  createOrder,
  getPopularItems,
  getRecentOrders,
} from "../services/order";

interface AddItemRequest extends Request {
  body: {
    productId: string;
  };
}

export default function orderRouter(client: EventClient) {
  const router = Router();

  // Create an order event when the clicks checkout
  // :id is the cart id
  router.post("/checkout/:id", async (req: Request, res: Response) => {
    console.log("Creating order event for cart:", req.params.id);
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required" });
      return;
    }
    try {
      await createOrder(client, cartId);
      res.status(200).json({ message: "Order created" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get order events (recent orders), sorted by most recent
  // GET /orders?limit=X
  router.get("/", async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const orders = await getRecentOrders(client, limit);
      console.log("Recent orders:", orders);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error getting recent orders:", error);
      res.status(500).json({ error: "Failed to get recent orders" });
    }
  });

  // Get most popular items from orders
  // GET /orders/popular?limit=X
  router.get("/popular", async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      const items = await getPopularItems(client, limit);
      console.log("Popular items:", items);
      res.status(200).json(items);
    } catch (error) {
      console.error("Error getting popular items:", error);
      res.status(500).json({ error: "Failed to get popular items" });
    }
  });

  // Get data for order graph
  // GET /orders/graph
  router.get("/graph", async (_req: Request, res: Response) => {
    res.status(501).json({ error: "Not implemented" });
  });

  router.get("/live", (req: Request, res: Response) => {
    // Set headers for Server-Sent Events (SSE)
    // res.set({
    //   "Content-Type": "text/event-stream",
    //   "Cache-Control": "no-cache",
    //   "Connection": "keep-alive"
    // });
    // res.flushHeaders();
    // let orderCounter = 1;
    // let timeout: NodeJS.Timeout;
    // // Function to send an order event
    // function sendOrder() {
    //   const orderId = `order_live_${orderCounter++}`;
    //   const now = new Date().toISOString();
    //   const orderEvent = {
    //     orderId,
    //     items: [
    //       {
    //         productId: "prod4",
    //         productName: "Lasagna",
    //         quantity: 1,
    //         price: 139
    //       }
    //     ],
    //     totalAmount: 139,
    //     createdAt: now
    //   };
    //   res.write(`data: ${JSON.stringify(orderEvent)}\n\n`);
    //   // Schedule the next order with a random short delay (500ms - 3000ms)
    //   const delay = Math.floor(Math.random() * 2500) + 500;
    //   timeout = setTimeout(sendOrder, delay);
    // }
    // // Send an order immediately, then randomly and quickly
    // sendOrder();
    // // Handle client disconnect
    // req.on("close", () => {
    //   if (timeout) {
    //     clearTimeout(timeout);
    //   }
    //   res.end();
    // });
  });
  return router;
}
