import { Card, Row, Col, Rate, Typography, Image } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';

const { Title, Text } = Typography;

const TrangChu = () => {
	const { data, getDestinations } = useModel('destination');

	useEffect(() => {
		getDestinations();
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	return (
		<div style={{ padding: '24px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>Khám phá điểm đến nổi bật</Title>
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
		</div>
	);
};

export default TrangChu;
