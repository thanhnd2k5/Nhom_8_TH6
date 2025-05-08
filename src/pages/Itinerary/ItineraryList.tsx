import React, { useState } from 'react';
import { 
  Card, Typography, Button, Collapse, Row, Col, 
  Empty, Popconfirm, Divider, Timeline, Tag, 
  Modal, DatePicker, Form, Input, message
} from 'antd';
import { DeleteOutlined, CalendarOutlined, EditOutlined, CarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Destination, TravelType, travelTypeLabels } from '@/models/destination';

import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/vi';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale('vi');

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
  updateItineraryDate: (id: string, newDate: string) => void;
  updateItineraryNotes: (id: string, notes: string) => void;
  getDestinationById: (id: string) => Destination | undefined;
  calculateDistanceAndTime: (destination1Id: string, destination2Id: string) => { distance: number, travelTime: number };
  formatTravelTime: (hours: number) => string;
  calculateTotalCost: (date: string) => number;
  formatDate: (dateString: string) => string;
  formatCurrency: (value: number) => string;
  onAddDestination: () => void;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
  groupedItinerary,
  removeFromItinerary,
  updateItineraryDate,
  updateItineraryNotes,
  getDestinationById,
  calculateDistanceAndTime,
  formatTravelTime,
  calculateTotalCost,
  formatDate,
  formatCurrency,
  onAddDestination,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItineraryItem | null>(null);
  const [form] = Form.useForm();

  const showEditModal = (item: ItineraryItem) => {
    setCurrentItem(item);
    form.setFieldsValue({
      date: dayjs(item.date),
      notes: item.notes || '',
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    form.validateFields().then(values => {
      if (currentItem) {
        // Cập nhật ngày mới
        updateItineraryDate(currentItem.id, values.date.format('YYYY-MM-DD'));
        
        // Cập nhật ghi chú
        updateItineraryNotes(currentItem.id, values.notes);
        
        message.success('Đã cập nhật lịch trình thành công');
        setEditModalVisible(false);
      }
    });
  };
  
  // Hiển thị thông tin di chuyển giữa hai điểm đến
  const renderTravelInfo = (currentIndex: number, items: ItineraryItem[], date: string) => {
    if (currentIndex === 0) return null; // Không hiển thị cho điểm đến đầu tiên
    
    const prevItem = items[currentIndex - 1];
    const current_item = items[currentIndex];
    
    const { distance, travelTime } = calculateDistanceAndTime(
      prevItem.destinationId,
      current_item.destinationId
    );
    
    if (distance === 0) return null;
    
    return (
      <div style={{ 
        padding: '8px 0', 
        marginBottom: '16px', 
        textAlign: 'center',
        borderBottom: '1px dashed #f0f0f0'
      }}>
        <Tag color="cyan" icon={<CarOutlined />}>
          Di chuyển: {distance.toFixed(1)} km ({formatTravelTime(travelTime)})
        </Tag>
      </div>
    );
  };

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
                {groupedItinerary[date].map((item: ItineraryItem, index: number) => {
                  const destination = getDestinationById(item.destinationId);
                  return destination ? (
                    <React.Fragment key={item.id}>
                      {renderTravelInfo(index, groupedItinerary[date], date)}
                      <Timeline.Item label={destination.visitDuration}>
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
                            <div>
                              <Button 
                                type="primary" 
                                icon={<EditOutlined />} 
                                style={{ marginRight: 8 }}
                                onClick={() => showEditModal(item)}
                              />
                              <Popconfirm
                                title="Xóa khỏi lịch trình?"
                                onConfirm={() => removeFromItinerary(item.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                              >
                                <Button danger icon={<DeleteOutlined />} />
                              </Popconfirm>
                            </div>
                          </div>
                          
                          <Row gutter={16}>
                            <Col span={18}>
                              <Paragraph style={{ fontSize: '16px' }}>
                                {destination.description}
                              </Paragraph>
                              {item.notes && (
                                <>
                                  <Divider orientation="left">Ghi chú</Divider>
                                  <Paragraph>{item.notes}</Paragraph>
                                </>
                              )}
                              <div style={{ marginTop: 16 }}>
                                <Tag color="purple">Vĩ độ: {destination.latitude.toFixed(6)}</Tag>
                                <Tag color="purple" style={{ marginLeft: 8 }}>Kinh độ: {destination.longitude.toFixed(6)}</Tag>
                              </div>
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
                    </React.Fragment>
                  ) : null;
                })}
              </Timeline>
            </Panel>
          ))}
        </Collapse>
      )}

      {/* Modal Chỉnh sửa lịch trình */}
      <Modal
        title="Chỉnh sửa lịch trình"
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ItineraryList; 