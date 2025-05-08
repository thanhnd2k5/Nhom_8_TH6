import { useEffect } from 'react';
import { useModel, history } from 'umi';
import { 
  Card, Typography, Button, List, Collapse, Row, Col, 
  DatePicker, Empty, Popconfirm, Divider, Timeline, Tag, Modal, Form, Input
} from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, CalendarOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Itinerary = () => {
  const { data, getDestinations } = useModel('destination');
  const [itinerary, setItinerary] = useState([]);
  const [groupedItinerary, setGroupedItinerary] = useState<any>({});
  const [itineraryList, setItineraryList] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form] = Form.useForm();

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
    getItineraryData();
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

  // Lấy danh sách lịch trình từ localStorage
  const getItineraryList = () => {
    const saved = localStorage.getItem('itineraryList');
    setItineraryList(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    getItineraryList();
  }, []);

  // Thêm hoặc sửa lịch trình
  const handleOk = () => {
    form.validateFields().then(values => {
      let newList;
      const dateRange = values.dateRange
        ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')]
        : undefined;
      if (editingItem) {
        // Sửa
        newList = itineraryList.map(item =>
          item.id === editingItem.id
            ? { ...item, name: values.name, description: values.description, dateRange }
            : item
        );
      } else {
        // Thêm mới
        newList = [
          ...itineraryList,
          {
            id: uuidv4(),
            name: values.name,
            description: values.description,
            dateRange,
          }
        ];
      }
      localStorage.setItem('itineraryList', JSON.stringify(newList));
      setItineraryList(newList);
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    });
  };

  // Xoá lịch trình
  const handleDelete = (id: string) => {
    const newList = itineraryList.filter(item => item.id !== id);
    localStorage.setItem('itineraryList', JSON.stringify(newList));
    setItineraryList(newList);
  };

  // Mở modal thêm/sửa
  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: item?.name || '',
      description: item?.description || '',
      dateRange: item?.dateRange
        ? [dayjs(item.dateRange[0]), dayjs(item.dateRange[1])]
        : [],
    });
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm lịch trình
        </Button>
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