"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hrefWithSearchParams = useCallback(
    (href: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      return `${href}?${newSearchParams.toString()}`;
    },
    [searchParams],
  );

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                href={hrefWithSearchParams("/shop")}
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === "/shop" && "bg-accent",
                )}
              >
                <ShoppingCart className="mr-2 size-4 shrink-0" />
                Shop
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href={hrefWithSearchParams("/shop/v2")}
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === "/shop/v2" && "bg-accent",
                )}
              >
                <ShoppingCart className="mr-2 size-4 shrink-0" />
                Shop V2
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href={hrefWithSearchParams("/admin")}
                className={cn(
                  navigationMenuTriggerStyle(),
                  pathname === "/admin" && "bg-accent",
                )}
              >
                <Settings className="mr-2 size-4 shrink-0" />
                Admin
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </header>
  );
}
