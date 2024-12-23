"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";
import { 
  FolderPlus, 
  Edit, 
  Trash2,
  Save,
  X
} from 'lucide-react';

const { BASE_URL } = API_CONFIG;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (category: Partial<Category>) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/categories${category.id ? `/${category.id}` : ''}`,
        {
          method: category.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('token')}`,
          },
          body: JSON.stringify(category),
          credentials: 'include'
        }
      );

      if (response.ok) {
        fetchCategories();
        setEditingId(null);
        setNewCategory({ name: '', description: '', parentId: '' });
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Ajouter une catégorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Nom de la catégorie"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Button 
            onClick={() => handleSave(newCategory)}
            disabled={!newCategory.name}
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid gap-4">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {editingId === category.id ? (
                <div className="flex-1 flex gap-4">
                  <Input
                    value={category.name}
                    onChange={(e) => setCategories(categories.map(c => 
                      c.id === category.id ? { ...c, name: e.target.value } : c
                    ))}
                  />
                  <Input
                    value={category.description || ''}
                    onChange={(e) => setCategories(categories.map(c => 
                      c.id === category.id ? { ...c, description: e.target.value } : c
                    ))}
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleSave(category)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(category.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 