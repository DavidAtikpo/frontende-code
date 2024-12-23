"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LoadingSpinner } from "@/components/ui/loading";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";
import { 
  Database, 
  Server, 
  HardDrive, 
  Mail,
  Shield,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SystemInfo {
  database: {
    version: string;
    size: number;
    connections: number;
    uptime: number;
  };
  server: {
    os: string;
    nodeVersion: string;
    cpuUsage: number;
    memoryUsage: number;
    diskSpace: {
      total: number;
      used: number;
      free: number;
    };
  };
  cache: {
    type: string;
    size: number;
    hitRate: number;
  };
  email: {
    provider: string;
    status: 'ok' | 'error';
    lastError?: string;
  };
  security: {
    sslExpiry: string;
    lastScan: string;
    vulnerabilities: number;
  };
}

export default function SystemConfig() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/system/info`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSystemInfo(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSystemInfo = async () => {
    setRefreshing(true);
    await fetchSystemInfo();
    setRefreshing(false);
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    return `${days}j ${hours}h ${minutes}m`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuration système</h1>
        <Button
          variant="outline"
          onClick={refreshSystemInfo}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="database">
        <TabsList>
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="server">Serveur</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="database">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold">Base de données</h2>
                <p className="text-sm text-gray-500">Version {systemInfo?.database.version}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Taille totale</p>
                <p className="text-2xl font-semibold">{formatBytes(systemInfo?.database.size || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Connexions actives</p>
                <p className="text-2xl font-semibold">{systemInfo?.database.connections}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="text-2xl font-semibold">{formatUptime(systemInfo?.database.uptime || 0)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Server className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold">Serveur</h2>
                <p className="text-sm text-gray-500">{systemInfo?.server.os}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">CPU</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${systemInfo?.server.cpuUsage}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{systemInfo?.server.cpuUsage}% utilisé</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Mémoire</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${systemInfo?.server.memoryUsage}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{systemInfo?.server.memoryUsage}% utilisé</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Espace disque</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{
                      width: `${(systemInfo?.server.diskSpace.used || 0) / (systemInfo?.server.diskSpace.total || 1) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>{formatBytes(systemInfo?.server.diskSpace.used || 0)} utilisé</span>
                  <span>{formatBytes(systemInfo?.server.diskSpace.free || 0)} libre</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cache">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <HardDrive className="h-8 w-8 text-orange-500" />
              <div>
                <h2 className="text-xl font-semibold">Cache système</h2>
                <p className="text-sm text-gray-500">Type: {systemInfo?.cache.type}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Taille du cache</p>
                <p className="text-2xl font-semibold">{formatBytes(systemInfo?.cache.size || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux de succès</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-semibold">{systemInfo?.cache.hitRate}%</p>
                  <p className="text-sm text-gray-500 mb-1">hits</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => {/* Vider le cache */}}>
                Vider le cache
              </Button>
              <Button variant="outline" onClick={() => {/* Optimiser le cache */}}>
                Optimiser
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Mail className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold">Configuration email</h2>
                <p className="text-sm text-gray-500">Provider: {systemInfo?.email.provider}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  systemInfo?.email.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm">
                  {systemInfo?.email.status === 'ok' ? 'Système email opérationnel' : 'Problème détecté'}
                </span>
              </div>

              {systemInfo?.email.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-sm font-medium">Dernière erreur</p>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{systemInfo.email.lastError}</p>
                </div>
              )}

              <div className="mt-6">
                <Button onClick={() => {/* Envoyer email test */}}>
                  Envoyer un email test
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-semibold">Sécurité</h2>
                <p className="text-sm text-gray-500">
                  Dernier scan: {new Date(systemInfo?.security.lastScan || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Certificat SSL</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    new Date(systemInfo?.security.sslExpiry || '').getTime() - Date.now() > 30 * 24 * 60 * 60 * 1000
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    Expire le {new Date(systemInfo?.security.sslExpiry || '').toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Vulnérabilités détectées</p>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${
                    systemInfo?.security.vulnerabilities === 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {systemInfo?.security.vulnerabilities}
                  </span>
                  {systemInfo?.security?.vulnerabilities !== undefined && 
                    systemInfo.security.vulnerabilities > 0 && (
                      <Button variant="destructive" size="sm">
                        Voir les détails
                      </Button>
                    )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => {/* Lancer scan sécurité */}}>
                  Lancer un scan
                </Button>
                <Button variant="outline" onClick={() => {/* Télécharger rapport */}}>
                  Télécharger le rapport
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 