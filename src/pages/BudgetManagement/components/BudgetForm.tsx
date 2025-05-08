import React from 'react';
import { Card, InputNumber, Button, Space, Typography } from 'antd';
import { formatCurrency } from '../utils/calculateBudget';

const { Text } = Typography;

interface BudgetFormProps {
  budget: number;
  onBudgetChange: (value: number) => void;
  onSaveBudget: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  budget, 
  onBudgetChange, 
  onSaveBudget 
}) => {
  const handleBudgetChange = (value: number | null) => {
    onBudgetChange(value || 0);
  };

  return (
    <Card title="Nhập ngân sách">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>Nhập tổng ngân sách dự kiến:</Text>
        <InputNumber
          style={{ width: '100%' }}
          value={budget}
          onChange={handleBudgetChange}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => {
            const parsedValue = value?.replace(/\$\s?|(,*)/g, '');
            return parsedValue ? parseFloat(parsedValue) : 0;
          }}
          min={0}
          addonAfter="VNĐ"
        />
        {budget > 0 && (
          <Text type="secondary">
            Ngân sách dự kiến: {formatCurrency(budget)}
          </Text>
        )}
        <Button 
          type="primary" 
          onClick={onSaveBudget} 
          style={{ marginTop: 16 }}
        >
          Cập nhật ngân sách
        </Button>
      </Space>
    </Card>
  );
};

export default BudgetForm; 