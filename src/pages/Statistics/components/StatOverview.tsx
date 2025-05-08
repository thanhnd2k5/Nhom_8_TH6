import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CalendarOutlined, DollarOutlined, EnvironmentOutlined, FireOutlined } from '@ant-design/icons';
import { Destination } from '@/models/destination';

interface StatOverviewProps {
  filteredItinerariesCount: number;
  totalRevenue: number;
  destinationsCount: number;
  popularDestinationName: string;
  formatCurrency: (value: number) => string;
}

const StatOverview: React.FC<StatOverviewProps> = ({
  filteredItinerariesCount,
  totalRevenue,
  destinationsCount,
  popularDestinationName,
  formatCurrency
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng số lịch trình"
            value={filteredItinerariesCount}
            prefix={<CalendarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Tổng doanh thu"
            value={totalRevenue}
            formatter={(value) => formatCurrency(value as number)}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Số điểm đến"
            value={destinationsCount}
            prefix={<EnvironmentOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Điểm đến phổ biến nhất"
            value={popularDestinationName || 'Chưa có'}
            prefix={<FireOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatOverview; 