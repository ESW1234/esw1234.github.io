/*
 * Copyright, 2019, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 *
 * TO MINIFY:	Use Google Closure Compiler:
 *					google-closure-compiler --js=common.js --js_output_file=common.min.js --rewrite_polyfills=false
 *
 *				Install google-closure-compiler by running:
 *					npm install -g google-closure-compiler
 */
(function() {
	/**
	 * Constants for CookieUtils class.
	 */
	const CONSENT_COOKIE_NAME = "CookieConsent";
	const CONSENT_ENABLEMENT_COOKIE_NAME = "CookieConsentPolicy";
	const CONSENT_COOKIE_SPLITTER = "|";

	/**
	 * Common utilities used by Embedded Services. Functions are exposed in window.embedded_svc.utils.
	 *
	 * @class
	  * @property {object} eventHandlers - Callbacks for events fired by Embedded Services.
	  */
	function Utils() {
		this.eventHandlers = {};
	}

	/**
	 * Check which operating system the end user is on, based on information in the navigator.
	 *
	 * @returns {String} - Returns the end user's operating system, or "" (empty string) if the OS is not properly detected.
	 */
	Utils.prototype.getOS = function getOS() {
		const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
		const windowsPlatforms = ["Win32", "Win64", "Win16", "Windows", "WinCE"];
		const iosPlatforms = ["iPhone", "iPad", "iPod"];

		var platform = navigator.platform;
		// Defaults to empty string if the browser declines to (or is unable to) identify the platform.
		var os = "";

		// OS values are tied to enums in OperatingSystemType.java
		if(platform) {
			if(macosPlatforms.indexOf(platform) !== -1) {
				os = "Mac";
			} else if(iosPlatforms.indexOf(platform) !== -1) {
				os = "IOS";
			} else if(windowsPlatforms.indexOf(platform) !== -1) {
				os = "Windows";
			} else if(/Linux/.test(platform) || /Android/.test(platform)) {
				os = "Linux";
			} else if(!os) {
				os = "OtherOS";
			}
		}

		return os;
	};

	/**
	 * Check if we are on a Desktop (non-mobile) based on information in the user agent.
	 * Browsers on tablets behave the same as mobile devices.
	 *
	 * This function was copied directly from esw.js.
	 *
	 * @returns {boolean} - return true if we are on a Desktop (non mobile) and false if we are on a mobile device.
	 */
	Utils.prototype.isDesktop = function isDesktop() {
		return navigator.userAgent.indexOf("Mobi") === -1;
	};

	/**
	 * Output to the console using a specified method.
	 *
	 * @param {string} method - The console method to use.
	 * @param {Array.<*>} args - Objects to be displayed comma-delimited.
	 */
	Utils.prototype.outputToConsole = function outputToConsole(method, args) {
		var isDevModeEnabled = embedded_svc.settings && embedded_svc.settings.devMode || embedded_svc.menu && embedded_svc.menu.settings.devMode;

		if(isDevModeEnabled && console && console[method]) { // eslint-disable-line no-console
			console[method]("[Embedded-Service] " + (Array.isArray(args) ? args.join(", ") : args)); // eslint-disable-line no-console
		}
	};

	/**
	 * Log a message to the console.
	 *
	 * @param {...object} messages - Objects to be displayed comma-delimited.
	 */
	Utils.prototype.log = function log() {
		this.outputToConsole("log", [].slice.apply(arguments));
	};

	/**
	 * Log an error, and fire an event so that features can react accordingly.
	 *
	 * @param {string} message - The error message to print.
	 */
	Utils.prototype.error = function error(message) {
		if(message) {
			this.outputToConsole("error", message);
		} else {
			this.outputToConsole("error", "unspecified error.");
		}
		// TODO W-6364239: Add this code back in.
		// this.fireEvent("error");
	};

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The warning message to print.
	 */
	Utils.prototype.warning = function warning(message) {
		if(message) {
			this.outputToConsole("warn", "Warning: " + message);
		} else {
			this.outputToConsole("warn", "anonymous warning.");
		}
	};

	/**
	 * Display a deprecation warning in the console for a method.
	 *
	 * @param {String} method - The name of the method to flag as deprecated.
	 * @param {String} snippetVersion - Snippet version to be used for deprecation warning
	 */
	Utils.prototype.deprecated = function deprecated(method, snippetVersion) {
		this.warning(
			method + " is deprecated in version " + Number(snippetVersion).toFixed(1) +
			" and will be removed in version " + (Number(snippetVersion) + 1).toFixed(1)
		);
	};
	/* Determines if a string is a valid Salesforce organization ID.
	 *
	 * @param {string} entityId - An entity ID.
	 * @returns {boolean} Is the string an organization ID?
	 */
	Utils.prototype.isOrganizationId = function isOrganizationId(entityId) {
		return this.getKeyPrefix(entityId) === "00D";
	};

	/**
	 * Extract the entity key prefix from a valid entity ID.
	 *
	 * @param {string} entityId = The string from which to extract the entity ID.
	 * @returns {?string} The key prefix, if this ID is valid.
	 */
	Utils.prototype.getKeyPrefix = function getKeyPrefix(entityId) {
		if(this.isValidEntityId(entityId)) return entityId.substr(0, 3);

		return undefined;
	};

	/**
	 * Determine if a string is a valid Salesforce entity ID.
	 *
	 * @param {string} entityId - The value that should be checked.
	 * @returns {boolean} Is this a valid entity Id?
	 */
	Utils.prototype.isValidEntityId = function isValidEntityId(entityId) {
		return (
			typeof entityId === "string" &&
		(entityId.length === 18 || entityId.length === 15)
		);
	};

	/**
	 * Add a handler for an event fired by the Snapins object.
	 *
	 * @param {string} event - The name of the event for which to listen.
	 * @param {function} handler - A callback function fired when the event occurs.
	 */
	Utils.prototype.addEventHandler = function addEventHandler(event, handler) {
		var lowerCaseEventName = event.toLowerCase();

		if(!this.eventHandlers[lowerCaseEventName]) {
			this.eventHandlers[lowerCaseEventName] = [];
		}

		this.eventHandlers[lowerCaseEventName].push(handler);
	};

	/**
	 * Fire an event to be consumed by Embedded Services and any other observers that added handlers.
	 *
	 * @param {string} name - The name of the event to fire.
	 * @param {function(Array.<*>)} [reduceFunction] - A function which takes an array of the return values of each event
	 *                                                 handler and reduces them to the return value of this function.
	 * @param {Array.<*>} eventHandlerArgs - Params passed through to the eventHandlers.
	 * @returns {*} The value returned by the reduce function or `true`.
	 */
	Utils.prototype.fireEvent = function fireEvent(name, reduceFunction, eventHandlerArgs) {
		var handlers = this.eventHandlers[name.toLowerCase()];
		var responses = [];
		var eventHandlerArgsArray = eventHandlerArgs;

		// Ensure that eventHandlerArgs is an array.
		if(eventHandlerArgs && !(eventHandlerArgs instanceof Array)) {
			eventHandlerArgsArray = [eventHandlerArgs];
		}

		// Save all the return values of each handler for use with the passed in reduceFunction.
		if(handlers) {
			handlers.forEach(function(handler) {
				// The function apply requires the parameter passed in to be an array.
				responses.push(handler.apply(undefined, eventHandlerArgsArray));
			});
		}

		if(reduceFunction) {
			return reduceFunction(responses);
		}

		return true;
	};

	/**
	 * Checks if we're currently in a Experience Cloud Site (formerly Community) or Salesforce Site context.
	 *
	 * @returns {boolean} Is this an Experience cloud site or Salesforce Site context?
	 */
	Utils.prototype.isCommunityOrSite = function() {
		return window.$A && typeof window.$A.get === "function" && window.$A.get("$Site");
	};

	/**
	 * Load a script from a specified URL.
	 *
	 * @param {String} url - The URL string with the script to load.
	 * @param {Function} onScriptLoad - Function to call when the script is loaded.
	 * @param {Function} onScriptError - Function to call when an error is encountered while loading script.
	 * @param {String} elementId - The ID of the script tag element.
	 */
	Utils.prototype.loadScriptFromUrl = function(url, onScriptLoad, onScriptError, elementId) {
		var scriptElem = document.createElement("script");

		if(elementId) scriptElem.id = elementId;
		scriptElem.type = "text/javascript";
		if(onScriptLoad) scriptElem.onload = onScriptLoad;
		if(onScriptError) scriptElem.onerror = onScriptError;
		scriptElem.src = url;

		document.body.appendChild(scriptElem);
	};

	/**
	 * Generate the absolute resource URL from the partial URL supplied as an argument.
	 *
	 * @param {String} baseURL - The base URL for the static resource file.
	 * @param {String} partialURL - The partial URL with the static resource file
	 * @returns {String} the absolute URL of the static resource file.
	 */
	Utils.prototype.generateResourceUrl = function(baseURL, partialURL) {
		return baseURL + "/resource/" + partialURL;
	};

	/**
	 * Check whether the following conditions are met for customizations to be processed:
	 * 1) customizations that are associated to the deployment exist
	 * 2) pageName is properly configured as a string
	 * 3) pageName matches some customization in the response
	 *
	 * @param {String} response - The SCRT response configuration object.
	 * @param {String} pageName - The name of the customization object to be selected.
	 * @returns {Boolean} true if matching customization found for pageName; false otherwise.
	 */
	Utils.prototype.isMatchingCustomizationFound = function(response, pageName) {
		var match = false;

		// Check whether customizations object and pageName are properly configured.
		if(response.customizations && Array.isArray(response.customizations) && pageName && typeof pageName === "string") {
			// Check for matching customization.
			match = response.customizations.some(function(customization) {
				return customization && customization.hasOwnProperty("name") ?
					customization.name === pageName :
					false;
			});

			// Log to console if no matching customization found.
			if(!match) embedded_svc.utils.log("No customizations with code settings name " + pageName + " found.");
		}

		return match;
	};

	/**
	 * Process snippet settings from the SCRT server response.
	 * This method provides some rudimentary null checks but should be called in conjunction with isMatchingCustomizationFound()
	 * for more rigorous error checking.
	 *
	 * @param {String} pageName - The page name of the customization object.
	 * @param {String} response - The response JSON object from SCRT.
	 * @param {Object} resourceHandlers - The dictionary containing resource handler methods for resource types.
	 */
	Utils.prototype.processCustomizations = function(pageName, response, resourceHandlers) {
		var customizations;
		var matchedCustomization;
		var resourceHandler;

		// Filter for customization with page name.
		customizations = response.customizations.filter(function(customization) {
			return customization.name === pageName;
		});
		matchedCustomization = customizations.length > 0 ? customizations[0] : null;

		// Process static resources on the customization object.
		if(matchedCustomization && matchedCustomization.hasOwnProperty("resources") &&
			Array.isArray(matchedCustomization.resources) && matchedCustomization.resources.length > 0) {
			matchedCustomization.resources.forEach(function(resource) {
				if(resource && resource.hasOwnProperty("type") && resource.type && resourceHandlers.hasOwnProperty(resource.type) &&
					typeof resourceHandlers[resource.type] === "function") {
					// Get static resource handler method for resource type.
					resourceHandler = resourceHandlers[resource.type];

					// Apply static resource handler method to resource.
					resourceHandler(resource);
				}
			});
		}
	};

	/**
	 * Get the site endpoint for loading static resources from the SCRT response.
	 *
	 * @param configurationSettings - the configuration settings object containing the siteUrl.
	 * @returns {String} the site endpoint for loading static resources.
	 */
	Utils.prototype.getSiteEndpointUrl = function getSiteEndpointUrl(configurationSettings) {
		// Return the siteUrl if it exists on the configuration settings object.
		return configurationSettings.siteUrl ? configurationSettings.siteUrl : null;
	};

	/**
	 * Determines whether the user is on an iOS 15+ Safari browser.
	 *
	 * This is what navigator.userAgent returns for iOS Safari:
	 * 1) Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1
	 * 2) Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit / 605.1.15 (KHTML, like Gecko) Mobile / 15E148
	 *
	 * @return {boolean} Is the user agent on iOS 15+ Safari?
	 */
	Utils.prototype.isUseriOS15plusSafari = function isUseriOS15plusSafari() {
		var iOS = Boolean(navigator.userAgent.match(/iP(hone|ad|od)/i));
		var versionMatchArray = navigator.userAgent.match(/(?!=OS)(([0-9]){2})/i);
		var version = versionMatchArray && versionMatchArray.length > 0 ? Number(versionMatchArray[0]) : -1;
		var safari = Boolean(navigator.userAgent.match(/WebKit/i)) &&
			!Boolean(navigator.userAgent.match(/CriOS/i));

		return iOS && safari && version >= 15;
	};

	/**
	 * Get the hostname of a given URL. IE11 does not support the
	 * URL constructor, in this case manually get hostname.
	 *
	 * @param {String} url - URL to get hostname of.
	 * @returns String hostname.
	 */
	 Utils.prototype.getHostnameFromUrl = function getHostnameFromUrl(url) {
		var hostname = undefined;

		if (typeof url === "string") {
			// Find and remove protocol (http, ftp, etc.) and get hostname
			if(window.URL && typeof window.URL === "function") {
				hostname = new URL(url).hostname;
			} else {
				// Fallback for IE11
				if(url.indexOf("//") > -1) {
					hostname = url.split("/")[2];
				} else {
					hostname = url.split("/")[0];
				}

				// Find and remove port number
				hostname = hostname.split(":")[0];
				// Find and remove "?"
				hostname = hostname.split("?")[0];
			}
		}

		return hostname;
	};

	/**
	 * Check if provided URL has "http:" or "https:" protocol.
	 * @param {String} url - URL to check protocol of.
	 * @returns {Boolean} true if provided URL has "http:"" or "https:"" protocol.
	 */
	Utils.prototype.isProtocolHttpOrHttps = function isProtocolHttpOrHttps(url) {
		var protocol;

		try {
			if(window.URL && typeof window.URL === "function") {
				protocol = new URL(url).protocol;
			} else {
				// Fallback for IE11
				protocol = url.split("/")[0];
			}

			return protocol && typeof protocol === "string" ? (protocol.substring(0, "http:".length) === "http:" || protocol.substring(0, "https:".length) === "https:") : false;
		} catch (error) {
			return false;
		}
	};

	/**
	 * Util class for cookie validation and handling.
	 * Relevant methods are ported over from Sfdc.Cookie library to satisfy
	 * the Salesforce Platform Cookie Consent (ePrivacy) Mandate.
	 * Methods are exposed in embeddod_svc.utils.cookie.<methodName>.
	 *
	 * @constructor Creates an instance of CookieUtils class.
	 */
	function CookieUtils() { }

	/**
	 * Imported from Sfdc.Cookie.getCookie
	 *
	 * Gets the value from the cookie.
	 * @param {String} name The key of the value stored in the cookie.
	 * @example
	 * // Get the decoded value that was encoded on the way in.
	 * embedded_svc.utils.getCookie("lastLoggedInDate");
	 *
	 * // Get raw sid value from the cookie.
	 * embedded_svc.utils.getCookie("sid", function(rawValue) { return rawValue; });
	 * @param {Function} [unescapeCookieVal="decodeURIComponent"] Function used to unescape the cookie value. Defaults to decodeURIComponent, but you could also supply window.unescape() or window.decodeURI(). Supplying a blank function would result in the returing of the raw value.
	 */
	CookieUtils.prototype.getCookie = function getCookie(name, unescapeCookieVal) {
		unescapeCookieVal = unescapeCookieVal || decodeURIComponent;
		var dc = document.cookie;
		var prefix = name + '=';
		var begin = dc.indexOf('; ' + prefix);
		if (begin === -1) {
			begin = dc.indexOf(prefix);
			if (begin !== 0) {
				return null;
			}
		} else {
			begin += 2;
		}
		var end = document.cookie.indexOf(';', begin);
		if (end === -1) {
			end = dc.length;
		}
		return unescapeCookieVal(dc.substring(begin + prefix.length, end));
	};

	/**
	 * Imported from Sfdc.Cookie.isCategoryAllowedForCurrentConsent
	 *
	 * @description Return true if the category is allowed and false if it is not
	 * The consent is determined by parsing the current consent state of CookieConsent cookie
	 * @param {String} categoryName - the category of the cookie.
	 * @returns Boolean
	 */
	CookieUtils.prototype.isCategoryAllowedForCurrentConsent = function isCategoryAllowedForCurrentConsent(categoryName) {
		if(Number(this.getCategoryIndex(categoryName)) === 1) {
			return true;
		}
		var cookieValForEnablement = this.getCookie(CONSENT_ENABLEMENT_COOKIE_NAME);
		if(cookieValForEnablement == null) {
			return true;
		}
		var cookieValForCookieConsent = this.getCookie(CONSENT_COOKIE_NAME);
		var enablementParts = cookieValForEnablement.split(":");
		var isSiteOptionEnabled = Boolean(Number(enablementParts[0]));

		if(isSiteOptionEnabled) {
			if(cookieValForCookieConsent == null) {
				return Number(this.getCategoryIndex(categoryName)) === 1;
			} else {
				return this.getConsentFromCookieConsentValue(cookieValForCookieConsent, categoryName);
			}
		} else {
			return true;
		}
	};

	/**
	 * Imported from Sfdc.Cookie.getCategoryIndex
	 *
	 * @description Get Category Index from categoryName (hardcoded currently based on defined categories)
	 * @param {String} categoryName - the category of the cookie.
	 * @returns String
	 */
	CookieUtils.prototype.getCategoryIndex = function getCategoryIndex(categoryName) {
		if(!categoryName || typeof categoryName !== "string") {
			return "-1";
		}

		switch(categoryName.toLowerCase()) {
			case "essential":
				return "1";
			case "preferences":
				return "2";
			case "statistics" :
				return "3";
			case "marketing":
				return "4";
			default :
				return "-1";
		}
	};

	/**
	 * Imported from Sfdc.Cookie.getConsentFromCookieConsentValue
	 *
	 * @description Get consent value from the cookie consent value.
	 * @param {String} categoryName - the category of the cookie.
	 * @returns String
	 */
	CookieUtils.prototype.getConsentFromCookieConsentValue = function getConsentFromCookieConsentValue(cookieValForCookieConsent, categoryName) {
		var cookieElements = this.getParsedCookieElementsCookieConsent(cookieValForCookieConsent);
		var cookieConsent;
		var categoryIndex;
		var consentValue;

		if(cookieElements[3] == null) {
			return false;
		}
		
		cookieConsent = cookieElements[3];
		categoryIndex = Number(this.getCategoryIndex(categoryName));
		consentValue = Number(cookieConsent.charAt(categoryIndex - 1));
		return consentValue === 1;
	};

	/**
	 * Imported from Sfdc.Cookie.getParsedCookieElementsCookieConsent
	 *
	 * @description Get parsed cookie elements from cookie value for cookie consent.
	 * @param {String} categoryName - the category of the cookie.
	 * @returns String
	 */
	CookieUtils.prototype.getParsedCookieElementsCookieConsent = function getParsedCookieElementsCookieConsent(cookieValForCookieConsent) {
		return cookieValForCookieConsent.split(CONSENT_COOKIE_SPLITTER);
	};

	Utils.prototype.cookie = new CookieUtils();

	window.embedded_svc.utils = new Utils();
})();
