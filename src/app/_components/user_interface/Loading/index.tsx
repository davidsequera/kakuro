import React from 'react'
import styles from './styles.module.css'

export default function Loading() {
  return (
    <section className={styles.spinner}>
        {Array.from({ length: 6 }, (v, i) => i).map((_, i) => <div key={i}></div>)}
    </section>
  )
}
