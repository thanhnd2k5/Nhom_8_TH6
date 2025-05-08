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

  const getDestinationById = (id: string): Destination | undefined => {
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
    getDestinationById,
    formatDate,
    formatCurrency,
    calculateTotalCost,
  };
};