// frontend/src/pages/Transactions.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Import Link
import TransactionChart from '../components/TransactionChart';
import Card from '../components/Card';
import { formatDate } from '../utils/formatDate';
import styles from './Transactions.module.css'; // Import CSS Module

function Transactions() {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/api/transactions', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading transactions...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500 dark:text-red-400">Error: {error.message}</div>;
    }
      if (!user) {
          return <div className = "text-center p-4">Loading...</div>;
      }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Transactions</h1>
            <div className={styles.grid}>
                <Card title="Welcome">
                  <p className={styles.welcomeText}>Welcome, {user.name}!</p>
                  <p>Role: {user.role}</p>
                </Card>

                <Card title="Quick Actions">
                    <button onClick={logout} className={styles.logoutButton}>
                        Logout
                    </button>
                    <div>
                       <Link to="/" className={styles.link}>Go to Dashboard</Link>
                    </div>
                </Card>
              </div>

            {/* "Add Transaction" Link/Button */}
            <div className={styles.addTransactionLink}>
                <Link to="/add-transaction" className={styles.addButton}>
                    Add Transaction
                </Link>
            </div>

            <Card title="Transaction Chart">
               <TransactionChart />
            </Card>

            <h2 className={styles.listHeading}>Transaction List</h2>
             {transactions.length === 0 ? (
                <p className="text-center">No transactions found.</p>
            ) : (
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.tableHeaderCell}>Date</th>
                            <th className={styles.tableHeaderCell}>Description</th>
                            <th className={styles.tableHeaderCell}>Category</th>
                            <th className={styles.tableHeaderCell}>Type</th>
                            <th className={styles.tableHeaderCell}>Amount</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className={styles.tableRow}>
                                <td className={styles.tableCell}>{formatDate(transaction.date)}</td>
                                <td className={styles.tableCell}>{transaction.description}</td>
                                 <td className={styles.tableCell}>{transaction.category}</td>
                                <td className={styles.tableCell}>{transaction.transactionType}</td>
                                <td className={styles.tableCell}>
                                    {transaction.transactionType === 'expense' ? '-' : '+'}
                                    ${transaction.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

export default Transactions;