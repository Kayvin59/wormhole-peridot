import styles from "./TeamElement.module.scss";

import { projectName } from "../../../../data/project.js";

export default function TeamElement({imagePath, name, title, description}) {
	return (
		<div className={styles.container}>
			<img src={imagePath} alt={name + " for " + projectName}/>

			<div>{name}</div>
			<div>{title}</div>

			<hr/>

			<div>
				<span>{description}</span>
			</div>
		</div>
	);
}