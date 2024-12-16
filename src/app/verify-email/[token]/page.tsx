'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { API_CONFIG } from '@/utils/config';

export default function VerifyEmail() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState('Vérification en cours...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          API_CONFIG.getFullUrl(`/user/verify-email/${params.token}`),
          {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus('Email vérifié avec succès !');
          setTimeout(() => {
            router.push('/login?verified=true');
          }, 2000);
        } else {
          setStatus(data.message || 'Erreur de vérification');
        }
      } catch (error) {
        setStatus('Une erreur est survenue lors de la vérification');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.token) {
      verifyEmail();
    }
  }, [params.token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Vérification de l'email
          </h2>
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner className="w-8 h-8" />
              </div>
            ) : (
              <p className={`mt-2 text-sm ${
                status.includes('succès') ? 'text-green-600' : 'text-gray-600'
              }`}>
                {status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}