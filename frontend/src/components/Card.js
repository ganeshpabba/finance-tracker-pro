// frontend/src/components/Card.js
import React from 'react';
import styles from './Card.module.css'

function Card({ title, children }) {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  );
}

export default Card;