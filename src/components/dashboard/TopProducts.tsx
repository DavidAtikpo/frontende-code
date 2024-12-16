interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export function TopProducts({ products }: { products: Product[] }) {
  return (
    <div className="space-y-4">
      {products?.map((product) => (
        <div key={product.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-sm text-gray-500">
              {product.sales} ventes
            </p>
          </div>
          <div className="font-medium">
            {product.revenue.toLocaleString()} FCFA
          </div>
        </div>
      ))}
    </div>
  );
}
