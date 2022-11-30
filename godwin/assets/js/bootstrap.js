/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */
/**
 * Where possible, we changed noninclusive terms to align with our company value of Equality. We maintained certain terms to avoid any effect on customer implementations.
 */
(() => {
	/**
	 * Conversation button class constants.
	 */
	const CONVERSATION_BUTTON_CLASS = "embeddedMessagingConversationButton";
	const CONVERSATION_BUTTON_WRAPPER_CLASS = CONVERSATION_BUTTON_CLASS + "Wrapper";
	const CONVERSATION_BUTTON_LOADED_CLASS = CONVERSATION_BUTTON_CLASS + "Loaded";
	const CONVERSATION_BUTTON_LOADING_CLASS = CONVERSATION_BUTTON_CLASS + "Loading";
	const CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS = "embeddedMessagingBottomTabBar";

	/**
	 * Parent page elements class constants.
	 */
	const TOP_CONTAINER_NAME = "embedded-messaging";
	const BACKGROUND_MODAL_ID = "embeddedMessagingModalOverlay";
	const PREVENT_SCROLLING_CLASS = "embeddedMessagingPreventScrolling";
	const IFRAME_NAME = "embeddedMessagingFrame";
	const IFRAME_DEFAULT_TITLE = "Chat with an Agent";
	const IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS = IFRAME_NAME + "MaximizedBottomTabBar";
	const IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS = IFRAME_NAME + "MinimizedBottomTabBar";
	const FILE_PREVIEW_IFRAME_NAME = "embeddedMessagingFilePreviewFrame";
	const FILE_PREVIEW_IFRAME_DEFAULT_TITLE = "Enlarged image preview";

	/**
	 * Icon constants.
	 */
	const DEFAULT_ICONS = {};
	const EMBEDDED_MESSAGING_ICON = "embeddedMessagingIcon";
	const EMBEDDED_MESSAGING_ICON_CHAT = EMBEDDED_MESSAGING_ICON + "Chat";
	const EMBEDDED_MESSAGING_ICON_CONTAINER = EMBEDDED_MESSAGING_ICON + "Container";
	const EMBEDDED_MESSAGING_ICON_LOADING = EMBEDDED_MESSAGING_ICON + "Loading";
	const EMBEDDED_MESSAGING_ICON_MINIMIZE = EMBEDDED_MESSAGING_ICON + "Minimize";

	/**
	 * Loading constants.
	 */
	const EMBEDDED_MESSAGING_LOADING = "embeddedMessagingLoading";
	const EMBEDDED_MESSAGING_LOADING_SPINNER = EMBEDDED_MESSAGING_LOADING + "Spinner";
	const EMBEDDED_MESSAGING_LOADING_CIRCLE = EMBEDDED_MESSAGING_LOADING + "Circle";

	// TODO: confirm these as they will be APIs.
	const APP_LOADED_EVENT_NAME = "ESW_APP_LOADED";
	const APP_MINIMIZE_EVENT_NAME = "ESW_APP_MINIMIZE";
	const APP_MAXIMIZE_EVENT_NAME = "ESW_APP_MAXIMIZE";
	const EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME = "ESW_SET_JWT_EVENT";
	const EMBEDDED_MESSAGING_CLEAN_UP_JWT_EVENT_NAME = "ESW_CLEAN_UP_JWT_EVENT";
	const APP_REQUEST_CONFIG_SERVICE_DATA_EVENT_NAME = "ESW_APP_SEND_CONFIG_SERVICE_DATA";
	const APP_RECEIVE_CONFIG_SERVICE_DATA_EVENT_NAME = "ESW_APP_RECEIVE_CONFIG_SERVICE_DATA";
	const APP_RESET_INITIAL_STATE_EVENT_NAME = "ESW_APP_RESET_INITIAL_STATE";
	const EMBEDDED_MESSAGING_DOWNLOAD_FILE = "ESW_DOWNLOAD_FILE";
	const EMBEDDED_MESSAGING_UPDATE_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME = "ESW_SET_WEBSTORAGE_FAILEDMESSAGES_EVENT";
	const EMBEDDED_MESSAGING_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME = "ESW_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT";
	const EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME = "ESW_APP_MAXIMIZATION_RESIZING_COMPLETED";
	const EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME = "ESW_APP_MINIMIZATION_RESIZING_COMPLETED";
	const EMBEDDED_MESSAGING_UPDATE_TITLE_NOTIFICATION = "ESW_APP_UPDATE_TITLE_NOTIFICATION";
	const EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT_NAME = "ESW_APP_SHOW_FILE_PREVIEW_FRAME";
	const EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT_NAME = "ESW_APP_HIDE_FILE_PREVIEW_FRAME";
	const APP_REQUEST_HIDDEN_PRECHAT_FIELDS_EVENT_NAME = "ESW_APP_SEND_HIDDEN_PRECHAT_FIELDS";
	const APP_RECEIVE_HIDDEN_PRECHAT_FIELDS_EVENT_NAME = "ESW_APP_RECEIVE_HIDDEN_PRECHAT_FIELDS";
	const APP_REQUEST_POSTCHAT_PARAMETERS_EVENT_NAME = "ESW_APP_SEND_POSTCHAT_PARAMETERS";
	const APP_RECEIVE_POSTCHAT_PARAMETER_EVENT_NAME = "ESW_APP_RECEIVE_POSTCHAT_PARAMETERS";
	const EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE = "EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE";
	const EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME = "EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT";
	const EMBEDDED_MESSAGING_FOCUS_ON_LAST_FOCUSABLE_ELEMENT_EVENT_NAME = "trapfocustolast";
	const EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT_NAME = "EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT";
	const EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME = "EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT";

	/*********************************************************
	 *		Embedded Messaging Public Events		*
	 **********************************************************/
	/**
	 * Event dispatched after the client successfully completes bootstrap.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_READY_EVENT_NAME = "onEmbeddedMessagingReady";

	/**
	 * Event dispatched to notify the customer that the user identity token has expired.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_ID_TOKEN_EXPIRED_EVENT_NAME = "onEmbeddedMessagingIdentityTokenExpired";

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
	 * Identity token types supported by our application.
	 */
	const ID_TOKEN_TYPE = {
		JWT: "JWT"
	};

	/**
	 * Attributes required to construct SCRT 2.0 Config Service URL.
	 */
	const IN_APP_CONFIG_API_PREFIX = "embeddedservice";
	const IN_APP_CONFIG_API_VERSION = "v1";

	/**
	 * Default document title of the page.
	 * @type {string}
	 */
	const DEFAULT_DOCUMENT_TITLE = document.title;

	/**
	 * Interval of title notification blinking.
	 * @type {number}
	 */
	const DOCUMENT_TITLE_BLINK_FREQUENCY_MS = 1000;

	/**
	 * Store the interval for the notification blinking.
	 * @type {number}
	 */
	let documentTitleBlinkIntervalID;

	/**
	 * Internal property to track whether the embedded messaging ready event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingReadyEventFired = false;

	/**
	 * Internal property to track Hidden Prechat fields from configuration response as well as the fields set by a customer.
	 * @type {object}
	 */
	let hiddenPrechatFields = {};

	/**
	 * Internal property to track page-specific parameters set by a customer for appending query strings of the Post-Chat URL.
	 * @type {Object} - f.e. { parameterName1: parameterValue2, parameterName2: parameterValue2 }
	 */
	let postchatParameters = {};

	/**
	 * The identity token set by the customer for authenticating the current end user.
	 * The token is set via the `embeddedservice_bootstrap.userVerificationAPI.setIdentityToken` method.
	 */
	let identityToken;

	/**
	 * This variable holds the top level storage key
	 */
	let storageKey;

	/**
	 * Internal property to track the current conversation id, which to be used in web storage
	 * @type {string}
	 */
	let conversationId;

	/**
	 * Web storage keys
	 * @type {object}
	 */
	const STORAGE_KEYS = {
		JWT: "JWT",
		FAILED_OUTBOUND_MESSAGE_ENTRIES: "FAILED_MESSAGES",
		HIDDEN_PRECHAT_FIELDS: "HIDDEN_PRECHAT_FIELDS",
		POSTCHAT_PARAMETERS: "POSTCHAT_PARAMETERS"
	};

	/**
	 * Dictionary of keyboard code mappings for identifying keydown events.
	 */
	const KEY_CODES = {
		"ENTER": "Enter",
		"TAB": "Tab",
		"SPACE": " "
	};

	/******************************************************
						Web storage functions
		This is copied from embeddedService:webStorageUtils.js.
		If you change this method, please update the corresponding method in webStorageUtils.js
	******************************************************/
	/**
	 * Determine the type of web storage (local vs. session) to be used
	 * It will prioritize localStorage if specify, otherwise sessionStorage
	 */
	function determineStorageType(inLocalStorage = false) {
		return embeddedservice_bootstrap.isLocalStorageAvailable && inLocalStorage ? localStorage : embeddedservice_bootstrap.isSessionStorageAvailable ? sessionStorage : undefined;
	}

	/**
	 * Get conversationId from payload from web storage
	 */
	function getConversationIdFromPayload(payload) {
		if (payload) {
			for (const key of Object.keys(JSON.parse(payload))) {
				if (!Object.hasOwn(STORAGE_KEYS, key)) {
					return key;
				}
			}
		}
		return undefined;
	}

	/**
	 * Get the existing conversationId from web storage or from provided payload
	 * We currently only support 1 active conversation per org
	 * With this assumption valid, anything aside from storage keys will be the conversationId
	 */
	function getConversationIdFromWebStorage() {
		// Prioritize localStorage if available, use sessionStorage as a backup.
		if (embeddedservice_bootstrap.isLocalStorageAvailable) {
			return getConversationIdFromPayload(localStorage.getItem(storageKey) || '{}');
		} else if (embeddedservice_bootstrap.isSessionStorageAvailable) {
			return getConversationIdFromPayload(sessionStorage.getItem(storageKey) || '{}');
		}
		return undefined;
	}

	/**
	 * Initialize the web storage object for both localStorage & sessionStorage if it doesn't already exist.
	 */
	function initializeWebStorage() {
		storageKey = `${embeddedservice_bootstrap.settings.orgId}_WEB_STORAGE`;
		conversationId = getConversationIdFromWebStorage() || generateUUID();

		// Only create the structure if this is a new chat session
		const storageObj = JSON.stringify({
			[conversationId]: {}
		});

		// Initialize the web storage object
		if (embeddedservice_bootstrap.isLocalStorageAvailable && !localStorage.getItem(storageKey)) {
			localStorage.setItem(storageKey, storageObj);
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && !sessionStorage.getItem(storageKey)) {
			sessionStorage.setItem(storageKey, storageObj);
		}

		log("web storage initialized");
	}

	/**
	 * Returns the item in web storage by the key in this current conversation.
	 * It prioritizes getting the object in localStorage if exists in both
	 * Returns undefined if not found
	 */
	function getItemInWebStorageByKey(key, inLocalStorage = true) {
		let item;
		const storage = determineStorageType(inLocalStorage);

		if (storage) {
			const storageObj = (storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey))) || {};
			if (key === STORAGE_KEYS.JWT) {
				item = storageObj[key];
			} else {
				item = storageObj[conversationId] && storageObj[conversationId][key];
			}
		}
		return item;
	}

	/**
	 * Set the item in web storage by the key in this current conversation.
	 * If inLocalStorage is true, then first try to store in localStorage, otherwise sessionStorage
	 */
	function setItemInWebStorage(key, value, inLocalStorage = true) {
		const storage = determineStorageType(inLocalStorage);

		if (storage) {
			const storageObj = (storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey))) || {};

			// Setting JWT at top level so other conversations from same org can access the JWT
			if (key === STORAGE_KEYS.JWT) {
				storageObj[key] = value;
			} else {
				// Storage for this conversations does not exist yet,
				// create a new one without overwriting storage for other conversations
				if (!storageObj[conversationId]) {
					storageObj[conversationId] = {};
				}

				storageObj[conversationId][key] = value;
			}
			storage.setItem(storageKey, JSON.stringify(storageObj));
			log(`${key} set in ${inLocalStorage ? "localStorage" : "sessionStorage"}`);
		}
	}

	/**
	 * Remove item from both localStorage and sessionStorage that match that given key
	 * As well as item that was originally stored in fallback location
	 */
	function removeItemInWebStorage(key) {
		if (embeddedservice_bootstrap.isLocalStorageAvailable && localStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(localStorage.getItem(storageKey)) || {};
			// Remove top level stored item (e.g. JWT, conversationId)
			delete storageObj[key];
			if (storageObj[conversationId]) {
				delete storageObj[conversationId][key];
			}
			localStorage.setItem(storageKey, JSON.stringify(storageObj));
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && sessionStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(sessionStorage.getItem(storageKey)) || {};
			// Remove top level stored item (e.g. JWT, conversationId)
			delete storageObj[key];
			if (storageObj[conversationId]) {
				delete storageObj[conversationId][key];
			}
			sessionStorage.setItem(storageKey, JSON.stringify(storageObj));
		}

		log(`${key} removed from web storage`);
	}

	/**
	 * Clear all client side stored item in both localStorage & sessionStorage as well as at the fallback location
	 */
	function clearWebStorage() {
		// Checking if current in-memory conversationId exists before deleting to ensure we don't wipe data from another conversation
		if (embeddedservice_bootstrap.isLocalStorageAvailable && conversationId === getConversationIdFromPayload(localStorage.getItem(storageKey))) {
			localStorage.removeItem(storageKey);
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && conversationId === getConversationIdFromPayload(sessionStorage.getItem(storageKey))) {
			sessionStorage.removeItem(storageKey);
		}

		log(`web storage cleared`);
	}

	/**
	 * Clear all in-memory data tracked on the client side, for the current conversation.
	 */
	function clearInMemoryData() {
		// Reset in-memory hidden prechat fields.
		hiddenPrechatFields = {};

		// Reset identityToken
		identityToken = undefined;

		log(`Cleared in-memory data.`);
	}

	/**
	 * Update the conversation id in web storage and in-memory
	 * @param {string} updatedConversationId
	 */
	function updateConversationIdInWebStorage(updatedConversationId) {
		if (conversationId !== updatedConversationId) {
			if (embeddedservice_bootstrap.isSessionStorageAvailable) {
				const storageObj = sessionStorage.getItem(storageKey) ? JSON.parse(sessionStorage.getItem(storageKey)) : {};
				if (storageObj[conversationId]) {
					storageObj[updatedConversationId] = storageObj[conversationId];
					delete storageObj[conversationId];
				} else {
					storageObj[updatedConversationId] = {};
				}
				sessionStorage.setItem(storageKey, JSON.stringify(storageObj));
				log(`conversationId updated in sessionStorage`);
			}

			if (embeddedservice_bootstrap.isLocalStorageAvailable) {
				const storageObj = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : {};
				if (storageObj[conversationId]) {
					storageObj[updatedConversationId] = storageObj[conversationId];
					delete storageObj[conversationId];
				} else {
					storageObj[updatedConversationId] = {};
				}
				localStorage.setItem(storageKey, JSON.stringify(storageObj));
				log(`conversationId updated in localStorage`);
			}

			conversationId = updatedConversationId;
		}
	}

  	/**
	 * Resolve function for the promise returned by the embeddedservice_bootstrap.userVerificationAPI.clearSession() API.
	 * Tracking the function as an internal property allows us to resolve the promise outside clearSession().
	 * @type {function}
	 */
	let clearUserSessionPromiseResolve;

	/**
	 * Merge a key-value mapping into the setting object, such that the provided
	 * values take priority. This allows the settings in the snippet to override
	 * what we get from SCRT
	 *
	 * @param {object} additionalSettings - A key-value mapping.
	 */
	function mergeSettings(additionalSettings) {

		//deep-copy values from object2 to object1
		const mergeObjects = (obj1, obj2) => {
			Object.keys(obj2).forEach((key) => {
				if(typeof(obj1[key]) === "object" && typeof(obj2[key] === "object")) {
					mergeObjects(obj1[key], obj2[key]);
				} else if (obj1[key] === undefined) {
					obj1[key] = obj2[key];
				}
			});
		};

		if(additionalSettings && typeof additionalSettings === "object") {
			mergeObjects(embeddedservice_bootstrap.settings, additionalSettings);
		}
	}

	/**
	 * Checks if the baseObject's functionName method is still native code or if it has been modified.
	 *
	 * @param {Object} baseObject - Base object to check for modification of native code.
	 * @param {string} functionName - Function name to check.
	 * @return {boolean} Is the baseObject's functionName method still native code?
	 */
	function isNativeFunction(baseObject, functionName) {
		return Function.prototype.toString.call(baseObject[functionName]).match(/\[native code\]/);
	}

	/**
	 * Output to the console using a specified method.
	 *
	 * @param {string} method - The console method to use.
	 * @param {Array.<*>} args - Objects to be displayed comma-delimited.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function outputToConsole(method, args, alwaysOutput) {
		if((alwaysOutput || Boolean(embeddedservice_bootstrap.settings.devMode)) && console && console[method]) { // eslint-disable-line no-console
			console[method]("[EmbeddedServiceBootstrap] " + (Array.isArray(args) ? args.join(", ") : args)); // eslint-disable-line no-console
		}
	}

	/**
	 * Log a message to the console.
	 *
	 * @param {...object} messages - Objects to be displayed comma-delimited.
	 */
	function log() {
		outputToConsole("log", [].slice.apply(arguments));
	}

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The warning message to print.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function warning(message, alwaysOutput) {
		if(message) {
			outputToConsole("warn", "Warning: " + message, alwaysOutput);
		} else {
			outputToConsole("warn", "EmbeddedServiceBootstrap sent an anonymous warning.", alwaysOutput);
		}
	}

	/**
	 * Log an error.
	 *
	 * @param {string} message - The error message to print.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function error(message, alwaysOutput) {
		if(message) {
			outputToConsole("error", message, alwaysOutput);
		} else {
			outputToConsole("error", "EmbeddedServiceBootstrap responded with an unspecified error.", alwaysOutput);
		}
	}

	/**
	 * Check if this file was loaded into a Salesforce Site.
	 *
	 * @return {boolean} True if this page is a Salesforce Site.
	 */
	function isSiteContext() {
		return window.$A && typeof window.$A.get === "function" && window.$A.get("$Site");
	}

	/**
	 * Some users may have stricter browser security settings.
	 * Determine what web storage APIs are available. Do nothing on error.
	 */
	function detectWebStorageAvailability() {
		try {
			window.localStorage;
		} catch(e) {
			warning("localStorage is not available. User chat sessions continue only in a single-page view and not across multiple pages.");
			embeddedservice_bootstrap.isLocalStorageAvailable = false;
		}
		try {
			window.sessionStorage;
		} catch(e) {
			warning("sessionStorage is not available. User chat sessions end after a web page refresh or across browser tabs and windows.");
			embeddedservice_bootstrap.isSessionStorageAvailable = false;
		}

		// [W-10897270] Limit session continuity in Firefox to a single tab by storing jwt in Session Storage.
		if(isUserFirefox()) {
			embeddedservice_bootstrap.isLocalStorageAvailable = false;
		}
	}

	/**
	 * Generate a UUID.
	 * Taken from CSI team:
	 * https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/ui-conversation-agent-components/modules/scrt/utils/utils.js#60
	 */
	function generateUUID() {
		const hexDigits = "0123456789abcdef";
		const valueArray = new Uint32Array(32);
		crypto.getRandomValues(valueArray);

		let res = '';
		for (let i = 0; i < 32; i++) {
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				res += '-';
			}
			if (i === 12) {
				res += '4'; // UUID version
			} else if (i === 16) {
				res += hexDigits.charAt((valueArray[i] & 0x3) | 0x8); // Bits need to start with 10
			} else {
				res += hexDigits.charAt(valueArray[i] & 0xf);
			}
		}

		return res;
	}

	/******************************************************
						Icon rendering
		This is copied from embeddedService:iconHelper.js.
	******************************************************/
	/**
	 * You can add icons by defining either their SVG path or an array of objects representing the SVG structure.
	 *
	 * Your icon should have a `viewBox` of `0 0 100 100`. If it doesn't, you can scale it using this tool:
	 * [https://jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/).
	 * See [https://salesforce.quip.com/1refAeGnpAeW](https://salesforce.quip.com/1refAeGnpAeW) for instructions.
	 *
	 * If you add an icon, make sure you update the icon repository so that we can make sure we don't lose any:
	 * [https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/InAppMessaging](https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/InAppMessaging)
	 *
	 * The parent repository has a `scale.svg` file which you can put your path into and upload to the scaling tool. Make sure you change
	 * the `transform: scale` amount to be the value of `startWidth/endWidth`.
	 */
	/**
	 * Create an SVG element of a given type, using attributes provided in a map.
	 * If an attribute "children" is provided, createSVGElement will be run using the objects in that array.
	 *
	 * @param {SVGElement} parent - The parent element for this SVG element.
	 * @param {String} elementType - The type of element to create.
	 * @param {Object} elementDefinition - Attributes to attach to the element.
	 */
	function createSVGElement(parent, elementType, elementDefinition) {
		const element = document.createElementNS("http://www.w3.org/2000/svg", elementType);

		Object.getOwnPropertyNames(elementDefinition).forEach((attribute) => {
			if(attribute === "children") {
				elementDefinition.children.forEach((childElementDefinition) => {
					createSVGElement(element, childElementDefinition.type, childElementDefinition);
				});
			} else {
				element.setAttribute(attribute, elementDefinition[attribute]);
			}
		});

		// TextNodes added to address accessibility bug in Safari 10.x (https://bugs.webkit.org/show_bug.cgi?id=162866)
		parent.appendChild(document.createTextNode("\n"));
		parent.appendChild(element);
		parent.appendChild(document.createTextNode("\n"));
	}

	/**
	 * Renders the SVG element using the icon data (i.e. path definition).
	 *
	 * @param {String} iconData - Reference to the icon data.
	 * @return {SVGElement} - The reference for this SVG element.
	 */
	function renderSVG(iconData) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		if(iconData) {
			svg.setAttribute("focusable", "false");
			svg.setAttribute("aria-hidden", "true");
			svg.setAttribute("viewBox", "0 0 100 100");

			if(Array.isArray(iconData)) {
				iconData.forEach((pathDefinition) => {
					createSVGElement(svg, pathDefinition.type, pathDefinition);
				});
			} else {
				createSVGElement(svg, "path", { d: iconData });
			}

			return svg;
		} else {
			error("Invalid icon data.");
		}

		return undefined;
	}

	/**
	 * Check for modified document/window native JS methods and output a warning for each overriden method.
	 * These methods are used in EmbeddedServiceBootstrap and also in Aura.
	 */
	function checkForNativeFunctionOverrides() {
		let documentFunctionsToCheck = [
			"addEventListener",
			"createAttribute",
			"createComment",
			"createDocumentFragment",
			// SFDC overrides createElement so we'll skip this one.
			// "createElement",
			"createElementNS",
			"createTextNode",
			"createRange",
			"getElementById",
			"getElementsByTagName",
			"getElementsByClassName",
			"querySelector",
			"querySelectorAll",
			"removeEventListener"
		];
		let windowFunctionsToCheck = [
			"addEventListener",
			"clearTimeout",
			"dispatchEvent",
			"open",
			"removeEventListener",
			"requestAnimationFrame",
			"setInterval",
			"setTimeout"
		];
		let objectsToCheck = [{
			name: "document",
			object: document,
			functions: documentFunctionsToCheck
		}, {
			name: "window",
			object: window,
			functions: windowFunctionsToCheck
		}];

		// For each object type (doc/win), we want to check their expected native functions.
		objectsToCheck.forEach((objectToCheck) => {
			objectToCheck.functions.forEach((nativeFunction) => {
				if(nativeFunction in objectToCheck.object && !isNativeFunction(objectToCheck.object, nativeFunction)) {
					warning(
						"EmbeddedService Messaging Bootstrap may not function correctly with this native JS function modified: " + objectToCheck.name + "." + nativeFunction,
						true
					);
				}
			});
		});
	}

	/**
	 * If the iframe is responsible for getting a new JWT, it will send a post message here to notify the parent of the new JWT. Store this new JWT in web storage for session continuity.
	 * @param {String} jwt - JWT to store in web storage.
	 */
	function storeJWTInWebStorage(jwt) {
		if(typeof jwt !== "string") {
			error(`Expected to receive string, instead received: ${jwt}.`);
		}

		setItemInWebStorage(STORAGE_KEYS.JWT, jwt);
	}

	/**
	 * When the iframe updates its web storage for Failed Conversation Messages, it will send a post message here with Failed Conversation Messages object
	 * to notify the parent to store the same in web storage for session continuity.
	 * @param {Object} failedMessages - Failed end-user conversation messages.
	 */
	function storeFailedMessagesInWebStorage(failedMessages) {
		if (typeof failedMessages !== "object") {
			error(`Expected to receive object, instead received: ${failedMessages}.`);
			return;
		}

		setItemInWebStorage(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES, failedMessages, false);
	}

	/**
	 * Prepares a final version of configuration response object to be sent to the iframe window.
	 * Note: IA-Message Jwt, Failed Conversation Messages, Hidden Prechat values and Labels are not stored on the original Configuration Settings object.
	 *
	 * @return {object}
	 */
	function prepareConfigurationDataForIframeWindow() {
		const iaMessageJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
		const failedConversationMessages = getItemInWebStorageByKey(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES, false);
		const conversationRoutingAttributes = hiddenPrechatFields;
		const standardLabelsFromConfiguration = embeddedservice_bootstrap.settings.standardLabels;
		const customLabelsFromConfiguration = embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels;

		const finalConfigurationData = Object.assign({}, embeddedservice_bootstrap.settings.embeddedServiceConfig, {
			jwt: iaMessageJwt,
			identityToken: identityToken,
			failedMessages: failedConversationMessages,
			routingAttributes: conversationRoutingAttributes,
			conversationId,
			...(standardLabelsFromConfiguration && {standardLabels: standardLabelsFromConfiguration}),
			...(customLabelsFromConfiguration && {customLabels: customLabelsFromConfiguration})
		});

		return finalConfigurationData || {};
	}

	/**
	 * Adds Message and Storage event listeners on host window.
	 * Message event handlers are used to communicate between the iframe and the host window.
	 * Storage event handlers are used to sync local storage changes across tabs/windows on the same domain.
	 */
	function addEventHandlers() {
		addMessageEventHandlers();
		if (embeddedservice_bootstrap.isLocalStorageAvailable) {
			addStorageEventHandlers();
		}
	}

	/**
	 *  Adds Message event listeners on host window. Message event handlers are used to communicate between the iframe and the host window.
	 */
	function addMessageEventHandlers() {
		window.addEventListener("message", (e) => {
			if(e && e.data && e.origin) {
				if(embeddedservice_bootstrap.filePreviewFrame.contentWindow === e.source) {
					// Handle events from File Preview Iframe window.
					switch(e.data.method) {
						case EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT_NAME:
							setFilePreviewFrameVisibility(true);
							break;
						case EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT_NAME:
							setFilePreviewFrameVisibility(false);
							break;
						default:
							warning("Unrecognized event name: " + e.data.method);
							break;
					}
				} else if(e.origin === "null" ||
					(getSiteURL().indexOf(e.origin) === 0
						&& embeddedservice_bootstrap.isMessageFromSalesforceDomain(e.origin)
						&& getEmbeddedMessagingFrame().contentWindow === e.source)) {
					let frame = getEmbeddedMessagingFrame();

					switch(e.data.method) {
						case APP_REQUEST_CONFIG_SERVICE_DATA_EVENT_NAME:
							/**
							 * Send Configuration Settings to the container (iframe window).
							 */
							sendPostMessageToIframeWindow(APP_RECEIVE_CONFIG_SERVICE_DATA_EVENT_NAME, prepareConfigurationDataForIframeWindow());
							break;
						case APP_LOADED_EVENT_NAME:
							// TODO W-10165756 - Remove handling for the event when we no longer support the aura app.
							if(embeddedservice_bootstrap.settings.isAuraSite) {
								handleAfterAppLoad();
							}
							break;
						case APP_MINIMIZE_EVENT_NAME:
							embeddedservice_bootstrap.minimizeIframe(frame, e.data.data);
							break;
						case APP_MAXIMIZE_EVENT_NAME:
							embeddedservice_bootstrap.maximizeIframe(frame);
							break;
						case APP_RESET_INITIAL_STATE_EVENT_NAME:
							handleResetClientToInitialState();
							break;
						case EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME:
							storeJWTInWebStorage(e.data.data);
							break;
						case EMBEDDED_MESSAGING_CLEAN_UP_JWT_EVENT_NAME:
							clearWebStorage();
							break;
						case EMBEDDED_MESSAGING_DOWNLOAD_FILE:
							downloadFile(e.data.data);
							break;
						case EMBEDDED_MESSAGING_UPDATE_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME:
							storeFailedMessagesInWebStorage(e.data.data);
							break;
						case EMBEDDED_MESSAGING_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME:
							removeItemInWebStorage(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES);
							break;
						case EMBEDDED_MESSAGING_UPDATE_TITLE_NOTIFICATION:
							updateTitleNotification(e.data.data);
							break;
						case APP_REQUEST_HIDDEN_PRECHAT_FIELDS_EVENT_NAME:
							/**
							 * Send Hidden Prechat fields to the container when they are requested, to ensure most recent values are received in the container
							 * at the time of submitting Prechat form (if enabled).
							 * This event is exchanged only when Prechat is enabled in the setup.
							 */
							sendPostMessageToIframeWindow(APP_RECEIVE_HIDDEN_PRECHAT_FIELDS_EVENT_NAME, hiddenPrechatFields);
							break;
						case APP_REQUEST_POSTCHAT_PARAMETERS_EVENT_NAME:
							sendPostMessageToIframeWindow(APP_RECEIVE_POSTCHAT_PARAMETER_EVENT_NAME, postchatParameters);
							break;
						case EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE:
							updateConversationIdInWebStorage(e.data.data);
							break;
						case EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT_NAME:
							handleIdentityTokenExpiry();
							break;
						default:
							warning("Unrecognized event name: " + e.data.method);
							break;
					}
				} else {
					error("Unexpected message origin: " + e.origin);
				}
			}
		});
	}

	/**
	 * Adds Storage event listeners on host window.
	 * Storage event handlers are used to sync local storage changes across tabs/windows on the same domain.
	 * Storage event handlers are not executed on the same tab/window that is making the changes.
	 */
	function addStorageEventHandlers() {
		window.addEventListener("storage", (e) => {
			// Compare e.key with our storage key
			if (e && e.key && e.key === storageKey) {
				// Handle clear web storage event
				if (e.newValue === null) {
					// If we're in Auth mode, clear user session for current tab/window.
					if (getAuthMode() === AUTH_MODE.AUTH) {
						handleClearUserSession(false);
					}
				} else {
					// Handle conversationId change, if new value is non-null and different than old value
					const oldConversationId = getConversationIdFromPayload(e.oldValue);
					const newConversationId = getConversationIdFromPayload(e.newValue);

					// Updating only when both old & new id is non-null
					// So that it doesn't overwrite data on other tabs after reset
					if (oldConversationId && newConversationId && oldConversationId !== newConversationId) {
						log("ConversationId change detected in web storage");
						updateConversationIdInWebStorage(newConversationId);
					}
				}
			}
		});
	}

	/**
	 * Fires an event 'onEmbeddedMessagingReady' to the host (i.e. customer) window to indicate the host that bootstrap initialization is complete.
	 */
	 EmbeddedServiceBootstrap.prototype.emitEmbeddedMessagingReadyEvent = function emitEmbeddedMessagingReadyEvent() {
		hasEmbeddedMessagingReadyEventFired = true;
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_READY_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingReadyEventFired = false;
			error(`Something went wrong in firing onEmbeddedMessagingReady event ${err}.`);
		}
	}

	/**
	 * Dispatches a custom event with the given name to the host window. Throws an error if something goes wrong while
	 * dispatching the event.
	 * @param eventName - Name of event to dispatch.
	 */
	function dispatchEventToHost(eventName) {
		if (!eventName) {
			throw new Error(`Expected an eventName parameter with a string value. Instead received ${eventName}.`);
		}
		try {
			window.dispatchEvent(new CustomEvent(eventName));
		} catch(err) {
			throw new Error("Something went wrong while dispatching the event " + eventName + ":" + err);
		}
	}

	/**
	 * Updates the title notification on new messages received when page is backgrounded
	 * - If data is defined, then set interval to blink between 2 notifications
	 * - Otherwise, clear the interval and reset to default page title
	 */
	function updateTitleNotification(data) {
		if (data) {
			const messages = JSON.parse(data);

			const firstNotification = messages[0];
			const secondNotification = DEFAULT_DOCUMENT_TITLE;

			// Clear previous interval, if exists
			if (documentTitleBlinkIntervalID) {
				window.clearInterval(documentTitleBlinkIntervalID);
			}

			documentTitleBlinkIntervalID = window.setInterval(() => {
				if (document.title === firstNotification) {
					document.title = secondNotification;
				} else {
					document.title = firstNotification;
				}
			}, DOCUMENT_TITLE_BLINK_FREQUENCY_MS);
		} else {
			window.clearInterval(documentTitleBlinkIntervalID);
			documentTitleBlinkIntervalID = undefined;
			document.title = DEFAULT_DOCUMENT_TITLE;
		}
	}

	/**
	 * Returns a DOM reference to the embedded messaging iframe.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingFrame() {
		return document.getElementById(IFRAME_NAME);
	}

	/**
	 * Returns a DOM reference to the embedded messaging conversation button.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingConversationButton() {
		return document.getElementById(CONVERSATION_BUTTON_CLASS);
	}

	/**
	 * Set file preview iframe visibility (i.e. show/hide) based on the param value.
	 *
	 * @param {boolean} showFilePreviewFrame
	 */
	function setFilePreviewFrameVisibility(showFilePreviewFrame) {
		const embeddedMessagingFrame = getEmbeddedMessagingFrame();

		if(embeddedservice_bootstrap.filePreviewFrame && embeddedMessagingFrame) {
			if(Boolean(showFilePreviewFrame)) {
				embeddedservice_bootstrap.filePreviewFrame.classList.add("show");
				embeddedservice_bootstrap.filePreviewFrame.contentWindow.focus();
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "false");
				embeddedMessagingFrame.tabIndex = "-1";
				embeddedMessagingFrame.setAttribute("aria-hidden", "true");
			} else {
				embeddedservice_bootstrap.filePreviewFrame.classList.remove("show");
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "true");
				embeddedMessagingFrame.tabIndex = "0";
				embeddedMessagingFrame.setAttribute("aria-hidden", "false");
			}
		}
	}

	/**
	 * Downloads a file to the local file system, from the URL in event data.
	 * Temporarily creates and attaches an iframe to the parent page's DOM to achieve this. Removes the temporary iframe from the DOM as cleanup, post download.
	 */
	function downloadFile(downloadData) {
		let fileDownloadIframe;

		fileDownloadIframe = document.createElement("iframe");
		fileDownloadIframe.style.display = "none";
		fileDownloadIframe.src = downloadData.attachmentDownloadURL || "";

		// Add iframe to the DOM.
		document.body.appendChild(fileDownloadIframe);
		// Open the file in a new tab if the app requires it to.
		if(downloadData.shouldOpenFileInNewTab) {
			window.open(fileDownloadIframe.src, '_blank', 'noreferrer noopener');
		}
		/**
		 * Add a small delay before executing Javascript execution queue, to avoid page navigation interruption.
		 * https://kb.webtrends.com/articles/Information/NS-BINDING-ABORTED-status-message-in-http-debugger/?l=en_US&fs=RelatedArticle
		 */
		setTimeout(() => {
			// Cleanup - remove iframe from the DOM.
			document.body.removeChild(fileDownloadIframe);
		}, 1000);
	}

	/**
	 * Validate all the attributes on the settings object required for bootstrap initialization and for making a request to InApp Config Service.
	 */
	function validateInitParams() {
		if(typeof embeddedservice_bootstrap.settings.siteURL !== "string" || !embeddedservice_bootstrap.settings.siteURL.length) throw new Error(`Expected a valid Site URL value to be a string but received: ${embeddedservice_bootstrap.settings.siteURL}.`);
		if(typeof embeddedservice_bootstrap.settings.scrt2URL !== "string" || !embeddedservice_bootstrap.settings.scrt2URL.length) throw new Error(`Expected a valid SCRT 2.0 URL value to be a string but received: ${embeddedservice_bootstrap.settings.scrt2URL}.`);
		if(!embeddedservice_bootstrap.settings.orgId || !embeddedservice_bootstrap.isOrganizationId(embeddedservice_bootstrap.settings.orgId)) throw new Error("Invalid OrganizationId Parameter Value: " + embeddedservice_bootstrap.settings.orgId);
		if(typeof embeddedservice_bootstrap.settings.eswConfigDevName !== "string" || !embeddedservice_bootstrap.settings.eswConfigDevName.length) throw new Error(`Expected a valid ESW Config Dev Name value to be a string but received: ${embeddedservice_bootstrap.settings.eswConfigDevName}.`);
	}

	/**
	 * Validate all the necessary attributes on the settings object after making a request to InApp Config Service.
	 */
	function validateSettings() {
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig) throw new Error("Embedded Service Config settings not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.name) throw new Error("Embedded Service Config developer name not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel) throw new Error("Embedded Service Messaging Channel settings not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode) throw new Error("Auth mode setting not present in configuration response.");
		if(!Object.values(AUTH_MODE).includes(embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode)) throw new Error("Auth mode in configuration response is invalid.");
	}

	/**
	 * Load the bootstrap.css file for this static file.
	 */
	function loadCSS(url) {

		return new Promise((resolve, reject) => {
			let baseURL = getSiteURL();
			let link = document.createElement("link");

			link.href = baseURL + "/assets/styles/bootstrap" + (embeddedservice_bootstrap.settings.devMode ? "" : ".min") + ".css";
			link.type = "text/css";
			link.rel = "stylesheet";

			link.onerror = reject;
			link.onload = resolve;

			document.getElementsByTagName("head")[0].appendChild(link);
		});
	}

	/**
	 * Load the config settings from SCRT 2.0 stack.
	 */
	function getConfigurationData() {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const configURL = embeddedservice_bootstrap.settings.scrt2URL + "/" + IN_APP_CONFIG_API_PREFIX + "/" + IN_APP_CONFIG_API_VERSION +
				"/embedded-service-config?orgId=" + embeddedservice_bootstrap.settings.orgId + "&esConfigName=" +
				embeddedservice_bootstrap.settings.eswConfigDevName + "&language=" + embeddedservice_bootstrap.settings.language;

			xhr.open("GET", configURL, true);

			xhr.onreadystatechange = (response) => {
				const state = response.target;

				// DONE === The operation is complete, per https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState.
				if(state && state.readyState === state.DONE) {
					if(state.status === 200) {
						const configSettings = JSON.parse(state.responseText);

						resolve(configSettings);
					} else {
						reject(state.status);
					}
				}
			};
			xhr.send();
		});
	}

	/**
	 * Gets the Site URL from In-App Config Service Response.
	 */
	function getSiteURL() {
		try {
			return embeddedservice_bootstrap.settings.siteURL;
		} catch(err) {
			error("Error getting Site URL: " + err);
		}
	}

	/**
	 * Parse the Config Service response to get labels data.
	 * @param {string} sectionName - section name of the label.
	 * @param {string} labelName - name of the label.
	 */
	function getLabel(sectionName, labelName) {
		for(const label of embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels) {
			if(label.hasOwnProperty(sectionName)) {
				if(label.hasOwnProperty(labelName) && label["labelName"] === labelName) {
					return label["labelValue"] || "";
				}
			}
		}
		for(const label of embeddedservice_bootstrap.settings.standardLabels) {
			if(label.hasOwnProperty(sectionName)) {
				if(label.hasOwnProperty(labelName) && label["labelName"] === labelName) {
					return label["labelValue"] || "";
				}
			}
		}
		return "";
	}

	/**
	 * Parse the Config Service response to get branding data.
	 * @param {Object} configServiceResponse - JSON object as a response from In-App Config Service.
	 */
	function handleBrandingData(configServiceResponse) {
		if (configServiceResponse && configServiceResponse.branding) {
			embeddedservice_bootstrap.brandingData = configServiceResponse.branding;
		} else {
			embeddedservice_bootstrap.brandingData = [];
		}
	}

	/**
	 * Returns a branding token value given a specified token name.
	 * @param tokenName
	 * @return {String}
	 */
	function getTokenValueFromBrandingConfig(tokenName) {
		for (const brandingToken of embeddedservice_bootstrap.brandingData) {
			if (brandingToken.n && brandingToken.n === tokenName) {
				return brandingToken.v;
			}
		}
	}

	/**
	 * Returns the custom header color branding token value for button background color.
	 * @return {String}
	 */
	function getButtonColorFromBrandingConfig() {
		return getTokenValueFromBrandingConfig("headerColor");
	}

	/**
	 * Returns the custom secondary color branding token value for focus borders.
	 * @return {String}
	 */
	function getButtonFocusBorderColorFromBrandingConfig() {
		return getTokenValueFromBrandingConfig("secondaryColor");
	}

	/**
	 * Set loading status for the button after clicking on it. This is to show the loading status of creating an iframe which would load an aura application.
	 */
	function setLoadingStatusForButton() {
		let button = getEmbeddedMessagingConversationButton();
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.createElement("div");
		let circle;
		let i = 1;

		if(button) {
			// Hide the default chat icon on the button.
			chatIcon.style.display = "none";

			// [Animations] Build loading spinner.
			loadingSpinner.setAttribute("class", EMBEDDED_MESSAGING_LOADING_SPINNER);
			loadingSpinner.setAttribute("id", EMBEDDED_MESSAGING_LOADING_SPINNER);
			for(; i < 13; i++) {
				circle = document.createElement("div");
				circle.setAttribute("class", EMBEDDED_MESSAGING_LOADING_CIRCLE + i + " " + EMBEDDED_MESSAGING_LOADING_CIRCLE);
				loadingSpinner.appendChild(circle);
			}

			loadingSpinner.classList.add(EMBEDDED_MESSAGING_ICON_LOADING);

			// Set loading state for the button.
			button.classList.add(CONVERSATION_BUTTON_LOADING_CLASS);
			// Load the animations for button.
			iconContainer.insertBefore(loadingSpinner, chatIcon);
			button.disabled = true;
		}
	}

	/**
	 * Check if we are on a Desktop (non mobile) based on information in the user agent.
	 * Browsers on tablets behave the same as mobile devices.
	 * @returns {boolean} - True if Desktop, false if Mobile client.
	 */
	function isDesktop() {
		return navigator.userAgent.indexOf("Mobi") === -1;
	}

	/**
	 * Determines whether the user is on an iOS 15+ Safari browser.
	 *
	 * This is what navigator.userAgent returns for iOS Safari:
	 * 1) Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1
	 * 2) Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit / 605.1.15 (KHTML, like Gecko) Mobile / 15E148
	 *
	 * @return {boolean} Is the user agent on iOS 15+ Safari?
	 */
	function isUseriOS15plusSafari() {
		const iOS = Boolean(navigator.userAgent.match(/iP(hone|ad|od)/i));
		const versionMatchArray = navigator.userAgent.match(/(?!=OS)(([0-9]){2})/i);
		const version = versionMatchArray && versionMatchArray.length > 0 ? Number(versionMatchArray[0]) : -1;
		const safari = Boolean(navigator.userAgent.match(/WebKit/i)) &&
			!Boolean(navigator.userAgent.match(/CriOS/i));
		return iOS && safari && version >= 15;
	}

	/**
	 * Determines whether the user is on Firefox browser.
	 *
	 * @returns {boolean} True if the user is on Firefox browser and False otherwise
	 */
	function isUserFirefox() {
		return navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	}

	/**
	 * Send a post message to the iframe window.
	 * @param {String} method - Name of method.
	 * @param {Object} data - Data to send with message. Only included in post message if data is defined.
	 */
	function sendPostMessageToIframeWindow(method, data) {
		const iframe = getEmbeddedMessagingFrame();

		if(typeof method !== "string") {
			throw new Error(`Expected a string to use as message param in post message, instead received ${method}.`);
		}

		if(iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(
				{
					method,
					...data && { data }
				},
				getSiteURL()
			);
		} else {
			warning(`Embedded Messaging iframe not available for post message with method ${method}.`);
		}
	}

	/**
	 * Handles Aura site endpoint. Sets iframe.src and logs success message on iframe load.
	 * TODO W-10165756 - Remove support for aura sites & the aura app.
	 * @param iframe - iframe element
	 */
	function handleAuraSite(iframe) {
		if(!iframe) {
			error("Failed to load aura app. Iframe is undefined.");
		}

		iframe.src = getSiteURL() + "/embeddedService/embeddedService.app";
		iframe.onload = () => {
			log("Created an iframe to load the aura application.");
		};
	}

	/**
	 * Handles LWR site endpoint. Sets iframe.src and updates FAB and iframe styling on site load.
	 * @param iframe - iframe element
	 */
	function handleLWRSite(iframe) {
		let siteURL = getSiteURL();

		if(!iframe) {
			error("Failed to load LWR site. Iframe is undefined.");
		}

		// Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
		if(!siteURL.endsWith("/")) siteURL += "/";

		iframe.src = siteURL + "?lwc.mode=" + (embeddedservice_bootstrap.settings.devMode ? "dev" : "prod");
		iframe.onload = () => {
			log("Created an iframe to load LWR site.");
			handleAfterAppLoad();
		};
	}

	/**
	 * On clicking the button, create an iframe with a site endpoint as experienceSiteEndpointURL along with passing necessary config values as query params.
	 */
	function handleClick() {
		let button = getEmbeddedMessagingConversationButton();

		// eslint-disable-next-line no-negated-condition
		if(button && !button.classList.contains(CONVERSATION_BUTTON_LOADED_CLASS)) {
			setLoadingStatusForButton();

			try {
				// Generate markup for File Preview frame.
				embeddedservice_bootstrap.createFilePreviewFrame();
				embeddedservice_bootstrap.createIframe();
			} catch(err) {
				error(err);
			}
		} else {
			let iFrame = getEmbeddedMessagingFrame();

			if(iFrame) {
				// Minimize the chat if it is already maximized.
				sendPostMessageToIframeWindow(APP_MINIMIZE_EVENT_NAME);
			} else {
				error("Failed to locate the iframe/chat widget");
			}
		}
	}

	/**
	 * Handles key down events on static chat button on parent page.
	 * @param evt
	 */
	function handleKeyDown(evt) {
		let frame = getEmbeddedMessagingFrame();

		if (evt && evt.key) {
			if (evt.key === KEY_CODES.SPACE || evt.key === KEY_CODES.ENTER) {
				evt.preventDefault();
				// SPACE or ENTER fires onclick handler for the button.
				handleClick();
			} else if (evt.key === KEY_CODES.TAB && evt.shiftKey) {
				if (frame && frame.classList && frame.classList.contains("isMaximized")) {
					// SHIFT + TAB: Trap focus to last element in client.
					evt.preventDefault();
					sendPostMessageToIframeWindow(EMBEDDED_MESSAGING_FOCUS_ON_LAST_FOCUSABLE_ELEMENT_EVENT_NAME);
				}
			}
		}
	}

	/**
	 * If Web Storage is available, check if there's an existing session to show.
	 */
	function bootstrapIfSessionExists() {
		if(getItemInWebStorageByKey(STORAGE_KEYS.JWT)) {
			handleClick();
		}
	}

	/**
	 * Handle updates to FAB and Iframe after app loaded event is received from container with the aura app
	 * OR after a LWR site is loaded.
	 */
	function handleAfterAppLoad() {
		let button = getEmbeddedMessagingConversationButton();
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.getElementById("embeddedMessagingLoadingSpinner");
		let iframe = getEmbeddedMessagingFrame();

		if(!iframe) {
			warning("Embedded Messaging iframe not available for post-app-load updates.");
		}

		if(!button) {
			warning("Embedded Messaging static button not available for post-app-load updates.");
		} else {
			// Reset the Conversation button once the aura application is loaded in the iframe. Ifame/Chat window is rendered on top of FAB.
			iconContainer.removeChild(loadingSpinner);
			chatIcon.style.display = "none";
			button.disabled = false;
			button.classList.remove(CONVERSATION_BUTTON_LOADING_CLASS);
			button.classList.add(CONVERSATION_BUTTON_LOADED_CLASS);
			button.classList.add("no-hover");
		}
	}

	/**
	 * Handles cleanup after closing the client, i.e after closing a conversation in Unauth mode OR
	 * clearing the user session in Auth mode.
	 * This method resets the client to the initial state (State Zero) for Auth/Unauth modes.
	 */
	function handleResetClientToInitialState() {
		const iframe = getEmbeddedMessagingFrame();
		const button = getEmbeddedMessagingConversationButton();
		const modal = document.getElementById(BACKGROUND_MODAL_ID);
		const chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		const minimizeIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_MINIMIZE);

		try {
			// Clear existing items stored in current conversation
			clearWebStorage();
			// Re-init web storage, for subsequent conversations
			initializeWebStorage();
		} catch(err) {
			error("Error on clearing web storage for the previously ended conversation: " + err);
		}

		// Clear existing items stored in current conversation from in-memory
		clearInMemoryData();

		if(iframe) {
			// Remove the iframe from DOM. This should take care of clearing Conversation Entries as well.
			iframe.parentNode.removeChild(iframe);
		} else {
			warning("Embedded Messaging iframe not available for resetting the client to initial state.");
		}

		if(embeddedservice_bootstrap.filePreviewFrame) {
			// Remove the file preview iframe from DOM.
			embeddedservice_bootstrap.filePreviewFrame.parentNode.removeChild(embeddedservice_bootstrap.filePreviewFrame);
		} else {
			warning("Embedded Messaging file preview iframe not available for resetting the client to initial state.");
		}

		if (modal) {
			// [Mobile] Remove the background modal overlay from the DOM.
			modal.parentNode.removeChild(modal);
		}

		if (document.body.classList.contains(PREVENT_SCROLLING_CLASS)) {
			// [Mobile] Remove class that prevents background clicking and scrolling.
			// Restore document body's scroll position only for mobile devices
			document.body.classList.remove(PREVENT_SCROLLING_CLASS);
			if (embeddedservice_bootstrap.documentScrollPosition) {
				window.scrollTo(0, embeddedservice_bootstrap.documentScrollPosition);
			}
		}

		if (button) {
			if (getAuthMode() === AUTH_MODE.AUTH) {
				// Remove button from DOM.
				button.parentNode.removeChild(button);
			} else {
				// Reset button to initial state.
				button.classList.remove(CONVERSATION_BUTTON_LOADED_CLASS);
				button.classList.remove("no-hover");

				// [A11Y] Button is focusable again after container is closed.
				button.setAttribute("tabindex", 0);

				// [A11Y] Focus on static button after container is closed.
				button.focus();

				// Remove minimize icon.
				if(minimizeIcon) {
					minimizeIcon.remove();
				}

				// Display the chat icon.
				chatIcon.style.display = "block";
			}
		} else {
			warning("Embedded Messaging static button not available for resetting the client to initial state.");
		}

		// Resolve clearSession() promise, if we are in Auth mode.
		if (getAuthMode() === AUTH_MODE.AUTH) {
			resolveClearAuthSessionPromise();
		}
	}

	/***************************
	 Markup generation functions
	 ***************************/
	/**
	 * Generate markup for the static conversation button's icon.
	 * @return {HTMLElement}
	 */
	function createConversationButtonIcon() {
		const buttonIconWrapper = document.createElement("div");
		const buttonIconElement = renderSVG(DEFAULT_ICONS.CHAT);

		buttonIconElement.setAttribute("id", EMBEDDED_MESSAGING_ICON_CHAT);
		buttonIconElement.setAttribute("class", EMBEDDED_MESSAGING_ICON_CHAT);

		buttonIconWrapper.id = EMBEDDED_MESSAGING_ICON_CONTAINER;
		buttonIconWrapper.className = EMBEDDED_MESSAGING_ICON_CONTAINER;

		buttonIconWrapper.appendChild(buttonIconElement);

		return buttonIconWrapper;
	}

	/**
	 * Generate markup for the static conversation button.
	 * @return {HTMLElement}
	 */
	function createConversationButton() {
		const buttonWrapper = document.createElement("div");
		const buttonElement = document.createElement("button");
		const buttonIcon = createConversationButtonIcon();

		buttonWrapper.className = CONVERSATION_BUTTON_WRAPPER_CLASS;
		buttonElement.classList.add(CONVERSATION_BUTTON_CLASS);
		buttonElement.id = CONVERSATION_BUTTON_CLASS;
		buttonElement.href = "javascript:void(0)";

		// Click event handler for the conversation button.
		buttonElement.addEventListener("click", handleClick);
		buttonElement.addEventListener("keydown", handleKeyDown);

		// [A11Y] Button is focusable when initially loaded.
		buttonElement.setAttribute("tabindex", 0);

		// Update the color of FAB to match the color of Chat Header, i.e. --headerColor branding token from setup.
		buttonElement.style.setProperty("--eswHeaderColor", getButtonColorFromBrandingConfig());
		// Update the focus border color to match the Secondary Color, i.e. --secondaryColor branding token from setup.
		buttonElement.style.setProperty("--eswSecondaryColor", getButtonFocusBorderColorFromBrandingConfig());

		// Adjust button height if browser has bottom tab bar.
		if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
			buttonElement.classList.add(CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS);
		}

		// Construct the static conversation button.
		buttonElement.appendChild(buttonIcon);
		buttonWrapper.appendChild(buttonElement);

		return buttonWrapper;
	}

	/**
	 * Generates markup for the background overlay (for modal view displayed on mobile only).
	 * @return {HTMLElement}
	 */
	function createBackgroundModalOverlay() {
		const modal = document.createElement("div");

		modal.id = BACKGROUND_MODAL_ID;

		return modal;
	}

	/**
	 * Generate markup for the top-level container element on the parent page.
	 * @return {HTMLElement}
	 */
	function createTopContainer() {
		const topContainerElement = document.createElement("div");

		topContainerElement.id = TOP_CONTAINER_NAME;
		topContainerElement.className = TOP_CONTAINER_NAME;

		return topContainerElement;
	}

	/*************************************************************
	*		Embedded Messaging User Verification Public API      *
	**************************************************************/
	/**
	 * Parameters for the identity token data object passed in via 
	 * embeddedservice_bootstrap.userVerificationAPI.setIdentityToken API call.
	 */
	const IDENTITY_TOKEN_PARAM = {
		ID_TOKEN_TYPE: "identityTokenType",
		ID_TOKEN: "identityToken"
	};

	/**
	 * The authorization mode values for the deployment.
	 */
	const AUTH_MODE = {
		AUTH: "Auth",
		UNAUTH: "UnAuth"
	}

	/**
	 * Embedded Messaging User Verification exposed in window.embeddedservice_bootstrap.userVerificationAPI 
	 * for managing authorized conversation sessions.
	 * @class
	 */
	function EmbeddedMessagingUserVerification() {}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * User verification API method for setting the identity token used to authorize the end user's session.
	 * This API is used to set the initial identity token as well as any subsequent tokens generated by the customer
	 * to extend the end user's session.
	 *
	 * For 242, only JWT-based identity tokens are accepted.
	 * @param {Object} identityTokenData - The customer-supplied identity token data object.
	 * Per the user verification contract, the object contains the following fields:
	 * 		- {String} identityTokenType : the verification scheme of the identity token.
	 *      - {Object} identityToken : the identity token used to authorize the user session.
	 * @return {Boolean} true if identity token provided is valid and false otherwise.
	 */
	EmbeddedMessagingUserVerification.prototype.setIdentityToken = function setIdentityToken(identityTokenData) {
		let identityTokenType;
		let token;

		// Cannot be invoked before `afterInit` event has been emitted.
		if (!hasEmbeddedMessagingReadyEventFired) {
			error(`Method can’t be invoked before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		// Check whether we are in authorization mode.
		if (getAuthMode() !== AUTH_MODE.AUTH) {
			error(`User Verification isn’t enabled in Messaging Settings.`);
			return false;
		}

		// Perform validation on the identity token data supplied.
		if (!validateIdentityTokenData(identityTokenData)) {
			error(`Invalid identity token parameter passed into the setIdentityToken method. Specify a valid object containing the token data.`);
			return false;
		}

		// Set the identityTokenType and token fields.
		identityTokenType = identityTokenData[IDENTITY_TOKEN_PARAM.ID_TOKEN_TYPE];
		token = identityTokenData[IDENTITY_TOKEN_PARAM.ID_TOKEN];

		// Only JWT-based identity tokens are supported in 242.
		if (typeof identityTokenType !== "string" || identityTokenType.trim().toUpperCase() !== ID_TOKEN_TYPE.JWT) {
			error(`Unsupported identity token. Only JWT-based identity tokens are supported.`);
			return false;
		}

		// Perform validation on the identity token received.
		if (!validateIdentityToken(identityTokenType, token)) {
			error(`Invalid identity token passed into the setIdentityToken method.`);
			return false;
		}

		// Store (or replace existing) customer identity token in memory.
		identityToken = token;

		if (getEmbeddedMessagingFrame()) {
			// If iframe is initialized, replace the identity token passed down during initialization.
			sendPostMessageToIframeWindow(EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME, identityToken);
		} else if (!getEmbeddedMessagingConversationButton()) {
			// Render conversation button if identity token passes basic validation.
			embeddedservice_bootstrap.generateMarkup();
			// Bootstrap if an authorized session already exists.
			bootstrapIfSessionExists();
		}

		return true;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * User verification API method for clearing the current user's session.
	 * Per the user verification contract, the customer is responsible for invoking this API method when
	 * 1) the end-user logs out of the current session or
	 * 2) the current session expires.
	 * @return {Promise} - Promise that resolves after a session is successfully cleared OR is rejected with relevant error message.
	 */
	EmbeddedMessagingUserVerification.prototype.clearSession = function clearSession() {
		return new Promise((resolve, reject) => {
			clearUserSessionPromiseResolve = resolve;

			// Cannot be invoked before `afterInit` event has been emitted.
			if (!hasEmbeddedMessagingReadyEventFired) {
				reject(`Method can't be invoked before the onEmbeddedMessagingReady event is fired.`);
				return;
			}

			// Check whether we are in authorization mode.
			if (getAuthMode() !== AUTH_MODE.AUTH) {
				reject(`User Verification isn’t enabled in Messaging Settings.`);
				return;
			}

			handleClearUserSession(true);
		});
	}

	/**
	 * Clear user session in the same tab/window.
	 * This method is called by -
	 * 1. embeddedservice_bootstrap.userVerificationAPI.clearSession() API to clear user session in primary tab.
	 * 2. Storage event handler to clear user session across secondary tabs.
	 * @param shouldRevokeJwt - Whether to revoke the ia-message jwt.
	 */
	function handleClearUserSession(shouldRevokeJwt) {
		const iframe = getEmbeddedMessagingFrame();
		if (iframe) {
			sendPostMessageToIframeWindow(EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME, shouldRevokeJwt);
		} else {
			handleResetClientToInitialState();
		}
	}

	/**
	 * Handle customer identity token expiry. This method does the following -
	 * 1. Dispatch "onEmbeddedMessagingTokenExpired" event to notify the customer that their token has expired.
	 * 2. Error log token expiry.
	 * 3. Clear user session in all tabs.
	 */
	function handleIdentityTokenExpiry() {
		if (getAuthMode() !== AUTH_MODE.AUTH) {
			warning(`User Verification isn’t enabled in Messaging Settings.`);
			return;
		}
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_ID_TOKEN_EXPIRED_EVENT_NAME);
		error(`Identity token has expired. Closing the chat window and clearing the user session in all tabs.`);
		handleClearUserSession(false);
	}

	/**
	 * Validation method for customer supplied identity token data to the setIdentityToken call.
	 * @param {Object} identityTokenData - The identity token data parameter to be validated.
	 * @returns true if identity token data parameter is well formed and false otherwise.
	 */
	function validateIdentityTokenData(identityTokenData) {
		return identityTokenData && identityTokenData !== null && typeof identityTokenData === "object";
	}

	/**
	 * Validation method for customer supplied identity token.
	 * For 242, the only verification scheme supported is JWT-based verification.
	 * @param {Object} identityToken 
	 * @returns true if identity token is valid and false otherwise.
	 */
	function validateIdentityToken(identityTokenType, identityToken) {
		let isValid = false;

		switch(identityTokenType) {
			case ID_TOKEN_TYPE.JWT:
				isValid = validateJWT(identityToken);
				break;
			default:
				break;
		}
		return isValid;
	}

	/**
	 * Method for parsing JWT and extracting the JSON payload.
	 * @param {Object} jwt - The JWT to be parsed.
	 * @returns JSON payload of the jwt
	 */
	function parseJWT(jwt) {
		// Split out the payload from the header
		var base64Url = jwt.split('.')[1];
		// Convert base64Url string to base64
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		// Decode base64 payload
		var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	/**
	 * Validation method for identity token of type JWT.
	 * @param {*} jwt - The JWT to be validated.
	 * @returns true if JWT is valid and false otherwise.
	 */
	function validateJWT(jwt) {
		let jwtPayload;
		let isValid;

		try {
			// Extract JWT payload.
			jwtPayload = parseJWT(jwt);

			// Validate that the JWT has not expired.
			// Per RFC 7519, a JWT is valid if the current time (in seconds) is before
			// the `exp` claim value.
			// See: https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4
			isValid = Math.floor(Date.now()/1000) < jwtPayload.exp;

			// Log JWT expiry to console if devMode is on and JWT has expired.
			if (Boolean(embeddedservice_bootstrap.settings.devMode) && !isValid) {
				log(`JWT has expired at ${(new Date(jwtPayload.exp * 1000)).toString()}`);
			}

			return isValid;
		} catch (e) {
			if (Boolean(embeddedservice_bootstrap.settings.devMode)) {
				error(`JWT validation failed: ${e.message}`);
			}
			return false;
		}
	}

	/**
	 * Helper function for determining the authorization mode set in Messaging Channel configuration.
	 * 
	 * @returns {String} The authorization mode ("Auth" / "UnAuth").
	 */
	function getAuthMode() {
		let authMode = null;

		try {
			authMode = embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode;
		} catch (e) {
			error(`Failed to retrieve auth mode flag: ${e.message}`);
		}
		return authMode;
	}

	/**
	 * Helper function to resolve the promise returned by embeddedservice_bootstrap.userVerificationAPI.clearSession(), if it exists.
	 */
	function resolveClearAuthSessionPromise() {
		if (clearUserSessionPromiseResolve && typeof clearUserSessionPromiseResolve === "function") {
			clearUserSessionPromiseResolve();
			clearUserSessionPromiseResolve = undefined;
		}
	}

	/****************************************
	 *		    HIDDEN PRECHAT API          *
	/****************************************/
	/* Hidden Prechat functions exposed in window.embeddedservice_bootstrap.prechatAPI for setting/updating and removing hidden prechat fields.
	 *
	 * @class
	 */
	function EmbeddedMessagingPrechat() {
		// Restore/Re-Initialize Hidden Prechat fields property on page reload from Session Storage.
		hiddenPrechatFields = getItemInWebStorageByKey(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, false) || {};
	}

	/**
	 * Validates the Hidden Prechat fields from the configuration response object.
	 * @return {boolean} True if valid and False otherwise.
	 */
	function validateHiddenPrechatFieldsFromConfig() {
		if (Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms) && embeddedservice_bootstrap.settings.embeddedServiceConfig.forms.length && Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].hiddenFormFields)) {
			return true;
		}
		return false;
	}

	/**
	 * Validates a Hidden Pre-Chat field set by host in setHiddenPrechatFields method.
	 * @return {boolean} True if fieldName and/or fieldValue are valid and False otherwise.
	 */
	function validateHiddenPrechatField(fieldName, fieldValue) {
		const hiddenPrechatFieldsFromConfig = getHiddenPrechatFieldsFromConfig();
		// List of field names from configuration response.
		const hiddenPrechatFieldNamesFromConfig = hiddenPrechatFieldsFromConfig.map(({ name }) => name);
		// Field name object from configuration response for the passed in fieldName.
		const hiddenPrechatField = hiddenPrechatFieldsFromConfig.find(fields => fields.name === fieldName);

		if (!hiddenPrechatFieldNamesFromConfig.includes(fieldName)) {
			error(`setHiddenPrechatFields called with an invalid field name ${fieldName}.`);
			return false;
		}
		if (typeof fieldValue !== "string") {
			error(`You must specify a string for the ${fieldName} field in setHiddenPrechatFields instead of a ${typeof fieldValue} value.`);
			return false;
		}
		if (fieldValue.toLowerCase().includes("javascript:") || fieldValue.toLowerCase().includes("<script>")) {
			error(`JavaScript isn't allowed in the value for the ${fieldName} field when calling setHiddenPrechatFields.`);
			return false;
		}
		if (fieldValue.length > hiddenPrechatField['maxLength']) {
			error(`Value for the ${fieldName} field in setHiddenPrechatFields exceeds the maximum length restriction of ${hiddenPrechatField['maxLength']} characters.`);
			return false;
		}
		return true;
	}

	/**
	 * Gets the Hidden Prechat fields from the configuration response object.
	 * @return {object} Array of Hidden Prechat fields.
	 */
	function getHiddenPrechatFieldsFromConfig() {
		let hiddenPrechatFieldsFromConfig = [];

		if (validateHiddenPrechatFieldsFromConfig()) {
			hiddenPrechatFieldsFromConfig = embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].hiddenFormFields;
		}
		return hiddenPrechatFieldsFromConfig;
	}

	/**
	 * Determine whether the client is ready for the host to set/update and/or remove Hidden Prechat fields.
	 * @param {string} caller - caller method name which invokes 'shouldProcessHiddenPrechatFieldsFromHost'.
	 * @return {boolean} True if the client is ready for the host to set/update and/or remove Hidden Prechat fields AND False otherwise.
	 */
	function shouldProcessHiddenPrechatFieldsFromHost(caller) {
		if (!hasEmbeddedMessagingReadyEventFired) {
			error(`Can't call ${caller} before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}
		if (getItemInWebStorageByKey(STORAGE_KEYS.JWT)) {
			error(`Can't call ${caller} during an active conversation.`);
			return false;
		}
		return true;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and set/update Hidden Prechat fields.
	 * Sets a new Hidden Prechat field or updates an existing field with the passed in value.
	 *
	 * @param {object} hiddenFields - an object (in the form of a Map) of key-value pairs (e.g. { HiddenPrechatFieldName1 : HiddenPrechatFieldValue1, HiddenPrechatFieldName2 : HiddenPrechatFieldValue2 }) of Hidden Prechat fields as set by the host.
	 */
	EmbeddedMessagingPrechat.prototype.setHiddenPrechatFields = function setHiddenPrechatFields(hiddenFields) {
		if (!shouldProcessHiddenPrechatFieldsFromHost('setHiddenPrechatFields')) {
			return;
		}

		if (hiddenFields && typeof hiddenFields === "object") {
			for (const [fieldName, fieldValue] of Object.entries(hiddenFields)) {
				if (validateHiddenPrechatField(fieldName, fieldValue)) {
					hiddenPrechatFields[fieldName] = fieldValue;
					// Store/Update Session storage with Hidden Prechat fields object for a valid field.
					setItemInWebStorage(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, hiddenPrechatFields, false);
					// Log successful update action on Hidden Prechat fields for debugging purposes.
					log(`[setHiddenPrechatFields] Successfully updated Hidden Pre-Chat field ${fieldName}.`);
				}
			}
		} else {
			error(`When calling setHiddenPrechatFields, you must pass in an object with key-value pairs.`);
		}
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and remove Hidden Prechat fields.
	 * Removes an existing Hidden Prechat field with the passed in key name.
	 *
	 * @param {object} hiddenFields - an object (in the form of an Array) of Hidden Prechat field names (e.g. [ HiddenPrechatFieldName1, HiddenPrechatFieldName2 ]) to be removed/deleted.
	 */
	EmbeddedMessagingPrechat.prototype.removeHiddenPrechatFields = function removeHiddenPrechatFields(hiddenFields) {
		if (!shouldProcessHiddenPrechatFieldsFromHost('removeHiddenPrechatFields')) {
			return;
		}

		if (hiddenFields && Array.isArray(hiddenFields)) {
			hiddenFields.forEach(function(fieldName) {
				if (hiddenPrechatFields.hasOwnProperty(fieldName)) {
					delete hiddenPrechatFields[fieldName];
					// Update Session storage with Hidden Prechat fields object for a valid field.
					setItemInWebStorage(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, hiddenPrechatFields, false);
					// Log successful remove action on Hidden Prechat fields for debugging purposes.
					log(`[removeHiddenPrechatFields] Successfully removed Hidden Pre-Chat field ${fieldName}.`);
				} else {
					error(`removeHiddenPrechatFields called with an invalid field name ${fieldName}.`);
				}
			});
		} else {
			error(`When calling removeHiddenPrechatFields, you must pass in an array of fields.`);
		}
	};

	/****************************************
	 * .           POSTCHAT API             *
	/****************************************/
	/**
	 * Post-Chat API methods exposed in window.embeddedservice_bootstrap.postchatAPI
	 * for setting/updating/removing post-chat parameters on the host domain.
	 *
	 * @class
	 */
	function EmbeddedMessagingPostchat() {
		// Restore post-chat API parameter map on page reload from session storage.
		postchatParameters = getItemInWebStorageByKey(STORAGE_KEYS.POSTCHAT_PARAMETERS, false) || {};
	}

	/**
	 * Determine whether the client is ready for the host (customer) to invoke public Post-Chat API methods.
	 *
	 * @param {String} caller - Name of caller method which invokes `shouldProcessPostchatParametersFromHost`
	 * @returns {Boolean} true if client is ready for host to update/remove post-chat page parameters. Otherwise, false.
	 */
	function shouldProcessPostchatParametersFromHost(caller) {
		if (!hasEmbeddedMessagingReadyEventFired) {
			error(`[${caller}] Cannot invoke Post-Chat API before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		return true;
	}

	/**
	 * Validate a post-chat page query string parameter set by host via the `setPostchatParameters` API method
	 * @param {String} parameterName - Key of post-chat page parameter provided by host.
	 * @param {String} parameterValue - Value of post-chat page parameter provided by host.
	 * @returns {Boolean} Returns true if parameter key and/or value are valid. Otherwise, returns false.
	 */
	function validatePostchatParameter(parameterName, parameterValue) {
		if (typeof parameterName !== "string" || parameterName.trim().length < 1) {
			error(`Expected a non-empty string for the parameter name, but received ${typeof parameterName}`);
			return false;
		}

		if (typeof parameterValue !== "string" || parameterValue.trim().length < 1) {
			error(`Expected a non-empty string for the parameter value, but received ${typeof parameterValue}`);
			return false;
		}

		return true;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to set/update post-chat page parameters.
	 * Sets a new parameter (key-value pair) or updates an existing parameter with the same key to a new value.
	 *
	 * @param {Object} pageParameters - Map containing key-value pairs of query string parameters as invoked by the host.
	 * (e.g. { parameterName1: parameterValue2, parameterName2: parameterValue2 })
	 */
	EmbeddedMessagingPostchat.prototype.setPostchatParameters = function setPostchatParameters(pageParameters) {
		if (!shouldProcessPostchatParametersFromHost("setPostchatParameters")) {
			return;
		}

		if (pageParameters && typeof pageParameters === "object") {
			for (const [paramKey, paramValue] of Object.entries(pageParameters)) {
				// Validate parameters are valid non-empty strings.
				if (validatePostchatParameter(paramKey, paramValue)) {
					postchatParameters[paramKey] = paramValue;
					setItemInWebStorageByKey(STORAGE_KEYS.POSTCHAT_PARAMETERS, postchatParameters, false);
					// Log successfully updated post-chat parameters for debugging purposes.
					log(`[setPostchatParameters] Successfully updated post-chat parameter ${paramKey}`);
				} else {
					warning(`[setPostchatParameters] Failed to validate post-chat parameter ${paramKey}`)
				}
			}
		} else {
			error(`[setPostchatParameters] Must pass in an object of parameters as key-value pairs.`);
		}
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to remove post-chat page parameters.
	 * Removes an existing parameter with the specified key.
	 *
	 * @param {Array} pageParameters - Array containing parameter names/keys (e.g. [ parameterName1, parameterName2 ])
	 */
	EmbeddedMessagingPostchat.prototype.removePostchatParameters = function removePostchatParameters(pageParameters) {
		if (!shouldProcessPostchatParametersFromHost("removePostchatParameters")) {
			return;
		}

		if (pageParameters && Array.isArray(pageParameters)) {
			pageParameters.forEach(function(paramKey) {
				if (postchatParameters.hasOwnProperty(paramKey)) {
					delete postchatParameters[paramKey];
					setItemInWebStorageByKey(STORAGE_KEYS.POSTCHAT_PARAMETERS, postchatParameters, false);
					// Log successfully removed post-chat page parameter for debugging purposes.
					log(`[removePostchatParameters] Successfully removed post-chat parameter ${paramKey}`);
				} else {
					warning(`[removePostchatParameters] Failed to validate post-chat parameter ${paramKey}`);
				}
			});
		} else {
			error(`[removePostchatParameters] Must pass in an array of parameter names.`);
		}
	};

	/*********************************************************
	*		    Embedded Messaging Bootstrap Object          *
	**********************************************************/
	/**
	 * EmbeddedServiceBootstrap global object which creates and renders an embeddedService.app in an iframe.
	 *
	 * @class
	 * @property {object} settings - A list of settings that can be set here or within init.
	 */
	function EmbeddedServiceBootstrap() {
		this.settings = {
			devMode: false,
			targetElement: document.body
		};

		this.isLocalStorageAvailable = true;
		this.isSessionStorageAvailable = true;

		// Default chat icon data.
		Object.defineProperties(DEFAULT_ICONS, {
			CHAT: {
				value: "M50 0c27.614 0 50 20.52 50 45.833S77.614 91.667 50 91.667c-8.458 0-16.425-1.925-23.409-5.323-13.33 6.973-21.083 9.839-23.258 8.595-2.064-1.18.114-8.436 6.534-21.767C3.667 65.54 0 56.08 0 45.833 0 20.52 22.386 0 50 0zm4.583 61.667H22.917a2.917 2.917 0 000 5.833h31.666a2.917 2.917 0 000-5.833zm12.5-15.834H22.917a2.917 2.917 0 000 5.834h44.166a2.917 2.917 0 000-5.834zM79.583 30H22.917a2.917 2.917 0 000 5.833h56.666a2.917 2.917 0 000-5.833z"
			},
			MINIMIZE_MODAL: {
				value: "M47.6,17.8L27.1,38.5c-0.6,0.6-1.6,0.6-2.2,0L4.4,17.8c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2 c0.6-0.6,1.6-0.6,2.2,0l16.1,16.3c0.6,0.6,1.6,0.6,2.2,0l16.1-16.2c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C48.1,16.3,48.1,17.2,47.6,17.8z"
			}
		});

		this.brandingData = [];
	}

	/**
	 * Determine if a string is a valid Salesforce entity ID.
	 *
	 * @param {string} entityId - The value that should be checked.
	 * @returns {boolean} Is this a valid entity Id?
	 */
	EmbeddedServiceBootstrap.prototype.isValidEntityId = function isValidEntityId(entityId) {
		return typeof entityId === "string" && (entityId.length === 18 || entityId.length === 15);
	};

	/**
	 * Extract the entity key prefix from a valid entity ID.
	 *
	 * @param {string} entityId = The string from which to extract the entity ID.
	 * @returns {string} The key prefix, if this ID is valid.
	 */
	EmbeddedServiceBootstrap.prototype.getKeyPrefix = function getKeyPrefix(entityId) {
		if(embeddedservice_bootstrap.isValidEntityId(entityId)) return entityId.substr(0, 3);

		return undefined;
	};

	/**
	 * Determines if a string is a valid Salesforce organization ID.
	 *
	 * @param {string} entityId - An entity ID.
	 * @returns {boolean} Is the string an organization ID?
	 */
	EmbeddedServiceBootstrap.prototype.isOrganizationId = function isOrganizationId(entityId) {
		return embeddedservice_bootstrap.getKeyPrefix(entityId) === "00D";
	};
	/**
	 * Determines if a message origin url has a Salesforce domain. Used for filtering non-Salesforce messages.
	 *
	 * @param {string} messageOriginUrl - String containing the origin url. This should end with the domain (strip off the port before passing to this function).
	 * @return {boolean} Did message come from page hosted on Salesforce domain?
	 */
	EmbeddedServiceBootstrap.prototype.isMessageFromSalesforceDomain = function isMessageFromSalesforceDomain(messageOriginUrl) {
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
	};

	/**
	 * Generate markup and render on parent page.
	 */
	EmbeddedServiceBootstrap.prototype.generateMarkup = function generateMarkup() {
		const markupFragment = document.createDocumentFragment();
		const topContainer = createTopContainer();
		const conversationButton = createConversationButton();

		topContainer.appendChild(conversationButton);
		markupFragment.appendChild(topContainer);

		// Render static conversation button.
		embeddedservice_bootstrap.settings.targetElement.appendChild(markupFragment);
	};

	/**
	 * Create an iframe on the parent window for rendering a full size File Preview.
	 * Set the source of this iframe to an objectUrl generated by #getGeneratedPageURLForFilePreviewFrame.
	 */
	EmbeddedServiceBootstrap.prototype.createFilePreviewFrame = function createFilePreviewFrame() {
		const filePreviewFrame = document.createElement("iframe");
		const filePreviewFrameUrl = `${getSiteURL()}/assets/htdocs/filepreview${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.html?parent_domain=${window.location.origin}`;

		filePreviewFrame.classList.add(FILE_PREVIEW_IFRAME_NAME);
		filePreviewFrame.id = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.name = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.src = filePreviewFrameUrl;
		filePreviewFrame.title = getLabel("EmbeddedMessagingIframesAndContents", "FilePreviewIframeTitle") || FILE_PREVIEW_IFRAME_DEFAULT_TITLE;
		filePreviewFrame.onload = () => {
			log("Created an iframe for file preview.");
		};
		embeddedservice_bootstrap.filePreviewFrame = filePreviewFrame;
		document.body.appendChild(filePreviewFrame);
	};

	/**
	 * On click of conversation button,
	 * (i) Create an iframe and set source as the aura application, loaded through the experienceSiteEndpointURL.
	 * 	- Wrap iframe in 2 divs to allow scrolling/responsiveness in iframe without viewport on page header.
	 * (ii) Create a div element to be the modal overlay for mobile clients only.
	 * (iii) Append iframe and modal to the top-level container of the parent page.
	 * (iv) Hide the conversation button once iframe is loaded.
	 */
	EmbeddedServiceBootstrap.prototype.createIframe = function createIframe() {
		try {
			const parent = document.getElementById(TOP_CONTAINER_NAME);
			const iframe = document.createElement("iframe");
			const modal = createBackgroundModalOverlay();

			iframe.title = getLabel("EmbeddedMessagingIframesAndContents", "MessagingIframeTitle") || IFRAME_DEFAULT_TITLE;
			iframe.className = IFRAME_NAME;
			iframe.id = IFRAME_NAME;
			iframe.style.backgroundColor = "transparent";
			iframe.allowTransparency = "true";

			// Set sandbox attributes on iframe unless omitSandbox flag is on.
			if(!embeddedservice_bootstrap.settings.omitSandbox) {
				// TODO: remove allow-same-origin when Aura/LWR allows
				// Add allow-modals to throw alert for unauthenticated user losing session.
				// Add allow-popups-to-escape-sandbox to enable links to escape sandbox context.
				iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox";
			}

			// Handle Aura/LWR site endpoints separately until W-10165756 is implemented.
			if(embeddedservice_bootstrap.settings.isAuraSite) {
				handleAuraSite(iframe);
			} else {
				handleLWRSite(iframe);
			}

			// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				iframe.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
				iframe.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
			}

			parent.appendChild(modal);
			parent.appendChild(iframe);
		} catch(e) {
			throw new Error(e);
		}
	};

	/**
	 * Maximize the iframe which holds the aura application. Use branding width/height if screen is
	 * big enough, else just fill what we have.
	 * @param {Object} iframe - Reference to iframe DOM element.
	 */
	EmbeddedServiceBootstrap.prototype.maximizeIframe = function maximizeIframe(frame) {
		const button = getEmbeddedMessagingConversationButton();
		const modal = document.getElementById(BACKGROUND_MODAL_ID);
		const chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		const iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let minimizeButton;

		if(frame) {
			// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
				frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
			}

			if(!frame.classList.contains("isMaximized")) {
				frame.classList.add("isMaximized");
			}

			if(frame.classList.contains("isMinimized")) {
				frame.classList.remove("isMinimized");
			}

			if(frame.classList.contains("isDismissed")) {
				frame.classList.remove("isDismissed");
			}
		}

		if(button) {
			// Static button is displayed under client when maximized.
			button.style.display = "block";

			// [A11Y] Button is not focusable when maximized.
			button.setAttribute("tabindex", -1);

			// Hide the default chat icon on the button.
			chatIcon.style.display = "none";

			// Create the minimize button markup and insert into the DOM.
			minimizeButton = renderSVG(DEFAULT_ICONS.MINIMIZE_MODAL);
			minimizeButton.setAttribute("id", EMBEDDED_MESSAGING_ICON_MINIMIZE);
			minimizeButton.setAttribute("class", EMBEDDED_MESSAGING_ICON_MINIMIZE);
			iconContainer.insertBefore(minimizeButton, chatIcon);
		}

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen's max-width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(modal && !modal.classList.contains("isMaximized")) {
			modal.classList.add("isMaximized");
		}

		// The `embeddedMessagingPreventScrolling` class is appended/removed from the document.body
		// to prevent background scrolling on devices that display the background modal.
		// Also storing document body's scroll position so we can restore when chat gets minimized for mobile devices only
		if(!isDesktop() && !document.body.classList.contains(PREVENT_SCROLLING_CLASS)) {
			// Most browsers will have scrollElement to keep track of scroll positions
			// Some older browsers do not, so using getBoundingClientRect() for those older brosers
			if (document.scrollingElement) {
				embeddedservice_bootstrap.documentScrollPosition = document.scrollingElement.scrollTop;
			} else {
				const docElementRect = document.documentElement.getBoundingClientRect();
				embeddedservice_bootstrap.documentScrollPosition = Math.abs(docElementRect.top);
			}
			document.body.classList.add(PREVENT_SCROLLING_CLASS);
		}

		sendPostMessageToIframeWindow(EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME);
	};

	/**
	 * Resize iframe to fit over button dimensions
	 */
	EmbeddedServiceBootstrap.prototype.minimizeIframe = function minimizeIframe(frame, data) {
		const button = getEmbeddedMessagingConversationButton();
		const minimizeIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_MINIMIZE);
		const modal = document.getElementById(BACKGROUND_MODAL_ID);
		const isDismissed = data.isMinimizedNotificationDismissed;

		if(frame) {
			// Adjust iframe distance from bottom to minimized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
				frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
			}

			if(frame.classList.contains("isMaximized")) {
				frame.classList.remove("isMaximized");
			}

			if(isDismissed) {
				// Resize and style iframe to render minimized button only.
				if(!frame.classList.contains("isMinimized")) {
					frame.classList.add("isMinimized");
				}

				if(!frame.classList.contains("isDismissed")) {
					frame.classList.add("isDismissed");
				}
			} else {
				// Resize and style iframe to render minimized button and notification.
				if(!frame.classList.contains("isMinimized")) {
					frame.classList.add("isMinimized");
				}
			}
		}

		// Remove the minimize icon from the button.
		if(minimizeIcon) {
			minimizeIcon.remove();
		}

		if(button) {
			// Hide the default FAB when chat client is minimized so that only the minimized FAB is shown.
			button.style.display = "none";
			button.setAttribute("tabindex", -1);
		}

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen max width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(modal && modal.classList.contains("isMaximized")) {
			modal.classList.remove("isMaximized");
		}

		// [Mobile] The `embeddedMessagingPreventScrolling` class is appended/removed from the
		// document.body to prevent background scrolling on devices that display the background modal.
		// Also restore document body's scroll position before chat window was maximized for mobile devices only
		if(!isDesktop()) {
			document.body.classList.remove(PREVENT_SCROLLING_CLASS);
			if (embeddedservice_bootstrap.documentScrollPosition) {
				window.scrollTo(0, embeddedservice_bootstrap.documentScrollPosition);
			}
		}

		sendPostMessageToIframeWindow(EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME);
	};

	/**
	 * Initialize feature specific objects on the global bootstrap object 'embeddedservice_bootstrap' to expose certain feature related APIs/properties externally.
	 */
	 EmbeddedServiceBootstrap.prototype.initializeFeatureObjects = function initializeFeatureObjects() {
		// Initialize a prechat object 'prechatAPI' on 'embeddedservice_bootstrap' global object for Hidden Prechat feature.
		embeddedservice_bootstrap.prechatAPI = new EmbeddedMessagingPrechat();

		// Initialize user verification API
		embeddedservice_bootstrap.userVerificationAPI = new EmbeddedMessagingUserVerification();
	}

	/**
	 * Validate settings and begin the process of rendering DOM elements.
	 *
	 * @param {string} orgId - the entity ID for the organization.
	 * @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	 * @param {string} siteURL - the base URL for the core (site) for the deployment.
	 * @param {object} snippetConfig - configuration on container page. Takes preference over server-side configuration.
	 */
	EmbeddedServiceBootstrap.prototype.init = function init(orgId, eswConfigDevName, siteURL, snippetConfig) {
		try {
			embeddedservice_bootstrap.settings.orgId = orgId;
			embeddedservice_bootstrap.settings.eswConfigDevName = eswConfigDevName;
			embeddedservice_bootstrap.settings.siteURL = siteURL;
			embeddedservice_bootstrap.settings.snippetConfig = snippetConfig;

			mergeSettings(snippetConfig || {});

			validateInitParams();

			detectWebStorageAvailability();

			checkForNativeFunctionOverrides();

			if(!embeddedservice_bootstrap.settings.targetElement) throw new Error("No targetElement specified.");

			addEventHandlers();

			// Check to see whether browser has bottom tab bar.
			embeddedservice_bootstrap.settings.hasBottomTabBar = isUseriOS15plusSafari();

			// isAuraSite - Temporary setting to fallback to Aura embeddedService.app. To be removed in W-10165756.
			embeddedservice_bootstrap.settings.isAuraSite = Boolean(embeddedservice_bootstrap.settings.isAuraSite);

			// Default app to use sandbox on iframe unless the flag is turned on.
			embeddedservice_bootstrap.settings.omitSandbox = Boolean(embeddedservice_bootstrap.settings.omitSandbox);

			// Load CSS file for bootstrap.js from GSLB.
			const cssPromise = loadCSS().then(
				Promise.resolve.bind(Promise),
				() => {
					// Retry loading CSS file from Core, if failed to load from GSLB.
					return loadCSS(embeddedservice_bootstrap.settings.siteURL);
				}
			).catch(
				() => {
					throw new Error("Error loading CSS.");
				}
			);

			// Load config settings from SCRT 2.0.
			const configPromise = getConfigurationData().then(
				response => {
					// Merge the Config Settings into embeddedservice_bootstrap.settings.
					mergeSettings(response);

					// Prepare the branding data.
					handleBrandingData(embeddedservice_bootstrap.settings.embeddedServiceConfig);

					// Merge SCRT 2.0 URL and Org Id into the Config Settings object, to be passed to the iframe.
					embeddedservice_bootstrap.settings.embeddedServiceConfig.scrt2URL = embeddedservice_bootstrap.settings.scrt2URL;
					embeddedservice_bootstrap.settings.embeddedServiceConfig.orgId = embeddedservice_bootstrap.settings.orgId;

					validateSettings();
				},
				responseStatus => {
					// Retry one more time to load config settings from SCRT 2.0 if the first attempt fails.
					return new Promise((resolve, reject) => {
						getConfigurationData().then(resolve, reject);
					});
				}
			).catch(
				() => {
					throw new Error("Unable to load Embedded Messaging configuration.");
				}
			);

			// Show button when we've loaded everything.
			Promise.all([cssPromise, configPromise]).then(() => {
				initializeWebStorage();

				embeddedservice_bootstrap.initializeFeatureObjects();

				// Fire 'onEmbeddedMessagingReady' event.
				embeddedservice_bootstrap.emitEmbeddedMessagingReadyEvent();

				// In Unauth mode, generate button markup & bootstrap if session exists.
				// In auth mode, button markup and bootstrap of existing session occurs via #setIdentityToken() API.
				if (getAuthMode() === AUTH_MODE.UNAUTH) {
					embeddedservice_bootstrap.generateMarkup();

					// Check if there's an existing session to show.
					bootstrapIfSessionExists();
				}
			});
		} catch(err) {
			error("Error: " + err);
		}
	};

	window.embeddedservice_bootstrap = new EmbeddedServiceBootstrap();
})();
