import styles from "./Logo.module.scss";
import InternalLink from "../links/InternalLink.js";

import { projectName } from "../../../data/project.js";

export default function Logo() {
	return (
		<InternalLink link={"/"} otherClasses={styles.logo}>
			<img src={"/images/logos/512.png"} alt={projectName + " - Logo"} className={styles.logo_image}/>
			<span className={styles.logo_text}>{projectName}</span>
		</InternalLink>
	);
}