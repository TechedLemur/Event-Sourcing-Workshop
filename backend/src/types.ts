// Here we can define the types used throughout the application

export type Checkpoint = {
  id: string;
  revision: bigint;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  imageUrl: string;
};

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productCurrency?: string;
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  productPrice: number;
};

export type Order = {
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date | undefined;
};

export type PopularItem = {
  productId: string;
  productName: string;
  totalQuantity: number;
};
