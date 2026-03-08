import { Cart } from "./Cart";
import { API_VERSION, getCart, getCartPositioned } from "@/queries";
import { redirect } from "next/navigation";

/// Server component wrapper for the client Cart component
export default async function CartWrapper({
  searchParams,
  allowTimeTravel = true,
  version = "v1",
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  version?: API_VERSION;
  allowTimeTravel?: boolean;
}) {
  const { cartId, timeTravelEnabled, revision } = await searchParams;

  const revisionNumber = revision ? parseInt(revision) : NaN;

  const doTimeTravel =
    timeTravelEnabled === "true" && allowTimeTravel && !isNaN(revisionNumber);

  if (!cartId) {
    return redirect("/shop?cartId=123");
  }

  const { data: cart, error } = doTimeTravel
    ? await getCartPositioned(cartId, revisionNumber)
    : await getCart(cartId, version);

  if (error) {
    return <div>{error}</div>;
  }
  if (!cart) {
    return <div>Cart not found</div>;
  }

  return <Cart cartId={cartId} cart={cart} />;
}
