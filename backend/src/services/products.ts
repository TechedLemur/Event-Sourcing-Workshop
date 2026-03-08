import { StreamNotFoundError } from "@kurrent/kurrentdb-client";
import EventClient from "../clients/eventClient";
import { ProductEventTypes, StoreEventTypes } from "../events";
import { Product } from "../types";

const getStreamName = (productId: string): string => `product-${productId}`;

export async function createProduct(
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

export async function getProduct(
  client: EventClient,
  id: string
): Promise<Product | undefined> {
  console.info(`Getting product: ${id}`);
  const streamName = getStreamName(id);

  let product: Product | undefined = undefined;

  try {
    const events = client.read(streamName);

    for await (const event of events) {
      switch (event.type) {
        case ProductEventTypes.ProductCreated:
          product = {
            id: id,
            name: event.name,
            price: event.price,
            currency: event.currency,
            description: event.description,
            imageUrl: event.imageUrl,
          };
          break;

        case ProductEventTypes.ProductPriceUpdated:
          if (product) {
            product.price = event.price;
            product.currency = event.currency;
          }
          break;

        case ProductEventTypes.ProductDetailsUpdated:
          if (product) {
            product.name = event.name;
            product.description = event.description;
            product.imageUrl = event.imageUrl;
          }
          break;

        case ProductEventTypes.ProductDeleted:
          // Product was deleted, return undefined
          return undefined;

        default:
          console.error(`Unexpected event type: ${event.type}`);
          throw new Error(`Unexpected event type: ${event.type}`);
      }
    }
  } catch (error) {
    if (error instanceof StreamNotFoundError) {
      return undefined;
    }
    throw error;
  }

  return product;
}

export async function getAllProducts(client: EventClient): Promise<Product[]> {
  // Read from the $ce-product category stream (all product events)
  // KurrentDB automatically creates category streams with $ce- prefix
  const events = client.read("$ce-product");
  // Later in the workshop this will be persisted in a projected database
  const productsMap = new Map<string, Product>();

  try {
    for await (const event of events) {
      const productId = event.subject;

      switch (event.type) {
        case ProductEventTypes.ProductCreated:
          productsMap.set(productId, {
            id: productId,
            name: event.name,
            price: event.price,
            currency: event.currency,
            description: event.description,
            imageUrl: event.imageUrl,
          });
          break;

        case ProductEventTypes.ProductPriceUpdated:
          const productForPrice = productsMap.get(productId);
          if (productForPrice) {
            productForPrice.price = event.price;
            productForPrice.currency = event.currency;
          }
          break;

        case ProductEventTypes.ProductDetailsUpdated:
          const productForDetails = productsMap.get(productId);
          if (productForDetails) {
            if (event.name !== undefined) productForDetails.name = event.name;
            if (event.description !== undefined)
              productForDetails.description = event.description;
            if (event.imageUrl !== undefined)
              productForDetails.imageUrl = event.imageUrl;
          }
          break;

        case ProductEventTypes.ProductDeleted:
          productsMap.delete(productId);
          break;
      }
    }
  } catch (error) {
    if (error instanceof StreamNotFoundError) {
      // No products exist yet
      return [];
    }
    throw error;
  }

  return Array.from(productsMap.values());
}

export async function updateProductPrice(
  client: EventClient,
  productId: string,
  price: number,
  currency: string
): Promise<void> {
  const events: StoreEventTypes[] = [
    {
      type: ProductEventTypes.ProductPriceUpdated,
      subject: productId,
      price,
      currency,
    },
  ];
  console.log("Updating product price:", events);

  await client.emit(getStreamName(productId), events, {
    streamState: "stream_exists",
  });
}

export async function updateProductDetails(
  client: EventClient,
  productId: string,
  details: { name: string; description: string; imageUrl: string }
): Promise<void> {
  const events: StoreEventTypes[] = [
    {
      type: ProductEventTypes.ProductDetailsUpdated,
      subject: productId,
      name: details.name,
      description: details.description,
      imageUrl: details.imageUrl,
    },
  ];
  await client.emit(getStreamName(productId), events, {
    streamState: "stream_exists",
  });
}

export async function deleteProduct(
  client: EventClient,
  productId: string
): Promise<void> {
  const events: StoreEventTypes[] = [
    {
      type: ProductEventTypes.ProductDeleted,
      subject: productId,
    },
  ];
  await client.emit(getStreamName(productId), events, {
    streamState: "stream_exists",
  });
}
