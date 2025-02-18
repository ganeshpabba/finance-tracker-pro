// frontend/src/components/AddGoal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddGoal.module.css'

function AddGoal() {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false)

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate)) {
        setError("Invalid date format.  Please use YYYY-MM-DD.");
        return;
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          targetAmount: Number(targetAmount),
          deadline: deadlineDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add goal');
      }
        setName('');
        setTargetAmount('');
        setDeadline('');
        setSuccess(true);
        navigate('/goals')

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Add Goal</h2>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Goal added successfully!</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="name" className={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className={styles.label}>Target Amount:</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label htmlFor="deadline" className={styles.label}>Deadline:</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Add Goal</button>
      </form>
    </div>
  );
}

export default AddGoal;