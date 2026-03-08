import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/shop?cartId=123");
}
