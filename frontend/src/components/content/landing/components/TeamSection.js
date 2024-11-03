import styles from "./TeamSection.module.scss";
import TeamElement from "./TeamElement.js";

export default function TeamSection() {
	return (
		<div className={styles.container}>
			<div>
				<TeamElement
					imagePath={"/images/tokens/MyS.svg"}
					name={"name"}
					title={"title"}
					description={"description"}/>
					
				<TeamElement
					imagePath={"/images/tokens/MyS.svg"}
					name={"name"}
					title={"title"}
					description={"description"}/>
			</div>

			<div>
				<TeamElement
					imagePath={"/images/tokens/MyS.svg"}
					name={"name"}
					title={"title"}
					description={"description"}/>

				<TeamElement
					imagePath={"/images/tokens/MyS.svg"}
					name={"name"}
					title={"title"}
					description={"description"}/>
					
				<TeamElement
					imagePath={"/images/tokens/MyS.svg"}
					name={"name"}
					title={"title"}
					description={"description"}/>
			</div>
		</div>
	);
}