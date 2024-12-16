"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getApiUrl } from '@/utils/api';

const BASE_URL = getApiUrl();

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      // Afficher le message de succès
      setSuccessMessage(data.message);
      setEmail(""); // Réinitialiser le champ email
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Connexion Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email administrateur pour recevoir un lien de connexion
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 text-green-500 p-4 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email administrateur"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Envoi en cours..." : "Recevoir le lien de connexion"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 