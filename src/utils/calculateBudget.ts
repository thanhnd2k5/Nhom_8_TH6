import { BudgetDestination, BudgetResult, BudgetSummary } from './budgetTypes';

/**
 * Hàm tính toán ngân sách dựa trên danh sách điểm đến
 * @param destinations Danh sách các điểm đến
 * @returns Kết quả tính toán ngân sách
 */
export const calculateBudget = (destinations: BudgetDestination[]): BudgetResult => {
  if (!destinations || destinations.length === 0) {
    return {
      totalCost: 0,
      foodCost: 0,
      accommodationCost: 0,
      transportCost: 0,
      otherCost: 0
    };
  }

  const result: BudgetResult = {
    totalCost: 0,
    foodCost: 0,
    accommodationCost: 0,
    transportCost: 0,
    otherCost: 0
  };

  destinations.forEach(destination => {
    result.foodCost += destination.foodCost || 0;
    result.accommodationCost += destination.accommodationCost || 0;
    result.transportCost += destination.transportCost || 0;
    // Nếu có chi phí khác thì cộng vào otherCost
    if (destination.otherCost) {
      result.otherCost += destination.otherCost;
    }
  });

  result.totalCost = result.foodCost + result.accommodationCost + result.transportCost + result.otherCost;

  return result;
};

/**
 * So sánh ngân sách thực tế với ngân sách dự kiến
 * @param actualBudget Ngân sách thực tế
 * @param expectedBudget Ngân sách dự kiến
 * @returns Kết quả so sánh ngân sách
 */
export const compareBudget = (actualBudget: number, expectedBudget: number): { isOverBudget: boolean; difference: number } => {
  const difference = actualBudget - expectedBudget;
  return {
    isOverBudget: difference > 0,
    difference: Math.abs(difference)
  };
};

export default calculateBudget;
