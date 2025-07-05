import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { format } from 'date-fns';

const Transaction = ({ transaction }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    description: transaction.description || transaction.text || '',
    amount: Math.abs(transaction.amount).toString(),
    date: transaction.date || format(new Date(), 'yyyy-MM-dd'),
    category: transaction.category || 'other',
    type: transaction.amount < 0 ? 'expense' : 'income'
  });

  const { deleteTransaction, updateTransaction, categories } = useContext(GlobalContext);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      description: transaction.description || transaction.text || '',
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date || format(new Date(), 'yyyy-MM-dd'),
      category: transaction.category || 'other',
      type: transaction.amount < 0 ? 'expense' : 'income'
    });
  };

  const handleSave = () => {
    const updatedTransaction = {
      ...transaction,
      description: editData.description,
      amount: editData.type === 'expense' ? -Math.abs(parseFloat(editData.amount)) : Math.abs(parseFloat(editData.amount)),
      date: editData.date,
      category: editData.category,
      type: editData.type
    };

    updateTransaction(transaction.id, updatedTransaction);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Other';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#AED6F1';
  };

  const sign = transaction.amount < 0 ? '-' : '+';
  const transactionClass = transaction.amount < 0 ? 'minus' : 'plus';

  if (isEditing) {
    return (
      <li className="transaction-item editing">
        <div className="edit-form">
          <input
            type="text"
            name="description"
            value={editData.description}
            onChange={handleChange}
            placeholder="Description"
            className="edit-input"
          />
          <select
            name="type"
            value={editData.type}
            onChange={handleChange}
            className="edit-select"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="number"
            name="amount"
            value={editData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="edit-input"
          />
          <input
            type="date"
            name="date"
            value={editData.date}
            onChange={handleChange}
            className="edit-input"
          />
          <select
            name="category"
            value={editData.category}
            onChange={handleChange}
            className="edit-select"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="edit-buttons">
            <button onClick={handleSave} className="btn btn-small btn-success">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-small btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`transaction-item ${transactionClass}`}>
      <div className="transaction-content">
        <div className="transaction-main">
          <div className="transaction-info">
            <h4>{transaction.description || transaction.text}</h4>
            <div className="transaction-meta">
              <span 
                className="category-badge"
                style={{ backgroundColor: getCategoryColor(transaction.category) }}
              >
                {getCategoryName(transaction.category)}
              </span>
              <span className="transaction-date">
                {transaction.date ? format(new Date(transaction.date), 'MMM dd, yyyy') : 'No date'}
              </span>
            </div>
          </div>
          <div className="transaction-amount">
            <span className="amount">
              {sign}${Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="transaction-actions">
          <button onClick={handleEdit} className="btn btn-small btn-edit">
            Edit
          </button>
          <button onClick={() => deleteTransaction(transaction.id)} className="btn btn-small btn-delete">
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default Transaction;
