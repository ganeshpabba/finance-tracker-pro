import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import styles from './Register.module.css'; // Import CSS Module

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('personal');

  const { register } = useAuth();
  const navigate = useNavigate(); // Use useNavigate here


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await register(name, email, password, role);
    if (!result.success) {
        setError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
          <div className={styles.logoContainer}>
              {/* Replace with your logo */}
              <span className={styles.logoText}></span>
          </div>
        <h2 className={styles.heading}>Sign up with email</h2>
        <p className={styles.subheading}>Enter your details for expenses tracking</p>
        {/* Add onSubmit to the form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="Full Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="Email"
            />
          </div>
          <div className={styles.inputGroup}>
                <label htmlFor="password"  className="sr-only">Password</label>
                <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className= {`${styles.input} ${styles.passwordInput}`}
                placeholder="Password"
                />
                <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6 text-gray-400 dark:text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" dataSlot="icon" className="w-6 h-6 text-gray-400 dark:text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L21 21" />
                        </svg>
                    )}
                </button>
            </div>
            <div>
            <label htmlFor="role" className={styles.label}>Role:</label>
            <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className={styles.input}
            >
                <option value="personal">Personal</option>
                <option value="student">Student</option>
                <option value="organization">Organization</option>
            </select>
            </div>
          {error && <div className={styles.error}>{error}</div>}
          <button
            type="submit"
            className= {styles.submitButton}
          >
            Get Started
          </button>
        </form>

        <div className= {styles.registerLink}>
            <a href="/login">
            Already have an account? Sign in
            </a>
        </div>
      </div>
    </div>
  );
}

export default Register;