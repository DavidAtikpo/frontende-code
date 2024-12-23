"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LoadingSpinner } from "@/components/ui/loading";

import { Download, FileText, BarChart2, TrendingUp } from 'lucide-react';
import { DateRange } from "react-day-picker";
import { API_CONFIG } from "@/utils/config";
const { BASE_URL } = API_CONFIG;
import { getCookie } from "cookies-next";

export default function AdminReports() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  const generateReport = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/reports/generate?` + 
        `type=${type}&` +
        `startDate=${dateRange.from.toISOString()}&` +
        `endDate=${dateRange.to.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${getCookie('token')}`,
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${type}-${new Date().toISOString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const reports = [
    {
      title: "Rapport des ventes",
      description: "Analyse détaillée des ventes et revenus",
      icon: BarChart2,
      type: "sales"
    },
    {
      title: "Rapport des performances",
      description: "Métriques de performance et KPIs",
      icon: TrendingUp,
      type: "performance"
    },
    {
      title: "Rapport d'inventaire",
      description: "État des stocks et mouvements",
      icon: FileText,
      type: "inventory"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rapports</h1>
        <DatePickerWithRange
          value={dateRange}
          onChange={handleDateChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.type} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <report.icon className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => generateReport(report.type)}
            >
              <Download className="h-4 w-4 mr-2" />
              Générer le rapport
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
} 