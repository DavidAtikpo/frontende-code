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

const { BASE_URL } = API_CONFIG;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'seller' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  lastLogin: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    reviewCount: number;
  };
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

  const columns = [
    {
      accessorKey: "user",
      header: "Utilisateur",
      cell: ({ row }: { row: Row<User> }) => (
        <div className="flex items-center space-x-3">
          {row.original.avatar && (
            <Image
              src={row.original.avatar}
              alt={row.original.name}
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          )}
          <div>
            <p className="font-medium">{row.original.name}</p>
            <Badge>{row.original.role}</Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: ({ row }: { row: Row<User> }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-gray-400" />
            {row.original.email}
          </div>
          <div className="flex items-center">
            <FaPhone className="mr-2 text-gray-400" />
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "activity",
      header: "Activité",
      cell: ({ row }: { row: Row<User> }) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <FaShoppingBag className="mr-2 text-gray-400" />
            {row.original.stats.totalOrders} commandes
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            Dernière connexion: {new Date(row.original.lastLogin).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "stats",
      header: "Statistiques",
      cell: ({ row }: { row: Row<User> }) => (
        <div className="space-y-1">
          <p className="text-sm">
            Total dépensé: {row.original.stats.totalSpent.toLocaleString()} FCFA
          </p>
          <p className="text-sm">
            Avis: {row.original.stats.reviewCount}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: Row<User> }) => {
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
      cell: ({ row }: { row: Row<User> }) => {
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
      const response = await fetch(
        `${BASE_URL}/api/admin/users?role=${selectedRole}&status=${selectedStatus}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      setUsers(data.data);
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex space-x-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="seller">Vendeurs</option>
            <option value="admin">Administrateurs</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
            <option value="banned">Bannis</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
          />
        </CardContent>
      </Card>
    </div>
  );
}
