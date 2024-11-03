import styles from "./InfoSection.module.scss";
import { projectName } from "../../../../data/project.js";

export default function InfoSection() {
	return (
		<div className={styles.container}>
			<img src={"/images/decorations/info.png"} alt={projectName + " - How It Works"} className={styles.image}/>
		</div>
	);
}