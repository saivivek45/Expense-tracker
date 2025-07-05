import React, { useContext, useState, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalState';
import Transaction from './Transaction';

const TransactionList = () => {
  const { transactions, categories } = useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = (transaction.description || transaction.text || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = filterType === 'all' || 
        (filterType === 'expense' && transaction.amount < 0) ||
        (filterType === 'income' && transaction.amount > 0);
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
        case 'amount':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'description':
          return (a.description || a.text || '').localeCompare(b.description || b.text || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [transactions, searchTerm, selectedCategory, sortBy, filterType]);

  return (
    <div className="transaction-list">
      <div className="transaction-header">
        <h3>Transaction History</h3>
        <div className="transaction-filters">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="description">Sort by Description</option>
          </select>
        </div>
      </div>

      {filteredAndSortedTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found.</p>
        </div>
      ) : (
        <ul className="transaction-list-items">
          {filteredAndSortedTransactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;