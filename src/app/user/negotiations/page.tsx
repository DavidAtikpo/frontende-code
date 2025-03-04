"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from 'cookies-next';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

const NegotiationsPage = () => {
  const [negotiations, setNegotiations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNegotiations = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(`${BASE_URL}/api/negotiations/user`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNegotiations(data);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les négociations",
          variant: "destructive"
        });
      }
    };

    fetchNegotiations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Négociations</h1>
      
      <div className="space-y-4">
        {negotiations.map((negotiation: any) => (
          <div key={negotiation._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{negotiation.product.title}</h3>
                <p className="text-sm text-gray-600">
                  Prix initial: {negotiation.product.finalPrice} CFA
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                negotiation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                negotiation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {negotiation.status}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {negotiation.messages.map((msg: any) => (
                <div key={msg._id} className={`p-2 rounded ${
                  msg.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                } max-w-[80%]`}>
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {negotiation.invoice && (
              <div className="mt-4 p-3 bg-green-50 rounded">
                <p className="font-semibold">Nouveau prix proposé: {negotiation.invoice.amount} CFA</p>
                <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Payer maintenant
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NegotiationsPage; 