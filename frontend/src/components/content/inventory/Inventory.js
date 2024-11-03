import { useState, useEffect, useContext } from "react";
import styles from "./Inventory.module.scss";
import SectionContainer from "../../structure/SectionContainer.js";
import Section from "../../structure/Section.js";
import LoadingSpinner from "../../common/loading/LoadingSpinner.js";
import Dropdown from "../../common/others/Dropdown.js";
import BlindBox from "./components/BlindBox.js";
import MiniNft from "./components/MiniNft.js";
import PeridotToken from "./components/PeridotToken.js";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { conc, cond } from "../../../lib/wrapper/html.js";

import { getCollections } from "../../../data/collections.js";

export default function Inventory() {
	const dropdownAll = "ALL";
	const pseudoLoadingTime = 800;

	const allCollections = getCollections();

	const headerTabs = [
		{
			key: "blindBox",
			text: "My Blind Boxes"
		},
		{
			key: "peridotMiniNfts",
			text: "My Peridot Mini NFTs"
		},
		{
			key: "peridotErc20",
			text: "My Peridot ERC20 Tokens"
		},
	];

	const dropdownElements = [dropdownAll, ...allCollections.map(collection => collection.name)];

	const [headerTab, setHeaderTab] = useState(headerTabs[0].key);
	const [dropdown, setDropdown] = useState(dropdownElements[0]);

	const [collections, setCollections] = useState(undefined);

	const [blindBoxes, setBlindBoxes] = useState(undefined);
	const [miniNfts, setMiniNfts] = useState(undefined);
	const [tokens, setTokens] = useState(undefined);

	const [isPseudoLoading, setIsPseudoLoading] = useState(false);

	const { connectedChain } = useContext(ConnectionContext);

	// ---- HOOKS ----

	useEffect(() => {
		initializeHeaderTab();
	}, []);

	useEffect(() => {
		refreshCollections();
	}, [dropdown]);

	useEffect(() => {
		refreshLists();
	}, [collections]);

	// ---- FUNCTIONS ----

	function initializeHeaderTab() {
		handleTabChange(headerTabs[0].key);
	}

	function refreshCollections() {
		if (dropdown === dropdownAll) {
			setCollections([...allCollections]);
		} else {
			let collection = [allCollections.find(collection => collection.name === dropdown)];

			setCollections([...collection]);
		}
	}

	function refreshLists() {
		refreshBlindBoxes();
		refreshMiniNfts();
		refreshTokens();
	}

	async function refreshBlindBoxes() {
		if (collections !== undefined) {
			let promises = collections.map(async (collection, index) => {
				return <BlindBox key={index} collection={collection} refreshLists={refreshLists}/>;
			});

			let blindBoxes = await Promise.all(promises);

			setBlindBoxes([...blindBoxes]);
		}
	}

	async function refreshMiniNfts() {
		if (collections !== undefined) {
			let promises = collections.map(async (collection, index) => {
				return <MiniNft key={index} collection={collection}/>;
			});

			let miniNfts = await Promise.all(promises);

			setMiniNfts([...miniNfts]);
		}
	}

	async function refreshTokens() {
		if (collections !== undefined) {
			let promises = collections.map((collection, index) => {
				return <PeridotToken key={index} collection={collection}/>;
			});
	
			let tokens = await Promise.all(promises);
	
			setTokens([...tokens]);
		}
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleDropdownChange(collectionName) {
		if (collectionName !== dropdown) {
			setIsPseudoLoading(true);
			setDropdown(collectionName);

			setTimeout(() => {
				setIsPseudoLoading(false);
			}, pseudoLoadingTime);
		}
	}

	function handleTabChange(tabKey) {
		if (tabKey !== headerTab) {
			setIsPseudoLoading(true);
			setHeaderTab(tabKey);

			setTimeout(() => {
				setIsPseudoLoading(false);
			}, pseudoLoadingTime);
		}
	}

	// ---- FUNCTIONS (HTML ELEMENTS) ----

	function getHeaderTabs() {
		let tabs = headerTabs.map((tab, index) => {
			if (connectedChain === "BASE" && tab.key === "peridotMiniNfts") {
				return undefined;
			}

			return (
				<div key={index} className={conc(styles.header_tab, cond(headerTab === tab.key, styles.header_tab_selected))} onClick={() => handleTabChange(tab.key)}>
					{tab.text}
				</div>
			);
		});

		tabs = tabs.filter(tab => tab !== undefined);

		return tabs;
	}

	function getDropdownElements() {
		return dropdownElements.map((element, index) => {
			return (
				<span key={index} className={styles.header_dropdown_element} onClick={() => handleDropdownChange(element)}>{element}</span>
			);
		});
	}

	return (
		<SectionContainer>
			<Section title={"Inventory"}>
				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.header_tab_container}>
							{getHeaderTabs()}
						</div>

						<Dropdown title={dropdown} titleClassName={styles.header_dropdown_title}>
							{getDropdownElements()}
						</Dropdown>
					</div>

					<div className={styles.bar}/>

					<div className={styles.content_container}>
						{
							!isPseudoLoading
							?
								<div>
									{
										headerTab === "blindBox"
										?
											<div className={styles.nft_container}>
												{blindBoxes}
											</div>
										:
											headerTab === "peridotErc20"
											?
												<div className={styles.token_container}>
													{tokens}
												</div>
											:
												<div className={styles.nft_container}>
													{miniNfts}
												</div>
									}
								</div>
							:
								<div className={styles.loading_container}>
									<LoadingSpinner/>
								</div>
						}
					</div>
				</div>
			</Section>
		</SectionContainer>
	);
}