"use client";

import { useOrdersSSE } from "@/hooks/useOrdersSSE";
import { OrderGraphData, PopularItem, RecentOrder } from "@/types";
import { OrdersGraph } from "./OrdersGraph";
import { RecentOrdersList } from "./RecentOrdersList";
import { PopularItemsList } from "./PopularItemsList";

export function AdminDashboard({
  apiUrl,
  initialGraphData,
  initialRecentOrders,
  initialPopularItems,
}: {
  apiUrl: string | undefined;
  initialGraphData: OrderGraphData | null;
  initialRecentOrders: RecentOrder[] | null;
  initialPopularItems: PopularItem[] | null;
}) {
  const { graphData, recentOrders, popularItems, connected } = useOrdersSSE(
    apiUrl,
    initialGraphData,
    initialRecentOrders,
    initialPopularItems,
  );

  return (
    <div className="space-y-6">
      <OrdersGraph data={graphData} connected={connected} />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrdersList orders={recentOrders} />
        <PopularItemsList items={popularItems} />
      </div>
    </div>
  );
}
