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

export interface Itinerary {
	id: string;
	name: string;
	description: string;
	duration: string;
	totalCost: number;
	destinationIds: string[];
}


export default () => {
	const [data, setData] = useState<Destination[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<Destination>();
	const [itinerary, setItinerary] = useState<Itinerary[]>([]);

	const getDestinations = () => {
		const dataLocal = JSON.parse(localStorage.getItem('destinations') as any) || [];
		setData(dataLocal);
	};

	const getItinerary = () => {
		const dataLocal = JSON.parse(localStorage.getItem('itinerary') as any) || [];
		setItinerary(dataLocal);
	};

	const addItinerary = (item: Itinerary) => {
		const newItinerary = [...itinerary, item];
		setItinerary(newItinerary);
		localStorage.setItem('itinerary', JSON.stringify(newItinerary));
	};

	const removeItinerary = (id: string) => {
		const newItinerary = itinerary.filter((item: Itinerary) => item.id !== id);
		setItinerary(newItinerary);
		localStorage.setItem('itinerary', JSON.stringify(newItinerary));
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
		getItinerary,
		addItinerary,
		removeItinerary,
	};
}; 