"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from '@/utils/api';

const BASE_URL = getApiUrl();

// Fonction pour définir les cookies
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict`;
};

export default function VerifyLoginPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/verify-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ token: params.token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur de vérification");
        }

        if (data.token) {
          // Stocker les informations dans les cookies
          setCookie('adminToken', data.token);
          setCookie('userRole', data.user.role);
          setCookie('userData', JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            role: data.user.role
          }));

          // Rediriger vers le dashboard
          router.replace("/admin/dashboard");
        } else {
          throw new Error("Token manquant dans la réponse");
        }
      } catch (err) {
        console.error("Erreur de vérification:", err);
        setError(err instanceof Error ? err.message : "Erreur de vérification");
      }
    };

    verifyToken();
  }, [params.token, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Erreur de vérification
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Vérification en cours...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous vérifions votre identité.
          </p>
        </div>
      </div>
    </div>
  );
} 