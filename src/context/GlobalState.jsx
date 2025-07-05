import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from './AppReducer';

// Predefined categories
const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#FF6B6B' },
  { id: 'transportation', name: 'Transportation', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', color: '#45B7D1' },
  { id: 'entertainment', name: 'Entertainment', color: '#96CEB4' },
  { id: 'bills', name: 'Bills & Utilities', color: '#FFEAA7' },
  { id: 'healthcare', name: 'Healthcare', color: '#DDA0DD' },
  { id: 'education', name: 'Education', color: '#98D8C8' },
  { id: 'travel', name: 'Travel', color: '#F7DC6F' },
  { id: 'other', name: 'Other', color: '#AED6F1' }
];

const initialState = {
  transactions: [],
  categories: CATEGORIES,
  budgets: [], // Array of {categoryId, amount, month, year}
  loading: false,
  error: null
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('expenseTrackerState');
    if (savedState) {
      dispatch({
        type: 'LOAD_STATE',
        payload: JSON.parse(savedState)
      });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenseTrackerState', JSON.stringify(state));
  }, [state]);

  // Transaction actions
  function addTransaction(transaction) {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: transaction
    });
  }

  function deleteTransaction(id) {
    dispatch({
      type: 'DELETE_TRANSACTION',
      payload: id
    });
  }

  function updateTransaction(id, transaction) {
    dispatch({
      type: 'UPDATE_TRANSACTION',
      payload: { id, transaction }
    });
  }

  // Budget actions
  function addBudget(budget) {
    dispatch({
      type: 'ADD_BUDGET',
      payload: budget
    });
  }

  function updateBudget(id, budget) {
    dispatch({
      type: 'UPDATE_BUDGET',
      payload: { id, budget }
    });
  }

  function deleteBudget(id) {
    dispatch({
      type: 'DELETE_BUDGET',
      payload: id
    });
  }

  // Category actions
  function addCategory(category) {
    dispatch({
      type: 'ADD_CATEGORY',
      payload: category
    });
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      categories: state.categories,
      budgets: state.budgets,
      loading: state.loading,
      error: state.error,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addCategory
    }}>
      {children}
    </GlobalContext.Provider>
  );
};