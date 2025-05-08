declare module Budget {
	export interface Record {
		id: string;
		totalBudget: number;
		selectedDestinations: Destination.Record[];
		foodCostTotal: number;
		accommodationCostTotal: number;
		transportCostTotal: number;
		totalCost: number;
		createdAt: string;
		updatedAt: string;
	}
} 