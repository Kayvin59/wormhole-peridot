// ---- STYLES ----

export function conc(...styles) {
	return styles.join(" ");
}

export function cond(condition, style, alternativeStyle) {
	return condition ? style : alternativeStyle;
}

// ---- FORM ----

export function getForm(input) {
	return input.form;
}

export function getSubmitButton(form) {
	return Array.from(form).find(element => element.nodeName === "INPUT" && element.type === "submit");
}

export function isValidInput(element) {
	return (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA" || element.nodeName === "SELECT") && element.type !== "submit";
}

export function getRandomId() {
	return parseInt(Math.random() * 10000000000);
}

// ---- CSS VARIABLES ----

function getCssVariable(variable) {
	return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function setCssVariable(variable, value) {
	document.documentElement.style.setProperty(variable, value);
}

export function getCssVariablePixel(variable) {
	let cssVariable = getCssVariable(variable);

	return parseInt(cssVariable.replaceAll("px", ""));
}

export function setCssVariablePixel(variable, value) {
	setCssVariable(variable, value + "px");
}

export function getCssVariableColor(variable) {
	return getCssVariable(variable);
}

export function getCssVariableColorNumber(variable) {
	let cssVariable = getCssVariable(variable);

	return Number(cssVariable.replace("#", "0x"));
}

// ---- SCROLLING ----

export function scrollToAnchor() {
	let hash = window.location.hash;

	if (hash !== "" && hash !== "#top") {
		try {
			const anchorElement = document.querySelector(hash);

			if (anchorElement !== null) {
				anchorElement.scrollIntoView({ behavior: "smooth" });
			}
		} catch { }
	}
}