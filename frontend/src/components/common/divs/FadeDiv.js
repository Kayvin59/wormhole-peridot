import { useState, useEffect } from "react";
import { InView } from "react-intersection-observer";
import styles from "./FadeDiv.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function FadeDiv({anchorId, children}) {
	const [isInView, setIsInView] = useState(false);
	const [canFade, setCanFade] = useState(false);

	// ---- HOOKS ----

	useEffect(() => {
		refreshFadeStatus();
	}, []);

	// ---- FUNCTIONS ----

	function refreshFadeStatus() {
		let canFade = true;

		if (anchorId !== undefined) {
			let hash = window.location.hash;
			let anchor = "#" + anchorId;

			canFade = hash !== anchor;
		}

		setCanFade(canFade);
	}

	return (
		canFade
		?
			<InView onChange={setIsInView} triggerOnce={true}>
				<div className={conc(styles.fade, cond(isInView, styles.fade_in))}>
					{children}
				</div>
			</InView>
		:
			<div>
				{children}
			</div>
	);
}