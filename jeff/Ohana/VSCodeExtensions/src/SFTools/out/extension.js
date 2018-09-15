'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
//import * as ld from 'lodash';
const clipboardy = require("clipboardy");
const scope = require("./scope");
const messageUtilities = require("./messageUtilities");
const MoreLodash = require("./moreLodash");
const projectPackage_1 = require("./projectPackage");
const sfToolsUserSettings_1 = require("./sfToolsUserSettings");
// activate() is called when the extension is activated.
// The extension is activated the first time the command is executed.
function activate(context) {
    //console.log('"SF Tools" is now active!');
    // The commands here are defined in the package.json file.
    // The commandId parameters must match the command fields in package.json.
    let disposableP4LogIn = vscode.commands.registerCommand('extension.sfTools.p4LogIn', p4LogIn);
    let disposableP4CheckOut = vscode.commands.registerCommand('extension.sfTools.p4CheckOut', p4CheckOut);
    let disposableP4Revert = vscode.commands.registerCommand('extension.sfTools.p4Revert', p4Revert);
    let disposableP4Add = vscode.commands.registerCommand('extension.sfTools.p4Add', p4Add);
    // TODO: any other p4 commands?
    let disposableOpenFileInP4V = vscode.commands.registerCommand('extension.sfTools.openFileInP4V', openFileInP4V);
    // TODO: open file in P4V's Workspace tree
    // (P4V needs to support AppleScript first)
    // or use p4vc
    let disposableOpenFileInEclipse = vscode.commands.registerCommand('extension.sfTools.openFileInEclipse', openFileInEclipse);
    let disposableOpenFileInIntelliJ = vscode.commands.registerCommand('extension.sfTools.openFileInIntelliJ', openFileInIntelliJ);
    let disposableOpenFileInSwarm = vscode.commands.registerCommand('extension.sfTools.openFileInSwarm', openFileInSwarm);
    let disposableOpenFileInOpenGrok = vscode.commands.registerCommand('extension.sfTools.openFileInOpenGrok', openFileInOpenGrok);
    let disposableRunCurrentComponentTest = vscode.commands.registerCommand('extension.sfTools.runCurrentComponentTest', runCurrentComponentTest);
    let disposableRunAllComponentTests = vscode.commands.registerCommand('extension.sfTools.runAllComponentTests', runAllComponentTests);
    // TODO: ftest(s) ?
    // TODO: unit test(s) ?
    let disposableRunEswCheck = vscode.commands.registerCommand('extension.sfTools.runEswCheck', runEswCheck);
    // TODO: custom search history?
    // TODO: tie into search?
    // TODO: tie into "file locked" dlg box (for when saving)?
    context.subscriptions.push(disposableP4LogIn);
    context.subscriptions.push(disposableP4CheckOut);
    context.subscriptions.push(disposableP4Revert);
    context.subscriptions.push(disposableP4Add);
    context.subscriptions.push(disposableOpenFileInP4V);
    context.subscriptions.push(disposableOpenFileInEclipse);
    context.subscriptions.push(disposableOpenFileInIntelliJ);
    context.subscriptions.push(disposableOpenFileInSwarm);
    context.subscriptions.push(disposableOpenFileInOpenGrok);
    context.subscriptions.push(disposableRunCurrentComponentTest);
    context.subscriptions.push(disposableRunAllComponentTests);
    context.subscriptions.push(disposableRunEswCheck);
}
exports.activate = activate;
// This method is called when the extension is deactivated.
function deactivate() {
    // Nothing to do
}
exports.deactivate = deactivate;
// ****************************************************************************
// Callbacks
function p4LogIn() {
    let filePath = getFilePathOfCurrentDocument();
    sendCommandToTerminal(`echo ${sfToolsUserSettings_1.default.getSetting("p4Password")}|p4 login`);
}
function p4CheckOut() {
    let filePath = getFilePathOfCurrentDocument();
    sendCommandToTerminal(`p4 edit ${filePath}`);
}
function p4Revert() {
    let filePath = getFilePathOfCurrentDocument();
    sendCommandToTerminal(`p4 revert -a ${filePath}`);
}
function p4Add() {
    let filePath = getFilePathOfCurrentDocument();
    sendCommandToTerminal(`p4 add ${filePath}`);
}
function openFileInP4V() {
    let filePath = getFilePathOfCurrentDocument();
    clipboardy.writeSync(filePath);
    // Could also use node-copy-paste
    // https://github.com/xavi-/node-copy-paste
    // see https://github.com/Microsoft/vscode/issues/4972
    let fileName = path.basename(filePath);
    sendCommandToTerminal(`echo 'The file path to "${fileName}" has been copied to the clipboard.'`);
    // TODO: better integration with P4V
    // Once P4V supports AppleScript, change over and use AppleScript to navigate to the file in the workspace tree
    openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToP4V"), filePath);
}
function openFileInEclipse() {
    openFileInApplication(
    //ProjectPackage.customSettings["filePathToEclipse"],
    //UserSettings.getGroup("sftools")["filePathToEclipse"],
    sfToolsUserSettings_1.default.getSetting("filePathToEclipse"), getFilePathOfCurrentDocument());
}
function openFileInIntelliJ() {
    openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToIntelliJ"), getFilePathOfCurrentDocument());
}
function openFileInSwarm() {
    openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToBrowser"), "https://swarm.soma.salesforce.com/files/" + getSourceControlPathOfCurrentDocument());
}
function openFileInOpenGrok() {
    let sourceControlPath = getSourceControlPathOfCurrentDocument();
    let pathSplit = sourceControlPath.split("/");
    let prefix = (pathSplit[1] === "main")
        ? "app_main_core/"
        : `app_${pathSplit[1]}_${pathSplit[2]}_core/`;
    openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToBrowser"), `https://codesearch.data.sfdc.net/source/xref/${prefix}${sourceControlPath}`);
}
function runCurrentComponentTest() {
    // Get the current file's parent directory's path
    let filePath = vscode.window.activeTextEditor.document.fileName;
    let parentDirectoryPath = path.dirname(filePath);
    let parentDirectoryName = path.basename(parentDirectoryPath);
    // List a list of the files within the directory
    fs.readdir(parentDirectoryPath, function (err, items) {
        if (err) {
            showErrorMessage(`Unable to run component test.  Reason: \n\n${err}`);
            return;
        }
        if (!checkForFileNameWithCmp(items, parentDirectoryPath)) {
            return;
        }
        if (!checkForFileNameWithTest(items, parentDirectoryPath)) {
            return;
        }
        // Find the name of the function the caret is in
        let scopeFinder = new scope.ScopeFinder(vscode.window.activeTextEditor.document);
        let selection = vscode.window.activeTextEditor.selection;
        scopeFinder.getScopeNode(selection.start)
            .then(function (result) {
            let nameOfTest = undefined;
            if (result.symbolInfo && result.symbolInfo.name) {
                nameOfTest = result.symbolInfo.name;
            }
            else {
                let selection = vscode.window.activeTextEditor.selection;
                nameOfTest = vscode.window.activeTextEditor.document.getText(selection);
            }
            if (nameOfTest) {
                if (nameOfTest.startsWith("test")) {
                    openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToBrowser"), `${sfToolsUserSettings_1.default.getSetting("localOrgDomain")}/embeddedService/${parentDirectoryName}.cmp?aura.mode=JSTESTDEBUG&aura.jstest=${nameOfTest}`);
                }
                else {
                    showErrorMessage(`Unable to run component test.  The function's name (${nameOfTest}) needs to start with 'test' (like 'testQueuePositionDisabled').`);
                }
            }
            else {
                showErrorMessage(`Unable to run component test.  Couldn't find the function name from the caret's location.`);
            }
        }, function (err) {
            showErrorMessage(`Unable to run component test.  An exception ws thrown:\n\n${err}`);
        });
    });
}
function runAllComponentTests() {
    let filePath = vscode.window.activeTextEditor.document.fileName;
    let parentDirectoryPath = path.dirname(filePath);
    let parentDirectoryName = path.basename(parentDirectoryPath);
    fs.readdir(parentDirectoryPath, function (err, items) {
        if (err) {
            showErrorMessage(`Unable to run component test.  Reason: \n\n${err}`);
            return;
        }
        if (!checkForFileNameWithCmp(items, parentDirectoryPath)) {
            return;
        }
        if (!checkForFileNameWithTest(items, parentDirectoryPath)) {
            return;
        }
        openFileInApplication(sfToolsUserSettings_1.default.getSetting("filePathToBrowser"), `${sfToolsUserSettings_1.default.getSetting("localOrgDomain")}/embeddedService/${parentDirectoryName}.cmp?aura.mode=JSTESTDEBUG`);
    });
}
function runEswCheck() {
    let sourceControlPath = getSourceControlPathOfCurrentDocument();
    let pathSplit = sourceControlPath.split("/");
    let branch = (pathSplit[1] === "main")
        ? "main"
        : `${pathSplit[1]}/${pathSplit[2]}`;
    sendCommandToTerminal(`eswcheck ${branch}`);
}
// ****************************************************************************
// Helper functions
function checkForFileNameWithCmp(items, parentDirectoryPath) {
    if (!directoryContainsAComponentFile(items)) {
        showErrorMessage(`Unable to run component test.  The current directory is:\n\n${parentDirectoryPath}\n\n...but a file ending with '.cmp' was not found.`);
        return false;
    }
    return true;
}
function checkForFileNameWithTest(items, parentDirectoryPath) {
    if (!directoryContainsAComponentTestFile(items)) {
        showErrorMessage(`Unable to run component test.  The current directory is\n\n${parentDirectoryPath}\n\n...but a file starting with 'test' was not found.`);
        return false;
    }
    return true;
}
function showErrorMessage(message) {
    vscode.window.showErrorMessage(message, new messageUtilities.DisplayAsModalAlert());
}
function sendCommandToTerminal(command) {
    let projectPackage = projectPackage_1.default.getInstance().projectPackage;
    let terminals = vscode.window.terminals;
    let terminal = (!terminals || terminals.length < 1)
        ? vscode.window.createTerminal(projectPackage.displayName)
        : terminals[0];
    terminal.show();
    terminal.sendText(command);
}
function getFilePathOfCurrentDocument() {
    return vscode.window.activeTextEditor.document.fileName;
}
function getSourceControlPathOfCurrentDocument() {
    let filePath = getFilePathOfCurrentDocument();
    let token = "/blt/";
    let index = filePath.indexOf(token) + token.length;
    let sourceControlPath = filePath.substr(index);
    return sourceControlPath;
}
function openFileInApplication(appPath, filePath) {
    childProcess.exec(`open -a "${appPath}" "${filePath}"`, (err, stdout, stderr) => {
        //console.log('stdout: ' + stdout);
        //console.log('stderr: ' + stderr);
        if (err) {
            //console.log('error: ' + err);
            showErrorMessage(`Unable to file.  Reason: ${err}`);
        }
    });
}
function directoryContainsAComponentFile(items) {
    return MoreLodash.containsMatch(items, (item) => {
        return item.endsWith(".cmp");
    });
}
function directoryContainsAComponentTestFile(items) {
    return MoreLodash.containsMatch(items, (item) => {
        return item.endsWith("Test.js");
    });
}
//# sourceMappingURL=extension.js.map