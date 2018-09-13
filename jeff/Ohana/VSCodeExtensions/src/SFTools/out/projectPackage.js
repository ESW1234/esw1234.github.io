'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class ProjectPackage {
    constructor() {
        if (ProjectPackage._instance) {
            throw new Error("Error: Instantiation failed, use SingletonClass.getInstance() instead of new!");
        }
        ProjectPackage._instance = this;
        // Could also use the read-pkg or read-pkg-up node packages
        let packageJson = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");
        ProjectPackage._instance._projectPackage = JSON.parse(packageJson);
    }
    static getInstance() {
        return ProjectPackage._instance;
    }
    get projectPackage() {
        return this._projectPackage;
    }
    static get customSettings() {
        return ProjectPackage._instance._projectPackage.customSettings;
    }
}
ProjectPackage._instance = new ProjectPackage();
exports.default = ProjectPackage;
//# sourceMappingURL=projectPackage.js.map