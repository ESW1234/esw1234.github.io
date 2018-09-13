'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class UserSettings {
    constructor() {
    }
    static getGroup(groupName) {
        return vscode.workspace.getConfiguration(groupName);
    }
}
exports.default = UserSettings;
//# sourceMappingURL=userSettings.js.map