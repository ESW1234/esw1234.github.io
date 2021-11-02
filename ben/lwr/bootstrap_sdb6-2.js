/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 *
 * TO MINIFY: Use Google Closure Compiler:
 *		google-closure-compiler --js=bootstrap.js --js_output_file=bootstrap.min.js --rewrite_polyfills=false --language_out ECMASCRIPT_2015 --warning_level=QUIET
 *
 *		Install google-closure-compiler by running:
 *			npm install -g google-closure-compiler
 */
(() => {
	const GSLB_BASE_URL = "https://service.force.com";

	/**
	 * Conversation button class constants.
	 */
	const CONVERSATION_BUTTON_CLASS = "embeddedMessagingConversationButton";
	const CONVERSATION_BUTTON_LOADED_CLASS = CONVERSATION_BUTTON_CLASS + "Loaded";
	const CONVERSATION_BUTTON_LOADING_CLASS = CONVERSATION_BUTTON_CLASS + "Loading";
	const CONVERSATION_BUTTON_WRAPPER_CLASS = CONVERSATION_BUTTON_CLASS + "Wrapper";
	const CONVERSATION_BUTTON_POSITION_CLASS = "embeddedMessagingButtonPosition";
	const CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS = "embeddedMessagingBottomTabBar";

	/**
	 * Iframe class constants.
	 */
	const IFRAME_NAME = "embeddedMessagingFrame";
	const IFRAME_ROUNDED_CLASS = IFRAME_NAME + "Rounded";
	const IFRAME_NO_SHADOW_CLASS = IFRAME_NAME + "NoShadow";
	const IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS = IFRAME_NAME + "MaximizedBottomTabBar";
	const IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS = IFRAME_NAME + "MinimizedBottomTabBar";

	/**
	 * Styling constants.
	 */
	const DEFAULT_HEIGHT = "554";
	const DEFAULT_HEIGHT_MOBILE = "70vh";
	const DEFAULT_WIDTH = "344";
	const DEFAULT_WIDTH_MOBILE = "85vw";

	/**
	 * Icon constants.
	 */
	const DEFAULT_ICONS = {};
	const EMBEDDED_MESSAGING_ICON = "embeddedMessagingIcon";
	const EMBEDDED_MESSAGING_ICON_CHAT = EMBEDDED_MESSAGING_ICON + "Chat";
	const EMBEDDED_MESSAGING_ICON_CONTAINER = EMBEDDED_MESSAGING_ICON + "Container";
	const EMBEDDED_MESSAGING_ICON_LOADING = EMBEDDED_MESSAGING_ICON + "Loading";

	/**
	 * Loading constants.
	 */
	const EMBEDDED_MESSAGING_LOADING = "embeddedMessagingLoading";
	const EMBEDDED_MESSAGING_LOADING_SPINNER = EMBEDDED_MESSAGING_LOADING + "Spinner";
	const EMBEDDED_MESSAGING_LOADING_CIRCLE = EMBEDDED_MESSAGING_LOADING + "Circle";

	// TODO: confirm these as they will be AIPs
	const APP_LOADED_EVENT_NAME = "ESW_APP_LOADED";
	const APP_MINIMIZE_EVENT_NAME = "ESW_APP_MINIMIZE";
	const APP_MAXIMIZE_EVENT_NAME = "ESW_APP_MAXIMIZE";
	const EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME = "ESW_SET_JWT_EVENT";
	const EMBEDDED_MESSAGING_CLEAN_UP_JWT_EVENT_NAME = "ESW_CLEAN_UP_JWT_EVENT";
	const APP_REQUEST_CONFIG_SERVICE_DATA_EVENT_NAME = "ESW_APP_SEND_CONFIG_SERVICE_DATA";
	const APP_RECEIVE_CONFIG_SERVICE_DATA_EVENT_NAME = "ESW_APP_RECEIVE_CONFIG_SERVICE_DATA";
	const APP_RESET_INITIAL_STATE_EVENT_NAME = "ESW_APP_RESET_INITIAL_STATE";

	const SALESFORCE_DOMAINS = [
		// Used by dev, blitz, and prod instances
		".salesforce.com",

		// Used by VPODs
		".force.com",

		// Used by autobuild VMs
		".sfdc.net",

		// Used by local environments
		".sfdcdev.site.com"
	];

	/**
	 * Holds the required branding defaults, for FAB updates when the app is loaded.
	 */
	const BRANDING_DEFAULTS = {
		// Default color of the FAB to be updated when the app is loaded.
		"headerColor": "#1A1B1E"
	};

	/**
	 * Attributes required to construct SCRT 2.0 Config Service URL.
	 */
	const IN_APP_CONFIG_API_PREFIX = "embeddedservice";
	const IN_APP_CONFIG_API_VERSION = "v1";

	/**
	 * Merge a key-value mapping into the setting object, such that the provided
	 * map takes priority.
	 *
	 * @param {object} additionalSettings - A key-value mapping.
	 */
	function mergeSettings(additionalSettings) {
		if(additionalSettings && typeof additionalSettings === "object") {
			Object.keys(additionalSettings).forEach((key) => {
				if(embeddedservice_bootstrap.settings[key] === undefined) {
					embeddedservice_bootstrap.settings[key] = additionalSettings[key];
				}
			});
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
		if((alwaysOutput || embeddedservice_bootstrap.settings.devMode) && console && console[method]) { // eslint-disable-line no-console
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
	}

	/**
	 * EmbeddedServiceBootstrap global object which creates and renders an embeddedService.app in an iframe.
	 *
	 * @class
	 * @property {object} settings - A list of settings that can be set here or within init.
	 */
	function EmbeddedServiceBootstrap() {
		this.settings = { devMode: false };
		this.isLocalStorageAvailable = true;
		this.isSessionStorageAvailable = true;

		// Default chat icon data.
		Object.defineProperties(DEFAULT_ICONS, {
			CHAT: {
				value: "M50 0c27.614 0 50 20.52 50 45.833S77.614 91.667 50 91.667c-8.458 0-16.425-1.925-23.409-5.323-13.33 6.973-21.083 9.839-23.258 8.595-2.064-1.18.114-8.436 6.534-21.767C3.667 65.54 0 56.08 0 45.833 0 20.52 22.386 0 50 0zm4.583 61.667H22.917a2.917 2.917 0 000 5.833h31.666a2.917 2.917 0 000-5.833zm12.5-15.834H22.917a2.917 2.917 0 000 5.834h44.166a2.917 2.917 0 000-5.834zM79.583 30H22.917a2.917 2.917 0 000 5.833h56.666a2.917 2.917 0 000-5.833z"
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
		let storage;

		if(typeof jwt !== "string") {
			error(`Expected to receive string, instead received: ${jwt}.`);
		}
		if(embeddedservice_bootstrap.isLocalStorageAvailable) {
			storage = localStorage;
		} else if(embeddedservice_bootstrap.isSessionStorageAvailable) {
			storage = sessionStorage;
		} else {
			// Do nothing if storage is not available.
			return;
		}

		storage.setItem(embeddedservice_bootstrap.settings.orgId, jwt);
	}

	/**
	 * Remove the JWT from web storage.
	 */
	function cleanUpJWT() {
		let storage;

		if(embeddedservice_bootstrap.isLocalStorageAvailable) {
			storage = localStorage;
		} else if(embeddedservice_bootstrap.isSessionStorageAvailable) {
			storage = sessionStorage;
		} else {
			// Do nothing if storage is not available.
			return;
		}

		storage.removeItem(embeddedservice_bootstrap.settings.orgId);
	}

	/**
	 * Event handlers for resizing the iframe dynamically, based on size/state of the aura application.
	 */
	function addEventHandlers() {
		window.addEventListener("message", (e) => {
			if(e && e.data && e.origin) {
				if(e.origin === "null" ||
						(getSiteUrl().indexOf(e.origin) === 0
						 && isMessageFromSalesforceDomain(e.origin))) {
					let frame = document.getElementById(IFRAME_NAME);

					// TODO: Confirm event names with product.
					switch(e.data.method) {
						case APP_REQUEST_CONFIG_SERVICE_DATA_EVENT_NAME:
							/**
							 * Send Config Settings to container along with Labels and Jwt.
							 * Labels and Jwt are not stored on Config Settings object.
							 */
							sendPostMessageToIframeWindow(APP_RECEIVE_CONFIG_SERVICE_DATA_EVENT_NAME,
								Object.assign({}, embeddedservice_bootstrap.settings.embeddedServiceConfig, {
									jwt: getJwtIfExists(),
									...(embeddedservice_bootstrap.settings.standardLabels && {standardLabels: embeddedservice_bootstrap.settings.standardLabels}),
									...(embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels && {customLabels: embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels})
								}));
							break;
						case APP_LOADED_EVENT_NAME:
							//handleAfterAppLoad();
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
							cleanUpJWT();
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
	 * Validate all the attributes on the settings object required for bootstrap initialization and for making a request to InApp Config Service.
	 */
	function validateInitParams() {
		if(typeof embeddedservice_bootstrap.settings.baseCoreURL !== "string" || !embeddedservice_bootstrap.settings.baseCoreURL.length) throw new Error(`Expected a valid Base core URL value to be a string but received: ${embeddedservice_bootstrap.settings.baseCoreURL}.`);
		if(typeof embeddedservice_bootstrap.settings.scrt2URL !== "string" || !embeddedservice_bootstrap.settings.scrt2URL.length) throw new Error(`Expected a valid SCRT 2.0 URL value to be a string but received: ${embeddedservice_bootstrap.settings.scrt2URL}.`);
		if(!embeddedservice_bootstrap.settings.orgId || !embeddedservice_bootstrap.isOrganizationId(embeddedservice_bootstrap.settings.orgId)) throw new Error("Invalid OrganizationId Parameter Value: " + embeddedservice_bootstrap.settings.orgId);
		if(typeof embeddedservice_bootstrap.settings.eswConfigDevName !== "string" || !embeddedservice_bootstrap.settings.eswConfigDevName.length) throw new Error(`Expected a valid ESW Config Dev Name value to be a string but received: ${embeddedservice_bootstrap.settings.eswConfigDevName}.`);
	}

	/**
	 * Validate all the necessary attributes on the settings object after making a request to InApp Config Service.
	 */
	function validateSettings() {
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig) throw new Error("Embedded Service Config Settings not present");
		if(typeof getSiteUrl() !== "string") throw new Error(`Expected Site URL value to be a string but received: ${getSiteUrl()}.`);
	}

	/**
	 * Load the bootstrap.css file for this static file.
	 */
	function loadCSS(urlToLoadFrom) {
		return new Promise((resolve, reject) => {
			let link = document.createElement("link");

			let baseURL = urlToLoadFrom ? urlToLoadFrom : GSLB_BASE_URL;

			link.href = baseURL + "/embeddedservice/asyncclient/bootstrap" + (embeddedservice_bootstrap.settings.devMode ? "" : ".min") + ".css";
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
	function getSiteUrl() {
		let siteUrl = undefined;

		try {
			//siteUrl = embeddedservice_bootstrap.settings.embeddedServiceConfig.siteUrl;
      			siteUrl = "https://inapp-es-community-17ca5266dfa.test1.pc-rnd.force.com/eswlwr2/s/";
    } catch(err) {
			error("Error getting Site URL: " + err);
		}

		return siteUrl;
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
	 * Returns the color to be updated for FAB, to match the color of Chat Header.
	 */
	function getFABColorToUpdateAfterAppLoad() {
		for (const brandingToken of embeddedservice_bootstrap.brandingData) {
			if (brandingToken.n && brandingToken.n === "headerColor") {
				return brandingToken.v ? brandingToken.v : BRANDING_DEFAULTS.headerColor;
			}
		}
		return BRANDING_DEFAULTS.headerColor;
	}

	/**
	 * Set loading status for the button after clicking on it. This is to show the loading status of creating an iframe which would load an aura application.
	 */
	function setLoadingStatusForButton() {
		let button = document.getElementById(CONVERSATION_BUTTON_CLASS);
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
	 * Apply styles to iframe depending on current browser client.
	 * @param {Object} frame - Reference to iframe DOM element.
	 */
	function applyDynamicStylesToIframe(frame) {
		let branding = embeddedservice_bootstrap.brandingData || {};

		// Assign different width/height for mobile clients. 64.0625em is the equivalent of @media t(mqLarge) in Aura.
		if(isDesktop() === false && window.matchMedia("(max-width: 64.0625em)").matches) {
			frame.style.height = DEFAULT_HEIGHT_MOBILE;
			frame.style.width = DEFAULT_WIDTH_MOBILE;
		} else {
			// Desktop clients.
			frame.style.height = (branding.height || DEFAULT_HEIGHT) + "px";
			frame.style.width = (branding.width || DEFAULT_WIDTH) + "px";
		}
	}

	/**
	 * Send a post message to the iframe window.
	 * @param {String} method - Name of method.
	 * @param {Object} data - Data to send with message. Only included in post message if data is defined.
	 */
	function sendPostMessageToIframeWindow(method, data) {
		const iframe = document.getElementById(IFRAME_NAME);

		if(typeof method !== "string") {
			throw new Error(`Expected a string to use as message param in post message, instead received ${method}.`);
		}

		if(iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(
				{
					method,
					...data && { data }
				},
				getSiteUrl()
			);
		} else {
			warning(`Embedded Messaging iframe not available for post message with method ${method}.`);
		}
	}

	/**
	 * If a JWT exists in first party web storage, get it.
	 * @returns {String} JWT - JWT or undefined.
	 */
	function getJwtIfExists() {
		const orgId = embeddedservice_bootstrap.settings.orgId;

		if(embeddedservice_bootstrap.isLocalStorageAvailable && localStorage.getItem(orgId)) {
			return localStorage.getItem(orgId);
		} else if(embeddedservice_bootstrap.isSessionStorageAvailable && sessionStorage.getItem(orgId)) {
			return sessionStorage.getItem(orgId);
		}

		return undefined;
	}

	/**
	 * On click of Conversation button,
	 * (i) Create an iframe and set source as the aura application, loaded through the experienceSiteEndpointURL.
	 *		Wrap iframe in 2 divs to allow scrolling/responsiveness in iframe without viewport on page header
	 * (ii) Append iframe to the DOM of the container page.
	 * (iii) Hide the Conversation button once iframe is loaded.
	 */
	function createIframe() {
		try {
			const iframe = document.createElement("iframe");

			iframe.src = getSiteUrl();// + "/embeddedService/embeddedService.app";

			iframe.title = "Chat with an Agent";
			iframe.className = IFRAME_NAME;
			iframe.id = IFRAME_NAME;
			iframe.style.backgroundColor = "transparent";
			iframe.allowTransparency = "true";
			// TODO: remove allow-same-origin when Aura/LWR allows
			// Add allow-modals to throw alert for unauthenticated user losing session.
			iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups";
			iframe.onload = () => {
				log("Created an iframe to load the aura application.");
				handleAfterAppLoad();
			};

			// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				iframe.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
				iframe.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
			}

			document.body.appendChild(iframe);
		} catch(e) {
			throw new Error(e);
		}
	}

	/**
	 * On clicking the button, create an iframe with a site endpoint as experienceSiteEndpointURL along with passing necessary config values as query params.
	 */
	function handleClick() {
		let button = document.getElementById(CONVERSATION_BUTTON_CLASS);

		// eslint-disable-next-line no-negated-condition
		if(!button.classList.contains(CONVERSATION_BUTTON_LOADED_CLASS)) {
			setLoadingStatusForButton();

			try {
				createIframe();
			} catch(err) {
				error(err);
			}
		} else {
			let iFrame = document.getElementById(IFRAME_NAME);

			if(iFrame) {
				// Minimize the chat if it is already maximized.
				iFrame.classList.remove(IFRAME_ROUNDED_CLASS);
				iFrame.classList.add(IFRAME_NO_SHADOW_CLASS);
				sendPostMessageToIframeWindow(APP_MINIMIZE_EVENT_NAME);
			} else {
				error("Failed to locate the iframe/chat widget");
			}
		}
	}

	/**
	 * If Web Storage is available, check if there's an existing session to show.
	 */
	function bootstrapIfSessionExists() {
		if(getJwtIfExists()) {
			handleClick();
		}
	}

	/**
	 * Handle updates to FAB and Iframe after app loaded event is received from container.
	 */
	function handleAfterAppLoad() {
		let button = document.getElementById(CONVERSATION_BUTTON_CLASS);
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.getElementById("embeddedMessagingLoadingSpinner");
		let iframe = document.getElementById(IFRAME_NAME);

		if(!iframe) {
			warning("Embedded Messaging iframe not available for post-app-load updates.");
		} else {
			embeddedservice_bootstrap.maximizeIframe(iframe);
			// Unhide iframe.
			iframe.style.display = "inline-block";
		}

		if(!button) {
			warning("Embedded Messaging static button not available for post-app-load updates.");
		} else {
			// Reset the Conversation button once the aura application is loaded in the iframe. Ifame/Chat window is rendered on top of FAB.
			iconContainer.removeChild(loadingSpinner);
			chatIcon.style.display = "block";
			button.disabled = false;
			button.classList.remove(CONVERSATION_BUTTON_LOADING_CLASS);
			button.classList.add(CONVERSATION_BUTTON_LOADED_CLASS);
			button.classList.add("no-hover");
		}
	}

	/**
	 * Handles cleanup after closing the client (once the conversation is closed). This resets the client to its initial state (State Zero).
	 */
	function handleResetClientToInitialState() {
		const iframe = document.getElementById(IFRAME_NAME);
		const button = document.getElementById(CONVERSATION_BUTTON_CLASS);

		try {
			// Clear existing JWT created for the previous conversation.
			cleanUpJWT();
		} catch(err) {
			error("Error on clearing web storage for the previously ended conversation: " + err);
		}

		if(iframe) {
			// Remove the iframe from DOM. This should take care of clearing Conversation Entries as well.
			iframe.parentNode.removeChild(iframe);
		} else {
			throw new Error("Embedded Messaging iframe not available for resetting the client to initial state.");
		}

		if(button) {
			button.classList.remove(CONVERSATION_BUTTON_LOADED_CLASS);
			button.classList.remove("no-hover");
		} else {
			warning("Embedded Messaging static button not available for resetting the client to initial state.");
		}
	}

	/**
	 * Show a button when the container page is loaded.
	 */
	EmbeddedServiceBootstrap.prototype.showConversationButton = function showConversationButton() {
		let conversationButtonWrapper = document.createElement("div");
		let conversationButton = document.createElement("button");
		let iconContainer = document.createElement("div");
		let iconElement;

		conversationButtonWrapper.className = CONVERSATION_BUTTON_WRAPPER_CLASS;
		conversationButton.classList.add(CONVERSATION_BUTTON_CLASS, CONVERSATION_BUTTON_POSITION_CLASS);
		conversationButton.id = CONVERSATION_BUTTON_CLASS;
		conversationButton.href = "javascript:void(0)";
		// Update the color of FAB to match the color of Chat Header i.e. --headerColor branding token from setup.
		conversationButton.style.backgroundColor = getFABColorToUpdateAfterAppLoad();

		// Adjust button height if browser has bottom tab bar.
		if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
			conversationButton.classList.add(CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS);
		}

		// Click event handler for the conversation button.
		conversationButton.addEventListener("click", (e) => handleClick());

		iconElement = renderSVG(DEFAULT_ICONS.CHAT);
		iconElement.setAttribute("id", EMBEDDED_MESSAGING_ICON_CHAT);
		iconElement.setAttribute("class", EMBEDDED_MESSAGING_ICON_CHAT);

		iconContainer.className = EMBEDDED_MESSAGING_ICON_CONTAINER;
		iconContainer.id = EMBEDDED_MESSAGING_ICON_CONTAINER;

		iconContainer.appendChild(iconElement);
		conversationButton.appendChild(iconContainer);
		conversationButtonWrapper.appendChild(conversationButton);
		document.body.appendChild(conversationButtonWrapper);
	};

	/**
	 * Maximize the iframe which holds the aura application. Use branding width/height if screen is
	 * big enough, else just fill what we have.
	 * @param {Object} iframe - Reference to iframe DOM element.
	 */
	EmbeddedServiceBootstrap.prototype.maximizeIframe = function maximizeIframe(frame) {
		let button = document.getElementById(CONVERSATION_BUTTON_CLASS);

		// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
		if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
			frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
			frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
		}

		applyDynamicStylesToIframe(frame);
		frame.classList.remove(CONVERSATION_BUTTON_POSITION_CLASS);
		frame.classList.remove(IFRAME_ROUNDED_CLASS);
		frame.classList.remove(IFRAME_NO_SHADOW_CLASS);
		button.style.display = "block";
	};

	/**
	 * Resize iframe to fit over button dimensions
	 */
	EmbeddedServiceBootstrap.prototype.minimizeIframe = function minimizeIframe(frame, data) {
		const button = document.getElementById(CONVERSATION_BUTTON_CLASS);
		const height = data.height;
		const width = data.width;

		if(height === width) {
			frame.classList.add(IFRAME_ROUNDED_CLASS);
		}

		// Adjust iframe distance from bottom to minimized position if browser has bottom tab bar.
		if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
			frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
			frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
		}

		frame.style.height = height;
		frame.style.width = width;
		frame.classList.add(IFRAME_NO_SHADOW_CLASS);
		frame.classList.add(CONVERSATION_BUTTON_POSITION_CLASS);
		// Hide the default FAB when chat client is minimized so that only the minimized FAB is shown.
		button.style.display = "none";
	};

	/**
	 * Validate settings and begin the process of rendering DOM elements.
	 *
	 * @param {string} orgId - the entity ID for the organization.
	 * @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	 * @param {string} baseCoreURL - the base URL for the core (non-experience site) instance for the org.
	 * @param {object} snippetConfig - configuration on container page. Takes preference over server-side configuration.
	 */
	EmbeddedServiceBootstrap.prototype.init = function init(orgId, eswConfigDevName, baseCoreURL, snippetConfig) {
		try {
			embeddedservice_bootstrap.settings.orgId = orgId;
			embeddedservice_bootstrap.settings.eswConfigDevName = eswConfigDevName;
			embeddedservice_bootstrap.settings.baseCoreURL = baseCoreURL;
			embeddedservice_bootstrap.settings.snippetConfig = snippetConfig;

			mergeSettings(snippetConfig || {});

			validateInitParams();

			detectWebStorageAvailability();

			checkForNativeFunctionOverrides();

			if(!document.body) throw new Error("Document body not loaded.");

			addEventHandlers();

			// Check to see whether browser has bottom tab bar.
			embeddedservice_bootstrap.settings.hasBottomTabBar = isUseriOS15plusSafari();

			// Load css file for bootstrap.js.
			const cssPromise = loadCSS().then(
				Promise.resolve.bind(Promise),
				() => {
					// Retry loading .css from baseCoreURL, if failed to load from GSLB_BASE_URL.
					return loadCSS(embeddedservice_bootstrap.settings.baseCoreURL);
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
					// Temporary snippet setting to enable beta features. Remove the setting and related code in W-9361073.
					embeddedservice_bootstrap.settings.embeddedServiceConfig.betaMode = Boolean(embeddedservice_bootstrap.settings.betaMode);
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
				validateSettings();
				embeddedservice_bootstrap.showConversationButton();

				// Check if there's an existing session to show.
				bootstrapIfSessionExists();
			});
		} catch(err) {
			error("Error: " + err);
		}
	};

	window.embeddedservice_bootstrap = new EmbeddedServiceBootstrap();
})();
