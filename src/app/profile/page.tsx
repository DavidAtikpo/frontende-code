"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;


export default function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${BASE_URL}/api/user/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setAvatar(data.avatarUrl);
        alert('Photo de profil mise à jour avec succès !');
      } else {
        throw new Error('Erreur lors du téléchargement');
      }
    } catch (error) {
      alert('Erreur lors du téléchargement de l\'image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
            <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600 mb-8 bg-white px-4 py-3 rounded-lg shadow-sm"
      >
        <Link 
          href="/" 
          className="flex items-center hover:text-blue-600 transition-colors"
        >
          <FaHome className="mr-1" />
          Accueil
        </Link>
        <FaChevronRight className="text-gray-400 text-xs" />
        <span className="text-blue-600 font-medium">Boutique</span>
      </motion.nav> 

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            {avatar ? (
              <Image
                src={avatar}
                alt="Photo de profil"
                width={500}
                height={500}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
            )}
          </div>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {isUploading ? 'Téléchargement...' : 'Changer la photo'}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
} 