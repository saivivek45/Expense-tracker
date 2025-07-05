import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Bar } from 'react-chartjs-2';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = () => {
  const { transactions } = useContext(GlobalContext);

  const chartData = useMemo(() => {
    const currentDate = new Date();
    const months = [];
    const monthlyData = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthExpenses = transactions
        .filter(t => {
          const transactionDate = new Date(t.date || t.createdAt);
          return transactionDate >= monthStart && 
                 transactionDate <= monthEnd && 
                 t.amount < 0;
        })
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

      months.push(format(monthDate, 'MMM yyyy'));
      monthlyData.push(monthExpenses);
    }

    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: monthlyData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Monthly Expenses Overview</h3>
      </div>
      <div className="chart-content">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyChart;