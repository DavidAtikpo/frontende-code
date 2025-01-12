"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";
import { API_CONFIG } from '@/utils/config';
import { validatePassword, validatePasswordConfirmation } from '@/utils/validation';

const { BASE_URL } = API_CONFIG;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le token depuis l'URL côté client
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    setToken(urlToken);

    if (!urlToken) {
      router.push("/forgot-password");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setIsLoading(false);
      return;
    }

    // Validation de la confirmation
    const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
    if (!confirmValidation.isValid) {
      setError(confirmValidation.message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/user/reset-password`, {
        token,
        password,
        confirmPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardContent className="space-y-4 pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Réinitialiser le mot de passe</h1>
            <p className="text-sm text-gray-500">
              Entrez votre nouveau mot de passe
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="text-green-500 font-medium">
                Votre mot de passe a été réinitialisé avec succès !
              </div>
              <p className="text-sm text-gray-500">
                Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
                disabled={isLoading}
              >
                {isLoading ? "Réinitialisation..." : "RÉINITIALISER LE MOT DE PASSE"}
              </Button>
            </form>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Retourner à la{" "}
              <Link href="/login" className="text-[#1D4ED8] hover:underline">
                page de connexion
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}