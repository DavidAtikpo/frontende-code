"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Plus, Trash2, Star, StarOff, Pencil } from "lucide-react";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Address {
  id: string;
  type: 'shipping' | 'billing' | 'both' | 'store';
  isDefault: boolean;
  label: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email?: string;
  instructions?: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [newAddress, setNewAddress] = useState({
    type: 'both' as 'shipping' | 'billing' | 'both' | 'store',
    label: '',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
    instructions: ''
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/addresses`, {
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

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
    setNewAddress({
      type: address.type,
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      address1: address.address1,
      address2: address.address2 || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      email: address.email || '',
      instructions: address.instructions || ''
    });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAddress 
        ? `${BASE_URL}/api/user/address/${editingAddress.id}`
        : `${BASE_URL}/api/user/address`;
      
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: editingAddress 
            ? "Adresse modifiée avec succès"
            : "Nouvelle adresse ajoutée avec succès"
        });
        setShowAddForm(false);
        setEditingAddress(null);
        setNewAddress({
          type: 'both' as 'shipping' | 'billing' | 'both' | 'store',
          label: '',
          firstName: '',
          lastName: '',
          company: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          phone: '',
          email: '',
          instructions: ''
        });
        fetchAddresses();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
      console.error('Erreur:', error);
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
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;

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
          description: "Adresse supprimée avec succès"
        });
        fetchAddresses();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'adresse",
        variant: "destructive"
      });
      console.error('Erreur:', error);
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
            <CardTitle>
              {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={newAddress.firstName}
                    onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={newAddress.lastName}
                    onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company">Entreprise (optionnel)</Label>
                <Input
                  id="company"
                  value={newAddress.company}
                  onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address1">Adresse</Label>
                <Input
                  id="address1"
                  value={newAddress.address1}
                  onChange={(e) => setNewAddress({...newAddress, address1: e.target.value})}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address2">Complément d'adresse (optionnel)</Label>
                <Input
                  id="address2"
                  value={newAddress.address2}
                  onChange={(e) => setNewAddress({...newAddress, address2: e.target.value})}
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
                  <Label htmlFor="state">État/Région</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                    required
                  />
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAddress.email}
                    onChange={(e) => setNewAddress({...newAddress, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                <textarea
                  id="instructions"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newAddress.instructions}
                  onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingAddress ? 'Modifier' : 'Ajouter'}
                </Button>
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
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-sm">{address.address1}</p>
                    {address.address2 && (
                      <p className="text-sm text-muted-foreground">
                        {address.address2}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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