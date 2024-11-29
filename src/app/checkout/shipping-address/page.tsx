// "use client";

// import React, { useState } from "react";
// import { useCartContext } from "../../context/CartContext";
// import { useRouter } from "next/navigation";
// const BASE_URL = "http://localhost:5000/api";

// const CheckoutPage = () => {
//   const { state} = useCartContext(); // Utilisation du contexte pour le panier
//   const [paymentMethod, setPaymentMethod] = useState<string | null>("Debit/Credit Card");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     companyName: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     email: "",
//     phone: "",
//     notes: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   // const router = useRouter();

//   // const handlePaymentMethodChange = (method: string) => {
//   //   setPaymentMethod(method);
//   // };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const calculateSubtotal = () =>
//     state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
//       alert("Veuillez remplir tous les champs obligatoires !");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Appel à l'API backend pour initier le paiement
//       const response = await fetch(`${BASE_URL}/api/webhook`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: calculateSubtotal(),
//           paymentMethod,
//           ...formData,
//           cart: state.cart,
//         }),
//       });

//       const data = await response.json();
//       if (data.checkoutUrl) {
//         // Redirige vers la page de paiement FedaPay
//         window.location.href = data.checkoutUrl;
//       } else {
//         alert("Erreur lors de l'initiation du paiement.");
//       }
//     } catch (error) {
//       console.error("Erreur :", error);
//       alert("Une erreur s'est produite lors du paiement.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Section Informations Client */}
//       <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-6">Informations</h2>

//         {/* Nom et Adresse */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="firstName"
//             placeholder="Prénom"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Nom"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <input
//           type="text"
//           name="companyName"
//           placeholder="Nom de l'entreprise (Facultatif)"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Adresse"
//           value={formData.address}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//           required
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="city"
//             placeholder="Ville"
//             value={formData.city}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="zipCode"
//             placeholder="Code postal"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Adresse email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Numéro de téléphone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <textarea
//           name="notes"
//           placeholder="Notes sur votre commande (optionnel)"
//           value={formData.notes}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-6"
//           rows={4}
//         ></textarea>

//         {/* Bouton de soumission */}
//         <button
//           type="submit"
//           className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={isLoading}
//         >
//           {isLoading ? "Traitement..." : "Passer la commande"}
//         </button>
//       </form>

//       {/* Récapitulatif du Panier */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
//         <ul className="divide-y divide-gray-200">
//           {state.cart.map((item) => (
//             <li key={item._id} className="py-4 flex items-center">
//               <img
//                 src={Array.isArray(item.images) ? item.images[0] : item.images}
//                 alt={item.title}
//                 className="w-16 h-16 rounded-md object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h4 className="text-sm font-bold">{item.title}</h4>
//                 <p className="text-sm text-gray-500">
//                   {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6">
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Sous-total</span>
//             <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Livraison</span>
//             <span className="text-sm font-bold">Gratuite</span>
//           </div>
//           <div className="flex justify-between border-t pt-2">
//             <span className="text-lg font-bold">Total</span>
//             <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


// "use client";

// import React, { useState } from "react";
// import { useCartContext } from "../../context/CartContext";
// import Image from "next/image";

// // const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = "https://dubon-server.vercel.app";

// const CheckoutPage = () => {
//   const { state } = useCartContext(); // Utilisation du contexte pour le panier
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     companyName: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     email: "",
//     phone: "",
//     notes: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const calculateSubtotal = () =>
//     state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");

//     if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
//       setErrorMessage("Veuillez remplir tous les champs obligatoires !");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Appel à l'API backend pour initier le paiement
//       const response = await fetch(`${BASE_URL}/webhook`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: calculateSubtotal(),
//           ...formData,
//           cart: state.cart,
//         }),
//       });

