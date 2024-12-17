"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import { useState } from "react";
import { API_CONFIG } from "@/utils/config";

const { BASE_URL } = API_CONFIG;

interface RequestDetailsDialogProps {
  request: SellerRequest;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

interface SellerRequest {
  _id: string;
  type: 'individual' | 'company';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    companyName?: string;
    idNumber?: string;
    taxNumber: string;
    legalRepName?: string;
    rccmNumber?: string;
  };
  documents: {
    idCard: string;
    proofOfAddress: string;
    taxCertificate: string;
    photos: string[];
    rccm?: string;
    companyStatutes?: string;
  };
  contract: {
    signed: boolean;
    signedDocument: string;
  };
  videoVerification: {
    completed: boolean;
    recordingUrl: string;
  };
  businessInfo: {
    category: string;
    description: string;
    products: Array<{
      name: string;
      description: string;
      price: number;
    }>;
    bankDetails: {
      type: "bank" | "mobile";
      accountNumber: string;
      bankName?: string;
    };
    returnPolicy: string;
  };
  status: string;
  createdAt: string;
}

const normalizeImagePath = (path: string) => {
  // Convertir les backslashes en forward slashes
  return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
};

export function RequestDetailsDialog({
  request,
  onClose,
  onApprove,
  onReject,
}: RequestDetailsDialogProps) {
  const [rejectReason, setRejectReason] = useState("");

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande de vendeur</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations personnelles */}
          <section>
            <h3 className="font-semibold mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p>{request.personalInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{request.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p>{request.personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p>{request.personalInfo.address}</p>
              </div>
              {request.type === 'company' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Nom de l'entreprise</p>
                    <p>{request.personalInfo.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Numéro RCCM</p>
                    <p>{request.personalInfo.rccmNumber}</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Documents PDF */}
          <section>
            <h3 className="font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(request.documents).map(([key, path]) => {
                if (key !== 'photos' && path && typeof path === 'string') {
                  const normalizedPath = normalizeImagePath(path);
                  const isImage = path.match(/\.(jpg|jpeg|png|gif)$/i);
                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{key}</h4>
                      {isImage ? (
                        <Image
                          src={normalizedPath}
                          alt={key}
                          width={300}
                          height={400}
                          className="object-contain"
                        />
                      ) : (
                        <iframe
                          src={normalizedPath}
                          className="w-full h-[500px]"
                          title={key}
                        />
                      )}
                      <a
                        href={normalizedPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-600 hover:underline block"
                      >
                        Ouvrir dans un nouvel onglet
                      </a>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </section>

          {/* Photos */}
          <section>
            <h3 className="font-semibold mb-4">Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {request.documents.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={normalizeImagePath(photo)}
                    alt={`Photo ${index + 1}`}
                    width={500}
                    height={500}
                    className="object-cover rounded-lg w-full h-full"
                  />
                  <a
                    href={normalizeImagePath(photo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-sm"
                  >
                    Voir
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Vidéo */}
          <section>
            <h3 className="font-semibold mb-4">Vidéo de vérification</h3>
            {request.videoVerification.recordingUrl && (
              <div className="relative aspect-video">
                <video
                  src={`${BASE_URL}/${request.videoVerification.recordingUrl}`}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </section>

          {/* Informations commerciales */}
          <section>
            <h3 className="font-semibold mb-4">Informations commerciales</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Catégorie</p>
                <p>{request.businessInfo.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p>{request.businessInfo.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Politique de retour</p>
                <p>{request.businessInfo.returnPolicy}</p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="space-y-4">
            <Textarea
              placeholder="Raison du rejet (obligatoire en cas de rejet)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => onReject(request._id, rejectReason)}
                disabled={!rejectReason}
              >
                Rejeter
              </Button>
              <Button
                onClick={() => onApprove(request._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Approuver
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 