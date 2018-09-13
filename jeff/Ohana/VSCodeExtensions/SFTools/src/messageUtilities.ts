'use strict';

import * as vscode from 'vscode';


export class DisplayAsModalAlert implements vscode.MessageOptions {
	modal?: boolean;

	constructor() {
		this.modal = true;
	}
}

export class DisplayAsNotification implements vscode.MessageOptions {
	modal?: boolean;

	constructor() {
		this.modal = false;
	}
}
