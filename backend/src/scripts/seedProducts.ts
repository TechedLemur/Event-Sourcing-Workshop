import EventClient from "../clients/eventClient";
import { createProduct, getAllProducts } from "../services/products";
import { Product } from "../types";

const products: Required<Product>[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    currency: "NOK",
    description: "High-quality wireless headphones with noise cancellation",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 249.99,
    currency: "NOK",
    description: "Feature-rich smartwatch with fitness tracking",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Laptop Stand",
    price: 49.99,
    currency: "NOK",
    description: " Ergonomic aluminum laptop stand for better posture",
    imageUrl:
      "https://images.unsplash.com/photo-1629317480872-45e07211ffd4?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    price: 129.99,
    currency: "NOK",
    description: "RGB mechanical keyboard with cherry MX switches",
    imageUrl:
      "https://images.unsplash.com/photo-1626958390943-a70309376444??w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "USB-C Hub",
    price: 39.99,
    currency: "NOK",
    description: "Multi-port USB-C hub with HDMI and SD card reader",
    imageUrl:
      "https://images.unsplash.com/photo-1616578781650-cd818fa41e57?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Wireless Mouse",
    price: 29.99,
    currency: "NOK",
    description: "Ergonomic wireless mouse with long battery life",
    imageUrl:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
  },
];

async function seedProducts(client: EventClient) {
  const existingProducts = await getAllProducts(client);
  if (existingProducts.length > 0) {
    console.info(
      `Products already exist (${existingProducts.length} found). Skipping seed.`
    );
    return;
  }

  for (const product of products) {
    try {
      await createProduct(client, product);
    } catch (error) {
      console.warn(`Failed to create product ${product.id}:`, error);
    }
  }
}

async function main() {
  const url = process.env.EVENT_STORE_CONNECTION_STRING;
  if (!url) {
    throw new Error("EVENT_STORE_CONNECTION_STRING is not set");
  }
  const client = new EventClient(url, "seeder");
  await seedProducts(client);
}

main()
  .then(() => {
    console.info("Products seeded successfully");
  })
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
