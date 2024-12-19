"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_CONFIG } from "@/utils/config";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const { BASE_URL } = API_CONFIG;

interface UserProfile {
  name: string;
  email: string;
  profile: {
    bio: string;
    phoneNumber: string;
    displayName: string;
    avatarUrl: string;
  };
  preferences: {
    language: string;
    currency: string;
    theme: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    newsletter: boolean;
  };
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceUpdate = async (key: string, value: string | boolean | Record<string, boolean>) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ [key]: value })
      });

      if (response.ok) {
        setProfile(prev => prev ? {
          ...prev,
          preferences: {
            ...prev.preferences,
            [key]: value
          }
        } : null);
        toast({
          title: "Préférences mises à jour",
          description: "Vos préférences ont été enregistrées avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Mon Profil</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.profile.avatarUrl} />
                <AvatarFallback>
                  {profile?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline">Changer la photo</Button>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={profile?.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile?.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profile?.profile.phoneNumber} 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio"
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={profile?.profile.bio}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Langue</Label>
                <Select
                  value={profile?.preferences.language}
                  onValueChange={(value) => handlePreferenceUpdate('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Devise</Label>
                <Select
                  value={profile?.preferences.currency}
                  onValueChange={(value) => handlePreferenceUpdate('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FCFA">FCFA</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Thème</Label>
                <Select
                  value={profile?.preferences.theme}
                  onValueChange={(value) => handlePreferenceUpdate('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif">Notifications par email</Label>
                  <Switch
                    id="email-notif"
                    checked={profile?.preferences.notifications.email}
                    onCheckedChange={(checked) => 
                      handlePreferenceUpdate('notifications', {
                        ...profile?.preferences.notifications,
                        email: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notif">Notifications push</Label>
                  <Switch
                    id="push-notif"
                    checked={profile?.preferences.notifications.push}
                    onCheckedChange={(checked) => 
                      handlePreferenceUpdate('notifications', {
                        ...profile?.preferences.notifications,
                        push: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notif">Notifications SMS</Label>
                  <Switch
                    id="sms-notif"
                    checked={profile?.preferences.notifications.sms}
                    onCheckedChange={(checked) => 
                      handlePreferenceUpdate('notifications', {
                        ...profile?.preferences.notifications,
                        sms: checked
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="newsletter">Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez nos dernières actualités et offres
                </p>
              </div>
              <Switch
                id="newsletter"
                checked={profile?.preferences.newsletter}
                onCheckedChange={(checked) => 
                  handlePreferenceUpdate('newsletter', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Mot de passe</Label>
              <div className="flex items-center gap-4">
                <Input type="password" value="••••••••" disabled />
                <Button variant="outline">Changer</Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Authentification à deux facteurs</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline">Configurer</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessions actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Liste des sessions actives */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chrome - Windows</p>
                  <p className="text-sm text-muted-foreground">
                    Dernière activité: il y a 2 minutes
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Déconnecter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 