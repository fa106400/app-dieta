"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const pathMap: Record<string, string> = {
  home: "Home",
  diets: "Catálogo",
  "my-plan": "Meu plano",
  "shopping-list": "Shopping List",
  ranking: "Ranking",
  me: "Eu",
  profile: "Configurações",
  onboarding: "Onboarding",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/home") {
    return null;
  }

  const pathSegments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs if there's only one segment (like /diets)
  if (pathSegments.length <= 1) {
    return null;
  }

  //fixing the breadcrumbs for the diets detail page
  if (pathSegments.length === 2 && pathSegments[0] === "diets") {
    pathSegments.pop();
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          <li>
            <Link
              href="/home"
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            const label =
              pathMap[segment] ||
              segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <li key={segment} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                {isLast ? (
                  <span className="font-medium text-gray-900">{label}</span>
                ) : (
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
