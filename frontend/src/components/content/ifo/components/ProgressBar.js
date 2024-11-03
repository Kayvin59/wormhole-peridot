import styles from "./ProgressBar.module.scss";

export default function ProgressBar({value, max}) {
	return (
		<progress value={value} max={max} className={styles.progress_bar}/>
	);
}