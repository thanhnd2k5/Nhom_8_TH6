import { useState, useEffect } from 'react';
import { useModel } from 'umi';

export default () => {
	const [data, setData] = useState<Budget.Record | null>(null);
	const [totalBudget, setTotalBudget] = useState<number>(0);
	const [selectedDestinations, setSelectedDestinations] = useState<Destination.Record[]>([]);
	const { data: destinationData } = useModel('destination');
	
	// Tính toán tổng chi phí
	const calculateCosts = () => {
		if (selectedDestinations.length === 0) {
			return {
				foodCostTotal: 0,
				accommodationCostTotal: 0,
				transportCostTotal: 0,
				totalCost: 0
			};
		}
		
		const foodCostTotal = selectedDestinations.reduce((total, destination) => total + destination.foodCost, 0);
		const accommodationCostTotal = selectedDestinations.reduce((total, destination) => total + destination.accommodationCost, 0);
		const transportCostTotal = selectedDestinations.reduce((total, destination) => total + destination.transportCost, 0);
		const totalCost = foodCostTotal + accommodationCostTotal + transportCostTotal;
		
		return {
			foodCostTotal,
			accommodationCostTotal,
			transportCostTotal,
			totalCost
		};
	};
	
	// Lưu dữ liệu vào localStorage
	const saveBudget = () => {
		const costs = calculateCosts();
		const budgetData: Budget.Record = {
			id: data?.id || Date.now().toString(),
			totalBudget,
			selectedDestinations,
			...costs,
			createdAt: data?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		
		localStorage.setItem('budget', JSON.stringify(budgetData));
		setData(budgetData);
		return budgetData;
	};
	
	// Lấy dữ liệu từ localStorage
	const getBudget = () => {
		const budgetData = localStorage.getItem('budget');
		if (budgetData) {
			const parsedData: Budget.Record = JSON.parse(budgetData);
			setData(parsedData);
			setTotalBudget(parsedData.totalBudget);
			setSelectedDestinations(parsedData.selectedDestinations);
			return parsedData;
		}
		return null;
	};
	
	// Kiểm tra xem có vượt ngân sách hay không
	const isOverBudget = () => {
		if (!data) return false;
		return data.totalCost > data.totalBudget;
	};
	
	// Thêm điểm đến vào ngân sách
	const addDestination = (destination: Destination.Record) => {
		// Kiểm tra xem điểm đến đã được thêm vào chưa
		const exists = selectedDestinations.some(item => item.id === destination.id);
		if (!exists) {
			const newSelectedDestinations = [...selectedDestinations, destination];
			setSelectedDestinations(newSelectedDestinations);
			return newSelectedDestinations;
		}
		return selectedDestinations;
	};
	
	// Xóa điểm đến khỏi ngân sách
	const removeDestination = (destinationId: string) => {
		const newSelectedDestinations = selectedDestinations.filter(item => item.id !== destinationId);
		setSelectedDestinations(newSelectedDestinations);
		return newSelectedDestinations;
	};
	
	return {
		data,
		totalBudget,
		setTotalBudget,
		selectedDestinations,
		setSelectedDestinations,
		calculateCosts,
		saveBudget,
		getBudget,
		isOverBudget,
		addDestination,
		removeDestination
	};
}; 