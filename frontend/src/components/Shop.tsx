import React, { Suspense } from "react";
import { ProductGrid } from "./ProductGrid";
import CartWrapper from "./CartWrapper";
import { API_VERSION } from "@/queries";
import TimeTravelSlider from "./TimeTravelSlider";
import TimeTravelToggle from "./TimeTravelToggle";

export default function Shop({
  searchParams,
  allowTimeTravel = true,
  version = "v1",
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
  allowTimeTravel?: boolean;
  version?: API_VERSION;
}) {
  return (
    <div className="relative">
      {allowTimeTravel && <TimeTravelSlider searchParams={searchParams} />}
      {allowTimeTravel && (
        <div className="absolute -top-6 right-0 md:-top-16">
          <TimeTravelToggle />
        </div>
      )}
      <div className="flex flex-col-reverse gap-8 lg:flex-row">
        {/* Products Section - Left side on desktop, top on mobile */}
        <div className="flex-1">
          <ProductGrid version={version} />
        </div>

        {/* Cart Section - Right side on desktop, bottom on mobile */}
        <div className="relative lg:sticky lg:top-8 lg:h-fit lg:w-96">
          <Suspense fallback={<div>Loading cart...</div>}>
            <CartWrapper
              allowTimeTravel={allowTimeTravel}
              searchParams={searchParams}
              version={version}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
