import styles from "./Checkbox.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function Checkbox({getter, setter, offText, onText, isDisabled}) {
	return (
		<button className={conc(styles.button, cond(getter, styles.checked))} onClick={() => setter(!getter)} disabled={isDisabled}>
			<span>{getter ? onText : offText}</span>
		</button>
	);
}