import React, { useState, useEffect } from 'react';
import { Form, InputNumber, Button, Card, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface BudgetInputProps {
  expectedBudget?: number;
  onBudgetChange: (value: number) => void;
}

const BudgetInput: React.FC<BudgetInputProps> = ({ expectedBudget = 0, onBudgetChange }) => {
  const [form] = Form.useForm();
  const [budget, setBudget] = useState<number | null>(expectedBudget || null);
  
  useEffect(() => {
    if (expectedBudget) {
      setBudget(expectedBudget);
      form.setFieldsValue({ budget: expectedBudget });
    }
  }, [expectedBudget, form]);

  const onFinish = (values: { budget: number }) => {
    const newBudget = values.budget || 0;
    setBudget(newBudget);
    onBudgetChange(newBudget);
  };

  const formatter = (value: number | undefined) => 
    value ? `${value.toLocaleString('vi-VN')} ₫` : '';

  const parser = (value: string | undefined) => {
    if (!value) return 0;
    return Number(value.replace(/\D/g, ''));
  };

  return (
    <Card hoverable>
      <Title level={4}>Ngân sách dự kiến</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ budget }}
      >
        <Form.Item
          name="budget"
          rules={[
            { required: true, message: 'Vui lòng nhập ngân sách dự kiến' },
            { type: 'number', min: 0, message: 'Ngân sách không được âm' }
          ]}
        >
          <InputNumber
            placeholder="Nhập ngân sách dự kiến"
            style={{ width: '100%' }}
            formatter={formatter}
            parser={parser}
            min={0}
            step={1000}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Cập nhật ngân sách
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BudgetInput; 