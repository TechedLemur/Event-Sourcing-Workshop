"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { type Cart as CartType } from "@/types";
import { toast } from "sonner";
import { checkout, removeItemFromCart } from "@/actions";

type CartProps = {
  cartId: string;
  cart: CartType;
};

export function Cart({ cartId, cart }: CartProps) {
  const { items, total } = cart;
  const handleRemoveItem = async (itemId: string) => {
    await removeItemFromCart(cartId, itemId);
    toast.success("Item removed from cart");
  };
  const handleCheckout = async () => {
    const result = await checkout(cartId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const currency = items.find((item) => item.productCurrency)?.productCurrency;
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Shopping Cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            Your cart is empty
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <p className="font-semibold">
                      {item.productPrice.toFixed(2)} {item.productCurrency}
                    </p>
                    <Button
                      onClick={() => handleRemoveItem(item.id)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <div className="flex items-baseline justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  {total.toFixed(2)} {currency}
                </span>
              </div>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
