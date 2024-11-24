"use client";

import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const BASE_URL = "http://localhost:5000/api";

export default function SettingsPage() {
  const [personalInfo, setPersonalInfo] = useState({
    avatar: null as File | null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState("");
  const [success] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPersonalInfo({ ...personalInfo, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API implementation à venir
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API implementation à venir
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                <div className="flex items-center space-x-4">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200" />
                  )}
                  <div>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('avatar')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Changer la photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    required
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && <div className="text-sm text-green-600">{success}</div>}

                <Button
                  type="submit"
                  className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
                  disabled={isLoading}
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="8+ caractères"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
                {success && <div className="text-sm text-green-600">{success}</div>}

                <Button
                  type="submit"
                  className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
                  disabled={isLoading}
                >
                  {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 

// "use client";

// import { useState } from "react";
// import {  Upload } from "lucide-react";
// import Image from "next/image"; // Importation de `Image`
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function SettingsPage() {
//   const [personalInfo, setPersonalInfo] = useState({
//     avatar: null as File | null,
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   // const [showNewPassword, setShowNewPassword] = useState(false);
//   // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading] = useState(false);
//   const [error] = useState("");
//   const [success] = useState("");
//   const [avatarPreview, setAvatarPreview] = useState<string>("");

//   const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
//   };

//   // const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
//   // };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setPersonalInfo({ ...personalInfo, avatar: file });
//       setAvatarPreview(URL.createObjectURL(file));
//     }
//   };

//   const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // API implementation à venir
//   };

//   // const handlePasswordSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   // API implementation à venir
//   // };

//   return (
//     <div className="container max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>

//       <Tabs defaultValue="personal" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
//           <TabsTrigger value="security">Sécurité</TabsTrigger>
//         </TabsList>

//         <TabsContent value="personal">
//           <Card>
//             <CardContent className="pt-6">
//               <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
//                 <div className="flex items-center space-x-4">
//                   {avatarPreview ? (
//                     <Image
//                       src={avatarPreview}
//                       alt="Avatar preview"
//                       width={96} // Correspond à 24 * 4
//                       height={96} // Correspond à 24 * 4
//                       className="w-24 h-24 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-24 h-24 rounded-full bg-gray-200" />
//                   )}
//                   <div>
//                     <Input
//                       id="avatar"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleAvatarChange}
//                       className="hidden"
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => document.getElementById('avatar')?.click()}
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       Changer la photo
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">Prénom</Label>
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       value={personalInfo.firstName}
//                       onChange={handlePersonalInfoChange}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Nom</Label>
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       value={personalInfo.lastName}
//                       onChange={handlePersonalInfoChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Adresse email</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={personalInfo.email}
//                     onChange={handlePersonalInfoChange}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Téléphone</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={personalInfo.phone}
//                     onChange={handlePersonalInfoChange}
//                     required
//                   />
//                 </div>

//                 {error && <div className="text-sm text-red-600">{error}</div>}
//                 {success && <div className="text-sm text-green-600">{success}</div>}

//                 <Button
//                   type="submit"
//                   className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Contenu pour l'onglet de sécurité non modifié */}
//         {/* ... */}
//       </Tabs>
//     </div>
//   );
// }
