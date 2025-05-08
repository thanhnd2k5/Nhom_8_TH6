import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { 
  Card, Typography, Button, List, Collapse, Row, Col, 
  DatePicker, Empty, Popconfirm, Divider, Timeline, Tag
} from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Itinerary = () => {
  const { data, getDestinations } = useModel('destination');
  const [itinerary, setItinerary] = useState([]);
  const [groupedItinerary, setGroupedItinerary] = useState<any>({});

  const getItinerary = () => {
    const savedItinerary = localStorage.getItem('itinerary');
    setItinerary(savedItinerary ? JSON.parse(savedItinerary) : []);
  };

  const removeFromItinerary = (id) => {
    const newItinerary = itinerary.filter(item => item.id !== id);
    localStorage.setItem('itinerary', JSON.stringify(newItinerary));
    setItinerary(newItinerary);
  };

  useEffect(() => {
    getDestinations();
    getItinerary();
  }, []);

  useEffect(() => {
    const grouped = itinerary.reduce((acc: any, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    // Sắp xếp các ngày theo thứ tự tăng dần
    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      })
    );

    setGroupedItinerary(sortedGrouped);
  }, [itinerary]);

  const getDestinationById = (id: string) => {
    return data.find(destination => destination.id === id);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY (dddd)');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateTotalCost = (date: string) => {
    return itinerary
      .filter(item => item.date === date)
      .reduce((total, item) => {
        const destination = getDestinationById(item.destinationId);
        if (destination) {
          return total + destination.foodCost + destination.accommodationCost + destination.transportCost;
        }
        return total;
      }, 0);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/')}
            style={{ marginRight: '16px' }}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>Quản lý lịch trình du lịch</Title>
        </div>
      </div>

      {Object.keys(groupedItinerary).length === 0 ? (
        <Empty
          description="Chưa có lịch trình nào được tạo"
          style={{ margin: '100px 0' }}
        >
          <Button type="primary" onClick={() => history.push('/destination')}>
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
                {groupedItinerary[date].map((item: any) => {
                  const destination = getDestinationById(item.destinationId);
                  return destination ? (
                    <Timeline.Item key={item.id} label={destination.visitDuration}>
                      <Card 
                        style={{ marginBottom: '16px' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Title level={4}>{destination.name}</Title>
                          <Popconfirm
                            title="Xóa khỏi lịch trình?"
                            description="Bạn có chắc muốn xóa địa điểm này khỏi lịch trình?"
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
    </div>
  );
};

export default Itinerary; 