import { useState, useEffect } from "react";
import { getSubmitButton } from "../../lib/wrapper/html.js";

// hierarchy: 1
// usage: when ONLY the form button exists in the form
// validity: can be used for check after the standard form checks
// set: extraText
// set values okay: undefined, ""
// set values not okay: "DEFAULT", "custom message"
export default function useIsFormOkay(formRef, reloadFormVariables=[]) {
	const attributeName = "isformokay";

	const [isFormOkay, setIsFormOkay] = useState(false);

	useEffect(() => {
		if (formRef.current !== null) {	
			let submitButton = getSubmitButton(formRef.current);

			const observer = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
						let isOkay = submitButton.attributes[attributeName].value === "true";

						setIsFormOkay(isOkay);
					}
				}
			});
	
			observer.observe(submitButton, { attributes: true });
	
			return () => {
				observer.disconnect(submitButton);
			};
		}
	}, [formRef, ...reloadFormVariables]);

	return isFormOkay;
}
