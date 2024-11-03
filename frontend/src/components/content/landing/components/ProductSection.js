import styles from "./ProductSection.module.scss";

export default function ProductSection() {
	return (
		<div className={styles.container}>
			<div className={styles.text_container}>
				<p>
					High costs and complexity restrict access to NFTs and DeFi, limiting market growth and innovation.
					A significant portion of potential users are alienated due to these barriers.
				</p>

				<p className={styles.highlight}>
					Peridot Protocol enables fractional ownership of NFTs and participation in DeFi with lower investment thresholds.
				</p>

				<p>
					Our mission is to democratize access to NFTs and DeFi, making fractional ownership, trading, and investment opportunities universally accessible.
				</p>
			</div>
		</div>
	);
}