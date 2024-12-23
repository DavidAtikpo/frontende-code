"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Star, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

interface Review {
  id: string;
  userId: string;
  targetId: string;
  targetType: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    name: string;
  };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/reviews`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (reviewId: string, status: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/reviews/${reviewId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (response.ok) {
        fetchReviews(); // Recharger les avis
      }
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modération des avis</h1>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Commentaire</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.user.name}</TableCell>
                <TableCell className="flex items-center">
                  {review.rating} <Star className="h-4 w-4 text-yellow-400 ml-1" />
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {review.content}
                </TableCell>
                <TableCell>{review.targetType}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(review.status)}
                    {review.status}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleModeration(review.id, 'approved')}
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleModeration(review.id, 'rejected')}
                        >
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 