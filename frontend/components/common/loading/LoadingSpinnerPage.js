"use client";

import styles from "@/components/common/loading/LoadingSpinnerPage.module.scss";
import { getCssVariableColor } from "@/lib/wrapper/html.js";
import RevolvingDot from "react-loader-spinner";


export default function LoadingSpinnerPage() {
  const color = getCssVariableColor("--color-4");
  const projectName = "Peridot";

  return (
    <div className={styles.container}>
      <RevolvingDot color={color} />
      <div className={styles.title}>{projectName}</div>
    </div>
  );
}
