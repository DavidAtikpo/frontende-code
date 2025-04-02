import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order, OrderItem } from "@/types/order";
import { CheckCircle, Clock, AlertCircle, X } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          color: 'text-green-500',
          icon: CheckCircle,
          label: 'Livrée'
        };
      case 'paid':
        return {
          color: 'text-blue-500',
          icon: CheckCircle,
          label: 'Payée'
        };
      default:
        return {
          color: 'text-yellow-500',
          icon: Clock,
          label: 'En attente'
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <statusConfig.icon className={`w-5 h-5 mr-2 ${statusConfig.color}`} />
              <span>Détails de la commande #{order.orderNumber}</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Informations de la commande */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de commande</h3>
              <p className="mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <p className={`mt-1 flex items-center ${statusConfig.color}`}>
                <statusConfig.icon className="w-4 h-4 mr-1" />
                {statusConfig.label}
              </p>
            </div>
          </div>

          {/* Adresse de livraison */}
          {order.address && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Adresse de livraison</h3>
              <p className="mt-1">
                {order.address.street}<br />
                {order.address.city}, {order.address.zipCode}<br />
                {order.address.country}
              </p>
            </div>
          )}

          {/* Liste des produits */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Produits commandés</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantity}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {Number(item.price).toLocaleString('fr-FR')} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="text-lg font-bold">
                {Number(order.total).toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal; 