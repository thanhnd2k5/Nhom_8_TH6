// src/pages/Itinerary/Detail.tsx
import React, { useEffect, useState } from 'react';
import { Tabs, Button, Typography, Empty, List, Form } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useModel, history } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import DestinationCard from './components/DestinationCard';
import StatisticPanel from './components/StatisticPanel';
import AddDestinationModal from './components/AddDestinationModal';
import EditDestinationModal from './components/EditDestinationModal';

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
  const { formatCurrency } = useModel('utils');
  
  const [itinerary, setItinerary] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    const list = getItineraries();
    const found = list.find((item: any) => item.id === id);
    setItinerary(found);
    if (found) setDestinations(found.destinations || []);
  }, [id, getItineraries]);

  const handleAddDestination = (values: any) => {
    const newDestination = {
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
    if (!editingDestination) return;
    
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
    const result = removeDestination(itinerary.id, destId);
    if (result) {
      const updatedItinerary = result.find(item => item.id === itinerary.id);
      setItinerary(updatedItinerary);
      setDestinations(updatedItinerary?.destinations || []);
    }
  };

  const showEditModal = (destination: any) => {
    setEditingDestination(destination);
    setIsEditModalVisible(true);
  };

  if (!itinerary) {
    return <Empty description="Không tìm thấy lịch trình" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => history.push('/itinerary')} 
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>
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