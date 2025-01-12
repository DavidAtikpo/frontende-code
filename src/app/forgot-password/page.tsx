"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import axios from "axios";
import { API_CONFIG } from '@/utils/config';

const { BASE_URL } = API_CONFIG;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/user/forgot-password`, {
        email: email.trim()
      });

      if (response.data.success) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardContent className="space-y-4 pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Mot de passe oublié</h1>
            <p className="text-sm text-gray-500">
              Entrez votre adresse e-mail pour réinitialiser votre mot de passe
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "ENVOYER LE LIEN"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-green-500 font-medium">
                Un e-mail de réinitialisation a été envoyé !
              </div>
              <p className="text-sm text-gray-500">
                Veuillez vérifier votre boîte de réception et suivre les instructions.
              </p>
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link href="/login" className="text-[#1D4ED8] hover:underline">
                Connexion
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 