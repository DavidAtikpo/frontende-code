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
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;

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
    name: "Mes Formations",
    href: "/user/my-trainings",
    icon: Clock
  },
  {
    name: "Demande d'organisation",
    href: "/user/requests",
    icon: Clock

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
    name: "Boite de dialogue",
    href: "/user/messages",
    icon: MessageCircle
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
    href: "/seller/onboarding",
    icon: UserPlus
  }
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<{
    status: 'not_started' | 'pending' | 'approved' | 'rejected';
    message?: string;
  }>({ status: 'not_started' });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          window.location.href = "/login";
          return;
        }

        // Vérifier le statut de validation vendeur
        const response = await fetch(`${BASE_URL}/api/seller/validation-status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSellerStatus(data);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    deleteCookie('token');
    window.location.href = "/login";
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const getStatusDisplay = () => {
    switch (sellerStatus.status) {
      case 'pending':
        return (
          <Link href="/seller/validation_status" className="flex items-center text-yellow-600 hover:text-yellow-700">
            <Clock className="h-4 w-4 mr-2" />
            Validation vendeur en cours
          </Link>
        );
      case 'approved':
        return (
          <Link href="/seller/subscription" className="flex items-center text-green-600 hover:text-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Compte validé - Choisir un abonnement
          </Link>
        );
      case 'rejected':
        return (
          <Link href="/seller/validation_status" className="flex items-center text-red-600 hover:text-red-700">
            <XCircle className="h-4 w-4 mr-2" />
            Validation refusée - Voir les détails
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <header className="fixed top-[80px] left-0 right-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                DUBON
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {sellerStatus.status !== 'not_started' && (
                <div className="text-sm">
                  {getStatusDisplay()}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 pt-[160px]">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-[104px] right-4 z-50">
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
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          mt-[160px]
        `}>
          <div className="h-full flex flex-col">
            <div className="flex-1 py-4 overflow-y-auto">
              <div className="px-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Mon compte</h2>
              </div>
              <nav className="space-y-0.5 px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-2 py-1.5 text-sm font-medium rounded-md
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50'}
                      `}
                    >
                      <item.icon className={`
                        mr-3 h-4 w-4
                        ${isActive ? 'text-blue-600' : 'text-gray-400'}
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
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