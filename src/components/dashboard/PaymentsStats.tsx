import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

export function PaymentsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des revenus</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,650,000 FCFA</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +20.1%
            </span>
            par rapport au mois dernier
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En attente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150,000 FCFA</div>
          <p className="text-xs text-muted-foreground">
            12 paiements en attente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complétés</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,450,000 FCFA</div>
          <p className="text-xs text-muted-foreground">
            156 paiements réussis
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Échoués</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">50,000 FCFA</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 flex items-center">
              <ArrowDown className="h-4 w-4 mr-1" />
              3 paiements échoués
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 