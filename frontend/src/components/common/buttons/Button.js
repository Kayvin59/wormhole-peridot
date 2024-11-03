import styles from "./Button.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function Button({handler, text, isDisabled, isWide}) {
	const buttonStyles = conc(styles.button, cond(isWide, styles.wide));

	return (
		<button onClick={handler} className={buttonStyles} disabled={isDisabled}>{text}</button>
	);
}