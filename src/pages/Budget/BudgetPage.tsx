import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Card, Typography, Row, Col, Spin, Button, Space, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';

import BudgetChart from '../../components/BUDGET/BudgetChart';
import BudgetInput from '../../components/BUDGET/BudgetInput';
import BudgetSummary from '../../components/BUDGET/BudgetSummary';
import { calculateBudget } from '../../utils/calculateBudget';
import { BudgetDestination, BudgetResult } from '../../utils/budgetTypes';

const { Title } = Typography;

// Định nghĩa interface cho ItineraryListItem
interface ItineraryListItem {
  id: string;
  name: string;
  destinations?: BudgetDestination[];
  [key: string]: any;
}

const BudgetPage: React.FC = () => {
  const [itineraryList, setItineraryList] = useState<ItineraryListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expectedBudget, setExpectedBudget] = useState<number>(0);
  
  // Lấy ngân sách dự kiến từ localStorage khi component mount
  useEffect(() => {
    const storedBudget = localStorage.getItem('expectedBudget');
    if (storedBudget) {
      setExpectedBudget(Number(storedBudget));
    }
    setLoading(false);
  }, []);

  // Lấy danh sách lịch trình từ localStorage khi component mount
  useEffect(() => {
    const getItineraries = () => {
      const saved = localStorage.getItem('itineraryList');
      const list = saved ? JSON.parse(saved) : [];
      setItineraryList(list);
    };
    
    getItineraries();
  }, []);

  // Tính toán tổng chi phí từ tất cả lịch trình
  const getAllDestinations = () => {
    if (!itineraryList || itineraryList.length === 0) return [];
    
    return itineraryList.flatMap((itinerary: ItineraryListItem) => 
      itinerary.destinations ? itinerary.destinations : []
    ) as BudgetDestination[];
  };

  // Lưu ngân sách dự kiến vào localStorage
  const handleBudgetChange = (value: number) => {
    setExpectedBudget(value);
    localStorage.setItem('expectedBudget', String(value));
  };

  const destinations = getAllDestinations();
  const budgetData = calculateBudget(destinations);

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