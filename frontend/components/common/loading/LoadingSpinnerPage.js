"use client";

import RevolvingDot from "react-loader-spinner";
import styles from "./LoadingSpinnerPage.module.scss";

export default function LoadingSpinnerPage() {
  return (
    <div className={styles.container}>
      <RevolvingDot color="var(--color-4)" />
      <div className={styles.title}>Peridot</div>
    </div>
  );
}
