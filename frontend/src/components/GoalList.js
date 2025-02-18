// frontend/src/components/GoalList.js
import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/formatDate';
import styles from './GoalList.module.css';
import { io } from "socket.io-client";

function GoalList() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
     try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/goals', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGoals(data);
      } catch (error) {
          setError(error.message);
          console.error("Error fetching goals: ", error)
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {


    fetchData();

    const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    if(decodedToken){
        socket.emit('joinRoom', decodedToken.id);
    }


    socket.on('goalCreated', () => {
        fetchData()
    });
    socket.on('goalUpdated', () => {
        fetchData()
    });
    socket.on('goalDeleted', () => {
       fetchData()
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

  if (loading) {
    return <div className={styles.loading}>Loading goals...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Goals</h1>
      {goals.length === 0 ? (
        <p className={styles.noGoals}>No goals found.</p>
      ) : (
        <ul className={styles.list}>
          {goals.map((goal) => (
            <li key={goal._id} className={styles.goalItem}>
              <h3 className={styles.name}>{goal.name}</h3>
              <p>Target Amount: ${goal.targetAmount.toFixed(2)}</p>
              <p>Current Amount: ${goal.currentAmount.toFixed(2)}</p>
              <p>Deadline: {formatDate(goal.deadline)}</p>
              <p>Status: {goal.status}</p> {/* Display the status */}
              {/* Add edit/delete buttons here later */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GoalList;