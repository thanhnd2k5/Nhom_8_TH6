import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Slider, Rate, Space, Typography } from 'antd';
import { Destination, DestinationFilter, DestinationSort, DestinationType } from '../models/Destination';
import { destinationService } from '../services/destinationService';

const { Title } = Typography;
const { Option } = Select;

const Destinations: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filter, setFilter] = useState<DestinationFilter>({});
    const [sort, setSort] = useState<DestinationSort>({ field: 'name', order: 'asc' });

    useEffect(() => {
        const allDestinations = destinationService.getDestinations();
        const filteredAndSorted = destinationService.filterAndSortDestinations(
            allDestinations,
            filter,
            sort
        );
        setDestinations(filteredAndSorted);
    }, [filter, sort]);

    const handleTypeChange = (value: DestinationType) => {
        setFilter(prev => ({ ...prev, type: value }));
    };

    const handleCostChange = (value: [number, number]) => {
        setFilter(prev => ({
            ...prev,
            minCost: value[0],
            maxCost: value[1]
        }));
    };

    const handleRatingChange = (value: number) => {
        setFilter(prev => ({ ...prev, minRating: value }));
    };

    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-');
        setSort({ field: field as 'name' | 'rating' | 'estimatedCost', order: order as 'asc' | 'desc' });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                {/* Bộ lọc */}
                <Col xs={24} md={6}>
                    <Card title="Bộ lọc">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Title level={5}>Loại hình</Title>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Chọn loại hình"
                                    onChange={handleTypeChange}
                                    allowClear
                                >
                                    <Option value="beach">Biển</Option>
                                    <Option value="mountain">Núi</Option>
                                    <Option value="city">Thành phố</Option>
                                </Select>
                            </div>

                            <div>
                                <Title level={5}>Chi phí (VNĐ)</Title>
                                <Slider
                                    range
                                    min={0}
                                    max={5000000}
                                    step={100000}
                                    onChange={handleCostChange}
                                />
                            </div>

                            <div>
                                <Title level={5}>Đánh giá tối thiểu</Title>
                                <Rate
                                    allowHalf
                                    onChange={handleRatingChange}
                                />
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Danh sách điểm đến */}
                <Col xs={24} md={18}>
                    <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                        <Select
                            style={{ width: 200 }}
                            placeholder="Sắp xếp theo"
                            onChange={handleSortChange}
                            defaultValue="name-asc"
                        >
                            <Option value="name-asc">Tên A-Z</Option>
                            <Option value="name-desc">Tên Z-A</Option>
                            <Option value="rating-desc">Đánh giá cao nhất</Option>
                            <Option value="estimatedCost-asc">Giá thấp nhất</Option>
                            <Option value="estimatedCost-desc">Giá cao nhất</Option>
                        </Select>
                    </div>

                    <Row gutter={[16, 16]}>
                        {destinations.map(destination => (
                            <Col xs={24} sm={12} lg={8} key={destination.id}>
                                <Card
                                    hoverable
                                    cover={<img alt={destination.name} src={destination.imageUrl} />}
                                >
                                    <Card.Meta
                                        title={destination.name}
                                        description={
                                            <>
                                                <Rate disabled defaultValue={destination.rating} />
                                                <p>{destination.description}</p>
                                                <p>Chi phí ước tính: {destination.estimatedCost.toLocaleString('vi-VN')} VNĐ</p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Destinations; 