"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderGraphData, OrderGraphPoint } from "@/types";

// Bucket by 15 minutes
function bucketBy15Minutes(points: OrderGraphPoint[]): OrderGraphPoint[] {
  const buckets = new Map<string, number>();
  for (const p of points) {
    const d = new Date(p.timestamp);
    d.setSeconds(0, 0);
    // Floor to nearest 15 min
    d.setMinutes(Math.floor(d.getMinutes() / 15) * 15, 0, 0);
    const key = d.toISOString();
    buckets.set(key, (buckets.get(key) ?? 0) + p.orderCount);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([timestamp, orderCount]) => ({ timestamp, orderCount }));
}

const chartConfig = {
  orderCount: {
    label: "Orders",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersGraph({
  data,
  connected,
}: {
  data: OrderGraphData | null;
  connected: boolean;
}) {
  const bucketed = data !== null ? bucketBy15Minutes(data.points) : [];
  const hasData = bucketed.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Orders Over Time
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500" : "bg-muted"}`}
            title={connected ? "Live" : "Disconnected"}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
            <LineChart data={bucketed}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                fontSize={12}
              />
              <YAxis allowDecimals={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="linear"
                dataKey="orderCount"
                stroke="var(--color-orderCount)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex h-[200px] items-center justify-center">
            {data === null
              ? "Not yet implemented — waiting for backend"
              : "No data yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
