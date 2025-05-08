import { DestinationBudget } from '../mock/scheduleData';

export interface BudgetSummary {
  eatTotal: number;
  moveTotal: number;
  stayTotal: number;
  total: number;
}

/**
 * Tính tổng chi phí các hạng mục từ danh sách điểm đến
 * @param destinations Danh sách các điểm đến
 * @returns Tổng hợp ngân sách các hạng mục
 */
export const calculateBudget = (destinations: DestinationBudget[]): BudgetSummary => {
  if (!destinations || destinations.length === 0) {
    return {
      eatTotal: 0,
      moveTotal: 0,
      stayTotal: 0,
      total: 0
    };
  }
  
  const eatTotal = destinations.reduce((sum, dest) => sum + dest.eat, 0);
  const moveTotal = destinations.reduce((sum, dest) => sum + dest.move, 0);
  const stayTotal = destinations.reduce((sum, dest) => sum + dest.stay, 0);
  const total = eatTotal + moveTotal + stayTotal;
  
  return {
    eatTotal,
    moveTotal,
    stayTotal,
    total
  };
};

/**
 * Kiểm tra xem tổng chi phí có vượt quá ngân sách hay không
 * @param total Tổng chi phí
 * @param budget Ngân sách dự kiến
 * @returns true nếu chi phí vượt ngân sách, false nếu không
 */
export const isOverBudget = (total: number, budget: number): boolean => {
  if (budget <= 0) return false;
  return total > budget;
};

/**
 * Format số thành định dạng tiền tệ Việt Nam
 * @param value Số tiền cần format
 * @returns Chuỗi đã được format theo định dạng tiền tệ VND
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}; 