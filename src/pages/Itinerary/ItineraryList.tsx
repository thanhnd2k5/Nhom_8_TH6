import React from 'react';
import { 
  Card, Typography, Button, Collapse, Row, Col, 
  Empty, Popconfirm, Divider, Timeline, Tag
} from 'antd';
import { DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Destination, TravelType, travelTypeLabels } from '@/models/destination';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface ItineraryItem {
  id: string;
  destinationId: string;
  date: string;
  notes?: string;
}

interface ItineraryListProps {
  groupedItinerary: Record<string, ItineraryItem[]>;
  removeFromItinerary: (id: string) => void;
  getDestinationById: (id: string) => Destination | undefined;
  calculateTotalCost: (date: string) => number;
  formatDate: (dateString: string) => string;
  formatCurrency: (value: number) => string;
  onAddDestination: () => void;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
  groupedItinerary,
  removeFromItinerary,
  getDestinationById,
  calculateTotalCost,
  formatDate,
  formatCurrency,
  onAddDestination,
}) => {
  return (
    <>
      {Object.keys(groupedItinerary).length === 0 ? (
        <Empty
          description="Chưa có lịch trình nào được tạo"
          style={{ margin: '100px 0' }}
        >
          <Button type="primary" onClick={onAddDestination}>
            Thêm địa điểm vào lịch trình
          </Button>
        </Empty>
      ) : (
        <Collapse defaultActiveKey={Object.keys(groupedItinerary)}>
          {Object.keys(groupedItinerary).map((date) => (
            <Panel 
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span><CalendarOutlined /> {formatDate(date)}</span>
                  <span>Tổng chi phí: {formatCurrency(calculateTotalCost(date))}</span>
                </div>
              }
              key={date}
            >
              <Timeline mode="left">
                {groupedItinerary[date].map((item: ItineraryItem) => {
                  const destination = getDestinationById(item.destinationId);
                  return destination ? (
                    <Timeline.Item key={item.id} label={destination.visitDuration}>
                      <Card 
                        style={{ marginBottom: '16px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Title level={4}>
                            {destination.name}
                            {destination.type && (
                              <Tag color="blue" style={{ marginLeft: 8 }}>
                                {travelTypeLabels[destination.type as TravelType]}
                              </Tag>
                            )}
                          </Title>
                          <Popconfirm
                            title="Xóa khỏi lịch trình?"
                            onConfirm={() => removeFromItinerary(item.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                          >
                            <Button danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                        
                        <Row gutter={16}>
                          <Col span={18}>
                            <Paragraph>
                              {destination.description}
                            </Paragraph>
                            {item.notes && (
                              <>
                                <Divider orientation="left">Ghi chú</Divider>
                                <Paragraph>{item.notes}</Paragraph>
                              </>
                            )}
                          </Col>
                          <Col span={6}>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color="blue">Thời gian: {destination.visitDuration}</Tag>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color="green">Ăn uống: {formatCurrency(destination.foodCost)}</Tag>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color="purple">Chỗ ở: {formatCurrency(destination.accommodationCost)}</Tag>
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <Tag color="orange">Di chuyển: {formatCurrency(destination.transportCost)}</Tag>
                            </div>
                            <div>
                              <Tag color="red">Tổng: {formatCurrency(
                                destination.foodCost + destination.accommodationCost + destination.transportCost
                              )}</Tag>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Timeline.Item>
                  ) : null;
                })}
              </Timeline>
            </Panel>
          ))}
        </Collapse>
      )}
    </>
  );
};

export default ItineraryList; 