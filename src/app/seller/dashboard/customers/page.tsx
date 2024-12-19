"use client";

import { useState, useEffect } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CustomersFilterDialog } from "@/components/dashboard/CustomersFilterDialog";
import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { DateRange } from "react-day-picker";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
  lastOrder?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface CustomerStats {
  totalCustomers: number;
  averageOrderValue: number;
  totalOrders: number;
}

interface CustomerFilters {
  dateRange?: DateRange;
  status?: string;
  spentRange?: { min: number; max: number };
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const fetchCustomers = async (): Promise<ApiResponse<Customer[]>> => {
    try {
      const res = await fetch('/api/seller/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
        return { data: data.data, status: 200 };
      }
      return { data: [], status: 400 };
    } catch (error) {
      console.error(error);
      return { data: [], status: 500 };
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/seller/customers/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (filters: CustomerFilters) => {
    console.log(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clients</h2>
          <p className="text-muted-foreground">
            Gérez vos clients et suivez leurs activités
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangePicker
            value={date}
            onChange={setDate}
          />
          <CustomersFilterDialog 
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            onFilter={handleFilter}
          />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-muted-foreground">Total Clients</h3>
            <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-muted-foreground">Commande Moyenne</h3>
            <p className="text-2xl font-bold">{stats.averageOrderValue} FCFA</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-muted-foreground">Total Commandes</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>
      )}

      <CustomersTable 
        data={customers} 
        isLoading={loading}
        currentPage={1}
        totalPages={1}
        onPageChange={(page) => {
          // Gérer le changement de page
        }}
      />
    </div>
  );
}



