import { track, api, LightningElement } from "lwc";

export default class CustomPrechatForm extends LightningElement {
    @api configuration = {};

    startConversationLabel;

    get prechatForm() {
        const forms = this.configuration.forms || [];
        return forms.find(form => form.formType === "PreChat") || {};
    }

    get prechatFormFields() {
        return this.prechatForm.formFields || [];
    }

    get fields() {
        let fields =  JSON.parse(JSON.stringify(this.prechatFormFields));
        this.addChoiceListValues(fields);
        return fields.sort((fieldA, fieldB) => fieldA.order - fieldB.order);
    }

    connectedCallback() {
        this.startConversationLabel = "Start Conversation";
    }

    addChoiceListValues(fields) {
        for (let field of fields) {
            if (field.type === "ChoiceList") {
                const valueList = this.configuration.choiceListConfig.choiceList.find(list => list.choiceListId === field.choiceListId) || {};
                field.choiceListValues = valueList.choiceListValues || [];
            }
        }
    }

    isValid() {
        let isFormValid = true;
        this.template.querySelectorAll("c-custom-prechat-form-field").forEach(formField => {
            if (!formField.reportValidity()) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

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