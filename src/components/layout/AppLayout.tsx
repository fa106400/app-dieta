"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { FooterMenu } from "./FooterMenu";
// import { Breadcrumbs } from "./Breadcrumbs";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* old: bg-gray-50 */}
      {/* Desktop Sidebar - always visible on lg+ screens */}
      <div className="hidden lg:block">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header />

        {/* Breadcrumbs */}
        {/* <Breadcrumbs /> */}

        {/* Page content */}
        <main className="py-4 pb-16 md:pb-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile Footer Menu */}
      <FooterMenu />
    </div>
  );
}
