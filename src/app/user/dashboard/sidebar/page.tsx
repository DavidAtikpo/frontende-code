"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  CreditCard, 
  Clock, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Historique des paiements",
    href: "/user/payments",
    icon: CreditCard,
  },
  {
    name: "Commandes",
    href: "/user/orders",
    icon: Clock,
  },
  {
    name: "Paramètres",
    href: "/user/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  handleLogout: () => void;
  toggleMobileMenu: () => void;
}

export default function Sidebar({
  isMobileMenuOpen,
  handleLogout,
  toggleMobileMenu,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-[4rem] inset-y-0 left-0 z-40 w-64 bg-white border-r transform 
      ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 transition-transform duration-200 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mon compte</h2>
          </div>
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md 
                    ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 
                      ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </Button>
        </div>
      </div>
    </aside>
  );
}
