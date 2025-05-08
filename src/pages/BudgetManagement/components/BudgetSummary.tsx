import React from 'react';
import { Card, Row, Col, Typography, Alert } from 'antd';
import { BudgetSummary as BudgetSummaryType } from '../utils/calculateBudget';
import { formatCurrency, isOverBudget } from '../utils/calculateBudget';

const { Title, Text } = Typography;

interface BudgetSummaryProps {
  budgetData: BudgetSummaryType;
  plannedBudget: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgetData, plannedBudget }) => {
  const { eatTotal, moveTotal, stayTotal, total } = budgetData;
  const isOver = isOverBudget(total, plannedBudget);

  return (
    <Card title="Tổng hợp chi phí">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Title level={4}>Chi phí ăn uống</Title>
            <Text type="success" style={{ fontSize: 20 }}>
              {formatCurrency(eatTotal)}
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Title level={4}>Chi phí di chuyển</Title>
            <Text type="success" style={{ fontSize: 20 }}>
              {formatCurrency(moveTotal)}
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false}>
            <Title level={4}>Chi phí lưu trú</Title>
            <Text type="success" style={{ fontSize: 20 }}>
              {formatCurrency(stayTotal)}
            </Text>
          </Card>
        </Col>
        <Col xs={24}>
          <Card bordered={false}>
            <Title level={4}>Tổng chi phí: {formatCurrency(total)}</Title>
            <Title level={5}>Ngân sách: {formatCurrency(plannedBudget)}</Title>
            
            {plannedBudget > 0 && isOver && (
              <Alert
                message="Cảnh báo vượt ngân sách!"
                description={`Chi phí của bạn đã vượt quá ngân sách dự kiến ${formatCurrency(total - plannedBudget)}`}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BudgetSummary; 