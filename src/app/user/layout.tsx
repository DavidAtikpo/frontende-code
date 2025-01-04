"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import { deleteCookie, getCookie } from "cookies-next";
// import NavigationBar from "../components/NavBar";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Heart, 
  Store, 
  UserPlus, 
  User, 
  ShoppingBag, 
  MapPin, 
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/user/dashboard",
    icon: LayoutDashboard
  },

  {
    name: "Profil",
    href: "/user/profile",
    icon: User
  },
  {
    name: "Commandes",
    href: "/user/orders",
    icon: ShoppingBag
  },
  {
    name: "Favoris",
    href: "/user/favorites",
    icon: Heart
  },
  {
    name: "Adresses",
    href: "/user/addresses",
    icon: MapPin
  },
  {
    name: "Activités",
    href: "/user/activities",
    icon: Activity
  },
  {
    name: "Paramètres",
    href: "/user/settings",
    icon: Settings
  },
  {
    name: "Boutique",
    href: "/products",
    icon: Store
  },
  {
    name: "Devenir Vendeur",
    href: "/seller/become",
    icon: UserPlus
  }
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérification du token d'authentification
    const token = getCookie('token');
    if (!token) {
      window.location.href = "/login";
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    deleteCookie('token');
    window.location.href = "/login";
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Header />
      {/* <NavigationBar /> */}
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}

      <div className="lg:hidden fixed top-30 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed  inset-y-0 left-0 z-40 w-64 bg-white border-r transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <div className="h-full flex flex-col top-20">
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
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <item.icon className={`
                      mr-3 h-5 w-5
                      ${isActive ? 'text-blue-600' : 'text-gray-400'}
                    `} />
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

      {/* Main content */}
      <main className={`
        lg:pl-64 flex-1
        ${isMobileMenuOpen ? 'blur-sm' : ''}
      `}>
        {children}
      </main>
    </div>
    </div>
  );
} 