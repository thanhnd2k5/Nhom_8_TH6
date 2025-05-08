// src/pages/Itinerary/Detail.tsximport { useParams, history } from 'umi';
import { useEffect, useState } from 'react';
import { Card, Tabs, Button, Typography, Empty, List, Tag, Modal, Form, Input, DatePicker } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { useModel } from 'umi';

const { Title } = Typography;
const { TabPane } = Tabs;

const ItineraryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    itineraryList, 
    getItineraries, 
    updateItinerary, 
    removeDestination,
    calculateTotalCost 
  } = useModel('itinerary');
  const { formatCurrency, formatDate } = useModel('utils');
  
  const [itinerary, setItinerary] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const list = getItineraries();
    const found = list.find((item: any) => item.id === id);
    setItinerary(found);
    if (found) setDestinations(found.destinations || []);
  }, [id]);

  const handleAddDestination = (values: any) => {
    const newDestination = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      date: values.date.format('YYYY-MM-DD'),
      // ... các trường khác
    };
    const updated = { ...itinerary, destinations: [...(itinerary.destinations || []), newDestination] };
    updateItinerary(updated);
    setIsAddModalVisible(false);
    form.resetFields();
  };

  if (!itinerary) {
    return <Empty description="Không tìm thấy lịch trình" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/itinerary')} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>
      <Title level={3}>{itinerary.name}</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý điểm du lịch" key="1">
          <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: 16 }}>
            Thêm điểm du lịch
          </Button>
          <List
            dataSource={destinations}
            renderItem={item => (
              <List.Item>
                <Card title={item.name} extra={item.date && <Tag color="blue">{item.date}</Tag>}>
                  <div>{item.description}</div>
                </Card>
              </List.Item>
            )}
          />
          <Modal
            title="Thêm điểm du lịch"
            visible={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onOk={() => form.submit()}
          >
            <Form form={form} layout="vertical" onFinish={handleAddDestination}>
              <Form.Item name="name" label="Tên điểm du lịch" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="date" label="Ngày">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
        <TabPane tab="Thống kê" key="2">
          <div style={{ minHeight: 200, padding: 24, background: '#fafafa', borderRadius: 8 }}>
            {destinations.length === 0 ? (
              <Empty description="Chưa có dữ liệu để thống kê." />
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <b>Tổng ngân sách:</b>{" "}
                  <span style={{ color: "#d4380d", fontWeight: 600 }}>
                    {calculateTotalCost(itinerary.id)}
                  </span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <b>Tổng số điểm du lịch:</b> {destinations.length}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <b>Tổng thời lượng (nếu có):</b>{" "}
                  {destinations
                    .map(d => d.duration)
                    .filter(Boolean)
                    .join(" + ") || "Chưa có dữ liệu"}
                </div>
                {/* Nếu có trường thời gian di chuyển riêng, ví dụ d.moveTime, thì cộng lại như sau: */}
                {/* <div>
                  <b>Tổng thời gian di chuyển:</b> {destinations.reduce((sum, d) => sum + (d.moveTime || 0), 0)} giờ
                </div> */}
              </>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ItineraryDetail;