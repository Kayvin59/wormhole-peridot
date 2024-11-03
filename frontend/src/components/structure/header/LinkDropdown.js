
import { useState } from "react";
import SortArrow from "../../common/others/SortArrow.js";
import styles from "./LinkDropdown.module.scss";
import { conc, cond } from "../../../lib/wrapper/html.js";

export default function LinkDropdown({title, titleClassName, children}) {
	const [isOpen, setIsOpen] = useState(false);

	const classNames = conc(titleClassName, styles.title, cond(isOpen, styles.active));

	return (
		<div onMouseLeave={() => setIsOpen(false)}>
			<div className={classNames} onMouseEnter={() => setIsOpen(true)} onClick={() => setIsOpen(!isOpen)}>
				<span>{title}</span>
				<SortArrow isUp={isOpen} isSmall={true}/>
			</div>

			{
				isOpen &&
				<div className={styles.link_container}>
					{children}
				</div>
			}
		</div>
	);
}