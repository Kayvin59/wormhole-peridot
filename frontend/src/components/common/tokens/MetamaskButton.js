import { useContext, useEffect, useRef } from "react";
import styles from "./MetamaskButton.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { isMetaMaskInstalled, isMetaMaskConnected, isWalletConnectConnected, addTokenToMetamask, addLPTokenToMetamask } from "../../../lib/web3/web3Base.js";

import { connectedText, chainText, onlyMetaMask } from "../../../data/messages.js";

export default function MetamaskButton({token, isLpToken}) {
	const { isChainSupported, isConnected } = useContext(ConnectionContext);

	const buttonRef = useRef(null);

	// ---- HOOKS ----

	useEffect(() => {
		refreshValidity();
	}, [isConnected, isChainSupported]);

	// ---- FUNCTIONS ----

	async function refreshValidity() {
		let button = buttonRef.current;

		if (button) {
			let isMMInstalled = isMetaMaskInstalled();

			if (isMMInstalled) {
				if (isConnected === true) {
					let isMMConnected = await isMetaMaskConnected();

					if (isMMConnected) {
						if (isChainSupported) {
							button.setCustomValidity("");
						} else {
							button.setCustomValidity(chainText());
						}
					} else {
						button.setCustomValidity(onlyMetaMask());
					}
				} else {
					button.setCustomValidity(connectedText());
				}
			} else {
				button.setCustomValidity(onlyMetaMask());
			}
		}
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleForm(event) {
		event.preventDefault();

		if (event.target.checkValidity()) {
			handleAddMetamask(token);
		}
	}

	function handleAddMetamask(token) {
		if (token !== undefined) {
			if (isLpToken) {
				addLPTokenToMetamask(token);
			} else {
				addTokenToMetamask(token);
			}
		}
	}

	return (
		<span className={styles.container} onClick={event => event.stopPropagation()}>
			<form onSubmit={handleForm} className={styles.form}>
				<input type="submit" value="" className={styles.button} ref={buttonRef}/>
			</form>
		</span>
	);
}