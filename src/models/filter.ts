import { useState, useCallback, useMemo } from 'react';
import { TravelType } from './destination';

export interface FilterState {
  types: TravelType[];
  priceRange: [number, number];
  ratingRange: [number, number];
  sortBy: 'price' | 'rating' | 'name';
  sortDirection: 'asc' | 'desc';
  isFilterVisible: boolean;
}

export default () => {
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    priceRange: [0, 100000000], // Default price range (0 to 100M VND)
    ratingRange: [0, 5], // Rating is typically 0-5
    sortBy: 'price',
    sortDirection: 'asc',
    isFilterVisible: true, // Always show filter by default
  });

  // Update specific filter properties
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Reset all filters to default values
  const resetFilters = useCallback((priceRange: [number, number] = [0, 100000000]) => {
    setFilters({
      types: [],
      priceRange: priceRange,
      ratingRange: [0, 5],
      sortBy: 'price',
      sortDirection: 'asc',
      isFilterVisible: true,
    });
  }, []);

  // Toggle filter visibility
  const toggleFilterVisibility = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      isFilterVisible: !prev.isFilterVisible
    }));
  }, []);

  // Specific updaters for each filter property
  const updateTypes = useCallback((types: TravelType[]) => {
    updateFilters({ types });
  }, [updateFilters]);

  const updatePriceRange = useCallback((priceRange: [number, number]) => {
    updateFilters({ priceRange });
  }, [updateFilters]);

  const updateRatingRange = useCallback((ratingRange: [number, number]) => {
    updateFilters({ ratingRange });
  }, [updateFilters]);

  const updateSortBy = useCallback((sortBy: 'price' | 'rating' | 'name') => {
    updateFilters({ sortBy });
  }, [updateFilters]);

  const updateSortDirection = useCallback((sortDirection: 'asc' | 'desc') => {
    updateFilters({ sortDirection });
  }, [updateFilters]);

  // Calculate total cost for a destination
  const calculateTotalCost = (destination: any) => {
    return destination.foodCost + destination.accommodationCost + destination.transportCost;
  };

  // Calculate max price from data
  const getMaxPrice = useCallback((data: any[]) => {
    return data.reduce((max, destination) => {
      const totalCost = calculateTotalCost(destination);
      return totalCost > max ? totalCost : max;
    }, 0);
  }, []);

  // Apply filters and sorting to data
  const applyFiltersAndSort = useCallback((data: any[]) => {
    // Filter the data
    const filtered = data.filter(destination => {
      // Filter by type
      if (filters.types.length > 0 && !filters.types.includes(destination.type)) {
        return false;
      }

      // Filter by price
      const totalCost = calculateTotalCost(destination);
      if (totalCost < filters.priceRange[0] || totalCost > filters.priceRange[1]) {
        return false;
      }

      // Filter by rating
      if (destination.rating < filters.ratingRange[0] || destination.rating > filters.ratingRange[1]) {
        return false;
      }

      return true;
    });

    // Sort the filtered data
    return [...filtered].sort((a, b) => {
      if (filters.sortBy === 'price') {
        const costA = calculateTotalCost(a);
        const costB = calculateTotalCost(b);
        return filters.sortDirection === 'asc' ? costA - costB : costB - costA;
      } else if (filters.sortBy === 'rating') {
        return filters.sortDirection === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      } else { // name
        return filters.sortDirection === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    toggleFilterVisibility,
    updateTypes,
    updatePriceRange,
    updateRatingRange,
    updateSortBy,
    updateSortDirection,
    calculateTotalCost,
    getMaxPrice,
    applyFiltersAndSort
  };
}; 