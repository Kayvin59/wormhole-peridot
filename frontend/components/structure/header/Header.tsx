"use client";

import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo_container}></div>

      <nav className={styles.nav_desktop}></nav>
    </header>
  );
}
