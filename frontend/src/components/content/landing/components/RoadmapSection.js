import styles from "./RoadmapSection.module.scss";
import { CiCircleCheck } from "react-icons/ci";
import { MdDoubleArrow } from "react-icons/md";
import { conc, cond } from "../../../../lib/wrapper/html.js";

export default function RoadmapSection() {
	const arrow = <MdDoubleArrow/>;
	const checkmark = <CiCircleCheck size={40}/>;
	
	function getRows(bubbles) {
		return bubbles.props.children.map((bubble, index) => {
			let isReversed = index % 2 === 1;
	
			return (
				<div key={index} className={conc(styles.row, cond(isReversed, styles.reverse))}>
					{bubble}
	
					<div className={styles.bar_container}>
						<div className={conc(styles.bar, styles.bar_top)}/>
	
						<div className={conc(styles.bar_circle_container, cond(isReversed, styles.reverse))}>
							<div className={styles.bar_circle_connector}/>
							<div className={styles.bar_circle}/>
							<div className={styles.bar_circle_dummy}/>
						</div>
	
						<div className={conc(styles.bar, styles.bar_bottom)}/>
					</div>
	
					<div className={styles.bubble_dummy}/>
				</div>
			);
		});
	}

	return (
		<div className={styles.container}>
			<div className={styles.container_dummy_container}>
				<div className={styles.container_dummy}/>
				<div className={conc(styles.bar, styles.container_top)}/>
			</div>

			{
				getRows(
					<>
						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								April 2024
								{checkmark}
							</div>
							<div className={conc(styles.bubble_content_container, styles.bubble_check)}>
								<p>{arrow} test</p>
							</div>
						</div>

						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								May 2024
								{checkmark}
							</div>
							<div className={conc(styles.bubble_content_container, styles.bubble_check)}>
								<p>{arrow} test</p>
							</div>
						</div>

						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								Q2 2024
							</div>
							<div className={styles.bubble_content_container}>
								<p>{arrow} test</p>
								<p>{arrow} test</p>
								<p>{arrow} test</p>
							</div>
						</div>

						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								Q3 2024
							</div>
							<div className={styles.bubble_content_container}>
								<p>{arrow} test</p>
								<p>{arrow} test</p>
							</div>
						</div>

						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								Q4 2024
							</div>
							<div className={styles.bubble_content_container}>
								<p>{arrow} test</p>
							</div>
						</div>

						<div className={styles.bubble}>
							<div className={styles.bubble_title}>
								Q1 2025
							</div>
							<div className={styles.bubble_content_container}>
								<p>{arrow} test</p>
							</div>
						</div>
					</>
				)
			}

			<div className={styles.container_dummy_container}>
				<div className={styles.container_dummy}/>
				<div className={conc(styles.bar, styles.container_bottom)}/>
			</div>
		</div>
	);
}