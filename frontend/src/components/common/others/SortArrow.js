import { FaSortDown } from "react-icons/fa";
import styles from "./SortArrow.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function SortArrow({isUp, isSmall, marginClasses}) {
	let size = isSmall ? 14 : 28;

	return (
		<div className={conc(styles.container, marginClasses, cond(isUp, styles.up))}>
			<FaSortDown size={size}/>
		</div>
	);
}
