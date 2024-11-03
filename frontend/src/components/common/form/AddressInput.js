import StringInput from "./StringInput.js";
import { isAddress } from "../../../lib/helper.js";

export default function AddressInput({
	formId,
	getter,
	setter,
	label,
	subLabel,
	placeholder,
	chain,
	isRequired,
	isProcessing,
	isLoading,
	isUnconnectedLoading,
	isOff,
	isUnconnectedUsable
}) {
	return (
		<StringInput
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
			validityTest={isAddress}
			maxLength={42}/>
	);
}