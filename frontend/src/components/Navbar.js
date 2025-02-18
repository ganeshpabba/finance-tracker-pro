// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import styles from './Navbar.module.css'

function Navbar() {
     const { user, logout } = useAuth();
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          Finance Tracker
        </Link>
        <div className={styles.navItems}>
        <DarkModeToggle />
        {user ? (
          <div className={styles.loggedInNav}>
            <Link to="/" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/transactions" className={styles.navLink}>
              Transactions
            </Link>
            <Link to="/budgets" className={styles.navLink}>
              Budgets
            </Link>
            <Link to="/goals" className={styles.navLink}>
              Goals
            </Link>
            <Link to="/reports" className={styles.navLink}>
              Reports
            </Link>
            <button
              onClick={logout}
              className={styles.navLink}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.loggedOutNav}>
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>
            <Link to="/register" className={styles.navLink}>
              Register
            </Link>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;