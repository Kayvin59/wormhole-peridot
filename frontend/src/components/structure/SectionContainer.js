import styles from "./SectionContainer.module.scss";
import { conc, cond } from "../../lib/wrapper/html.js";

export default function SectionContainer({hasBigGaps, children}) {
	return (
		<div className={conc(styles.container, cond(hasBigGaps === true, styles.big_gap))}>
			{children}
		</div>
	);
}
