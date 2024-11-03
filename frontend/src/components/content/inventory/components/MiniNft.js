import { useState, useEffect, useContext } from "react";
import styles from "./MiniNft.module.scss";
import { ConnectionContext } from "../../../../components-helper/contexts/ConnectionProvider.js";
import ExternalLink from "../../../common/links/ExternalLink.js";
import InternalLink from "../../../common/links/InternalLink.js";
import BalanceTooltip from "../../../common/tokens/BalanceTooltip.js";
import { getMiniNftBalance } from "../../../../lib/web3/web3BaseAdd.js";

export default function MiniNft({collection}) {
	const [balance, setBalance] = useState(undefined);

	const { isConnected } = useContext(ConnectionContext);

	// ---- HOOKS ----

	useEffect(() => {
		refreshBalance();
	}, [isConnected]);

	// ---- FUNCTIONS ----

	function refreshBalance() {
		if (isConnected === true) {
			getMiniNftBalance(collection.chain.nameId, collection.miniNft.contract).then(result => {
				setBalance(result);
			});
		}
	}

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.chain_text}>(on {collection.chain.nameId})</div>

				<div className={styles.image_container}>
					<img src={collection.miniNftImagePath} alt={collection.name + " Mini NFT"} className={styles.image}/>
				</div>
				
				<div className={styles.balance_container}>Your Balance: <BalanceTooltip balance={balance}/></div>
			</div>

			<div className={styles.link_container}>
				<InternalLink link={"/peridot-swap?chain=" + collection.chain.nameId + "&name=" + collection.name + "&input=nft"} isButton={true}>Peridot-Swap</InternalLink>
				<ExternalLink link={collection.marketLink} isButton={true}>Sell in Market</ExternalLink>
			</div>
		</div>
	);
}