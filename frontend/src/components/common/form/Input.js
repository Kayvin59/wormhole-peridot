import React, { useContext, useState, useEffect, useRef } from "react";
import { components } from "react-select";
import styles from "./Input.module.scss";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { conc, cond, getForm, getRandomId } from "../../../lib/wrapper/html.js";

import { noValue } from "../../../data/messages.js";

export default function Input({
	formId, 					// id to connect the input to a form
	getter, 					// useState getter
	setter, 					// useState setter
	label, 						// label above the input
	subLabel, 					// label below the input
	placeholder,				// placeholder text
	chain, 						// chain object, forces input to be used only on this chain
	isRequired=true, 			// does the input needs to be filled in?
	isProcessing, 				// is the form processing because the submit button was pressed?
	isLoading=false, 			// is data used for the input validation still initializing? (only isUnconnectedUsable=false)
	isUnconnectedLoading=false,	// is data used for the input validation still initializing? (only isUnconnectedUsable=true)
	isOff, 						// is the input just not usable?
	isUnconnectedUsable=false,	// should the input be usable even when the user is not connected?
	customValidParams,			// array of parameters whose changes also trigger the validation
	customIsNotEmpty,			// function which returns if the input is not empty
	customGetValidity, 			// function which returns the custom validation message
	input, 						// the input component
	isSelect=false, 			// is the data a SelectInput?
	isNumber=false,				// is the data a NumberInput?
	setNumberDisabled,			// useState setter of isDisabled in a NumberInput (only isNumber=true)
}) {
	const id = getRandomId();

	const { isChainSupported, isConnected, connectedChain } = useContext(ConnectionContext);

	const [isDisabled, setIsDisabled] = useState(true);
	const [isOkay, setIsOkay] = useState(false);

	const inputRef = useRef(null);

	// ---- HOOKS ----

	useEffect(() => {
		refreshDisabled();
	}, [
		chain,
		isProcessing,
		isLoading,
		isUnconnectedLoading,
		isOff,
		isUnconnectedUsable,
		isConnected,
		isChainSupported,
		connectedChain
	]);

	useEffect(() => {
		validateInput();
	}, [
		getter,
		isRequired,
		isOff,
		...customValidParams
	]);

	useEffect(() => {
		refreshNumberDisabled();
	}, [isDisabled]);

	// ---- FUNCTIONS ----

	function isChainOkay() {
		let isChainOkay = undefined;

		if (chain !== undefined) {
			isChainOkay = connectedChain === chain.nameId;
		} else {
			isChainOkay = isChainSupported;
		}

		return isChainOkay;
	}

	function refreshDisabled() {
		if (isUnconnectedUsable) {
			setIsDisabled(isUnconnectedLoading);
		} else {
			let isOnCorrectChain = (isConnected === true) && isChainOkay();

			setIsDisabled((isProcessing || isLoading || isOff || !isOnCorrectChain));
		}
	}

	function refreshNumberDisabled() {
		if (isNumber) {
			setNumberDisabled(isDisabled);
		}
	}

	function getInputRef() {
		return isSelect ? inputRef.current.inputRef : inputRef.current;
	}

	function setValidity(text) {
		getInputRef().setCustomValidity(text);

		setIsOkay(text === "");
	}

	function validateInput() {
		let form = getForm(getInputRef());

		if (form !== null) {
			if (customIsNotEmpty()) {
				customGetValidity().then(result => {
					setValidity(result);
				});
			} else {
				if (isRequired && !isOff) {
					setValidity(noValue());
				} else {
					setValidity("");
				}
			}
		}
	}

	function getInput() {
		let properties = undefined;

		if (isSelect) {
			properties = {
				inputId: id,
				onChange: choice => setter(choice),
				isDisabled: isDisabled,
				components: { Input: props => <components.Input {...props} isokay={isOkay.toString()}/> },
			};
		} else if (isNumber) {
			properties = {
				id: id,
				disabled: isDisabled,
				isokay: isOkay.toString(),
				className: conc(styles.input, input.props.className),
				value: getter,
				placeholder: placeholder
			};
		} else {
			properties = {
				id: id,
				onInput: event => setter(event.target.value),
				disabled: isDisabled,
				isokay: isOkay.toString(),
				className: conc(styles.input, input.props.className),
				value: getter,
				placeholder: placeholder
			};
		}

		return React.cloneElement(input, {
			ref: inputRef,
			form: formId,
			...properties
		});
	}

	return (
		<div className={styles.container}>
			{
				label !== undefined &&
				<label className={styles.label} htmlFor={id}>
					{label}
				</label>
			}
			
			<div className={cond(isDisabled, styles.input_disabled)}>
				{getInput()}
			</div>

			{
				subLabel !== undefined &&
				<div className={styles.sub_label}>{subLabel}</div>
			}
		</div>
	);
}