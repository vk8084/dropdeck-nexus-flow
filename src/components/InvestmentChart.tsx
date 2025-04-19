
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProjectStats } from '@/hooks/useProjectStats';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const InvestmentChart = () => {
  const { monthlyData } = useProjectStats();

  // Ensure we have data to display
  const chartData = monthlyData && monthlyData.length > 0 
    ? monthlyData 
    : [
        { month: 'Jan', investment: 0, earnings: 0 },
        { month: 'Feb', investment: 0, earnings: 0 },
        { month: 'Mar', investment: 0, earnings: 0 },
      ];

  const chartConfig = {
    investment: {
      label: "Investment",
      color: "#8884d8",
    },
    earnings: {
      label: "Earnings",
      color: "#82ca9d",
    },
  };

  return (
    <div className="h-80 w-full p-4 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4">Monthly Performance</h3>
      <ChartContainer className="h-64" config={chartConfig}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip
            content={<ChartTooltipContent />}
          />
          <Legend />
          <Bar dataKey="investment" fill="#8884d8" name="Investment" />
          <Bar dataKey="earnings" fill="#82ca9d" name="Earnings" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default InvestmentChart;
