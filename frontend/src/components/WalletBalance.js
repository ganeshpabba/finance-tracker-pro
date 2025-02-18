// frontend/src/components/WalletBalance.js
import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import styles from './WalletBalance.module.css';
import { io } from "socket.io-client"; // Import

function WalletBalance() {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [income, setIncome] = useState(null); // New state
    const [expense, setExpense] = useState(null); // New state
    const [netIncome, setNetIncome] = useState(null); //New state
    const socketRef = useRef(null); // Ref to hold the socket

    const fetchBalance = async() => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log("Token:", token); // DEBUG: Log the token
            const response = await fetch('/api/wallet/balance', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Correct format
                },
            });
            console.log("Response:", response); // DEBUG: Log the entire response

            if (!response.ok) {
              const errorData = await response.json();
              console.log("Error Data:", errorData); // DEBUG
              throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data received:", data); // DEBUG: Log the received data
            setBalance(data.balance);
            setIncome(data.totalIncome);   // Set income
            setExpense(data.totalExpense); // Set expense
            setNetIncome(data.totalIncome - data.totalExpense)
        } catch (error) {
            console.error("Error fetching balance:", error); // DEBUG
            setError(error.message); // Set error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();

        // Set up Socket.IO connection
        socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'); // Replace with your actual backend URL
        const token = localStorage.getItem('token');

        const decodedToken = parseJwt(token); // Need JWT Decode

        if(decodedToken){
            socketRef.current.emit('joinRoom', decodedToken.id) //join user room with id.
        }

        socketRef.current.on('walletUpdated', (updatedWallet) => { // Listen for wallet updates
          fetchBalance();
        });

        // Add other event listeners as needed (e.g., for budget/goal updates)
        socketRef.current.on('transactionCreated', () => {
            fetchBalance()
        });
        socketRef.current.on('transactionUpdated', () => {
            fetchBalance();
        });
        socketRef.current.on('transactionDeleted', () => {
            fetchBalance()
        });
         socketRef.current.on('budgetUpdated', () => { //new event.
            fetchBalance();
        });
        socketRef.current.on('budgetCreated', () => { //new event.
            fetchBalance();
        });
        socketRef.current.on('budgetDeleted', () => { //new event.
            fetchBalance();
        });

        // Clean up the socket connection on unmount
        return () => {
          if(socketRef.current){
            socketRef.current.disconnect();
          }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);  // Run only once on mount and unmount

      // JWT decode helper function
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

  if (loading) {
    return <div className={styles.loading}>Loading balance...</div>;
  }

  if (error) {
    return <div className = {styles.error}>Error: {error}</div>;
  }

  return (
    <div>
      <p>Current Balance: ${balance !== null ? balance.toFixed(2) : 'N/A'}</p>
      <p>Total Income (This Month): ${income !== null ? income.toFixed(2) : 'N/A'}</p>
      <p>Total Expense (This Month): ${expense !== null ? expense.toFixed(2) : 'N/A'}</p>
      <p>Net Income (This Month): ${netIncome !== null ? netIncome.toFixed(2): 'N/A'}</p>
    </div>
  );
}

export default WalletBalance;