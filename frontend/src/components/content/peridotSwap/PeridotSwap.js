import { useState, useContext, useEffect } from "react";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import styles from "./PeridotSwap.module.scss";
import { BalancesContext } from "../../../components-helper/contexts/BalancesProvider.js";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import Form from "../../common/form/Form.js";
import NumberInput from "../../common/form/NumberInput.js";
import Modal from "../../common/modals/Modal.js";
import Dropdown from "../../common/others/Dropdown.js";
import BalanceTooltip from "../../common/tokens/BalanceTooltip.js";
import Token from "../../common/tokens/Token.js";
import SectionContainer from "../../structure/SectionContainer.js";
import Section from "../../structure/Section.js";
import { getMiniNftBalance } from "../../../lib/web3/web3BaseAdd.js";
import { getBottomValue, getTopValue, swapMiniNftToNft, swapMiniNftToToken, swapTokenToMiniNft } from "../../../lib/web3/web3PeridotSwap.js";
import { isDefined } from "../../../lib/helper.js";
import { conc, cond } from "../../../lib/wrapper/html.js";

import { getCollections, getCollection } from "../../../data/collections.js";

export default function PeridotSwap() {
	const tokenArrowSize = 28;

	const swapFormId = "swapForm";

	const parameterString = window.location.search;
	const urlParams = new URLSearchParams(parameterString);

	const urlChain = urlParams.get("chain") !== null ? urlParams.get("chain") : undefined;
	const urlName = urlParams.get("name") !== null ? urlParams.get("name") : undefined;
	const urlInput = urlParams.get("input") !== null ? urlParams.get("input") : undefined;

	const collections = getCollections();
	const defaultCollection = collections[0];

	const [collection, setCollection] = useState(undefined);

	const [tax, setTax] = useState(undefined);

	const [topToken, setTopToken] = useState(undefined);
	const [bottomToken, setBottomToken] = useState(undefined);

	const [topBalance, setTopBalance] = useState(undefined);
	const [bottomBalance, setBottomBalance] = useState(undefined);

	const [miniNftBalance, setMiniNftBalance] = useState(undefined);
	const [tokenBalance, setTokenBalance] = useState(undefined);

	const [topValue, setTopValue] = useState("");
	const [bottomValue, setBottomValue] = useState("");

	const [oldTopValue, setOldTopValue] = useState("");
	const [oldBottomValue, setOldBottomValue] = useState("");

	const [isSwapProcessing, setIsSwapProcessing] = useState(false);

	const [isTopTokenModalOpen, setIsTopTokenModalOpen] = useState(false);
	const [isBottomTokenModalOpen, setIsBottomTokenModalOpen] = useState(false);

	const { balances, getBalance, updateBalances } = useContext(BalancesContext);
	const { isConnected } = useContext(ConnectionContext);

	// ---- HOOKS (REFRESH) ----

	useEffect(() => {
		initializeCollection();
	}, []);

	useEffect(() => {
		refreshTokens();
	}, [collection]);

	useEffect(() => {
		refreshTax();
	}, [collection, bottomToken]);

	useEffect(() => {
		refreshTokenBalance();
	}, [collection, balances]);

	useEffect(() => {
		refreshMiniNftBalance();
	}, [isConnected]);

	useEffect(() => {
		refreshTopBottomBalances();
	}, [topToken, bottomToken, miniNftBalance, tokenBalance]);

	useEffect(() => {
		resetValues();
	}, [topToken, bottomToken]);

	// ---- HOOKS (INPUT) ----

	useEffect(() => {
		refreshBottomAmount();
	}, [topToken, bottomToken, topValue]);

	useEffect(() => {
		refreshTopAmount();
	}, [topToken, bottomToken, bottomValue]);

	// ---- FUNCTIONS (REFRESH) ----
	
	function initializeCollection() {
		if (isDefined(urlChain, urlName)) {
			let urlCollection = getCollection(urlChain, urlName);

			setCollection(urlCollection);
		} else {
			setCollection(defaultCollection);
		}
	}

	function refreshTokens() {
		if (collection !== undefined) {
			let topToken = undefined;
			let bottomToken = undefined;

			switch (urlInput) {
				case undefined:
					topToken = collection.miniNft;
					bottomToken = collection.nft;

					break;
					
				case "token":
					topToken = collection.token;
					bottomToken = collection.miniNft;
				
					break;

				case "nft":
					topToken = collection.miniNft;
					bottomToken = collection.nft;
				
					break;
			}

			setTopToken(topToken);
			setBottomToken(bottomToken);
		}
	}

	function refreshTax() {
		let tax = undefined;

		if (bottomToken !== undefined) {
			if (bottomToken.contract === collection.nft.contract) {
				tax = collection.nftTax;
			} else if (bottomToken.contract === collection.miniNft.contract) {
				tax = collection.tokenTax;
			} else if (bottomToken.contract === collection.token.contract) {
				tax = 0;
			}
		}

		setTax(tax);
	}

	function refreshTokenBalance() {
		if (isDefined(collection, balances)) {
			let tokenBalance = getBalance(collection.token);

			setTokenBalance(tokenBalance);
		}
	}

	function refreshMiniNftBalance() {
		if (isConnected === true && isDefined(collection)) {
			getMiniNftBalance(collection.chain.nameId, collection.miniNft.contract).then(result => {
				setMiniNftBalance(result);
			});
		}
	}

	function refreshTopBottomBalances() {
		if (isDefined(topToken, bottomToken, miniNftBalance, tokenBalance)) {
			let topBalance = getBalanceForToken(topToken);
			let bottomBalance = getBalanceForToken(bottomToken);

			setTopBalance(topBalance);
			setBottomBalance(bottomBalance);
		}
	}

	function resetValues() {
		setTopValue("");
		setBottomValue("");
	}

	// ---- FUNCTIONS (HELPER) ----

	function getBalanceForToken(token) {
		let balance = undefined;

		if (token.contract === collection.nft.contract) {
			balance = "INITIALIZED";
		} else if (token.contract === collection.miniNft.contract) {
			balance = miniNftBalance;
		} else if (token.contract === collection.token.contract) {
			balance = tokenBalance;
		}

		return balance;
	}

	function isIntegerToken(token) {
		return token !== undefined ? token.contract !== collection.token.contract : false;
	}

	// ---- FUNCTIONS (INPUT) ----

	function refreshBottomAmount() {
		if (isDefined(topToken, bottomToken)) {
			if (topValue !== "" && parseFloat(topValue) !== 0) {
				if (topValue !== oldTopValue) {
					setOldTopValue(topValue);

					let isTokenBottom = bottomToken.contract === collection.token.contract;

					getBottomValue(isTokenBottom, tax, topValue).then(result => {
						setBottomValue(result.toString());
						setOldBottomValue(result.toString());
					});
				}
			} else {
				setBottomValue("");
				setOldBottomValue("");
			}
		}
	}

	function refreshTopAmount() {
		if (isDefined(topToken, bottomToken)) {
			if (bottomValue !== "" && parseFloat(bottomValue) !== 0) {
				if (bottomValue !== oldBottomValue) {
					setOldBottomValue(bottomValue);

					let isTokenBottom = bottomToken.contract === collection.token.contract;

					getTopValue(isTokenBottom, tax, bottomValue)
						.then(result => {
							setTopValue(result.toString());
							setOldTopValue(result.toString());
						});
				}
			} else {
				setTopValue("");
				setOldTopValue("");
			}
		}
	}

	// ---- FUNCTIONS (FORM LOADING) ----

	function isFormLoading() {
		return !isDefined(topToken, bottomToken, topBalance, bottomBalance);
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleTopTokenModalSelect(newTopToken) {
		setTopToken(newTopToken);

		if (newTopToken.contract === collection.miniNft.contract) {
			if (bottomToken.contract === collection.miniNft.contract) {
				setBottomToken(collection.nft);
			}
		} else { // collection.token.contract
			setBottomToken(collection.miniNft);
		}

		setIsTopTokenModalOpen(false);
	}

	function handleBottomTokenModalSelect(newBottomToken) {
		setBottomToken(newBottomToken);

		if (newBottomToken.contract === collection.nft.contract) {
			setTopToken(collection.miniNft);
		} else if (newBottomToken.contract === collection.miniNft.contract) {
			setTopToken(collection.token);
		} else { // collection.token.contract
			setTopToken(collection.miniNft);
		}

		setIsBottomTokenModalOpen(false);
	}

	function handleSwapTopBottom() {
		if (isDefined(collection, topToken, bottomToken)) {
			if (bottomToken.contract !== collection.nft.contract) {
				setTopToken(bottomToken);
				setBottomToken(topToken);
	
				setTopValue(bottomValue);
			} else {
				alert("This direction is not possible.");
			}
		}
	}

	function handleSwap() {
		setIsSwapProcessing(true);

		let promise = undefined;

		if (topToken.contract === collection.miniNft.contract) {
			if (bottomToken.contract === collection.token.contract) {
				promise = swapMiniNftToToken(collection.miniNft.contract, topValue);
			} else { // collection.nft.contract
				promise = swapMiniNftToNft(collection.nft.contract, collection.miniNft.contract);
			}
		} else { // collection.token.contract
			promise = swapTokenToMiniNft(collection.token.contract, collection.miniNft.contract, topValue, bottomValue);
		}

		promise
			.then(() => {
				resetValues();
				updateBalances();
				refreshMiniNftBalance();
			})
			.finally(() => {
				setIsSwapProcessing(false);
			});
	}

	// ---- FUNCTIONS (HTML ELEMENTS) ----

	function getDropdownElements() {
		return collections.map((collection, index) => {
			return (
				<span key={index} className={styles.dropdown_element} onClick={() => setCollection(collection)}>{collection.name}</span>
			);
		});
	}

	function getTokenModalElements(isTop) {
		if (isDefined(topToken, bottomToken)) {
			let tokens = [
				collection.nft,
				collection.miniNft,
				collection.token
			];

			if (isTop) {
				tokens.shift();
			}

			return tokens.map((token,  index) => {
				let balance = getBalanceForToken(token);

				let selectedToken = isTop ? topToken : bottomToken;
				let isSelected = (token.chain === selectedToken.chain) && (token.symbol === selectedToken.symbol);

				let classes = conc(styles.token_modal_element, cond(isSelected, styles.token_modal_element_selected));

				let onClick = isTop ? () => handleTopTokenModalSelect(token) : () => handleBottomTokenModalSelect(token);

				return (
					<div key={index} className={classes} onClick={onClick}>
						<Token token={token}/>
						{
							(token.contract !== collection.nft.contract) &&
							<BalanceTooltip balance={balance}/>
						}
					</div>
				);
			});
		} else {
			return [];
		}
	}

	return (
		<SectionContainer>
			<Section title={"Swap Tokens"}>
				<div>
					<div className={styles.container}>
						<div className={styles.swap_box_container}>
							<div className={styles.dropdown_wrapper}>
								<Dropdown title={collection?.name ?? "..."} titleClassName={styles.dropdown_title}>
									{getDropdownElements()}
								</Dropdown>
							</div>

							<div className={styles.token_container}>
								<div className={styles.input_header}>
									<div>from</div>
									<div className={styles.balance_container}>
										<span>Balance:</span>
										<BalanceTooltip balance={topBalance}/>
									</div>
								</div>
								<div className={styles.input_footer}>
									<NumberInput
										formId={swapFormId}
										getter={topValue}
										setter={setTopValue}
										isProcessing={isSwapProcessing}
										isLoading={isFormLoading()}
										decimals={topToken?.decimals}
										max={topBalance}
										isInteger={isIntegerToken(topToken)}
										balance={topBalance}/>
									
									<div className={styles.input_token_container} onClick={() => setIsTopTokenModalOpen(true)}>
										<Token token={topToken}/>
										<MdKeyboardArrowDown size={tokenArrowSize}/>
									</div>
								</div>
							</div>

							<div className={styles.token_swap_button}>
								<HiOutlineSwitchVertical size={40} onClick={handleSwapTopBottom}/>
								<div>Tax: {tax ?? "..."}%</div>
							</div>

							<div className={styles.token_container}>
								<div className={styles.input_header}>
									<div>to</div>
									{
										(isDefined(bottomToken, collection) && (bottomToken.contract !== collection.nft.contract)) &&
										<div>
											<div className={styles.balance_container}>
												<span>Balance:</span>
												<BalanceTooltip balance={bottomBalance}/>
											</div>
										</div>
									}
								</div>
								<div className={styles.input_footer}>
									<NumberInput
										formId={swapFormId}
										getter={bottomValue}
										setter={setBottomValue}
										isProcessing={isSwapProcessing}
										isLoading={isFormLoading()}
										decimals={bottomToken?.decimals}
										isInteger={isIntegerToken(bottomToken)}/>

									<div className={styles.input_token_container} onClick={() => setIsBottomTokenModalOpen(true)}>
										<Token token={bottomToken}/>
										<MdKeyboardArrowDown size={tokenArrowSize}/>
									</div>
								</div>
							</div>
						</div>

						<div className={styles.form_button_container}>
							<Form
								formId={swapFormId}
								handler={handleSwap}
								text={"Swap"}
								chain={topToken?.chain}
								isLoading={isFormLoading()}
								isProcessing={isSwapProcessing}/>
						</div>
					</div>

					<Modal isOpen={isTopTokenModalOpen} close={() => setIsTopTokenModalOpen(false)} title={"Select Top Token"}>
						<div className={styles.token_modal_container}>
							{getTokenModalElements(true)}
						</div>
					</Modal>

					<Modal isOpen={isBottomTokenModalOpen} close={() => setIsBottomTokenModalOpen(false)} title={"Select Bottom Token"}>
						<div className={styles.token_modal_container}>
							{getTokenModalElements(false)}
						</div>
					</Modal>
				</div>
			</Section>
		</SectionContainer>
	);
}