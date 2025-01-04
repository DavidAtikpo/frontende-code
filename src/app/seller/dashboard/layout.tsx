"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  X,
  Store,
  BarChart,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Hamburger } from "@/components/ui/hamburger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { API_CONFIG } from "@/utils/config";

const { BASE_URL } = API_CONFIG;


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
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    profilePhotoURL: string | null;
  }>({ name: '', email: '', profilePhotoURL: null });

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const firstName = user.name?.split(' ')[0] || '';
        
        // Construire l'URL de la photo de profil de manière sécurisée
        let photoURL = null;
        if (user.profilePhotoUrl) {
          // Si l'URL commence déjà par http, on la garde telle quelle
          if (user.profilePhotoUrl.startsWith('http')) {
            photoURL = user.profilePhotoUrl;
          } else {
            // Sinon, on ajoute le BASE_URL
            photoURL = `${API_CONFIG.BASE_URL}${user.profilePhotoUrl}`;
          }
        }

        setUserInfo({
          name: user.name || '',
          email: user.email || '',
          profilePhotoURL: photoURL
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur parsing userData:', error);
      }
    }
    setIsAuthenticated(!!token);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Hamburger 
              onClick={toggleSidebar}
              className="md:hidden"
            />
            <Store className="h-8 w-8 text-[#1D4ED8]" />
            <span className="ml-2 text-xl font-bold hidden md:inline">
              Vendeur Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => router.push(`/store/${user?.storeId}`)}
            >
              Voir ma boutique
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {/* Contenu des notifications */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profil utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    {userInfo.profilePhotoURL ? (
                      <AvatarImage 
                        src={userInfo.profilePhotoURL} 
                        alt={userInfo.name}
                      />
                    ) : (
                      <AvatarFallback>
                        {userInfo.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/seller/profile')}>
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/seller/settings')}>
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/seller/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Aide
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="hidden md:flex"
            >
              <X 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isSidebarOpen ? "" : "rotate-180"
                )} 
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Overlay pour mobile */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200",
          "transition-all duration-300 ease-in-out",
          "sidebar-scrollbar",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
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
                    "hover:bg-gray-100",
                    isActive ? "bg-[#1D4ED8] text-white" : "text-gray-700",
                    !isSidebarOpen && "md:justify-center"
                  )}
                  onClick={() => isMobile && toggleSidebar()}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    !isSidebarOpen && "md:hidden"
                  )}>
                    {link.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-20"
        )}>
          <div className="container p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 