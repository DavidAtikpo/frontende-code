"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface _SettingsData {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    language: string;
    currency: string;
  };
}

interface SettingUpdate {
  key: string;
  value: string | number | boolean;
}

interface SellerProfile {
  storeName?: string;
  description?: string;
  bankInfo?: string;
  data?: {
    [key: string]: any;
  };
}

export default function SellerSettings() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Charger le profil vendeur
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/seller/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const _handleUpdateSettings = (_updates: SettingUpdate) => {
    try {
      // ... logique de mise à jour ...
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res: Response = await fetch('/api/seller/profile', {
        method: 'PUT',
        body: formData
      });
      const responseData = await res.json();
      
      if (responseData.success) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès"
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la mise à jour du profil"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Paramètres du profil</h3>
        <p className="text-sm text-muted-foreground">
          Gérez vos informations personnelles et paramètres de boutique
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label>Photo de profil</label>
            <Input type="file" name="photo" accept="image/*" />
          </div>
          
          <div className="space-y-2">
            <label>Nom de la boutique</label>
            <Input 
              name="storeName"
              defaultValue={profile?.storeName}
              required
            />
          </div>

          <div className="space-y-2">
            <label>Description</label>
            <textarea
              name="description"
              className="w-full min-h-[100px] p-2 border rounded"
              defaultValue={profile?.description}
            />
          </div>

          <div className="space-y-2">
            <label>Informations bancaires</label>
            <Input
              name="bankInfo"
              defaultValue={profile?.bankInfo}
              placeholder="IBAN"
            />
          </div>
        </div>

        <Button type="submit">
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
} 

