import { track, api, LightningElement } from "lwc";

export default class CustomPrechatFormField extends LightningElement {
    choiceListDefaultValue;

    /**
     * Form field data.
     * @type {Object}
     */
    @api fieldInfo = {};

    @api
    get name() {
        return this.fieldInfo.name;
    }

    @api
    get value() {
        const lightningCmp = this.isTypeChoiceList ? this.template.querySelector("lightning-combobox") : this.template.querySelector("lightning-input");
        return this.isTypeCheckbox ? lightningCmp.checked : lightningCmp.value;
    }

    @api
    reportValidity() {
        const lightningCmp = this.isTypeChoiceList ? this.template.querySelector("lightning-combobox") : this.template.querySelector("lightning-input");
        return lightningCmp.reportValidity();
    }

    get type() {
        switch (this.fieldInfo.type) {
            case "Phone":
                return "tel";
            case "Text":
            case "Email":
            case "Number":
            case "Checkbox":
            case "ChoiceList":
                return this.fieldInfo.type.toLowerCase();
            default:
                return "text";
        }
    }

    get isTypeCheckbox() {
        return this.type === "Checkbox".toLowerCase();
    }

    get isTypeChoiceList() {
        return this.type === "ChoiceList".toLowerCase();
    }

    /**
     * Formats choiceList options and sets the default value.
     * @type {Array}
     */
    get choiceListOptions() {
        let choiceListOptions = [];
        const choiceListValues = [...this.fieldInfo.choiceListValues];
        choiceListValues.sort((valueA, valueB) => valueA.order - valueB.order);
        for (const listValue of choiceListValues) {
            if (listValue.isDefaultValue) {
                this.choiceListDefaultValue = listValue.choiceListValueName;
            }
            choiceListOptions.push({ label: listValue.label, value: listValue.choiceListValueName });
        }
        return choiceListOptions;
    }
}
