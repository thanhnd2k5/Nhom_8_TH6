import React from 'react';
import { Card, Typography, Image, Rate, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TravelType, travelTypeLabels } from '@/models/destination';

const { Text } = Typography;

interface DestinationCardProps {
  destination: any;
  onAddToItinerary: (destination: any) => void;
  formatCurrency: (value: number) => string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  onAddToItinerary,
  formatCurrency 
}) => {
  return (
    <Card
      hoverable
      cover={
        <Image
          alt={destination.name}
          src={destination.image || 'https://via.placeholder.com/300x200'}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => onAddToItinerary(destination)}
        >
          Thêm vào lịch trình
        </Button>
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{destination.name}</span>
            {destination.type && (
              <Tag color="blue">{travelTypeLabels[destination.type as TravelType]}</Tag>
            )}
          </div>
        }
        description={
          <>
            <Text style={{ display: 'block', marginBottom: 8 }}>
              {destination.description.length > 100 
                ? `${destination.description.substring(0, 100)}...` 
                : destination.description}
            </Text>
            <Rate disabled defaultValue={destination.rating} style={{ fontSize: 14 }} />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Thời gian: {destination.visitDuration}</Text>
            </div>
            <div style={{ marginTop: 8 }}>
              <Text strong>
                Tổng chi phí: {formatCurrency(
                  destination.foodCost + destination.accommodationCost + destination.transportCost
                )}
              </Text>
            </div>
          </>
        }
      />
    </Card>
  );
};

export default DestinationCard;
