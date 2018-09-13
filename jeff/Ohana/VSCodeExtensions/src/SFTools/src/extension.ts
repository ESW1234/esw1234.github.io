'use strict';

import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
//import * as ld from 'lodash';
import * as clipboardy  from 'clipboardy';

import * as gist from '../more-@types/gist-package-json';
import * as scope from './scope';

import * as messageUtilities from './messageUtilities';
import * as MoreLodash from './moreLodash';
import ProjectPackage from './projectPackage';
import SfToolsUserSettings from './sfToolsUserSettings';



// activate() is called when the extension is activated.
// The extension is activated the first time the command is executed.
export function activate(context: vscode.ExtensionContext) {
	//console.log('"SF Tools" is now active!');

	// The commands here are defined in the package.json file.
	// The commandId parameters must match the command fields in package.json.

	let disposableP4LogIn: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.p4LogIn',
		p4LogIn
	);

	let disposableP4CheckOut: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.p4CheckOut',
		p4CheckOut
	);

	let disposableP4Revert: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.p4Revert',
		p4Revert
	);

	let disposableP4Add: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.p4Add',
		p4Add
	);

	// TODO: any other p4 commands?

	let disposableOpenFileInP4V: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.openFileInP4V',
		openFileInP4V
	);

	// TODO: open file in P4V's Workspace tree
	// (P4V needs to support AppleScript first)
	// or use p4vc


	let disposableOpenFileInEclipse: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.openFileInEclipse',
		openFileInEclipse
	);

	let disposableOpenFileInIntelliJ: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.openFileInIntelliJ',
		openFileInIntelliJ
	);

	let disposableOpenFileInSwarm: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.openFileInSwarm',
		openFileInSwarm
	);

	let disposableOpenFileInOpenGrok: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.openFileInOpenGrok',
		openFileInOpenGrok
	);

	let disposableRunCurrentComponentTest: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.runCurrentComponentTest',
		runCurrentComponentTest
	);

	let disposableRunAllComponentTests: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.runAllComponentTests',
		runAllComponentTests
	);

	// TODO: ftest(s) ?

	// TODO: unit test(s) ?

	let disposableRunEswCheck: vscode.Disposable = vscode.commands.registerCommand(
		'extension.sfTools.runEswCheck',
		runEswCheck
	);

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

// This method is called when the extension is deactivated.
export function deactivate() {
	// Nothing to do
}




// ****************************************************************************
// Callbacks

function p4LogIn(): void {
	let filePath: string = getFilePathOfCurrentDocument();
	sendCommandToTerminal(`echo ${SfToolsUserSettings.getSetting("p4Password")}|p4 login`);
}

function p4CheckOut(): void {
	let filePath: string = getFilePathOfCurrentDocument();
	sendCommandToTerminal(`p4 edit ${filePath}`);
}

function p4Revert(): void {
	let filePath: string = getFilePathOfCurrentDocument();
	sendCommandToTerminal(`p4 revert -a ${filePath}`);
}

function p4Add(): void {
	let filePath: string = getFilePathOfCurrentDocument();
	sendCommandToTerminal(`p4 add ${filePath}`);
}

function openFileInP4V(): void {
	let filePath: string = getFilePathOfCurrentDocument();
	clipboardy.writeSync(filePath);
	// Could also use node-copy-paste
	// https://github.com/xavi-/node-copy-paste
	// see https://github.com/Microsoft/vscode/issues/4972

	let fileName: string = path.basename(filePath);
	sendCommandToTerminal(`echo 'The file path to "${fileName}" has been copied to the clipboard.'`);

	// TODO: better integration with P4V
	// Once P4V supports AppleScript, change over and use AppleScript to navigate to the file in the workspace tree

	openFileInApplication(
		SfToolsUserSettings.getSetting("filePathToP4V"),
		filePath
	);
}


function openFileInEclipse(): void {
	openFileInApplication(
		//ProjectPackage.customSettings["filePathToEclipse"],
		//UserSettings.getGroup("sftools")["filePathToEclipse"],
		SfToolsUserSettings.getSetting("filePathToEclipse"),
		getFilePathOfCurrentDocument()
	);
}

function openFileInIntelliJ(): void {
	openFileInApplication(
		SfToolsUserSettings.getSetting("filePathToIntelliJ"),
		getFilePathOfCurrentDocument()
	);
}

function openFileInSwarm(): void {
	openFileInApplication(
		SfToolsUserSettings.getSetting("filePathToBrowser"),
		"https://swarm.soma.salesforce.com/files/" + getSourceControlPathOfCurrentDocument()
	);
}

function openFileInOpenGrok(): void {
	let sourceControlPath: string = getSourceControlPathOfCurrentDocument();
	let pathSplit: string[] = sourceControlPath.split("/");
	let prefix: string = (pathSplit[1] === "main")
							? "app_main_core/"
							: `app_${pathSplit[1]}_${pathSplit[2]}_core/`;
	openFileInApplication(
		SfToolsUserSettings.getSetting("filePathToBrowser"),
		`https://codesearch.data.sfdc.net/source/xref/${prefix}${sourceControlPath}`
	);
}


