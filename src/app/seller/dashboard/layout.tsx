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
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCookie } from "cookies-next";

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

interface DailyStats {
  revenue: number;
  orders: number;
  newCustomers: number;
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


  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    profilePhotoURL: string | null;
  }>({ name: '', email: '', profilePhotoURL: null });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState('pending');


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

    // Simuler la récupération des notifications et du chiffre d'affaires
    fetchNotifications();
    fetchDailyRevenue();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/seller/subscription/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }

        const data = await response.json();
        setStatus(data.status || 'inactive');
      } catch (error) {
        console.error('Erreur vérification abonnement:', error);
        setStatus('inactive');
      }
    };

    checkSubscription();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/seller/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const fetchDailyRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/seller/stats/daily`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setDailyRevenue(response.data.data.revenue);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du chiffre d\'affaires:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/seller/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setNotifications(notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/seller/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
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
      {status === 'inactive' && (
        <div className="fixed top-16 left-0 right-0 z-50">
          <Alert className="m-4 bg-yellow-50 border-yellow-200">
            <AlertTitle className="text-yellow-800">
              Compte non activé
            </AlertTitle>
            <AlertDescription>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-yellow-700">
                  Votre compte est approuvé mais n'est pas encore activé. 
                  Activez-le en souscrivant à un abonnement.
                </span>
                <Button 
                  onClick={() => router.push('/seller/dashboard/subscription')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Activer mon compte
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

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
              <DropdownMenuContent 
                align="end" 
                className="w-full sm:w-80 bg-gray-50 fixed sm:absolute right-0 left-0 sm:left-auto top-0 sm:top-auto h-screen sm:h-auto rounded-none sm:rounded-md"
              >
                <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="sm:hidden"
                      onClick={() => {
                        const trigger = document.querySelector('[data-trigger="notifications"]');
                        if (trigger instanceof HTMLElement) {
                          trigger.click();
                        }
                      }}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <p className="font-medium">Notifications</p>
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <Separator />
                <ScrollArea className="h-[calc(100vh-4rem)] sm:h-[400px]">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer hover:bg-gray-100"
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
                    <div className="p-4 text-center text-muted-foreground bg-gray-50">
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
          <div className={`${status === 'inactive' ? 'pt-24' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 