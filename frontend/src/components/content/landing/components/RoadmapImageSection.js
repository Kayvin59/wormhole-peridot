import styles from "./RoadmapImageSection.module.scss";
import { projectName } from "../../../../data/project.js";

export default function RoadmapImageSection() {
	return (
		<div className={styles.container}>
			<img src={"/images/decorations/roadmap.png"} alt={projectName + " - Roadmap"} className={styles.image}/>
		</div>
	);
}