function runCurrentComponentTest(): void {
	// Get the current file's parent directory's path
	let filePath: string = vscode.window.activeTextEditor.document.fileName;
	let parentDirectoryPath: string = path.dirname(filePath);
	let parentDirectoryName: string = path.basename(parentDirectoryPath);

	// List a list of the files within the directory
	fs.readdir(parentDirectoryPath, function(err, items) {
		if(err) {
			showErrorMessage(`Unable to run component test.  Reason: \n\n${err}`);
			return;
		}

		if( !checkForFileNameWithCmp(items, parentDirectoryPath) ) {
			return;
		}

		if( !checkForFileNameWithTest(items, parentDirectoryPath) ) {
			return;
		}

		// Find the name of the function the caret is in
		let scopeFinder = new scope.ScopeFinder(vscode.window.activeTextEditor.document);
		let selection = vscode.window.activeTextEditor.selection;
		scopeFinder.getScopeNode(selection.start)
			.then(function(result) {
				let nameOfTest: string = undefined;
				if(result.symbolInfo && result.symbolInfo.name) {
					nameOfTest = result.symbolInfo.name;
				}
				else {
					let selection = vscode.window.activeTextEditor.selection;
					nameOfTest = vscode.window.activeTextEditor.document.getText(selection);
				}

				if(nameOfTest) {
					if(nameOfTest.startsWith("test")) {
						openFileInApplication(
							SfToolsUserSettings.getSetting("filePathToBrowser"),
							`${SfToolsUserSettings.getSetting("localOrgDomain")}/embeddedService/${parentDirectoryName}.cmp?aura.mode=JSTESTDEBUG&aura.jstest=${nameOfTest}`
						);
					}
					else {
						showErrorMessage(`Unable to run component test.  The function's name (${nameOfTest}) needs to start with 'test' (like 'testQueuePositionDisabled').`);
					}
				}
				else {
					showErrorMessage(`Unable to run component test.  Couldn't find the function name from the caret's location.`);
				}
			}, function(err) {
				showErrorMessage(`Unable to run component test.  An exception ws thrown:\n\n${err}`);
			});
	});
}

function runAllComponentTests(): void {
	let filePath: string = vscode.window.activeTextEditor.document.fileName;
	let parentDirectoryPath: string = path.dirname(filePath);
	let parentDirectoryName: string = path.basename(parentDirectoryPath);

	fs.readdir(parentDirectoryPath, function(err, items) {
		if(err) {
			showErrorMessage(`Unable to run component test.  Reason: \n\n${err}`);
			return;
		}

		if( !checkForFileNameWithCmp(items, parentDirectoryPath) ) {
			return;
		}

		if( !checkForFileNameWithTest(items, parentDirectoryPath) ) {
			return;
		}

		openFileInApplication(
			SfToolsUserSettings.getSetting("filePathToBrowser"),
			`${SfToolsUserSettings.getSetting("localOrgDomain")}/embeddedService/${parentDirectoryName}.cmp?aura.mode=JSTESTDEBUG`
		);
	});
}

function runEswCheck(): void {
	let sourceControlPath: string = getSourceControlPathOfCurrentDocument();
	let pathSplit: string[] = sourceControlPath.split("/");
	let branch: string = (pathSplit[1] === "main")
							? "main"
							: `${pathSplit[1]}/${pathSplit[2]}`;
	sendCommandToTerminal(`eswcheck ${branch}`);
}



// ****************************************************************************
// Helper functions

function checkForFileNameWithCmp(items: string[], parentDirectoryPath: string): boolean {
	if( !directoryContainsAComponentFile(items) ) {
		showErrorMessage(`Unable to run component test.  The current directory is:\n\n${parentDirectoryPath}\n\n...but a file ending with '.cmp' was not found.`);
		return false;
	}

	return true;
}

function checkForFileNameWithTest(items: string[], parentDirectoryPath: string): boolean {
	if( !directoryContainsAComponentTestFile(items) ) {
		showErrorMessage(`Unable to run component test.  The current directory is\n\n${parentDirectoryPath}\n\n...but a file starting with 'test' was not found.`);
		return false;
	}

	return true;
}

function showErrorMessage(message: string): void {
	vscode.window.showErrorMessage(message, new messageUtilities.DisplayAsModalAlert());
}

function sendCommandToTerminal(command: string): void {
	let projectPackage: gist.IPackage = ProjectPackage.getInstance().projectPackage;
	let terminals: ReadonlyArray<vscode.Terminal> = vscode.window.terminals;
	let terminal: vscode.Terminal = (!terminals || terminals.length < 1)
										? vscode.window.createTerminal(projectPackage.displayName)
										: terminals[0];
	terminal.show();
	terminal.sendText(command);
}

function getFilePathOfCurrentDocument(): string {
	return vscode.window.activeTextEditor.document.fileName;
}

function getSourceControlPathOfCurrentDocument(): string {
	let filePath: string = getFilePathOfCurrentDocument();
	let token: string = "/blt/";
	let index: number = filePath.indexOf(token) + token.length;
	let sourceControlPath: string = filePath.substr(index);

	return sourceControlPath;
}

function openFileInApplication(appPath: string, filePath: string) {
	childProcess.exec(`open -a "${appPath}" "${filePath}"`, (err, stdout, stderr) => {
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);
		if(err) {
			//console.log('error: ' + err);
			showErrorMessage(`Unable to file.  Reason: ${err}`);
		}
	});
}

function directoryContainsAComponentFile(items: string[]): boolean {
	return MoreLodash.containsMatch(items, (item: string) => {
		return item.endsWith(".cmp");
	});
}

function directoryContainsAComponentTestFile(items: string[]): boolean {
	return MoreLodash.containsMatch(items, (item: string) => {
		return item.endsWith("Test.js");
	});
}
