import Input from "./Input.js";
import { toDateString } from "../../../lib/helper.js";

import { minDateText, maxDateText } from "../../../data/messages.js";

export default function DateInput({
	formId,
	getter,						// initial: ""
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
	min,						// min date
	max							// max date
}) {
	const customValidParams = [min, max];

	const minDateString = min?.toISOString().slice(0, 16);
	const maxDateString = max?.toISOString().slice(0, 16);

	// ---- FUNCTIONS ----

	function customIsNotEmpty() {
		return getter.replaceAll(" ", "") !== "";
	}

	async function customGetValidity() {
		let validity = undefined;

		let getterDate = new Date(getter);
		let minValidText = toDateString(min);
		let maxValidText = toDateString(max);

		if (min !== undefined && getterDate < min) {
			validity = minDateText(minValidText);
		} else if (max !== undefined && getterDate > max) {
			validity = maxDateText(maxValidText);
		} else {
			validity = "";
		}

		return validity;
	}

	return (
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
					type="datetime-local"
					min={minDateString}
					max={maxDateString}
				/>
			}/>
	);
}