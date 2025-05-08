import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ItineraryList from './ItineraryList';

const { Title } = Typography;

const Itinerary = () => {
  const { getDestinations } = useModel('destination');
  const { 
    groupedItinerary, 
    removeFromItinerary, 
    getDestinationById, 
    calculateTotalCost, 
    formatDate, 
    formatCurrency, 
    getItineraryData 
  } = useModel('itinerary');

  useEffect(() => {
    getDestinations();
    getItineraryData();
  }, []);

  const handleAddDestination = () => {
    history.push('/');
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

      <ItineraryList
        groupedItinerary={groupedItinerary}
        removeFromItinerary={removeFromItinerary}
        getDestinationById={getDestinationById}
        calculateTotalCost={calculateTotalCost}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        onAddDestination={handleAddDestination}
      />
    </div>
  );
};

export default Itinerary; 