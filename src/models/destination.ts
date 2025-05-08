import { useState } from 'react';

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