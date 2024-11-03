import { useState, useEffect } from "react";
import styles from "./ProviderModal.module.scss";
import { isMetaMaskInstalled, isMetaMaskConnected, connectMetaMask, isWalletConnectConnected, connectWalletConnect, disconnectWalletConnect } from "../../../lib/web3/web3Base.js";
import { conc, cond } from "../../../lib/wrapper/html.js";
import { noMetaMask, onlyDisconnect } from "../../../data/messages.js";

import { projectName } from "../../../data/project.js";

export default function ProviderModal({closeModal}) {
	const [isMetaMaskThere, setIsMetaMaskThere] = useState(false);
	const [isMetaMaskActive, setIsMetaMaskActive] = useState(false);

	const [isWalletConnectActive, setIsWalletConnectActive] = useState(false);

	// ---- HOOKS ----

	useEffect(() => {
		refreshProvider();
	}, []);

	useEffect(() => {
		refreshMetaMask();
	}, [isMetaMaskThere]);

	// ---- FUNCTIONS ----

	function refreshProvider() {
		isWalletConnectConnected().then(isWalletConnectStatus => {
			if (isWalletConnectStatus) {
				setIsWalletConnectActive(true);
			} else {
				let isMMInstalled = isMetaMaskInstalled();

				setIsMetaMaskThere(isMMInstalled);
			}
		});
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

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleMetaMaskButton() {
		if (!isMetaMaskThere) {
			alert(noMetaMask());
		} else if (isMetaMaskActive) {
			alert(onlyDisconnect());
		} else {
			connectMetaMask().then(async () => {
				if (isWalletConnectActive) {
					await disconnectWalletConnect();
				}

				window.location.reload();
			});

			closeModal();
		}
	}

	function handleWalletConnectButton() {
		if (isWalletConnectActive) {
			disconnectWalletConnect();
		} else {
			connectWalletConnect();
			
			closeModal();
		}
	}

	return (
		<div className={styles.container}>
			<button className={styles.provider_button} onClick={handleMetaMaskButton}>
				<div>
					<img className={styles.provider_image} src={"/images/providers/metamask.svg"} alt={"Connect with MetaMask to " + projectName}/>
					<span>MetaMask</span>
				</div>

				<div className={conc(styles.provider_circle, cond(isMetaMaskActive, styles.provider_circle_active))}></div>
			</button>

			<button className={styles.provider_button} onClick={handleWalletConnectButton}>
				<div>
					<img className={styles.provider_image} src={"/images/providers/walletconnect.svg"} alt={"Connect with WalletConnect to " + projectName}/>
					<span>WalletConnect</span>
				</div>

				<div className={conc(styles.provider_circle, cond(isWalletConnectActive, styles.provider_circle_active))}></div>
			</button>
		</div>
	);
}