//       const data = await response.json();
//       if (data.checkoutUrl) {
//         // Redirige vers la page de paiement FedaPay
//         window.location.href = data.checkoutUrl;
//       } else {
//         setErrorMessage("Erreur lors de l'initiation du paiement.");
//       }
//     } catch (error) {
//       console.error("Erreur :", error);
//       setErrorMessage("Une erreur s'est produite lors du paiement.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Section Informations Client */}
//       <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-6">Informations</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="firstName"
//             placeholder="Prénom"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Nom"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <input
//           type="text"
//           name="companyName"
//           placeholder="Nom de l'entreprise (Facultatif)"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Adresse"
//           value={formData.address}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//           required
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="city"
//             placeholder="Ville"
//             value={formData.city}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="zipCode"
//             placeholder="Code postal"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Adresse email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Numéro de téléphone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <textarea
//           name="notes"
//           placeholder="Notes sur votre commande (optionnel)"
//           value={formData.notes}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-6"
//           rows={4}
//         ></textarea>

//         <button
//           type="submit"
//           className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <div className="flex items-center justify-center">
//               <span className="loader"></span> Traitement...
//             </div>
//           ) : (
//             "Passer la commande"
//           )}
//         </button>

//       </form>

//       {/* Récapitulatif du Panier */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
//         <ul className="divide-y divide-gray-200">
//           {state.cart.map((item) => (
//             <li key={item._id} className="py-4 flex items-center">
//               <Image
//                 src={Array.isArray(item.images) ? item.images[0] : item.images}
//                 alt={item.title || "Produit"}
//                 width={64}
//                 height={64}
//                 className="w-16 h-16 rounded-md object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h4 className="text-sm font-bold">{item.title}</h4>
//                 <p className="text-sm text-gray-500">
//                   {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6">
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Sous-total</span>
//             <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Livraison</span>
//             <span className="text-sm font-bold">Gratuite</span>
//           </div>
//           <div className="flex justify-between border-t pt-2">
//             <span className="text-lg font-bold">Total</span>
//             <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


// "use client";

// import React, { useState } from "react";
// import { useCartContext } from "../../context/CartContext";
// import Image from "next/image";

// const BASE_URL = "https://dubon-server.vercel.app";

// const CheckoutPage = () => {
//   const { state } = useCartContext(); // Utilisation du contexte pour le panier
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     companyName: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     email: "",
//     phone: "",
//     notes: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const calculateSubtotal = () =>
//     state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
//       setErrorMessage("Veuillez remplir tous les champs obligatoires !");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${BASE_URL}/webhook`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: calculateSubtotal(),
//           ...formData,
//           cart: state.cart,
//         }),
//       });

//       const data = await response.json();
//       if (data.checkoutUrl) {
//         // Redirige vers la page de paiement FedaPay
//         window.location.href = data.checkoutUrl;
//       } else {
//         throw new Error("Erreur lors de l'initiation du paiement.");
//       }
//     } catch (error) {
//       console.error("Erreur :", error);
//       setErrorMessage("Une erreur s'est produite lors du paiement.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Section Informations Client */}
//       <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-6">Informations</h2>

//         {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
//         {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="firstName"
//             placeholder="Prénom"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Nom"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <input
//           type="text"
//           name="companyName"
//           placeholder="Nom de l'entreprise (Facultatif)"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Adresse"
//           value={formData.address}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//           required
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="city"
//             placeholder="Ville"
//             value={formData.city}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="zipCode"
//             placeholder="Code postal"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Adresse email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Numéro de téléphone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <textarea
//           name="notes"
//           placeholder="Notes sur votre commande (optionnel)"
//           value={formData.notes}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-6"
//           rows={4}
//         ></textarea>

//         <button
//           type="submit"
//           className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={isLoading}
//         >
//           {isLoading ? "Traitement..." : "Passer la commande"}
//         </button>
//       </form>

//       {/* Récapitulatif du Panier */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
//         <ul className="divide-y divide-gray-200">
//           {state.cart.map((item) => (
//             <li key={item._id} className="py-4 flex items-center">
//               <Image
//                 src={Array.isArray(item.images) ? item.images[0] : item.images}
//                 alt={item.title || "Produit"}
//                 width={64}
//                 height={64}
//                 className="w-16 h-16 rounded-md object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h4 className="text-sm font-bold">{item.title}</h4>
//                 <p className="text-sm text-gray-500">
//                   {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6">
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Sous-total</span>
//             <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Livraison</span>
//             <span className="text-sm font-bold">Gratuite</span>
//           </div>
//           <div className="flex justify-between border-t pt-2">
//             <span className="text-lg font-bold">Total</span>
//             <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


