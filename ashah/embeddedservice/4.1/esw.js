/*
 * Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * Version 4.1 - Invitations bug fixing.
 *
 *  TO MINIFY: java -jar ~/yuicompressor-2.4.8.jar --preserve-semi --disable-optimizations esw.js -o esw.min.js
 *      Here is a link to the compressor needed to minify: https://github.com/yui/yuicompressor/releases
 */

(function(baseEmbeddedSvc) {
	var HELP_BUTTON_CLASS = "embeddedServiceHelpButton";
	var SALESFORCE_DOMAINS = [
		// Used by dev, blitz, and prod instances
		".salesforce.com",

		// Used by VPODs
		".force.com",

		// Used by autobuild VMs
		".sfdc.net"
	];

	var STORAGE_IFRAME_ID = "esw_storage_iframe";

	var SNIPPET_VERSION = "4.1";

	var LOGIN_ATTEMPT_INTERVAL = 100;

	var LOGIN_CALLBACK = "__snapinsLoginCallback";
	var LOGOUT_CALLBACK = "__snapinsLogoutCallback";
	// Invitation dom id
	var INVITE_DOM_ID = "snapins_invite";

	/**
	 * ESW global object which creates and renders a sidebar.
	 *
	 * @class
	 * @property {object} settings - A list of settings that can be set within init or through embedded_svc.settings
	 * @property {object} featureScripts - Feature scripts that have been loaded into the global object.
	 * @property {object} eventHandlers - Callbacks for certain events fired by the Snapins object.
	 * @property {object} messageHandlers - Callbacks for when certain messages are received from the storage iframe.
	 * @property {Array.<string>} storageKeys - Keys to retrieve from storage when the page is loaded.
	 * @property {object} defaultSettings - A map of setting items and their default values.
	 * @property {HTMLElement} eswFrame - A reference to the ESW iframe.
	 * @property {Object.<string, Array>} pendingMessages - A map of iframe messages that are waiting on a feature to load befoere being sent or processed.
	 * @property {Array.<string>} availableFeatures - A list of featuers that have been loaded.
	 * @property {Array.<string>} iframeScriptsToLoad - ESW script load requests that were made before the iframe was ready.
	 * @property {boolean} domInitInProgress - Is the help button currently getting appended to the DOM?
	 * @property {boolean} componentInitInProgress - Is the component currently getting initialized?
	 * @property {boolean} isIframeReady - Is the iframe ready to receive messages?
	 * @property {boolean} isButtonDisabled - Should the help button be clickable?
	 * @property {boolean} requireLogin - Does the user have to login before the sidebar can load?
	 * @property {Object} loginPendingSerializedData - Serialized data as retrieved from the iframe to pass along to initialization after login.
	 */
	function Snapins() {
		var isButtonDisabled = false;

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
			loadingText: "Loading",
			enabledFeatures: [],
			entryFeature: "FieldService",
			storageDomain: document.domain,
			language: undefined,
			linkAction: {
				feature: undefined,
				name: undefined,
				valid: false
			},
			linkActionParameters: {}
		};

		this.featureScripts = {};
		this.eventHandlers = {};
		this.messageHandlers = {};
		this.storageKeys = [
			"ESW_BODY_SCROLL_POSITION",
			"ESW_IS_MINIMIZED",
			"ESW_MINIMIZED_TEXT"
		];
		this.defaultSettings = {};

		this.eswFrame = undefined;

		this.availableFeatures = ["script", "session"];

		this.pendingMessages = {};

		this.iframeScriptsToLoad = [];

		this.domInitInProgress = false;
		this.componentInitInProgress = false;
		this.isIframeReady = false;

		this.requireLogin = false;
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
	 * Log a message to the console
	 *
	 * @param {...object} messages - Objects to be displayed comma-delimited.
	 */
	Snapins.prototype.log = function log() {
		if(this.settings.devMode && console && console.log) { // eslint-disable-line no-console
			console.log("esw: " + [].slice.apply(arguments).join(", ")); // eslint-disable-line no-console
		}
	};

	/**
	 * Log an error, and fire an event so that features can react accordingly.
	 *
	 * @param {string} code - The error code.
	 */
	Snapins.prototype.error = function error(code) {
		if(code) {
			this.log("Server Error: " + code);
		} else {
			this.log("Server responed with an unknown error.");
		}
		this.fireEvent("error");
	};

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The message to print.
	 */
	Snapins.prototype.warning = function warning(message) {
		if(message) {
			this.log("Server Warning: " + message);
		} else {
			this.log("Server sent an anonymous warning.");
		}
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
		var lowerCaseName = featureName.toLowerCase();
		var script = document.createElement("script");
		var baseURL = this.settings.gslbBaseURL ? this.settings.gslbBaseURL : this.settings.baseCoreURL;

		script.type = "text/javascript";
		script.src = baseURL + "/embeddedservice/" + this.settings.releaseVersion + "/client/" + lowerCaseName + ".esw" + (this.settings.devMode ? "" : ".min") + ".js";

		script.onload = function() {
			this.featureScripts[featureName](this);
			this.availableFeatures.push(lowerCaseName);

			if(callback) callback();

			this.processPendingMessages(lowerCaseName);
		}.bind(this);

		document.body.appendChild(script);
	};

	/**
	 * Fire an event so that it can be consumed by feature scripts.
	 *
	 * @param {string} name - The name of the event to fire.
	 * @param {function(Array.<*>)} [reduceFunction] - A function which takes an array of the return values of each event
	 *                                          handler and reduces them to the return value of this function.
	 * @returns {*} The value returned by the reduce function or `true`.
	 */
	Snapins.prototype.fireEvent = function fireEvent(name, reduceFunction) {
		var handlers = this.eventHandlers[name];
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
		if(!this.eswFrame) {
			this.eswFrame = document.getElementById(STORAGE_IFRAME_ID).contentWindow;
		}

		return this.eswFrame;
	};

	/**
	 * Determine if we're using iframe storage or not.
	 * 
	 * @returns {Boolean} Are we using iframe storage?
	 */
	Snapins.prototype.isFrameStorageEnabled = function isFrameStorageEnabled() {
		return this.eswFrame !== undefined;
	};

	/**
	 * If all the scripts have loaded, process any pending messages.
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

		helpButton.className = HELP_BUTTON_CLASS;
		helpButton.innerHTML =
			'<div class="helpButton">' +
			'<a class="helpButtonEnabled uiButton" role="button" href="javascript:void(0)">' +
			'<span class="embeddedServiceIcon" aria-hidden="true" data-icon="&#59648;"></span>' +
			'<div class="helpButtonLabel" id="helpButtonSpan"><span class="message">' + this.settings.defaultMinimizedText + "</span></div>" +
			"</a>" +
			"</div>";

		if(!isVisible) {
			helpButton.style.display = "none";
		}

		this.settings.targetElement.appendChild(helpButton);

		// Prevent double-tap issues in iOS. If this is a mobile device (that is, has touch events), add a style
		// that removes hover pseudoelements.
		if("ontouchstart" in document.documentElement) {
			[].slice.apply(document.querySelectorAll(".embeddedServiceHelpButton .uiButton")).forEach(function(element) {
				element.classList.add("no-hover");
			});
		}

		// Force a status change, in case the state has changed before the element was created.
		this.onButtonStatusChange(this.isButtonDisabled);
	};

	/**
	 * Append the storage IFrame to the page.
	 */
	Snapins.prototype.appendIFrame = function appendIFrame() {
		var child = document.createElement("iframe");

		child.id = STORAGE_IFRAME_ID;
		child.src = this.settings.iframeURL;
		child.style.display = "none";

		child.onload = function() {
			this.isIframeReady = true;

			this.iframeScriptsToLoad.forEach(function(name) {
				this.loadStorageScript(name);
			}.bind(this));

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
		window.addEventListener("beforeunload", function() {
			if("ActiveXObject" in window) {
				child.src = "about:blank";
			}
		}, false);
	};

	/**
	 * Trigger the LightningOut call to render the sidebar Aura component.
	 *
	 * @param {Object} serializedData - Serialized data to pass along to the component.
	 */
	Snapins.prototype.createLightningComponent = function createLightningComponent(serializedData) {
		// Hide existing button to avoid elements if same ID
		var settings = {};
		
		// If invitations are present on the page, remove them
		if(document.getElementById(INVITE_DOM_ID) && embedded_svc.inviteAPI) {
			embedded_svc.inviteAPI.inviteButton.setOnlineState(false);
		}
		this.hideHelpButton();

		this.fireEvent("beforeCreate");

		// Shallow copy the settings object.
		Object.keys(this.settings).forEach(function(key) {
			settings[key] = this.settings[key];
		}.bind(this));

		// Add any missing defaults.
		Object.keys(this.defaultSettings).forEach(function(key) {
			if(settings[key] === undefined) {
				settings[key] = this.defaultSettings[key];
			}
		}.bind(this));

		$Lightning.createComponent(
			"embeddedService:sidebar",
			{
				configurationData: settings,
				serializedSessionData: serializedData
			},
			this.settings.targetElement,
			function() {
				this.componentInitInProgress = false;
				this.setHelpButtonText(settings.defaultMinimizedText);
			}.bind(this)
		);
	};

	/**
	 * Trigger the LightningOut call to load in the app so that we can create the component.
	 *
	 * @param {Object} [serializedData] - Serialized data to pass along to the component.
	 */
	Snapins.prototype.loadLightningApp = function loadLightningApp(serializedData) {
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

		$Lightning.use(
			"embeddedService:sidebarApp",
			function() {
				this.createLightningComponent(serializedData);
			}.bind(this),
			this.settings.communityEndpointURL,
			window.SFIDWidget && window.SFIDWidget.openid_response && window.SFIDWidget.openid_response.access_token,
			this.settings.language && this.settings.language.trim() !== "" ? { guestUserLang: this.settings.language } : undefined
		);
	};

	/**
	 * Initialize Lightning Out, downloading the JS file if needed. JS should be loaded
	 * already from the GSLB location.
	 *
	 * @param {Object} [serializedData] - Serialized data to pass along to the component.
	 */
	Snapins.prototype.initLightningOut = function initLightningOut(serializedData) {
		var scriptEl;

		if(!window.$Lightning || !this.settings.isExternalPage) {
			scriptEl = document.createElement("script");
			scriptEl.type = "text/javascript";

			scriptEl.onload = function() {
				this.loadLightningApp(serializedData);
			}.bind(this);

			scriptEl.src = this.settings.baseCoreURL + "/lightning/lightning.out.js";
			document.getElementsByTagName("head")[0].appendChild(scriptEl);
		} else {
			this.loadLightningApp(serializedData);
		}
	};

	/**
	 * Set the button text to a provided value.
	 *
	 * showIcon determines whether or not we display the chat bubble icon. It
	 * defaults to true for the default state of the widget.
	 *
	 * @param {string} text - Text to display on the help button.
	 * @param {boolean} [showIcon] - Whether or not to display an icon on the help button.
	 */
	Snapins.prototype.setHelpButtonText = function setHelpButtonText(text, showIcon) {
		var shouldShow = showIcon === undefined ? true : showIcon;
		var helpButton = document.getElementById("helpButtonSpan");
		var messageSpan;

		if(helpButton) {
			messageSpan = helpButton.querySelector(".message");
			messageSpan.innerHTML = text;

			helpButton.previousSibling.style.display = shouldShow ? "inline-block" : "none";
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
	 * @param {string} baseCoreUrl - The base URL for the server where ESW files live.
	 * @param {string} communityEndpointUrl - The base URL for the community.
	 * @param {string} gslbBaseUrl - The base URL for the global Salesforce load balancer.
	 * @param {string} orgId - The entity ID for the organization.
	 * @param {string} releaseVersion - The version number for this ESW snippet.
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

		if(typeof this.settings.baseCoreURL !== "string") throw new Error("Base core URL value must be a string.");

		if(!this.isOrganizationId(this.settings.orgId)) throw new Error("Invalid OrganizationId Parameter Value: " + this.settings.orgId);

		// If one of the event handlers returns false, cancel load.
		if(this.fireEvent("validateInit", function(responses) {
			return responses.indexOf(false) !== -1;
		}, this.settings)) {
			return;
		}

		if(this.settings.displayHelpButton && this.settings.appendHelpButton) this.loadCSS();

		if(!this.settings.targetElement) throw new Error("No targetElement specified");

		this.settings.iframeURL = this.settings.gslbBaseURL + "/embeddedservice/" + this.settings.releaseVersion +
			(this.settings.devMode ? "/eswDev.html" : "/esw.html") + "?parent=" + document.location.href;

		this.addSessionHandlers();

		this.loadFeatures();

		if(document.readyState === "complete") {
			// DOM is ready. Call domInit asynchronously in case caller expected
			// a delay.
			setTimeout(this.prepareDOM.bind(this), 1);
		} else if(document.addEventListener) {
			// Compliant browser
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
	 * Callback to fire when the help button is clicked.
	 */
	Snapins.prototype.onHelpButtonClick = function onHelpButtonClick() {
		if(!this.componentInitInProgress && !document.getElementsByClassName("embeddedServiceSidebar").length) {
			this.componentInitInProgress = true;
			try {
				this.initLightningOut(this.loginPendingSerializedData);
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
		var loginAttemptInterval;

		if(this.settings.linkAction.valid) {
			initialize = true;
		} else if(continueSession) {
			this.log("Existing session found. Continuing with data: " + serializedData);
			// If invitations are present on the page, remove them
			if(document.getElementById(INVITE_DOM_ID) && embedded_svc.inviteAPI) {
				embedded_svc.inviteAPI.inviteButton.setOnlineState(false);
			}
			initialize = true;
			useSerializedData = true;
		}

		if(initialize) {
			this.componentInitInProgress = true;
			if(this.requireLogin) {
				this.loginPendingSerializedData = useSerializedData ? serializedData : undefined;
				// Attempt to log in once the login JS has loaded.
				loginAttemptInterval = setInterval(function() {
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
			} else {
				this.initLightningOut(useSerializedData ? serializedData : undefined);
			}
		}

		if(this.settings.appendHelpButton) {
			this.appendHelpButton(this.settings.displayHelpButton && !continueSession);
		}
	};

	/**
	 * Send a message to the iframe.
	 *
	 * @param {string} method - String denoting the iframe functionality we want to invoke. See esw.html's onmessage handler.
	 * @param {Object} data - Any data required by the invoked method.
	 */
	Snapins.prototype.postMessage = function postMessage(method, data) {
		this.getESWFrame().postMessage({
			domain: this.settings.storageDomain,
			data: data,
			method: method
		}, this.settings.iframeURL);
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

		if(this.isFrameStorageEnabled()) {
			this.postMessage("session.set", map);
		} else {
			Object.keys(map).forEach(function(key) {
				window.sessionStorage.setItem(key, map[key]);
			});
		}
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

		if(this.isFrameStorageEnabled()) {
			this.postMessage("session.delete", array);
		} else {
			array.forEach(function(key) {
				window.sessionStorage.removeItem(key);
			});
		}
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
			this.storageKeys.push(name);
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
	 * Load the script files for the features enabled via settings.
	 */
	Snapins.prototype.loadFeatures = function loadFeatures() {
		this.settings.enabledFeatures.forEach(function(featureName) {
			if(this.availableFeatures.indexOf(featureName.toLowerCase()) === -1) {
				this.loadFeatureScript(featureName);
			}
		}.bind(this));
	};

	/**
	 * Add a handler for an event fired by the Snapins object.
	 *
	 * @param {string} event - The name of the event for which to listen.
	 * @param {function} callback - A callback function fired when the event occurs.
	 */
	Snapins.prototype.addEventHandler = function addEventHandler(event, handler) {
		if(!this.eventHandlers[event]) {
			this.eventHandlers[event] = [];
		}

		this.eventHandlers[event].push(handler);
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
				if(payload.method === "session.onLoad" && this.settings.iframeURL.indexOf(messageOrigin) === -1){
					// iframe may have been redirected due to org cookie w/ myDomain
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
	 */
	Snapins.prototype.isMessageFromSalesforceDomain = function isMessageFromSalesforceDomain(messageOriginUrl) {
		/**
		 * "Polyfill" for String.prototype.endsWith since IE doesn't support it.
		 *
		 * @param {string} first - Does the first string...
		 * @param {string} second - ...end with the second string?
		 */
		var endsWith = function(first, second) {
			return first.indexOf(second, first.length - second.length) !== -1;
		};

		return SALESFORCE_DOMAINS.some(function(salesforceDomain) {
			return endsWith(messageOriginUrl, salesforceDomain);
		});
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
		var anchor = document.querySelector(".embeddedServiceHelpButton a");
		var message;

		if(anchor) {
			message = anchor.querySelector(".message");

			if(message) {
				if(this.isButtonDisabled) {
					anchor.onclick = function() { };
					anchor.classList.remove("helpButtonEnabled");
					anchor.classList.add("helpButtonDisabled");
					message.innerHTML = this.settings.disabledMinimizedText;
				} else {
					anchor.onclick = this.onHelpButtonClick.bind(this);
					anchor.classList.remove("helpButtonDisabled");
					anchor.classList.add("helpButtonEnabled");
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
	 * @param {string} enabled - The text to display when the button is enabled.
	 * @param {string} disabled - The text to display when the button is disabled.
	 */
	Snapins.prototype.setDefaultButtonText = function setDefaultButtonText(featureName, enabled, disabled) {
		if(this.settings.entryFeature === featureName) {
			this.settings.defaultMinimizedText = this.settings.defaultMinimizedText || enabled;
			this.settings.disabledMinimizedText = this.settings.disabledMinimizedText || disabled;
		}
	};

	Snapins.prototype.registerLinkAction = function registerLinkAction(featureName, name) {
		var linkAction = this.settings.linkAction;

		// If we haven't triggered a link action yet, check to see if this link action is 
		if(linkAction.feature && linkAction.name && linkAction.feature.toLowerCase() === featureName.toLowerCase() && linkAction.name.toLowerCase() === name.toLowerCase()) {
			linkAction.valid = true;
			// Override this so that the feature name has the correct case.
			linkAction.feature = featureName;
			this.settings.entryFeature = featureName;
		}
	};

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

	Snapins.prototype.requireAuthentication = function requireAuthentication() {
		var scriptEl = document.createElement("script");
		var styleEl = document.createElement("style");
		var loginElement = document.querySelector(this.settings.loginTargetQuerySelector);

		this.requireLogin = true;

		// Initialize auth metadata
		if(!this.settings.loginClientId || !this.settings.loginRedirectURL || !this.settings.loginTargetQuerySelector) {
			throw new Error("Authentication with Field Service requires these valid settings params: loginClientId, loginRedirectURL, loginTargetQuerySelector.");
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

		// Login widget wants a function at the window level as a callback
		window[LOGIN_CALLBACK] = function() {
			var targetDiv = document.querySelector(this.settings.loginTargetQuerySelector);
			var newButton = document.createElement("button");

			if(this.loginButtonPressed || this.componentInitInProgress) {
				// Destroy original login button
				targetDiv.innerHTML = "";
				// Init LO app
				this.initLightningOut(this.loginPendingSerializedData);
			}
			// Replace with new field service start button. This is because the login widget will not render the original login
			// button if the page initializes logged in, so we need a new one.
			newButton.className = "fieldServiceStart";
			newButton.innerHTML = this.settings.fieldServiceStartLabel;
			newButton.addEventListener("click", this.onHelpButtonClick.bind(this));
			targetDiv.appendChild(newButton);
		}.bind(this);

		window[LOGOUT_CALLBACK] = function() {
			window.location.reload();
		};

		// Create a style to hide the dumb iframe that gets generated on logout.
		document.head.appendChild(styleEl);
		styleEl.sheet.insertRule(".sfid-logout { display: none; }", 0);

		// Get login widget js library
		scriptEl.type = "text/javascript";
		scriptEl.src = this.settings.communityEndpointURL + "/servlet/servlet.loginwidgetcontroller?type=javascript_widget";
		document.head.appendChild(scriptEl);
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