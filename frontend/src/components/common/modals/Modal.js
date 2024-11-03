import { IoClose } from "react-icons/io5";
import styles from "./Modal.module.scss";
import Background from "../../common/others/Background.js";

export default function Modal({isOpen, close, title, children}) {
	return (
		<div>
			<Background isActive={isOpen} onClick={close}/>

			{
				isOpen &&
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.header_title}>
							{title}
						</div>
						<div className={styles.header_close_button} onClick={close}>
							<IoClose size={30}/>
						</div>
					</div>

					<div className={styles.body}>
						{children}
					</div>
				</div>
			}
		</div>
	);
}
