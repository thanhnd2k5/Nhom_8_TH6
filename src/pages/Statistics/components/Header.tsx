import React from 'react';
import { Button, Typography, Space, Select } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { history } from 'umi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface HeaderProps {
  year: number;
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({ year, onYearChange }) => {
  const yearOptions = () => {
    const currentYear = dayjs().year();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button 
          type="default" 
          icon={<HomeOutlined />} 
          onClick={() => history.push('/')}
        >
          Trang chủ
        </Button>
        <Button 
          type="default" 
          icon={<SettingOutlined />} 
          onClick={() => history.push('/destination-management')}
        >
          Quản lý
        </Button>
        <Title level={2} style={{ margin: 0, marginLeft: '16px' }}>Thống kê du lịch</Title>
      </div>
      <Space>
        <Text>Năm:</Text>
        <Select 
          value={year} 
          onChange={(value) => onYearChange(value)} 
          style={{ width: 120 }}
        >
          {yearOptions().map(y => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
      </Space>
    </div>
  );
};

export default Header; 