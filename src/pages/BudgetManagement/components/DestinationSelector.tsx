import React from 'react';
import { Card, Row, Col, Button, Tag } from 'antd';
import { DestinationBudget } from '../mock/scheduleData';
import { formatCurrency } from '../utils/calculateBudget';

interface DestinationSelectorProps {
  availableDestinations: DestinationBudget[];
  selectedDestinations: DestinationBudget[];
  onAddDestination: (id: string) => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  availableDestinations,
  selectedDestinations,
  onAddDestination
}) => {
  return (
    <Card title="Thêm điểm đến vào ngân sách" style={{ marginTop: 24 }}>
      <Row gutter={[16, 16]}>
        {availableDestinations.map((destination) => {
          const isSelected = selectedDestinations.some(item => item.id === destination.id);
          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={destination.id}>
              <Card 
                hoverable 
                cover={destination.image && (
                  <img 
                    alt={destination.name} 
                    src={destination.image} 
                    height={150} 
                    style={{ objectFit: 'cover' }} 
                  />
                )}
                actions={[
                  <Button
                    type="primary"
                    disabled={isSelected}
                    onClick={() => onAddDestination(destination.id)}
                  >
                    {isSelected ? 'Đã thêm' : 'Thêm vào ngân sách'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={destination.name}
                  description={
                    <>
                      <p>
                        {destination.description && destination.description.length > 50 
                          ? `${destination.description.substring(0, 50)}...` 
                          : destination.description}
                      </p>
                      <p>
                        <Tag color="green">
                          Tổng: {formatCurrency(
                            destination.eat + 
                            destination.move + 
                            destination.stay
                          )}
                        </Tag>
                      </p>
                    </>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default DestinationSelector; 