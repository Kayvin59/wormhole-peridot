import styles from "./PartnerSection.module.scss";
import ExternalLink from "../../../common/links/ExternalLink.js";

export default function PartnerSection() {
	return (
		<div className={styles.container}>
			<ExternalLink link={"https://witnet.com"} >
				<div className={styles.element}>
					<img src={"/images/partners/witnet.svg"} alt={"Project Partner Witnet"} className={styles.image}/>
				</div>
			</ExternalLink>
		</div>
	);
}
