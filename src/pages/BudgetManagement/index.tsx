import React from 'react';
import { Typography, Row, Col } from 'antd';
import BudgetForm from './components/BudgetForm';
import BudgetSummary from './components/BudgetSummary';
import BudgetChart from './components/BudgetChart';
import DestinationList from './components/DestinationList';
import DestinationSelector from './components/DestinationSelector';
import { useBudgetState } from './hooks/useBudgetState';

const { Title } = Typography;

const BudgetManagementPage: React.FC = () => {
  const { 
    plannedBudget,
    selectedDestinations,
    availableDestinations,
    budgetSummary,
    setPlannedBudget,
    addDestination,
    removeDestination,
    saveBudget
  } = useBudgetState();

  const handleBudgetChange = (value: number) => {
    setPlannedBudget(value);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Quản lý ngân sách du lịch</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <BudgetForm 
            budget={plannedBudget} 
            onBudgetChange={handleBudgetChange} 
            onSaveBudget={saveBudget} 
          />
        </Col>

        <Col xs={24} lg={16}>
          <BudgetSummary 
            budgetData={budgetSummary} 
            plannedBudget={plannedBudget} 
          />
        </Col>
      </Row>

      <BudgetChart 
        budgetData={budgetSummary} 
        plannedBudget={plannedBudget} 
      />

      <DestinationList 
        destinations={selectedDestinations}
        onRemoveDestination={removeDestination}
      />

      <DestinationSelector
        availableDestinations={availableDestinations}
        selectedDestinations={selectedDestinations}
        onAddDestination={addDestination}
      />
    </div>
  );
};

export default BudgetManagementPage; 