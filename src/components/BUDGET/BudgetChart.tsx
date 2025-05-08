import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BudgetResult } from '../../utils/budgetTypes';
import { Empty } from 'antd';

interface BudgetChartProps {
  budgetData: BudgetResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData }) => {
  const { foodCost, accommodationCost, transportCost, otherCost } = budgetData;

  const data = [
    { name: 'Ăn uống', value: foodCost },
    { name: 'Lưu trú', value: accommodationCost },
    { name: 'Di chuyển', value: transportCost },
    { name: 'Chi phí khác', value: otherCost }
  ].filter(item => item.value > 0);

  if (data.length === 0 || (foodCost === 0 && accommodationCost === 0 && transportCost === 0 && otherCost === 0)) {
    return <Empty description="Chưa có dữ liệu chi phí" />;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => 
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
            } 
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart; 