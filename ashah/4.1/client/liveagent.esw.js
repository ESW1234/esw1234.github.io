embedded_svc.defineFeature("LiveAgent", function(esw) {
	var VISITOR_INFO_KEY = "LA_VISITOR_INFO";
	var AVAILABILITY_PING_TIMEOUT = 5000;
	var AVAILABILITY_PING_RATE = 50000;
	var SCRT_API_VERSION = 36;
	// Static html for invite should have this id
	var INVITE_DOM_ID = "snapins_invite";

	/**
	 * An SCRT noun and accompanying data.
	 *
	 * @class
	 * @param {string} name - The name of the noun.
	 * @param {object} data - The noun's data.
	 * @property {string} name - The name of the noun.
	 * @property {object} data - The noun's data.
	 */
	function Noun(name, data) {
		this.name = name;
		this.data = data;
	}

	/**
	 * Functionality for polling the SCRT server.
	 *
	 * @class
	 * @param {LiveAgentAPI} liveAgentApi - The API object to which this belongs.
	 * @property {LiveAgentAPI} liveAgentAPI - The API object to which this belongs.
	 * @property {boolean} running - Are we currently polling?
	 * @property {number} pingTimeoutTimer - The timeout ID for the current ping request.
	 * @property {HTMLElement} pingScript - The DOM element for the current script request.
	 * @property {string} sid - The ID for this Live Agent session.
	 */
	function SCRTConnection(liveAgentApi) {
		this.liveAgentAPI = liveAgentApi;
		this.running = false;
		this.pingTimeoutTimer = undefined;
		this.pingScript = undefined;
		this.sid = esw.getCookie("liveagent_sid");
	}

	/**
	 * Process a list of nouns and params and make a server request accordingly.
	 *
	 * @param {Noun|Array.<Noun>} nouns - One or more nouns to request.
	 * @param {object} params - Data to attach to the nouns.
	 */
	SCRTConnection.prototype.send = function send(nouns, params) {
		var paramData = params || {};
		var prefix = "Visitor";
		var noun = "";
		var isMultinoun = false;
		var url;
		var scriptElem;

		if(this.pingScript) {
			this.onError("SCRT did not handle response before sending another message.");
			
			return;
		}

		if(nouns.length > 1) {
			prefix = "System";
			noun = "MultiNoun";
			paramData.nouns = "";
			isMultinoun = true;
		} else {
			noun = nouns[0].name;
		}

		url = esw.settings.baseLiveAgentURL + "/rest/" + prefix + "/" + noun + ".jsonp?";
		nouns.forEach(function(nounItem) {
			if(isMultinoun) paramData.nouns += nounItem.name + ",";

			paramData[nounItem.name + ".prefix"] = "Visitor";

			Object.getOwnPropertyNames(nounItem.data).forEach(function(property) {
				paramData[nounItem.name + "." + property] = nounItem.data[property];
			});
		});

		if(isMultinoun) {
			paramData.nouns = paramData.nouns.substr(0, paramData.nouns.length - 1);
		}

		Object.getOwnPropertyNames(paramData).forEach(function(paramKey) {
			url += paramKey + "=" + paramData[paramKey] + "&";
		});

		url += "callback=embedded_svc.liveAgentAPI.connection.handlePing" +
			"&deployment_id=" + esw.settings.deploymentId +
			"&org_id=" + esw.settings.orgId +
			"&version=" + SCRT_API_VERSION;

		scriptElem = document.createElement("script");
		scriptElem.type = "text/javascript";
		scriptElem.src = url;

		this.pingScript = document.body.appendChild(scriptElem);
		this.pingTimeoutTimer = window.setTimeout(function() {
			this.onError("Server failed to respond.");
		}.bind(this), AVAILABILITY_PING_TIMEOUT);
	};

	/**
	 * Callback for when the ping request is complete.
	 *
	 * @param {object} data - The data returned by the ping.
	 */
	SCRTConnection.prototype.handlePing = function handlePing(data) {
		if(this.pingTimeoutTimer) {
			clearTimeout(this.pingTimeoutTimer);
			this.pingTimeoutTimer = undefined;
		}

		this.running = true;

		data.messages.forEach(function(message) {
			this.messageHandler(message.type, message.message);
		}.bind(this));

		this.onSuccess();

		if(this.pingScript) {
			document.body.removeChild(this.pingScript);
			this.pingScript = undefined;
		}
	};

	/**
	 * Handle a ping's response depending on the type of message.
	 *
	 * @param {string} type - The type of message recieved.
	 * @param {object} data - Data received within the message.
	 */
	SCRTConnection.prototype.messageHandler = function messageHandler(type, message) {
		switch(type) {
			case "Availability":
				this.liveAgentAPI.handleAvailability(message);
				break;
			case "SwitchServer":
				this.liveAgentAPI.handleSwitchServer(message);
				break;
			case "Settings":
				this.liveAgentAPI.handleSettings(message);
				break;
			default:
				esw.log("Unexpected message of type " + type + ": " + JSON.stringify(message));
		}
	};

	/**
	 * On a successful ping, make another poll request.
	 *
	 * @param {number} [nextPingTimeout] - An optional override for the next ping timeout.
	 */
	SCRTConnection.prototype.onSuccess = function onSuccess(nextPingTimeout) {
		var timeout = nextPingTimeout || AVAILABILITY_PING_RATE;

		if(this.pingTimer) {
			clearTimeout(this.pingTimer);
		}

		this.pingTimer = window.setTimeout(this.liveAgentAPI.ping.bind(this.liveAgentAPI), timeout);
	};

	/**
	 * Callback for when a ping request returns with an error.
	 *
	 * @param {string} message - The received error message.
	 */
	SCRTConnection.prototype.onError = function onError(message) {
		esw.error(message);
	};

	/**
	 * Class for providing visitor info funtionality to Live Agent.
	 *
	 * @class
	 * @property {number} visitCount - The number of times the visitor has accessed a snippet-enabled page.
	 * @property {string} originalReferrer - The page that brought the visitor to a snippet-enabled page for the first time.
	 * @property {Array.<PageVisit>} pages - A list of snippet-enabled pages visited by the visitor, most recent first.
	 */
	function VisitorInfo() {
		this.visitCount = 0;
		this.originalReferrer = undefined;
		this.pages = [];
	}

	/**
	 * Initialize this VisitorInfo object, retrieving existing data if any exists and logging the current page.
	 *
	 * @param {object} serializedData - Serialized data from the session storage iframe.
	 */
	VisitorInfo.prototype.initialize = function initialize(serializedData) {
		var parsedVisitorInfo;

		if(serializedData && serializedData[VISITOR_INFO_KEY]) {
			parsedVisitorInfo = JSON.parse(serializedData[VISITOR_INFO_KEY]);

			this.visitCount = parsedVisitorInfo.visitCount;
			this.originalReferrer = parsedVisitorInfo.originalReferrer;
			this.pages = parsedVisitorInfo.pages;
		} else {
			this.originalReferrer = document.referrer;
		}

		this.visitCount += 1;
		this.addCurrentPage();

		// Reserialize the data for future visits.
		this.serialize();
	};

	/**
	 * Store updated visitor info back into the iframe.
	 */
	VisitorInfo.prototype.serialize = function serialize() {
		var visitorInfoJSON = JSON.stringify({
			visitCount: this.visitCount,
			originalReferrer: this.originalReferrer,
			pages: this.pages
		});

		if(embedded_svc) {
			embedded_svc.setSessionData(VISITOR_INFO_KEY, visitorInfoJSON);
		} else {
			window.sessionStorage.setItem(VISITOR_INFO_KEY, visitorInfoJSON);
		}
	};

	/**
	 * Retrieve the currently collected visitor info.
	 */
	VisitorInfo.prototype.getInfo = function getInfo() {
		return {
			visitCount: this.visitCount,
			originalReferrer: this.originalReferrer,
			pages: this.pages
		};
	};

	/**
	 * Information on a page visit.
	 *
	 * @class PageVisit
	 * @property {string} location - The URL of the visited page.
	 * @property {number} time - Unix timestamp when the page was visited.
	 */

	/**
	 * Add the current page to the page history.
	 */
	VisitorInfo.prototype.addCurrentPage = function addCurrentPage() {
		var currentPage = window.location.href;

		// Remove the page from the history if it exists.
		this.pages.forEach(function(page, index) {
			if(page.location === currentPage) {
				this.pages.splice(index, 1);
			}
		}.bind(this));

		// Add it to the zeroth position.
		this.pages.unshift({
			location: currentPage,
			time: (new Date()).getTime()
		});
	};

	/**
	 * Feature module for providing Live Agent functionality before the sidebar is loaded.
	 *
	 * @class
	 * @param {SCRTConnection} connection - The ping handler for this module.
	 * @param {VisitorInfo} visitorInfo - Visitor info handler for this module.
	 */
	function LiveAgentAPI() {
		this.connection = new SCRTConnection(this);
		this.visitorInfo = new VisitorInfo();
		// Load the invite script
		esw.loadFeatureScript("Invite", function() {
			// Gets the settings on the button
			embedded_svc.liveAgentAPI.getButtonSettings();
		});

		esw.setDefaultButtonText("LiveAgent", "Chat with an Expert", "Agent Offline");

		esw.addDefaultSetting("avatarImgURL", "");
		esw.addDefaultSetting("prechatBackgroundImgURL", "");
		esw.addDefaultSetting("waitingStateBackgroundImgURL", "");
		esw.addDefaultSetting("smallCompanyLogoImgURL", "");
		esw.addDefaultSetting("headerBackgroundURL", "");
		esw.addDefaultSetting("extraPrechatInfo", []);
		esw.addDefaultSetting("extraPrechatFormDetails", []);
		
		esw.addEventHandler("error", this.disconnect.bind(this));

		esw.addEventHandler("sessionDataRetrieved", function(serializedData) {
			this.ping();

			// Initialize visitor info service.
			this.visitorInfo.initialize(serializedData);

			// If there is a serialized key, restore the session.
			return !!serializedData.CHASITOR_SERIALIZED_KEY;
		}.bind(this));

		esw.addEventHandler("beforeCreate", function() {
			esw.settings.visitorInfo = this.visitorInfo.getInfo();
		}.bind(this));

		esw.addEventHandler("validateInit", function(settings) {
			if(typeof settings.baseLiveAgentURL !== "string") {
				throw new Error("Invalid Live Agent chat URL: " + settings.baseLiveAgentURL);
			}

			if(typeof settings.baseLiveAgentContentURL !== "string") {
				throw new Error("Invalid Live Agent content URL: " + settings.baseLiveAgentContentURL);
			}

			if(!this.isButtonId(settings.buttonId)) {
				throw new Error("Invalid ButtonId Parameter Value: " + settings.buttonId);
			}
		
			if(!this.isDeploymentId(settings.deploymentId)) {
				throw new Error("Invalid DeploymentId Parameter Value: " + settings.deploymentId);
			}

			return true;
		}.bind(this));

		esw.loadStorageScript("Chasitor");

		esw.addMessageHandler("liveagent.fileTransfer.recieveFileTransfer", function(data) {
			this.sendFileInfo(data);
		}.bind(this));

		esw.registerStorageKeys([
			"CHASITOR_SERIALIZED_KEY",
			"LA_ESW_UNREAD_NOTIFICATIONS",
			"LA_ESW_CHAT_SCROLL_POSITION",
			"LA_ESW_UNSEEN_MESSAGES",
			"LA_VISITOR_INFO",
			"LA_ESW_FILE_TOKEN",
			"LA_ESW_FILE_UPLOAD_SERVLET_URL"
		]);

		if(esw.settings.entryFeature === "LiveAgent") {
			esw.isButtonDisabled = true;
		}
	}

	/**
	 * Pings the Live Agent server to get button availability updates.
	 */
	LiveAgentAPI.prototype.ping = function ping() {
		var params = {};
		var nouns = [
			new Noun("Availability", { ids: "[" + esw.settings.buttonId + "]" })
		];

		esw.log("Pinging server");

		this.connection.pingTimer = undefined;
		params.sid = this.sid;
		params.r = new Date().getMilliseconds();

		this.connection.send(nouns, params);
	};

	/**
	 * Trimmed from https://github.com/douglascrockford/JSON-js/blob/master/json2.js
	 * Approval: https://gus.salesforce.com/a0qB00000000776
	 * @param {string} str
	 **/
	function jsonDecode(str) {
		var escape = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		var returnStr = String(str);

		if(typeof window.JSON !== "undefined") {
			return window.JSON.parse(returnStr);
		}

		escape.lastIndex = 0;
		if(escape.test(str)) {
			returnStr = returnStr.replace(escape, function(match) {
				return "\\u" + ("0000" + match.charCodeAt(0).toString(16)).slice(-4);
			});
		}
		if(/^[\],:{}\s]*$/.test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
			return eval("(" + returnStr + ")");
		}

		throw new Error("Error during JSON.parse");
	}

	/**
	 * Pings the Live Agent server to get button settings.
	 */
	LiveAgentAPI.prototype.getButtonSettings = function getButtonSettings() {
		// First ping to the server involves getting a session ID (if necessary) and
		// getting the settings for the deployment and buttons being used on this page
		var nouns = [];
		var params = {};

		if(this.sid) {
			params.sid = this.sid;
			params.r = new Date().getMilliseconds();
			esw.log("Reusing existing session.");
		}
		nouns.push(new Noun("Settings", { buttonIds: "[" + esw.settings.buttonId + "]",
										  updateBreadcrumb: 1 }));
		this.connection.send(nouns, params);
	};

	/**
	 * Update the status of the help button based on agent availability.
	 *
	 * @param {Object} message - The availability data as received from the ping.
	 */
	LiveAgentAPI.prototype.handleAvailability = function handleAvailability(message) {
		esw.log("Agent Available: " + JSON.stringify(message));

		message.results.forEach(function(result) {
			var agentAvailable = result.isAvailable;

			if(esw.settings.entryFeature === "LiveAgent") {
				esw.isButtonDisabled = !agentAvailable;
				// Update invite button online state based on agent availability
				if(esw.inviteAPI && esw.inviteAPI.inviteButton.getTracker()) {
					esw.inviteAPI.inviteButton.setOnlineState(agentAvailable);
				}
			}
		});
	};

	/**
	 * Update invite button based on the settings for the button
	 * 
	 * @param {*} data - settings data for the button
	 */
	function handleInviteButton(data) {
		var inviteElement;
		var inviteRules = jsonDecode(data.inviteRules);
		
		inviteElement = document.getElementById(INVITE_DOM_ID);
		// Update invite button, Do nothing if there's no matching dom id or 
		// animation on the button is set to custom
		if(inviteElement && esw.inviteAPI && data.inviteRenderer !== "Custom") {
			esw.inviteAPI.inviteButton.addTracker(inviteElement, data);
			esw.inviteAPI.inviteButton.setRules(inviteRules.rules, inviteRules.filter);
			esw.inviteAPI.inviteButton.setOnlineState(data.isAvailable);
		}
	}

	/**
	 * Calls appropriate handlers based on button type
	 *
	 * @param {Object} message - The settings data as received from the server.
	 */
	LiveAgentAPI.prototype.handleSettings = function handleSettings(message) {
		message.buttons.forEach(function(button) {
			if(button.type === "Invite" && button.id === esw.settings.buttonId) {
				handleInviteButton(button);
			}
		});
	};

	/**
	 * When a switch server event occurs, update the base Live Agent URL to the new server.
	 *
	 * @param {Object} message - The switch server event message.
	 */
	LiveAgentAPI.prototype.handleSwitchServer = function handleSwitchServer(message) {
		var newChatServerUrl = message.newUrl;

		esw.log("Detected new Live Agent url: " + newChatServerUrl);

		esw.settings.baseLiveAgentURL = newChatServerUrl;

		esw.log("Immediately re-pinging server with new Live Agent url");
		// We can't actually re-ping immediately since there is other
		// "resetting" that needs to happen first, in the
		// current call stack (above us, in SCRT.connection.handlePing). So
		// we're using setTimeout-1ms to add the next
		// ping to the end of the execution queue.
		window.setTimeout(function() {
			// Passing 1ms to essentially skip the current ping cycle, since we
			// want to ping the new url ASAP.
			this.connection.onSuccess(1);
		}.bind(this), 1);
		// Sid was reset, we need to setup the deployment again
		this.getButtonSettings();
	};

	/**
	 * Halts pinging.
	 */
	LiveAgentAPI.prototype.disconnect = function disconnect() {
		esw.log("Disconnecting from Live Agent");
		this.connection.running = false;
	};
	
	/**
	 * Determines if a string is a valid Live Agent button ID.
	 *
	 * @param {string} entityId - An entity Id.
	 * @returns {boolean} Is the string a button ID?
	 */
	LiveAgentAPI.prototype.isButtonId = function isButtonId(entityId) {
		return esw.getKeyPrefix(entityId) === "573";
	};

	/**
	 * Determines if a string is a valid Live Agent deployment ID.
	 *
	 * @param {string} entityId - An entity ID.
	 * @returns {boolean} Is the string a deployment ID?
	 */
	LiveAgentAPI.prototype.isDeploymentId = function isDeploymentId(entityId) {
		return esw.getKeyPrefix(entityId) === "572";
	};

	/**
	 * Send the information on an attempted file upload to the Lightning component.
	 * @param {object} data - Information on the attempted file upload.
	 */
	LiveAgentAPI.prototype.sendFileInfo = function sendFileInfo(data) {
		var event = document.createEvent("CustomEvent");
				
		event.initCustomEvent("sendFileInfo", true, false, {
			name: data.name,
			size: data.size
		});

		window.dispatchEvent(event);
	};

	LiveAgentAPI.prototype.getSessionId = function getSessionId() {
		return this.sid;
	};

	esw.liveAgentAPI = new LiveAgentAPI();
});