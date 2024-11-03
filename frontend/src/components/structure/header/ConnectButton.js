import { useState, useContext, useEffect } from "react";
import styles from "./ConnectButton.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { isMetaMaskInstalled, isMetaMaskConnected, connectMetaMask, getAccount } from "../../../lib/web3/web3Base.js";

import { noMetaMask, onlyDisconnect } from "../../../data/messages.js";
import { projectName } from "../../../data/project.js";

export default function ConnectButton() {
	const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");

	const [isMetaMaskThere, setIsMetaMaskThere] = useState(false);
	const [isMetaMaskActive, setIsMetaMaskActive] = useState(false);

	const { isConnected } = useContext(ConnectionContext);

	// ---- HOOKS ----

	useEffect(() => {
		refreshProvider();
	}, []);

	useEffect(() => {
		refreshMetaMask();
	}, [isMetaMaskThere]);

	useEffect(() => {
		refreshAccount();
	}, [isConnected]);

	// ---- FUNCTIONS ----
	
	function refreshProvider() {
		let isMMInstalled = isMetaMaskInstalled();

		setIsMetaMaskThere(isMMInstalled);
	}

	function refreshMetaMask() {
		if (isMetaMaskThere) {
			isMetaMaskConnected().then(isMetaMaskStatus => {
				setIsMetaMaskActive(isMetaMaskStatus);
			});
		} else {
			setIsMetaMaskActive(isMetaMaskThere);
		}
	}

	function refreshAccount() {
		if (isConnected === true) {
			getAccount().then(account => {
				let accountText = account.substring(0, 6) + "..." + account.substring(account.length - 4, account.length);

				setConnectButtonText(accountText);
			});
		}
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleMetaMaskButton() {
		if (!isMetaMaskThere) {
			alert(noMetaMask());
		} else if (isMetaMaskActive) {
			alert(onlyDisconnect());
		} else {
			connectMetaMask()
				.then(() => {
					window.location.reload();
				})
				.catch(() => {});
		}
	}

	return (
		<button className={styles.connect_button} onClick={handleMetaMaskButton}>
			{
				(connectButtonText !== "Connect Wallet") &&
				<img className={styles.provider_image} src={"/images/providers/metamask.svg"} alt={"MetaMask for " + projectName}/>
			}
			<span>{connectButtonText}</span>
		</button>
	);
}