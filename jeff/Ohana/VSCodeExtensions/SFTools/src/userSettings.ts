'use strict';

import * as vscode from 'vscode';


export default class UserSettings {
	constructor() {
	}

	public static getGroup(groupName: string): Object {
		return vscode.workspace.getConfiguration(groupName);
	}
}
