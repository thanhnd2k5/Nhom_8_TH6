// src/pages/Itinerary/Detail.tsx
import React, { useEffect, useState } from 'react';
import { Tabs, Button, Typography, Empty, List, Form, Space } from 'antd';
import { ArrowLeftOutlined, MoneyCollectOutlined } from '@ant-design/icons';
import { useParams, useModel, history } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';

import DestinationCard from './components/DestinationCard';
import StatisticPanel from './components/StatisticPanel';
import AddDestinationModal from './components/AddDestinationModal';
import EditDestinationModal from './components/EditDestinationModal';

const { Title } = Typography;
const { TabPane } = Tabs;

// Định nghĩa interface cho Destination
interface Destination {
  id: string;
  name: string;
  description?: string;
  date: string;
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
  totalCost: number;
  duration?: string;
  [key: string]: any;
}

// Định nghĩa interface cho Itinerary
interface Itinerary {
  id: string;
  name: string;
  destinations: Destination[];
  [key: string]: any;
}

const ItineraryDetail = () => {const { id } = useParams<{ id: string }>();
  const { formatCurrency } = useModel('utils');
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [itineraryList, setItineraryList] = useState<Itinerary[]>([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Lấy danh sách lịch trình từ localStorage
  const getItineraries = () => {
    const saved = localStorage.getItem('itineraryList');
    const list: Itinerary[] = saved ? JSON.parse(saved) : [];
    setItineraryList(list);
    return list;
  };

  // Cập nhật lịch trình
  const updateItinerary = (updatedItinerary: Itinerary) => {
    const newList = itineraryList.map(item => 
      item.id === updatedItinerary.id ? updatedItinerary : item
    );
    localStorage.setItem('itineraryList', JSON.stringify(newList));
    setItineraryList(newList);
    message.success(`Đã cập nhật lịch trình "${updatedItinerary.name}"`);
    return newList;
  };

  // Xóa điểm du lịch khỏi lịch trình
  const removeDestination = (itineraryId: string, destinationId: string) => {
    const list = [...itineraryList];
    const idx = list.findIndex(item => item.id === itineraryId);
    
    if (idx !== -1 && list[idx].destinations) {
      list[idx].destinations = list[idx].destinations.filter(
        d => d.id !== destinationId
      );
      localStorage.setItem('itineraryList', JSON.stringify(list));
      setItineraryList(list);
      message.success('Đã xóa điểm du lịch');
      return list;
    }
    return null;
  };

  // Tính tổng chi phí của lịch trình
  const calculateTotalCost = (itineraryId: string) => {
    const itinerary = itineraryList.find(item => item.id === itineraryId);
    if (itinerary && itinerary.destinations) {
      return itinerary.destinations.reduce(
        (sum, dest) => sum + (dest.totalCost || 0), 
        0
      );
    }
    return 0;
  };

  useEffect(() => {
    const list = getItineraries();
    const found = list.find((item: Itinerary) => item.id === id);
    setItinerary(found || null);
    if (found) setDestinations(found.destinations || []);
  }, [id]);

  const handleAddDestination = (values: any) => {
    if (!itinerary) return;
    
    const newDestination: Destination = {
      id: uuidv4(),
      name: values.name,
      description: values.description,
      date: values.date.format('YYYY-MM-DD'),
      foodCost: values.foodCost || 0,
      accommodationCost: values.accommodationCost || 0,
      transportCost: values.transportCost || 0,
      totalCost: (values.foodCost || 0) + (values.accommodationCost || 0) + (values.transportCost || 0),
      duration: values.duration || 'N/A',
    };
    
    const updated = { 
      ...itinerary, 
      destinations: [...(itinerary.destinations || []), newDestination] 
    };
    
    updateItinerary(updated);
    setItinerary(updated);
    setDestinations(updated.destinations || []);
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleEditDestination = (values: any) => {
    if (!editingDestination || !itinerary) return;
    
    const totalCost = parseInt(values.foodCost || 0) + parseInt(values.accommodationCost || 0) + parseInt(values.transportCost || 0);
    
    const updatedDestinations = destinations.map(dest => 
      dest.id === editingDestination.id ? {
        ...dest,
        name: values.name,
        description: values.description,
        date: values.date.format('YYYY-MM-DD'),
        foodCost: values.foodCost || 0,
        accommodationCost: values.accommodationCost || 0,
        transportCost: values.transportCost || 0,
        totalCost: totalCost,
        duration: values.duration || dest.duration,
      } : dest
    );
    
    const updated = { ...itinerary, destinations: updatedDestinations };
    updateItinerary(updated);
    setItinerary(updated);
    setDestinations(updatedDestinations);
    setIsEditModalVisible(false);
    setEditingDestination(null);
    editForm.resetFields();
  };

  const handleDeleteDestination = (destId: string) => {
    if (!itinerary) return;
    
    const result = removeDestination(itinerary.id, destId);
    if (result) {
      const updatedItinerary = result.find((item: Itinerary) => item.id === itinerary.id);
      setItinerary(updatedItinerary || null);
      setDestinations(updatedItinerary?.destinations || []);
    }
  };

  const showEditModal = (destination: Destination) => {
    setEditingDestination(destination);
    setIsEditModalVisible(true);
  };

  if (!itinerary) {
    return <Empty description="Không tìm thấy lịch trình" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => history.push('/itinerary')} 
          >
            Quay lại
          </Button>
        </div>
        <div>
          <Button 
            type="primary" 
            icon={<MoneyCollectOutlined />} 
            onClick={() => history.push('/budget')}
          >
            Quản lý ngân sách
          </Button>
        </div>
      </div>
      <Title level={3}>{itinerary.name}</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý điểm du lịch" key="1">
          <Button 
            type="primary" 
            onClick={() => setIsAddModalVisible(true)} 
            style={{ marginBottom: 16 }}
          >
            Thêm điểm du lịch
          </Button>
          
          {destinations.length === 0 ? (
            <Empty description="Chưa có điểm du lịch nào trong lịch trình này." />
          ) : (
            <List
              grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
              dataSource={destinations}
              renderItem={item => (
                <List.Item>
                  <DestinationCard
                    destination={item}
                    formatCurrency={formatCurrency}
                    onEdit={showEditModal}
                    onDelete={handleDeleteDestination}
                    editable
                  />
                </List.Item>
              )}
            />
          )}
          
          <AddDestinationModal
            visible={isAddModalVisible}
            form={form}
            onCancel={() => setIsAddModalVisible(false)}
            onFinish={handleAddDestination}
          />
          
          <EditDestinationModal
            visible={isEditModalVisible}
            form={editForm}
            destination={editingDestination}
            onCancel={() => {
              setIsEditModalVisible(false);
              setEditingDestination(null);
            }}
            onFinish={handleEditDestination}
          />
        </TabPane>
        
        <TabPane tab="Thống kê" key="2">
          <StatisticPanel
            destinations={destinations}
            formatCurrency={formatCurrency}
            totalCost={calculateTotalCost(itinerary.id)}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ItineraryDetail;