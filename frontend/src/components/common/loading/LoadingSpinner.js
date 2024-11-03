import { RevolvingDot } from "react-loader-spinner";
import styles from "./LoadingSpinner.module.scss";
import { getCssVariableColor } from "../../../lib/wrapper/html.js";

export default function LoadingSpinner() {
	const color = getCssVariableColor("--color-4");

	return (
		<div className={styles.container}>
			<RevolvingDot color={color}/>
		</div>
	);
}