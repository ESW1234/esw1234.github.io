import { track, api, LightningElement } from "lwc";

export default class CustomPrechatForm extends LightningElement {
    /**
     * Deployment configuration data.
     * @type {Object}
     */
    @api configuration = {};

    startConversationLabel;

    get prechatForm() {
        const forms = this.configuration.forms || [];
        return forms.find(form => form.formType === "PreChat") || {};
    }

    get prechatFormFields() {
        return this.prechatForm.formFields || [];
    }

    /**
     * Returns prechat form fields in a sorted display order.
     * @type {Object[]}
     */
    get fields() {
        let fields =  JSON.parse(JSON.stringify(this.prechatFormFields));
        this.addChoiceListValues(fields);
        return fields.sort((fieldA, fieldB) => fieldA.order - fieldB.order);
    }

    connectedCallback() {
        this.startConversationLabel = "Start Conversation";
    }

    /**
     * Adds choicelist values to fields of type choiceList (dropdown).
     */
    addChoiceListValues(fields) {
        for (let field of fields) {
            if (field.type === "ChoiceList") {
                const valueList = this.configuration.choiceListConfig.choiceList.find(list => list.choiceListId === field.choiceListId) || {};
                field.choiceListValues = valueList.choiceListValues || [];
            }
        }
    }

    /**
     * Iterates over and reports validity for each form field. Returns true if all the fields are valid.
     * @type {boolean}
     */
    isValid() {
        let isFormValid = true;
        this.template.querySelectorAll("c-custom-prechat-form-field").forEach(formField => {
            if (!formField.reportValidity()) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    /**
     * Gathers and submits prechat data to the app on start converation button click.
     * @type {boolean}
     */
    handleStartConversation() {
        const prechatData = {};
        if (this.isValid()) {
            this.template.querySelectorAll("c-custom-prechat-form-field").forEach(formField => {
                prechatData[formField.name] = String(formField.value);
            });

            this.dispatchEvent(new CustomEvent(
                "prechatsubmit",
                {
                    detail: { value: prechatData }
                }
            ));
        }
    }
}
