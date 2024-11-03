import { useContext } from "react";
import styles from "./Landing.module.scss";
import { WindowWidthContext } from "../../../components-helper/contexts/WindowWidthProvider.js";
import FadeDiv from "../../common/divs/FadeDiv.js";
import Section from "../../structure/Section.js";
import InfoSection from "./components/InfoSection.js";
import PartnerSection from "./components/PartnerSection.js";
import ProductSection from "./components/ProductSection.js";
import RoadmapImageSection from "./components/RoadmapImageSection.js";
import TopSection from "./components/TopSection.js";
import { getCssVariablePixel } from "../../../lib/wrapper/html.js";

export default function Landing() {
	const mobileBreakpointSmall = getCssVariablePixel("--mobile-breakpoint-small");

	const windowWidth = useContext(WindowWidthContext);

	return (
		<div className={styles.container}>
			<div className={styles.top_container}>
				<FadeDiv>
					<TopSection/>
				</FadeDiv>
			</div>
			
			<div className={styles.section_container}>
				<hr/>

				<FadeDiv>
					<Section anchorId={"mission"} title={"Our Mission"} isTitleBig={true}>
						<ProductSection/>
					</Section>
				</FadeDiv>
				
				{
					(windowWidth > mobileBreakpointSmall) &&
					<>
						<hr/>

						<FadeDiv>
							<Section anchorId={"how-it-works"} title={"How It Works"} isTitleBig={true}>
								<InfoSection/>
							</Section>
						</FadeDiv>
					</>
				}

				{/*
				<hr/>

				<FadeDiv>
					<Section anchorId={"partners"} title={"Our Partners"} isTitleBig={true}>
						<PartnerSection/>
					</Section>
				</FadeDiv>
				*/}

				<hr/>

				<FadeDiv>
					<Section anchorId={"roadmap"} title={"Our Roadmap 2024"} isTitleBig={true}>
						<RoadmapImageSection/>
					</Section>
				</FadeDiv>
			</div>
		</div>
	);
}