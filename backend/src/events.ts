type EventPayload<Type extends string, Data> = {
  type: Type;
  subject: string;
} & Data;

type HelloEvent = EventPayload<
  "HelloEvent",
  {
    message?: string;
  }
>;

export const enum CartEventTypes {
  ProductAddedToCart = "ProductAddedToCart",
  ProductRemovedFromCart = "ProductRemovedFromCart",
  OrderCreated = "OrderCreated",
  ProductAddedToCartV2 = "ProductAddedToCartV2",
}

type ProductRemovedFromCartEvent = EventPayload<
  CartEventTypes.ProductRemovedFromCart,
  {}
>;

type ProductAddedToCartEvent = EventPayload<
  CartEventTypes.ProductAddedToCart,
  {
    productId: string;
    productName: string;
    productPrice: number;
  }
>;

type ProductAddedToCartEventV2 = EventPayload<
  CartEventTypes.ProductAddedToCartV2,
  {
    productId: string;
    productName: string;
    productPrice: PriceWithCurrency;
  }
>;

type PriceWithCurrency = {
  amount: number;
  currency: string;
};

type OrderCreatedEvent = EventPayload<
  CartEventTypes.OrderCreated,
  {
    items: Array<{
      productId: string;
      productName: string;
      productPrice: number;
    }>;
    totalAmount: number;
  }
>;

export const enum ProductEventTypes {
  ProductCreated = "ProductCreated",
  ProductPriceUpdated = "ProductPriceUpdated",
  ProductDetailsUpdated = "ProductDetailsUpdated",
  ProductDeleted = "ProductDeleted",
}

type ProductCreatedEvent = EventPayload<
  ProductEventTypes.ProductCreated,
  {
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    currency: string;
  }
>;

type ProductPriceUpdatedEvent = EventPayload<
  ProductEventTypes.ProductPriceUpdated,
  {
    price: number;
    currency: string;
  }
>;

type ProductDetailsUpdatedEvent = EventPayload<
  ProductEventTypes.ProductDetailsUpdated,
  {
    name: string;
    description: string;
    imageUrl: string;
  }
>;

type ProductDeletedEvent = EventPayload<ProductEventTypes.ProductDeleted, {}>;

export type StoreEventTypes =
  | ProductAddedToCartEvent
  | ProductRemovedFromCartEvent
  | OrderCreatedEvent
  | ProductCreatedEvent
  | ProductPriceUpdatedEvent
  | ProductDetailsUpdatedEvent
  | ProductDeletedEvent
  | ProductAddedToCartEventV2
  | HelloEvent;
