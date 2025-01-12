"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SellerRequest {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  documents: {
    idCard: string;
    proofOfAddress: string;
    taxCertificate: string;
  };
  status: string;
}

interface RequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: SellerRequest;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const RequestDetailsDialog = ({ isOpen, onClose, request }: RequestDetailsDialogProps) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const normalizeImagePath = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${BASE_URL}/uploads/${path.replace(/^[\/\\]?uploads[\/\\]?/, '').replace(/\\/g, '/')}`;
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p>{request.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p>{request.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <div className="space-y-4">
              {request.documents?.idCard && (
                <div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <span className="font-medium">Carte d'identité</span>
                  </div>
                  <div className="w-full h-[200px] border rounded overflow-hidden">
                    <iframe
                      src={normalizeImagePath(request.documents.idCard)}
                      className="w-full h-full"
                      title="Carte d'identité"
                    />
                  </div>
                </div>
              )}
              
              {request.documents?.proofOfAddress && (
                <div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <span className="font-medium">Justificatif de domicile</span>
                  </div>
                  <div className="w-full h-[200px] border rounded overflow-hidden">
                    <iframe
                      src={normalizeImagePath(request.documents.proofOfAddress)}
                      className="w-full h-full"
                      title="Justificatif de domicile"
                    />
                  </div>
                </div>
              )}
              
              {request.documents?.taxCertificate && (
                <div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <span className="font-medium">Certificat fiscal</span>
                  </div>
                  <div className="w-full h-[200px] border rounded overflow-hidden">
                    <iframe
                      src={normalizeImagePath(request.documents.taxCertificate)}
                      className="w-full h-full"
                      title="Certificat fiscal"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statut */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Statut</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsDialog; 