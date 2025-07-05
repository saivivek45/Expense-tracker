import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {
  const { transactions, categories } = useContext(GlobalContext);

  const dashboardData = useMemo(() => {
    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Total calculations
    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const balance = totalIncome - totalExpenses;

    // Current month calculations
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date || t.createdAt);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    // Category breakdown
    const categoryBreakdown = categories.map(category => {
      const categoryTransactions = transactions.filter(t => 
        t.category === category.id && t.amount < 0
      );
      const total = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return {
        ...category,
        total,
        count: categoryTransactions.length,
        percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
      };
    }).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

    // Recent transactions
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      balance,
      monthlyIncome,
      monthlyExpenses,
      categoryBreakdown,
      recentTransactions,
      transactionCount: transactions.length
    };
  }, [transactions, categories]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Other';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Overview of your financial activity</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card balance">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Balance</h3>
            <p className={`amount ${dashboardData.balance >= 0 ? 'positive' : 'negative'}`}>
              ${dashboardData.balance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="summary-card income">
          <div className="card-icon">📈</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount positive">${dashboardData.totalIncome.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card expenses">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="amount negative">${dashboardData.totalExpenses.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card transactions">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h3>Transactions</h3>
            <p className="count">{dashboardData.transactionCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="monthly-summary">
          <h3>This Month</h3>
          <div className="monthly-stats">
            <div className="monthly-stat">
              <span className="label">Income:</span>
              <span className="value positive">${dashboardData.monthlyIncome.toFixed(2)}</span>
            </div>
            <div className="monthly-stat">
              <span className="label">Expenses:</span>
              <span className="value negative">${dashboardData.monthlyExpenses.toFixed(2)}</span>
            </div>
            <div className="monthly-stat">
              <span className="label">Net:</span>
              <span className={`value ${(dashboardData.monthlyIncome - dashboardData.monthlyExpenses) >= 0 ? 'positive' : 'negative'}`}>
                ${(dashboardData.monthlyIncome - dashboardData.monthlyExpenses).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="category-breakdown">
          <h3>Top Categories</h3>
          <div className="category-list">
            {dashboardData.categoryBreakdown.slice(0, 5).map(category => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <div
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="category-name">{category.name}</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">${category.total.toFixed(2)}</span>
                  <span className="category-percentage">{category.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <div className="recent-list">
            {dashboardData.recentTransactions.map(transaction => (
              <div key={transaction.id} className="recent-item">
                <div className="recent-info">
                  <span className="recent-description">{transaction.description || transaction.text}</span>
                  <span className="recent-category">{getCategoryName(transaction.category)}</span>
                </div>
                <div className="recent-amount">
                  <span className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                    {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <span className="recent-date">
                    {transaction.date ? format(new Date(transaction.date), 'MMM dd') : 'No date'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;