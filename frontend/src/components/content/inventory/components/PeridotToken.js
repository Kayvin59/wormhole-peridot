import { useState, useEffect, useContext } from "react";
import styles from "./PeridotToken.module.scss";
import { BalancesContext } from "../../../../components-helper/contexts/BalancesProvider.js";
import InternalLink from "../../../common/links/InternalLink.js";
import BalanceTooltip from "../../../common/tokens/BalanceTooltip.js";
import Token from "../../../common/tokens/Token.js";

export default function PeridotToken({collection}) {
	const [balance, setBalance] = useState(undefined);

	const { balances, getBalance } = useContext(BalancesContext);

	// ---- HOOKS ----

	useEffect(() => {
		refreshBalance();
	}, [balances]);

	// ---- FUNCTIONS ----

	function refreshBalance() {
		if (balances !== undefined) {
			let balance = getBalance(collection.token);

			setBalance(balance);
		}
	}

	return (
		<div className={styles.container}>
			<Token token={collection.token}/>

			<hr/>

			<div className={styles.balance_container}>Your Balance: <BalanceTooltip balance={balance}/></div>

			<div className={styles.link_container}>
				<InternalLink link={"/peridot-swap?chain=" + collection.chain.nameId + "&name=" + collection.name + "&input=token"} isButton={true}>Peridot-Swap</InternalLink>
			</div>
		</div>
	);
}