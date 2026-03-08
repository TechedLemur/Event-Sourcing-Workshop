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

  const productsSubscriptionOptions: SubscribeToStreamOptions = {
    fromRevision: "start",
  };
  if (productsSubscriptionOptions.fromRevision === "start") {
    await storageClient.deleteAll("products");
  }
  client.subscribe(
    "$ce-product",
    async (_id, _revision, event) => {
      // console.info("Received product event:", _id, _revision, event);
      await handleProductEvent(event, storageClient);
    },
    productsSubscriptionOptions
  );

  const cartSubscriptionOptions: SubscribeToStreamOptions = {
    fromRevision: "start",
  };
  if (cartSubscriptionOptions.fromRevision === "start") {
    // To avoid side effects of restarting the application, we delete all carts from the database if we start from the beginning.
    await storageClient.deleteAll("carts");
  }
  client.subscribe(
    "$ce-cart",
    async (_id, _revision, event, streamId) => {
      // console.info("Received cart event:", _id, _revision, event);
      await handleCartEvent(streamId, event, storageClient);
    },
    cartSubscriptionOptions
  );
  console.info(`Server is running on port ${PORT}`);
});
