"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  List,
  Users,
  MessageSquare,
  Calendar,
  ShoppingCart,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return null;
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => 
    typeof window !== 'undefined' && window.location.pathname === href;

  useEffect(() => {
    const adminToken = getCookie('adminToken');
    const userRole = getCookie('userRole');

    if (!adminToken || userRole !== 'admin') {
      router.replace('/adminLogin');
    }

    // Fermer la sidebar sur mobile par défaut
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Package, label: "Ajouter produits", href: "/admin/add-product" },
    { icon: List, label: "Liste produits", href: "/admin/products" },
    { icon: Users, label: "Utilisateurs", href: "/admin/users" },
    {
      icon: Users,
      label: "Demandes vendeurs",
      href: "/admin/seller-requests",
      badge: true,
    },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
    { icon: Calendar, label: "Evènements", href: "/admin/events" },
    { icon: ShoppingCart, label: "Commandes", href: "/admin/orders" },
    { icon: GraduationCap, label: "Formations", href: "/admin/trainings" },
    { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    { icon: LogOut, label: "Déconnexion", href: "/logout" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-30
          ${isSidebarOpen ? "w-64" : "w-0 md:w-20"} 
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <Image src="/LOGO-b.png" alt="Logo" width={60} height={32} className="h-8" />
          <button 
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors
                ${isActive(item.href) ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700" : ""}
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={`ml-3 font-medium ${!isSidebarOpen && "md:hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 
        ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} 
        ${isMobileMenuOpen ? "ml-0" : "ml-0"}
      `}>
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden md:inline">Admin</span>
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </header>
        <div className="p-4 md:p-6">
          <LogoutButton />
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
