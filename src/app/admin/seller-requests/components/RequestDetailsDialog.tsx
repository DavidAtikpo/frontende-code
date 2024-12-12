"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestDetailsDialogProps {
  requestId: string;
  onClose: () => void;
  onValidate: (id: string, status: 'approved' | 'rejected', message?: string) => void;
}

// Définir l'interface pour les détails du vendeur
interface SellerDetails {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  documents: {
    idCard: string;
    proofOfAddress: string;
    photos: string[];
  };
}

export default function RequestDetailsDialog({
  requestId,
  onClose,
  onValidate,
}: RequestDetailsDialogProps) {
  const [details, setDetails] = useState<SellerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDetails = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/seller/${requestId}`);
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleValidate = (status: 'approved' | 'rejected') => {
    onValidate(requestId, status, message);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <section className="space-y-4">
              <h3 className="font-semibold">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p>{details?.personalInfo.fullName}</p>
                </div>
                {/* Autres informations personnelles */}
              </div>
            </section>

            {/* Documents */}
            <section className="space-y-4">
              <h3 className="font-semibold">Documents</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Carte d'identité */}
                <div>
                  <p className="text-sm text-gray-500">Carte d&apos;identité</p>
                  <a
                    href={`${BASE_URL}${details?.documents.idCard}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Voir le document
                  </a>
                </div>
                {/* Autres documents */}
              </div>
            </section>

            {/* Photos */}
            <section className="space-y-4">
              <h3 className="font-semibold">Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {details?.documents.photos.map((photo: string, index: number) => (
                  <a
                    key={index}
                    href={`${BASE_URL}${photo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={`${BASE_URL}${photo}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={500}
                      height={300}
                    />
                  </a>
                ))}
              </div>
            </section>

            {/* Message de validation/rejet */}
            <Textarea
              placeholder="Message pour le vendeur (optionnel)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => handleValidate('rejected')}
              >
                Rejeter
              </Button>
              <Button
                onClick={() => handleValidate('approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                Approuver
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 