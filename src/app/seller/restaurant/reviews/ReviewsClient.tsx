"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaStar, FaReply, FaCheck } from 'react-icons/fa';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  orderDetails?: {
    items: Array<{
      name: string;
      quantity: number;
    }>;
    total: number;
  };
}

interface ReviewsClientProps {
  params: { restaurantId: string };
}

const ReviewsClient = ({ params }: ReviewsClientProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

  // ... copier toutes les fonctions du composant original

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Copier tout le JSX du composant original */}
    </div>
  );
};

export default ReviewsClient; 