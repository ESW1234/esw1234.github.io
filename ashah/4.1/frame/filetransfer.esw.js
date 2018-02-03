/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of filetransfer.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * Version 3.0 - Refactored to follow prototype pattern and utilize new modulization system.
 * 
 * TO MINIFY: java -jar ~/yuicompressor-2.4.8.jar --preserve-semi --disable-optimizations filetransfer.esw.js -o filetransfer.esw.min.js
 */

/**
 * Messages handled by this module:
 *     filetransfer.openFileSelector|filetransfer.uploadFile|filetransfer.resetFileSelector
 * 
 * Messages sent from this module:
 *    - When the file selector value is changed:
 *      {
 *        method : liveagent.fileTransfer.recieveFileTransfer
 *        data: an object with the file name and size.
 *      }
 */

window.esw.defineFeature("FileTransfer", function(esw) {
	/**
	 * Module for handling file transfers within the Live Agent feature.
	 *
	 * @class
	 */
	function FileTransferAPI() {
		this.createElements();
		this.registerMessageHandlers();
	}

	/**
	 * Register message handlers pertaining to file transfer.
	 */
	FileTransferAPI.prototype.registerMessageHandlers = function registerMessageHandlers() {
		esw.addMessageHandler("fileTransfer.openFileSelector", function() {
			this.openFileSelector();
		}.bind(this));

		esw.addMessageHandler("fileTransfer.uploadFile", function(domain, data) {
			this.uploadFile(data);
		}.bind(this));

		esw.addMessageHandler("fileTransfer.resetFileSelector", function() {
			this.resetFileSelector();
		}.bind(this));
	};

	/**
	 * Open the file selector within the iframe.
	 */
	FileTransferAPI.prototype.openFileSelector = function openFileSelector() {
		document.getElementById("fileSelector").click();
	};

	/**
	 * Send the file name and size to the input footer in order to display the information.
	 */
	FileTransferAPI.prototype.handleFileSelectorChange = function handleFileSelectorChange() {
		var file = document.getElementById("fileSelector").files[0];

		parent.postMessage({
			method: "liveagent.fileTransfer.recieveFileTransfer",
			data: {
				name: file.name,
				size: file.size
			}
		}, esw.parentOrigin);
	};

	/**
	 * Upload the file to the agent.
	 *
	 * @param {object} data - An object containing the upload URL.
	 */
	FileTransferAPI.prototype.uploadFile = function uploadFile(data) {
		var form = document.getElementById("fileUploadForm");
		
		form.action = data.url;
		form.submit();

		this.resetFileSelector();
	};

	/**
	 * Reset the files on the file selector to undefined so that the next file the user selects
	 * fires the onchange event.
	 */
	FileTransferAPI.prototype.resetFileSelector = function resetFileSelector() {
		document.getElementById("fileSelector").value = "";
	};

	/**
	 * Append the file transfer form to the iframe body.
	 */
	FileTransferAPI.prototype.createElements = function createElements() {
		var uploadForm = document.createElement("form");
		var fileInput = document.createElement("input");
		var filenameInput = document.createElement("input");
		var iframe = document.createElement("iframe");

		uploadForm.id = "fileUploadForm";
		uploadForm.enctype = "multipart/form-data";
		uploadForm.method = "post";
		uploadForm.target = "fileUploadIframe";

		fileInput.type = "file";
		fileInput.id = "fileSelector";
		fileInput.name = "file";
		fileInput.onchange = this.handleFileSelectorChange;

		filenameInput.name = "filename";

		iframe.id = "fileUploadIframe";
		iframe.name = "fileUploadIframe";
		iframe.title = "FileUploadFrame";

		uploadForm.appendChild(fileInput);
		uploadForm.appendChild(filenameInput);

		document.body.appendChild(uploadForm);
		document.body.appendChild(iframe);
	};

	esw.fileTransferAPI = new FileTransferAPI();
});