// "use client";

// import React, { useState } from "react";
// import { useCartContext } from "../../context/CartContext";
// import Image from "next/image";

// // const BASE_URL = "https://dubon-server.vercel.app";

// const BASE_URL = "http://localhost:5000"

// const CheckoutPage = () => {
//   const { state } = useCartContext(); // Utilisation du contexte pour le panier
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     companyName: "",
//     address: "",
//     city: "",
//     zipCode: "",
//     email: "",
//     phone: "",
//     notes: "",
//   });
//   const [paymentMethod, setPaymentMethod] = useState("fedapay"); // Méthode de paiement
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const calculateSubtotal = () =>
//     state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");

//     if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
//       setErrorMessage("Veuillez remplir tous les champs obligatoires !");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${BASE_URL}/webhook`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: calculateSubtotal(),
//           ...formData,
//           paymentMethod, // Ajouter la méthode de paiement
//           cart: state.cart,
//         }),
//       });

//       const data = await response.json();
//       console.log('data',data);
      
//       if (data.checkoutUrl) {
//         // Redirige vers la page de paiement
//         window.location.href = data.checkoutUrl;
//       } else {
//         throw new Error("Erreur lors de l'initiation du paiement.");
//       }
//     } catch (error) {
//       console.error("Erreur :", error);
//       setErrorMessage("Une erreur s'est produite lors du paiement.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Section Informations Client */}
//       <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
//         <h2 className="text-2xl font-bold mb-6">Informations</h2>

//         {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
//         {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="firstName"
//             placeholder="Prénom"
//             value={formData.firstName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Nom"
//             value={formData.lastName}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <input
//           type="text"
//           name="companyName"
//           placeholder="Nom de l'entreprise (Facultatif)"
//           value={formData.companyName}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Adresse"
//           value={formData.address}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-4"
//           required
//         />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             name="city"
//             placeholder="Ville"
//             value={formData.city}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="zipCode"
//             placeholder="Code postal"
//             value={formData.zipCode}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//           />
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="email"
//             name="email"
//             placeholder="Adresse email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Numéro de téléphone"
//             value={formData.phone}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//             required
//           />
//         </div>
//         <textarea
//           name="notes"
//           placeholder="Notes sur votre commande (optionnel)"
//           value={formData.notes}
//           onChange={handleInputChange}
//           className="border p-2 rounded-md w-full mb-6"
//           rows={4}
//         ></textarea>

// {/* Section Méthode de Paiement */}
// <div className="mb-6">
//   <h3 className="text-lg font-bold mb-2">Méthode de paiement</h3>
//   <div className="flex gap-6">
//     {/* Option FedaPay */}
//     <label
//       className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
//         paymentMethod === "fedapay" ? "border-blue-600 bg-blue-50" : "border-gray-300"
//       }`}
//       onClick={() => setPaymentMethod("fedapay")}
//     >
//       <input
//         type="radio"
//         name="paymentMethod"
//         value="fedapay"
//         checked={paymentMethod === "fedapay"}
//         onChange={() => setPaymentMethod("fedapay")}
//         className="hidden"
//       />
//       <img
//         src="/image.png"
//         alt="FedaPay"
//         className="w-8 h-8"
//       />
//       <span className="font-medium text-gray-700">FedaPay</span>
//     </label>

//     {/* Option PayPal */}
//     <label
//       className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
//         paymentMethod === "paypal" ? "border-blue-600 bg-blue-50" : "border-gray-300"
//       }`}
//       onClick={() => setPaymentMethod("paypal")}
//     >
//       <input
//         type="radio"
//         name="paymentMethod"
//         value="paypal"
//         checked={paymentMethod === "paypal"}
//         onChange={() => setPaymentMethod("paypal")}
//         className="hidden"
//       />
//       <img
//         src="/icons/paypal-icon.png"
//         alt="PayPal"
//         className="w-8 h-8"
//       />
//       <span className="font-medium text-gray-700">PayPal</span>
//     </label>
//   </div>
// </div>


