import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import { TravelType, travelTypeLabels, Destination } from '@/models/destination';

export interface ItineraryItem {
  id: string;
  destinationId: string;
  date: string;
  notes?: string;
}

export const useStatistics = () => {
  const { data: destinations, getDestinations } = useModel('destination');
  const [itineraries, setItineraries] = useState<ItineraryItem[]>([]);
  const [year, setYear] = useState<number>(dayjs().year());
  
  // Thống kê
  const [monthlyItineraries, setMonthlyItineraries] = useState<number[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<{name: string, count: number}[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [expensesByCategory, setExpensesByCategory] = useState<{category: string, amount: number}[]>([]);
  const [itineraryByType, setItineraryByType] = useState<{type: string, count: number}[]>([]);

  // Định dạng tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    getDestinations();
    const savedItineraries = localStorage.getItem('itinerary');
    if (savedItineraries) {
      try {
        setItineraries(JSON.parse(savedItineraries));
      } catch (error) {
        console.error('Lỗi khi đọc dữ liệu lịch trình:', error);
      }
    }
  }, []);

  // Tạo thống kê khi dữ liệu thay đổi
  useEffect(() => {
    if (destinations.length > 0 && itineraries.length > 0) {
      generateStatistics();
    }
  }, [destinations, itineraries, year]);

  // Tạo các thống kê
  const generateStatistics = () => {
    // 1. Thống kê lịch trình theo tháng
    const monthlyStats = Array(12).fill(0);
    
    itineraries.forEach(itinerary => {
      const itineraryDate = dayjs(itinerary.date);
      if (itineraryDate.year() === year) {
        const month = itineraryDate.month(); // 0-11
        monthlyStats[month]++;
      }
    });
    setMonthlyItineraries(monthlyStats);

    // 2. Thống kê địa điểm phổ biến
    const destinationCounts: Record<string, number> = {};
    itineraries.forEach(itinerary => {
      if (!destinationCounts[itinerary.destinationId]) {
        destinationCounts[itinerary.destinationId] = 0;
      }
      destinationCounts[itinerary.destinationId]++;
    });

    const popularDests = Object.keys(destinationCounts)
      .map(id => {
        const destination = destinations.find(d => d.id === id);
        return {
          name: destination?.name || 'Không xác định',
          count: destinationCounts[id]
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setPopularDestinations(popularDests);

    // 3. Thống kê doanh thu (giả định doanh thu = tổng chi phí của tất cả lịch trình)
    let revenue = 0;
    const expensesByCat = [
      { category: 'Ăn uống', amount: 0 },
      { category: 'Lưu trú', amount: 0 },
      { category: 'Di chuyển', amount: 0 }
    ];

    itineraries.forEach(itinerary => {
      const destination = destinations.find(d => d.id === itinerary.destinationId);
      if (destination) {
        const itineraryDate = dayjs(itinerary.date);
        if (itineraryDate.year() === year) {
          const totalCost = destination.foodCost + destination.accommodationCost + destination.transportCost;
          revenue += totalCost;
          
          expensesByCat[0].amount += destination.foodCost;
          expensesByCat[1].amount += destination.accommodationCost;
          expensesByCat[2].amount += destination.transportCost;
        }
      }
    });

    setTotalRevenue(revenue);
    setExpensesByCategory(expensesByCat);

    // 4. Thống kê theo loại hình du lịch
    const typeCounts: Record<string, number> = {};
    
    itineraries.forEach(itinerary => {
      const destination = destinations.find(d => d.id === itinerary.destinationId);
      if (destination && destination.type) {
        const itineraryDate = dayjs(itinerary.date);
        if (itineraryDate.year() === year) {
          if (!typeCounts[destination.type]) {
            typeCounts[destination.type] = 0;
          }
          typeCounts[destination.type]++;
        }
      }
    });

    const typeStats = Object.keys(typeCounts).map(type => ({
      type: travelTypeLabels[type as TravelType] || type,
      count: typeCounts[type]
    }));

    setItineraryByType(typeStats);
  };

  // Lọc lịch trình theo năm hiện tại
  const filteredItineraries = itineraries.filter(i => dayjs(i.date).year() === year);
  
  // Tính doanh thu theo tháng
  const calculateMonthlyRevenue = () => {
    const monthlyRevenue = Array(12).fill(0);
    
    filteredItineraries.forEach(itinerary => {
      const destination = destinations.find(d => d.id === itinerary.destinationId);
      if (destination) {
        const month = dayjs(itinerary.date).month();
        const totalCost = destination.foodCost + destination.accommodationCost + destination.transportCost;
        monthlyRevenue[month] += totalCost;
      }
    });
    
    return monthlyRevenue;
  };
  
  const monthlyRevenue = calculateMonthlyRevenue();

  return {
    year,
    setYear,
    destinations,
    filteredItineraries,
    monthlyItineraries,
    monthlyRevenue,
    popularDestinations,
    expensesByCategory,
    itineraryByType,
    totalRevenue,
    formatCurrency
  };
}; 