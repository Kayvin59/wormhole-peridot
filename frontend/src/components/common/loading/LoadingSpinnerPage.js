import { RevolvingDot } from "react-loader-spinner";
import styles from "./LoadingSpinnerPage.module.scss";
import { getCssVariableColor } from "../../../lib/wrapper/html.js";

import { projectName } from "../../../data/project.js";

export default function LoadingSpinnerPage() {
	const color = getCssVariableColor("--color-4");

	return (
		<div className={styles.container}>
			<RevolvingDot color={color}/>
			<div className={styles.title}>{projectName}</div>
		</div>
	);
}