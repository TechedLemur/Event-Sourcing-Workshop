import { AdminDashboard } from "@/components/admin/AdminDashboard";
import {
  getOrderGraph,
  getPopularItems,
  getRecentOrders,
} from "@/queries";

export default async function AdminPage() {
  const [graphData, recentOrders, popularItems] = await Promise.all([
    getOrderGraph(),
    getRecentOrders(),
    getPopularItems(),
  ]);

  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-4xl font-bold">Admin</h1>
        <AdminDashboard
          apiUrl={process.env.API_URL}
          initialGraphData={graphData}
          initialRecentOrders={recentOrders}
          initialPopularItems={popularItems}
        />
      </main>
    </div>
  );
}
