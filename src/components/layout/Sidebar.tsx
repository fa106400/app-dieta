"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Utensils,
  Calendar,
  //ShoppingCart,
  Trophy,
  User,
  X,
  //Settings,
  //Target,
} from "lucide-react";

import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Catálogo", href: "/diets", icon: Utensils },
  { name: "Meu plano", href: "/my-plan", icon: Calendar },
  //{ name: "Shopping List", href: "/shopping-list", icon: ShoppingCart },
  { name: "Ranking", href: "/ranking", icon: Trophy },
  { name: "Eu", href: "/me", icon: User },
];

/*const secondaryNavigation = [
  //{ name: "Onboarding", href: "/onboarding", icon: Target },
  { name: "Profile", href: "/profile", icon: Settings },
];*/

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/home" className="flex items-center space-x-2">
              {/* <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div> */}
              <Image
                className="h-10 w-auto max-w-full object-contain"
                src="/imgs/logo/logo-rect.png"
                alt="Logo"
                width={450}
                height={113}
                priority
              />
              {/* <span className="text-xl font-bold text-gray-900">[LOGO]</span> */}
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={cn(
                              isActive
                                ? "text-blue-700"
                                : "text-gray-400 group-hover:text-blue-700",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              {/*
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Account
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {secondaryNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={cn(
                              isActive
                                ? "text-blue-700"
                                : "text-gray-400 group-hover:text-blue-700",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              */}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <Link href="/home" className="flex items-center space-x-2">
              {/* <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div> */}
              <Image
                className="h-8 w-auto max-w-full object-contain"
                src="/imgs/logo/logo-rect.png"
                alt="Logo"
                width={450}
                height={113}
                priority
              />
              {/* <span className="text-xl font-bold text-gray-900">[LOGO]</span> */}
            </Link>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <ul role="list" className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? "text-blue-700"
                            : "text-gray-400 group-hover:text-blue-700",
                          "h-6 w-6 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/*
            <div className="mt-8">
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Account
              </div>
              <ul role="list" className="mt-2 space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:text-blue-700 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-blue-700"
                              : "text-gray-400 group-hover:text-blue-700",
                            "h-6 w-6 shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            */}
          </nav>
        </div>
      </div>
    </>
  );
}
