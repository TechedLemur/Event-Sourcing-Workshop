import { Router, Request, Response } from "express";
import {
  addItemToCart,
  getCart,
  getCartPositioned,
  getEmptyCart,
  getLastEventRevision,
  removeItemFromCart,
} from "../services/cart";
import EventClient from "../clients/eventClient";
import StorageClient from "../clients/storageClient";
import { addItemToCartV2, getCartV2 } from "../services/cartV2";
import { StreamNotFoundError } from "@kurrent/kurrentdb-client";

interface AddItemRequest extends Request {
  body: {
    productId: string;
  };
}

export default function cartRouter(client: EventClient, db: StorageClient) {
  const router = Router();

  const v1Router = cartRouterV1(client);
  const v2Router = cartRouterV2(client, db);
  router.use("/v1", v1Router);
  router.use("/v2", v2Router);
  router.use("/", v1Router);
  return router;
}

const cartRouterV1 = (client: EventClient) => {
  const router = Router();

  router.get("/", async (req: Request, res: Response) => {
    res.send("Welcome to the Cart API!");
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required" });
      return;
    }

    console.info("Handling request to get cart:", cartId);

    try {
      const cart = await getCart(client, cartId);
      res.json(cart);
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        // stream does not exist – handle “not found” case here
        console.info("Stream does not exist, returning empty cart:", cartId);
        // Return an empty cart
        res.json(getEmptyCart(cartId));
        return;
      }
      console.error(error);
      res.status(500).json({ error: "An error occurred getting cart" });
    }
  });

  router.get("/positioned/:id", async (req: Request, res: Response) => {
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required" });
      return;
    }
    const maxCount = parseInt(req.query.maxCount as string);

    if (isNaN(maxCount)) {
      res
        .status(400)
        .json({ error: "Required query parameter 'maxCount' is not a number" });
      return;
    }

    console.info(
      "Handling request to get cart:",
      cartId,
      "with max count:",
      maxCount
    );

    try {
      const cart = await getCartPositioned(client, cartId, maxCount);
      res.json(cart);
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        // stream does not exist – handle “not found” case here
        console.info("Stream does not exist, returning empty cart:", cartId);
        // Return an empty cart
        res.json(getEmptyCart(cartId));
        return;
      }
      console.error(error);
      res.status(500).json({ error: "An error occurred getting cart" });
    }
  });

  router.post("/:id/addItem", async (req: AddItemRequest, res: Response) => {
    const { productId } = req.body;
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required" });
      return;
    }
    try {
      await addItemToCart(client, cartId, productId);
      res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred adding item to cart" });
    }
  });

  router.delete(
    "/:id/removeItem/:itemId",
    async (req: Request, res: Response) => {
      const cartId = req.params.id;
      const itemId = req.params.itemId;
      if (!cartId || !itemId) {
        res.status(400).json({ error: "Cart ID and item ID are required" });
        return;
      }
      try {
        await removeItemFromCart(client, cartId, itemId);
        res.status(204).send();
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred removing item from cart" });
      }
    }
  );

  router.get("/:id/lastEventRevision", async (req: Request, res: Response) => {
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID and item ID are required" });
      return;
    }
    try {
      const lastEventRevision = await getLastEventRevision(client, cartId);
      if (lastEventRevision === undefined) {
        res.status(404).json({ error: "No events found for cart" });
        return;
      }
      res.json({ lastEventRevision });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred removing item from cart" });
    }
  });
  return router;
};

const cartRouterV2 = (client: EventClient, db: StorageClient) => {
  const router = Router();

  router.get("/:id", async (req: Request, res: Response) => {
    res.json(await getCartV2(db, req.params.id ?? ""));
  });

  router.post("/:id/addItem", async (req: AddItemRequest, res: Response) => {
    const { productId } = req.body;
    const cartId = req.params.id;
    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required" });
      return;
    }
    try {
      await addItemToCartV2(client, db, cartId, productId);
      res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred adding item to cart" });
    }
  });
  return router;
};