//         <button
//           type="submit"
//           className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
//             isLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={isLoading}
//         >
//           {isLoading ? "Traitement..." : "Passer la commande"}
//         </button>
//       </form>

//       {/* Récapitulatif du Panier */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
//         <ul className="divide-y divide-gray-200">
//           {state.cart.map((item) => (
//             <li key={item._id} className="py-4 flex items-center">
//               <Image
//                 src={Array.isArray(item.images) ? item.images[0] : item.images}
//                 alt={item.title || "Produit"}
//                 width={64}
//                 height={64}
//                 className="w-16 h-16 rounded-md object-cover mr-4"
//               />
//               <div className="flex-1">
//                 <h4 className="text-sm font-bold">{item.title}</h4>
//                 <p className="text-sm text-gray-500">
//                   {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
//                 </p>
//               </div>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6">
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Sous-total</span>
//             <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//           <div className="flex justify-between mb-2">
//             <span className="text-sm text-gray-600">Livraison</span>
//             <span className="text-sm font-bold">Gratuite</span>
//           </div>
//           <div className="flex justify-between border-t pt-2">
//             <span className="text-lg font-bold">Total</span>
//             <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import React, { useState } from "react";
import { useCartContext } from "../../context/CartContext";
import Image from "next/image";

const BASE_URL = "http://localhost:5000";

const CheckoutPage = () => {
  const { state } = useCartContext(); // Utilisation du contexte pour le panier
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    address: "",
    city: "",
    zipCode: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"fedapay" | "paypal">("fedapay"); // Méthode de paiement
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const calculateSubtotal = () =>
    state.cart.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation des champs obligatoires
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateSubtotal(),
          description: "Achat sur Dubon Services",
          cart: state.cart,
          email: formData.email,
          paymentMethod, // Ajouter la méthode de paiement
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Redirige vers la page de paiement
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Erreur lors de l'initialisation du paiement.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setErrorMessage("Une erreur s'est produite lors de l'initialisation du paiement. Réessayez plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Section Informations Client */}
      <form className="col-span-2 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6">Informations</h2>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nom"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <input
          type="text"
          name="companyName"
          placeholder="Nom de l'entreprise (Facultatif)"
          value={formData.companyName}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-4"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Code postal"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border p-2 rounded-md w-full"
            required
          />
        </div>
        <textarea
          name="notes"
          placeholder="Notes sur votre commande (optionnel)"
          value={formData.notes}
          onChange={handleInputChange}
          className="border p-2 rounded-md w-full mb-6"
          rows={4}
        ></textarea>

        {/* Section Méthode de Paiement */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Méthode de paiement</h3>
          <div className="flex gap-6">
            <label
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                paymentMethod === "fedapay" ? "border-blue-600 bg-blue-50" : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("fedapay")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="fedapay"
                checked={paymentMethod === "fedapay"}
                onChange={() => setPaymentMethod("fedapay")}
                className="hidden"
              />
              <Image src="/image.png" alt="FedaPay" className="w-8 h-8"
              width={64}
              height={64} />
              <span className="font-medium text-gray-700">FedaPay</span>
            </label>
            <label
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${
                paymentMethod === "paypal" ? "border-blue-600 bg-blue-50" : "border-gray-300"
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="hidden"
              />
              <Image src="/icons/paypal-icon.png" alt="PayPal" className="w-8 h-8"
              width={64}
              height={64}
              />
              <span className="font-medium text-gray-700">PayPal</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Traitement..." : "Passer la commande"}
        </button>
      </form>

      {/* Récapitulatif du Panier */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Panier à acheter</h2>
        <ul className="divide-y divide-gray-200">
          {state.cart.map((item) => (
            <li key={item._id} className="py-4 flex items-center">
              <Image
                src={Array.isArray(item.images) ? item.images[0] : item.images}
                alt={item.title || "Produit"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.finalPrice.toFixed(2)} FCFA
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Sous-total</span>
            <span className="text-sm font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Livraison</span>
            <span className="text-sm font-bold">Gratuite</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold">{calculateSubtotal().toFixed(2)} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
