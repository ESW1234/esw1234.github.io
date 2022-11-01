/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */
(() => {
	/**
	 * File Preview Iframe content's class constants.
	 * @type {string}
	 */
	const EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CLASS = "fullSizeFilePreviewModal";
	const EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CONTENT_CLASS = "fullSizeFilePreviewModalContent";
	const EMBEDDED_MESSAGING_FILE_PREVIEW_CLOSE_BUTTON_CLASS = "fullSizeFilePreviewModalCloseButton";
	const EMBEDDED_MESSAGING_FILE_PREVIEW_SHOW_CLASS = "show";

	/**
	 * File Preview Iframe event names.
	 * @type {string}
	 */
	const EMBEDDED_MESSAGING_INITIALIZE_FILE_PREVIEW_FRAME_EVENT = "ESW_INITIALIZE_FILE_PREVIEW_FRAME";
	const EMBEDDED_MESSAGING_SHOW_FULL_SIZE_FILE_PREVIEW_EVENT = "ESW_SHOW_FULL_SIZE_FILE_PREVIEW";
	const EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT = "ESW_APP_SHOW_FILE_PREVIEW_FRAME";
	const EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT = "ESW_APP_HIDE_FILE_PREVIEW_FRAME";

	const SALESFORCE_DOMAINS = [
		// Used by dev, blitz, and prod instances
		".salesforce.com",

		// Used by VPODs
		".force.com",

		// Used by autobuild VMs
		".sfdc.net",

		// Used by local environments and Enhanced Domains CDN
		".site.com",
		
		// Enhanced domains on sandbox
		".salesforce-sites.com"
	];

	/**
	 * The parent domain hosting bootstrap.js.
	 */
	let parentDomain;

	/**
	 * Check if this file was loaded into a Salesforce Site.
	 *
	 * @return {boolean} True if this page is a Salesforce Site.
	 */
	function isSiteContext() {
		return window.$A && typeof window.$A.get === "function" && window.$A.get("$Site");
	}

	/**
	 * Determines if a message origin url has a Salesforce domain. Used for filtering non-Salesforce messages.
	 *
	 * @param {string} messageOriginUrl - String containing the origin url. This should end with the domain (strip off the port before passing to this function).
	 * @return {boolean} Did message come from page hosted on Salesforce domain?
	 */
	function isMessageFromSalesforceDomain(messageOriginUrl) {
		var endsWith;
		var messageOrigin = messageOriginUrl.split(":")[1].replace("//", "");

		/**
		 * 1st check - if on Experience Cloud platform, and endpoint is same as hosting site, message origin will be from same domain as document.
		 */
		if(isSiteContext() && messageOrigin === document.domain) {
			return true;
		}

		/**
		 * "Polyfill" for String.prototype.endsWith since IE doesn't support it.
		 *
		 * @param {string} first - Does the first string...
		 * @param {string} second - ...end with the second string?
		 * @return {boolean} Does it?
		 */
		endsWith = function(first, second) {
			return first.indexOf(second, first.length - second.length) !== -1;
		};

		/**
		 * 2nd check - message origin is an actual salesforce domain
		 */
		return SALESFORCE_DOMAINS.some(function(salesforceDomain) {
			return endsWith(messageOrigin, salesforceDomain);
		});
	}

	function FilePreview() {
		// Set the parent domain from URL query parameters
		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams, prop) => searchParams.get(prop),
		});
		parentDomain = params.parent_domain; 

		// Initialize event handlers for the file preview iframe.
		addEventHandlers();
	}

	/**
	 * Gets a DOM reference to the file preview modal (i.e. div element).
	 *
	 * @returns {object}
	 */
	function getFilePreviewModal() {
		if (document && document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CLASS}`)) {
			return document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CLASS}`);
		}
		return undefined;
	}

	/**
	 * Gets a DOM reference to the file preview modal content where actual preview is embedded (i.e. div element).
	 *
	 * @returns {object}
	 */
	function getFilePreviewModalContent() {
		if (document && document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CONTENT_CLASS}`)) {
			return document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CONTENT_CLASS}`);
		}
		return undefined;
	}

	/**
	 * Gets a DOM reference to the file preview close button.
	 *
	 * @returns {object}
	 */
	function getFilePreviewCloseButton() {
		if (document && document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_CLOSE_BUTTON_CLASS}`)) {
			return document.querySelector(`.${EMBEDDED_MESSAGING_FILE_PREVIEW_CLOSE_BUTTON_CLASS}`);
		}
		return undefined;
	}

	/**
	 * Event handlers for managing full size file preview actions.
	 */
	function addEventHandlers() {
		window.addEventListener("message", (event) => {
			if(event && event.data && event.origin) {
				if(event.origin === "null" ||
						(isMessageFromSalesforceDomain(event.origin))) {
					switch(event.data.method) {
						case EMBEDDED_MESSAGING_INITIALIZE_FILE_PREVIEW_FRAME_EVENT:
							embeddedservice_filePreview.filePreviewModal = getFilePreviewModal();
							embeddedservice_filePreview.filePreviewModalContent = getFilePreviewModalContent();
							embeddedservice_filePreview.filePreviewCloseButton = getFilePreviewCloseButton();
							embeddedservice_filePreview.filePreviewCloseButton.title = event.data.data && event.data.data.filePreviewFrameCloseButtonTitle ? event.data.data.filePreviewFrameCloseButtonTitle : "";
							addClickHandlers();
							break;
						case EMBEDDED_MESSAGING_SHOW_FULL_SIZE_FILE_PREVIEW_EVENT:
							embeddedservice_filePreview.filePreviewModal.classList.add(EMBEDDED_MESSAGING_FILE_PREVIEW_SHOW_CLASS);
							embeddedservice_filePreview.filePreviewModalContent.src = event.data.data && event.data.data.attachmentUrl ? event.data.data.attachmentUrl : "";
							embeddedservice_filePreview.filePreviewModalContent.alt = event.data.data && event.data.data.attachmentName ? event.data.data.attachmentName : "";
							embeddedservice_filePreview.filePreviewModalContent.onload = () => {
								window.parent.postMessage({ method: EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT }, parentDomain);
								window.requestAnimationFrame(() => {
									// Put the focus on Close button when the preview is loaded.
									embeddedservice_filePreview.filePreviewCloseButton.focus();
								});
							};
							break;
					}
				} else {
					console.error("Unexpected message origin: " + event.origin);
				}
			}
		});
		// A11Y - keyboard actions.
		if (document) {
			document.addEventListener("keydown", (evt) => {
				if (evt && evt.key === "Escape") {
					// Hide file preview when Escape key is pressed.
					hideFilePreview();
				}
			});
		}
	}

	/**
	 * Click handlers for managing full size file preview actions.
	 */
	function addClickHandlers() {
		if (embeddedservice_filePreview.filePreviewCloseButton) {
			embeddedservice_filePreview.filePreviewCloseButton.onclick = () => {
				// Hide file preview when Close button is clicked.
				hideFilePreview();
			};
		}
		if (embeddedservice_filePreview.filePreviewModal) {
			embeddedservice_filePreview.filePreviewModal.onclick = (evt) => {
				if (evt && evt.target && evt.target.className !== EMBEDDED_MESSAGING_FILE_PREVIEW_MODAL_CONTENT_CLASS) {
					// Hide file preview when the background screen in file preview (other than the image itself) is clicked.
					hideFilePreview();
				}
			};
		}
	}

	/**
	 * Hide File Preview.
	 * 1. Hide the modal rendered to show a file preview.
	 * 2. Send a postMessage to the parent window to hide the file preview iframe.
	 */
	function hideFilePreview() {
		embeddedservice_filePreview.filePreviewModal.classList.remove(EMBEDDED_MESSAGING_FILE_PREVIEW_SHOW_CLASS);
		window.parent.postMessage({ method: EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT }, parentDomain);
	}

	window.embeddedservice_filePreview = new FilePreview();
})();
