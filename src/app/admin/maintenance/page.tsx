"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { AlertTriangle, Power, Trash2, RefreshCw, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function MaintenancePage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleanupInProgress, setCleanupInProgress] = useState(false);
  const [cleanupResults, setCleanupResults] = useState<string[]>([]);

  const startMaintenance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/system/maintenance/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ reason, estimatedDuration: duration }),
        credentials: 'include'
      });

      if (response.ok) {
        setMaintenanceMode(true);
        setShowMaintenanceDialog(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const endMaintenance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/system/maintenance/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        setMaintenanceMode(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const performCleanup = async () => {
    setCleanupInProgress(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/system/cleanup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        setCleanupResults(data.data.tasks);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setCleanupInProgress(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Maintenance Système</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Power className={`h-8 w-8 ${maintenanceMode ? 'text-red-500' : 'text-green-500'}`} />
            <div>
              <h2 className="text-xl font-semibold">Mode Maintenance</h2>
              <p className="text-sm text-gray-500">
                {maintenanceMode ? 'Site en maintenance' : 'Site en ligne'}
              </p>
            </div>
          </div>

          <Button
            variant={maintenanceMode ? "destructive" : "default"}
            onClick={() => maintenanceMode ? endMaintenance() : setShowMaintenanceDialog(true)}
          >
            {maintenanceMode ? 'Désactiver le mode maintenance' : 'Activer le mode maintenance'}
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Trash2 className="h-8 w-8 text-orange-500" />
            <div>
              <h2 className="text-xl font-semibold">Nettoyage Système</h2>
              <p className="text-sm text-gray-500">
                Nettoyer les fichiers temporaires et les données obsolètes
              </p>
            </div>
          </div>

          <Button
            onClick={performCleanup}
            disabled={cleanupInProgress}
          >
            {cleanupInProgress ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Nettoyage en cours...
              </>
            ) : (
              'Lancer le nettoyage'
            )}
          </Button>

          {cleanupResults.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Résultats du nettoyage :</h3>
              <ul className="space-y-1 text-sm">
                {cleanupResults.map((result, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activer le mode maintenance</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">
                Cette action déconnectera tous les utilisateurs non-administrateurs.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Raison de la maintenance</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Mise à jour du système"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Durée estimée</label>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ex: 30 minutes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={startMaintenance}>
              Activer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 