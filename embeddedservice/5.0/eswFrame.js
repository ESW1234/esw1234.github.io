/* eslint no-console: "off" */
/*
 * Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=eswFrame.js --js_output_file=eswFrame.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
 */

(function() {
	// This is needed to prevent attempts to load hostile script
	var features = ["broadcast", "chasitor", "filetransfer", "session"];

	/**
	 * Handle events consumed by the iframe, and provide an API for storage script modules.
	 *
	 * @class
	 * @property {string} parentOrigin - The URL of the page which created the iframe.
	 * @property {object} messageHandlers - Callbacks for when certain messages are received by the storage iframe.
	 * @property {object} featureScripts - Storage feature scripts that have been loaded into the iframe.
	 * @property {Object.<string, Array>} pendingMessages - A map of messages that are awaiting on features to be loaded.
	 * @property {Array.<string>} availableFeatures - A list of features that have been loaded into this frame.
	 */
	function ESW() {
		this.parentOrigin = undefined;
		this.messageHandlers = {};
		this.featureScripts = {};
		this.sessionLoaded = false;

		this.pendingMessages = {};
		this.availableFeatures = ["script"];

		//Determine what web storage we have
		try {
			window.localStorage;
		} catch(error) {
			this.noLocalStorageAvailable = true;
			this.log("localStorage is not available. User chat sessions continue only in a single-page view and not across multiple pages.", true);
		}
		try {
			window.sessionStorage;
		} catch(error) {
			this.noSessionStorageAvailable = true;
			this.log("sessionStorage is not available. User chat sessions end after a web page refresh or across browser tabs and windows.", true);
		}

		// Get the domain stored in the window's location.
		window.location.search.replace(/([a-zA-Z0-9]+)=([\S]+)/g, function(match, key, value) {
			if(key === "parent") {
				// Only take the parts between the first instance of // and the / following it.
				this.parentOrigin = value;
			}
		}.bind(this));

		if(!this.parentOrigin) {
			console.error("No domain set!");

			return;
		}

		this.addEventListeners();

		this.loadFeatureScript("Session");

		// Load the broadcastAPI which we use to broadcast our events to all open tabs.
		this.loadFeatureScript("Broadcast");

		this.addMessageHandler("script.load", function(domain, data) {
			this.loadFeatureScript(data);
		}.bind(this));

		// Update session storage and send a message back to the parent frame to continue loading
		this.addMessageHandler("session.updateStorage", function(domain, data) {
			// Wait time for receiving session data from the primary tab
			// 500ms seems enough time for a storage event to request sessionData and another event to send the data
			var SESSIONDATA_WAIT_TIME = 500;
			var deploymentId = data.deploymentId;

			var activeChatSessions = JSON.parse(esw.sessionAPI.getSessionData(domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}");

			var isPrimary = false;
			var sessionDataReceived = false;
			// Used to track if a new tab was opened in IE11 or Edge either with a right click or clicking a link to a new tab.
			var newTabOpenedInIEOrEdge = (this.isInternetExplorer() || this.isEdge()) && history.length === 1 && !data.isRefresh;

			// Check if chasitor navigated to a page with the same deployment ID.
			if(esw.sessionAPI.getSessionData(domain, ["MASTER_DEPLOYMENT_ID"]).MASTER_DEPLOYMENT_ID === deploymentId) {
				/**
				 * Check if the navigation is to the same domain.
				 * IE & Edge do not support multiple tabs, clear session storage if this is a new tab where session storage got copied over.
				 */
				if(data.isSamePageNavigation && !newTabOpenedInIEOrEdge) {
					// Parent page reloaded or link navigation on same domain and we already checked for MASTER_DEPLOYMENT_ID in sessionStorage.
                    isPrimary = true;
				} else {
					// Followed a link in chrome or opened a tab in IE which copied session Storage data to the new tab
					// Delete primary tab's deployment id and serialized key from session storage to avoid lost connection due to multiple chasitor.js
					esw.sessionAPI.deleteSessionData(domain, ["CHASITOR_SERIALIZED_KEY", "MASTER_DEPLOYMENT_ID"]);
				}
			}

			// Copy sessionStorage data received from primary tab into the secondary tab. Param eventData includes sessionStorage and domain.
			esw.broadcastAPI.on("sessionStorageData", function(eventData) {
				var eventObj = JSON.parse(eventData.sessionStorage);

				/**
				 * If session is already loaded don't copy the sessionStorage data. This is to avoid copying of sessionStorage data after
				 * we've moved on assuming the primary tab isn't responding. Also to avoid having new widgets being created for each new secondary tab
				 * opened. Check also that the domain that we are only setting session data for the domain that the requesting secondary tab is
				 * coming from. Without this check, secondary tabs will receive session data from ALL primary tabs (that could be on various domains).
				 */
				if(!this.sessionLoaded && eventData.domain === domain) {
					// Now that we know we received a request from this domain, copy session data information.
					sessionDataReceived = true;
					Object.getOwnPropertyNames(eventObj).forEach(function(key) {
						// Skip copying the MASTER_DEPLOYMENT_ID key to the secondary tab.
						if(key.indexOf("MASTER_DEPLOYMENT_ID") === -1) {
							sessionStorage.setItem(key, eventObj[key]);
						}
					});
					this.sessionLoaded = true;
					// Notify parent frame that the copying is complete to resume load
					parent.postMessage({ method: "session.onLoad" }, this.parentOrigin);
				}
			}.bind(this));

			// Send session data over to the secondary tabs. Data will include a deploymentId and the domain that requested session data.
			esw.broadcastAPI.on("getSessionStorageData", function(data) {
				// Check that the call for session data came from this same domain.
				if(data.domain === domain) {
					// Send session data only if you're primary tab of the passed in deploymentId, else skip to avoid duplicate data.
					if(isPrimary || esw.sessionAPI.getSessionData(domain, ["MASTER_DEPLOYMENT_ID"]).MASTER_DEPLOYMENT_ID === data.deploymentId) {
						esw.broadcastAPI.send("sessionStorageData", {
							sessionStorage: JSON.stringify(sessionStorage),
							domain: domain
						});
					}
				}
			});

			/**
			 * If there is an active session already for the deployment and if you're not the primary tab, ask for session data from primary tab. Pass in this
			 * domain so that in our on("getSessionStorageData") handler we only send data from this domain.
			 */
			if(activeChatSessions[data.deploymentId] && !isPrimary) {
				esw.broadcastAPI.send("getSessionStorageData", {
					deploymentId: data.deploymentId,
					domain: domain
				});
				// Wait for 500ms to receive data from the primary tab
				// If no data received just load chat button and clear active chat sessions in local storage
				setTimeout(function() {
					if(!sessionDataReceived) {
						this.sessionLoaded = true;
						delete activeChatSessions[data.deploymentId];
						esw.sessionAPI.setSessionData(domain, { ACTIVE_CHAT_SESSIONS: JSON.stringify(activeChatSessions) }, true);
						parent.postMessage({ method: "session.onLoad" }, this.parentOrigin);
					}
				}.bind(this),
				SESSIONDATA_WAIT_TIME);
			} else {
				parent.postMessage({ method: "session.onLoad" }, this.parentOrigin);
			}
		}.bind(this));
		
		//notify parent frame that we've finished loading
		parent.postMessage({ method: "session.frameReady" }, this.parentOrigin);
	};

	/**
	 * Return true if current browser is Internet Explorer.
	 *
	 * This function was copied from esw.js.
	 *
	 * @return {boolean} True if client browser is Internet Explorer.
	 */
	ESW.prototype.isInternetExplorer = function() {
		return "ActiveXObject" in window;
	};

	/**
	 * Return true if current browser is Edge.
	 *
	 * @return {boolean} True if client browser is Edge
	 */
	ESW.prototype.isEdge = function() {
		if(window.navigator && window.navigator.userAgent && typeof window.navigator.userAgent === "string") {
			return window.navigator.userAgent.indexOf("Edge") > -1;
		}

		return false;
	};

	/**
	 * Log a message to the console if we're in dev mode.
	 *
	 * @param {*} message - The value to log.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	ESW.prototype.log = function log(message, alwaysOutput) {
		if(window.devMode || alwaysOutput) console.log(message);
	};

	/**
	 * Determine if this browser is a version of Safari, and if so, whether it's desktop or mobile.
	 *
	 * @returns {string} This browser's type of Safari.
	 */
	ESW.prototype.getSafariType = function getSafariType() {
		var userAgent = navigator.userAgent.toLowerCase();
		var isSafariMobile = !window.safari;
		var touchEndEventExists = "ontouchend" in document;

		if(userAgent.indexOf("chrome") === -1 && userAgent.indexOf("safari") !== -1) {
			if(isSafariMobile && touchEndEventExists) {
				return "mobile";
			} else {
				return "desktop";
			}
		}

		return "none";
	};

	/**
	 * Register a callback for a received message with a given name.
	 *
	 * @param {string} name - The name of the message for which to listen.
	 * @param {function(data)} handler - Callback which receives the message's data.
	 */
	ESW.prototype.addMessageHandler = function addMessageHandler(name, handler) {
		this.messageHandlers[name] = handler;
	};

	/**
	 * Add the window-level event listener for messages.
	 *
	 * The message listener will delay the processing of messages if the required feature
	 * has not yet been loaded. You must prefix your messages with the name of the feature
	 * (i.e. "chasitor.doSomething"), or else they will be stuck pending forever.
	 *
	 * Outgoing messages have the same restriction, but the feature name needs to be the client name,
	 * not the frame name.
	 */
	ESW.prototype.addEventListeners = function addEventListeners() {
		window.addEventListener("message", function(message) {
			var payload = message.data;
			var payloadDomainOrigin;
			var domainStart;
			var originDomain;
			var feature;

			if(payload && payload.method) {
				// Remove protocol from origin domain.
				domainStart = message.origin.indexOf("://") + 3;
				originDomain = message.origin.substring(domainStart);

				// Remove port if exists.
				originDomain = originDomain.split(":")[0];

				// Store a copy of the payload's domain to not change the content of payload during domain validation.
				payloadDomainOrigin = payload.domain;

				// If message origin domain is a community, only use the origin of payload.domain, see adjustCommunityStorageDomain in esw.js.
				if(payloadDomainOrigin && originDomain.substr(-".force.com".length) === ".force.com") {
					payloadDomainOrigin = payloadDomainOrigin.split("/")[0];
				}

				// Confirm the message origin is contained in the parent origin.
				if(message.origin !== window.esw.parentOrigin.substr(0, message.origin.length)) {
					console.log("Message origin must match parent origin!");

					return;
				}

				// Confirm storage domain must be origin or a subdomain of origin.
				if(originDomain !== payloadDomainOrigin && originDomain.indexOf("." + payloadDomainOrigin, originDomain.length - payloadDomainOrigin.length - 1) === -1) {
					console.log("storageDomain (" + payload.domain + ") must be a parent of message origin domain (" + originDomain + ")!");

					return;
				}

				feature = payload.method.split(".")[0].toLowerCase();

				if(this.availableFeatures.indexOf(feature) === -1) {
					if(!this.pendingMessages[feature]) this.pendingMessages[feature] = [];
					this.pendingMessages[feature].push(payload);
				} else {
					this.handleMessage(payload);
				}
			}
		}.bind(this), false);
	};

	/**
	 * Handle a message given its payload.
	 *
	 * @param {Object} payload - Information on the received message;
	 */
	ESW.prototype.handleMessage = function handleMessage(payload) {
		if(this.messageHandlers[payload.method]) {
			this.messageHandlers[payload.method](payload.domain, payload.data);
		} else {
			console.log("Unregistered method " + payload.method + " received in frame.");
		}
	};

	/**
	 * Define a feature module so that it can be loaded in at runtime.
	 *
	 * @param {string} featureName - The name of the feature.
	 * @param {function} contents - The module's JS contents.
	 */
	ESW.prototype.defineFeature = function defineFeature(featureName, contents) {
		this.featureScripts[featureName] = contents;
	};

	/**
	 * Load the storage script belonging to a feature. If a callback is specified, it will be run
	 * after the script is loaded.
	 *
	 * The script file should be entirely lowercase, and end with ".esw.js" or ".esw.min.js".
	 *
	 * @param {string} featureName - The name of the feature to load.
	 * @param {function()} callback - A callback to fire once the script has loaded.
	 */
	ESW.prototype.loadFeatureScript = function loadFeatureScript(featureName, callback) {
		var lowerCaseName = featureName.toLowerCase();
		var script;

		if(features.indexOf(lowerCaseName) > -1) {
			script = document.createElement("script");

			script.type = "text/javascript";
			script.src = "frame/" + lowerCaseName + ".esw" + (window.devMode ? "" : ".min") + ".js";

			script.onload = function() {
				this.featureScripts[featureName](this);
				if(callback) callback();

				this.availableFeatures.push(lowerCaseName);

				this.processPendingMessages(lowerCaseName);
			}.bind(this);

			document.body.appendChild(script);
		} else {
			throw new Error("\"" + featureName + "\" is not a valid feature name.");
		}
	};

	/**
	 * Post a message to the parent page.
	 *
	 * @param {string} method - String denoting the page functionality we want to invoke.
	 * @param {Object} data - Any data required by the invoked method.
	 */
	ESW.prototype.postMessage = function postMessage(method, data) {
		parent.postMessage({
			method: method,
			data: data
		}, this.parentOrigin);
	};

	/**
	 * If all the scripts have loaded, process any pending messages.
	 */
	ESW.prototype.processPendingMessages = function processPendingMessages(featureName) {
		if(this.pendingMessages[featureName]) {
			this.pendingMessages[featureName].forEach(function(payload) {
				this.handleMessage(payload);
			}.bind(this));

			this.pendingMessages[featureName] = undefined;
		}
	};

	window.esw = new ESW();
})();
