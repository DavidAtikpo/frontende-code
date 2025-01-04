"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { 
  Store, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Smartphone,
  Mail,
  Building,
  Clock,
  Globe,
  Image as ImageIcon,
  Upload,
  X,
  Lock,
  Key,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("business");
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Appel API pour sauvegarder les paramètres
      toast({
        title: "Succès",
        description: "Vos paramètres ont été mis à jour",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres de votre boutique
          </p>
        </div>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          disabled={isLoading}
        >
          Sauvegarder les modifications
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
          <TabsTrigger 
            value="business"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Store className="h-4 w-4 mr-2" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger 
            value="payments"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="business">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid gap-6 grid-cols-1 md:grid-cols-2"
            >
              <Card className="col-span-2">
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-store.jpg" />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Logo de l'entreprise</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Changer
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="col-span-2">
                <div className="p-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'entreprise</Label>
                      <Input {...register("businessName")} placeholder="Votre entreprise" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        {...register("description")} 
                        placeholder="Décrivez votre entreprise..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Email professionnel</Label>
                        <Input 
                          {...register("email")} 
                          type="email"
                          placeholder="contact@entreprise.com" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input 
                          {...register("phone")} 
                          type="tel"
                          placeholder="+229 XX XX XX XX" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="col-span-2">
                <div className="p-6 space-y-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horaires d'ouverture
                  </h3>
                  
                  {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <Switch {...register(`openingHours.${day}.isOpen`)} />
                      <span className="w-24">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          className="w-32"
                          {...register(`openingHours.${day}.open`)}
                        />
                        <span>à</span>
                        <Input
                          type="time"
                          className="w-32"
                          {...register(`openingHours.${day}.close`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="payments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid gap-6"
            >
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Méthodes de paiement acceptées</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mobile Money</p>
                          <p className="text-sm text-muted-foreground">MTN, Moov, Wave</p>
                        </div>
                      </div>
                      <Switch {...register('paymentMethods.mobileMoney')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Virement bancaire</p>
                          <p className="text-sm text-muted-foreground">Transfert direct sur compte</p>
                        </div>
                      </div>
                      <Switch {...register('paymentMethods.bankTransfer')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Paiement à la livraison</p>
                          <p className="text-sm text-muted-foreground">Espèces uniquement</p>
                        </div>
                      </div>
                      <Switch {...register('paymentMethods.cashOnDelivery')} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Informations bancaires</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Nom de la banque</Label>
                      <Input {...register('bankDetails.bankName')} placeholder="Ex: ECOBANK" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Numéro de compte</Label>
                      <Input {...register('bankDetails.accountNumber')} placeholder="XXXX XXXX XXXX XXXX" />
                    </div>

                    <div className="space-y-2">
                      <Label>Titulaire du compte</Label>
                      <Input {...register('bankDetails.accountHolder')} placeholder="Nom complet" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Mobile Money</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label>Numéro principal</Label>
                      <Input {...register('mobileMoneyNumber')} placeholder="+229 XX XX XX XX" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Opérateur</Label>
                      <Select {...register('mobileMoneyOperator')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un opérateur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mtn">MTN</SelectItem>
                          <SelectItem value="moov">Moov</SelectItem>
                          <SelectItem value="wave">Wave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid gap-6"
            >
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Notifications par email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Nouvelles commandes</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir une notification pour chaque nouvelle commande
                        </p>
                      </div>
                      <Switch {...register('notifications.email.newOrders')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Paiements reçus</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications des paiements confirmés
                        </p>
                      </div>
                      <Switch {...register('notifications.email.payments')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stock faible</p>
                        <p className="text-sm text-muted-foreground">
                          Alertes quand le stock est bas
                        </p>
                      </div>
                      <Switch {...register('notifications.email.lowStock')} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Notifications SMS</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Commandes urgentes</p>
                        <p className="text-sm text-muted-foreground">
                          SMS pour les commandes prioritaires
                        </p>
                      </div>
                      <Switch {...register('notifications.sms.urgentOrders')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertes de sécurité</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications des connexions suspectes
                        </p>
                      </div>
                      <Switch {...register('notifications.sms.security')} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Notifications push</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Messages clients</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications instantanées des messages
                        </p>
                      </div>
                      <Switch {...register('notifications.push.messages')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activité du compte</p>
                        <p className="text-sm text-muted-foreground">
                          Suivi en temps réel de l'activité
                        </p>
                      </div>
                      <Switch {...register('notifications.push.activity')} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="grid gap-6"
            >
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Authentification à deux facteurs
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activer la 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Sécurisez votre compte avec une authentification supplémentaire
                        </p>
                      </div>
                      <Switch {...register('security.twoFactorAuth')} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Validation par SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Recevoir un code par SMS lors de la connexion
                        </p>
                      </div>
                      <Switch {...register('security.smsValidation')} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-500" />
                    Connexions et appareils
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alertes de connexion</p>
                        <p className="text-sm text-muted-foreground">
                          Notifications pour les nouvelles connexions
                        </p>
                      </div>
                      <Switch {...register('security.loginAlerts')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Appareils de confiance</p>
                        <p className="text-sm text-muted-foreground">
                          Gérer les appareils autorisés
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Gérer
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Key className="h-5 w-5 text-yellow-500" />
                    Mot de passe et récupération
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium mb-2">Changer le mot de passe</p>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label>Mot de passe actuel</Label>
                          <Input type="password" {...register('security.currentPassword')} />
                        </div>
                        <div className="space-y-2">
                          <Label>Nouveau mot de passe</Label>
                          <Input type="password" {...register('security.newPassword')} />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirmer le mot de passe</Label>
                          <Input type="password" {...register('security.confirmPassword')} />
                        </div>
                        <Button className="w-full" variant="outline">
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <p className="font-medium mb-4">Options de récupération</p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Email de récupération</p>
                            <p className="text-sm text-muted-foreground">
                              {watch('security.recoveryEmail') || 'Non configuré'}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">Modifier</Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Numéro de téléphone</p>
                            <p className="text-sm text-muted-foreground">
                              {watch('security.recoveryPhone') || 'Non configuré'}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">Modifier</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

