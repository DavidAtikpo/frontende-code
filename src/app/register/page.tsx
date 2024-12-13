"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthTabs from "../components/auth/AuthTabs";
// import Popup from "../components/Popup";

const BASE_URL = "https://dubon-server.onrender.com";
// const BASE_URL = "http://localhost:5000";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false); // État pour le popup
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // if (formData.password !== formData.confirmPassword) {
    //   setError("Les mots de passe ne correspondent pas.");
    //   return;
    // }

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      // Stocker le token
      localStorage.setItem("token", data.token);
      
      setSuccess("Compte créé avec succès !");
      setUserDetails({ 
        name: data.user.name, 
        email: data.user.email 
      });
      setShowPopup(true);

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardContent className="pt-6">
          <AuthTabs />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="8+ caractères"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div> */}

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <label htmlFor="terms" className="text-sm leading-none">
                J&apos;accepte les{" "}
                <Link href="/terms" className="text-[#1D4ED8] hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/privacy"
                  className="text-[#1D4ED8] hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <Button
              type="submit"
              className="w-full bg-[#1D4ED8] hover:bg-[#1e40af]"
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "CRÉER UN COMPTE"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Popup de confirmation */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4 max-w-sm">
            <h2 className="text-lg font-bold">Inscription réussie !</h2>
            <p className="text-gray-700">
              Bonjour <span className="font-bold">{userDetails.name}</span>, un lien de
              vérification a été envoyé à votre email :
            </p>
            <p className="text-blue-500">{userDetails.email}</p>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowPopup(false)}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
