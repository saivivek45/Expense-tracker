import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const BudgetManager = () => {
  const { budgets, categories, addBudget, updateBudget, deleteBudget } = useContext(GlobalContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    month: format(new Date(), 'yyyy-MM')
  });
  const [editingBudget, setEditingBudget] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount || !formData.month) {
      return;
    }

    const [year, month] = formData.month.split('-');
    
    const budgetData = {
      id: editingBudget ? editingBudget.id : uuidv4(),
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      month: parseInt(month),
      year: parseInt(year),
      createdAt: new Date().toISOString()
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
    } else {
      addBudget(budgetData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      month: format(new Date(), 'yyyy-MM')
    });
    setEditingBudget(null);
    setShowForm(false);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      month: `${budget.year}-${budget.month.toString().padStart(2, '0')}`
    });
    setShowForm(true);
  };

  const handleDelete = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(budgetId);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#AED6F1';
  };

  const formatMonth = (month, year) => {
    const date = new Date(year, month - 1);
    return format(date, 'MMMM yyyy');
  };

  const currentBudgets = budgets.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="budget-manager">
      <div className="budget-header">
        <h2>Budget Manager</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="budget-form">
          <h3>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="form-control"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Budget Amount</label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="Enter budget amount..."
                step="0.01"
                min="0"
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="month">Month</label>
              <input
                type="month"
                id="month"
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: e.target.value})}
                className="form-control"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="budget-list">
        <h3>Current Budgets</h3>
        {currentBudgets.length === 0 ? (
          <div className="no-budgets">
            <p>No budgets set yet. Click "Add Budget" to get started!</p>
          </div>
        ) : (
          <div className="budget-items">
            {currentBudgets.map(budget => (
              <div key={budget.id} className="budget-item">
                <div className="budget-info">
                  <div className="budget-category">
                    <div
                      className="category-color"
                      style={{ backgroundColor: getCategoryColor(budget.categoryId) }}
                    ></div>
                    <span className="category-name">{getCategoryName(budget.categoryId)}</span>
                  </div>
                  <div className="budget-period">
                    {formatMonth(budget.month, budget.year)}
                  </div>
                </div>
                <div className="budget-amount">
                  <span className="amount">${budget.amount.toFixed(2)}</span>
                </div>
                <div className="budget-actions">
                  <button 
                    onClick={() => handleEdit(budget)}
                    className="btn btn-small btn-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(budget.id)}
                    className="btn btn-small btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;