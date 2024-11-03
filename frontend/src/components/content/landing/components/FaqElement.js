import { useState } from "react";
import styles from "./FaqElement.module.scss";
import CollapseDiv from "../../../common/divs/CollapseDiv.js";
import SortArrow from "../../../common/others/SortArrow.js";
import { cond } from "../../../../lib/wrapper/html.js";

export default function FaqElement({title, children}) {
	const [isQuestion, setIsQuestion] = useState(false);

	return (
		<div className={styles.container} onClick={() => setIsQuestion(!isQuestion)}>
			<div>
				<SortArrow isUp={isQuestion} isSmall={false} marginClasses={cond(isQuestion, styles.sort_arrow_up, styles.sort_arrow_down)}/>
				<span>{title}</span>
			</div>
			<CollapseDiv isShowing={isQuestion}>
				<div onClick={event => event.stopPropagation()}>
					{children}
				</div>
			</CollapseDiv>
		</div>
	);
}