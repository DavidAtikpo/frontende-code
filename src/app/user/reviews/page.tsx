"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Star, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Review {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/reviews`, {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`
        }
      });
      const data = await response.json();
      
      // Vérifier si la réponse est réussie et contient des avis
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
        console.error("Format de réponse invalide:", data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mes Avis</h1>
        <div>Chargement...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mes Avis</h1>
        <Card className="p-6 text-center">
          <p>Vous n'avez pas encore donné d'avis.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Avis</h1>
      
      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{review.productName}</h3>
                <div className="flex items-center space-x-1 my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 