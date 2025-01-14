"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getCookie } from 'cookies-next';
import { Loader2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

const { BASE_URL } = API_CONFIG;

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Valeurs par défaut pour les préférences
  const defaultPreferences = {
    language: 'fr',
    currency: 'XOF',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    newsletter: true
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getCookie('token');
        
        if (!token) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté",
            variant: "destructive"
          });
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }

        const { data } = await response.json();
        
        // Fusionner les préférences par défaut avec celles du serveur
        const mergedData = {
          ...data,
          preferences: {
            ...defaultPreferences,
            ...(data.preferences || {})
          }
        };
        
        setProfile(mergedData);
        setFormData(mergedData);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const handleSubmit = async () => {
    if (!formData) return;
    setIsSubmitting(true);
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setProfile(formData);
        setIsEditing(false);
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès"
        });
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setShowPreviewDialog(true);
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    setIsPhotoUploading(true);
    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);

    try {
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const { data } = await response.json();
        // Construire l'URL complète de l'avatar
        const avatarUrl = data.avatarUrl.startsWith('http') 
          ? data.avatarUrl 
          : `${BASE_URL}/uploads/${data.avatarUrl.replace(/^[\/\\]?uploads[\/\\]?/, '').replace(/\\/g, '/')}`;
        
        setProfile(prev => prev ? { ...prev, avatarUrl } : null);
        
        // Mettre à jour le localStorage avec la nouvelle URL
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const updatedUserData = {
            ...parsedUserData,
            profilePhotoUrl: avatarUrl
          };
          localStorage.setItem('userData', JSON.stringify(updatedUserData));
        }

        toast({
          title: "Succès",
          description: "Photo de profil mise à jour"
        });
        setShowPreviewDialog(false);
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la photo",
        variant: "destructive"
      });
    } finally {
      setIsPhotoUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setPreviewImage(null);
      setSelectedFile(null);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Mot de passe mis à jour avec succès"
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le mot de passe",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferenceUpdate = async (key: string, value: string | boolean | Record<string, boolean>) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`
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
          title: "Succès",
          description: "Préférences mises à jour"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle>Informations personnelles</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="flex-1 sm:flex-none"
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
              {isEditing && (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="relative">
                {profile?.avatarUrl ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <iframe
                      src={profile.avatarUrl}
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-500">
                      {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-medium">{profile?.name}</h3>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input 
                  id="name" 
                  value={formData?.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData?.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData?.phoneNumber || ''} 
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Langue</Label>
                <Select
                  value={profile?.preferences?.language || defaultPreferences.language}
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
                  value={profile?.preferences?.currency || defaultPreferences.currency}
                  onValueChange={(value) => handlePreferenceUpdate('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XOF">FCFA</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Thème</Label>
                <Select
                  value={profile?.preferences?.theme || defaultPreferences.theme}
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

            <div className="space-y-4 mt-6">
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

            <div className="flex items-center justify-between mt-6">
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

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Mot de passe actuel</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                />
              </div>
              <Button onClick={handlePasswordChange}>
                Mettre à jour le mot de passe
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>Authentification à deux facteurs</Label>
              <div className="flex items-center gap-4">
                <Button variant="outline">Configurer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Prévisualisation de la photo</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="relative w-full aspect-square">
              <Image
                src={previewImage}
                alt="Prévisualisation"
                width={300}
                height={300}
                className="object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowPreviewDialog(false);
                setPreviewImage(null);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handlePhotoUpload}
              disabled={isPhotoUploading}
            >
              {isPhotoUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Enregistrer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}