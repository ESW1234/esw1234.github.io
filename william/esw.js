/*
 * Added 9/26/2019
 * Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * Version 5.0 - Added support for custom authentication.
 *
 * TO MINIFY: Use esw-check (https://git.soma.salesforce.com/embedded-service-for-web/esw-check):
 *            eswcheck main --notests --nolint --jsversion [current-version]
 *
 *            or
 *
 *            java -jar ~/yuicompressor-2.4.8.jar --preserve-semi --disable-optimizations esw.js -o esw.min.js
 *            Download yuicompressor here: https://github.com/yui/yuicompressor/releases
 */

(function(baseEmbeddedSvc) {
	var HELP_BUTTON_CLASS = "embeddedServiceHelpButton";
	var SIDEBAR_CLASS = ".embeddedServiceSidebar";
	var SALESFORCE_DOMAINS = [
		// Used by dev, blitz, and prod instances
		".salesforce.com",

		// Used by VPODs
		".force.com",

		// Used by autobuild VMs
		".sfdc.net"
	];

	// IDs of DOM elements we create/use
	var STORAGE_IFRAME_ID = "esw_storage_iframe";
	var INVITE_DOM_ID = "snapins_invite";
	var TARGET_DIV_ID = "esw-snapin-target";

	var SLDS_SCOPING_CLASS = "slds-scope";

	var SNIPPET_VERSION = "5.0";

	var LOGIN_ATTEMPT_INTERVAL = 100;

	var LOGIN_CALLBACK = "__snapinsLoginCallback";
	var LOGOUT_CALLBACK = "__snapinsLogoutCallback";

	// Storage keys
	var ESW_OAUTH_TOKEN_KEY = "ESW_OAUTH_TOKEN";
	var ESW_BODY_SCROLL_POSITION_KEY = "ESW_BODY_SCROLL_POSITION";
	var ESW_IS_MINIMIZED_KEY = "ESW_IS_MINIMIZED";
	var ESW_MINIMIZED_TEXT_KEY = "ESW_MINIMIZED_TEXT";
	var RTL_DIRECTION_ATTRIBUTE = 'dir="rtl"';

	/**
	 * ESW global object which creates and renders a sidebar.
	 *
	 * @class
	 * @property {object} settings - A list of settings that can be set within init or through embedded_svc.settings
	 * @property {object} auth - A list of authentication settings.
	 * @property {object} featureScripts - Feature scripts that have been loaded into the global object.
	 * @property {object} eventHandlers - Callbacks for certain events fired by the Snapins object.
	 * @property {object} messageHandlers - Callbacks for when certain messages are received from the storage iframe.
	 * @property {Array.<string>} storageKeys - Keys to retrieve from storage when the page is loaded.
	 * @property {object} defaultSettings - A map of setting items and their default values.
	 * @property {HTMLElement} eswFrame - A reference to the ESW iframe.
	 * @property {Object.<string, Array>} pendingMessages - A map of iframe messages that are waiting on a feature to load before being sent or processed.
	 * @property {Array.<string>} availableFeatures - A list of featuers that have been loaded.
	 * @property {Array.<string>} iframeScriptsToLoad - ESW script load requests that were made before the iframe was ready.
	 * @property {boolean} domInitInProgress - Is the help button currently getting appended to the DOM?
	 * @property {boolean} componentInitInProgress - Is the component currently getting initialized?
	 * @property {boolean} isIframeReady - Is the iframe ready to receive messages?
	 * @property {boolean} isButtonDisabled - Should the help button be clickable?
	 * @property {boolean} isAuthenticationRequired - Does the user have to login before the sidebar can load?
	 * @property {Object} loginPendingSerializedData - Serialized data as retrieved from the iframe to pass along to initialization after login.
	 * @property {Object} validLinkActions - A list of valid link actions; if the requested link action is not in this list, it will be ignored.
	 */
	function Snapins() {
		var isButtonDisabled = false;
		var oauthToken;

		this.settings = {
			appendHelpButton: true,
			displayHelpButton: true,
			isExternalPage: true,
			devMode: false,
			targetElement: document.body,
			elementForOnlineDisplay: undefined,
			elementForOfflineDisplay: undefined,
			defaultMinimizedText: "",
			disabledMinimizedText: "",
			defaultAssistiveText: "",
			loadingText: "Loading",
			showIcon: undefined,
			enabledFeatures: [],
			entryFeature: "FieldService",
			storageDomain: document.domain,
			language: undefined,
			linkAction: {
				feature: undefined,
				name: undefined,
				valid: false
			},
			linkActionParameters: {},
			useCustomAuthentication: false,
			allowGuestUsers: false,
			requireSLDS: false
		};

		this.auth = {};

		this.validLinkActions = {};

		this.isMasterAndHasSlaves = false;

		Object.defineProperty(this.auth, "oauthToken", {
			get: function() {
				return oauthToken;
			},
			set: function(value) {
				if(this.validateHeaderValue(value)) {
					oauthToken = value;
					if(value) {
						this.setSessionData(ESW_OAUTH_TOKEN_KEY, value);
						this.checkAuthentication();
					} else {
						this.deleteSessionData(ESW_OAUTH_TOKEN_KEY);
					}
				} else {
					this.error("\"" + value + "\" is not a valid OAuth token.");
				}
			}.bind(this)
		});

		this.featureScripts = {};
		this.eventHandlers = {};
		this.messageHandlers = {};
		this.storageKeys = [
			ESW_BODY_SCROLL_POSITION_KEY,
			ESW_IS_MINIMIZED_KEY,
			ESW_MINIMIZED_TEXT_KEY,
			ESW_OAUTH_TOKEN_KEY
		];
		this.defaultSettings = {};
		this.snippetSettingsFile = {};

		this.eswFrame = undefined;

		this.availableFeatures = ["script", "session"];

		this.outboundMessagesAwaitingIframeLoad = [];
		this.pendingMessages = {};

		this.iframeScriptsToLoad = [];

		this.domInitInProgress = false;
		this.componentInitInProgress = false;
		this.hasSessionDataLoaded = false;
		this.isIframeReady = false;

		this.isAuthenticationRequired = false;
		this.loginPendingSerializedData = undefined;

		Object.defineProperty(this, "isButtonDisabled", {
			get: function() { return isButtonDisabled; },
			set: function(value) {
				isButtonDisabled = value;
				this.onButtonStatusChange();
			}.bind(this),
			configurable: true
		});

		this.setupMessageListener();

		this.getLinkActionData();
	}

	/**
	 * In order to make session keys unique for communities, store the name of the community in this.settings.storageDomain.
	 *
	 * A few notes about communities:
	 * - All community URLs end in .force.com (with the exception of custom URLs, in which case this fix doesn't apply).
	 * - All communities for a specific org have the same document.domain.
	 * - Communities on the same domain are differentiated by the first part of their pathname (this is the community's name).
	 *
	 * This function appends the name of the community to this.settings.storageDomain to ensure that chats in
	 * the same browser session in different communities on the same org do not share information.
	 *
	 * Ex: https://www.communitySubdomain.com/communityName/pathToPage/...
	 * - To keep session keys unique, store '/communityName' in this.settings.storageDomain.
	 *
	 * We have documentation that says best practice is to not include a protocol or trailing slash in storageDomain.
	 * - https://developer.salesforce.com/docs/atlas.en-us.snapins_web_dev.meta/snapins_web_dev/snapins_web_set_domain.htm
	 */
	Snapins.prototype.adjustCommunityStorageDomain = function() {
		// Check if the URL ends in ".force.com" (IE11 does not support String.prototype.endsWith).
		if(this.isCommunityDomain(this.settings.storageDomain)) {
			// Add a "/" and the first pathname argument to the storage domain.
			this.settings.storageDomain = this.settings.storageDomain + "/" + window.location.pathname.split("/")[1];
		}
	};

	/**
	 * Load lightning out scripts from customer's Salesforce instance.
	 *
	 * Sample URL: https://gs0.salesforce.com/lightning/lightning.out.js
	 *
	 * Attributes parameter expected to contain:
	 * {String} baseCoreURL - URL path for organization's instance.
	 *
	 * If no attributes are passed, this function will use what is stored on embedded_svc.settings.
	 *
	 * @param {Object} attributes - Map of attributes for this function.
	 * @returns {Promise}
	 */
	Snapins.prototype.loadLightningOutScripts = function(attributes) {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			this.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					this.loadLightningOutScripts(attributes);
				}.bind(this),
				true
			);
		} else {
			return new Promise(function(resolve, reject) {
				var baseCoreURL;
				var lightningOutScript;

				try {
					baseCoreURL = attributes && attributes.baseCoreURL ? attributes.baseCoreURL : embedded_svc.settings.baseCoreURL;

					// Check if Lightning Out has already been loaded.
					if(window.$Lightning) {
						resolve("Lightning Out is already loaded on this page.");
					} else if(typeof $A !== "undefined" && $A.get("$Site")) {
						resolve("Communities context does not require Lightning Out to use Embedded Service.");
					} else if(baseCoreURL) {
						// Load Lightning Out.
						lightningOutScript = document.createElement("script");
						lightningOutScript.type = "text/javascript";
						lightningOutScript.src = baseCoreURL + "/lightning/lightning.out.js";
						lightningOutScript.onload = resolve.bind(this, "Lightning Out scripts loaded.");
						document.getElementsByTagName("head")[0].appendChild(lightningOutScript);
					}
				} catch(error) {
					reject(error);
				}
			});
		}
	};

	/**
	 * Make a call to $Lightning.use to instantiate the embeddedService:sidebarApp using Lightning Out.
	 * This will load all required Aura files, set the sidebarApp as the application context, and
	 * make the application request to core.
	 *
	 * Attributes parameter expected to contain:
	 * {String} communityEndpointURL - String representing community endpoint.
	 * {String} oauthToken - String token.
	 * {Object} paramsObj - Should contain a {String} "language" attribute.
	 *
	 * If no attributes are passed, this function will use what is stored on embedded_svc.settings.
	 *
	 * @param {Object} attributes - Map of attributes for this function.
	 * @returns {Promise}
	 */
	Snapins.prototype.instantiateLightningOutApplication = function(attributes) {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			this.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					this.instantiateLightningOutApplication(attributes);
				}.bind(this),
				true
			);
		} else {
			return new Promise(function(resolve, reject) {
				var communityEndpointURL;
				var oauthToken;
				var paramsObj;
		
				try {
					communityEndpointURL = attributes && attributes.communityEndpointURL ? attributes.communityEndpointURL : embedded_svc.settings.communityEndpointURL;
					oauthToken = attributes && attributes.oauthToken ? attributes.oauthToken : embedded_svc.settings.oauthToken;
					paramsObj = attributes && attributes.paramsObj ? attributes.paramsObj : embedded_svc.settings.language || undefined;

					if(typeof $A !== "undefined" && $A.get("$Site")) {
						resolve("Communities context already has an Aura context.");
					} else if(window.$Lightning) {
						$Lightning.use(
							"embeddedService:sidebarApp",
							resolve.bind(this, "Lightning Out application request complete."),
							communityEndpointURL,
							oauthToken,
							paramsObj
						);
					}
				} catch(error) {
					reject(error);
				}
			});
		}
	};

	/**
	 * Create the Embedded Service (Snap-ins) sidebar component on a given target HTML element.
	 * This requires Lightning Out to be loaded on the page, and $Lightning.use to have been called already.
	 *
	 * Attributes parameter expected to contain:
	 * {Object} attributes - To pass to the embeddedService:sidebar component.
	 * {HTML Element} locator - Reference to HTML element to append component to.
	 *
	 * If no attributes are passed, this function will use what is stored on embedded_svc.settings.
	 *
	 * @param {Object} attributes - Map of attributes for this function.
	 * @returns {Promise}
	 */
	Snapins.prototype.createEmbeddedServiceComponent = function(attributes) {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			this.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					this.createEmbeddedServiceComponent(attributes);
				}.bind(this),
				true
			);
		} else {
			return new Promise(function(resolve, reject) {
				var componentAttributes;
				var targetElement;
		
				try {
					componentAttributes = attributes && attributes.attributes ? attributes.attributes : { configurationData: embedded_svc.settings };
					targetElement = attributes && attributes.locator ? attributes.locator : embedded_svc.settings.targetElement;

					/**
					 * Merge settings, hide sidebar. Must be done before sidebar component is created because
					 * sidebar keeps track of its own configurationData (created from embedded_svc).
					 */
					embedded_svc.preparePageForSidebar();

					if(window.$Lightning && !document.querySelector(SIDEBAR_CLASS)) {
						// $Lightning.ready takes in a callback to be invoked when $Lightning.use has completed.
						$Lightning.ready(
							$Lightning.createComponent.bind(
								this,
								"embeddedService:sidebar",
								componentAttributes,
								targetElement,
								function(sidebarComponent, status, error) {
									if(status === "SUCCESS") {
										embedded_svc.addEventHandler(
											"afterInitialization",
											resolve.bind(this, "Embedded Service component created.")
										);
									} else {
										reject(error);
									}
								}
							)
						);
					} else if(typeof $A !== "undefined" && $A.get("$Site")) {
						// This event is handled in embeddedServiceChannelMenuController.js.
						window.dispatchEvent(new CustomEvent("embeddedServiceCreateSidebar", {
							detail: {
								componentAttributes: componentAttributes,
								resolve: resolve,
								reject: reject
							}
						}));
					} else {
						typeof window.$Lightning === "undefined" ?
							resolve("Lighning Out should be loaded on this page before creating the Embedded Service component.") :
							resolve("Embedded Service component already exists.");
					}
				} catch(error) {
					reject(error);
				}
			});
		}
	};

	/**
	 * Complete bootstrap process for the Embedded Service (Snap-ins) application.
	 *
	 * Here are the steps for this function and the optional attributes for each step:
	 *
	 * STEP 1: To load Lightning Out scripts:
	 * {String} baseCoreUrl - URL path for organization's instance.
	 *
	 * STEP 2: To instantiate Lightning Out application:
	 * {String} communityEndpointUrl - String representing community endpoint.
	 * {String} oauthToken - String token.
	 * {Object} paramsObj - Should contain a {String} "language" attribute.
	 *
	 * STEP 3: To create Embedded Service component:
	 * {Object} attributes - To pass to the embeddedService:sidebar component.
	 * {HTML Element} locator - Reference to HTML element to append component to.
	 *
	 * If no attributes are passed, this function will use what is stored on embedded_svc.settings.
	 *
	 * @param {Object} attributes - Map of attributes for this function.
	 * @returns {Promise}
	 */
	Snapins.prototype.bootstrapEmbeddedService = function(attributes) {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			this.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					this.bootstrapEmbeddedService(attributes);
				},
				true
			);
		} else {
			return new Promise(function(resolve, reject) {
				try {
					embedded_svc.loadLightningOutScripts(
						attributes
					).then(function() {
						embedded_svc.instantiateLightningOutApplication(
							attributes
						).then(function() {
							embedded_svc.createEmbeddedServiceComponent(
								attributes
							).then(function() {
								window.requestAnimationFrame(resolve.bind(this, "Embedded Service application and component bootstrapped."));
							});
						});
					});
				} catch(error) {
					reject(error);
				}
			});
		}
	};

	/**
	 * Return true if current browser is Internet Explorer.
	 *
	 * @return {boolean} True if client browser is Internet Explorer.
	 */
	Snapins.prototype.isInternetExplorer = function() {
		return "ActiveXObject" in window;
	};

	/**
	 * Output to the console using a specified method.
	 *
	 * @param {string} method - The console method to use.
	 * @param {Array.<*>} args - Objects to be displayed comma-delimited.
	 */
	Snapins.prototype.outputToConsole = function outputToConsole(method, args) {
		if(this.settings.devMode && console && console[method]) { // eslint-disable-line no-console
			console[method]("[Snap-ins] " + (Array.isArray(args) ? args.join(", ") : args)); // eslint-disable-line no-console
		}
	};

	/**
	 * Log a message to the console.
	 *
	 * @param {...object} messages - Objects to be displayed comma-delimited.
	 */
	Snapins.prototype.log = function log() {
		this.outputToConsole("log", [].slice.apply(arguments));
	};

	/**
	 * Log an error, and fire an event so that features can react accordingly.
	 *
	 * @param {string} message - The error message to print.
	 */
	Snapins.prototype.error = function error(message) {
		if(message) {
			this.outputToConsole("error", message);
		} else {
			this.outputToConsole("error", "esw responed with an unspecified error.");
		}
		this.fireEvent("error");
	};

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The warning message to print.
	 */
	Snapins.prototype.warning = function warning(message) {
		if(message) {
			this.outputToConsole("warn", "Warning: " + message);
		} else {
			this.outputToConsole("warn", "esw sent an anonymous warning.");
		}
	};

	/**
	 * Display a deprecation warning in the console for a method.
	 *
	 * @param {String} method - The name of the method to flag as deprecated.
	 */
	Snapins.prototype.deprecated = function deprecated(method) {
		this.warning(
			method + " is deprecated in version " + Number(SNIPPET_VERSION).toFixed(1) +
			" and will be removed in version " + (Number(SNIPPET_VERSION) + 1).toFixed(1)
		);
	};

	/**
	 * Retrieve a cookie from the browser.
	 * Adapted from Sfdc.Cookie.getLoginCookieValue
	 *
	 * @param {string} name - The name of the cookie to retrieve.
	 * @returns {?string} The value stored within the cookie.
	 */
	Snapins.prototype.getCookie = function getCookie(name) {
		var cookie = document.cookie;
		var index;
		var end;

		if(cookie) {
			index = cookie.indexOf(name + "=");
			if(index !== -1) {
				index += (name + "=").length;
				end = cookie.indexOf(";", index);

				if(end === -1) end = cookie.length;

				return cookie.substring(index, end);
			}
		}

		return undefined;
	};

	/**
	 * Set a cookie in the browser.
	 *
	 * @param {string} name - The name of the cookie.
	 * @param {string} value - The value to set in the cookie.
	 * @param {boolean} expires - Should the cookie expire?
	 */
	Snapins.prototype.setCookie = function setCookie(name, value, expires) {
		var cookie = name + "=" + value + ";";
		var expirationDate;

		if(expires) {
			expirationDate = new Date();
			expirationDate.setFullYear(expirationDate.getFullYear() + 10);
			cookie += "expires=" + expirationDate.toUTCString() + ";";
		}

		cookie += "path=/;";
		document.cookie = cookie;
	};

	/**
	 * Merge a key-value mapping into the setting object, such that the provided
	 * map takes priority.
	 *
	 * @param {object} settings - A key-value mapping.
	 */
	Snapins.prototype.mergeSettings = function mergeSettings(settings) {
		Object.keys(settings).forEach(function(key) {
			if(this.settings[key] === undefined) {
				this.settings[key] = settings[key];
			}
		}.bind(this));
	};

	/**
	 * Load the script belonging to a feature. If a callback is specified, it will be run
	 * after the script is loaded.
	 *
	 * The script file should be entirely lowercase, and end with ".esw.js" or ".esw.min.js".
	 *
	 * @param {string} featureName - The name of the feature to load.
	 * @param {function()} callback - A callback to fire once the script has loaded.
	 */
	Snapins.prototype.loadFeatureScript = function loadFeatureScript(featureName, callback) {
		var lowerCaseName = decodeURI(featureName).toLowerCase();

		if(featureName.indexOf("..") === -1) {
			this.loadScriptFromDirectory(
				"client",
				lowerCaseName + ".esw",
				function() {
					this.featureScripts[featureName](this);
					this.availableFeatures.push(lowerCaseName);

					this.fireEvent("featureLoaded", undefined, featureName);

					if(callback) callback();

					this.processPendingMessages(lowerCaseName);
				}.bind(this)
			);
		} else {
			this.error("\"" + featureName + "\" is not a valid feature name.");
		}
	};

	/**
	 * Fire an event so that it can be consumed by feature scripts.
	 *
	 * @param {string} name - The name of the event to fire.
	 * @param {function(Array.<*>)} [reduceFunction] - A function which takes an array of the return values of each event
	 *                                                 handler and reduces them to the return value of this function.
	 * @param {...object} eventHandlerArgs - Params passed through to the eventHandlers.
	 * @returns {*} The value returned by the reduce function or `true`.
	 */
	Snapins.prototype.fireEvent = function fireEvent(name, reduceFunction) {
		var handlers = this.eventHandlers[name.toLowerCase()];
		var args = [].slice.apply(arguments).slice(2);
		var responses = [];

		if(handlers) {
			handlers.forEach(function(handler) {
				responses.push(handler.apply(undefined, args));
			});
		}

		if(reduceFunction) {
			return reduceFunction(responses);
		}

		return true;
	};

	/**
	 * Determine if a string is a valid Salesforce entity ID.
	 *
	 * @param {string} entityId - The value that should be checked.
	 * @returns {boolean} Is this a valid entity Id?
	 */
	Snapins.prototype.isValidEntityId = function isValidEntityId(entityId) {
		return typeof entityId === "string" && (entityId.length === 18 || entityId.length === 15);
	};

	/**
	 * Extract the entity key prefix from a valid entity ID.
	 *
	 * @param {string} entityId = The string from which to extract the entity ID.
	 * @returns {?string} The key prefix, if this ID is valid.
	 */
	Snapins.prototype.getKeyPrefix = function getKeyPrefix(entityId) {
		if(this.isValidEntityId(entityId)) return entityId.substr(0, 3);

		return undefined;
	};

	/**
	 * Determines if a string is a valid Salesforce organization ID.
	 *
	 * @param {string} entityId - An entity ID.
	 * @returns {boolean} Is the string an organization ID?
	 */
	Snapins.prototype.isOrganizationId = function isOrganizationId(entityId) {
		return this.getKeyPrefix(entityId) === "00D";
	};

	/**
	 * Retrieve a reference to the iframe DOM element.
	 *
	 * @returns {HTMLElement} A reference to the iframe.
	 */
	Snapins.prototype.getESWFrame = function getESWFrame() {
		var element = document.getElementById(STORAGE_IFRAME_ID);

		if(!this.eswFrame && element) {
			this.eswFrame = element.contentWindow;
		}

		return this.eswFrame;
	};

	/**
	 * Determine if we're using iframe storage or not. This is always true in a modern snippet.
	 *
	 * @returns {Boolean} Are we using iframe storage?
	 * @deprecated as of 5.0
	 */
	Snapins.prototype.isFrameStorageEnabled = function isFrameStorageEnabled() {
		this.deprecated("isFrameStorageEnabled");

		return true;
	};

	/**
	 * If all the scripts have loaded, process any pending messages.
	 *
	 * @param {string} featureName - The name of the feature
	 */
	Snapins.prototype.processPendingMessages = function processPendingMessages(featureName) {
		if(this.pendingMessages[featureName]) {
			this.pendingMessages[featureName].forEach(function(message) {
				this.handleMessage(message.payload);
			}.bind(this));

			this.pendingMessages[featureName] = undefined;
		}
	};

	/**
	 * Load the esw.css file for this snippet version.
	 */
	Snapins.prototype.loadCSS = function loadCSS() {
		var link = document.createElement("link");
		var baseURL = this.settings.gslbBaseURL ? this.settings.gslbBaseURL : this.settings.baseCoreURL;

		link.href = baseURL + "/embeddedservice/" + this.settings.releaseVersion + "/esw" + (this.settings.devMode ? "" : ".min") + ".css";
		link.type = "text/css";
		link.rel = "stylesheet";

		document.getElementsByTagName("head")[0].appendChild(link);
	};

	/**
	 * Append the help button to the DOM.
	 *
	 * @param {boolean} isVisible - Should the help button be visible?
	 */
	Snapins.prototype.appendHelpButton = function appendHelpButton(isVisible) {
		var helpButton = document.createElement("div");
		var directionAttribute = "";

		helpButton.className = HELP_BUTTON_CLASS;
		// RTL is currently supported only on desktop (non mobile)
		if(this.isLanguageRtl(this.settings.language) && this.isDesktop()) {
			directionAttribute = RTL_DIRECTION_ATTRIBUTE;
		}

		/* eslint-disable quotes */
		helpButton.innerHTML =
			'<div class="helpButton"' + directionAttribute + '>' +
			'<button class="helpButtonEnabled uiButton" href="javascript:void(0)">' +
			'<span class="embeddedServiceIcon" aria-hidden="true" data-icon="&#59648;"></span>' +
			'<span class="helpButtonLabel" id="helpButtonSpan" aria-live="polite" aria-atomic="true">' +
			'<span class="assistiveText">' + (this.settings.defaultAssistiveText || "") + '</span>' +
			'<span class="message"></span>' +
			'</span>' +
			'</button>' +
			'</div>';
		/* eslint-enable quotes */

		if(!isVisible) {
			helpButton.style.display = "none";
		}

		this.settings.targetElement.appendChild(helpButton);

		this.setHelpButtonText(this.settings.defaultMinimizedText);

		// Prevent double-tap issues in iOS. If this is a mobile device (that is, has touch events), add a style
		// that removes hover pseudoelements.
		if("ontouchstart" in document.documentElement) {
			[].slice.apply(document.querySelectorAll(".embeddedServiceHelpButton .uiButton")).forEach(function(element) {
				element.classList.add("no-hover");
			});
		}

		// Force a status change, in case the state has changed before the element was created.
		this.onButtonStatusChange();
	};

	/**
	 * Append the storage IFrame to the page.
	 */
	Snapins.prototype.appendIFrame = function appendIFrame() {
		var child = document.createElement("iframe");
		// Data passed to iframe to update session storage for session continuity
		var data = {};

		child.id = STORAGE_IFRAME_ID;
		child.src = this.settings.iframeURL;
		child.style.display = "none";

		child.onload = function() {
			var frame = this.getESWFrame();

			this.isIframeReady = true;

			// Send all messages that were awaiting the iframe to load.
			this.outboundMessagesAwaitingIframeLoad.forEach(function(message) {
				frame.postMessage(message, this.settings.iframeURL);
			}.bind(this));

			this.outboundMessagesAwaitingIframeLoad = [];

			this.iframeScriptsToLoad.forEach(function(name) {
				this.loadStorageScript(name);
			}.bind(this));

			data.deploymentId = this.settings.deploymentId;
			data.isSamePageNavigation = this.isSamePageNavigation();
			// We must calculate if this is a refresh in the parent tab, doing so in iframe will result in 0 in case of parent refresh.
			data.isRefresh = window.performance.navigation.type === 1;

			// Update sessionStorage for cross-tab session continuity
			this.postMessage("session.updateStorage", data);

			this.iframeScriptsToLoad = [];
		}.bind(this);

		this.settings.targetElement.appendChild(child);

		/* IE11 does not dispose of the iframe correctly before the page unloads, and so any pending requests
		 * are left cancelled. On reload, a new request will be made, but the old request will still
		 * be pending, and so SCRT will return an error for the first request, causing chasitor to
		 * think its out-of-sync and reset its poll counts.
		 *
		 * By checking for IE11 and setting the iframe's src to a blank page, we force an unload in the
		 * iframe and cause it to cancel the pending requests in time.
		 */
		window.addEventListener("beforeunload", function(e) {
			// This message is not shown in browsers due to security issues https://bugs.chromium.org/p/chromium/issues/detail?id=587940
			var confirmationMessage = "You might lose the active chat session if you close this tab. Are you sure?";

			if(this.isInternetExplorer()) {
				child.src = "about:blank";
			}

			/**
			 * Session continuity across tabs - if tab is master throw an alert before unload or call settings function closeSessionWarning.
			 * Refreshing on master will cause slaves to go into reconnecting - W-5921163.
			 */
			if(this.isMasterAndHasSlaves) {
				this.fireEvent("snapinsCloseSessionWarning");
				if(this.settings.closeSessionWarning && typeof this.settings.closeSessionWarning === "function") {
					this.settings.closeSessionWarning();
				} else {
					(e || window.event).returnValue = confirmationMessage;

					return confirmationMessage;
				}
			}

			// Always decrement the active chat session - master or slave.
			this.postMessage("chasitor.decrementActiveChatSession", this.settings.deploymentId);
		}.bind(this), false);
	};

	/**
	 * Prepare the page to render embeddedService:sidebar component.
	 */
	Snapins.prototype.preparePageForSidebar = function preparePageForSidebar() {
		// Hide existing button to avoid elements if same ID
		var settings = {};

		// If invitations are present on the page, remove them
		if(document.getElementById(INVITE_DOM_ID) && embedded_svc.inviteAPI) {
			embedded_svc.inviteAPI.inviteButton.setOnlineState(false);
		}

		this.fireEvent("beforeCreate");

		// Shallow copy the settings object.
		Object.keys(this.settings).forEach(function(key) {
			settings[key] = this.settings[key];
		}.bind(this));

		// Add any missing defaults.
		this.mergeSettings(this.defaultSettings);
	};

	/**
	 * Trigger the LightningOut call to render the sidebar Aura component.
	 *
	 * @param {Object} serializedData - Serialized data to pass along to the component.
	 */
	Snapins.prototype.createLightningComponent = function createLightningComponent(serializedData) {
		this.preparePageForSidebar();

		// $Lightning.createComponent call.
		this.createEmbeddedServiceComponent({
			attributes: {
				configurationData: this.settings,
				serializedSessionData: serializedData
			},
			locator: this.settings.targetElement
		}).then(
			function() {
				// Hide the static button once we've bootstrapped.
				this.hideHelpButton();
				this.componentInitInProgress = false;
				this.setHelpButtonText(this.settings.defaultMinimizedText);
				this.fireEvent("ready");
			}.bind(this)
		);
	};

	/**
	 * Trigger the LightningOut call to load in the app so that we can create the component.
	 *
	 * @param {Object} [serializedData] - Serialized data to pass along to the component.
	 */
	Snapins.prototype.loadLightningApp = function loadLightningApp(serializedData) {
		var language = this.settings.language && this.settings.language.trim() !== "" ? { guestUserLang: this.settings.language } : undefined;
		var button;
		var buttonWidth;

		// Validate community URL for external page only
		if(this.settings.isExternalPage && typeof this.settings.communityEndpointURL !== "string") {
			throw new Error("communityEndpointURL String property not set");
		}

		// Get the width of the button and so that we can maintain constant
		// widths across all states.
		button = document.getElementsByClassName("helpButton")[0];

		if(button) {
			buttonWidth = button.getBoundingClientRect().width;

			// If the button width is zero, it means we're restoring a session.
			// Thus, we don't want to override the preexisting width, as that would
			// defeat the point of our session continuity work!
			if(buttonWidth > 0) {
				button.style.width = buttonWidth + "px";
			}
		}

		// We set showIcon is set to false, as the Loading... text is not supposed to show the icon.
		this.setHelpButtonText(this.settings.loadingText, false);

		// $Lightning.use call.
		this.instantiateLightningOutApplication({
			communityEndpointURL: this.settings.communityEndpointURL,
			oauthToken: this.auth.oauthToken,
			paramsObj: language
		}).then(this.createLightningComponent.bind(this, serializedData));
	};

	/**
	 * Initialize Lightning Out, downloading the JS file if needed. JS should be loaded
	 * already from the GSLB location.
	 *
	 * @param {Object} [serializedData] - Serialized data to pass along to the component.
	 */
	Snapins.prototype.initLightningOut = function initLightningOut(serializedData) {
		if(this.hasSessionDataLoaded) {
			/**
			 * TODO Before loading lightning out scripts, older implementation checked:
			 * 		if(!window.$Lightning || !this.settings.isExternalPage)
			 * what is this isExternalPage setting used for?
			 */
			if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
				this.loadScriptFromDirectory(
					"common",
					"promisepolyfill",
					function() {
						this.initLightningOut(serializedData);
					}.bind(this),
					true
				);
			} else {
				this.loadLightningOutScripts().then(this.loadLightningApp.bind(this, serializedData));
			}
		}
	};

	/**
	 * Set the button text to a provided value.
	 *
	 * showIcon determines whether or not we display the chat bubble icon. It
	 * defaults to the value of settings.showIcon, which is true when undefined.
	 *
	 * @param {string} text - Text to display on the help button.
	 * @param {boolean} [showIcon] - Whether or not to display an icon on the help button.
	 */
	Snapins.prototype.setHelpButtonText = function setHelpButtonText(text, showIcon) {
		var showIconSettingsStatus = this.settings.showIcon === undefined ? true : this.settings.showIcon;
		var shouldShow = showIcon === undefined ? showIconSettingsStatus : showIcon;
		var helpButton = document.getElementById("helpButtonSpan");
		var messageSpan;
		var iconElement;

		if(helpButton) {
			messageSpan = helpButton.querySelector(".message");
			messageSpan.innerHTML = text;

			iconElement = helpButton.parentElement.querySelector(".embeddedServiceIcon");
			if(iconElement) iconElement.style.display = shouldShow ? "inline-block" : "none";
		}
	};

	/**
	 * Begin the process of creating the DOM elements required.
	 */
	Snapins.prototype.prepareDOM = function prepareDOM() {
		if(this.domInitInProgress) return;

		this.domInitInProgress = true;

		this.appendIFrame();
	};

	/**
	 * Add the message handlers for the session API so that session events
	 * are observed.
	 */
	Snapins.prototype.addSessionHandlers = function addSessionHandlers() {
		this.addMessageHandler("session.onLoad", function() {
			this.postMessage("session.get", this.storageKeys);
		}.bind(this));

		this.addMessageHandler("session.sessionData", function(data) {
			this.resumeInitWithSessionData(data);
		}.bind(this));

		this.addMessageHandler("session.deletedSessionData", function(data) {
			// Clear local serialized data when the serialized data in the iframe is deleted
			if(data.indexOf("CHASITOR_SERIALIZED_KEY") > -1) {
				this.loginPendingSerializedData = undefined;
			}
		}.bind(this));

		this.addMessageHandler("session.updateMaster", function(data) {
			if(data) {
				if(data.isMaster) {
					sessionStorage.setItem(this.settings.storageDomain + "MASTER_DEPLOYMENT_ID", this.settings.deploymentId);
				} else {
					sessionStorage.removeItem(this.settings.storageDomain + "MASTER_DEPLOYMENT_ID");
				}
				this.isMasterAndHasSlaves = data.activeChatSessions > 1 && data.isMaster;
			}
		}.bind(this));
	};

	/**
	 * Add a meta tag to the parent page.
	 *
	 * @param {string} name - The name of the meta tag.
	 * @param {string} content - The value of the content attr.
	 */
	Snapins.prototype.addMetaTag = function(name, content) {
		var metaTag = document.createElement("meta");

		metaTag.name = name;
		metaTag.content = content;
		document.head.appendChild(metaTag);
	};

	/**
	 * Validate settings and begin the process of rendering DOM elements.
	 *
	 * @param {string} baseCoreURL - The base URL for the server where ESW files live.
	 * @param {string} communityEndpointURL - The base URL for the community.
	 * @param {string} gslbBaseURL - The base URL for the global Salesforce load balancer.
	 * @param {string} orgId - The entity ID for the organization.
	 * @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	 * @param {object} settings - A key-value mapping of additional settings provided by features.
	 */
	Snapins.prototype.init = function init(baseCoreURL, communityEndpointURL, gslbBaseURL, orgId, eswConfigDevName, settings) {
		this.settings.baseCoreURL = baseCoreURL;
		this.settings.communityEndpointURL = communityEndpointURL;
		this.settings.gslbBaseURL = gslbBaseURL ? gslbBaseURL : baseCoreURL;
		this.settings.orgId = orgId;
		this.settings.releaseVersion = SNIPPET_VERSION;
		this.settings.eswConfigDevName = eswConfigDevName;

		this.mergeSettings(settings || {});
		this.adjustCommunityStorageDomain();

		if(typeof this.settings.baseCoreURL !== "string") throw new Error("Base core URL value must be a string.");

		if(!this.isOrganizationId(this.settings.orgId)) throw new Error("Invalid OrganizationId Parameter Value: " + this.settings.orgId);

		// If one of the event handlers returns false, cancel load.
		if(this.fireEvent("validateInit", function(responses) {
			return responses.indexOf(false) !== -1;
		}, this.settings)) {
			return;
		}

		this.checkForNativeFunctionOverrides();

		if(this.settings.appendHelpButton) this.loadCSS();

		if(!this.settings.targetElement) throw new Error("No targetElement specified");

		this.settings.iframeURL = this.settings.gslbBaseURL + "/embeddedservice/" + this.settings.releaseVersion +
			(this.settings.devMode ? "/eswDev.html" : "/esw.html") + "?parent=" + document.location.href;

		this.addSessionHandlers();

		// Wait for feature script to load before appending iframe to avoid race condition - W-5907820
		this.loadFeatures(this.onFeatureScriptsLoaded.bind(this));

		this.fireEvent("afterInit", undefined, this.settings);
	};

	/**
	 * On all feature scripts loaded, append Snap-ins iframe.
	 */
	Snapins.prototype.onFeatureScriptsLoaded = function onFeatureScriptsLoaded() {
		if(document.readyState === "complete") {
			// DOM is ready. Call domInit asynchronously in case caller expected
			// a delay.
			setTimeout(this.prepareDOM.bind(this), 1);
		} else if(document.addEventListener) {
			// Compliant browser.
			document.addEventListener("DOMContentLoaded", this.prepareDOM.bind(this), false);

			// Fallback for browsers that don't support DOMContentLoaded.
			// domInit insures it is only called once.
			window.addEventListener("load", this.prepareDOM.bind(this), false);
		} else if(window.attachEvent) {
			// IE
			window.attachEvent("onload", this.prepareDOM.bind(this));
		} else {
			this.log("No available event model. Exiting.");
		}
	};

	/**
	 * Check for modified document/window native JS methods and output a warning for each overriden method.
	 * These methods are used in ESW and also in Aura.
	 */
	Snapins.prototype.checkForNativeFunctionOverrides = function checkForNativeFunctionOverrides() {
		var documentFunctionsToCheck = [
			"addEventListener",
			"createAttribute",
			"createComment",
			"createDocumentFragment",
			// SFDC overrides createElement so we'll skip this one.
			// "createElement",
			"createElementNS",
			"createTextNode",
			"createRange",
			// Not supported in IE11 so we'll skip this one.
			// "exitPointerLock",
			"getElementById",
			"getElementsByTagName",
			"getElementsByClassName",
			"querySelector",
			"querySelectorAll",
			"removeEventListener"
		];
		var windowFunctionsToCheck = [
			"addEventListener",
			// Old IE8/9 method that we don't want to track.
			// "attachEvent",
			"clearTimeout",
			"dispatchEvent",
			"open",
			"removeEventListener",
			"requestAnimationFrame",
			"setInterval",
			"setTimeout"
		];
		var objectsToCheck = [{
			name: "Document",
			object: document,
			functions: documentFunctionsToCheck
		}, {
			name: "Window",
			object: window,
			functions: windowFunctionsToCheck
		}];

		// For each object type (doc/win), we want to check their expected native functions.
		objectsToCheck.forEach(function(objectToCheck) {
			objectToCheck.functions.forEach(function(nativeFunction) {
				if(nativeFunction in objectToCheck.object && !this.isNativeFunction(objectToCheck.object, nativeFunction)) {
					this.warning("Embedded Service Chat may not function correctly with this native " + objectToCheck.name + " JS function modified: " + nativeFunction);
				}
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Checks if the baseObject's functionName method is still native code or if it has been modified.
	 *
	 * @param {Object} baseObject - Base object to check for modification of native code.
	 * @param {string} functionName - Function name to check.
	 * @return {boolean} Is the baseObject's functionName method still native code?
	 */
	Snapins.prototype.isNativeFunction = function isNativeFunction(baseObject, functionName) {
		return Function.prototype.toString.call(baseObject[functionName]).match(/\[native code\]/);
	};

	/**
	 * Callback to fire when the help button is clicked.
	 *
	 * @param {Object} serializedData - Serialized data retrieved from session storage.
	 */
	Snapins.prototype.onHelpButtonClick = function onHelpButtonClick() {
		if(!this.componentInitInProgress && !document.getElementsByClassName("embeddedServiceSidebar").length) {
			this.componentInitInProgress = true;
			try {
				this.checkAuthentication();
				embedded_svc.fireEvent("onHelpButtonClick");
			} catch(error) {
				this.componentInitInProgress = false;
				throw error;
			}
		}
	};

	/**
	 * If we're using session storage, then continue the initialization process now that we have retrieved
	 * the stored data.
	 *
	 * @param {Object} serializedData - Serialized data retrieved from session storage.
	 */
	Snapins.prototype.resumeInitWithSessionData = function resumeInitWithSessionData(serializedData) {
		var continueSession = this.fireEvent("sessionDataRetrieved", function(responses) {
			return responses.indexOf(true) !== -1;
		}, serializedData);
		var initialize = false;
		var useSerializedData = false;

		if(this.settings.linkAction.valid) {
			initialize = true;
		} else if(continueSession) {
			this.log("Existing session found. Continuing with data: " + serializedData);
			initialize = true;
			useSerializedData = true;

			// If in channel menu context, hide FAB while session continues reinitializing.
			if(embedded_svc.menu) {
				embedded_svc.menu.hideFabAndChannelMenu();
			}
		} else if(this.componentInitInProgress) {
			initialize = true;
		}

		this.hasSessionDataLoaded = true;

		if(serializedData[ESW_OAUTH_TOKEN_KEY]) {
			this.auth.oauthToken = serializedData[ESW_OAUTH_TOKEN_KEY];
		}

		this.loginPendingSerializedData = useSerializedData ? serializedData : undefined;

		if(initialize) {
			this.componentInitInProgress = true;
			this.checkAuthentication();
		}

		if(this.settings.appendHelpButton) {
			this.appendHelpButton(this.settings.displayHelpButton && !continueSession);
		}
	};

	/**
	 * Check to see if the authentication is enabled and the oauth token is present before continuing with initialization.
	 */
	Snapins.prototype.checkAuthentication = function checkAuthentication() {
		if(this.isAuthenticationRequired && !this.settings.allowGuestUsers) {
			if(this.auth.oauthToken) {
				if(this.loginButtonPressed || this.componentInitInProgress) {
					// Init LO app
					this.initLightningOut(this.loginPendingSerializedData);
				}
			} else {
				this.fireEvent("requireauth");
			}
		} else if(this.loginButtonPressed || this.componentInitInProgress) {
			this.initLightningOut(this.loginPendingSerializedData);
		}
	};

	/**
	 * Send a message to the iframe.
	 *
	 * @param {string} method - String denoting the iframe functionality we want to invoke. See esw.html's onmessage handler.
	 * @param {Object} data - Any data required by the invoked method.
	 */
	Snapins.prototype.postMessage = function postMessage(method, data) {
		var message = {
			domain: this.settings.storageDomain,
			data: data,
			method: method
		};
		var frame = this.getESWFrame();

		if(frame) {
			frame.postMessage(message, this.settings.iframeURL);
		} else {
			this.outboundMessagesAwaitingIframeLoad.push(message);
		}
	};

	/**
	 * Update one or more values within the IFrame local storage, stored within Salesforce domain.
	 * If a map of key-value pairs is passed as the first parameter, keyValue is ignored.
	 *
	 * @param {Object.<string, *>|string} keyOrMap - Either a specific key to update or a key-value map.
	 * @param {*} value - A value to set keyOrMap to if keyOrMap is a string.
	 */
	Snapins.prototype.setSessionData = function setSessionData(keyOrMap, value) {
		var map;

		if(typeof keyOrMap === "object") {
			map = keyOrMap;
		} else {
			map = {};
			map[keyOrMap] = value;
		}

		this.postMessage("session.set", map);
	};

	/**
	 * Remove one or more values from the session storage.
	 *
	 * @param {string|Array.<string>} keyOrArray - One or more keys whose values should be removed from storage.
	 */
	Snapins.prototype.deleteSessionData = function deleteSessionData(keyOrArray) {
		var array;

		if(Array.isArray(keyOrArray)) {
			array = keyOrArray;
		} else {
			array = [keyOrArray];
		}

		this.postMessage("session.delete", array);
	};

	/**
	 * Define a feature module so that it can be loaded in at runtime.
	 *
	 * @param {string} featureName - The name of the feature.
	 * @param {function} contents - The module's JS contents.
	 */
	Snapins.prototype.defineFeature = function defineFeature(featureName, contents) {
		this.featureScripts[featureName] = contents;
	};

	/**
	 * Register one or more storage keys so that the iframe provides all needed session
	 * storage values.
	 *
	 * @param {string|Array.<string>} keys - One or more keys to register.
	 */
	Snapins.prototype.registerStorageKeys = function registerStorageKeys(keys) {
		if(typeof keys === "string") {
			this.storageKeys.push(keys);
		} else {
			keys.forEach(function(key) {
				this.storageKeys.push(key);
			}.bind(this));
		}
	};

	/**
	 * Register a callback for a received message with a given name.
	 *
	 * @param {string} name - The name of the message for which to listen.
	 * @param {function(data)} handler - Callback which receives the message's data.
	 */
	Snapins.prototype.addMessageHandler = function addMessageHandler(name, handler) {
		this.messageHandlers[name] = handler;
	};

	/**
	 * Tell the iframe to load a script.
	 *
	 * The actual script file must end in ".esw.js" or ".esw.min.js".
	 *
	 * @param {string} name - The name of the script to load.
	 */
	Snapins.prototype.loadStorageScript = function loadStorageScript(name) {
		if(this.isIframeReady) {
			this.postMessage("script.load", name);
		} else {
			this.iframeScriptsToLoad.push(name);
		}
	};

	/**
	 * Load a specified script from the directory specified.
	 *
	 * @param {String} directory - The name of the directory the script resides in.
	 * @param {String} name - The name of the utility script to load.
	 * @param {Function} scriptOnLoadFunction - Function to call when the script is loaded.
	 * @param {Boolean} isReleaseAgnostic - Is this script release agnostic or specific to a version (like 5.0)?
	 */
	Snapins.prototype.loadScriptFromDirectory = function loadScriptFromDirectory(directory, name, scriptOnLoadFunction, isReleaseAgnostic) {
		var lowerCaseName = name.toLowerCase();
		var script = document.createElement("script");
		var baseURL = this.settings.gslbBaseURL;

		script.type = "text/javascript";
		script.src = [
			baseURL,
			"embeddedservice",
			isReleaseAgnostic ? undefined : this.settings.releaseVersion,
			directory,
			lowerCaseName + (this.settings.devMode ? "" : ".min") + ".js"
		].filter(function(item) {
			// Filter out undefined items.
			return Boolean(item);
		}).join("/");

		if(scriptOnLoadFunction) script.onload = scriptOnLoadFunction;

		document.body.appendChild(script);
	};

	/**
	 * Load the script files for the features enabled via settings.
	 */
	Snapins.prototype.loadFeatures = function loadFeatures(callback) {
		// Currently liveagent and fieldservice are the only 2 enabled features and they cannot be enabled together
		// When we have more than one enabled features on the page we should re-evaluate if we need the callback more than once
		this.settings.enabledFeatures.forEach(function(featureName) {
			// Check for base is specifically for the case we saw with Dell
			// where they are making one more call to embedded_svc.init after the sidebar is loaded once resulting in a 404
			if(featureName !== "base" && this.availableFeatures.indexOf(featureName.toLowerCase()) === -1) {
				this.loadFeatureScript(featureName, callback);
			}
		}.bind(this));
	};

	/**
	 * Add a handler for an event fired by the Snapins object.
	 *
	 * @param {string} event - The name of the event for which to listen.
	 * @param {function} handler - A callback function fired when the event occurs.
	 */
	Snapins.prototype.addEventHandler = function addEventHandler(event, handler) {
		var lowerCaseEventName = event.toLowerCase();

		if(!this.eventHandlers[lowerCaseEventName]) {
			this.eventHandlers[lowerCaseEventName] = [];
		}

		this.eventHandlers[lowerCaseEventName].push(handler);
	};

	/**
	 * Add the window-level event listener for messages.
	 */
	Snapins.prototype.setupMessageListener = function setupMessageListener() {
		window.addEventListener("message", function(message) {
			var payload = message.data;
			var messageOrigin = message.origin.split(":")[1].replace("//", "");
			var feature;
			var oldHost;
			var newHost;

			if(payload && payload.method && embedded_svc.isMessageFromSalesforceDomain(messageOrigin)) {
				if(payload.method === "session.onLoad" && this.settings.iframeURL.indexOf(messageOrigin) === -1) {
					// Iframe may have been redirected due to org cookie w/ myDomain
					oldHost = this.settings.iframeURL.split("/")[2];
					newHost = message.origin.split("/")[2];
					this.settings.iframeURL = this.settings.iframeURL.replace(oldHost, newHost);
				}

				feature = payload.method.split(".")[0].toLowerCase();

				if(this.availableFeatures.indexOf(feature) === -1) {
					if(!this.pendingMessages[feature]) {
						this.pendingMessages[feature] = [];
					}

					this.pendingMessages[feature].push({
						direction: "incoming",
						payload: payload
					});
				} else {
					this.handleMessage(payload);
				}
			}
		}.bind(this), false);
	};

	/**
	 * Handle an incoming message.
	 *
	 * @param {Object} payload - The message's payload.
	 */
	Snapins.prototype.handleMessage = function handleMessage(payload) {
		if(this.messageHandlers[payload.method]) {
			this.messageHandlers[payload.method](payload.data);
		} else {
			this.log("Unregistered method " + payload.method + " received.");
		}
	};

	/**
	 * Determines if a message origin url has a Salesforce domain. Used for filtering non-Salesforce messages.
	 *
	 * @param {string} messageOriginUrl - String containing the origin url. This should end with the domain (strip off the port before passing to this function).
	 * @return {boolean} Did message come from page hosted on Salesforce domain?
	 */
	Snapins.prototype.isMessageFromSalesforceDomain = function isMessageFromSalesforceDomain(messageOriginUrl) {
		var isCommunityOrSite = window.$A && typeof window.$A.get === "function" && window.$A.get("$Site");
		var endsWith;

		/**
	     * 1st check - if on community platform, and endpoint is same as hosting community,
	     *             message origin will be from same domain as document
	     */
		if(isCommunityOrSite && messageOriginUrl === document.domain) {
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
			return endsWith(messageOriginUrl, salesforceDomain);
		});
	};

	/**
	 * Determines if the given domain is a communities URL.
	 *
	 * @param {String} domain - Domain to check against.
	 * @return {boolean} True if the domain is a communities URL.
	 */
	Snapins.prototype.isCommunityDomain = function isCommunityDomain(domain) {
		return domain.substr(-".force.com".length) === ".force.com";
	};

	/**
	 * Determines if navigation is on the same page either from a refresh or a new tab (clicking a link or direct navigation to that tab).
	 *
	 * @return {boolean} - True if the browser reloaded the same page or directly navigated to a page on the same domain.
	 */
	Snapins.prototype.isSamePageNavigation = function isSamePageNavigation() {
		var currentDomainMatchesStorageDomain;
		var currentDomain = document.domain;

		if(this.isCommunityDomain(document.domain)) currentDomain = currentDomain + "/" + window.location.pathname.split("/")[1];

		// Stores whether the current domain is either a subdomain or matches this.settings.storageDomain.
		currentDomainMatchesStorageDomain = currentDomain.substr(-this.settings.storageDomain.length) === this.settings.storageDomain;

		return currentDomainMatchesStorageDomain;
	};

	/**
	 * Register a default value for a setting.
	 *
	 * @param {string} name - The name of the setting.
	 * @param {*} defaultValue - The default value of the setting.
	 */
	Snapins.prototype.addDefaultSetting = function addDefaultSetting(name, defaultValue) {
		this.defaultSettings[name] = defaultValue;
	};

	/**
	 * Update the attributes of the button's DOM element when `isButtonDisabled` is changed.
	 */
	Snapins.prototype.onButtonStatusChange = function onButtonStatusChange() {
		var button = document.querySelector(".embeddedServiceHelpButton button");
		var message;

		// Trigger channel menu updates for button status change
		if(embedded_svc.menu) {
			embedded_svc.menu.onAgentAvailabilityChange();
		}

		if(button) {
			message = button.querySelector(".message");

			if(message) {
				if(this.isButtonDisabled) {
					button.onclick = function() { };
					button.classList.remove("helpButtonEnabled");
					button.classList.add("helpButtonDisabled");
					message.innerHTML = this.settings.disabledMinimizedText;
				} else {
					button.onclick = this.onHelpButtonClick.bind(this);
					button.classList.remove("helpButtonDisabled");
					button.classList.add("helpButtonEnabled");
					message.innerHTML = this.settings.defaultMinimizedText;
				}
			}
		}
	};

	/**
	 * Hide the help button.
	 */
	Snapins.prototype.hideHelpButton = function hideHelpButton() {
		var button = document.querySelector("." + HELP_BUTTON_CLASS);

		if(button) {
			button.style.display = "none";
		}
	};

	/**
	 * Show the help button.
	 */
	Snapins.prototype.showHelpButton = function showHelpButton() {
		var button = document.querySelector("." + HELP_BUTTON_CLASS);

		if(button) {
			button.style.display = "";
		}
	};

	/**
	 * Set the default text for the button if `this.settings.entryFeature` is equal
	 * to the provided feature name.
	 *
	 * @param {string} featureName - The name of the feature to check against.
	 * @param {string} enabledText - The text to display when the button is enabled.
	 * @param {string} disabledText - The text to display when the button is disabled.
	 * @param {string} assistiveText - The assistive text to be announced to screen readers.
	 */
	Snapins.prototype.setDefaultButtonText = function setDefaultButtonText(featureName, enabledText, disabledText, assistiveText) {
		if(this.settings.entryFeature === featureName) {
			this.settings.defaultMinimizedText = this.settings.defaultMinimizedText || enabledText;
			this.settings.disabledMinimizedText = this.settings.disabledMinimizedText || disabledText;
			this.settings.defaultAssistiveText = this.settings.defaultAssistiveText || assistiveText || "";
		}
	};

	/**
	 * Set the default status for whether the icon should show or not.
	 *
	 * @param {string} status - The default status for the icon visibility.
	 */
	Snapins.prototype.setDefaultShowIcon = function setDefaultShowIcon(featureName, status) {
		if(this.settings.entryFeature === featureName && this.settings.showIcon === undefined) {
			this.settings.showIcon = status;
		}
	};

	/**
	 * Register a link action as valid, so that the feature knows to handle it. Link actions are the
	 * deep-linking actions provided by the query string; they instruct the Snap-in to immediately
	 * attempt the authentication flow, and the link action data is passed to the relevant
	 * feature provider so that it can display the correct state.
	 *
	 * If a user provides a link action that is not registered, the Snap-in will not open automatically.
	 *
	 * @param {string} featureName - The name of the feature to which this link action belongs.
	 * @param {string} name - The name of the link action.
	 */
	Snapins.prototype.registerLinkAction = function registerLinkAction(featureName, name) {
		var linkAction = this.settings.linkAction;

		if(!this.validLinkActions[featureName]) {
			this.validLinkActions[featureName] = [];
		}

		if(this.validLinkActions[featureName].indexOf(name) === -1) {
			this.validLinkActions[featureName].push(name);
		}

		// If we haven't triggered a link action yet, check to see if this link action is
		if(linkAction.feature && linkAction.name && linkAction.feature.toLowerCase() === featureName.toLowerCase() && linkAction.name.toLowerCase() === name.toLowerCase()) {
			linkAction.valid = true;

			// Override this so that the feature name has the correct case.
			linkAction.feature = featureName;
			this.settings.entryFeature = featureName;
		}
	};

	/**
	 * Set the link action to follow the next time the sidebar is initialized. This overrides
	 * the link action specified in the query string.
	 *
	 * @param {string} feature - The feature to which the link action belongs.
	 * @param {string} action - The name of the action
	 * @param {Object.<String, *>} parameters - Any parameters to pass along.
	 */
	Snapins.prototype.setLinkAction = function setLinkAction(feature, action, parameters) {
		var matchingFeature = Object.keys(this.validLinkActions).filter(function(key) {
			return key.toLowerCase() === feature.toLowerCase();
		})[0];

		if(matchingFeature) {
			this.settings.linkAction.feature = matchingFeature;
			this.settings.linkAction.name = this.validLinkActions[matchingFeature].filter(function(key) {
				return key.toLowerCase() === action.toLowerCase();
			})[0];
			this.settings.linkAction.valid = this.settings.linkAction.name !== undefined;

			this.settings.linkActionParameters = parameters;
		} else {
			this.settings.linkAction.valid = false;
		}
	};

	/**
	 * Process the URI to extract the link action data from it.
	 */
	Snapins.prototype.getLinkActionData = function getLinkActionData() {
		window.location.search.replace(/([a-zA-Z0-9._]+)=([^&\s]+)/g, function(match, key, value) {
			var lowerCaseKey = key.toLowerCase();
			var actionParts;
			var relativeKey;

			if(lowerCaseKey.indexOf("snapins.") === 0) {
				relativeKey = lowerCaseKey.replace("snapins.", "");
				if(relativeKey === "action") {
					// Actions should be of the form feature.action
					actionParts = value.split(".");
					if(actionParts.length === 2) {
						this.settings.linkAction.feature = actionParts[0];
						this.settings.linkAction.name = actionParts[1];
					}
				} else {
					this.settings.linkActionParameters[relativeKey.toLowerCase()] = value;
				}
			}
		}.bind(this));
	};

	/**
	 * Require that the user is authenticated before allowing the application to initialize.
	 */
	Snapins.prototype.requireAuthentication = function requireAuthentication() {
		var scriptEl = document.createElement("script");
		var styleEl = document.createElement("style");
		var loginElement = document.querySelector(this.settings.loginTargetQuerySelector);

		this.isAuthenticationRequired = true;

		// Require HTTPS pages if authentication is required.
		if(window.location.protocol !== "https:" && !this.settings.devMode) {
			this.settings.displayHelpButton = false;
			throw new Error("Snap-in authentication requires HTTPS.");
		}

		if(!this.settings.useCustomAuthentication) {
			// Initialize auth metadata
			if(!this.settings.loginClientId || !this.settings.loginRedirectURL || !this.settings.loginTargetQuerySelector) {
				throw new Error("Authentication in Snap-ins requires these valid settings params: loginClientId, loginRedirectURL, loginTargetQuerySelector.");
			}

			// Flag so that on auto-login when page refreshes, the app does not immediately load from the login callback.
			if(loginElement) {
				this.loginButtonPressed = false;
				loginElement.addEventListener("click", function() {
					this.loginButtonPressed = true;
				}.bind(this));
			} else {
				throw new Error("loginTargetQuerySelector is not a valid DOM element.");
			}

			this.addMetaTag("salesforce-community", this.settings.communityEndpointURL);
			this.addMetaTag("salesforce-client-id", this.settings.loginClientId);
			this.addMetaTag("salesforce-redirect-uri", this.settings.loginRedirectURL);
			this.addMetaTag("salesforce-mode", "popup");
			this.addMetaTag("salesforce-target", this.settings.loginTargetQuerySelector);
			this.addMetaTag("salesforce-login-handler", LOGIN_CALLBACK);
			this.addMetaTag("salesforce-logout-handler", LOGOUT_CALLBACK);

			this.addEventHandler("requireauth", function() {
				// Attempt to log in once the login JS has loaded.
				var loginAttemptInterval = setInterval(function() {
					if(window.SFIDWidget) {
						clearInterval(loginAttemptInterval);
						// If we're already authenticated, just call the login callback.
						if(window.SFIDWidget.openid_response) {
							window[LOGIN_CALLBACK]();
						} else {
							window.SFIDWidget.login();
						}
					}
				}, LOGIN_ATTEMPT_INTERVAL);
			});

			this.addEventHandler("autherror", function(shouldReauthenticate) {
				var reinitInterval; // eslint-disable-line no-unused-vars

				// By setting the login button as pressed, we'll initiate the app load the moment a new oauth token is set.
				if(window.SFIDWidget) {
					this.loginButtonPressed = true;

					window.SFIDWidget.logout();

					reinitInterval = setInterval(function() {
						if(window.SFIDWidget.config) {
							clearInterval(reinitInterval);
							this.fireEvent("requireauth");
						}
					}.bind(this, reinitInterval), LOGIN_ATTEMPT_INTERVAL);
				}
			}.bind(this));

			// Login widget wants a function at the window level as a callback
			window[LOGIN_CALLBACK] = function() {
				var targetDiv = document.querySelector(this.settings.loginTargetQuerySelector);
				var newButton = document.createElement("button");

				// Destroy original login button
				if(this.loginButtonPressed || this.componentInitInProgress) {
					targetDiv.innerHTML = "";
				}

				// Replace with new start button. This is because the login widget will not render the original login
				// button if the page initializes logged in, so we need a new one.
				newButton.className = "authenticationStart";
				newButton.innerHTML = this.settings.authenticationStartLabel;
				newButton.addEventListener("click", this.onHelpButtonClick.bind(this));
				targetDiv.appendChild(newButton);

				this.auth.oauthToken = window.SFIDWidget.openid_response.access_token;
			}.bind(this);

			window[LOGOUT_CALLBACK] = function() {
				this.auth.oauthToken = undefined;

				// Reinitialize the login widget after we've logged out, as it clears the config when logout is called.
				window.SFIDWidget.init();
			}.bind(this);

			// Create a style to hide the dumb iframe that gets generated on logout.
			document.head.appendChild(styleEl);
			styleEl.sheet.insertRule(".sfid-logout { display: none; }", 0);

			// Get login widget js library
			scriptEl.type = "text/javascript";
			scriptEl.src = this.settings.communityEndpointURL + "/servlet/servlet.loginwidgetcontroller?type=javascript_widget" + (embedded_svc.settings.devMode ? "&min=false" : "");
			document.head.appendChild(scriptEl);
		}
	};

	/**
	 * Include SLDS in application. This means that we may have to create a DIV to contain the app so
	 * SLDS doesn't style the whole page.
	 */
	Snapins.prototype.requireSLDS = function requireSLDS() {
		var targetDiv;
		var link;
		var baseURL;

		this.settings.requireSLDS = true;
		if(this.settings.targetElement === document.body) {
			targetDiv = document.createElement("div");
			targetDiv.id = TARGET_DIV_ID;
			document.body.appendChild(targetDiv);
			this.settings.targetElement = targetDiv;
		}
		this.settings.targetElement.classList.add(SLDS_SCOPING_CLASS);

		// Load scoped SLDS
		link = document.createElement("link");
		baseURL = this.settings.gslbBaseURL ? this.settings.gslbBaseURL : this.settings.baseCoreURL;
		link.href = baseURL + "/embeddedservice/" + this.settings.releaseVersion + "/esw-slds" + (this.settings.devMode ? "" : ".min") + ".css";
		link.type = "text/css";
		link.rel = "stylesheet";
		document.getElementsByTagName("head")[0].appendChild(link);
	};

	/**
	 * Verify that a string is valid as an HTTP header value.
	 *
	 * The value must adhere to these rules, from RFC7230:
	 *
	 * token = 1*tchar
	 *
	 * tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" /
	 *         "." / "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
	 *
	 * We add space and double quote, as quoted strings are allowed as well.
	 * (from https://stackoverflow.com/a/44652895)
	 *
	 * @param {string} value - The value to verify.
	 * @returns {boolean} Is the value valid for an HTTP header?
	 */
	Snapins.prototype.validateHeaderValue = function validateHeaderValue(value) {
		return /^[0-9a-zA-Z!#$%&'*+-.^_`|~" ]*$/g.test(value);
	};

	/**
	 * Decide if the language set in the snippet is an rtl language
	 * Return true if it is an rtl language, in all other cases return false or undefined.
	 * @param {string} language - The language to check, for example 'en', 'ar', or 'es'.
	 * @returns {boolean} return undefined if no language is specified, true if the language is an rtl language, elsee return false
	 * The logic for this method is the same as that used by aura and is taken from the getHtmlTextDirection method
	 * in the class org.auraframework.impl.context.LocalizationAdapterImpl
	 */
	Snapins.prototype.isLanguageRtl = function isLanguageRtl(language) {
		if(!language || language.trim() === "") {
			return undefined;
		}
		
		switch(language.substring(0, 2)) {
			case "ar": // Arabic
			case "fa": // Persian
			case "he": // Hebrew
			case "iw": // Hebrew
			case "ji": // Yiddish
			case "ur": // Urdu
			case "yi": // Yiddish
				return true;
			default:
				return false;
		}
	};

	/**
	 * Check if we are on a Desktop (non mobile) based on information in the user agent.
	 * Browsers on tablets behave the same as mobile devices.
	 * @returns {boolean} - return true if we are on a Desktop (non mobile) and false if we are on a mobile device.
	 */
	Snapins.prototype.isDesktop = function isDesktop() {
		return navigator.userAgent.indexOf("Mobi") === -1;
	};

	window.embedded_svc = new Snapins();

	// Merge existing embedded_svc contents into the newly created object
	Object.getOwnPropertyNames(baseEmbeddedSvc).forEach(function(propertyName) {
		var property = baseEmbeddedSvc[propertyName];

		if(property === "object") {
			window.embedded_svc[propertyName] = {};
			Object.keys(property).forEach(function(key) {
				window.embedded_svc[propertyName][key] = property[key];
			});
		} else {
			window.embedded_svc[propertyName] = property;
		}
	});
})(window.embedded_svc || {});