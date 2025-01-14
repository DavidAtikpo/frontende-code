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
import { isValidPhoneNumber, CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { validateEmail } from '@/utils/validation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isReloading, setIsReloading] = useState(false);
  const [coordinates, setCoordinates] = useState<{latitude: number | null, longitude: number | null}>({
    latitude: null,
    longitude: null
  });
  const [isLocating, setIsLocating] = useState(false);

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

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const countries = getCountries();

  useEffect(() => {
    const userLocale = navigator.language;
    const country = userLocale.split('-')[1] || 'FR';
    setCountryCode(country as CountryCode);
  }, []);

  const validateForm = () => {
    let isValid = true;
    
    // Validation email
    const emailValidation = validateEmail(newAddress.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.message);
      isValid = false;
    }

    // Validation téléphone
    try {
      if (!isValidPhoneNumber(newAddress.phone, countryCode as CountryCode)) {
        setPhoneError("Numéro de téléphone invalide");
        isValid = false;
      }
    } catch (error) {
      console.error('Erreur lors de la validation du numéro de téléphone:', error);
      setPhoneError("Numéro de téléphone invalide");
      isValid = false;
    }

    return isValid;
  };

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

  const handleReload = async () => {
    setIsReloading(true);
    await fetchAddresses();
    setIsReloading(false);
  };

  const getLocation = async () => {
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      toast({
        title: "Succès",
        description: "Localisation obtenue avec succès"
      });
    } catch (error: unknown) {
      void error;
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir la localisation",
        variant: "destructive"
      });
    } finally {
      setIsLocating(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setEmailError("");

    if (!validateForm()) return;
    
    if (addresses.length >= 5) {
      toast({
        title: "Erreur",
        description: "Vous ne pouvez pas enregistrer plus de 5 adresses",
        variant: "destructive"
      });
      return;
    }

    // Formatage du numéro de téléphone avec le code pays
    const formattedPhone = `+${getCountryCallingCode(countryCode as CountryCode)}${newAddress.phone}`;

    try {
      const response = await fetch(`${BASE_URL}/api/user/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({
          ...newAddress,
          phone: formattedPhone,
          coordinates: coordinates
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Adresse ajoutée avec succès"
        });
        setShowAddForm(false);
        handleReload();
      }
    } catch (error: unknown) {
      void error;
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
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
    } catch (error: unknown) {
      void error;
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'adresse",
        variant: "destructive"
      });
      console.error('Erreur:', error);
    }
  };

  // Fonction pour obtenir le drapeau emoji
  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mes adresses</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAddresses} 
            disabled={isReloading}
            className="w-full sm:w-auto"
          >
            Actualiser
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une adresse
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid gap-2">
                <Label>Téléphone</Label>
                <div className="flex gap-2">
                  <Select 
                    value={countryCode} 
                    onValueChange={(value) => setCountryCode(value as CountryCode)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          <span className="flex items-center gap-2">
                            <span>{getFlagEmoji(country)}</span>
                            <span>{country}</span>
                            <span className="text-gray-500">
                              +{getCountryCallingCode(country as CountryCode)}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder="Numéro de téléphone"
                    required
                  />
                </div>
                {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
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

              <div className="grid gap-2">
                <Label htmlFor="instructions">Instructions de livraison (optionnel)</Label>
                <textarea
                  id="instructions"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newAddress.instructions}
                  onChange={(e) => setNewAddress({...newAddress, instructions: e.target.value})}
                />
              </div>

              <div className="grid gap-2">
                <Label>Localisation</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      "Localisation en cours..."
                    ) : (
                      <>
                        <MapPin className="h-4 w-4 mr-2" />
                        Obtenir ma position
                      </>
                    )}
                  </Button>
                  {coordinates.latitude && coordinates.longitude && (
                    <span className="text-sm text-muted-foreground">
                      {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                  }}
                  className="w-full sm:w-auto"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  className="w-full sm:w-auto"
                >
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
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4 w-full">
                  <MapPin className="h-5 w-5 mt-1 text-muted-foreground hidden sm:block" />
                  <div className="flex-1">
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
                <div className="flex justify-end gap-2 w-full sm:w-auto">
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