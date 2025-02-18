// frontend/src/App.js
import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import AddTransaction from './components/AddTransaction';
import Navbar from './components/Navbar';
import { io } from "socket.io-client";
import { useAuth } from './context/AuthContext';
import AddBudget from './components/AddBudget';
import BudgetList from './components/BudgetList';
import AddGoal from './components/AddGoal';
import GoalList from './components/GoalList';
import Report from './components/Report'

function App() {
  const {user} = useAuth();
    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'); // Connect to your backend
        if (user) {
          socket.emit('joinRoom', user._id); // Join room with user ID
        }
        socket.on('transactionCreated', (transaction) => {
          alert(`New transaction created: ${transaction.description}`);
          // Update your UI as needed
        });

        //Other Socket event listeners.

        return () => { //clean up on disconnect
          socket.disconnect();
        };
    }, [user]); // VERY IMPORTANT: Only run when 'user' changes


  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/add-transaction' element={<AddTransaction />} />
        <Route path="/add-budget" element={<AddBudget />} />
        <Route path="/budgets" element={<BudgetList />} />
        <Route path="/add-goal" element={<AddGoal />} />
        <Route path="/goals" element={<GoalList />} />
        <Route path="/reports" element={<Report />} />
      </Routes>
    </div>
  );
}

export default App;