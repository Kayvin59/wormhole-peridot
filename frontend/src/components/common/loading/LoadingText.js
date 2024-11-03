import styles from "./LoadingText.module.scss";
import { cond } from "../../../lib/wrapper/html.js";

export default function LoadingText({text, defaultText}) {
	const isDoneLoading = text !== undefined;
	const classes = cond(!isDoneLoading, styles.loading_text);

	return (
		<span className={classes}>
			{isDoneLoading ? text : defaultText}
		</span>
	);
}