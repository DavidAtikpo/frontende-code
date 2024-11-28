"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthTabs from "../components/auth/AuthTabs";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://dubon-server.vercel.app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        
      });
      // console.log('body',response.json());

      if (!response.ok) {
        const errorData = await response.json();
        console.log('error',errorData);
        
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

      const data = await response.json();
      console.log("Connexion réussie :", data);

      // Stockez le token ou effectuez une redirection
      localStorage.setItem("token", data.token);
      window.location.href = "/user/dashboard"; // Redirection après connexion réussie
    } catch (err: unknown) {
      console.log(err);
      
      // setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardContent className="pt-6">
          <AuthTabs />
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Connexion</h1>
            <p className="text-sm text-gray-500 mt-2">
              Connectez-vous à votre compte
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "CONNEXION"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                OU UTILISER
              </span>
            </div>
          </div>

          <div className="space-y-3">
  <Button
    variant="outline"
    className="w-full"
    type="button"
    onClick={() => (window.location.href = `${BASE_URL}/auth/google`)}
  >
   <FcGoogle />
    Connexion avec Google
  </Button>
  <Button
    variant="outline"
    className="w-full"
    type="button"
    onClick={() => (window.location.href = `${BASE_URL}/auth/facebook`)}
  >
    <Image
      src="/facebook.png"
      alt="Facebook"
      className="w-5 h-5 mr-2"
      width={64}
      height={64}
    />
    Connexion avec Facebook
  </Button>
</div>

{error && <div className="text-sm text-red-600">{error}</div>}


          <div className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-[#1D4ED8] hover:underline">
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
