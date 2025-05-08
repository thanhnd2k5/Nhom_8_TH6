import { Card, Row, Col, Rate, Typography, Image, Button, DatePicker, Modal, Form, Input, message, Select } from 'antd';
import { useModel, history } from 'umi';
import { useEffect, useState } from 'react';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text } = Typography;

const TrangChu = () => {
	const { data, getDestinations, addItinerary } = useModel('destination');
	const [selectedDestination, setSelectedDestination] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [itineraryList, setItineraryList] = useState<any[]>([]);

	useEffect(() => {
		getDestinations();
		const saved = localStorage.getItem('itineraryList');
		setItineraryList(saved ? JSON.parse(saved) : []);
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	const showAddModal = (destination: any) => {
		setSelectedDestination(destination);
		setIsModalVisible(true);
	};

	const handleAddToItinerary = (values: any) => {
		const newDestination = {
			id: uuidv4(),
			name: selectedDestination.name,
			description: values.notes || selectedDestination.description,
			duration: selectedDestination.visitDuration,
			foodCost: selectedDestination.foodCost,
			accommodationCost: selectedDestination.accommodationCost,
			transportCost: selectedDestination.transportCost,
			totalCost: selectedDestination.foodCost + selectedDestination.accommodationCost + selectedDestination.transportCost,
			date: values.date.format('YYYY-MM-DD'),
		};

		const list = JSON.parse(localStorage.getItem('itineraryList') || '[]');
		const idx = list.findIndex((item: any) => item.id === values.itineraryId);
		if (idx !== -1) {
			if (!list[idx].destinations) list[idx].destinations = [];
			list[idx].destinations.push(newDestination);
			localStorage.setItem('itineraryList', JSON.stringify(list));
			message.success(`Đã thêm vào lịch trình "${list[idx].name}"`);
		}
		setIsModalVisible(false);
		form.resetFields();
	};

	return (
		<div style={{ padding: '24px' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
				<Title level={2} style={{ margin: 0 }}>Khám phá điểm đến nổi bật</Title>
				<Button 
					type="primary" 
					icon={<CalendarOutlined />} 
					onClick={() => history.push('/itinerary')}
				>
					Quản lý lịch trình
				</Button>
			</div>
			
			<Row gutter={[24, 24]}>
				{data.map((destination) => (
					<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
						<Card
							hoverable
							cover={
								<Image
									alt={destination.name}
									src={destination.image || 'https://via.placeholder.com/300x200'}
									style={{ height: 200, objectFit: 'cover' }}
								/>
							}
							actions={[
								<Button 
									type="primary" 
									icon={<PlusOutlined />}
									onClick={() => showAddModal(destination)}
								>
									Thêm vào lịch trình
								</Button>
							]}
						>
							<Card.Meta
								title={destination.name}
								description={
									<>
										<Text style={{ display: 'block', marginBottom: 8 }}>
											{destination.description.length > 100 
												? `${destination.description.substring(0, 100)}...` 
												: destination.description}
										</Text>
										<Rate disabled defaultValue={destination.rating} style={{ fontSize: 14 }} />
										<div style={{ marginTop: 8 }}>
											<Text type="secondary">Thời gian: {destination.visitDuration}</Text>
										</div>
										<div style={{ marginTop: 8 }}>
											<Text strong>
												Tổng chi phí: {formatCurrency(
													destination.foodCost + destination.accommodationCost + destination.transportCost
												)}
											</Text>
										</div>
									</>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Modal
				title={`Thêm ${selectedDestination?.name || ''} vào lịch trình`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleAddToItinerary}
				>
					<Form.Item
						name="itineraryId"
						label="Chọn lịch trình"
						rules={[{ required: true, message: 'Vui lòng chọn lịch trình!' }]}
					>
						<Select placeholder="Chọn lịch trình">
							{itineraryList.map(item => (
								<Select.Option value={item.id} key={item.id}>
									{item.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					
					<Form.Item
						name="date"
						label="Chọn ngày"
						rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
					>
						<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
					</Form.Item>
					
					<Form.Item
						name="notes"
						label="Ghi chú"
					>
						<Input.TextArea rows={4} />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
							Thêm vào lịch trình
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default TrangChu;