
import { useEffect, useState } from 'react';

interface ProjectStats {
  totalInvestment: number;
  totalEarnings: number;
  monthlyData: {
    month: string;
    investment: number;
    earnings: number;
  }[];
  taskCompletion: number;
}

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats>({
    totalInvestment: 0,
    totalEarnings: 0,
    monthlyData: [],
    taskCompletion: 0
  });

  useEffect(() => {
    const updateStats = () => {
      // Get data from localStorage
      const investments = JSON.parse(localStorage.getItem('investments') || '[]');
      const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

      // Calculate totals
      const totalInvestment = investments.reduce((acc: number, cur: any) => acc + cur.amount, 0);
      const totalEarnings = earnings.reduce((acc: number, cur: any) => acc + cur.amount, 0);

      // Calculate monthly data
      const monthlyData = calculateMonthlyData(investments, earnings);

      // Calculate task completion
      const taskCompletion = calculateTaskCompletion(tasks);

      setStats({
        totalInvestment,
        totalEarnings,
        monthlyData,
        taskCompletion
      });
    };

    // Initial update
    updateStats();

    // Set up interval for real-time updates
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  return stats;
};

function calculateMonthlyData(investments: any[], earnings: any[]) {
  // Implementation of monthly data calculation
  const monthlyData = [];
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 12; month++) {
    const monthStr = new Date(currentYear, month).toLocaleString('default', { month: 'short' });
    
    const monthlyInvestment = investments
      .filter((inv: any) => new Date(inv.date).getMonth() === month)
      .reduce((acc: number, cur: any) => acc + cur.amount, 0);

    const monthlyEarning = earnings
      .filter((earn: any) => new Date(earn.date).getMonth() === month)
      .reduce((acc: number, cur: any) => acc + cur.amount, 0);

    monthlyData.push({
      month: monthStr,
      investment: monthlyInvestment,
      earnings: monthlyEarning
    });
  }

  return monthlyData;
}

function calculateTaskCompletion(tasks: any[]) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.completed).length;
  return (completed / tasks.length) * 100;
}
