import React from 'react';
import { Row, Col, Card } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';

interface MonthlyChartsProps {
  monthlyItineraries: number[];
  monthlyRevenue: number[];
  formatCurrency: (value: number) => string;
}

const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const MonthlyCharts: React.FC<MonthlyChartsProps> = ({
  monthlyItineraries,
  monthlyRevenue,
  formatCurrency
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Lịch trình theo tháng">
          <ColumnChart
            title="Số lượt lịch trình theo tháng"
            xAxis={MONTHS}
            yAxis={[monthlyItineraries]}
            yLabel={['Số lượt']}
            formatY={(val) => `${val} lượt`}
            colors={['#1890ff']}
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Chi phí theo tháng">
          <LineChart
            title="Doanh thu theo tháng"
            xAxis={MONTHS}
            yAxis={[monthlyRevenue]}
            yLabel={['Doanh thu']}
            formatY={(val) => formatCurrency(val)}
            colors={['#52c41a']}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default MonthlyCharts; 