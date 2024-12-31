"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface EditServiceClientProps {
  params: { id: string };
}

const EditServiceClient = ({ params }: EditServiceClientProps) => {
  const router = useRouter();
  // Copier ici le contenu du composant original

  return (
    <div>
      {/* Copier ici le JSX du composant original */}
    </div>
  );
};

export default EditServiceClient; 