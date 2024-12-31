"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/ui/data-table";
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";
import { FaStar, FaReply, FaFlag } from 'react-icons/fa';

const { BASE_URL } = API_CONFIG;

interface Review {
  id: string;
  serviceId: string;
  serviceName: string;
  rating: number;
  comment: string;
  customer: {
    id: string;
    name: string;
  };
  response?: string;
  status: 'published' | 'hidden' | 'reported';
  createdAt: string;
}

interface Row {
  original: Review;
}

export default function ServiceReviews() {
//   const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{[key: string]: string}>({});

  const columns = [
    {
      accessorKey: "service",
      header: "Service & Client",
      cell: ({ row }: { row: Row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.original.serviceName}</p>
          <p className="text-sm text-gray-500">
            Par {row.original.customer.name}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Note",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < row.original.rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "comment",
      header: "Commentaire",
      cell: ({ row }: { row: Row }) => (
        <div className="space-y-2">
          <p>{row.original.comment}</p>
          {row.original.response && (
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-sm font-medium">Votre réponse:</p>
              <p className="text-sm">{row.original.response}</p>
            </div>
          )}
          {!row.original.response && (
            <div className="space-y-2">
              <Textarea
                placeholder="Répondre à cet avis..."
                value={replyText[row.original.id] || ''}
                onChange={(e) => setReplyText(prev => ({
                  ...prev,
                  [row.original.id]: e.target.value
                }))}
              />
              <Button
                size="sm"
                onClick={() => handleReply(row.original.id)}
                disabled={!replyText[row.original.id]}
              >
                <FaReply className="mr-2" />
                Répondre
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: { row: Row }) => {
        const status = row.original.status;
        const colors = {
          published: "bg-green-100 text-green-800",
          hidden: "bg-gray-100 text-gray-800",
          reported: "bg-red-100 text-red-800"
        };
        return (
          <Badge className={colors[status]}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(
              row.original.id,
              row.original.status === 'hidden' ? 'published' : 'hidden'
            )}
          >
            {row.original.status === 'hidden' ? 'Afficher' : 'Masquer'}
          </Button>
          {row.original.status !== 'reported' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReport(row.original.id)}
            >
              <FaFlag className="mr-2" />
              Signaler
            </Button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des avis');
      }

      const data = await response.json();
      setReviews(data.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/reviews/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: replyText[reviewId] })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la réponse');
      }

      toast.success('Réponse envoyée avec succès');
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      fetchReviews();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      toast.success('Statut mis à jour avec succès');
      fetchReviews();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      const token = getCookie('token');
      const response = await fetch(`${BASE_URL}/api/seller/services/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du signalement');
      }

      toast.success('Avis signalé avec succès');
      fetchReviews();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du signalement de l\'avis');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Avis clients</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les avis</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={reviews}
            searchKey="comment"
          />
        </CardContent>
      </Card>
    </div>
  );
} 