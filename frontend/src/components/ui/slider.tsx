"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Slider({
  className,
  max,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { max: number }) {
  const m = max + 1;
  const [internalValue, setInternalValue] = React.useState([m]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChange = React.useCallback(
    (value: number[]) => {
      setInternalValue(value);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("revision", value[0].toString());
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Hack to make the slider and query params in sync when Max changes
  const searchParamsRef = React.useRef(searchParams);
  React.useLayoutEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);
  React.useEffect(() => {
    setInternalValue([m]);
    const newSearchParams = new URLSearchParams(searchParamsRef.current);
    newSearchParams.set("revision", m.toString());
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [m, router]);

  return (
    <div className="flex flex-col items-center gap-2 pb-6">
      <p className="text-sm">
        Version {internalValue[0]} / {m}
      </p>
      <BaseSlider
        className={className}
        defaultValue={[m]}
        min={0}
        max={m}
        onValueChange={handleChange}
        {...props}
      />
    </div>
  );
}

function BaseSlider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
