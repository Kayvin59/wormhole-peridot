import styles from "./Footer.module.scss";
import Logo from "../common/others/Logo.js";
import ExternalLink from "../common/links/ExternalLink.js";

import { getSocials } from "../../data/socials.js";

export default function Footer() {
	const socials = getSocials();

	return (
		<footer className={styles.container}>
			<div className={styles.logo_container}>
				<Logo/>
			</div>

			<div>
				<span className={styles.name_container}>Peridot Labs Limited - All rights reserved.</span>
			</div>

			<div className={styles.social_container}>
				{
					socials.map((socialData, index) => {
						return (
							<div key={index}>
								<ExternalLink link={socialData.link}>
									<div className={styles.social_icon_container}>
										<img className={styles.social_icon} src={socialData.imagePath} alt={socialData.altText}/>
									</div>
								</ExternalLink>
							</div>
						);
					})
				}
			</div>
		</footer>
	);
}