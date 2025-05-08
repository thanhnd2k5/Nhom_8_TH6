import React from 'react';
import { Collapse, Space, Row, Col, Typography, Select, Slider, Rate, Radio, Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { TravelType, travelTypeLabels } from '@/models/destination';
import { FilterState } from '@/models/filter';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface FilterSectionProps {
  filters: FilterState;
  maxPrice: number;
  updateTypes: (types: TravelType[]) => void;
  updatePriceRange: (range: [number, number]) => void;
  updateRatingRange: (range: [number, number]) => void;
  updateSortBy: (sortBy: 'price' | 'rating' | 'name') => void;
  updateSortDirection: (direction: 'asc' | 'desc') => void;
  resetFilters: () => void;
  formatCurrency: (value: number) => string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  maxPrice,
  updateTypes,
  updatePriceRange,
  updateRatingRange,
  updateSortBy,
  updateSortDirection,
  resetFilters,
  formatCurrency
}) => {
  return (
    <Collapse 
      defaultActiveKey={['1']}
      style={{ marginBottom: 24 }}
    >
      <Panel header={<Space><FilterOutlined /> Bộ lọc và Sắp xếp</Space>} key="1">
        <Row gutter={[24, 16]}>
          <Col xs={24} md={8}>
            <Title level={5}>Loại hình du lịch</Title>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn loại hình du lịch"
              value={filters.types}
              onChange={updateTypes}
            >
              {Object.entries(travelTypeLabels).map(([type, label]) => (
                <Option key={type} value={type}>{label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Title level={5}>Khoảng giá (VNĐ)</Title>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={filters.priceRange}
              onChange={updatePriceRange}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{formatCurrency(filters.priceRange[0])}</Text>
              <Text>{formatCurrency(filters.priceRange[1])}</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Title level={5}>Đánh giá</Title>
            <Slider
              range
              min={0}
              max={5}
              step={0.5}
              value={filters.ratingRange}
              onChange={updateRatingRange}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Rate disabled value={filters.ratingRange[0]} style={{ fontSize: 14 }} />
              <Rate disabled value={filters.ratingRange[1]} style={{ fontSize: 14 }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Sắp xếp theo</Title>
            <Radio.Group 
              value={filters.sortBy} 
              onChange={(e) => updateSortBy(e.target.value)}
            >
              <Radio.Button value="price">Giá</Radio.Button>
              <Radio.Button value="rating">Đánh giá</Radio.Button>
              <Radio.Button value="name">Tên</Radio.Button>
            </Radio.Group>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5}>Thứ tự</Title>
            <Radio.Group 
              value={filters.sortDirection} 
              onChange={(e) => updateSortDirection(e.target.value)}
            >
              <Radio.Button value="asc">Tăng dần</Radio.Button>
              <Radio.Button value="desc">Giảm dần</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col>
            <Button type="primary" danger onClick={resetFilters}>
              Đặt lại bộ lọc
            </Button>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );
};

export default FilterSection; 