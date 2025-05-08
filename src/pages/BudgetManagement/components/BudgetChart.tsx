import React from 'react';
import { Card, Col, Row } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { BudgetSummary } from '../utils/calculateBudget';

interface BudgetChartProps {
  budgetData: BudgetSummary;
  plannedBudget: number;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData, plannedBudget }) => {
  // Dữ liệu cho biểu đồ tròn
  const pieOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: ['Chi phí ăn uống', 'Chi phí di chuyển', 'Chi phí lưu trú'],
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

  const pieSeries = [
    budgetData.eatTotal,
    budgetData.moveTotal,
    budgetData.stayTotal
  ];

  // Dữ liệu cho biểu đồ cột
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

  const barSeries = [
    {
      name: 'Ngân sách dự kiến',
      data: [plannedBudget]
    },
    {
      name: 'Chi phí thực tế',
      data: [budgetData.total]
    }
  ];

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card title="Phân bổ chi phí theo hạng mục">
          <ReactApexChart
            options={pieOptions}
            series={pieSeries}
            type="pie"
            height={350}
          />
        </Card>
      </Col>
      <Col xs={24} lg={12}>
        <Card title="So sánh ngân sách và chi phí">
          <ReactApexChart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={350}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default BudgetChart; 