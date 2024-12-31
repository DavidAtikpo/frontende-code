"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

// interface MenuForm {
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   image: FileList;
// }

const MenuPage = () => {
//   const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/menu`);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement du menu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const url = editingItem 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/menu/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/menu`;

      const method = editingItem ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(editingItem ? 'Plat modifié avec succès' : 'Plat ajouté avec succès');
        fetchMenuItems();
        setShowAddForm(false);
        setEditingItem(null);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/menu/${id}`
      );

      if (response.data.success) {
        toast.success('Plat supprimé avec succès');
        fetchMenuItems();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const MenuForm = ({ item }: { item?: MenuItem }) => (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block mb-2">Nom du plat</label>
        <input
          name="name"
          defaultValue={item?.name}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          defaultValue={item?.description}
          required
          rows={3}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Prix (CFA)</label>
          <input
            type="number"
            name="price"
            defaultValue={item?.price}
            required
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Catégorie</label>
          <select
            name="category"
            defaultValue={item?.category}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="entree">Entrée</option>
            <option value="plat">Plat principal</option>
            <option value="dessert">Dessert</option>
            <option value="boisson">Boisson</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2">Image</label>
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            id="menuImage"
          />
          <label htmlFor="menuImage" className="cursor-pointer">
            <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-600">
              {item ? 'Changer l\'image' : 'Ajouter une image'}
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={formLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {formLoading ? 'Chargement...' : item ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion du Menu</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Ajouter un plat
        </button>
      </div>

      {(showAddForm || editingItem) && (
        <div className="mb-8">
          <MenuForm item={editingItem || undefined} />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{item.name}</h3>
                <span className="font-bold text-blue-600">{item.price} CFA</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-sm ${
                  item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Disponible' : 'Indisponible'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage; 