import styles from "./Token.module.scss";
import TokenIcon from "./TokenIcon.js";
import MetamaskButton from "./MetamaskButton.js";

export default function Token({token, withIcon=true, isLpToken}) {
	let symbol = token !== undefined ? token.symbol : "...";
	let chain = token !== undefined ? token.chain.nameId : "...";

	return (
		<span className={styles.container}>
			{
				withIcon &&
				<TokenIcon token={token}/>
			}

			<div className={styles.text_container}>
				<span className={styles.name}>{symbol}</span>
				<div className={styles.chain_container}>
					<span className={styles.chain}>({chain})</span>
					<MetamaskButton token={token} isLpToken={isLpToken}/>
				</div>
			</div>
		</span>
	);
}
