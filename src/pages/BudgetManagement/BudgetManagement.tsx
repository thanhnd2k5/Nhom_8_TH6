import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, InputNumber, Alert, Table, Space, Tag, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const { Title, Text } = Typography;

const BudgetManagement: React.FC = () => {
  const { 
    totalBudget, 
    setTotalBudget, 
    selectedDestinations, 
    setSelectedDestinations,
    saveBudget, 
    getBudget, 
    isOverBudget, 
    removeDestination,
    data
  } = useModel('budget');
  const { data: allDestinations, getDestinations } = useModel('destination');
  const [pieChartOptions, setPieChartOptions] = useState<ApexOptions>({});
  const [barChartOptions, setBarChartOptions] = useState<ApexOptions>({});

  useEffect(() => {
    getDestinations();
    getBudget();
    updateCharts();
  }, []);

  useEffect(() => {
    updateCharts();
  }, [data]);

  // Cập nhật các biểu đồ
  const updateCharts = () => {
    if (!data) return;

    // Biểu đồ tròn cho phân bổ chi phí
    const pieOptions: ApexOptions = {
      chart: {
        type: 'pie',
      },
      labels: ['Chi phí ăn uống', 'Chi phí lưu trú', 'Chi phí di chuyển'],
      colors: ['#FF6384', '#36A2EB', '#FFCE56'],
      legend: {
        position: 'bottom',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    // Biểu đồ cột so sánh
    const barOptions: ApexOptions = {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Chi phí'],
      },
      yaxis: {
        title: {
          text: 'VNĐ'
        },
        labels: {
          formatter: function(val) {
            return val.toLocaleString('vi-VN');
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          }
        }
      }
    };

    setPieChartOptions(pieOptions);
    setBarChartOptions(barOptions);
  };

  // Xử lý khi người dùng thay đổi ngân sách
  const handleBudgetChange = (value: number | null) => {
    setTotalBudget(value || 0);
  };

  // Lưu ngân sách
  const handleSaveBudget = () => {
    saveBudget();
    updateCharts();
  };

  // Định dạng tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Cột cho bảng điểm đến đã chọn
  const columns = [
    {
      title: 'Tên điểm đến',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chi phí ăn uống',
      dataIndex: 'foodCost',
      key: 'foodCost',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Chi phí lưu trú',
      dataIndex: 'accommodationCost',
      key: 'accommodationCost',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Chi phí di chuyển',
      dataIndex: 'transportCost',
      key: 'transportCost',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Tổng chi phí',
      key: 'totalCost',
      render: (_: any, record: Destination.Record) => 
        formatCurrency(record.foodCost + record.accommodationCost + record.transportCost),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Destination.Record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            removeDestination(record.id);
            handleSaveBudget();
          }}
        />
      ),
    },
  ];

  // Dữ liệu cho biểu đồ
  const getPieChartSeries = () => {
    if (!data) return [1, 1, 1]; // Dữ liệu mẫu nếu không có dữ liệu thực
    return [data.foodCostTotal, data.accommodationCostTotal, data.transportCostTotal];
  };

  const getBarChartSeries = () => {
    if (!data) return [{
      name: 'Ngân sách',
      data: [0]
    }, {
      name: 'Chi phí',
      data: [0]
    }];

    return [{
      name: 'Ngân sách',
      data: [data.totalBudget]
    }, {
      name: 'Chi phí',
      data: [data.totalCost]
    }];
  };

  // Xử lý chọn điểm đến
  const handleAddDestination = (destinationId: string) => {
    const destination = allDestinations.find((dest: Destination.Record) => dest.id === destinationId);
    if (destination) {
      const exists = selectedDestinations.some(item => item.id === destination.id);
      if (!exists) {
        const newSelectedDestinations = [...selectedDestinations, destination];
        setSelectedDestinations(newSelectedDestinations);
        handleSaveBudget();
      }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Quản lý ngân sách du lịch</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Nhập ngân sách">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>Nhập tổng ngân sách dự kiến:</Text>
              <InputNumber
                style={{ width: '100%' }}
                value={totalBudget}
                onChange={handleBudgetChange}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => {
                  const parsedValue = value?.replace(/\$\s?|(,*)/g, '');
                  return parsedValue ? parseFloat(parsedValue) : 0;
                }}
                min={0}
                addonAfter="VNĐ"
              />
              <Button type="primary" onClick={handleSaveBudget} style={{ marginTop: 16 }}>
                Cập nhật ngân sách
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Tổng hợp chi phí">
            {data && (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card bordered={false}>
                    <Title level={4}>Chi phí ăn uống</Title>
                    <Text type="success" style={{ fontSize: 20 }}>
                      {formatCurrency(data.foodCostTotal)}
                    </Text>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card bordered={false}>
                    <Title level={4}>Chi phí lưu trú</Title>
                    <Text type="success" style={{ fontSize: 20 }}>
                      {formatCurrency(data.accommodationCostTotal)}
                    </Text>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card bordered={false}>
                    <Title level={4}>Chi phí di chuyển</Title>
                    <Text type="success" style={{ fontSize: 20 }}>
                      {formatCurrency(data.transportCostTotal)}
                    </Text>
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card bordered={false}>
                    <Title level={4}>Tổng chi phí: {formatCurrency(data.totalCost)}</Title>
                    <Title level={5}>Ngân sách: {formatCurrency(data.totalBudget)}</Title>
                    
                    {data.totalBudget > 0 && isOverBudget() && (
                      <Alert
                        message="Cảnh báo vượt ngân sách!"
                        description={`Chi phí của bạn đã vượt quá ngân sách dự kiến ${formatCurrency(data.totalCost - data.totalBudget)}`}
                        type="error"
                        showIcon
                        style={{ marginTop: 16 }}
                      />
                    )}
                  </Card>
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ chi phí">
            {data && (
              <ReactApexChart
                options={pieChartOptions}
                series={getPieChartSeries()}
                type="pie"
                height={350}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="So sánh ngân sách và chi phí">
            {data && (
              <ReactApexChart
                options={barChartOptions}
                series={getBarChartSeries()}
                type="bar"
                height={350}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách điểm đến đã chọn" style={{ marginTop: 24 }}>
        <Table
          dataSource={selectedDestinations}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

      <Card title="Thêm điểm đến vào ngân sách" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          {allDestinations.map((destination: Destination.Record) => {
            const isSelected = selectedDestinations.some(item => item.id === destination.id);
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={destination.id}>
                <Card 
                  hoverable 
                  cover={destination.image && <img alt={destination.name} src={destination.image} height={150} style={{ objectFit: 'cover' }} />}
                  actions={[
                    <Button
                      type="primary"
                      disabled={isSelected}
                      onClick={() => handleAddDestination(destination.id)}
                    >
                      {isSelected ? 'Đã thêm' : 'Thêm vào ngân sách'}
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={destination.name}
                    description={
                      <>
                        <p>{destination.description.length > 50 
                          ? `${destination.description.substring(0, 50)}...` 
                          : destination.description}
                        </p>
                        <p>
                          <Tag color="green">
                            Tổng: {formatCurrency(
                              destination.foodCost + 
                              destination.accommodationCost + 
                              destination.transportCost
                            )}
                          </Tag>
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
    </div>
  );
};

export default BudgetManagement; 