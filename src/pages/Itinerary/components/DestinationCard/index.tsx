import React from 'react';
import { Card, Typography, Image, Tag, Row, Col, Button, Popconfirm, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface DestinationCardProps {
  destination: any;
  formatCurrency: (value: number) => string;
  onEdit?: (destination: any) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  formatCurrency,
  onEdit,
  onDelete,
  editable = false
}) => {
  const actions = editable ? [
    <Button key={destination.id} icon={<EditOutlined />} onClick={() => onEdit && onEdit(destination)}>Sửa</Button>,
    <Popconfirm
      key={destination.id}
      title="Bạn có chắc chắn muốn xóa?"
      onConfirm={() => onDelete && onDelete(destination.id)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger icon={<DeleteOutlined />}>Xóa</Button>
    </Popconfirm>
  ] : undefined;

  return (
    <Card
      hoverable
      style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      cover={
        <div style={{ height: 180, overflow: 'hidden' }}>
          <Image 
            alt={destination.name}
            src={destination.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            preview={false}
          />
        </div>
      }
      actions={actions}
    >
      <Card.Meta
        title={destination.name}
        description={
          <>
            <Tag color="blue" style={{ marginBottom: 8 }}>{destination.date}</Tag>
            <Paragraph ellipsis={{ rows: 2 }}>{destination.description}</Paragraph>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Thời gian:</div>
                <div>{destination.duration || 'N/A'}</div>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>Tổng chi phí:</div>
                <div style={{ fontWeight: 'bold', color: '#f5222d' }}>
                  {formatCurrency(destination.totalCost || 0)}
                </div>
              </Col>
            </Row>
          </>
        }
      />
    </Card>
  );
};

export default DestinationCard;
