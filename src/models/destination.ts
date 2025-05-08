import { useState } from 'react';
import 'antd/dist/antd.css';

export interface Destination {
	id: string;
	name: string;
	imageUrl: string;
	type: 'beach' | 'mountain' | 'city';
	rating: number;
	estimatedCost: number;
	description: string;
}

export type DestinationType = 'beach' | 'mountain' | 'city';

export interface DestinationFilter {
	type?: DestinationType;
	minCost?: number;
	maxCost?: number;
	minRating?: number;
}

export interface DestinationSort {
	field: 'name' | 'rating' | 'estimatedCost';
	order: 'asc' | 'desc';
}

export default () => {
	const [data, setData] = useState<Destination.Record[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Destination.Record>();

	const getDestinations = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('destinations') as any) || [];
		setData(dataLocal);
	};

	return {
		data,
		visible,
		setVisible,
		row,
		setRow,
		isEdit,
		setIsEdit,
		setData,
		getDestinations,
	};
}; 