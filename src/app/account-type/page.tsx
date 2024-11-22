"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BASE_URL = "http://localhost:5000/api";

export default function AccountTypePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAccountTypeSelection = async (type: "buyer" | "seller") => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/user/account-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ accountType: type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

      if (type === "buyer") {
        router.push("/user/dashboard");
      } else {
        router.push("/seller/onboarding");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[600px]">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Bienvenue sur Dubon Services !
                 Que voulez-vous faire ?</h1>
            <p className="text-sm text-gray-500 mt-2">
              Sélectionnez l'option qui correspond le mieux à vos besoins
            </p>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center hover:border-blue-600"
              onClick={() => handleAccountTypeSelection("buyer")}
              disabled={isLoading}
            >
              <ShoppingBag className="h-12 w-12 mb-4 text-blue-600" />
              <h2 className="text-lg font-semibold mb-2">Je suis acheteur</h2>
              <p className="text-sm text-gray-500 text-center">
                Je souhaite acheter des produits
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-6 flex flex-col items-center hover:border-blue-600"
              onClick={() => handleAccountTypeSelection("seller")}
              disabled={isLoading}
            >
              <Store className="h-12 w-12 mb-4 text-blue-600" />
              <h2 className="text-lg font-semibold mb-2">Je suis vendeur</h2>
              <p className="text-sm text-gray-500 text-center">
                Je souhaite vendre mes produits
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 