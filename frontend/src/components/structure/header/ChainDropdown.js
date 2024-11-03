import { useState, useContext, useEffect } from "react";
import styles from "./ChainDropdown.module.scss";
import SortArrow from "../../common/others/SortArrow.js";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { getChainName, getChainId, switchChain } from "../../../lib/web3/web3Base.js";
import { conc, cond } from "../../../lib/wrapper/html.js";

import { getChains } from "../../../data/chains.js";
import { projectName } from "../../../data/project.js";

export default function ChainDropdown() {
	const { isConnected } = useContext(ConnectionContext);

	const [isChainsOpen, setIsChainsOpen] = useState(false);
	const [isChainImage, setIsChainImage] = useState(true);

	const [chainId, setChainId] = useState(undefined);
	const [chainName, setChainName] = useState(undefined);

	// ---- HOOKS ----

	useEffect(() => {
		refreshChainData();
	}, [isConnected]);

	// ---- FUNCTIONS ----

	function refreshChainData() {
		if (isConnected === true) {
			Promise.all([
				getChainId(),
				getChainName()
			]).then(values => {
				setChainId(values[0]);
				setChainName(values[1]);
			});
		}
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleSwitchChainButton(chain) {
		if (isConnected === true) {
			switchChain(chain).catch(() => {});
		}
	}

	// ---- FUNCTIONS (HTML ELEMENTS) ----

	function getChainButtons() {
		let chains = getChains();

		const chainButtons = chains.map((chain, index) => {
			let isDisabled = (isConnected !== true) || (chainId === chain.id);
			let title = (isConnected !== true) ? "please connect your wallet first" : undefined;

			return (
				<button key={index} className={conc(styles.chain_button, styles.chain_image_container)} onClick={() => handleSwitchChainButton(chain)} disabled={isDisabled} title={title}>
					<img className={styles.chain_image} src={"/images/chains/" + chain.nameId + ".svg"} alt={(chain.name + " (" + chain.nameId + ") chain for " + projectName)}/>
					<span>{chain.nameId}</span>
				</button>
			);
		});

		return chainButtons;
	}

	return (
		<div className={styles.container} onMouseLeave={() => setIsChainsOpen(false)}>
			<button className={conc(styles.dropdown_button, cond(isChainsOpen, styles.dropdown_button_active))} onMouseEnter={() => setIsChainsOpen(true)} onClick={() => setIsChainsOpen(!isChainsOpen)}>
				{
					chainName !== undefined
					?
						<div className={styles.chain_image_container}>
							{
								isChainImage === true &&
								<img className={styles.chain_image} src={"/images/chains/" + chainName + ".svg"} alt={chainName + " chain for " + projectName} onError={() => setIsChainImage(false)}/>
							}
							<span>{chainName}</span>
						</div>
					:
						<div>Chains</div>
				}
				<SortArrow isUp={isChainsOpen} isSmall={true} marginClasses={cond(isChainsOpen, styles.sort_arrow_up, styles.sort_arrow_down)}/>
			</button>
			{
				isChainsOpen &&
				<ul className={styles.chain_button_container}>
					{getChainButtons()}
				</ul>
			}
		</div>
	);
}