"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaStar, FaReply, FaThumbsUp, FaFlag } from 'react-icons/fa';
import Image from 'next/image';

interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  event: {
    title: string;
  };
  sellerResponse?: {
    comment: string;
    createdAt: string;
  };
  helpful: number;
  reported: boolean;
}

const EventReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'responded' | 'pending'>('all');
  const [sort, setSort] = useState<'recent' | 'rating'>('recent');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchReviews();
  }, [filter, sort]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/seller/reviews?filter=${filter}&sort=${sort}`
      );
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des avis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/reviews/${reviewId}/reply`,
        { comment: replyText[reviewId] }
      );
      if (response.data.success) {
        toast.success('Réponse publiée avec succès');
        setReplyText({ ...replyText, [reviewId]: '' });
        fetchReviews();
      }
    } catch (error) {
      toast.error('Erreur lors de la publication de la réponse');
      console.error(error);
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/reviews/${reviewId}/report`
      );
      toast.success('Avis signalé');
      fetchReviews();
    } catch (error) {
      toast.error('Erreur lors du signalement');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Avis des clients</h1>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="p-2 border rounded"
          >
            <option value="all">Tous les avis</option>
            <option value="responded">Répondus</option>
            <option value="pending">En attente</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="p-2 border rounded"
          >
            <option value="recent">Plus récents</option>
            <option value="rating">Meilleure note</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {review.user.avatar ? (
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user.name[0]}
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-medium">{review.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-600 mb-4">{review.comment}</p>

            {review.images?.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((image, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <Image
                      src={image}
                      alt={`Review ${index + 1}`}
                      width={500}
                      height={500}
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <button className="flex items-center space-x-1">
                <FaThumbsUp />
                <span>{review.helpful}</span>
              </button>
              {!review.reported && (
                <button
                  onClick={() => handleReport(review.id)}
                  className="flex items-center space-x-1 text-red-500"
                >
                  <FaFlag />
                  <span>Signaler</span>
                </button>
              )}
            </div>

            {review.sellerResponse ? (
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <div className="flex items-center mb-2">
                  <FaReply className="text-blue-500 mr-2" />
                  <p className="font-medium">Votre réponse</p>
                </div>
                <p className="text-gray-600">{review.sellerResponse.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.sellerResponse.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="mt-4">
                <textarea
                  value={replyText[review.id] || ''}
                  onChange={(e) => setReplyText({
                    ...replyText,
                    [review.id]: e.target.value
                  })}
                  placeholder="Répondre à cet avis..."
                  className="w-full p-3 border rounded"
                  rows={3}
                />
                <button
                  onClick={() => handleReply(review.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Répondre
                </button>
              </div>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Aucun avis pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventReviews; 