import React from 'react';
import { Card, Table, Typography, Alert, Space, Statistic, Row, Col, Divider } from 'antd';
import { BudgetResult } from '../../utils/budgetTypes';
import { compareBudget } from '../../utils/calculateBudget';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface BudgetSummaryProps {
  budgetData: BudgetResult;
  expectedBudget: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgetData, expectedBudget }) => {
  const { totalCost, foodCost, accommodationCost, transportCost, otherCost } = budgetData;
  const { isOverBudget, difference } = compareBudget(totalCost, expectedBudget);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const columns = [
    {
      title: 'Loại chi phí',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Chi phí',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Phần trăm',
      dataIndex: 'percent',
      key: 'percent',
      render: (percent: number) => `${percent.toFixed(1)}%`,
    },
  ];

  const data = [
    {
      key: '1',
      type: 'Ăn uống',
      amount: foodCost,
      percent: totalCost ? (foodCost / totalCost) * 100 : 0,
    },
    {
      key: '2',
      type: 'Lưu trú',
      amount: accommodationCost,
      percent: totalCost ? (accommodationCost / totalCost) * 100 : 0,
    },
    {
      key: '3',
      type: 'Di chuyển',
      amount: transportCost,
      percent: totalCost ? (transportCost / totalCost) * 100 : 0,
    },
    {
      key: '4',
      type: 'Chi phí khác',
      amount: otherCost,
      percent: totalCost ? (otherCost / totalCost) * 100 : 0,
    },
  ];

  return (
    <Card hoverable>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>Tổng hợp ngân sách</Title>
        
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Statistic
              title="Tổng chi phí thực tế"
              value={totalCost}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Col>
          <Col xs={24} md={12}>
            <Statistic
              title="Ngân sách dự kiến"
              value={expectedBudget}
              precision={0}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Col>
        </Row>

        <Divider style={{ margin: '16px 0' }} />
        
        {expectedBudget > 0 && (
          <Alert
            message={
              isOverBudget 
                ? `Vượt ngân sách ${formatCurrency(difference)}` 
                : `Còn dư ${formatCurrency(difference)}`
            }
            type={isOverBudget ? "warning" : "success"}
            showIcon
            icon={isOverBudget ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        <Table 
          dataSource={data} 
          columns={columns} 
          pagination={false} 
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}><strong>Tổng cộng</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{formatCurrency(totalCost)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>100%</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
         
        />
      </Space>
    </Card>
  );
};

export default BudgetSummary; 