/*
 * Copyright, 2019, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 *
 * TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=fab.js --js_output_file=fab.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
 */
(function() {
	var ESW_SNIPPET_VERSION = "5.0";
	var ENDPOINT_API_VERSION = "48";

	var SCRT_ENDPOINT_URL;
	var SCRT_MAX_RETRY_ATTEMPTS = 3;
	var SCRT_RETRY_ATTEMPTS = 0;
	// Retry wait time - 60 seconds
	var SCRT_RETRY_WAIT = 60;

	// Stubbing out embedded_svc. This will be merged if Embedded Chat is enabled in channel menu.
	window.embedded_svc = {};

	function EmbeddedServiceMenu() {
		this.settings = {
			displayChannelMenu: true,
			devMode: false,
			releaseVersion: ESW_SNIPPET_VERSION,
			language: undefined,
			storageDomain: document.domain,
			hasBottomTabBar: false
		};

		// Keep track of events before we've finished initialization.
		this.storedEventHandlers = {};

		// Collision possibility is 1 in 10^15. Also UUID is passed along with the logs for us to identify the usersession by a unique identifier.
		this.UUID = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

		this.SPLUNK_METRICS = {
			timeTakenToLoadChannelMenu: "not loaded",
			channelMenuOptionsConfigured: [],
			countChannelCTAClicked: 0,
			channelMenuOpened: false,
			countChannelMenuOpened: 0,
			channelMenuName: "not initialized",
			uniqueId: this.UUID
		};

		// Epoch Milliseconds.
		this.START_TIME_FAB_LOAD = new Date().getTime();

		// [Chat] Initialize empty settings for Embedded Chat CTA
		// TODO: Remove this in 230+ when we fully deprecate this object.
		this.chat = {
			settings: {
				addEventHandler: this.addEventHandler.bind(this)
			}
		};
	}

	/**
	 * Create a script and load it onto document.body
	 *
	 * @param {String} scriptURL - The url for the script.
	 * @param {function} onLoadCallback - Callback for onLoad.
	 */
	function loadScriptFromURL(scriptURL, onLoadCallback) {
		var script = document.createElement("script");

		script.setAttribute("src", scriptURL);
		if(onLoadCallback) {
			script.onload = onLoadCallback;
		}

		document.body.appendChild(script);
	}

	/**
	 * Load a specified script from the directory specified.
	 *
	 * NOTE: This is method is duplicated in both fab.js and channelMenu.js,
	 * because if this is exposed to the public an end user could load any
	 * arbitrary js from one of our relative directories this is a security
	 * bug please see(W-6324408, W-6050892)
	 *
	 * @param {String} directory - The name of the directory the script resides in.
	 * @param {String} name - The name of the utility script to load.
	 * @param {Function} scriptOnLoadFunction - Function to call when the script is loaded.
	 */
	function loadScriptFromDirectory(directory, name, scriptOnLoadFunction) {
		var lowerCaseName = name.toLowerCase();
		var script = document.createElement("script");
		var baseURL = embedded_svc.menu.settings.gslbBaseURL;

		script.type = "text/javascript";
		script.src = [
			baseURL,
			"embeddedservice",
			embedded_svc.menu.settings.releaseVersion,
			directory,
			lowerCaseName + (embedded_svc.menu.settings.devMode ? "" : ".min") + ".js"
		].filter(Boolean).join("/");

		if(scriptOnLoadFunction) script.onload = scriptOnLoadFunction;

		document.body.appendChild(script);
	}

	/**
	 * Construct the JSONP URL.
	 *
	 * @return {String} - Returns JSONP URL
	 */
	function constructChannelMenuEndpointURL() {
		var endpoint = embedded_svc.menu.settings.liveAgentChatUrl + "/rest/EmbeddedService/EmbeddedServiceMenu.jsonp";
		if (embedded_svc.menu.settings.scrt2BaseUrl) {
			endpoint = embedded_svc.menu.settings.scrt2BaseUrl.replace(/\/$/, "") + "/embeddedservice/v1/embeddedServiceMenu.jsonp";
		}
		var language = embedded_svc.menu.settings.language;
		var channelMenuDevName = embedded_svc.menu.settings.channelMenuSettingDevName;
		var queryParams = "";

		queryParams += "?Settings.prefix=EmbeddedService";
		queryParams += "&org_id=" + embedded_svc.menu.settings.orgId;
		queryParams += "&EmbeddedServiceMenu.menuName=" + channelMenuDevName;
		queryParams += "&callback=embedded_svc.menu.processChannelMenuConfiguration";
		queryParams += "&version=" + ENDPOINT_API_VERSION;
		if(typeof language === "string" && language.trim().length > 0) {
			queryParams += "&EmbeddedServiceMenu.language=" + language;
		}

		return endpoint + queryParams;
	}

	/**
	 * Make the SCRT JSONP call
	 */
	function getChannelMenuConfiguration() {
		var scriptElem;

		// JSONP call to SCRT by adding a script tag to the page
		scriptElem = document.createElement("script");
		scriptElem.type = "text/javascript";
		scriptElem.src = SCRT_ENDPOINT_URL;
		// Add a cache busting retryAttempts no-op query string that forces the jsonp call to fetch from the server again
		if(SCRT_RETRY_ATTEMPTS) {
			scriptElem.src += "&retryAttempts=" + SCRT_RETRY_ATTEMPTS;
		}
		document.body.appendChild(scriptElem);
		SCRT_RETRY_ATTEMPTS += 1;
	}

	/**
	 * Retry the channel menu configuration call if there are available retry
	 * attempts, otherwise log an error message.
	 *
	 * @param {Object} message - Sent in the callback from the jsonp call.
	 */
	function retryChannelMenuConfigCall(message) {
		// Evaluate whether we should retry the config call
		if(SCRT_RETRY_ATTEMPTS >= SCRT_MAX_RETRY_ATTEMPTS ||
			message.type === "EmbeddedServiceError" && !message.message.shouldRetry) {
			// We should not retry if we have run out of retry attempts.
			// We should not retry if retry is set to false for EmbeddedServiceErrors.
			embedded_svc.utils.error("[Channel Menu] " + message.type + " from jsonp call: " + message.message.text);

			return;
		}

		// Retry if we have decided it is safe to retry.
		// Wait for the number of attempts times the retry wait to avoid SCRT overload. e.g. if wait is 60s - first retry after 60s, 2nd after 120s
		embedded_svc.utils.log("[Channel Menu] Getting deployment information failed. Retrying in " + SCRT_RETRY_WAIT * SCRT_RETRY_ATTEMPTS + " seconds..");
		setTimeout(getChannelMenuConfiguration, SCRT_RETRY_WAIT * SCRT_RETRY_ATTEMPTS * 1000);
	}

	/**
	 * Process channel menu settings response from the SCRT JSONP call.
	 * Channel Menu Settings call works in the same way as the Settings call for chat button.
	 * This is the callback function that is passed into the JSONP call
	 *
	 * @param {Array} data - Array of JSON objects e.g. [{type: "", message: {}}] sent in the callback from the jsonp call
	 */
	EmbeddedServiceMenu.prototype.processChannelMenuConfiguration = function processChannelMenuConfiguration(data) {
		data.messages.forEach(function(message) {
			// If we fail to retrieve the core version from  SCRT fallback
			// to unversioned channelMenu.js
			var scriptURL = embedded_svc.menu.settings.gslbBaseURL +
				"/embeddedservice/menu/channelMenu" +
				(embedded_svc.menu.settings.devMode ? "" : ".min") + ".js";

			// Use versioned channelMenu.js if we get a version from the rest response.
			if(message.type === "EmbeddedServiceMenu") {
				// Store response as JSON object on menuConfig.
				embedded_svc.menu.menuConfig = message.message;
				if(embedded_svc.menu.menuConfig.additionalSettings) {
					if(embedded_svc.menu.menuConfig.additionalSettings.eswFilesVersion) {
						embedded_svc.menu.settings.eswFilesVersion = embedded_svc.menu.menuConfig.additionalSettings.eswFilesVersion;
						scriptURL = embedded_svc.menu.settings.gslbBaseURL +
							"/embeddedservice/menu/" +
							embedded_svc.menu.settings.eswFilesVersion +
							"/channelMenu" +
							(embedded_svc.menu.settings.devMode ? "" : ".min") + ".js";
					}
				}

				// Finish initializing the fab using the logic held in the channelMenu.js file now
				// that the SCRT JSONP call was successful.
				// CUSTOM: Override scriptURL to use our hosted custom channelMenu.js on github.io.
				scriptURL = "https://esw1234.github.io/godwin/assets/js/channelMenu.js";
				loadScriptFromURL(scriptURL,
					function() {embedded_svc.menu.processChannelMenuConfigurationData(); });
			} else if(message.type === "SwitchServer") {
				// Live agent server has changed due to org migration. Recreating SCRT_ENDPOINT_URL
				embedded_svc.utils.warning("[Channel Menu] Your org has been migrated on the service cloud real time servers. Consider regenerating the snippet for this page.");
				embedded_svc.menu.settings.liveAgentChatUrl = message.message.newUrl;
				// Reset retry attempts as we'll be using the new url
				SCRT_RETRY_ATTEMPTS = 0;
				SCRT_ENDPOINT_URL = constructChannelMenuEndpointURL();
				getChannelMenuConfiguration();
			} else if(message.type === "EmbeddedServiceError" || message.type === "Error") {
				retryChannelMenuConfigCall(message);
			} else {
				embedded_svc.utils.error("[Channel Menu] Unexpected message type from jsonp call: " + message.type);
			}
		});
	};

	EmbeddedServiceMenu.prototype.finishInit = function finishInit() {
		// Register stored events before init was called with common utils.
		if(this.storedEventHandlers) {
			Object.getOwnPropertyNames(this.storedEventHandlers).forEach(function(eventName) {
				this.storedEventHandlers[eventName].forEach(function(eventHandler) {
					embedded_svc.utils.addEventHandler(eventName, eventHandler);
				});
			}.bind(this));

			// Clean up.
			this.storedEventHandlers = {};
		}

		if(!window.embedded_svc.utils.isOrganizationId(embedded_svc.menu.settings.orgId)) {
			throw new Error("Invalid OrganizationId Parameter Value: " + embedded_svc.menu.settings.orgId);
		}

		SCRT_ENDPOINT_URL = constructChannelMenuEndpointURL();

		// Retrieve deployment-specific configurations from server if no chat present on page already
		// TODO: Find a better hook for continuing active chat sessions in channel menu. This always evaluates to false on page load.
		if(embedded_svc.liveAgentAPI) {
			// Do not make the REST call if there's already an existing session of chat.
			embedded_svc.utils.addEventHandler("sessionDataRetrieved", function(serializedData) {
				if(!serializedData.CHASITOR_SERIALIZED_KEY) {
					getChannelMenuConfiguration();
				}
			});
		} else {
			getChannelMenuConfiguration();
		}
	};

	/**
	 * Entry point initialization function (invoked by the snippet).
	 *
	 * @param {string} baseCoreURL - The base URL for the server where ESW files live.
	 * @param {string} liveAgentChatUrl -  Live agent chat url on SCRT server.
	 * @param {string} gslbBaseURL - The base URL for the global Salesforce load balancer.
	 * @param {string} orgId - The entity ID for the organization.
	 * @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	 * @param {object} channelMenuSettingDevName - The developer name for the Channel Menu Settings object.
	 * @param {object} additionalSettings - Additional settings for initializing the Channel Menu deployment.
	 */
	EmbeddedServiceMenu.prototype.init = function init(baseCoreURL, liveAgentChatUrl, gslbBaseURL, orgId, channelMenuSettingDevName, additionalSettings) {
		if(typeof baseCoreURL !== "string") {
			throw new Error("baseCoreURL value must be a string.");
		}

		if(typeof liveAgentChatUrl !== "string") {
			throw new Error("liveAgentChatUrl value must be a string.");
		}

		if(typeof orgId !== "string") {
			throw new Error("orgId value must be a string.");
		}

		if(typeof channelMenuSettingDevName !== "string") {
			throw new Error("channelMenuSettingDevName value must be a string.");
		}

		this.settings.baseCoreURL = baseCoreURL;
		this.settings.liveAgentChatUrl = liveAgentChatUrl;
		this.settings.gslbBaseURL = gslbBaseURL ? gslbBaseURL : baseCoreURL;
		this.settings.orgId = orgId;
		this.settings.channelMenuSettingDevName = channelMenuSettingDevName;
		this.SPLUNK_METRICS.channelMenuName = this.settings.channelMenuSettingDevName;

		if(additionalSettings && additionalSettings.hasOwnProperty("pageName") && typeof additionalSettings.pageName === "string" && additionalSettings.pageName.length) {
			this.settings.pageName = additionalSettings.pageName;
		}

		// Load common utils.
		loadScriptFromDirectory("utils", "common", function() {
			embedded_svc.menu.finishInit();
		});

		// [A11Y] Load inert script asynchronously if not yet loaded.
		if(document.querySelector("style#inert-style")) {
			return;
		}
		loadScriptFromDirectory("utils", "inert");
	};


	/**
	 * (Proxy) Add a handler for an event fired by the Snapins object.
	 * If called before init then the events are stored to be passed to embedded_svc.utils
	 * in the finishInit method. Updates to this code/pattern should be made in esw.js as well
	 * as it uses the same code/pattern.
	 *
	 * @param {string} event - The name of the event for which to listen.
	 * @param {function} handler - A callback function fired when the event occurs.
	 */
	EmbeddedServiceMenu.prototype.addEventHandler = function addEventHandler(event, handler) {
		if(window.embedded_svc && embedded_svc.utils) {
			embedded_svc.utils.addEventHandler(event, handler);
		} else {
			// If common.js hasn't loaded yet, store the event so that it can be added once init is called.
			if(!this.storedEventHandlers[event]) {
				this.storedEventHandlers[event] = [];
			}

			this.storedEventHandlers[event].push(handler);
		}
	};

	window.embedded_svc.menu = new EmbeddedServiceMenu();
})();
