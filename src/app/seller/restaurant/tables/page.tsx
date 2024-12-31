"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaChair } from 'react-icons/fa';
import { getCookie } from 'cookies-next';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: string;
}

const TablesPage = () => {
  const router = useRouter();
  const restaurantId = getCookie('restaurantId');
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      router.push('/seller/restaurant/setup');
      return;
    }
    fetchTables();
  }, [restaurantId, router]);

  const fetchTables = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/tables`
      );
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des tables');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tableData = {
      number: parseInt(formData.get('number') as string),
      capacity: parseInt(formData.get('capacity') as string),
      location: formData.get('location')
    };

    try {
      if (editingTable) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/tables/${editingTable.id}`,
          tableData
        );
        toast.success('Table modifiée avec succès');
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/tables`,
          tableData
        );
        toast.success('Table ajoutée avec succès');
      }
      fetchTables();
      setShowAddForm(false);
      setEditingTable(null);
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
      console.error(error);
    }
  };

  const handleStatusChange = async (tableId: string, status: Table['status']) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/tables/${tableId}`,
        { status }
      );
      toast.success('Statut mis à jour');
      fetchTables();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error(error);
    }
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TableForm = ({ table }: { table?: Table }) => (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Numéro de table</label>
          <input
            type="number"
            name="number"
            defaultValue={table?.number}
            required
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Capacité</label>
          <input
            type="number"
            name="capacity"
            defaultValue={table?.capacity}
            required
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Emplacement</label>
          <select
            name="location"
            defaultValue={table?.location}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un emplacement</option>
            <option value="interior">Intérieur</option>
            <option value="terrace">Terrasse</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => {
            setShowAddForm(false);
            setEditingTable(null);
          }}
          className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {table ? 'Modifier' : 'Ajouter'}
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
        <h1 className="text-2xl font-bold">Gestion des Tables</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Ajouter une table
        </button>
      </div>

      {(showAddForm || editingTable) && (
        <div className="mb-8">
          <TableForm table={editingTable || undefined} />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FaChair className="text-2xl text-blue-600 mr-3" />
                <div>
                  <h3 className="font-bold">Table {table.number}</h3>
                  <p className="text-sm text-gray-600">{table.capacity} places</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              Emplacement: {table.location}
            </p>

            <div className="flex justify-between items-center">
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table.id, e.target.value as Table['status'])}
                className="p-2 border rounded"
              >
                <option value="available">Disponible</option>
                <option value="occupied">Occupée</option>
                <option value="reserved">Réservée</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <div className="space-x-2">
                <button
                  onClick={() => setEditingTable(table)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesPage; 