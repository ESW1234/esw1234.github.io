/* eslint no-console: "off" */
(function() {
	/**
	 * Handle events consumed by the iframe, and provide an API for storage script modules.
	 *
	 * @class
	 * @property {string} parentOrigin - The URL of the page which created the iframe.
	 * @property {object} messageHandlers - Callbacks for when certain messages are received by the storage iframe.
	 * @property {object} featureScripts - Storage feature scripts that have been loaded into the iframe.
	 * @property {string} unloadEvent - The unload event for this browser.
	 * @property {string} onloadEvent - The load event for this browser.
	 * @property {Object.<string, Array>} pendingMessages - A map of messages that are awaiting on features to be loaded.
	 * @property {Array.<string>} availableFeatures - A list of features that have been loaded into this frame.
	 */
	function ESW() {
		this.parentOrigin = undefined;
		this.messageHandlers = {};
		this.featureScripts = {};
		this.unloadEvent = this.getSafariType() === "none" ? "beforeunload" : "pagehide";
		this.onloadEvent = this.getSafariType() === "none" ? "load" : "pageshow";

		this.pendingMessages = {};
		this.availableFeatures = ["script"];

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

		this.loadFeatureScript("Session", function() {
			parent.postMessage({ method: "session.onLoad" }, this.parentOrigin);
		}.bind(this));

		this.addMessageHandler("script.load", function(domain, data) {
			this.loadFeatureScript(data);
		}.bind(this));
	}

	/**
	 * Log a message to the console if we're in dev mode.
	 *
	 * @param {*} message - The value to log.
	 */
	ESW.prototype.log = function log(message) {
		if(window.devMode) console.log(message);
	};

	/**
	 * Determine if this browser is a version of Safari, and if so, whether it's desktop or mobile.
	 *
	 * @returns {string} This browser's type of Safari.
	 */
	ESW.prototype.getSafariType = function getSafariType() {
		var userAgent = navigator.userAgent.toLowerCase();

		if(userAgent.indexOf("chrome") === -1 && userAgent.indexOf("safari") !== -1) {
			if(userAgent.indexOf("mobile") === -1) {
				return "desktop";
			} else {
				return "mobile";
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
			var domainStart;
			var originDomain;
			var feature;

			if(payload.method) {
				// Remove protocol from origin domain.
				domainStart = message.origin.indexOf("://") + 3;
				originDomain = message.origin.substring(domainStart);
							
				// Remove port if exists.
				originDomain = originDomain.split(":")[0];

				// Confirm the message origin is contained in the parent origin.
				if(message.origin !== window.esw.parentOrigin.substr(0, message.origin.length)) {
					console.log("Message origin must match parent origin!");

					return;
				}

				// Confirm storage domain must be origin or a subdomain of origin.
				if(originDomain !== payload.domain && originDomain.indexOf("." + payload.domain, originDomain.length - payload.domain.length - 1) === -1) {
					console.log("sessionDomain must be a subdomain of message origin!");
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
		var script = document.createElement("script");

		script.type = "text/javascript";
		script.src = "frame/" + lowerCaseName + ".esw" + (window.devMode ? "" : ".min") + ".js";

		script.onload = function() {
			this.featureScripts[featureName](this);
			if(callback) callback();

			this.availableFeatures.push(lowerCaseName);

			this.processPendingMessages(lowerCaseName);
		}.bind(this);

		document.body.appendChild(script);
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

