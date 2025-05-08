import React, { useState, useEffect } from 'react';
import { history, useModel } from 'umi';
import { Card, Typography, Row, Col, Spin, Button, Space, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

import BudgetChart from '../../components/BUDGET/BudgetChart';
import BudgetInput from '../../components/BUDGET/BudgetInput';
import BudgetSummary from '../../components/BUDGET/BudgetSummary';
import { calculateBudget } from '../../utils/calculateBudget';
import { BudgetDestination, BudgetResult } from '../../utils/budgetTypes';

const { Title } = Typography;

// Định nghĩa interface cho ItineraryListItem
interface ItineraryItem {
  id: string;
  destinationId: string;
  date: string;
  notes?: string;
}

const BudgetPage: React.FC = () => {
  const { data: destinations } = useModel('destination');
  const { itinerary } = useModel('itinerary');
  const [loading, setLoading] = useState<boolean>(true);
  const [expectedBudget, setExpectedBudget] = useState<number>(0);
  
  // Lấy ngân sách dự kiến từ localStorage khi component mount
  useEffect(() => {
    const storedBudget = localStorage.getItem('expectedBudget');
    if (storedBudget) {
      setExpectedBudget(Number(storedBudget));
    }
    getDestinations();
    setLoading(false);
  }, []);

  const getDestinations = () => {
    const saved = localStorage.getItem('destinations');
    if (!saved) return;
    const list = JSON.parse(saved);
    // destinations được cập nhật thông qua useModel
  };

  // Tính toán tổng chi phí từ tất cả lịch trình
  const getAllDestinations = (): BudgetDestination[] => {
    if (!itinerary || itinerary.length === 0 || !destinations || destinations.length === 0) {
      return [];
    }
    
    // Chuyển đổi dữ liệu từ destinations và itinerary thành BudgetDestination
    return itinerary.map((item: ItineraryItem) => {
      const destination = destinations.find(d => d.id === item.destinationId);
      if (destination) {
        return {
          id: destination.id,
          name: destination.name,
          foodCost: destination.foodCost || 0,
          accommodationCost: destination.accommodationCost || 0,
          transportCost: destination.transportCost || 0,
          otherCost: destination.otherCost || 0,
        } as BudgetDestination;
      }
      return null;
    }).filter(Boolean) as BudgetDestination[];
  };

  // Lưu ngân sách dự kiến vào localStorage
  const handleBudgetChange = (value: number) => {
    setExpectedBudget(value);
    localStorage.setItem('expectedBudget', String(value));
  };

  const budgetDestinations = getAllDestinations();
  const budgetData = calculateBudget(budgetDestinations);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý ngân sách</Breadcrumb.Item>
        </Breadcrumb>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2}>Quản lý ngân sách du lịch</Title>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push('/')}
          >
            Quay lại
          </Button>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <BudgetInput 
              expectedBudget={expectedBudget}
              onBudgetChange={handleBudgetChange}
            />
          </Col>
          <Col xs={24} md={16}>
            <BudgetSummary 
              budgetData={budgetData} 
              expectedBudget={expectedBudget}
            />
          </Col>
        </Row>
        
        <Card title="Phân tích ngân sách" hoverable style={{ marginTop: 16 }}>
          <BudgetChart budgetData={budgetData} />
        </Card>
      </Space>
    </div>
  );
};

export default BudgetPage; 