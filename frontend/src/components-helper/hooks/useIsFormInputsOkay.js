import { useState, useEffect } from "react";
import { isValidInput } from "../../lib/wrapper/html.js";

// hierarchy: 2
// usage: when the form button and additional inputs exist in the form
// validity: can be used for check after the standard form and input checks
// set: extraText
// set values okay: undefined, ""
// set values not okay: "DEFAULT", "custom message"
export default function useIsFormInputsOkay(formRef, reloadFormVariables=[]) {
	const attributeName = "isokay";

	const [isInputsOkay, setIsInputsOkay] = useState(false);

	useEffect(() => {
		if (formRef.current !== null) {
			let elements = undefined;

			if (formRef.current.id !== undefined && formRef.current.id !== "") {
				elements = Array.from(document.forms[formRef.current.id].elements);
			} else {
				elements = Array.from(formRef.current);
			}
	
			let inputs = elements.filter(element => isValidInput(element));
	
			const observer = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
						let isOkay = !inputs.map(input => input.attributes[attributeName].value).includes("false");
	
						setIsInputsOkay(isOkay);
					}
				}
			});
	
			for (const input of inputs) {
				observer.observe(input, { attributes: true });
			}
	
			return () => {
				for (const input of inputs) {
					observer.disconnect(input);
				}
			};
		}
	}, [formRef, ...reloadFormVariables]);

	return isInputsOkay;
}
