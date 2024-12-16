"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RequestDetailsDialog } from "./components/RequestDetailsDialog";
import { getApiUrl } from '@/utils/api';
import { ApprovedSellers } from "./components/ApprovedSellers";

const BASE_URL = getApiUrl();

interface SellerRequest {
  _id: string;
  type: 'individual' | 'company';
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
    idNumber?: string;
    taxNumber: string;
    legalRepName?: string;
    rccmNumber?: string;
  };
  documents: {
    idCard: string;
    proofOfAddress: string;
    taxCertificate: string;
    photos: string[];
    rccm?: string;
    companyStatutes?: string;
  };
  contract: {
    signed: boolean;
    signedDocument: string;
  };
  videoVerification: {
    completed: boolean;
    recordingUrl: string;
  };
  businessInfo: {
    category: string;
    description: string;
    products: Array<{
      name: string;
      description: string;
      price: number;
    }>;
    bankDetails: {
      type: "bank" | "mobile";
      accountNumber: string;
      bankName?: string;
    };
    returnPolicy: string;
  };
  status: string;
  createdAt: string;
}

export default function SellerRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${BASE_URL}/api/admin/seller-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/adminLogin');
          return;
        }
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getAuthToken = () => {
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const handleApproval = async (id: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${BASE_URL}/api/admin/seller-requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve request');
      }
      
      await fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      if (error instanceof Error) setError(error.message);
    }
  };

  const handleRejection = async (id: string, reason: string) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${BASE_URL}/api/admin/seller-requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/adminLogin');
          return;
        }
        throw new Error('Failed to reject request');
      }
      
      await fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des vendeurs</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Demandes en attente</h2>
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
                <p className="text-gray-600">{request.userId.email}</p>
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
                      onClick={() => setSelectedRequest(request)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Voir les détails
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ApprovedSellers />

      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproval}
          onReject={handleRejection}
        />
      )}
    </div>
  );
}
