"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { History, Filter, Calendar, Package, ShoppingCart, LogIn } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryItem {
  id: string;
  type: "product" | "order" | "login" | "settings" | "profile";
  action: string;
  description: string;
  timestamp: string;
  details: {
    [key: string]: any;
  };
  status: "success" | "pending" | "error";
}

export default function HistoryPage() {
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const getIconForType = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-5 w-5" />;
      case "order": return <ShoppingCart className="h-5 w-5" />;
      case "login": return <LogIn className="h-5 w-5" />;
      default: return <History className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Historique des activités</h1>
        <div className="flex gap-4">
          <DateRangePicker />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Toutes les activités</option>
            <option value="product">Produits</option>
            <option value="order">Commandes</option>
            <option value="login">Connexions</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-center gap-4">
                  {getIconForType(item.type)}
                  <div>
                    <h3 className="font-medium">{item.action}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <span className="text-xs text-gray-400">
                      {format(new Date(item.timestamp), "PPP 'à' HH:mm", { locale: fr })}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de détails */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Détails de l'activité</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Action</h3>
                <p>{selectedItem.action}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{selectedItem.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Détails</h3>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(selectedItem.details, null, 2)}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedItem(null)}>
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}