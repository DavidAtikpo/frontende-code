"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
import { Download, Upload, RefreshCw, Database, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";

const { BASE_URL } = API_CONFIG;

interface Backup {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
  status: 'completed' | 'failed';
}

type BackupType = 'full' | 'data' | 'media';

export default function BackupRestore() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [backupType, setBackupType] = useState<BackupType>('full');

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/backups`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setBackups(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/backups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify({ type: backupType }),
        credentials: 'include'
      });

      if (response.ok) {
        await fetchBackups();
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setBackupInProgress(false);
    }
  };

  const restoreBackup = async (backupId: string) => {
    setRestoreInProgress(true);
    try {
      const response = await fetch(`${BASE_URL}/api/admin/backups/${backupId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        // Rediriger vers la page de login après restauration
        window.location.href = '/adminLogin';
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setRestoreInProgress(false);
    }
  };

  const downloadBackup = async (backupId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/backups/${backupId}/download`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sauvegarde et restauration</h1>
        <div className="flex gap-4">
          <Select value={backupType} onValueChange={(value: BackupType) => setBackupType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de sauvegarde" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Complète</SelectItem>
              <SelectItem value="data">Base de données</SelectItem>
              <SelectItem value="media">Médias</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={createBackup}
            disabled={backupInProgress}
          >
            {backupInProgress ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Créer une sauvegarde
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {backups.map((backup) => (
            <div
              key={backup.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Database className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="font-medium">{backup.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(backup.createdAt).toLocaleString()} • {formatSize(backup.size)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadBackup(backup.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restoreBackup(backup.id)}
                  disabled={restoreInProgress}
                >
                  {restoreInProgress ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}

          {backups.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune sauvegarde disponible</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 