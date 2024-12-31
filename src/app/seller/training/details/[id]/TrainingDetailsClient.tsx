"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { API_CONFIG } from '@/utils/config';
import { getCookie } from "cookies-next";

interface TrainingDetailsClientProps {
  params: { id: string };
}

const TrainingDetailsClient = ({ params }: TrainingDetailsClientProps) => {
  // Déplacer ici la logique du composant original
  return (
    <div>
      {/* Déplacer ici le JSX du composant original */}
    </div>
  );
};

export default TrainingDetailsClient; 