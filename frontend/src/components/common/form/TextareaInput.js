import styles from "./TextareaInput.module.scss";
import Input from "./Input.js";

export default function TextareaInput({
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
	validityTest, 				// function which returns if every line of the text is valid
	validityText 				// custom validity message for the validityTest function
}) {
	const customValidParams = [validityTest, validityText];

	// ---- FUNCTIONS ----

	function customIsNotEmpty() {
		return getter.replaceAll(" ", "") !== "";
	}

	async function customGetValidity() {
		let validity = undefined;

		if (validityTest !== undefined) {
			let lines = getter.split(/\r?\n/);

			let linesOkayness = await Promise.all(lines.map(async line => {
				let trimmedLine = line.trim();
				let isLineOkay = line !== "" ? await Promise.resolve(validityTest(trimmedLine)) : true;

				return isLineOkay;
			}));

			let areLinesOkay = linesOkayness.every(line => line);

			if (areLinesOkay) {
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
				<textarea rows="6" className={styles.input}/>
			}/>
	);
}