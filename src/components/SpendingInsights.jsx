import React, { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const SpendingInsights = () => {
  const { transactions, budgets, categories } = useContext(GlobalContext);

  const insights = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));

    // Current month transactions
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date || t.createdAt);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    // Last month transactions
    const lastMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date || t.createdAt);
      return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
    });

    // Current month spending
    const currentMonthSpending = currentMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    // Last month spending
    const lastMonthSpending = lastMonthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    // Spending trend
    const spendingTrend = lastMonthSpending > 0 
      ? ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100
      : 0;

    // Top spending category this month
    const categorySpending = categories.map(category => {
      const categoryTransactions = currentMonthTransactions.filter(t => 
        t.category === category.id && t.amount < 0
      );
      const total = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
      return { ...category, total };
    }).sort((a, b) => b.total - a.total);

    const topCategory = categorySpending[0];

    // Budget analysis
    const currentBudgets = budgets.filter(budget => 
      budget.month === currentMonth && budget.year === currentYear
    );

    const budgetAnalysis = currentBudgets.map(budget => {
      const category = categories.find(cat => cat.id === budget.categoryId);
      const actualSpending = currentMonthTransactions
        .filter(t => t.category === budget.categoryId && t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);
      
      const percentage = budget.amount > 0 ? (actualSpending / budget.amount) * 100 : 0;
      const remaining = budget.amount - actualSpending;
      
      return {
        category: category ? category.name : 'Unknown',
        budgetAmount: budget.amount,
        actualSpending,
        percentage,
        remaining,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });

    // Average daily spending
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const currentDay = currentDate.getDate();
    const averageDailySpending = currentMonthSpending / currentDay;

    // Projected monthly spending
    const projectedMonthlySpending = averageDailySpending * daysInMonth;

    return {
      currentMonthSpending,
      lastMonthSpending,
      spendingTrend,
      topCategory,
      budgetAnalysis,
      averageDailySpending,
      projectedMonthlySpending,
      transactionCount: currentMonthTransactions.length
    };
  }, [transactions, budgets, categories]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'over': return '#FF6B6B';
      case 'warning': return '#FFD93D';
      case 'good': return '#6BCF7F';
      default: return '#AED6F1';
    }
  };

  return (
    <div className="spending-insights">
      <div className="insights-header">
        <h2>Spending Insights</h2>
        <p>Analysis of your spending patterns and budget performance</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Monthly Spending Trend</h3>
          <div className="trend-container">
            <div className="trend-amount">
              <span className="label">This Month:</span>
              <span className="amount">${insights.currentMonthSpending.toFixed(2)}</span>
            </div>
            <div className="trend-amount">
              <span className="label">Last Month:</span>
              <span className="amount">${insights.lastMonthSpending.toFixed(2)}</span>
            </div>
            <div className={`trend-change ${insights.spendingTrend >= 0 ? 'negative' : 'positive'}`}>
              <span className="trend-icon">
                {insights.spendingTrend >= 0 ? '↗️' : '↘️'}
              </span>
              <span className="trend-percentage">
                {Math.abs(insights.spendingTrend).toFixed(1)}% 
                {insights.spendingTrend >= 0 ? ' increase' : ' decrease'}
              </span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <h3>Top Spending Category</h3>
          {insights.topCategory && insights.topCategory.total > 0 ? (
            <div className="top-category">
              <div className="category-info">
                <div
                  className="category-color"
                  style={{ backgroundColor: insights.topCategory.color }}
                ></div>
                <span className="category-name">{insights.topCategory.name}</span>
              </div>
              <div className="category-amount">
                ${insights.topCategory.total.toFixed(2)}
              </div>
            </div>
          ) : (
            <p>No spending data available</p>
          )}
        </div>

        <div className="insight-card">
          <h3>Daily Average</h3>
          <div className="daily-stats">
            <div className="daily-amount">
              <span className="amount">${insights.averageDailySpending.toFixed(2)}</span>
              <span className="label">per day</span>
            </div>
            <div className="projection">
              <span className="label">Projected Monthly:</span>
              <span className="amount">${insights.projectedMonthlySpending.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <h3>Transaction Activity</h3>
          <div className="activity-stats">
            <div className="activity-amount">
              <span className="amount">{insights.transactionCount}</span>
              <span className="label">transactions this month</span>
            </div>
          </div>
        </div>
      </div>

      {insights.budgetAnalysis.length > 0 && (
        <div className="budget-analysis">
          <h3>Budget Performance</h3>
          <div className="budget-progress-list">
            {insights.budgetAnalysis.map((budget, index) => (
              <div key={index} className="budget-progress-item">
                <div className="budget-progress-header">
                  <span className="budget-category">{budget.category}</span>
                  <span className="budget-percentage">{budget.percentage.toFixed(1)}%</span>
                </div>
                <div className="budget-progress-bar">
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${Math.min(budget.percentage, 100)}%`,
                      backgroundColor: getStatusColor(budget.status)
                    }}
                  ></div>
                </div>
                <div className="budget-progress-details">
                  <span className="budget-spent">
                    ${budget.actualSpending.toFixed(2)} of ${budget.budgetAmount.toFixed(2)}
                  </span>
                  <span className={`budget-remaining ${budget.remaining >= 0 ? 'positive' : 'negative'}`}>
                    {budget.remaining >= 0 ? `$${budget.remaining.toFixed(2)} remaining` : `$${Math.abs(budget.remaining).toFixed(2)} over budget`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingInsights;