import { ClientSession, ClientSessionOptions, MongoClient } from "mongodb";

export type CollectionName = "carts" | "checkpoints" | "products" | "orders";
/**
 * StorageClient is a concrete implementation of IStorageClient using MongoDB.
 */
class StorageClient {
  constructor(connectionString: string | undefined) {
    if (!connectionString) {
      throw new Error("STORAGE_CONNECTION_STRING is not set");
    }
    this.mongoClient = new MongoClient(connectionString);
  }
  startSession(options?: ClientSessionOptions): ClientSession {
    return this.mongoClient.startSession(options);
  }

  async connect(): Promise<void> {
    await this.mongoClient.connect();

    this.mongoClient
      .db()
      .collection("carts")
      .createIndex({ id: 1 }, { unique: true });
    this.mongoClient
      .db()
      .collection("checkpoints")
      .createIndex({ id: 1 }, { unique: true });
    this.mongoClient
      .db()
      .collection("products")
      .createIndex({ id: 1 }, { unique: true });
    this.mongoClient
      .db()
      .collection("orders")
      .createIndex({ id: 1 }, { unique: true });
  }

  async disconnect(): Promise<void> {
    await this.mongoClient.close();
  }

  async store(
    collectionName: CollectionName,
    id: string,
    value: any,
    session?: ClientSession
  ): Promise<void> {
    const collection = this.mongoClient.db().collection(collectionName);
    if (session) {
      await collection.updateOne(
        { id },
        { $set: value },
        { upsert: true, session }
      );
    } else {
      await collection.updateOne({ id }, { $set: value }, { upsert: true });
    }
  }

  async get(collectionName: CollectionName, id: string): Promise<any> {
    const collection = this.mongoClient.db().collection(collectionName);
    const result = await collection.findOne({ id });
    return result;
  }

  async delete(collectionName: CollectionName, id: string): Promise<void> {
    const collection = this.mongoClient.db().collection(collectionName);
    await collection.deleteOne({ id });
  }

  async list(collectionName: CollectionName): Promise<any[]> {
    const collection = this.mongoClient.db().collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  }

  mongoClient: MongoClient;
}

export default StorageClient;
