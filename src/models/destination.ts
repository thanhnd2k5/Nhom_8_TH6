import { useState } from 'react';

export interface Destination {
	id: string;
	name: string;
	description: string;
	visitDuration: string;
	foodCost: number;
	accommodationCost: number;
	transportCost: number;
	rating: number;
	image: string;
	longitude: number;
	latitude: number;
}

export default () => {
	const [data, setData] = useState<Destination[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Destination>();

	const getDestinations = () => {
		const dataLocal = JSON.parse(localStorage.getItem('destinations') as any) || [];
		setData(dataLocal);
	};

	return {
		data,
		visible,
		isEdit,
		row,
		setVisible,
		setIsEdit,
		setRow,
		getDestinations,
	};
}; 