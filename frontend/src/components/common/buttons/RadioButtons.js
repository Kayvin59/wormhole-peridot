import styles from "./RadioButtons.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function RadioButtons({options, setter, isActive, toString}) {
	const buttons = options.map((option, index) => {
		return (
			<button key={index} className={conc(styles.button, cond(isActive(option), styles.active))} onClick={() => setter(option)}>
				<span>{toString(option)}</span>
			</button>
		);
	});

	return (
		<div className={styles.container}>
			{buttons}
		</div>
	);
}