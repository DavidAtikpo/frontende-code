import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Return {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  refundAmount: number;
}

interface ReturnsOverviewProps {
  returns: Return[];
  onViewDetails: (returnId: string) => void;
}

export function ReturnsOverview({ returns, onViewDetails }: ReturnsOverviewProps) {
  const getStatusColor = (status: Return['status']) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Demandes de retour récentes</span>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {returns.map((return_) => (
            <div key={return_.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Commande #{return_.orderNumber}</p>
                  <Badge className={getStatusColor(return_.status)}>
                    {return_.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {return_.customerName} • {return_.productName}
                </p>
                <p className="text-sm">Motif : {return_.reason}</p>
                <p className="text-sm font-medium">
                  Montant à rembourser : {return_.refundAmount} FCFA
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewDetails(return_.id)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 