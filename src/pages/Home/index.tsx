import { Row, Col, Typography, Button, Form, message } from 'antd';
import { useModel, history } from 'umi';
import { useEffect, useState } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import DestinationCard from './components/DestinationCard';
import AddToItineraryModal from './components/AddToItineraryModal';

const { Title } = Typography;

const TrangChu = () => {
	const { data, getDestinations } = useModel('destination');
	const { 
		itineraryList, 
		getItineraries, 
		addDestination 
	} = useModel('itinerary');
	const { formatCurrency } = useModel('utils');
	
	const [selectedDestination, setSelectedDestination] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		getDestinations();
		getItineraries();
	}, []);

	const showAddModal = (destination: any) => {
		setSelectedDestination(destination);
		setIsModalVisible(true);
	};

	const handleAddToItinerary = (values: any) => {
		const newDestination = {
			name: selectedDestination.name,
			image: selectedDestination.image,
			description: values.notes || selectedDestination.description,
			duration: selectedDestination.visitDuration,
			foodCost: selectedDestination.foodCost,
			accommodationCost: selectedDestination.accommodationCost,
			transportCost: selectedDestination.transportCost,
			totalCost: selectedDestination.foodCost + selectedDestination.accommodationCost + selectedDestination.transportCost,
			date: values.date.format('YYYY-MM-DD'),
		};

		addDestination(values.itineraryId, newDestination);
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
						<DestinationCard 
							destination={destination}
							onAddToItinerary={showAddModal}
							formatCurrency={formatCurrency}
						/>
					</Col>
				))}
			</Row>

			<AddToItineraryModal
				visible={isModalVisible}
				destination={selectedDestination}
				form={form}
				itineraryList={itineraryList}
				onCancel={() => setIsModalVisible(false)}
				onFinish={handleAddToItinerary}
			/>
		</div>
	);
};

export default TrangChu;