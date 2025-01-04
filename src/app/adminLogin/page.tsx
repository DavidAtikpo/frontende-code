"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/utils/config";
import { setCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/user/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      if (data.success && data.accessToken && data.admin) {
        // Sauvegarder dans les cookies directement
        setCookie('token', data.accessToken);
        setCookie('role', data.admin.role);
        if (data.refreshToken) {
          setCookie('refreshToken', data.refreshToken);
        }
        
        // Sauvegarder les autres informations dans localStorage
        
        localStorage.setItem('name', data.admin.name);
        localStorage.setItem('email', data.admin.email);
        localStorage.setItem('id', data.admin.id);

        router.push('/admin/dashboard');
      } else {
        throw new Error("Informations de connexion incomplètes");
      }
    } catch (err) {
      const error = err as Error;
      console.error("Erreur de connexion:", error);
      setError(error.message);
    } finally {
      setLoading(false);
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
            Entrez votre email administrateur
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
              {error}
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 