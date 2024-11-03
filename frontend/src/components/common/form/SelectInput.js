import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import styles from "./SelectInput.module.scss";
import Input from "./Input.js";
import { getCssVariableColor } from "../../../lib/wrapper/html.js";

export default function SelectInput({
	formId,
	getter, 					// initial: null (only isMulti=false), [] (only isMulti=true)
	setter,
	label,
	subLabel,
	chain,
	isRequired=true,
	isProcessing,
	isLoading=false,
	isUnconnectedLoading=false,
	isOff,
	isUnconnectedUsable=false,
	options, 					// array with the possible options -> [{value: 'chocolate', label: 'Chocolate'}, ...]
	placeholder,				// placeholder text
	defaultValue, 				// default value -> {value: 'chocolate', label: 'Chocolate'}
	isMulti=false, 				// is it possible for the user to select multiple options?
	isCreatable=false, 			// is it possible for the user to create new options?
	isValidNewOption 			// is the new created option valid? (only isCreatable=true)
}) {
	const backgroundColorFocused = getCssVariableColor("--color-4");
	const backgroundColorSelected = getCssVariableColor("--color-1");
	const textColor = getCssVariableColor("--text-color-bright");

	const customValidParams = [isMulti];

	// ---- FUNCTIONS ----

	function customIsNotEmpty() {
		return (isMulti && getter.length > 0) || (!isMulti && getter !== null);
	}

	async function customGetValidity() {
		return "";
	}

	function getClassNames() {
		return {
			container: () => styles.select_container,
			control: () => styles.input,
			menuList: () => styles.menu_list,
			option: () => styles.option,
			valueContainer: () => styles.value_container,
			singleValue: () => styles.single_value,
			multiValue: () => styles.multi_value,
			indicatorsContainer: () => styles.indicators_container,
			indicatorSeparator: () => styles.indicator_separator
		};
	}

	function getGeneralProps() {
		return {
			classNames: getClassNames(),
			options: options,
			isClearable: true,
			placeholder: placeholder,
			isMulti: isMulti,
			closeMenuOnSelect: !isMulti,
			unstyled: true,
			styles: {
				option: (base, state) => {
					let newBase = { ...base };

					if (state.isFocused) {
						newBase.backgroundColor = backgroundColorFocused;
						newBase.color = textColor;
					} else if (state.isSelected) {
						newBase.backgroundColor = backgroundColorSelected;
						newBase.color = textColor;
					}

					return newBase;
				}
			}
		};
	}

	function getCreatableProps() {
		return {
			isValidNewOption: isValidNewOption
		};
	}

	function getNormalProps() {
		return {
			defaultValue: defaultValue
		};
	}

	return (
		<Input
			formId={formId}
			getter={getter}
			setter={setter}
			label={label}
			subLabel={subLabel}
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
				isCreatable
				?
					<CreatableSelect {...getGeneralProps()} {...getCreatableProps()}/>
				:
					<Select {...getGeneralProps()} {...getNormalProps()}/>
			}
			isSelect={true}/>
	);
}