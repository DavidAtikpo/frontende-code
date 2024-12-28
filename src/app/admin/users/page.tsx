"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Shield, Ban } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import { LoadingSpinner } from "@/components/ui/loading";
import { useRouter } from 'next/navigation';

const { BASE_URL } = API_CONFIG;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserFilters {
  status?: string;
  role?: string;
  dateRange?: DateRange;
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshToken = async () => {
    try {
      const refreshTokenValue = getCookie('refreshToken');
      const response = await fetch(`${BASE_URL}/api/admin/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await response.json();
      if (data.success) {
        // Mettre à jour le token dans les cookies
        document.cookie = `token=${data.accessToken}; path=/`;
        return data.accessToken;
      } else {
        throw new Error('Échec du rafraîchissement du token');
      }
    } catch (error) {
      console.error('Erreur refresh token:', error);
      router.push('/adminLogin');
      return null;
    }
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      const token = getCookie('token');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        // Token expiré, essayer de le rafraîchir
        const newToken = await refreshToken();
        if (!newToken) return null;

        // Réessayer avec le nouveau token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          },
          credentials: 'include'
        });
      }

      return response;
    } catch (error) {
      console.error('Erreur fetchWithAuth:', error);
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchWithAuth(`${BASE_URL}/api/admin/users`);
      
      if (!response) {
        throw new Error('Erreur d\'authentification');
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        const usersList = Array.isArray(data.data) ? data.data : 
                         data.data?.users ? data.data.users : [];
        setUsers(usersList);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}/api/admin/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response) {
        throw new Error('Erreur d\'authentification');
      }

      if (response.ok) {
        fetchUsers();
      } else {
        throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
      </div>

      <Card className="p-6">
        {users.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Aucun utilisateur trouvé
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleUpdateUser(user.id, { role: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="seller">Vendeur</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value) => handleUpdateUser(user.id, { status: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="suspended">Suspendu</SelectItem>
                        <SelectItem value="banned">Banni</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateUser(user.id, { status: 'active' })}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateUser(user.id, { status: 'banned' })}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
