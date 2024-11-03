
import { useState } from "react";
import SortArrow from "../../common/others/SortArrow.js";
import styles from "./Dropdown.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function Dropdown({title, titleClassName, children}) {
	const [isOpen, setIsOpen] = useState(false);

	const classNames = conc(titleClassName, styles.title, cond(isOpen, styles.active));

	return (
		<div onMouseLeave={() => setIsOpen(false)}>
			<div className={classNames} onMouseEnter={() => setIsOpen(true)} onClick={() => setIsOpen(!isOpen)}>
				<span>{title}</span>
				<SortArrow isUp={isOpen} isSmall={true} marginClasses={cond(isOpen, styles.sort_arrow_up)}/>
			</div>

			{
				isOpen &&
				<div className={styles.element_container}>
					{children}
				</div>
			}
		</div>
	);
}