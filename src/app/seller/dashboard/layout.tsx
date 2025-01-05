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
  HelpCircle,
  LogOut,
  History,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { NotificationsDropdown } from '@/components/seller/NotificationsDropdown';

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100/40">
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/seller/dashboard" className="mr-8">
            <Store className="h-6 w-6" />
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    {user && user.avatar ? (
                      <AvatarImage 
                        src={user.avatar} 
                        alt={user.name || ''}
                      />
                    ) : (
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
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
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50"
            onClick={toggleSidebar}
          />
        )}

        <aside className={cn(
          "fixed left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 ease-in-out",
          "md:translate-x-0"
        )}>
          <nav className="space-y-1 p-4">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive ? 
                      "bg-gray-100 text-gray-900" : 
                      "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-0",
          "p-4 md:p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
} 