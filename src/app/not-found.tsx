import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-[#1D4ED8]">404</h1>
        <h2 className="text-2xl font-semibold">Page Non Trouvée</h2>
        <p className="text-gray-500 max-w-md">
          Désolé, la page que vous recherchez existe pas ou a été déplacée.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#1e40af] transition"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 border border-[#1D4ED8] text-[#1D4ED8] rounded-lg hover:bg-gray-50 transition"
          >
            Nous contacter
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-500">
        <p>Vous pouvez également :</p>
        <ul className="mt-2 space-y-1">
          <li>
            <Link href="/products" className="text-[#1D4ED8] hover:underline">
              Parcourir nos produits
            </Link>
          </li>
          <li>
            <Link href="/search" className="text-[#1D4ED8] hover:underline">
              Effectuer une recherche
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
} 