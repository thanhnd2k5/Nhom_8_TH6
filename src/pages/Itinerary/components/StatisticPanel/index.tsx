import React from 'react';
import { Empty } from 'antd';

interface StatisticPanelProps {
  destinations: any[];
  formatCurrency: (value: number) => string;
  totalCost: number;
}

const StatisticPanel: React.FC<StatisticPanelProps> = ({ 
  destinations, 
  formatCurrency,
  totalCost
}) => {
  if (destinations.length === 0) {
    return <Empty description="Chưa có dữ liệu để thống kê." />;
  }

  return (
    <div style={{ minHeight: 200, padding: 24, background: '#fafafa', borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <b>Tổng ngân sách:</b>{" "}
        <span style={{ color: "#d4380d", fontWeight: 600 }}>
          {formatCurrency(totalCost)}
        </span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Tổng số điểm du lịch:</b> {destinations.length}
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Tổng thời lượng (nếu có):</b>{" "}
        {destinations
          .map(d => d.duration)
          .filter(Boolean)
          .join(" + ") || "Chưa có dữ liệu"}
      </div>
    </div>
  );
};

export default StatisticPanel;
