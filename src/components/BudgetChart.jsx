import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Bar } from 'react-chartjs-2';
import { startOfMonth, endOfMonth } from 'date-fns';
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

const BudgetChart = () => {
  const { transactions, budgets, categories } = useContext(GlobalContext);

  const chartData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Get current month budgets
    const currentBudgets = budgets.filter(budget => 
      budget.month === currentMonth && budget.year === currentYear
    );

    if (currentBudgets.length === 0) {
      return {
        labels: ['No Budget Data'],
        datasets: [{
          label: 'Budget',
          data: [0],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }, {
          label: 'Actual',
          data: [0],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }]
      };
    }

    const labels = [];
    const budgetData = [];
    const actualData = [];

    currentBudgets.forEach(budget => {
      const category = categories.find(cat => cat.id === budget.categoryId);
      const categoryName = category ? category.name : 'Unknown';
      
      // Calculate actual spending for this category in current month
      const actualSpending = transactions
        .filter(t => {
          const transactionDate = new Date(t.date || t.createdAt);
          return transactionDate >= monthStart && 
                 transactionDate <= monthEnd && 
                 t.category === budget.categoryId && 
                 t.amount < 0;
        })
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

      labels.push(categoryName);
      budgetData.push(budget.amount);
      actualData.push(actualSpending);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Budget',
          data: budgetData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Actual',
          data: actualData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, budgets, categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Budget vs Actual Spending (Current Month)',
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
        <h3>Budget vs Actual</h3>
      </div>
      <div className="chart-content">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BudgetChart;