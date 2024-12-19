import { DateRange } from "react-day-picker";

export interface CustomerFilters {
  dateRange?: DateRange;
  status?: string;
  spentRange?: { min: number; max: number };
  orderCount?: string;
  totalSpent?: string;
}