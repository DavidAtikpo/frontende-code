"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Plus, Trash2, Star, StarOff } from "lucide-react";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Address {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/address`, {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error: unknown) {
      void error;
      console.error('Erreur lors du chargement des adresses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/user/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Nouvelle adresse ajoutée avec succès."
        });
        setShowAddForm(false);
        setNewAddress({ street: "", city: "", postalCode: "", country: "" });
        fetchAddresses();
      }
    } catch (error: unknown) {
      void error;
      console.error('Erreur lors de l\'ajout de l\'adresse');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/address/${addressId}/default`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Adresse par défaut mise à jour."
        });
        fetchAddresses();
      }
    } catch (error: unknown) {
      void error;
      console.error('Erreur lors de la mise à jour de l\'adresse');
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Adresse supprimée avec succès."
        });
        fetchAddresses();
      }
    } catch (error: unknown) {
      void error;
      console.error('Erreur lors de la suppression de l\'adresse');
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes adresses</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une adresse
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle adresse</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="street">Rue</Label>
                <Input
                  id="street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    {address.isDefault ? (
                      <Star className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    disabled={address.isDefault}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 