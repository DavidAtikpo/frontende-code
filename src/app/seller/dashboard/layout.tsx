"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  LogOut,
  History
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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
    title: "Historique",
    href: "/seller/dashboard/history",
    icon: History,
  },
  {
    title: "Paramètres",
    href: "/seller/dashboard/settings",
    icon: Settings,
  },
];

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'alert' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

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
    // Simuler la récupération des notifications et du chiffre d'affaires
    fetchNotifications();
    fetchDailyRevenue();
  }, []);

  const fetchNotifications = async () => {
    // Appel API pour récupérer les notifications
    // Pour l'exemple, on utilise des données statiques
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Nouvelle commande',
        message: 'Commande #1234 reçue pour 15000 FCFA',
        createdAt: new Date().toISOString(),
        read: false
      },
      // ... autres notifications
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const fetchDailyRevenue = async () => {
    // Appel API pour récupérer le chiffre d'affaires du jour
    setDailyRevenue(125000); // Exemple
  };

  const markAsRead = async (notificationId: string) => {
    // Appel API pour marquer comme lu
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

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
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Chiffre du jour</p>
              <p className="font-bold">{dailyRevenue.toLocaleString()} FCFA</p>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/shop')}
            >
              <Store className="h-4 w-4 mr-2" />
              Voir ma boutique
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4">
                  <p className="font-medium">Notifications</p>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {/* Marquer tout comme lu */}}
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <Separator />
                <ScrollArea className="h-[400px]">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 space-y-1">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: fr
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune notification
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profil utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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