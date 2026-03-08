import { ProductCard } from "./ProductCard";
import { API_VERSION, getProducts } from "@/queries";

export async function ProductGrid({
  version = "v1",
}: {
  version?: API_VERSION;
}) {
  const { data: products, error } = await getProducts(version);
  if (error) {
    return <div>{error}</div>;
  }
  if (!products) {
    return <div>No products found</div>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
