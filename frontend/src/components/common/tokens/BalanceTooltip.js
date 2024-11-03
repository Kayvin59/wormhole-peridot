import { useContext, useState, useEffect } from "react";
import styles from "./BalanceTooltip.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { conc, cond } from "../../../lib/wrapper/html.js";
import { connectedText } from "../../../data/messages.js";

export default function BalanceTooltip({balance}) {
	const classes = conc(styles.container, cond(balance === undefined, styles.loading_text));
	
	const cutDecimals = 2;

	const { isConnected } = useContext(ConnectionContext);

	const [title, setTitle] = useState(undefined);

	// ---- HOOKS ----

	useEffect(() => {
		refreshTitle();
	}, [isConnected, balance]);

	// ---- FUNCTIONS ----

	function refreshTitle() {
		if (balance !== undefined) {
			setTitle(balance + " (click to copy)");
		} else {
			if (isConnected === false) {
				setTitle(connectedText());
			} else {
				setTitle("loading...");
			}
		}
	}

	function getCutBalance(balance) {
		let balanceString = balance.toString();
		let balanceSplit = balanceString.split(".");
		let cutBalance = balanceSplit[0];
	
		if (balanceSplit.length === 2) {
			cutBalance += "." + balanceSplit[1].substr(0, cutDecimals);
		}
	
		if (balanceString !== cutBalance) {
			cutBalance += "...";
		}
	
		return cutBalance;
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleCopyClick(event) {
		if (balance !== undefined) {
			event.stopPropagation();

			navigator.clipboard.writeText(balance);
		}
	}

	return (
		<span className={classes} title={title} onClick={event => handleCopyClick(event)}>
			{balance !== undefined ? getCutBalance(balance) : 0}
		</span>
	);
}