"use client";

import { UserMenu } from "./UserMenu";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Mobile logo - left */}
          <div className="flex-1 flex justify-left md:hidden">
            <Image
              className="h-8 w-auto object-contain"
              src="/imgs/logo/logo-rect.png"
              alt="Logo"
              width={225}
              height={57}
              priority
            />
          </div>

          {/* Desktop - empty left side */}
          <div className="hidden md:block flex-1"></div>

          {/* Right side - User menu */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
