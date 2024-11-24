 "use client";

import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsTable } from "@/components/dashboard/PaymentsTable";
import { PaymentsStats } from "@/components/dashboard/PaymentsStats";
import { PaymentsFilter } from "@/components/dashboard/PaymentsFilter";
// import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

export default function PaymentsPage() {
  const [dateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Tous les paiements</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="completed">Complétés</TabsTrigger>
            <TabsTrigger value="failed">Échoués</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {/* <DatePickerWithRange
              selected={dateRange}
              // onSelect={(range) => setDateRange(range)}
            /> */}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        <PaymentsStats />

        <TabsContent value="all" className="space-y-6">
          <PaymentsTable
            status="all"
            dateRange={dateRange}
            showFilters={showFilters}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <PaymentsTable
            status="pending"
            dateRange={dateRange}
            showFilters={showFilters}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <PaymentsTable
            status="completed"
            dateRange={dateRange}
            showFilters={showFilters}
          />
        </TabsContent>

        <TabsContent value="failed" className="space-y-6">
          <PaymentsTable
            status="failed"
            dateRange={dateRange}
            showFilters={showFilters}
          />
        </TabsContent>
      </Tabs>

      <PaymentsFilter open={showFilters} onOpenChange={setShowFilters} />
    </div>
  );
}