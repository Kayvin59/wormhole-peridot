import styles from "./Section.module.scss";
import InternalLink from "../common/links/InternalLink.js";
import { conc, cond } from "../../lib/wrapper/html.js";

export default function Section({anchorId, title, isTitleBig=false, children}) {
	const pathname = window.location.pathname;
	const origin = window.location.origin;

	const pathLink = pathname + "#" + anchorId;
	const fullLink = origin + pathLink;

	const isAnchor = anchorId !== undefined;
	const titleTitle = isAnchor ? "copy anchor link" : undefined;

	// ---- FUNCTIONS ----

	function copyTitle() {
		navigator.clipboard.writeText(fullLink);
	}

	return (
		<section id={anchorId} className={styles.container}>
			<h2 className={conc(styles.title, cond(isTitleBig, styles.title_big), cond(isAnchor, styles.anchor_title))} title={titleTitle}>
				{
					isAnchor
					?
						<InternalLink link={pathLink} isUnstyled={true} onClick={copyTitle}>{title}</InternalLink>
					:
						<span>{title}</span>
				}
			</h2>

			<div className={styles.inner_container}>
				{children}
			</div>
		</section>
	);
}
