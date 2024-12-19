import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ProductStats {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  rating: number;
  stockLevel: number;
  trend: Array<{
    date: string;
    sales: number;
  }>;
}

interface ProductPerformanceProps {
  products: ProductStats[];
}

export function ProductPerformance({ products }: ProductPerformanceProps) {
  const sortedByRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const topProducts = sortedByRevenue.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance des produits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Graphique des ventes */}
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563eb" name="Ventes" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Liste détaillée */}
          <div className="space-y-6">
            {topProducts.map((product) => (
              <div key={product.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{product.name}</h4>
                  <span className="text-sm font-medium">
                    {product.revenue} FCFA
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    Ventes: {product.sales}
                  </div>
                  <div>
                    Vues: {product.views}
                  </div>
                  <div>
                    Conv.: {product.conversionRate}%
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Stock</span>
                    <span>{product.stockLevel}%</span>
                  </div>
                  <Progress value={product.stockLevel} className="h-1" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 