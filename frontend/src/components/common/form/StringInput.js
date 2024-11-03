import Input from "./Input.js";

export default function StringInput({
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
	validityTest, 				// function which returns if the string is valid
	validityText, 				// custom validity message for the validityTest function
	maxLength=20 				// max length for the string
}) {
	const customValidParams = [validityTest, validityText];

	// ---- FUNCTIONS ----

	function customIsNotEmpty() {
		return getter.replaceAll(" ", "") !== "";
	}

	async function customGetValidity() {
		let validity = undefined;

		if (validityTest !== undefined) {
			let isTextValid = await Promise.resolve(validityTest(getter));

			if (isTextValid) {
				validity = "";
			} else {
				validity = validityText ?? "not valid";
			}
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
				<input type="text" maxLength={maxLength}/>
			}/>
	);
}