import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import styles from './TransactionChart.module.css'
import { io } from "socket.io-client"; // Import

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function TransactionChart() {
  const [transactionData, setTransactionData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  const [error, setError] = useState(null); // Add error state
  const [loading, setLoading] = useState(true); // Add loading state
  const socketRef = useRef(null); // Ref for the socket


  // Fetch transactions and update chart data
  const fetchData = async () => { //extracted as a named function
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactionData(data); // Update transactionData state
    } catch (error) {
      setError(error.message); // Set error message
      console.error("Could not fetch transactions:", error);
    } finally {
        setLoading(false); // Set loading to false after fetching
    }
};

  useEffect(() => {
    fetchData(); // Initial fetch

    // Socket.IO connection
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    if(decodedToken){
        socketRef.current.emit('joinRoom', decodedToken.id);
    }

    socketRef.current.on('transactionCreated', () => {
      fetchData(); //simple approach, re-fetch all
    });

    // Add similar listeners for update and delete events
    socketRef.current.on('transactionUpdated', () => {
      fetchData();
    });

    socketRef.current.on('transactionDeleted', () => {
      fetchData();
    });
    socketRef.current.on('budgetUpdated', () => { //new event.
        fetchData();
    });
    socketRef.current.on('budgetCreated', () => { //new event.
        fetchData();
    });
    socketRef.current.on('budgetDeleted', () => { //new event.
        fetchData();
    });


    return () => {
      if (socketRef.current) { // Check if socketRef.current is defined
        socketRef.current.disconnect(); // Clean up the socket connection
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array: run once on mount


    // JWT decode helper function
    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

  useEffect(() => {
    if (transactionData.length > 0) {
      const expensesByCategory = {};
      const incomeByCategory = {};

      transactionData.forEach((transaction) => {
        if (transaction.transactionType === 'expense') {
          expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
        } else {
          incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
        }
      });

      const labels = Object.keys(expensesByCategory);
      const expenseData = Object.values(expensesByCategory);

      const incomeLabels = Object.keys(incomeByCategory);
      const incomeData = Object.values(incomeByCategory)

        const newData = {
            labels: chartType === 'bar' ? [...new Set([...labels, ...incomeLabels])] : labels, //different label for bar
            datasets: [
                ...(chartType === 'bar'
                ? [{
                    label: 'Income',
                    data: [...incomeLabels.map(label => incomeData[incomeLabels.indexOf(label)] ?? 0)],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,

                  }]
                : []),
              {
                label: 'Expenses',
                data: chartType === 'bar'
                ?  [...(new Set([...labels, ...incomeLabels])).keys()].map(key => expensesByCategory[key] ?? 0)
                : expenseData,
                backgroundColor: chartType === 'bar'
                ?  'rgba(255, 99, 132, 0.2)'
                : labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 70%, 60%)`),
                borderColor: chartType === 'bar'
                ? 'rgba(255, 99, 132, 1)'
                : labels.map((_, i) => `hsl(${i * (360 / labels.length)}, 70%, 40%)`),
                borderWidth: 1,
              },

            ],
          };
      setChartData(newData);
    }
  }, [transactionData, chartType]);
   //Chart options:
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Income and Expenses by Category',
            },
        },
        // Add 3D effect (for Bar chart)
        elements: {
            bar: {
              borderWidth: 2,
              borderRadius: 4, // Rounded corners
              borderSkipped: false, // Apply border to all sides
            }
          },
          // X and Y axis
          scales: {
            x: {
              grid: {
                display: false // Remove vertical grid lines
              }
            },
            y: {
              beginAtZero: true, // Start y-axis at 0
            }
        }
    };
      const pieOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Expenses by Category',
          },
        },
      };

  return (
     <div className={styles.chartContainer}>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => setChartType('bar')}
          className={`${styles.button} ${chartType === 'bar' ? styles.active : ''}`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType('pie')}
          className={`${styles.button} ${chartType === 'pie' ? styles.active : ''}`}
        >
          Pie Chart
        </button>
      </div>
      {loading ? (
        <div className={styles.loading}>Loading chart data...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        chartData && (
            chartType === 'bar' ? <Bar options={barOptions} data={chartData} /> : <Pie options = {pieOptions} data={chartData}/>
        )
      )}
    </div>
  );
}

export default TransactionChart;