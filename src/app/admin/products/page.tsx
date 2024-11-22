"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Edit, Trash2, Eye, Grid, List as ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BASE_URL = "http://localhost:5000/api";

interface Product {
  _id: string;
  name: string;
  title: string;
  price: number;
  category: string;
  status: "En stock" | "Rupture" | "En commande";
  images: string;
  createdAt: string;
}

export default function ProductsListPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/get-all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }

        const data = await response.json();
        setProducts(data); // Supposons que l'API retourne un tableau de produits
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (!confirm) return;

    try {
      const response = await fetch(`${BASE_URL}/product/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du produit");
      }

      setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
      alert("Produit supprimé avec succès");
    } catch (err: any) {
      console.error("Erreur :", err);
      alert(err.message || "Une erreur est survenue lors de la suppression");
    }
  };
  const filteredProducts = products.filter((product) => {
    const name = product.title ? product.title.toLowerCase() : ""; // Valeur par défaut si product.name est undefined
    return name.includes(searchTerm.toLowerCase());
  });
  

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="relative group">
            <img
              src={product.images}
              alt={product.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Link href={`/admin/products/${product._id}`}>
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/products/edit/${product._id}`}>
                  <Button size="sm" variant="secondary">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-red-600"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
            <p className="text-lg font-bold text-blue-600">
              {product.price.toLocaleString()} FCFA
            </p>
            <div className="mt-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  product.status === "En stock"
                    ? "bg-green-100 text-green-800"
                    : product.status === "Rupture"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <Card className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.images}
                      alt={product.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "En stock"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Rupture"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/products/edit/${product._id}`}>
                      <Button variant="ghost" size="sm" className="text-yellow-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des Produits</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-white rounded-lg shadow p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/admin/products/add">
            <Button className="bg-[#1D4ED8] hover:bg-[#1e40af]">
              Ajouter un produit
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {viewMode === "grid" ? renderGridView() : renderListView()}
    </div>
  );
}
