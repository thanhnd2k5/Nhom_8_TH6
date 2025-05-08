import React from 'react';
import { Row, Col, Card } from 'antd';
import DonutChart from '@/components/Chart/DonutChart';

interface CategoryChartsProps {
  popularDestinations: { name: string; count: number }[];
  expensesByCategory: { category: string; amount: number }[];
  formatCurrency: (value: number) => string;
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({
  popularDestinations,
  expensesByCategory,
  formatCurrency
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
      <Col xs={24} lg={12}>
        <Card title="Địa điểm phổ biến">
          <DonutChart
            title="Top 5 địa điểm phổ biến nhất"
            xAxis={popularDestinations.map(d => d.name)}
            yAxis={[popularDestinations.map(d => d.count)]}
            yLabel={['Lượt']}
            formatY={(val) => `${val} lượt`}
            showTotal={true}
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="Chi phí theo hạng mục">
          <DonutChart
            title="Phân bổ chi phí theo hạng mục"
            xAxis={expensesByCategory.map(e => e.category)}
            yAxis={[expensesByCategory.map(e => e.amount)]}
            yLabel={['Chi phí']}
            formatY={(val) => formatCurrency(val)}
            showTotal={true}
            colors={['#ffa39e', '#ffd666', '#91caff']}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CategoryCharts; 