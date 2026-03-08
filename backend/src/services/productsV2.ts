import EventClient from "../clients/eventClient";
import { ProductEventTypes, StoreEventTypes } from "../events";
import { Product } from "../types";
import StorageClient from "../clients/storageClient";

const getStreamName = (productId: string): string => `product-${productId}`;

const mapProduct = (product: DatabaseProduct): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  currency: product.currency,
  description: product.description,
  imageUrl: product.imageUrl,
});

export async function getAllProductsV2(db: StorageClient): Promise<Product[]> {
  const products: DatabaseProduct[] = await db.list("products");

  return products.filter((product) => !product.isDeleted).map(mapProduct);
}

export async function getProductV2(
  db: StorageClient,
  id: string
): Promise<Product | undefined> {
  console.info(`Getting product: ${id}`);
  const product: DatabaseProduct | undefined = await db.get("products", id);

  if (!product || product.isDeleted) {
    return undefined;
  }
  return mapProduct(product);
}

export async function createProductV2(
  client: EventClient,
  product: Product
): Promise<void> {
  const events: StoreEventTypes[] = [
    {
      type: ProductEventTypes.ProductCreated,
      subject: product.id, // We could generate the ID here, but it makes the seeding more convenient if we just pass the ID in.
      name: product.name,
      price: product.price,
      currency: product.currency,
      description: product.description,
      imageUrl: product.imageUrl,
    },
  ];

  await client.emit(getStreamName(product.id), events, {
    streamState: "no_stream",
  });
}

type DatabaseProduct = Product & { isDeleted?: boolean };

export async function handleProductEvent(
  event: StoreEventTypes,
  db: StorageClient
) {
  const resolvedEvent = resolveProductEvent(event);
  const existingProduct: DatabaseProduct | undefined = await db.get(
    "products",
    event.subject
  );

  const updatedProduct = { ...existingProduct, ...resolvedEvent };
  await db.store("products", event.subject, updatedProduct);
  return updatedProduct;
}

const resolveProductEvent = (
  event: StoreEventTypes
): Partial<DatabaseProduct> => {
  const id = event.subject;

  switch (event.type) {
    case ProductEventTypes.ProductCreated:
      return {
        id: id,
        name: event.name,
        price: event.price,
        currency: event.currency,
        description: event.description,
        imageUrl: event.imageUrl,
      };

    case ProductEventTypes.ProductPriceUpdated:
      return {
        price: event.price,
        currency: event.currency,
      };

    case ProductEventTypes.ProductDetailsUpdated:
      return {
        name: event.name,
        description: event.description,
        imageUrl: event.imageUrl,
      };

    case ProductEventTypes.ProductDeleted:
      // Product was deleted, set the isDeleted flag to true
      return {
        isDeleted: true,
      };

    default:
      console.error(`Unexpected event type: ${event.type}`);
      throw new Error(`Unexpected event type: ${event.type}`);
  }
};
