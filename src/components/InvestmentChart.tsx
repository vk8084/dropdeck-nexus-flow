
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProjectStats } from '@/hooks/useProjectStats';

const InvestmentChart = () => {
  const { monthlyData } = useProjectStats();

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="investment" fill="#8884d8" name="Investment" />
          <Bar dataKey="earnings" fill="#82ca9d" name="Earnings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InvestmentChart;
