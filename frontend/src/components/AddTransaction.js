// frontend/src/components/AddTransaction.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddTransaction.module.css'

function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState('expense'); // Default to expense
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(false);

    const transactionDate = new Date(date);

    if (isNaN(transactionDate)) {
        setError("Invalid date format.  Please use YYYY-MM-DD.");
        return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          description,
          transactionType,
          category,
          date: transactionDate, // Send Date object
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
      }

      setAmount('');
      setDescription('');
      setTransactionType('expense');
      setCategory('');
      setDate('');
      setSuccess(true);
      navigate('/transactions')

    } catch (error) {
       setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Transaction</h2>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Transaction added successfully!</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="amount" className={styles.label}>Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="description" className={styles.label}>Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
            <label htmlFor="transactionType" className={styles.label}>Type:</label>
            <select id="transactionType" name="transactionType" value={transactionType} onChange={(e) => setTransactionType(e.target.value)} required
            className={styles.input}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>
        </div>
        <div>
          <label htmlFor="category" className={styles.label}>Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.input}

          />
        </div>
        <div>
          <label htmlFor="date" className={styles.label}>Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button
          type="submit"
          className={styles.button}
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;