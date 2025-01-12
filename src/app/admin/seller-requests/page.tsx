"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { 
  Check, 
  X, 
  Eye, 
  FileText,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";



interface SellerRequest {
  id: string;
  userId: string;
  businessInfo: {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
    registrationNumber: string;
    taxId: string;
  };
  documents: {
    businessRegistration: string;
    idCard: string;
    taxCertificate: string;
    addressProof: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function SellerRequests() {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/seller-requests`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRequestAction = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/sellers/requests/${requestId}`, {
        method: status === 'rejected' ? 'DELETE' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ 
          status, 
          rejectionReason: status === 'rejected' ? rejectionReason : undefined 
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast.success(status === 'approved' ? 'Demande approuvée' : 'Demande rejetée');
        fetchRequests();
        setSelectedRequest(null);
        setShowRejectDialog(false);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const normalizeDocumentUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${BASE_URL}/uploads/${url.replace(/^[\/\\]?uploads[\/\\]?/, '').replace(/\\/g, '/')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Demandes vendeurs</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvées</SelectItem>
            <SelectItem value="rejected">Rejetées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendeur</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.user.name}</p>
                    <p className="text-sm text-gray-500">{request.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.businessInfo.name}</p>
                    <p className="text-sm text-gray-500">{request.businessInfo.type}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {request.businessInfo.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {request.businessInfo.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {Object.entries(request.documents).map(([key, url]) => (
                      url && (
                        <Button
                          key={key}
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDocument({ 
                            url: normalizeDocumentUrl(url),
                            title: key.replace(/([A-Z])/g, ' $1').trim()
                          })}
                          title={`Voir ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestAction(request.id, 'approved')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectDialog(true);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialog des détails */}
      <Dialog open={!!selectedRequest && !showRejectDialog} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails de la demande vendeur</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Informations personnelles</h3>
                  <div className="space-y-2">
                    <p>Nom: {selectedRequest.user.name}</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedRequest.user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedRequest.user.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Informations entreprise</h3>
                  <div className="space-y-2">
                    <p>Nom: {selectedRequest.businessInfo.name}</p>
                    <p>Type: {selectedRequest.businessInfo.type}</p>
                    <p>N° RCCM: {selectedRequest.businessInfo.registrationNumber}</p>
                    <p>N° IFU: {selectedRequest.businessInfo.taxId}</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {selectedRequest.businessInfo.address}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Documents fournis</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedRequest.documents).map(([key, url]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="justify-start"
                      onClick={() => window.open(url, '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Raison du rejet</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Expliquez la raison du rejet..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedRequest && handleRequestAction(selectedRequest.id, 'rejected')}
              disabled={!rejectionReason.trim()}
            >
              Rejeter la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Affichage du document sélectionné */}
      {selectedDocument && (
        <Card className="mt-6">
          <div className="p-2 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold">
                Document: {selectedDocument.title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocument(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-2">
            <div className="w-full h-[400px] border rounded overflow-hidden">
              <iframe
                src={selectedDocument.url}
                className="w-full h-full"
                title={selectedDocument.title}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
