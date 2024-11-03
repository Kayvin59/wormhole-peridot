import { useState } from "react";
import styles from "./NumberInput.module.scss";
import Input from "./Input.js";
import { conc, cond } from "../../../lib/wrapper/html.js";

import { zeroText, minNumberText, minEqualNumberText, maxNumberText, maxEqualNumberText, balanceNumberText } from "../../../data/messages.js";

export default function NumberInput({
	formId,
	getter, 					// initial: ""
	setter,
	label,
	subLabel,
	placeholder,
	chain,
	isRequired=true,
	isProcessing,
	isLoading=false,
	isUnconnectedLoading=false,
	isOff,
	isUnconnectedUsable=false,
	decimals=0, 				// number of possible decimals
	min=0, 						// minimal possible number
	max, 						// maximal possible number
	isMinEqual=false,			// is it valid if the getter is equal to the min? (only if min is given)
	isMaxEqual=true,			// is it valid if the getter is equal to the max? (only if max is given)
	showMaxButton=false,		// is the max button visible?
	isZeroAllowed=false,		// is zero a possible number?
	balance						// the balance which will be compared to the getter
}) {
	const customValidParams = [min, max, isMinEqual, isMaxEqual, isZeroAllowed, balance];

	const [isDisabled, setIsDisabled] = useState(true);

	// ---- FUNCTIONS ----

	function customIsNotEmpty() {
		return getter.replaceAll(" ", "") !== "";
	}

	async function customGetValidity() {
		let validity = undefined;

		let inputFloat = parseFloat(getter);
		let balanceFloat = parseFloat(balance);
	
		let minFloat = parseFloat(min);
		let maxFloat = parseFloat(max);

		if (!isZeroAllowed && inputFloat === 0.0) {
			validity = zeroText();
		} else if (min !== undefined && isMinEqual && inputFloat < minFloat) {
			validity = minEqualNumberText(min);
		} else if (min !== undefined && !isMinEqual && inputFloat <= minFloat) {
			validity = minNumberText(min);
		} else if (balance !== undefined && inputFloat > balanceFloat) {
			validity = balanceNumberText();
		} else if (max !== undefined && isMaxEqual && inputFloat > maxFloat) {
			validity = maxEqualNumberText(max);
		} else if (max !== undefined && !isMaxEqual && inputFloat >= maxFloat) {
			validity = maxNumberText(max);
		} else {
			validity = "";
		}

		return validity;
	}

	function handleChangeInput(event) {
		let newAmount = event.target.value;
		let amount = getter;

		if (decimals > 0) {
			let regex = new RegExp("^[0-9]*[.,]?[0-9]{0," + decimals + "}$");

			if (regex.test(newAmount)) {
				newAmount = newAmount.replace(",", ".");
				amount = newAmount.startsWith(".") ? "0" + newAmount : newAmount;
			}
		} else {
			let regex = new RegExp("^[0-9]*$");

			if (regex.test(newAmount)) {
				amount = newAmount;
			}
		}

		setter(amount);
	}

	// ---- FUNCTIONS (CLICK HANDLERS) ----

	function handleMaxButton(event) {
		event.preventDefault();

		setter(max.toString());
	}

	return (
		<div className={styles.container}>
			<Input
				formId={formId}
				getter={getter}
				setter={setter}
				label={label}
				subLabel={subLabel}
				placeholder={placeholder}
				chain={chain}
				isRequired={isRequired}
				isProcessing={isProcessing}
				isLoading={isLoading}
				isUnconnectedLoading={isUnconnectedLoading}
				isOff={isOff}
				isUnconnectedUsable={isUnconnectedUsable}
				customValidParams={customValidParams}
				customIsNotEmpty={customIsNotEmpty}
				customGetValidity={customGetValidity}
				input={
					<input
						type="text"
						step="any"
						onInput={event => handleChangeInput(event)}
						className={cond(max !== undefined && showMaxButton, styles.input_with_max)}
					/>
				}
				isNumber={true}
				setNumberDisabled={setIsDisabled}/>

				{
					(max !== undefined && showMaxButton) &&
					<div className={conc(styles.max_button_container, cond(isDisabled, styles.max_button_container_disabled))}>
						<button className={styles.max_button} onClick={event => handleMaxButton(event)} disabled={isDisabled}>MAX</button>
					</div>
				}
		</div>
	);
}