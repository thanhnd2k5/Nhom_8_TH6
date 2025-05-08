import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';

export default () => {
  const [itineraryList, setItineraryList] = useState<any[]>([]);

  // Lấy danh sách lịch trình từ localStorage
  const getItineraries = useCallback(() => {
    const saved = localStorage.getItem('itineraryList');
    const list = saved ? JSON.parse(saved) : [];
    setItineraryList(list);
    return list;
  }, []);

  // Thêm lịch trình mới
  const addItinerary = useCallback((itinerary) => {
    const newItinerary = {
      id: uuidv4(),
      ...itinerary,
      destinations: []
    };
    const newList = [...itineraryList, newItinerary];
    localStorage.setItem('itineraryList', JSON.stringify(newList));
    setItineraryList(newList);
    message.success(`Đã tạo lịch trình "${itinerary.name}"`);
    return newItinerary;
  }, [itineraryList]);

  // Xóa lịch trình
  const removeItinerary = useCallback((id) => {
    const newList = itineraryList.filter(item => item.id !== id);
    localStorage.setItem('itineraryList', JSON.stringify(newList));
    setItineraryList(newList);
    message.success('Đã xóa lịch trình');
    return newList;
  }, [itineraryList]);

  // Cập nhật lịch trình
  const updateItinerary = useCallback((updatedItinerary) => {
    const newList = itineraryList.map(item => 
      item.id === updatedItinerary.id ? updatedItinerary : item
    );
    localStorage.setItem('itineraryList', JSON.stringify(newList));
    setItineraryList(newList);
    message.success(`Đã cập nhật lịch trình "${updatedItinerary.name}"`);
    return newList;
  }, [itineraryList]);

  // Thêm điểm du lịch vào lịch trình
  const addDestination = useCallback((itineraryId, destination) => {
    const list = [...itineraryList];
    const idx = list.findIndex(item => item.id === itineraryId);
    
    if (idx !== -1) {
      if (!list[idx].destinations) list[idx].destinations = [];
      const newDestination = {
        id: uuidv4(),
        ...destination
      };
      list[idx].destinations.push(newDestination);
      localStorage.setItem('itineraryList', JSON.stringify(list));
      setItineraryList(list);
      message.success(`Đã thêm vào lịch trình "${list[idx].name}"`);
      return list;
    }
    return null;
  }, [itineraryList]);

  // Xóa điểm du lịch khỏi lịch trình
  const removeDestination = useCallback((itineraryId, destinationId) => {
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
  }, [itineraryList]);

  // Tính tổng chi phí của lịch trình
  const calculateTotalCost = useCallback((itineraryId) => {
    const itinerary = itineraryList.find(item => item.id === itineraryId);
    if (itinerary && itinerary.destinations) {
      return itinerary.destinations.reduce(
        (sum, dest) => sum + (dest.totalCost || 0), 0
      );
    }
    return 0;
  }, [itineraryList]);

  return {
    itineraryList,
    getItineraries,
    addItinerary,
    removeItinerary,
    updateItinerary,
    addDestination,
    removeDestination,
    calculateTotalCost
  };
};
