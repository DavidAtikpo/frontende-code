"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  
  Settings,
  
  Menu,
  X,
  Star,
  Activity,
  FolderTree,
  CreditCard,
  BarChart,
  Database,
  Image as ImageIcon,
  Megaphone,
  MessageCircle
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { LoadingSpinner } from "@/components/ui/loading";
import { getCookie } from "cookies-next";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState<string>("");

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const checkAuth = async () => {
      const adminToken = getCookie('token');
      const userRole = getCookie('role');

      if (!adminToken || userRole !== 'admin') {
        router.replace('/adminLogin');
      } else {
        setIsLoading(false);
      }
    };

    // Récupérer le nom de l'admin depuis localStorage
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('name');
      setAdminName(name || "");
    }

    checkAuth();

    // Gérer le redimensionnement
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/admin/dashboard",
      description: "Statistiques générales et KPIs"
    },
    { 
      icon: Users, 
      label: "Utilisateurs", 
      href: "/admin/users",
      description: "Gestion des utilisateurs et rôles"
    },
    { 
      icon: MessageCircle, 
      label: "Conversations", 
      href: "/admin/conversations",
      description: "Gestion des conversations"
    },
    {
      icon: Users,
      label: "Vendeurs",
      href: "/admin/seller-requests",
      description: "Gestion des vendeurs et demandes",
      badge: true
    },
    { 
      icon: ShoppingCart, 
      label: "Commandes", 
      href: "/admin/orders",
      description: "Suivi des commandes et paiements"
    },
    { 
      icon: Star, 
      label: "Avis", 
      href: "/admin/reviews",
      description: "Modération des avis"
    },
    { 
      icon: Activity, 
      label: "Logs Système", 
      href: "/admin/logs",
      description: "Journaux d'activité système"
    },
    { 
      icon: Package, 
      label: "Avis", 
      href: "/admin/reviews",
      description: "Gestion des avis"
    },
    { 
      icon: Package, 
      label: "Plugins", 
      href: "/admin/plugins",
      description: "Gestion des plugins"
    },
    { 
      icon: ImageIcon, 
      label: "media-library", 
      href: "/admin/media-library",
      description: "Gestion des médias"
    },
    { 
      icon: CreditCard, 
      label: "payments", 
      href: "/admin/payments",
      description: "Gestion des paiements"
    },
    { 
      icon: CreditCard, 
      label: "Retraits", 
      href: "/admin/withdrawals",
      description: "Validation des demandes de retrait"
    },
    { 
      icon: Settings, 
      label: "site-settings", 
      href: "/admin/site-settings",
      description: "Gestion des paramètres du site"
    },    { 
      icon: FolderTree, 
      label: "themes", 
      href: "/admin/themes",
      description: "Gestion des thèmes"
    },
    { 
      icon: Settings, 
      label: "system", 
      href: "/admin/system",
      description: "Gestion des paramètres du site"
    },
    { 
      icon: BarChart, 
      label: "reports", 
      href: "/admin/reports",
      description: "Gestion des rapports"
    },
    { 
      icon: Database, 
      label: "backup", 
      href: "/admin/backup",
      description: "Gestion des sauvegardes"
    },
    { 
      icon: BarChart, 
      label: "analytics", 
      href: "/admin/analytics",
      description: "Analyse des données"
    },
    { 
      icon: Megaphone,
      label: "Marketing", 
      href: "/admin/marketing",
      description: "Campagnes marketing et communications"
    },
    { 
      icon: Megaphone,
      label: "Publicités", 
      href: "/admin/advertising",
      description: "Gestion des publicités et campagnes"
    },
    { 
      icon: Settings, 
      label: "Maintenance", 
      href: "/admin/maintenance",
      description: "Maintenance et nettoyage système" 
    },
    { 
      icon: FolderTree, 
      label: "Catégories", 
      href: "/admin/categories",
      description: "Gestion des catégories"
    },
    { 
      icon: Settings, 
      label: "Paramètres", 
      href: "/admin/settings",
      description: "Configuration du système"
    },
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

        <nav className="mt-6 h-[calc(100vh-5rem)] overflow-y-auto">
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
              <span className="text-sm text-gray-700 hidden md:inline">
                {adminName}
              </span>
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
