import express, { Request, Response } from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import cartRouter from "./routes/cart";
import { bigIntJsonMiddleware } from "./middleware/json";
import EventClient from "./clients/eventClient";
import dotenv from "dotenv";
import StorageClient from "./clients/storageClient";
import { handleProductEvent } from "./services/productsV2";
import { handleCartEvent } from "./services/cartV2";
import orderRouter from "./routes/order";
import exampleRouter from "./routes/example";
import { SubscribeToStreamOptions } from "@kurrent/kurrentdb-client";
import { Checkpoint } from "./types";

dotenv.config({ path: "../.env" });

const client = new EventClient(
  process.env.EVENT_STORE_CONNECTION_STRING,
  "cart-service"
);

const storageClient = new StorageClient(process.env.MONGO_DB_CONNECTION_STRING);

const app = express();
const PORT = process.env.BACKEND_PORT || 3002;
app.use(cors());
app.use(express.json());
app.use(bigIntJsonMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.use("/example", exampleRouter(client));
app.use("/products", productsRouter(client, storageClient));
app.use("/cart", cartRouter(client, storageClient));
app.use("/orders", orderRouter(client));

app.listen(PORT, async () => {
  storageClient.connect();

  const productsCheckpoint: Checkpoint | undefined = await storageClient.get(
    "checkpoints",
    "products"
  );
  const productsCheckpointRevision = productsCheckpoint?.revision ?? "start";
  console.info(
    `Subscribing to products from revision ${productsCheckpointRevision}`
  );

  const productsSubscriptionOptions: SubscribeToStreamOptions = {
    fromRevision: productsCheckpointRevision,
  };
  if (productsCheckpointRevision === "start") {
    await storageClient.deleteAll("products");
  }
  client.subscribe(
    "$ce-product",
    async (_id, revision, event) => {
      // console.info("Received product event:", _id, _revision, event);
      await handleProductEvent(event, storageClient);

      await storageClient.store("checkpoints", "products", {
        id: "products",
        revision,
      });
      console.info(`Stored checkpoint for products at revision ${revision}`);
    },
    productsSubscriptionOptions
  );

  const cartsCheckpoint: Checkpoint | undefined = await storageClient.get(
    "checkpoints",
    "carts"
  );
  const cartsCheckpointRevision = cartsCheckpoint?.revision ?? "start";

  console.info(`Subscribing to carts from revision ${cartsCheckpointRevision}`);
  const cartSubscriptionOptions: SubscribeToStreamOptions = {
    fromRevision: cartsCheckpointRevision,
  };
  if (cartsCheckpointRevision === "start") {
    // To avoid side effects of restarting the application, we delete all carts from the database if we start from the beginning.
    await storageClient.deleteAll("carts");
  }
  client.subscribe(
    "$ce-cart",
    async (_id, revision, event, streamId) => {
      // console.info("Received cart event:", _id, _revision, event);
      await handleCartEvent(streamId, event, storageClient);
      await storageClient.store("checkpoints", "carts", {
        id: "carts",
        revision,
      });
    },
    cartSubscriptionOptions
  );
  console.info(`Server is running on port ${PORT}`);
});
