import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import TransactionChart from '../components/TransactionChart';
import WalletBalance from '../components/WalletBalance';
import DarkModeToggle from '../components/DarkModeToggle';
import styles from './Dashboard.module.css'

function Dashboard() {
    const { user, logout } = useAuth();

    if (!user) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link to="/" className={styles.navLink}>Dashboard</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/transactions" className={styles.navLink}>Transactions</Link>
                    </li>
                     <li className={styles.navItem}>
                        <Link to="/add-transaction" className={styles.navLink}>Add Transaction</Link> {/* Add Transaction Link */}
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/budgets" className={styles.navLink}>Budgets</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/goals" className={styles.navLink}>Goals</Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link to="/reports" className={styles.navLink}>Reports</Link>
                    </li>
                    {/* Conditionally render other sidebar items based on role */}

                </ul>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <div className={styles.userInfo}>
                        <span>Hi {user.name}!</span>
                        <DarkModeToggle />
                        <button onClick={logout} className={styles.logoutButton}>Logout</button>
                    </div>

                </header>

                <div className={styles.grid}>
                    <Card title="Welcome">
                        <p className={styles.welcomeText}>Welcome, {user.name}!</p>
                        <p>Role: {user.role}</p>
                    </Card>

                    <Card title="Quick Actions">
                      <Link to="/add-budget" className={styles.addButton}>Add Budget</Link>
                      <Link to="/add-goal" className={styles.addButton}>Add Goal</Link>
                    </Card>

                    {/* Account Summary Card - Pass data as props */}
                    <Card title="Account Summary">
                        <WalletBalance />
                    </Card>

                    <Card title="Transaction Chart">
                        <TransactionChart />
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;