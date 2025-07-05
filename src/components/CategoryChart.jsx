import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const { transactions, categories } = useContext(GlobalContext);

  const chartData = useMemo(() => {
    const categoryTotals = categories.map(category => {
      const categoryTransactions = transactions.filter(t => 
        t.category === category.id && t.amount < 0
      );
      const total = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return {
        ...category,
        total
      };
    }).filter(cat => cat.total > 0);

    if (categoryTotals.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#E0E0E0'],
          borderColor: ['#BDBDBD'],
          borderWidth: 1,
        }]
      };
    }

    return {
      labels: categoryTotals.map(cat => cat.name),
      datasets: [
        {
          data: categoryTotals.map(cat => cat.total),
          backgroundColor: categoryTotals.map(cat => cat.color),
          borderColor: categoryTotals.map(cat => cat.color),
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, categories]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Category Breakdown</h3>
      </div>
      <div className="chart-content">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;