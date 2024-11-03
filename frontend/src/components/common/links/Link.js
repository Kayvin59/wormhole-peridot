import styles from "./Link.module.scss";
import { conc } from "../../../lib/wrapper/html.js";

export default function Link({link, children, isUnstyled, isButton, otherClasses, additionalClasses, onClick}) {
	let classes = undefined;

	if (isUnstyled) {
		classes = styles.link_unstyled;
	} else if (isButton) {
		classes = conc(styles.button, styles.link_button);
	} else if (otherClasses !== undefined) {
		classes = otherClasses;
	} else if (additionalClasses !== undefined) {
		classes = conc(styles.link, additionalClasses);
	} else {
		classes = styles.link;
	}

	return (
		<a href={link} className={classes} onClick={onClick} target="_blank" rel="noopener noreferrer">
			{children}
		</a>
	);
}