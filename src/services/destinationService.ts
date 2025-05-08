import { Destination, DestinationFilter, DestinationSort } from '../models/Destination';

const STORAGE_KEY = 'destinations';

// Dữ liệu mẫu
const sampleDestinations: Destination[] = [
    {
        id: '1',
        name: 'Vịnh Hạ Long',
        imageUrl: 'https://example.com/halong.jpg',
        type: 'beach',
        rating: 4.8,
        estimatedCost: 2000000,
        description: 'Kỳ quan thiên nhiên thế giới với hàng nghìn đảo đá vôi'
    },
    {
        id: '2',
        name: 'Sapa',
        imageUrl: 'https://example.com/sapa.jpg',
        type: 'mountain',
        rating: 4.5,
        estimatedCost: 1500000,
        description: 'Thị trấn sương mù với cảnh quan núi non hùng vĩ'
    },
    {
        id: '3',
        name: 'Hà Nội',
        imageUrl: 'https://example.com/hanoi.jpg',
        type: 'city',
        rating: 4.3,
        estimatedCost: 1000000,
        description: 'Thủ đô nghìn năm văn hiến với văn hóa đặc sắc'
    }
];

export const destinationService = {
    // Lấy danh sách điểm đến
    getDestinations: (): Destination[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDestinations));
            return sampleDestinations;
        }
        return JSON.parse(stored);
    },

    // Lọc và sắp xếp điểm đến
    filterAndSortDestinations: (
        destinations: Destination[],
        filter: DestinationFilter,
        sort: DestinationSort
    ): Destination[] => {
        let result = [...destinations];

        // Áp dụng bộ lọc
        if (filter.type) {
            result = result.filter(d => d.type === filter.type);
        }
        if (filter.minCost) {
            result = result.filter(d => d.estimatedCost >= filter.minCost!);
        }
        if (filter.maxCost) {
            result = result.filter(d => d.estimatedCost <= filter.maxCost!);
        }
        if (filter.minRating) {
            result = result.filter(d => d.rating >= filter.minRating!);
        }

        // Áp dụng sắp xếp
        result.sort((a, b) => {
            const aValue = a[sort.field];
            const bValue = b[sort.field];
            if (sort.order === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });

        return result;
    },

    // Thêm điểm đến mới
    addDestination: (destination: Destination): void => {
        const destinations = destinationService.getDestinations();
        destinations.push(destination);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
    },

    // Cập nhật điểm đến
    updateDestination: (id: string, updatedDestination: Destination): void => {
        const destinations = destinationService.getDestinations();
        const index = destinations.findIndex(d => d.id === id);
        if (index !== -1) {
            destinations[index] = updatedDestination;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(destinations));
        }
    },

    // Xóa điểm đến
    deleteDestination: (id: string): void => {
        const destinations = destinationService.getDestinations();
        const filtered = destinations.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
}; 