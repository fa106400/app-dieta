"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Utensils, LibraryBig, Trophy, UserRound } from "lucide-react";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Catálogo", href: "/diets", icon: LibraryBig },
  { name: "Meu plano", href: "/my-plan", icon: Utensils },
  { name: "Ranking", href: "/ranking", icon: Trophy },
  { name: "Eu", href: "/me", icon: UserRound },
];

export function FooterMenu() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sky-50 text-sky-500"
                  : "text-gray-600 hover:text-sky-500 hover:bg-gray-50"
              )}
            >
              <item.icon
                className={cn(
                  "h-7 w-7",
                  isActive ? "text-sky-500" : "text-gray-400"
                )}
                aria-hidden="true"
              />
              {/* <span className="text-xs mt-1 font-medium">{item.name}</span> */}
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
