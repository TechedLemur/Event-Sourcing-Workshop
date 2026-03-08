"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentOrder } from "@/types";

function formatTime(iso: string) {
  // Format like Norwegian time: 24-hour, HH:MM:SS
  return new Date(iso).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


function formatCurrency(amount: number) {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
  }).format(amount);
}

export function RecentOrdersList({
  orders,
}: {
  orders: RecentOrder[] | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders !== null && orders.length > 0 ? (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.orderId}
                className="border-border flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {order.items
                      .map((i) => `${i.productName}`)
                      .join(", ")}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {order.createdAt ? formatTime(order.createdAt) : "N/A"}
                  </p>
                </div>
                <span className="ml-4 shrink-0 text-sm font-semibold">
                  {formatCurrency(order.totalAmount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            {orders === null
              ? "Not yet implemented — waiting for backend"
              : "No data yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
