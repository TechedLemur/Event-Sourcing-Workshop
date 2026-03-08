import { Router, Request, Response } from "express";
import {
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProductPrice,
} from "../services/products";
import EventClient from "../clients/eventClient";
import {
  createProductV2,
  getAllProductsV2,
  getProductV2,
} from "../services/productsV2";
import StorageClient from "../clients/storageClient";

export default function productsRouter(client: EventClient, db: StorageClient) {
  const router = Router();

  const v1Router = productsRouterV1(client);
  const v2Router = productsRouterV2(client, db);
  router.use("/v1", v1Router);
  router.use("/v2", v2Router);
  router.use("/", v1Router);
  return router;
}
function productsRouterV1(client: EventClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    res.json(await getAllProducts(client));
  });

  router.get("/:id", async (req: Request, res: Response) => {
    res.json(await getProduct(client, req.params.id ?? ""));
  });

  router.patch("/:id/price", async (req: Request, res: Response) => {
    const price = req.body.price;
    const currency = req.body.currency ?? "NOK";
    if (typeof price !== "number") {
      res.status(400).json({ error: "Price is required" });
      return;
    }
    await updateProductPrice(client, req.params.id ?? "", price, currency);
    res.status(200).json({ message: "Product price updated" });
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    await deleteProduct(client, req.params.id ?? "");
    res.status(204).send();
  });

  return router;
}

function productsRouterV2(client: EventClient, db: StorageClient) {
  const router = Router();

  router.get("/", async (_req: Request, res: Response) => {
    res.json(await getAllProductsV2(db));
  });

  router.get("/:id", async (req: Request, res: Response) => {
    res.json(await getProductV2(db, req.params.id ?? ""));
  });

  return router;
}
