"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import Image from 'next/image';
import { 
  FaStore, 
  FaFileAlt, 
  FaHistory,
  FaCheck,
  FaBan,
  FaDownload,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface SellerDetails {
  id: string;
  userId: string;
  businessName: string;
  businessType: 'restaurant' | 'service' | 'event' | 'formation';
  description: string;
  address: string;
  status: 'pending' | 'active' | 'suspended' | 'banned';
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    verified: boolean;
    uploadedAt: string;
  }[];
  verificationStatus: {
    identity: boolean;
    address: boolean;
    business: boolean;
  };
  stats: {
    totalSales: number;
    rating: number;
    reviewCount: number;
    customerCount: number;
    orderCount: number;
  };
  history: {
    id: string;
    action: string;
    reason?: string;
    performedBy: string;
    timestamp: string;
  }[];
}

interface Props {
  params: { id: string };
}

const SellerDetailsClient = ({ params }: Props) => {
  const { id } = params;
  const [seller, setSeller] = useState<SellerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  const fetchSellerDetails = useCallback(async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/sellers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails');
      }

      const data = await response.json();
      setSeller(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSellerDetails();
  }, [fetchSellerDetails]);

  const handleStatusChange = async (newStatus: string) => {
    const reason = newStatus === 'suspended' || newStatus === 'banned' 
      ? window.prompt('Raison du changement de statut:')
      : undefined;

    if ((newStatus === 'suspended' || newStatus === 'banned') && !reason) {
      toast.error('Une raison est requise');
      return;
    }

    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus, reason })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      toast.success('Statut mis à jour avec succès');
      fetchSellerDetails();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleVerifyDocument = async (documentId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${BASE_URL}/api/admin/sellers/${id}/documents/${documentId}/verify`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du document');
      }

      toast.success('Document vérifié avec succès');
      fetchSellerDetails();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la vérification du document');
    }
  };

  const normalizeDocumentUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BASE_URL}/uploads/${url.replace(/^[\/\\]?uploads[\/\\]?/, '').replace(/\\/g, '/')}`;
  };

  if (loading || !seller) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Détails du vendeur</h1>
        <div className="flex space-x-2">
          {seller.status === 'active' && (
            <Button
              variant="destructive"
              onClick={() => handleStatusChange('suspended')}
            >
              <FaBan className="mr-2" />
              Suspendre
            </Button>
          )}
          {seller.status === 'suspended' && (
            <Button
              variant="default"
              onClick={() => handleStatusChange('active')}
            >
              <FaCheck className="mr-2" />
              Réactiver
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Informations de base */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaStore className="mr-2" />
              Informations commerciales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {seller.user.avatar && (
                  <Image
                    src={seller.user.avatar}
                    alt={seller.businessName}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold">{seller.businessName}</h2>
                  <Badge>{seller.businessType}</Badge>
                </div>
              </div>
              <p className="text-gray-600">{seller.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {seller.user.email}
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-400" />
                  {seller.user.phone}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {seller.address}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Ventes totales</p>
                <p className="text-2xl font-bold">
                  {seller.stats.totalSales.toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Note moyenne</p>
                <p className="text-2xl font-bold">
                  {seller.stats.rating.toFixed(1)}/5
                </p>
                <p className="text-sm text-gray-500">
                  {seller.stats.reviewCount} avis
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clients</p>
                <p className="text-2xl font-bold">
                  {seller.stats.customerCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">
            <FaFileAlt className="mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <FaHistory className="mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {seller.documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-sm text-gray-500">
                        Uploadé le {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(normalizeDocumentUrl(doc.url), '_blank', 'noopener,noreferrer')}
                      >
                        <FaDownload className="mr-2" />
                        Télécharger
                      </Button>
                      {!doc.verified && (
                        <Button
                          size="sm"
                          onClick={() => handleVerifyDocument(doc.id)}
                        >
                          <FaCheck className="mr-2" />
                          Vérifier
                        </Button>
                      )}
                      <Badge className={
                        doc.verified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }>
                        {doc.verified ? 'Vérifié' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {seller.history.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{event.action}</p>
                      {event.reason && (
                        <p className="text-sm text-gray-500">
                          Raison: {event.reason}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Par: {event.performedBy}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDetailsClient; 