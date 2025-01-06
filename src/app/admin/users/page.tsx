"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import Image from 'next/image';
import { 
 
  FaBan, 
  FaCheck,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaShoppingBag
} from 'react-icons/fa';
import { Row } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from 'next/navigation';
import { UserAvatar } from "@/components/ui/user-avatar";

const { BASE_URL } = API_CONFIG;

interface SellerProfile {
  id: string;
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  logo: string | null;
  subscription: {
    type: string;
    status: 'pending' | 'active' | 'expired';
    expiresAt: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: 'user' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  sellerProfile?: SellerProfile;
  products?: Product[];
}

type StatusColors = {
  [key in User['status']]: string;
};

const colors: StatusColors = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-yellow-100 text-yellow-800",
  banned: "bg-red-100 text-red-800"
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "user",
      header: "Utilisateur",
      cell: ({ row }) => (
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
          onClick={() => handleUserClick(row.original)}
        >
          <UserAvatar
            name={row.original.name}
            avatarUrl={row.original.avatar}
            className="hidden sm:block w-8 h-8"
          />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <Badge className="hidden sm:inline-flex">{row.original.role}</Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="hidden md:block">
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div className="hidden lg:block space-y-1">
          {row.original.phone && (
            <div className="flex items-center">
              <FaPhone className="mr-2 text-gray-400" />
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "dates",
      header: "Dates",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            Créé le: {new Date(row.original.createdAt).toLocaleDateString()}
          </div>
          {row.original.lastLogin && (
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              Dernière connexion: {new Date(row.original.lastLogin).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const isActive = user.status === 'active';
        const isSuspended = user.status === 'suspended';

        return (
          <div className="flex items-center space-x-2">
            {isActive && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange(user.id, 'suspended')}
              >
                <FaBan className="mr-2" />
                Suspendre
              </Button>
            )}
            {isSuspended && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(user.id, 'active')}
              >
                <FaCheck className="mr-2" />
                Réactiver
              </Button>
            )}
            {user.status !== 'banned' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange(user.id, 'banned')}
              >
                <FaBan className="mr-2" />
                Bannir
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    try {
      const token = getCookie('token');
      if (!token) {
        toast.error('Veuillez vous connecter');
        return;
      }

      let url = `${BASE_URL}/api/admin/users`;
      // Ajouter les paramètres de filtrage seulement s'ils ne sont pas 'all'
      const params = new URLSearchParams();
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      
      // Ajouter les paramètres à l'URL s'ils existent
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/adminLogin';
        return;
      }

      if (response.status === 403) {
        toast.error('Vous n\'avez pas les permissions nécessaires');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      if (data.success) {
        // Filtrer les admins
        const filteredUsers = data.data.users.filter((user: User) => user.role !== 'admin');
        setUsers(filteredUsers || []);
      } else {
        toast.error(data.message || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    const reason = newStatus === 'suspended' || newStatus === 'banned' 
      ? window.prompt('Raison du changement de statut:')
      : undefined;

    if ((newStatus === 'suspended' || newStatus === 'banned') && !reason) {
      toast.error('Une raison est requise');
      return;
    }

    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, reason })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      toast.success('Statut mis à jour avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleUserClick = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };

  // Composant pour afficher les détails d'un vendeur
  const SellerDetails = ({ seller }: { seller: User }) => {
    if (!seller.sellerProfile) return null;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium">Nom de la boutique</h3>
                <p>{seller.sellerProfile.businessName}</p>
              </div>
              <div>
                <h3 className="font-medium">Type d'activité</h3>
                <p>{seller.sellerProfile.businessType}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{seller.sellerProfile.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Adresse</h3>
                <p>{seller.sellerProfile.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abonnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium">Type d'abonnement</h3>
                <Badge>{seller.sellerProfile.subscription.type}</Badge>
              </div>
              <div>
                <h3 className="font-medium">Statut</h3>
                <Badge className={
                  seller.sellerProfile.subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                  seller.sellerProfile.subscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {seller.sellerProfile.subscription.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Paiement</h3>
                <Badge className={
                  seller.sellerProfile.subscription.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                  seller.sellerProfile.subscription.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {seller.sellerProfile.subscription.paymentStatus}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Expire le</h3>
                <p>{new Date(seller.sellerProfile.subscription.expiresAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {seller.products && seller.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Produits ({seller.products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seller.products.map(product => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <Image
                      src={product.mainImage}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="font-medium mt-2">{product.name}</h3>
                    <p className="text-gray-600">{product.price.toLocaleString()} FCFA</p>
                    <Badge className="mt-2">{product.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Composant pour afficher les détails d'un utilisateur normal
  const UserDetails = ({ user }: { user: User }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium">Nom</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <h3 className="font-medium">Téléphone</h3>
                <p>{user.phone}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium">Statut</h3>
              <Badge className={colors[user.status]}>{user.status}</Badge>
            </div>
            <div>
              <h3 className="font-medium">Membre depuis</h3>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {user.lastLogin && (
              <div>
                <h3 className="font-medium">Dernière connexion</h3>
                <p>{new Date(user.lastLogin).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Gestion des utilisateurs</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border rounded-md p-2 w-full sm:w-auto"
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="seller">Vendeurs</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-md p-2 w-full sm:w-auto"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="banned">Banni</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <DataTable<User, unknown>
                  columns={columns}
                  data={users}
                  searchKey="email"
                />
              </div>
            </CardContent>
          </Card>

          {showUserDetails && selectedUser && (
            <div className="mt-6">
              {selectedUser.role === 'seller' ? (
                <SellerDetails seller={selectedUser} />
              ) : (
                <UserDetails user={selectedUser} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
