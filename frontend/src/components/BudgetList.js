// frontend/src/components/BudgetList.js
import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate'; // Import formatDate
import styles from './BudgetList.module.css';
import { io } from "socket.io-client"; // CORRECT IMPORT

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = async () => { // Consistent naming
      setLoading(true);
      setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/budgets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets(); // Initial fetch

    const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'); // Socket.IO

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    if(decodedToken){
        socket.emit('joinRoom', decodedToken.id);
    }

    socket.on('budgetCreated', () => {
      fetchBudgets(); // Re-fetch on create
    });

    socket.on('budgetUpdated', () => {
        fetchBudgets();
    });

    socket.on('budgetDeleted', () => {
        fetchBudgets()
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: run once on mount
  function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
  if (loading) {
    return <div className={styles.loading}>Loading budgets...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className = {styles.heading}>Budgets</h1>
      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        <ul className={styles.list}>
          {budgets.map((budget) => (
            <li key={budget._id} className={styles.budgetItem}>
              <h3 className= {styles.category}>{budget.category}</h3>
              <p>Amount: ${budget.amount.toFixed(2)}</p>
              <p>Start Date: {formatDate(budget.startDate)}</p>
              <p>End Date: {formatDate(budget.endDate)}</p>
              {/* Add edit/delete buttons here later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BudgetList;