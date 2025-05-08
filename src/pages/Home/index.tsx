import { Row, Col, Typography, Button, Empty, Card } from 'antd';
import { useModel, history } from 'umi';
import { useEffect, useState, useMemo } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { Destination } from '@/models/destination';
import DestinationCard from './components/DestinationCard';
import AddToItineraryModal from './components/AddToItineraryModal';
import FilterSection from './components/FilterSection';

const { Title } = Typography;

interface ItineraryItem {
	id: string;
	destinationId: string;
	date: string;
	notes?: string;
}

const TrangChu = () => {
	const { data, getDestinations } = useModel('destination');
	const { 
		filters, 
		updateTypes, 
		updatePriceRange, 
		updateRatingRange, 
		updateSortBy, 
		updateSortDirection, 
		resetFilters,
		calculateTotalCost,
		getMaxPrice,
		applyFiltersAndSort 
	} = useModel('filter');
	const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

	useEffect(() => {
		getDestinations();
		const savedItinerary = localStorage.getItem('itinerary');
		if (savedItinerary) {
			try {
				setItinerary(JSON.parse(savedItinerary));
			} catch (e) {
				console.error('Lỗi khi đọc dữ liệu lịch trình:', e);
			}
		}
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	const showAddModal = (destination: Destination) => {
		setSelectedDestination(destination);
		setIsModalVisible(true);
	};

	const handleAddToItinerary = (values: any) => {
		if (!selectedDestination) return;
		
		const newItem: ItineraryItem = {
			id: uuidv4(),
			destinationId: selectedDestination.id,
			date: values.date.format('YYYY-MM-DD'),
			notes: values.notes
		};
		
		const newItinerary = [...itinerary, newItem];
		setItinerary(newItinerary);
		localStorage.setItem('itinerary', JSON.stringify(newItinerary));
		
		setIsModalVisible(false);
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
	};

	// Calculate max price for slider
	const maxPrice = useMemo(() => getMaxPrice(data), [data, getMaxPrice]);
	
	// Apply filters and sorting to get processed data
	const sortedData = useMemo(() => applyFiltersAndSort(data), [data, applyFiltersAndSort]);

	// Handle filter reset
	const handleResetFilters = () => {
		resetFilters([0, maxPrice]);
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
			
			{/* Filter Section */}
			<FilterSection 
				filters={filters}
				maxPrice={maxPrice}
				updateTypes={updateTypes}
				updatePriceRange={updatePriceRange}
				updateRatingRange={updateRatingRange}
				updateSortBy={updateSortBy}
				updateSortDirection={updateSortDirection}
				resetFilters={handleResetFilters}
				formatCurrency={formatCurrency}
			/>
			
			<Row gutter={[24, 24]}>
				{sortedData.length > 0 ? (
					sortedData.map((destination) => (
						<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
							<DestinationCard 
								destination={destination}
								onAddToItinerary={() => showAddModal(destination)}
								formatCurrency={formatCurrency}
							/>
						</Col>
					))
				) : (
					<Col span={24}>
						<Card>
							<Empty description="Không tìm thấy điểm đến phù hợp với bộ lọc của bạn" />
							<Button type="primary" onClick={handleResetFilters} style={{ marginTop: 16 }}>
								Đặt lại bộ lọc
							</Button>
						</Card>
					</Col>
				)}
			</Row>

			{selectedDestination && (
				<AddToItineraryModal
					visible={isModalVisible}
					destination={selectedDestination}
					onClose={handleCloseModal}
					onSubmit={handleAddToItinerary}
				/>
			)}
		</div>
	);
};

export default TrangChu;