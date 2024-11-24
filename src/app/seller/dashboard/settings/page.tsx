// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   //  Eye, EyeOff, 
//   Store, Shield, Bell, Truck, Banknote } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// export default function SellerSettingsPage() {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   // const [showPassword, setShowPassword] = useState(false);

//   const [storeData, setStoreData] = useState({
//     storeName: "",
//     description: "",
//     address: "",
//     phone: "",
//     email: "",
//     category: "",
//     taxNumber: "",
//     rccmNumber: "",
//   });

//   const [deliverySettings, setDeliverySettings] = useState({
//     localDelivery: true,
//     nationalDelivery: false,
//     internationalDelivery: false,
//     freeDeliveryThreshold: "",
//     deliveryFees: {
//       local: "",
//       national: "",
//       international: "",
//     },
//   });

//   const [paymentSettings, setPaymentSettings] = useState({
//     bankName: "",
//     accountNumber: "",
//     accountHolder: "",
//     mobileMoneyNumber: "",
//     acceptCashOnDelivery: true,
//     acceptMobileMoney: true,
//     acceptBankTransfer: false,
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [notificationSettings, setNotificationSettings] = useState({
//     orderNotifications: true,
//     stockAlerts: true,
//     promotionalEmails: false,
//     deliveryUpdates: true,
//   });

//   useEffect(() => {
//     const fetchStoreProfile = async () => {
//       try {
//         const response = await fetch("/api/seller/profile");
//         if (!response.ok) throw new Error("Erreur lors du chargement du profil");
//         const data = await response.json();
//         setStoreData(data.store);
//         setDeliverySettings(data.delivery);
//         setPaymentSettings(data.payment);
//       } catch (error) {
//         toast({
//           title: "Erreur",
//           description: "Impossible de charger les informations de la boutique",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchStoreProfile();
//   }, []);

//   const handleStoreUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       // Simulation d'appel API
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       toast({
//         title: "Succès",
//         description: "Les informations de la boutique ont été mises à jour",
//       });
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible de mettre à jour les informations",
//         variant: "destructive",
//       });
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeliveryUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/seller/delivery", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(deliverySettings),
//       });
      
//       if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      
//       toast({
//         title: "Succès",
//         description: "Paramètres de livraison mis à jour",
//       });
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Échec de la mise à jour des paramètres de livraison",
//         variant: "destructive",
//       });
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/seller/payment", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(paymentSettings),
//       });
      
//       if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      
//       toast({
//         title: "Succès",
//         description: "Paramètres de paiement mis à jour",
//       });
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Échec de la mise à jour des paramètres de paiement",
//         variant: "destructive",
//       });
//       console.log(error);
      
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
      
//       <Tabs defaultValue="store">
//         <TabsList className="mb-6">
//           <TabsTrigger value="store" className="flex items-center gap-2">
//             <Store className="h-4 w-4" />
//             Boutique
//           </TabsTrigger>
//           <TabsTrigger value="delivery" className="flex items-center gap-2">
//             <Truck className="h-4 w-4" />
//             Livraison
//           </TabsTrigger>
//           <TabsTrigger value="payment" className="flex items-center gap-2">
//             <Banknote className="h-4 w-4" />
//             Paiement
//           </TabsTrigger>
//           <TabsTrigger value="security" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Sécurité
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="flex items-center gap-2">
//             <Bell className="h-4 w-4" />
//             Notifications
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="store">
//           <Card>
//             <CardHeader>
//               <CardTitle>Informations de la boutique</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleStoreUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="storeName">Nom de la boutique</Label>
//                     <Input
//                       id="storeName"
//                       value={storeData.storeName}
//                       onChange={(e) => setStoreData({...storeData, storeName: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email professionnel</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={storeData.email}
//                       onChange={(e) => setStoreData({...storeData, email: e.target.value})}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <textarea
//                     id="description"
//                     className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     value={storeData.description}
//                     onChange={(e) => setStoreData({...storeData, description: e.target.value})}
//                   />
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="delivery">
//           <Card>
//             <CardHeader>
//               <CardTitle>Paramètres de livraison</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleDeliveryUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="localDelivery">Livraison locale</Label>
//                     <Switch
//                       id="localDelivery"
//                       checked={deliverySettings.localDelivery}
//                       onCheckedChange={(value) => handleDeliveryUpdate("localDelivery", value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="nationalDelivery">Livraison nationale</Label>
//                     <Switch
//                       id="nationalDelivery"
//                       checked={deliverySettings.nationalDelivery}
//                       onCheckedChange={(value) => handleDeliveryUpdate("nationalDelivery", value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="internationalDelivery">Livraison internationale</Label>
//                     <Switch
//                       id="internationalDelivery"
//                       checked={deliverySettings.internationalDelivery}
//                       onCheckedChange={(value) => handleDeliveryUpdate("internationalDelivery", value)}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="freeDeliveryThreshold">Seuil de livraison gratuite</Label>
//                     <Input
//                       id="freeDeliveryThreshold"
//                       type="number"
//                       value={deliverySettings.freeDeliveryThreshold}
//                       onChange={(e) => setDeliverySettings({...deliverySettings, freeDeliveryThreshold: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="localDeliveryFees">Frais de livraison locale</Label>
//                     <Input
//                       id="localDeliveryFees"
//                       type="number"
//                       value={deliverySettings.deliveryFees.local}
//                       onChange={(e) => setDeliverySettings({...deliverySettings, deliveryFees: {...deliverySettings.deliveryFees, local: e.target.value}})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="nationalDeliveryFees">Frais de livraison nationale</Label>
//                     <Input
//                       id="nationalDeliveryFees"
//                       type="number"
//                       value={deliverySettings.deliveryFees.national}
//                       onChange={(e) => setDeliverySettings({...deliverySettings, deliveryFees: {...deliverySettings.deliveryFees, national: e.target.value}})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="internationalDeliveryFees">Frais de livraison internationale</Label>
//                     <Input
//                       id="internationalDeliveryFees"
//                       type="number"
//                       value={deliverySettings.deliveryFees.international}
//                       onChange={(e) => setDeliverySettings({...deliverySettings, deliveryFees: {...deliverySettings.deliveryFees, international: e.target.value}})}
//                     />
//                   </div>
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="payment">
//           <Card>
//             <CardHeader>
//               <CardTitle>Paramètres de paiement</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handlePaymentUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="bankName">Nom de la banque</Label>
//                     <Input
//                       id="bankName"
//                       value={paymentSettings.bankName}
//                       onChange={(e) => setPaymentSettings({...paymentSettings, bankName: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="accountNumber">Numéro de compte</Label>
//                     <Input
//                       id="accountNumber"
//                       value={paymentSettings.accountNumber}
//                       onChange={(e) => setPaymentSettings({...paymentSettings, accountNumber: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="accountHolder">Titulaire du compte</Label>
//                     <Input
//                       id="accountHolder"
//                       value={paymentSettings.accountHolder}
//                       onChange={(e) => setPaymentSettings({...paymentSettings, accountHolder: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="mobileMoneyNumber">Numéro de mobile money</Label>
//                     <Input
//                       id="mobileMoneyNumber"
//                       value={paymentSettings.mobileMoneyNumber}
//                       onChange={(e) => setPaymentSettings({...paymentSettings, mobileMoneyNumber: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="acceptCashOnDelivery">Acceptation du paiement en espèces</Label>
//                     <Switch
//                       id="acceptCashOnDelivery"
//                       checked={paymentSettings.acceptCashOnDelivery}
//                       onCheckedChange={(value) => setPaymentSettings({...paymentSettings, acceptCashOnDelivery: value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="acceptMobileMoney">Acceptation du paiement en mobile money</Label>
//                     <Switch
//                       id="acceptMobileMoney"
//                       checked={paymentSettings.acceptMobileMoney}
//                       onCheckedChange={(value) => setPaymentSettings({...paymentSettings, acceptMobileMoney: value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="acceptBankTransfer">Acceptation du paiement par virement bancaire</Label>
//                     <Switch
//                       id="acceptBankTransfer"
//                       checked={paymentSettings.acceptBankTransfer}
//                       onCheckedChange={(value) => setPaymentSettings({...paymentSettings, acceptBankTransfer: value})}
//                     />
//                   </div>
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security">
//           <Card>
//             <CardHeader>
//               <CardTitle>Sécurité</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleStoreUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="currentPassword">Mot de passe actuel</Label>
//                     <Input
//                       id="currentPassword"
//                       type="password"
//                       value={passwordData.currentPassword}
//                       onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="newPassword">Nouveau mot de passe</Label>
//                     <Input
//                       id="newPassword"
//                       type="password"
//                       value={passwordData.newPassword}
//                       onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
//                     <Input
//                       id="confirmPassword"
//                       type="password"
//                       value={passwordData.confirmPassword}
//                       onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
//                     />
//                   </div>
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="notifications">
//           <Card>
//             <CardHeader>
//               <CardTitle>Notifications</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleStoreUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="orderNotifications">Notifications de commande</Label>
//                     <Switch
//                       id="orderNotifications"
//                       checked={notificationSettings.orderNotifications}
//                       onCheckedChange={(value) => setNotificationSettings({...notificationSettings, orderNotifications: value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="stockAlerts">Alertes de stock</Label>
//                     <Switch
//                       id="stockAlerts"
//                       checked={notificationSettings.stockAlerts}
//                       onCheckedChange={(value) => setNotificationSettings({...notificationSettings, stockAlerts: value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="promotionalEmails">Emails promotionnels</Label>
//                     <Switch
//                       id="promotionalEmails"
//                       checked={notificationSettings.promotionalEmails}
//                       onCheckedChange={(value) => setNotificationSettings({...notificationSettings, promotionalEmails: value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="deliveryUpdates">Mises à jour de livraison</Label>
//                     <Switch
//                       id="deliveryUpdates"
//                       checked={notificationSettings.deliveryUpdates}
//                       onCheckedChange={(value) => setNotificationSettings({...notificationSettings, deliveryUpdates: value})}
//                     />
//                   </div>
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// } 


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { Store, Shield, Bell, Truck, Banknote } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// export default function SellerSettingsPage() {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const [storeData, setStoreData] = useState({
//     storeName: "",
//     description: "",
//     address: "",
//     phone: "",
//     email: "",
//     category: "",
//     taxNumber: "",
//     rccmNumber: "",
//   });

//   const [deliverySettings, setDeliverySettings] = useState({
//     localDelivery: true,
//     nationalDelivery: false,
//     internationalDelivery: false,
//     freeDeliveryThreshold: "",
//     deliveryFees: {
//       local: "",
//       national: "",
//       international: "",
//     },
//   });

//   const [paymentSettings, setPaymentSettings] = useState({
//     bankName: "",
//     accountNumber: "",
//     accountHolder: "",
//     mobileMoneyNumber: "",
//     acceptCashOnDelivery: true,
//     acceptMobileMoney: true,
//     acceptBankTransfer: false,
//   });

//   const [notificationSettings, setNotificationSettings] = useState({
//     orderNotifications: true,
//     stockAlerts: true,
//     promotionalEmails: false,
//     deliveryUpdates: true,
//   });

//   // Fonction pour récupérer les données de la boutique
//   const fetchStoreProfile = useCallback(async () => {
//     try {
//       const response = await fetch("/api/seller/profile");
//       if (!response.ok) throw new Error("Erreur lors du chargement du profil");
//       const data = await response.json();
//       setStoreData(data.store);
//       setDeliverySettings(data.delivery);
//       setPaymentSettings(data.payment);
//     } catch (err) {
//       console.error(err); // Affiche l'erreur pour le débogage
//       toast({
//         title: "Erreur",
//         description: "Impossible de charger les informations de la boutique",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);

//   useEffect(() => {
//     fetchStoreProfile();
//   }, [fetchStoreProfile]);

//   const handleStoreUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulation d'appel API
//       toast({
//         title: "Succès",
//         description: "Les informations de la boutique ont été mises à jour",
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Erreur",
//         description: "Impossible de mettre à jour les informations",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeliveryUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/seller/delivery", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(deliverySettings),
//       });
//       if (!response.ok) throw new Error("Erreur lors de la mise à jour");
//       toast({
//         title: "Succès",
//         description: "Paramètres de livraison mis à jour",
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Erreur",
//         description: "Échec de la mise à jour des paramètres de livraison",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/seller/payment", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(paymentSettings),
//       });
//       if (!response.ok) throw new Error("Erreur lors de la mise à jour");
//       toast({
//         title: "Succès",
//         description: "Paramètres de paiement mis à jour",
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Erreur",
//         description: "Échec de la mise à jour des paramètres de paiement",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>
//       <Tabs defaultValue="store">
//         <TabsList className="mb-6">
//           <TabsTrigger value="store" className="flex items-center gap-2">
//             <Store className="h-4 w-4" />
//             Boutique
//           </TabsTrigger>
//           <TabsTrigger value="delivery" className="flex items-center gap-2">
//             <Truck className="h-4 w-4" />
//             Livraison
//           </TabsTrigger>
//           <TabsTrigger value="payment" className="flex items-center gap-2">
//             <Banknote className="h-4 w-4" />
//             Paiement
//           </TabsTrigger>
//           <TabsTrigger value="security" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Sécurité
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="flex items-center gap-2">
//             <Bell className="h-4 w-4" />
//             Notifications
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="store">
//           <Card>
//             <CardHeader>
//               <CardTitle>Informations de la boutique</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleStoreUpdate} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="storeName">Nom de la boutique</Label>
//                     <Input
//                       id="storeName"
//                       value={storeData.storeName}
//                       onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email professionnel</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={storeData.email}
//                       onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <textarea
//                     id="description"
//                     className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     value={storeData.description}
//                     onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
//                   />
//                 </div>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? "Mise à jour..." : "Sauvegarder les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page