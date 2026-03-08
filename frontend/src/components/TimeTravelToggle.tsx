"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function TimeTravelToggle() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const timeTravelEnabled = searchParams.get("timeTravelEnabled") === "true";
  const handleChange = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(
      "timeTravelEnabled",
      timeTravelEnabled ? "false" : "true",
    );
    router.push(`?${newSearchParams.toString()}`);
  };
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="timeTravelEnabled">Time Travel</Label>
      <Switch
        id="timeTravelEnabled"
        checked={timeTravelEnabled}
        onCheckedChange={handleChange}
      />
    </div>
  );
}
