"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiUrl } from '@/utils/api';

const BASE_URL = getApiUrl();

interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export default function UserSettings() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors du chargement des informations");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur lors du chargement des informations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userInfo)
      });

      if (response.ok) {
        router.push('/user/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!userInfo) return <div>Erreur de chargement</div>;

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={userInfo.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <Input
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <Input
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/user/dashboard')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


