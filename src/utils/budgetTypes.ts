import { Destination as BaseDestination } from '../models/destination';

// Mở rộng interface Destination để thêm thuộc tính otherCost
export interface BudgetDestination extends Partial<BaseDestination> {
  id: string;
  name: string;
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
  totalCost?: number;
  otherCost?: number;
  [key: string]: any; // Cho phép các thuộc tính khác
}

export interface BudgetResult {
  totalCost: number;
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
  otherCost: number;
  isOverBudget?: boolean;
  difference?: number;
}

export interface BudgetSummary extends BudgetResult {
  destinations: BudgetDestination[];
  expectedBudget: number;
} 