import styles from "./TextTooltip.module.scss";

export default function TextTooltip({text, tooltipText}) {
	return (
		<span className={styles.container} title={tooltipText}>
			{text}
		</span>
	);
}