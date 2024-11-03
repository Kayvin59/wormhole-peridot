
import styles from "./MenuButton.module.scss";

export default function MenuButton({getter, setter}) {
	return (
		<div className={styles.menu_button_container}>
			<input type="checkbox" className={styles.menu_checkbox} id="menu_toggle" onChange={event => setter(event.currentTarget.checked)} checked={getter}/>
			<label className={styles.menu_button} htmlFor="menu_toggle">
				<div className={styles.menu_button_part}></div>
			</label>
		</div>
	);
}