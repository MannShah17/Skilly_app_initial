import React from 'react';
import styles from './Cursor.module.css';
export default function Cursor({ cursorRef }) {
  return <div className={styles.cursor} ref={cursorRef}></div>;
}
