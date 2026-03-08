"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PopularItem } from "@/types";

export function PopularItemsList({
  items,
}: {
  items: PopularItem[] | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Items</CardTitle>
      </CardHeader>
      <CardContent>
        {items !== null && items.length > 0 ? (
          <ol className="space-y-3">
            {items.map((item, index) => (
              <li
                key={item.productId}
                className="border-border flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-6 text-right text-sm font-medium">
                    {index + 1}.
                  </span>
                  <span className="text-sm font-medium">
                    {item.productName}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {item.totalQuantity} sold
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            {items === null
              ? "Not yet implemented — waiting for backend"
              : "No data yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
