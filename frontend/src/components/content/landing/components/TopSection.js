import { HiChevronDoubleDown } from "react-icons/hi";
import styles from "./TopSection.module.scss";
import useScrollOpacityEffect from "../../../../components-helper/hooks/useScrollOpacityEffect.js";

export default function TopSection() {
	const scrollOpacity = useScrollOpacityEffect();

	return (
		<div className={styles.container}>
			<div className={styles.dummy_element}></div>
			
			<div className={styles.title_container}>
				<h1 className={styles.title}>Peridot</h1>
				<h2 className={styles.sub_title}>Dividing Art, Multiplying Returns.</h2>
			</div>

			<div className={styles.below_hint_container} style={{ opacity: scrollOpacity }}>
				<span>see more</span>

				<span className={styles.below_hint_arrow}>
					<HiChevronDoubleDown/>
				</span>
			</div>
		</div>
	);
}