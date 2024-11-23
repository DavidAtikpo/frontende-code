"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  ChevronDown,
  Store,
  BarChart,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  {
    title: "Vue d'ensemble",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produits",
    href: "/seller/dashboard/products",
    icon: Package,
  },
  {
    title: "Commandes",
    href: "/seller/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Clients",
    href: "/seller/dashboard/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/seller/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Paiements",
    href: "/seller/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Paramètres",
    href: "/seller/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-[#1D4ED8]" />
            <span className="ml-2 text-xl font-bold">Vendeur Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Voir ma boutique
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isSidebarOpen ? "rotate-180" : ""
              )} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white transition-transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <nav className="space-y-1 p-4">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-[#1D4ED8] text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="container p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 