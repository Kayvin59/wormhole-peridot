import { useContext, useState, useEffect, useRef, forwardRef } from "react";
import styles from "./Form.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { isDefined } from "../../../lib/helper.js";
import { conc } from "../../../lib/wrapper/html.js";

import { connectedText, chainText, minBalanceText, minEqualBalanceText } from "../../../data/messages.js";

// ---- PROPS ----

// props.text: submit button text
// props.isLoading: is data used for the input validation still initializing?
// props.isProcessing: is the form processing because the submit button was pressed?
// props.isOff: is the form just not usable?
// props.chain: chain object, forces input to be used only on this chain

// props.currentValue: number which can be checked for validity
// props.minValue: number which is a lower bound for currentValue (only if currentValue is given)
// props.isMinEqual: is it valid if the currentValue is equal to the minValue? (only if currentValue is given)
// props.minText: custom validity message for the minValue comparison (only if currentValue is given)

// props.extraText: custom validity message for useIsFormOkay and useIsFormInputsOkay

// props.handler: function which executes the form when every input is valid and the form is okay
// props.formId: id to connect the form to inputs
// props.children: input components
// props.buttonClassNames: additional classes for the submit button
// props.subLabel: label below the submit button

export default forwardRef((props, ref) => {
	const processingText = "Processing";
	const intervalLength = 300;

	const defaultMinValue = 0;
	const defaultIsMinEqual = true;

	const { isWeb3Available, isChainSupported, isConnected, connectedChain } = useContext(ConnectionContext);

	const [isFormOkay, setIsFormOkay] = useState(false);

	const [buttonText, setButtonText] = useState(props.text);
	const [intervalId, setIntervalId] = useState(undefined);

	const buttonRef = useRef(null);

	// ---- HOOKS ----

	useEffect(() => {
		refreshValidity();
	}, [
		isWeb3Available,
		isChainSupported,
		isConnected,
		connectedChain,
		props.isLoading,
		props.isProcessing,
		props.isOff,
		props.chain,
		props.currentValue,
		props.minValue,
		props.isMinEqual,
		props.minText
	]);

	useEffect(() => {
		setExtraValidity();
	}, [props.extraText]);

	useEffect(() => {
		refreshButton();
	}, [intervalId, props.isProcessing, props.text]);

	// ---- FUNCTIONS ----

	function isChainOkay() {
		let isChainOkay = undefined;

		if (props.chain !== undefined) {
			isChainOkay = connectedChain === props.chain.nameId;
		} else {
			isChainOkay = isChainSupported;
		}

		return isChainOkay;
	}

	function isLoading() {
		let isChainLoading = (isWeb3Available === true) && !isDefined(isConnected, isChainSupported, connectedChain);
		let isLoading = (isConnected === true) && isChainOkay() && props.isLoading;

		return isChainLoading || isLoading || (props.isProcessing === true) || (props.isOff === true);
	}

	function setValidity(text) {
		buttonRef.current.setCustomValidity(text);

		setIsFormOkay(text === "");
	}

	function setExtraValidity() {
		if (props.extraText !== undefined && props.extraText !== "DEFAULT") {
			buttonRef.current.setCustomValidity(props.extraText);
		}
	}

	function refreshValidity() {
		if (!isLoading()) {
			if (isConnected === true) {
				if (isChainOkay()) {
					let hasCurrentValue = props.currentValue !== undefined;
	
					if (hasCurrentValue) {
						let currentValueFloat = parseFloat(props.currentValue);
	
						let minValue = props.minValue ?? defaultMinValue;
						let minValueFloat = parseFloat(minValue);
	
						if (props.isMinEqual ?? defaultIsMinEqual) {
							if (currentValueFloat >= minValueFloat) {
								setValidity("");
							} else {
								setValidity(props.minText ?? minBalanceText(props.currentValue, minValue));
							}
						} else {
							if (currentValueFloat > minValueFloat) {
								setValidity("");
							} else {
								setValidity(props.minText ?? minEqualBalanceText(props.currentValue, minValue));
							}
						}
					} else {
						setValidity("");
					}
				} else {
					setValidity(chainText());
				}
			} else {
				setValidity(connectedText());
			}
		}
	}

	function refreshButton() {
		if (props.isProcessing) {
			if (intervalId === undefined) {
				setButtonText(processingText);
	
				let dots = "";
				let interval = setInterval(() => {
					dots = dots.length < 3 ? dots + "." : "";
	
					setButtonText(processingText + dots);
				}, intervalLength);
	
				setIntervalId(interval);
			}
		} else {
			clearInterval(intervalId);
			setIntervalId(undefined);
			setButtonText(props.text);
		}
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleForm(event) {
		event.preventDefault();

		if (event.target.checkValidity()) {
			props.handler();
		}
	}

	return (
		<div className={styles.container}>
			<form onSubmit={handleForm} ref={ref} id={props.formId} className={styles.form}>
				{props.children}

				<input
					type="submit"
					ref={buttonRef}
					className={conc(styles.button, props.buttonClassNames)}
					value={buttonText}
					disabled={isLoading()}
					isformokay={isFormOkay.toString()}/>
			</form>

			{
				props.subLabel !== undefined &&
				<div className={styles.sub_label}>{props.subLabel}</div>
			}
		</div>
	);
});