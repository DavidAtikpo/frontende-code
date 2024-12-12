"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SellerRequest {
  _id: string;
  type: 'individual' | 'company';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    companyName?: string;
    // autres champs personnels
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/seller/requests', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch seller requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/seller-requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      // Mettre à jour la liste après approbation
      setRequests(requests.map(req => 
        req._id === id ? { ...req, status: 'approved' } : req
      ));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleRejection = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/seller-requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      // Mettre à jour la liste après rejet
      setRequests(requests.map(req => 
        req._id === id ? { ...req, status: 'rejected' } : req
      ));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Demandes de vendeurs</h1>
      <div className="grid gap-4">
        {requests.length === 0 ? (
          <p>Aucune demande en attente</p>
        ) : (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="font-semibold">
                {request.type === 'company' ? request.personalInfo.companyName : request.personalInfo.fullName}
              </h2>
              <p className="text-gray-600">{request.personalInfo.email}</p>
              <p className="text-gray-600">{request.personalInfo.phone}</p>
              <p className="text-sm text-gray-500 mt-2">
                Type: {request.type === 'company' ? 'Entreprise' : 'Individuel'}
              </p>
              <p className="text-sm text-gray-500">
                Status: {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
              </p>
              <p className="text-sm text-gray-500">
                Date de demande: {new Date(request.createdAt).toLocaleDateString()}
              </p>
              {request.status === 'pending' && (
                <div className="mt-4 space-x-2">
                  <Button 
                    onClick={() => handleApproval(request._id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Approuver
                  </Button>
                  <Button 
                    onClick={() => handleRejection(request._id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
