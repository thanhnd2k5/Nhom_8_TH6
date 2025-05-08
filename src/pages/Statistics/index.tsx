import React from 'react';
import { Header, StatOverview, MonthlyCharts, CategoryCharts, TravelTypeChart } from './components';
import { useStatistics } from './hooks/useStatistics';

const Statistics: React.FC = () => {
  const {
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
  } = useStatistics();

  return (
    <div style={{ padding: '24px' }}>
      <Header year={year} onYearChange={setYear} />
      
      <StatOverview
        filteredItinerariesCount={filteredItineraries.length}
        totalRevenue={totalRevenue}
        destinationsCount={destinations.length}
        popularDestinationName={popularDestinations[0]?.name || 'Chưa có'}
        formatCurrency={formatCurrency}
      />
      
      <MonthlyCharts
        monthlyItineraries={monthlyItineraries}
        monthlyRevenue={monthlyRevenue}
        formatCurrency={formatCurrency}
      />
      
      <CategoryCharts
        popularDestinations={popularDestinations}
        expensesByCategory={expensesByCategory}
        formatCurrency={formatCurrency}
      />
      
      <TravelTypeChart itineraryByType={itineraryByType} />
    </div>
  );
};

export default Statistics; 