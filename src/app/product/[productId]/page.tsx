export default function ProductPage({ params }: { params: { productId: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1>Détails du produit : {params.productId}</h1>
    </div>
  );
}
