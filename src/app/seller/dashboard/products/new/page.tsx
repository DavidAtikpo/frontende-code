"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { 
  FaCloudUploadAlt, 
  FaTrash, 
  FaTags, 
  FaBox,
  FaMoneyBillWave,
  FaInfoCircle,
  FaArrowLeft
} from "react-icons/fa";
import Image from "next/image";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

interface ProductFormData {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  sku: string;
  quantity: number;
  images: File[];
  availability: string;
  features: string[];
  specifications: Array<{
    name: string;
    value: string;
  }>;
}

const CATEGORIES = [
  "Électronique",
  "Mode",
  "Maison",
  "Sport",
  "Beauté",
  // Ajoutez vos catégories ici
];

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    shortDescription: "",
    description: "",
    price: 0,
    category: "",
    sku: "",
    quantity: 0,
    images: [],
    tags: [],
    features: [],
    specifications: [],
    availability: "in_stock"
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((image: File) => {
            formDataToSend.append('images', image);
          });
        } else if (typeof value === 'object') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch(`${BASE_URL}/seller/products`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Erreur lors de la création du produit');

      toast.success('Produit créé avec succès');
      router.push('/seller/dashboard/products');
    } catch (error) {
      toast.error('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/seller/dashboard/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Retour aux produits
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold mb-8">Nouveau Produit</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FaCloudUploadAlt className="mr-2" />
              Images du produit
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover w-full h-40"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full 
                    opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 
                flex flex-col items-center justify-center cursor-pointer hover:border-blue-500
                transition-colors h-40">
                <FaCloudUploadAlt className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Ajouter des images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaInfoCircle className="mr-2" />
                Informations de base
              </h2>
              <div>
                <label className="block text-sm font-medium mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description courte</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  maxLength={150}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) => setFormData({...formData, tags: e.target.value.split(",").map(tag => tag.trim())})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: nouveau, promotion, tendance"
                />
              </div>
            </div>

            {/* Prix et stock */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center">
                <FaMoneyBillWave className="mr-2" />
                Prix et stock
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantité</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ancien prix (optionnel)</label>
                <input
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({...formData, oldPrice: Number(e.target.value)})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Disponibilité</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({...formData, availability: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="in_stock">En stock</option>
                  <option value="out_of_stock">Rupture de stock</option>
                  <option value="pre_order">Précommande</option>
                </select>
              </div>
            </div>
          </div>

          {/* Caractéristiques et spécifications */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Caractéristiques du produit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].name = e.target.value;
                      setFormData({...formData, specifications: newSpecs});
                    }}
                    placeholder="Nom"
                    className="w-1/2 p-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...formData.specifications];
                      newSpecs[index].value = e.target.value;
                      setFormData({...formData, specifications: newSpecs});
                    }}
                    placeholder="Valeur"
                    className="w-1/2 p-2 border rounded-lg"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  specifications: [...formData.specifications, { name: "", value: "" }]
                })}
                className="text-blue-600 hover:text-blue-800"
              >
                + Ajouter une spécification
              </button>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
              disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Création en cours..." : "Créer le produit"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 