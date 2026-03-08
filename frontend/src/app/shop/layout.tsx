import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold">
          Event Sourcing Shopping Cart
        </h1>
        {children}
      </main>
    </div>
  );
}
