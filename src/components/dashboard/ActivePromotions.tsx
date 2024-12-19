import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ShoppingBag } from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  startDate: string;
  endDate: string;
  usageCount: number;
  maxUses: number | null;
  minPurchase: number | null;
  products: Array<{
    id: string;
    name: string;
  }>;
}

interface ActivePromotionsProps {
  promotions: Promotion[];
}

export function ActivePromotions({ promotions }: ActivePromotionsProps) {
  const getTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}j ${hours}h restants`;
  };

  const getUsageProgress = (used: number, max: number | null) => {
    if (!max) return 100;
    return Math.min((used / max) * 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotions actives</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{promo.name}</h3>
                <Badge variant={promo.type === 'percentage' ? 'default' : 'secondary'}>
                  {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value} FCFA`}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {getTimeLeft(promo.endDate)}
                </div>
                {promo.maxUses && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {promo.usageCount}/{promo.maxUses} utilisations
                  </div>
                )}
                {promo.minPurchase && (
                  <div className="flex items-center text-muted-foreground">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Min. {promo.minPurchase} FCFA
                  </div>
                )}
              </div>

              {promo.maxUses && (
                <Progress 
                  value={getUsageProgress(promo.usageCount, promo.maxUses)} 
                  className="h-2"
                />
              )}

              <div className="text-xs text-muted-foreground">
                Applicable sur : {promo.products.map(p => p.name).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 