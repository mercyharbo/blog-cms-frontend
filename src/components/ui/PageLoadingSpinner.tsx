import styles from './PageLoadingSpinner.module.css'

export default function PageLoadingSpinner() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>
    </div>
  )
}
