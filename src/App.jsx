import React, { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Balance from "./components/Balance";
import IncomeExpenses from "./components/IncomeExpenses";
import TransactionList from "./components/TransactionList";
import AddTransaction from "./components/AddTransaction";
import MonthlyChart from "./components/MonthlyChart";
import CategoryChart from "./components/CategoryChart";
import BudgetManager from "./components/BudgetManager";
import BudgetChart from "./components/BudgetChart";
import SpendingInsights from "./components/SpendingInsights";
import { GlobalProvider } from "./context/GlobalState";
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <Dashboard />
            <div className="charts-grid">
              <MonthlyChart />
              <CategoryChart />
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="transactions-content">
            <Balance />
            <IncomeExpenses />
            <AddTransaction />
            <TransactionList />
          </div>
        );
      case 'budgets':
        return (
          <div className="budgets-content">
            <BudgetManager />
            <BudgetChart />
            <SpendingInsights />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <GlobalProvider>
      <div className="app">
        <Header />
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button
            className={`tab-button ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            Budgets
          </button>
        </nav>
        <div className="container">
          {renderContent()}
        </div>
      </div>
    </GlobalProvider>
  );
}

export default App;