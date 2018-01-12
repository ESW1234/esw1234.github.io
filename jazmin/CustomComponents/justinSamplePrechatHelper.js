({
    /**
     * Event which fires the function to start a chat request (by accessing the chat API component).
     * 
     * @param cmp - The component for this state.
     */
    onStartButtonClick: function(cmp) {
        var prechatFieldComponents = cmp.find("prechatField");
        var apiNamesMap = this.createAPINamesMap(cmp.find("prechatAPI").getPrechatFields());
        var fields;

        // Make an array of field objects for the library.
        fields = this.createFieldsArray(apiNamesMap, prechatFieldComponents);
        
        // If the prechat fields pass validation, start a chat.
        if(cmp.find("prechatAPI").validateFields(fields).valid) {
            cmp.find("prechatAPI").startChat(fields);
        } else {
            console.warn("Prechat fields did not pass validation!");
        }
    },

    /**
     * Create an array of field objects to start a chat from an array of prechat fields.
     * 
     * @param fields - Array of prechat field Objects.
     * @returns An array of field objects.
     */
    createFieldsArray: function(apiNames, fieldCmps) {
        if(fieldCmps.length) {
            return fieldCmps.map(function(fieldCmp) {
                return {
                    label: fieldCmp.get("v.label"),
                    value: fieldCmp.get("v.value"),
                    name: apiNames[fieldCmp.get("v.label")]
                };
            }.bind(this));
        } else {
            return [];
        }
    },

    /**
     * Create map of field label to field API name from the pre-chat fields array.
     * 
     * @param fields - Array of prechat field Objects.
     * @returns An array of field objects.
     */
    createAPINamesMap: function(fields) {
        var values = {};

        fields.forEach(function(field) {
            values[field.label] = field.name;
        });
        
        return values;
    },
    
    /**
     * Create an array in the format $A.createComponents expects.
     * 
     * Example:
     * [["componentType", {attributeName: "attributeValue", ...}]]
     * 
     * @param prechatFields - Array of prechat field Objects.
     * @returns Array that can be passed to $A.createComponents
     */
    getPrechatFieldAttributesArray: function(prechatFields) {
        // $A.createComponents first parameter is an array of arrays. Each array contains the type of component being created, and an Object defining the attributes.
        var prechatFieldsInfoArray = [];

        // For each field, prepare the type and attributes to pass to $A.createComponents.
        prechatFields.forEach(function(field) {
            var componentName = (field.type === "inputSplitName") ? "inputText" : field.type;
            var componentInfoArray = ["ui:" + componentName];
            var attributes = {
                "aura:id": "prechatField",
                required: field.required,
                label: field.label,
                disabled: field.readOnly,
                maxlength: field.maxLength,
                required: field.required,
                class: field.className,
                value: field.value
            };
            
            // Special handling for options for an input:select (picklist) component.
            if(field.type === "inputSelect" && field.picklistOptions) attributes.options = field.picklistOptions
            
            // Append the attributes Object containing the required attributes to render this prechat field.
            componentInfoArray.push(attributes);
            
            // Append this componentInfoArray to the fieldAttributesArray.
            prechatFieldsInfoArray.push(componentInfoArray);
        });

        return prechatFieldsInfoArray;
    }
});
