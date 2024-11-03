import styles from "./TokenIcon.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

import { projectName } from "../../../data/project.js";

export default function TokenIcon({token}) {
	let imagePath = token !== undefined ? token.imagePath : "/images/tokens/placeholder.svg";
	let altText = token !== undefined ? (token.symbol + " (" + token.contract + ") token for " + projectName) : undefined;

	return (
		<div className={styles.image}>
			<img className={conc(styles.image, cond(token === undefined, styles.placeholder))} src={imagePath} alt={altText}/>
		</div>
	);
}
