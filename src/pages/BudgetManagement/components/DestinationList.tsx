import React from 'react';
import { Card, Table, Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { DestinationBudget } from '../mock/scheduleData';
import { formatCurrency } from '../utils/calculateBudget';

interface DestinationListProps {
  destinations: DestinationBudget[];
  onRemoveDestination: (id: string) => void;
}

const DestinationList: React.FC<DestinationListProps> = ({ 
  destinations, 
  onRemoveDestination 
}) => {
  const columns = [
    {
      title: 'Tên điểm đến',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chi phí ăn uống',
      dataIndex: 'eat',
      key: 'eat',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Chi phí di chuyển',
      dataIndex: 'move',
      key: 'move',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Chi phí lưu trú',
      dataIndex: 'stay',
      key: 'stay',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Tổng chi phí',
      key: 'total',
      render: (_: any, record: DestinationBudget) => 
        formatCurrency(record.eat + record.move + record.stay),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DestinationBudget) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveDestination(record.id)}
        />
      ),
    },
  ];

  return (
    <Card title="Danh sách điểm đến đã chọn" style={{ marginTop: 24 }}>
      <Table
        dataSource={destinations}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: true }}
        locale={{ emptyText: 'Chưa có điểm đến nào được chọn' }}
      />
    </Card>
  );
};

export default DestinationList; 