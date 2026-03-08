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
  items: CartItem[];
  total: number;
};

export type OrderEvent = {
  orderId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
  }>;
  totalAmount: number;
  createdAt: string | undefined;
};

export type RecentOrder = OrderEvent;

export type OrderGraphPoint = {
  timestamp: string;
  orderCount: number;
};

export type OrderGraphData = {
  points: OrderGraphPoint[];
};

export type PopularItem = {
  productId: string;
  productName: string;
  totalQuantity: number;
};
