import React from "react";
import { Slider } from "./ui/slider";
import { getLastEventRevision } from "@/queries";

export default async function TimeTravelSlider({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { cartId, timeTravelEnabled } = await searchParams;
  const doTimeTravel = timeTravelEnabled === "true";
  if (!cartId || !doTimeTravel) {
    return null;
  }
  const lastEventRevision = await getLastEventRevision(cartId);
  if (!lastEventRevision) {
    return null;
  }
  return (
    <Slider key={lastEventRevision} min={0} max={lastEventRevision} step={1} />
  );
}
