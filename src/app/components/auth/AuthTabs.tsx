"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="flex border-b mb-6">
      <Link
        href="/login"
        className={`flex-1 text-center py-3 ${
          pathname === "/login"
            ? "border-b-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold"
            : "text-gray-500"
        }`}
      >
        Connexion
      </Link>
      <Link
        href="/register"
        className={`flex-1 text-center py-3 ${
          pathname === "/register"
            ? "border-b-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold"
            : "text-gray-500"
        }`}
      >
        Créer un compte
      </Link>
    </div>
  );
} 