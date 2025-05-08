import { useModel } from 'umi';
import { useState, useEffect } from 'react';
import { Destination } from './destination';
import dayjs from 'dayjs';

export interface ItineraryItem {
  id: string;
  destinationId: string;
  date: string;
  notes?: string;
}

export default () => {
  const { data } = useModel('destination');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [groupedItinerary, setGroupedItinerary] = useState<Record<string, ItineraryItem[]>>({});

  const getItineraryData = () => {
    const savedItinerary = localStorage.getItem('itinerary');
    setItinerary(savedItinerary ? JSON.parse(savedItinerary) : []);
  };

  useEffect(() => {
    getItineraryData();
  }, []);

  useEffect(() => {
    if (itinerary.length > 0) {
      const grouped = itinerary.reduce((acc: Record<string, ItineraryItem[]>, item: ItineraryItem) => {
        if (!acc[item.date]) {
          acc[item.date] = [];
        }
        acc[item.date].push(item);
        return acc;
      }, {});

      // Sort dates in ascending order
      const sortedGrouped = Object.fromEntries(
        Object.entries(grouped).sort(([dateA], [dateB]) => {
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        })
      );

      setGroupedItinerary(sortedGrouped);
    } else {
      setGroupedItinerary({});
    }
  }, [itinerary]);

  const removeFromItinerary = (id: string) => {
    const newItinerary = itinerary.filter(item => item.id !== id);
    localStorage.setItem('itinerary', JSON.stringify(newItinerary));
    setItinerary(newItinerary);
  };

  const updateItineraryDate = (id: string, newDate: string) => {
    const updatedItinerary = itinerary.map(item => {
      if (item.id === id) {
        return { ...item, date: newDate };
      }
      return item;
    });
    
    localStorage.setItem('itinerary', JSON.stringify(updatedItinerary));
    setItinerary(updatedItinerary);
  };

  const updateItineraryNotes = (id: string, notes: string) => {
    const updatedItinerary = itinerary.map(item => {
      if (item.id === id) {
        return { ...item, notes };
      }
      return item;
    });
    
    localStorage.setItem('itinerary', JSON.stringify(updatedItinerary));
    setItinerary(updatedItinerary);
  };

  const getDestinationById = (id: string): Destination | undefined => {
    return data.find(destination => destination.id === id);
  };

  // Hàm tính khoảng cách giữa hai điểm dựa trên tọa độ (công thức Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Khoảng cách tính bằng km
    return distance;
  };

  // Hàm tính thời gian di chuyển giữa hai điểm (giả định tốc độ trung bình 60 km/h)
  const calculateTravelTime = (distance: number): number => {
    const averageSpeed = 60; // km/h
    return distance / averageSpeed; // Thời gian di chuyển tính bằng giờ
  };

  // Hàm tính khoảng cách và thời gian di chuyển giữa hai điểm đến
  const calculateDistanceAndTime = (destination1Id: string, destination2Id: string) => {
    const destination1 = getDestinationById(destination1Id);
    const destination2 = getDestinationById(destination2Id);

    if (!destination1 || !destination2) {
      return {
        distance: 0,
        travelTime: 0
      };
    }

    const distance = calculateDistance(
      destination1.latitude, 
      destination1.longitude, 
      destination2.latitude, 
      destination2.longitude
    );

    const travelTime = calculateTravelTime(distance);

    return {
      distance,
      travelTime
    };
  };

  // Hàm định dạng thời gian di chuyển
  const formatTravelTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    
    if (h === 0) {
      return `${m} phút`;
    } else if (m === 0) {
      return `${h} giờ`;
    } else {
      return `${h} giờ ${m} phút`;
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY (dddd)');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const calculateTotalCost = (date: string) => {
    return itinerary
      .filter((item: ItineraryItem) => item.date === date)
      .reduce((total: number, item: ItineraryItem) => {
        const destination = getDestinationById(item.destinationId);
        if (destination) {
          return total + destination.foodCost + destination.accommodationCost + destination.transportCost;
        }
        return total;
      }, 0);
  };

  return {
    itinerary,
    groupedItinerary,
    getItineraryData,
    removeFromItinerary,
    updateItineraryDate,
    updateItineraryNotes,
    getDestinationById,
    calculateDistanceAndTime,
    formatTravelTime,
    formatDate,
    formatCurrency,
    calculateTotalCost,
  };
};