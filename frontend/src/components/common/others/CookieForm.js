import CookieConsent from "react-cookie-consent";
import styles from "./CookieForm.module.scss";
import ExternalLink from "../links/ExternalLink.js";

import { projectName } from "../../../data/project.js";

export default function CookieForm() {
	const acceptText = "I Accept";
	const declineText = "I Decline";

	const cookieName = projectName.toLowerCase() + "-cookie-consent";

	return (
		<CookieConsent
			buttonText={acceptText}
			ariaAcceptLabel={acceptText}
			declineButtonText={declineText}
			ariaDeclineLabel={declineText}
			cookieName={cookieName}
			containerClasses={styles.container}
			buttonClasses={styles.button}
			buttonWrapperClasses={styles.button_wrapper}
			contentClasses={styles.text}
			disableStyles={true}>
				
			<span>This website uses cookies to enhance the user experience.</span>
			<span>By accepting you also agree to our <ExternalLink link={"/docs"}>legal documents</ExternalLink>.</span>
		</CookieConsent>
	);
}
