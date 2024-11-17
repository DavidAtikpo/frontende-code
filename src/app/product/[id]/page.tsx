import { useParams } from "next/navigation";

export default function ProductDetail() {
  const params = useParams();
  const { id } = params; // Récupère l'ID du produit depuis l'URL

  return (
    <div>
      <h1>Détails du Produit</h1>
      <p>Produit ID : {id}</p>
      {/* Affichez les détails du produit ici */}
    </div>
  );
}
