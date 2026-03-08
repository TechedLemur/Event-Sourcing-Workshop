"use client";

import { useEffect, useRef, useState } from "react";
import { OrderEvent, OrderGraphData, PopularItem, RecentOrder } from "@/types";

const MAX_ITEMS = 10;

function to15MinBucket(iso: string): string {
  const d = new Date(iso);
  d.setSeconds(0, 0);
  // Round down to the nearest 15 minutes
  const minutes = d.getMinutes();
  const rounded = Math.floor(minutes / 15) * 15;
  d.setMinutes(rounded, 0, 0);
  return d.toISOString();
}

export function useOrdersSSE(
  apiUrl: string | undefined,
  initialGraphData: OrderGraphData | null,
  initialRecentOrders: RecentOrder[] | null,
  initialPopularItems: PopularItem[] | null,
) {
  const [graphData, setGraphData] = useState<OrderGraphData | null>(
    initialGraphData,
  );
  const [recentOrders, setRecentOrders] = useState<RecentOrder[] | null>(
    initialRecentOrders,
  );
  const [popularItems, setPopularItems] = useState<PopularItem[] | null>(
    initialPopularItems,
  );
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!apiUrl) return;

    const es = new EventSource(`${apiUrl}/orders/live`);
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (event) => {
      try {
        const order = JSON.parse(event.data) as OrderEvent;

        // Increment hourly bucket for graph
        setGraphData((prev) => {
          const bucketKey = to15MinBucket(order.createdAt ?? "");
          const points = [...(prev?.points ?? [])];
          const existing = points.find((p) => p.timestamp === bucketKey);
          if (existing) {
            existing.orderCount += 1;
          } else {
            points.push({ timestamp: bucketKey, orderCount: 1 });
            points.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
          }
          return { points };
        });

        // Prepend to recent orders, cap at MAX_ITEMS
        setRecentOrders((prev) => [order, ...(prev ?? [])].slice(0, MAX_ITEMS));

        // Merge into popular items
        setPopularItems((prev) => {
          const map = new Map(
            (prev ?? []).map((item) => [item.productId, { ...item }]),
          );
          for (const item of order.items) {
            const existing = map.get(item.productId);
            if (existing) {
              existing.totalQuantity += 1;
            } else {
              map.set(item.productId, {
                productId: item.productId,
                productName: item.productName,
                totalQuantity: 1,
              });
            }
          }
          return [...map.values()]
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, MAX_ITEMS);
        });
      } catch {
        // Ignore malformed events
      }
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [apiUrl]);

  return { graphData, recentOrders, popularItems, connected };
}
