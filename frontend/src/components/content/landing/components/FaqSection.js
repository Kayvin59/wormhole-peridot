import styles from "./FaqSection.module.scss";
import FaqElement from "./FaqElement.js";

export default function FaqSection() {
	return (
		<div className={styles.container}>
			<FaqElement title={"question1"}>
				<div>answer1</div>
			</FaqElement>

			<FaqElement title={"question2"}>
				<div>answer2</div>
			</FaqElement>

			<FaqElement title={"question3"}>
				<div>answer3</div>
			</FaqElement>
		</div>
	);
}