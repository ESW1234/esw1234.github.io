/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of filetransfer.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=filetransfer.esw.js --js_output_file=filetransfer.esw.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
 */

/**
 * Messages handled by this module:
 *     filetransfer.openFileSelector|filetransfer.uploadFile|filetransfer.resetFileSelector
 */

window.esw.defineFeature("FileTransfer", function(esw) {
	/**
	 * Module for handling file transfers within the Live Agent feature.
	 *
	 * @class
	 */
	function FileTransferAPI() {
		this.registerMessageHandlers();
	}

	/**
	 * Register message handlers pertaining to file transfer.
	 * 
	 * Note - These are just passthrough calls back to parent as a result of - W-5868126
	 * All the file transfer handling is now done in the parent frame
	 */
	FileTransferAPI.prototype.registerMessageHandlers = function registerMessageHandlers() {
		esw.addMessageHandler("fileTransfer.uploadFile", function(domain, data) {
			parent.postMessage({
				method: "liveagent.fileTransfer.uploadFile",
				data: data
			}, esw.parentOrigin);
		});

		esw.addMessageHandler("fileTransfer.resetFileSelector", function() {
			parent.postMessage({
				method: "liveagent.fileTransfer.resetFileSelector"
			}, esw.parentOrigin);
		});
	};

	esw.fileTransferAPI = new FileTransferAPI();
});