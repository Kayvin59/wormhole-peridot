// ---- FORM ----

export function connectedText() {
	return "you are not connected";
}

export function chainText() {
	return "you are not on the correct chain";
}

export function noValue() {
	return "please type in a value";
}

export function minBalanceText(currentValue, minValue) {
	return "your balance needs to be at least " + minValue + ", current balance: " + currentValue;
}

export function minEqualBalanceText(currentValue, minEqualValue) {
	return "your balance needs to be bigger than " + minEqualValue + ", current balance: " + currentValue;
}

// ---- FORM - NUMBER INPUT ----

export function zeroText() {
	return "zero is not allowed as a value";
}

export function integerText() {
	return "number needs to be an integer";
}

export function minNumberText(min) {
	return "please type in a number bigger than " + min;
}

export function minEqualNumberText(min) {
	return "please type in a number bigger than or equal to " + min;
}

export function maxNumberText(max) {
	return "please type in a number smaller than or equal to " + max;
}

export function maxEqualNumberText(max) {
	return "please type in a number smaller than " + max;
}

export function balanceNumberText() {
	return "your balance is too low";
}

// ---- FORM - DATE INPUT ----

export function minDateText(min) {
	return "please type in a date after than " + min;
}

export function maxDateText(max) {
	return "please type in a date earlier than " + max;
}

// ---- METAMASK / WALLET CONNECT ----

export function onlyMetaMask() {
	return "only available for metamask";
}

export function noMetaMask() {
	return "metamask is not installed on your device";
}

export function onlyDisconnect() {
	return "you can only disconnect metamask yourself via restarting the browser";
}

export function requestedChain() {
	return "the requested chain is not supported";
}

export function chainDoesNotExist() {
	return "this chain does not exist on your wallet provider";
}