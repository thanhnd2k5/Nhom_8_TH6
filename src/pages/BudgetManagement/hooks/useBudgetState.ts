import { useState, useEffect } from 'react';
import { DestinationBudget, scheduleData } from '../mock/scheduleData';
import { calculateBudget, BudgetSummary } from '../utils/calculateBudget';

interface BudgetState {
  plannedBudget: number;
  selectedDestinations: DestinationBudget[];
  availableDestinations: DestinationBudget[];
  budgetSummary: BudgetSummary;
  setPlannedBudget: (budget: number) => void;
  addDestination: (id: string) => void;
  removeDestination: (id: string) => void;
  saveBudget: () => void;
}

export const useBudgetState = (): BudgetState => {
  // Lấy dữ liệu từ localStorage hoặc dùng dữ liệu mặc định
  const getSavedBudget = (): number => {
    const saved = localStorage.getItem('plannedBudget');
    return saved ? parseFloat(saved) : 0;
  };

  const getSavedDestinations = (): DestinationBudget[] => {
    const saved = localStorage.getItem('selectedDestinations');
    return saved ? JSON.parse(saved) : [];
  };

  // State của component
  const [plannedBudget, setPlannedBudget] = useState<number>(getSavedBudget());
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationBudget[]>(getSavedDestinations());
  const [availableDestinations, setAvailableDestinations] = useState<DestinationBudget[]>(scheduleData);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>(calculateBudget(selectedDestinations));

  // Cập nhật tổng hợp chi phí khi danh sách điểm đến thay đổi
  useEffect(() => {
    const summary = calculateBudget(selectedDestinations);
    setBudgetSummary(summary);
  }, [selectedDestinations]);

  // Thêm điểm đến vào danh sách đã chọn
  const addDestination = (id: string) => {
    const destination = availableDestinations.find(dest => dest.id === id);
    if (destination && !selectedDestinations.some(item => item.id === id)) {
      const newSelectedDestinations = [...selectedDestinations, destination];
      setSelectedDestinations(newSelectedDestinations);
      localStorage.setItem('selectedDestinations', JSON.stringify(newSelectedDestinations));
    }
  };

  // Xóa điểm đến khỏi danh sách đã chọn
  const removeDestination = (id: string) => {
    const newSelectedDestinations = selectedDestinations.filter(item => item.id !== id);
    setSelectedDestinations(newSelectedDestinations);
    localStorage.setItem('selectedDestinations', JSON.stringify(newSelectedDestinations));
  };

  // Lưu ngân sách
  const saveBudget = () => {
    localStorage.setItem('plannedBudget', plannedBudget.toString());
  };

  return {
    plannedBudget,
    selectedDestinations,
    availableDestinations,
    budgetSummary,
    setPlannedBudget,
    addDestination,
    removeDestination,
    saveBudget
  };
}; 