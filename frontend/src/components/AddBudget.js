import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddBudget.module.css';

function AddBudget() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

     // Basic date validation (you might want more robust validation)
    if (new Date(startDate) >= new Date(endDate)) {
      setError('Start date must be before end date');
      return;
    }

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          category,
          amount: Number(amount), // Ensure amount is a number
          startDate: new Date(startDate), // Convert to Date object
          endDate: new Date(endDate),    // Convert to Date object
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add budget');
      }

      // Reset form and show success message (optional)
      setCategory('');
      setAmount('');
      setStartDate('');
      setEndDate('');
      setSuccess(true);
      navigate('/budgets') //navigate to budgets page

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Budget</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>Budget added successfully!</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="category" className={styles.label}>Category:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="amount" className={styles.label}>Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="startDate" className={styles.label}>Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="endDate" className={styles.label}>End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Add Budget</button>
      </form>
    </div>
  );
}

export default AddBudget;