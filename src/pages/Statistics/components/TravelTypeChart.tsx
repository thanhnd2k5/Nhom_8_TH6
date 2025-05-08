import React from 'react';
import { Row, Col, Card } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';

interface TravelTypeChartProps {
  itineraryByType: { type: string; count: number }[];
}

const TravelTypeChart: React.FC<TravelTypeChartProps> = ({ itineraryByType }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
      <Col xs={24}>
        <Card title="Thống kê theo loại hình du lịch">
          <ColumnChart
            title="Số lượt lịch trình theo loại hình du lịch"
            xAxis={itineraryByType.map(t => t.type)}
            yAxis={[itineraryByType.map(t => t.count)]}
            yLabel={['Số lượt']}
            formatY={(val) => `${val} lượt`}
            colors={['#722ed1']}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default TravelTypeChart; 