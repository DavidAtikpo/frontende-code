"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';
const { BASE_URL } = API_CONFIG;

interface SellerRequest {
  status: 'pending' | 'approved' | 'rejected';
  businessType: string;
  businessName: string;
  ufiNumber: string;
  documentPdf: string;
  cardType: string;
  cardNumber: string;
  categories: string[];
  rejectionReason?: string;
  createdAt: string;
}

const RequestStatus = () => {
  const router = useRouter();
  const [request, setRequest] = useState<SellerRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/seller-request/status`);
        if (response.data.success) {
          setRequest(response.data.data);
          if (response.data.data.status === 'approved') {
            router.push('/seller/subscription');
          }
        }
      } catch (error) {
        console.error('Erreur récupération statut:', error);
        toast.error('Erreur lors de la récupération du statut');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Aucune demande trouvée</h2>
        <button
          onClick={() => router.push('/seller/become')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Faire une demande
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          {request.status === 'pending' && (
            <div className="text-yellow-500">
              <FaSpinner className="animate-spin text-4xl inline-block" />
              <h2 className="text-2xl font-bold mt-2">Demande en cours d'examen</h2>
            </div>
          )}
          {request.status === 'approved' && (
            <div className="text-green-500">
              <FaCheckCircle className="text-4xl inline-block" />
              <h2 className="text-2xl font-bold mt-2">Demande approuvée</h2>
            </div>
          )}
          {request.status === 'rejected' && (
            <div className="text-red-500">
              <FaTimesCircle className="text-4xl inline-block" />
              <h2 className="text-2xl font-bold mt-2">Demande rejetée</h2>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Type d'activité</h3>
            <p>{request.businessType}</p>
          </div>
          <div>
            <h3 className="font-semibold">Nom de l'entreprise</h3>
            <p>{request.businessName}</p>
          </div>
          <div>
            <h3 className="font-semibold">Numéro UFI</h3>
            <p>{request.ufiNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold">Document d'identification</h3>
            {request.documentPdf && (
              <a 
                href={request.documentPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Voir le document
              </a>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Type de carte</h3>
            <p>{request.cardType}</p>
          </div>
          <div>
            <h3 className="font-semibold">Numéro de carte</h3>
            <p>{request.cardNumber}</p>
          </div>
          <div>
            <h3 className="font-semibold">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {request.categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Date de soumission</h3>
            <p>{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-700">Motif du rejet</h3>
              <p className="text-red-600">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {request.status === 'rejected' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/seller/become')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Soumettre une nouvelle demande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestStatus; 