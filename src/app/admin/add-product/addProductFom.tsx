// "use client";

// import React, { useState } from "react";

// const BASE_URL = "http://localhost:5000/api";

// const AddProductForm = () => {
//   const [product, setProduct] = useState({
//     title: "",
//     sku: "",
//     vendor: "",
//     price: "",
//     oldPrice: "",
//     discount: "",
//     category: "",
//     availability: "Disponible",
//     description: "",
//     features: "",
//     shippingInfo: "",
//     images: "",
//   });

//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProduct({ ...product, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formattedProduct = {
//       ...product,
//       price: parseFloat(product.price),
//       oldPrice: parseFloat(product.oldPrice),
//       discount: parseFloat(product.discount),
//       features: product.features.split(","), // Convertir en tableau
//       shippingInfo: product.shippingInfo.split(",").map((info) => ({
//         type: info.split(":")[0].trim(),
//         details: info.split(":")[1]?.trim(),
//       })), // Convertir en tableau d'objets
//       images: product.images.split(","), // Convertir en tableau
//     };

//     try {
//       const response = await fetch(`${BASE_URL}/product/new-product`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formattedProduct),
//       });

//       if (!response.ok) {
//         throw new Error("Erreur lors de l'ajout du produit");
//       }

//       setSuccessMessage("Produit ajouté avec succès !");
//       setErrorMessage("");
//       setProduct({
//         title: "",
//         sku: "",
//         vendor: "",
//         price: "",
//         oldPrice: "",
//         discount: "",
//         category: "",
//         availability: "Disponible",
//         description: "",
//         features: "",
//         shippingInfo: "",
//         images: "",
//       });
//     } catch (error) {
//       console.error(error);
//       setErrorMessage("Erreur lors de l'ajout du produit.");
//       setSuccessMessage("");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-4">Ajouter un Produit</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="title"
//             value={product.title}
//             onChange={handleInputChange}
//             placeholder="Titre"
//             required
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="text"
//             name="sku"
//             value={product.sku}
//             onChange={handleInputChange}
//             placeholder="SKU (Référence)"
//             required
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="text"
//             name="vendor"
//             value={product.vendor}
//             onChange={handleInputChange}
//             placeholder="Vendeur"
//             required
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="number"
//             name="price"
//             value={product.price}
//             onChange={handleInputChange}
//             placeholder="Prix"
//             required
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="number"
//             name="oldPrice"
//             value={product.oldPrice}
//             onChange={handleInputChange}
//             placeholder="Ancien Prix"
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="number"
//             name="discount"
//             value={product.discount}
//             onChange={handleInputChange}
//             placeholder="Remise (%)"
//             className="border rounded px-4 py-2"
//           />
//           <input
//             type="text"
//             name="category"
//             value={product.category}
//             onChange={handleInputChange}
//             placeholder="Catégorie"
//             required
//             className="border rounded px-4 py-2"
//           />
//           <select
//             name="availability"
//             value={product.availability}
//             onChange={handleInputChange}
//             className="border rounded px-4 py-2"
//           >
//             <option value="Disponible">Disponible</option>
//             <option value="Indisponible">Indisponible</option>
//           </select>
//         </div>

//         <textarea
//           name="description"
//           value={product.description}
//           onChange={handleInputChange}
//           placeholder="Description"
//           required
//           className="border rounded px-4 py-2 w-full mt-4"
//         ></textarea>

//         <textarea
//           name="features"
//           value={product.features}
//           onChange={handleInputChange}
//           placeholder="Caractéristiques (séparées par une virgule)"
//           className="border rounded px-4 py-2 w-full mt-4"
//         ></textarea>

//         <textarea
//           name="shippingInfo"
//           value={product.shippingInfo}
//           onChange={handleInputChange}
//           placeholder="Informations de Livraison (type:details, séparées par une virgule)"
//           className="border rounded px-4 py-2 w-full mt-4"
//         ></textarea>

//         <textarea
//           name="images"
//           value={product.images}
//           onChange={handleInputChange}
//           placeholder="URLs des images (séparées par une virgule)"
//           required
//           className="border rounded px-4 py-2 w-full mt-4"
//         ></textarea>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
//         >
//           Ajouter le produit
//         </button>
//       </form>

//       {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
//       {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
//     </div>
//   );
// };

// export default AddProductForm;


"use client";

import React, { useState } from "react";

const BASE_URL = "http://localhost:5000/api";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    title: "",
    sku: "",
    vendor: "",
    price: "",
    oldPrice: "",
    discount: "",
    category: "",
    availability: "Disponible",
    description: "",
    features: "",
    shippingInfo: "",
    images: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedProduct = {
      ...product,
      price: parseFloat(product.price),
      oldPrice: parseFloat(product.oldPrice),
      discount: parseFloat(product.discount),
      features: product.features.split(","), // Convertir en tableau
      shippingInfo: product.shippingInfo.split(",").map((info) => ({
        type: info.split(":")[0].trim(),
        details: info.split(":")[1]?.trim(),
      })), // Convertir en tableau d'objets
      images: product.images.split(","), // Convertir en tableau
    };

    try {
      const response = await fetch(`${BASE_URL}/product/new-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedProduct),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du produit");
      }

      setSuccessMessage("Produit ajouté avec succès !");
      setErrorMessage("");
      setProduct({
        title: "",
        sku: "",
        vendor: "",
        price: "",
        oldPrice: "",
        discount: "",
        category: "",
        availability: "Disponible",
        description: "",
        features: "",
        shippingInfo: "",
        images: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de l'ajout du produit.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Produit</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            placeholder="Titre"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleInputChange}
            placeholder="SKU (Référence)"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="text"
            name="vendor"
            value={product.vendor}
            onChange={handleInputChange}
            placeholder="Vendeur"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Prix"
            required
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="oldPrice"
            value={product.oldPrice}
            onChange={handleInputChange}
            placeholder="Ancien Prix"
            className="border rounded px-4 py-2"
          />
          <input
            type="number"
            name="discount"
            value={product.discount}
            onChange={handleInputChange}
            placeholder="Remise (%)"
            className="border rounded px-4 py-2"
          />
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            required
            className="border rounded px-4 py-2"
          >
            <option value="" disabled>
              -- Sélectionnez une catégorie --
            </option>
            <option value="Produit frais">Produit frais</option>
            <option value="Produit congelé">Produit congelé</option>
            <option value="Produit sec">Produit sec</option>
            <option value="Boissons">Boissons</option>
            <option value="Épices">Épices</option>
          </select>
          <select
            name="availability"
            value={product.availability}
            onChange={handleInputChange}
            className="border rounded px-4 py-2"
          >
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
          </select>
        </div>

        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="features"
          value={product.features}
          onChange={handleInputChange}
          placeholder="Caractéristiques (séparées par une virgule)"
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="shippingInfo"
          value={product.shippingInfo}
          onChange={handleInputChange}
          placeholder="Informations de Livraison (type:details, séparées par une virgule)"
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <textarea
          name="images"
          value={product.images}
          onChange={handleInputChange}
          placeholder="URLs des images (séparées par une virgule)"
          required
          className="border rounded px-4 py-2 w-full mt-4"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
        >
          Ajouter le produit
        </button>
      </form>

      {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default AddProductForm;
