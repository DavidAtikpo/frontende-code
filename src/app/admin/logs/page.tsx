"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
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
import { DateRangePicker as DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LoadingSpinner } from "@/components/ui/loading";

import { AlertTriangle, AlertCircle, Info, AlertOctagon } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { getCookie } from "cookies-next";

import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;

interface LogMetadata {
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  params?: Record<string, unknown>;
  // Ajoutez d'autres champs spécifiques si nécessaire
}

interface SystemLog {
  id: string;
  type: string;
  action: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  userId: string | null;
  metadata: LogMetadata;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });

  const fetchLogs = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        type: filter !== 'all' ? filter : '',
        startDate: dateRange?.from?.toISOString() || '',
        endDate: dateRange?.to?.toISOString() || ''
      });

      const response = await fetch(`${BASE_URL}/api/admin/logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${getCookie('token')}`,
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data.logs);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, dateRange]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'critical':
        return <AlertOctagon className="h-5 w-5 text-red-700" />;
      default:
        return null;
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Logs Système</h1>
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type de log" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="auth">Authentification</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="seller">Vendeurs</SelectItem>
              <SelectItem value="product">Produits</SelectItem>
              <SelectItem value="order">Commandes</SelectItem>
              <SelectItem value="payment">Paiements</SelectItem>
              <SelectItem value="system">Système</SelectItem>
              <SelectItem value="error">Erreurs</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sévérité</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(log.severity)}
                    {log.severity}
                  </div>
                </TableCell>
                <TableCell>{log.type}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="max-w-md truncate">
                  {log.description}
                </TableCell>
                <TableCell>
                  {log.user?.name || 'Système'}
                </TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 