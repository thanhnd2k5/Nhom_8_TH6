import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Rate, Image, Typography, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel, history } from 'umi';
import FormDestination from './components/Form';
import { TravelType, travelTypeLabels } from '@/models/destination';
import { BarChartOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DestinationManagement = () => {
	const { data, getDestinations, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('destination');

	useEffect(() => {
		getDestinations();
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	const columns: IColumn<DestinationRecord>[] = [
		{
			title: 'Tên điểm đến',
			dataIndex: 'name',
			key: 'name',
			width: 150,
		},
		{
			title: 'Hình ảnh',
			dataIndex: 'image',
			key: 'image',
			width: 120,
			render: (image) => image ? <Image src={image} width={100} height={60} /> : 'Không có hình ảnh',
		},
		{
			title: 'Loại hình',
			dataIndex: 'type',
			key: 'type',
			width: 120,
			render: (type) => type ? (
				<Tag color="blue">{travelTypeLabels[type as TravelType]}</Tag>
			) : 'Chưa phân loại',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			width: 200,
			ellipsis: true,
		},
		{
			title: 'Thời gian tham quan',
			dataIndex: 'visitDuration',
			key: 'visitDuration',
			width: 150,
		},
		{
			title: 'Chi phí ăn uống',
			dataIndex: 'foodCost',
			key: 'foodCost',
			width: 150,
			render: (value) => formatCurrency(value),
		},
		{
			title: 'Chi phí lưu trú',
			dataIndex: 'accommodationCost',
			key: 'accommodationCost',
			width: 150,
			render: (value) => formatCurrency(value),
		},
		{
			title: 'Chi phí di chuyển',
			dataIndex: 'transportCost',
			key: 'transportCost',
			width: 150,
			render: (value) => formatCurrency(value),
		},
		{
			title: 'Tổng chi phí',
			key: 'totalCost',
			width: 150,
			render: (_, record) => {
				const total = record.foodCost + record.accommodationCost + record.transportCost;
				return <Text strong>{formatCurrency(total)}</Text>;
			},
		},
		{
			title: 'Tọa độ',
			key: 'coordinates',
			width: 150,
			render: (_, record) => {
				return (
					<div>
						<div>Kinh độ: {record.longitude || 'N/A'}</div>
						<div>Vĩ độ: {record.latitude || 'N/A'}</div>
					</div>
				);
			},
		},
		{
			title: 'Thao tác',
			width: 150,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
							type="primary"
							style={{ marginRight: 8 }}
						>
							Sửa
						</Button>
						<Button
							danger
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('destinations') as any) || [];
								const newData = dataLocal.filter((item: any) => item.id !== record.id);
								localStorage.setItem('destinations', JSON.stringify(newData));
								getDestinations();
							}}
						>
							Xóa
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
				<h2>Quản lý điểm đến du lịch</h2>
				<div>
					<Button
						type="primary"
						onClick={() => history.push('/statistics')}
						style={{ marginRight: 8 }}
						icon={<BarChartOutlined />}
					>
						Xem thống kê
					</Button>
					<Button
						type="primary"
						onClick={() => {
							setVisible(true);
							setIsEdit(false);
							setRow(undefined);
						}}
					>
						Thêm điểm đến mới
					</Button>
				</div>
			</div>

			<Table 
				dataSource={data} 
				columns={columns} 
				rowKey="id"
				scroll={{ x: 1500 }}
			/>

			<Modal
				destroyOnClose
				footer={false}
				title={isEdit ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
				width={800}
			>
				<FormDestination />
			</Modal>
		</div>
	);
};

export default DestinationManagement; 