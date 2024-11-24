// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { SellerFormData } from "../page";

// interface PersonalInfoFormProps {
//   data: SellerFormData;
//   onUpdate: (data: SellerFormData) => void;
//   onNext: () => void;
//   isFirstStep: boolean;
// }

// export function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleChange = (field: string, value: string) => {
//     onUpdate({
//       ...data,
//       personalInfo: {
//         ...data.personalInfo,
//         [field]: value
//       }
//     });
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     const info = data.personalInfo;

//     if (data.type === "individual") {
//       if (!info.fullName) newErrors.fullName = "Le nom complet est requis";
//       if (!info.idNumber) newErrors.idNumber = "Le numéro d'identification est requis";
//     } else {
//       if (!info.companyName) newErrors.companyName = "La raison sociale est requise";
//       if (!info.rccmNumber) newErrors.rccmNumber = "Le numéro RCCM est requis";
//       if (!info.legalRepName) newErrors.legalRepName = "Le nom du représentant légal est requis";
//     }

//     if (!info.address) newErrors.address = "L'adresse est requise";
//     if (!info.phone) newErrors.phone = "Le numéro de téléphone est requis";
//     if (!info.email) newErrors.email = "L'email est requis";
//     if (!info.taxNumber) newErrors.taxNumber = "Le numéro IFU est requis";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onNext();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <RadioGroup
//           value={data.type}
//           onValueChange={(value: "individual" | "company") => 
//             onUpdate({ ...data, type: value })}
//           className="flex space-x-4"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="individual" id="individual" />
//             <Label htmlFor="individual">Personne physique</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="company" id="company" />
//             <Label htmlFor="company">Entreprise</Label>
//           </div>
//         </RadioGroup>

//         {data.type === "individual" ? (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="fullName">
//                 Nom complet <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="fullName"
//                 value={data.personalInfo.fullName || ""}
//                 onChange={(e) => handleChange("fullName", e.target.value)}
//                 error={errors.fullName}
//               />
//               {errors.fullName && (
//                 <p className="text-sm text-red-500">{errors.fullName}</p>
//               )}
//             </div>
//             {/* Autres champs pour personne physique */}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="companyName">
//                 Raison sociale <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="companyName"
//                 value={data.personalInfo.companyName || ""}
//                 onChange={(e) => handleChange("companyName", e.target.value)}
//                 error={errors.companyName}
//               />
//               {errors.companyName && (
//                 <p className="text-sm text-red-500">{errors.companyName}</p>
//               )}
//             </div>
//             {/* Autres champs pour entreprise */}
//           </div>
//         )}

//         {/* Champs communs */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* ... autres champs communs ... */}
//         </div>
//       </div>

//       <div className="flex justify-end space-x-4">
//         <Button
//           type="submit"
//           className="bg-[#1D4ED8] hover:bg-[#1e40af]"
//         >
//           Suivant
//         </Button>
//       </div>
//     </form>
//   );
// } 



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { SellerFormData } from "../page";

// interface PersonalInfoFormProps {
//   data: SellerFormData;
//   onUpdate: (data: SellerFormData) => void;
//   onNext: () => void;
//   isFirstStep: boolean;
// }

// export function PersonalInfoForm({ data, onUpdate, onNext }: PersonalInfoFormProps) {
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleChange = (field: string, value: string) => {
//     onUpdate({
//       ...data,
//       personalInfo: {
//         ...data.personalInfo,
//         [field]: value,
//       },
//     });
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};
//     const info = data.personalInfo;

//     if (data.type === "individual") {
//       if (!info.fullName) newErrors.fullName = "Le nom complet est requis";
//       if (!info.idNumber) newErrors.idNumber = "Le numéro d'identification est requis";
//     } else {
//       if (!info.companyName) newErrors.companyName = "La raison sociale est requise";
//       if (!info.rccmNumber) newErrors.rccmNumber = "Le numéro RCCM est requis";
//       if (!info.legalRepName) newErrors.legalRepName = "Le nom du représentant légal est requis";
//     }

//     if (!info.address) newErrors.address = "L'adresse est requise";
//     if (!info.phone) newErrors.phone = "Le numéro de téléphone est requis";
//     if (!info.email) newErrors.email = "L'email est requis";
//     if (!info.taxNumber) newErrors.taxNumber = "Le numéro IFU est requis";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onNext();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         {/* Radio pour choisir le type */}
//         <RadioGroup
//           value={data.type}
//           onValueChange={(value: "individual" | "company") =>
//             onUpdate({ ...data, type: value })
//           }
//           className="flex space-x-4"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="individual" id="individual" />
//             <Label htmlFor="individual">Personne physique</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="company" id="company" />
//             <Label htmlFor="company">Entreprise</Label>
//           </div>
//         </RadioGroup>

//         {/* Champs pour le type sélectionné */}
//         {data.type === "individual" ? (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="fullName">
//                 Nom complet <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="fullName"
//                 value={data.personalInfo.fullName || ""}
//                 onChange={(e) => handleChange("fullName", e.target.value)}
//               />
//               {errors.fullName && (
//                 <p className="text-sm text-red-500">{errors.fullName}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="idNumber">
//                 Numéro d&apos;identification <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="idNumber"
//                 value={data.personalInfo.idNumber || ""}
//                 onChange={(e) => handleChange("idNumber", e.target.value)}
//               />
//               {errors.idNumber && (
//                 <p className="text-sm text-red-500">{errors.idNumber}</p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="companyName">
//                 Raison sociale <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="companyName"
//                 value={data.personalInfo.companyName || ""}
//                 onChange={(e) => handleChange("companyName", e.target.value)}
//               />
//               {errors.companyName && (
//                 <p className="text-sm text-red-500">{errors.companyName}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="rccmNumber">
//                 Numéro RCCM <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="rccmNumber"
//                 value={data.personalInfo.rccmNumber || ""}
//                 onChange={(e) => handleChange("rccmNumber", e.target.value)}
//               />
//               {errors.rccmNumber && (
//                 <p className="text-sm text-red-500">{errors.rccmNumber}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="legalRepName">
//                 Nom du représentant légal <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="legalRepName"
//                 value={data.personalInfo.legalRepName || ""}
//                 onChange={(e) => handleChange("legalRepName", e.target.value)}
//               />
//               {errors.legalRepName && (
//                 <p className="text-sm text-red-500">{errors.legalRepName}</p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Champs communs */}
//         <div className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="address">Adresse</Label>
//             <Input
//               id="address"
//               value={data.personalInfo.address || ""}
//               onChange={(e) => handleChange("address", e.target.value)}
//             />
//             {errors.address && (
//               <p className="text-sm text-red-500">{errors.address}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="phone">Téléphone</Label>
//             <Input
//               id="phone"
//               value={data.personalInfo.phone || ""}
//               onChange={(e) => handleChange("phone", e.target.value)}
//             />
//             {errors.phone && (
//               <p className="text-sm text-red-500">{errors.phone}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               value={data.personalInfo.email || ""}
//               onChange={(e) => handleChange("email", e.target.value)}
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500">{errors.email}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="taxNumber">Numéro IFU</Label>
//             <Input
//               id="taxNumber"
//               value={data.personalInfo.taxNumber || ""}
//               onChange={(e) => handleChange("taxNumber", e.target.value)}
//             />
//             {errors.taxNumber && (
//               <p className="text-sm text-red-500">{errors.taxNumber}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-4">
//         <Button type="submit" className="bg-[#1D4ED8] hover:bg-[#1e40af]">
//           Suivant
//         </Button>
//       </div>
//     </form>
//   );
// }
