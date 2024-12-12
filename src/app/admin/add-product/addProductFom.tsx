"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
const BASE_URL = "http://localhost:5000/api";

const AddProductForm = () => {
  const [currentSeller, setCurrentSeller] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/adminLogin';
          return;
        }

        const response = await fetch(`${BASE_URL}/seller/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentSeller(data.sellerId);
        } else {
          window.location.href = '/adminLogin';
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        window.location.href = '/adminLogin';
      }
    };

    checkAuth();
  }, []);

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
    sellerId: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      try {
        const base64Promises = Array.from(files).map(file => convertToBase64(file));
        const base64Results = await Promise.all(base64Promises);
        
        setUploadedImages(prev => [...prev, ...base64Results]);
        setProduct(prev => ({
          ...prev,
          images: [...uploadedImages, ...base64Results].join(',')
        }));
      } catch (error) {
        console.error("Erreur lors du téléchargement des images:", error);
        setErrorMessage("Erreur lors du téléchargement des images.");
      }
    }
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        setUploadedImages(prev => [...prev, base64Image]);
        setProduct(prev => ({
          ...prev,
          images: [...uploadedImages, base64Image].join(',')
        }));
      } catch (error) {
        console.error("Erreur lors de la capture d'image:", error);
        setErrorMessage("Erreur lors de la capture d'image.");
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setProduct(prev => ({
      ...prev,
      images: newImages.join(',')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSeller) {
      setErrorMessage("Erreur: Vendeur non authentifié");
      return;
    }

    const formattedProduct = {
      ...product,
      sellerId: currentSeller,
      price: parseFloat(product.price),
      oldPrice: parseFloat(product.oldPrice),
      discount: parseFloat(product.discount),
      features: product.features.split(","),
      shippingInfo: product.shippingInfo.split(",").map((info) => ({
        type: info.split(":")[0].trim(),
        details: info.split(":")[1]?.trim(),
      })),
      images: uploadedImages,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/product/new-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedProduct),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'ajout du produit");
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
        sellerId: currentSeller || "",
      });
      setUploadedImages([]);

    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Erreur lors de l'ajout du produit.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {!currentSeller ? (
        <div className="text-center py-4">
          <p className="text-red-600">Chargement... Si cette page ne se charge pas, veuillez vous connecter.</p>
        </div>
      ) : (
        <>
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
                <option value="pices">Épices</option>
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

            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Images du produit
              </label>
              
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Télécharger des images
                </button>
                
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Prendre une photo
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />

              <input
                type="file"
                ref={cameraInputRef}
                onChange={handleCameraCapture}
                accept="image/*"
                capture="environment"
                className="hidden"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                      width={100}
                      height={100}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
            >
              Ajouter le produit
            </button>
          </form>

          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </>
      )}
    </div>
  );
};

export default AddProductForm;
