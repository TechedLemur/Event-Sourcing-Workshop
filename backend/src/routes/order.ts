import { Router, Request, Response } from "express";
import EventClient from "../clients/eventClient";
// import {  } from "../services/order";

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
      // TASK: Create an order event for the cart
      res.status(501).json({ error: "Not implemented" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get recent X orders, sorted by most recent
  // GET /orders?limit=X
  router.get("/", async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      // TASK: Get recent orders
      res.status(501).json({ error: "Not implemented" });
    } catch (error) {
      console.error("Error getting recent orders:", error);
      res.status(500).json({ error: "Failed to get recent orders" });
    }
  });

  // Get X most popular items from orders
  // GET /orders/popular?limit=X
  router.get("/popular", async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    try {
      // TASK: Get popular items
      res.status(501).json({ error: "Not implemented" });
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

  return router;
}
