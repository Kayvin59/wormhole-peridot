import styles from "./Background.module.scss";
import { cond } from "../../../lib/wrapper/html.js";

export default function Background({isActive, onClick}) {
	return (
		<div className={cond(isActive, styles.background, styles.background_invisible)} onClick={onClick}></div>
	);
}
