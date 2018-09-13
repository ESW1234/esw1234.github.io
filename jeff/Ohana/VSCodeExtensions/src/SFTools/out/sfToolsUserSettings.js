'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const userSettings_1 = require("./userSettings");
const messageUtilities = require("./messageUtilities");
class SfToolsUserSettings extends userSettings_1.default {
    constructor() {
        super();
    }
    static getSetting(settingName) {
        let setting = this.getGroup('sftools')[settingName];
        if (!setting || setting.length < 1) {
            vscode.window.showErrorMessage(`Error: missing configuration "sftools.${settingName}`, new messageUtilities.DisplayAsModalAlert());
        }
        return setting;
    }
}
exports.default = SfToolsUserSettings;
//# sourceMappingURL=sfToolsUserSettings.js.map