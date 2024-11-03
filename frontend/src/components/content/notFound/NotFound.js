import styles from "./NotFound.module.scss";
import InternalLink from "../../common/links/InternalLink.js";
import SectionContainer from "../../structure/SectionContainer.js";
import Section from "../../structure/Section.js";

export default function NotFound() {
	return (
		<SectionContainer>
			<Section title={"Site Not Found"}>
				<div className={styles.container}>
					<InternalLink link={"/"} isButton={true}>Return to Landing Page</InternalLink>
				</div>
			</Section>
		</SectionContainer>
	);
}