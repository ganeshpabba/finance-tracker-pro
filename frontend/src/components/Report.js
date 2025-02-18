// frontend/src/components/Report.js
import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import styles from './Report.module.css'

function Report() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');


  const fetchReportData = async () => { // Moved to a separate function
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Build the query string.  Start with empty string
      let queryString = '?';

      // Add start and end date if present
      if (startDate) {
          queryString += `startDate=${startDate}&`;
      }

      if (endDate) {
        queryString += `endDate=${endDate}&`;
      }
      // Add category
      if(category){
        queryString += `category=${category}&`;
      }

      // Remove the trailing '&' or '?' if no params
      queryString = queryString.slice(0,-1);

      const response = await fetch(`/api/reports${queryString}`, { // Use query string
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        fetchReportData(); // Re-fetch when form is submitted
    }


  if (loading) {
    return <div className={styles.loading}>Loading report...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Financial Report</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div>
                <label htmlFor="startDate" className={styles.label}>Start Date:</label>
                <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
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
                className={styles.input}
                />
            </div>
            <div>
                <label htmlFor="category" className={styles.label}>Category:</label>
                <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
                />
            </div>
            <button type="submit"  className={styles.button}>Generate Report</button>
        </form>

      {reportData && (
        <div>
            <h2 className = {styles.heading}>Transactions</h2>
            {reportData.transactions.length === 0 ? (
                <p>No transactions found for the selected criteria.</p>
            ) : (
            <ul>
                {reportData.transactions.map((transaction) => (
                <li key={transaction._id}>
                    {formatDate(transaction.date)} - {transaction.description} - ${transaction.amount.toFixed(2)} - {transaction.category}
                </li>
                ))}
            </ul>
            )}
            <h2 className = {styles.heading}>Summary</h2>
            <p>Total Income: ${reportData.totalIncome.toFixed(2)}</p>
            <p>Total Expense: ${reportData.totalExpense.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default Report;