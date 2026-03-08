"use client";

import { addItemToCart } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");
  const handleSubmit = async () => {
    if (!cartId) {
      toast.error("Cart ID is required");
      return;
    }
    await addItemToCart(cartId, product.id);
    toast.success("Item added to cart");
  };
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-1">
        <div className="bg-muted mb-4 aspect-square w-full overflow-hidden rounded-lg">
          <Image
            loading="eager"
            width={400}
            height={400}
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {product.price.toFixed(2)} {product.currency}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={!cartId}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
