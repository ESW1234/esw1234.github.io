/*
 * Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * TO MINIFY: Use Google Closure Compiler:
 *		google-closure-compiler --js=liveagent.esw.js --js_output_file=liveagent.esw.min.js --rewrite_polyfills=false
 *
 *		Install google-closure-compiler by running:
 *			npm install -g google-closure-compiler
 */

embedded_svc.defineFeature("LiveAgent", function(esw) {
	var VISITOR_INFO_KEY = "LA_VISITOR_INFO";
	var AVAILABILITY_PING_TIMEOUT = 5000;
	var AVAILABILITY_PING_RATE = 50000;
	var SCRT_API_VERSION = 48;
	// Static html for invite should have this id
	var INVITE_DOM_ID = "snapins_invite";
	var SCRT_ENDPOINT_URL;
	// DO NOT CHANGE SCRT_MAX_RETRY_ATTEMPTS until W-7443717 is fixed
	var SCRT_MAX_RETRY_ATTEMPTS = 1;
	var SCRT_RETRY_ATTEMPTS = 0;
	// IDs of DOM elements pertaining to Chat APIs:
	var SIDEBAR = ".embeddedServiceSidebar";
	var SIDEBAR_MINIMIZED = "sidebarMinimized";
	var SIDEBAR_MAXIMIZED = "sidebarMaximized";
	var SIDEBAR_STATE = ".embeddedServiceSidebarState";
	var SIDEBAR_FEATURE = ".embeddedServiceLiveAgentSidebarFeature";
	var SIDEBAR_WAITING_STATE = "embeddedServiceLiveAgentStateWaiting";
	var SIDEBAR_CHAT_STATE = "embeddedServiceLiveAgentStateChat";
	var SIDEBAR_DIALOG_STATE = "embeddedServiceSidebarDialogState";
	var STORAGE_IFRAME = "esw_storage_iframe";

	// [Customizations] EmbeddedServiceResourceType values
	const INVITATIONS_RSRC_TYPE = "ChatInvitation";

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
	 * Class for providing file transfer functionality within live agent
	 *
	 * @class
	 */
	function FileTransfer() {
		this.createElements();
		this.registerMessageHandlers();
	}

	/**
	 * Register message handlers pertaining to file transfer.
	 */
	FileTransfer.prototype.registerMessageHandlers = function registerMessageHandlers() {
		esw.addMessageHandler("liveagent.fileTransfer.uploadFile", function(data) {
			this.uploadFile(data);
		}.bind(this));

		esw.addMessageHandler("liveagent.fileTransfer.resetFileSelector", function() {
			this.resetFileSelector();
		}.bind(this));
	};

	/**
	 * Send the file name and size to the input footer in order to display the information.
	 */
	FileTransfer.prototype.handleFileSelectorChange = function handleFileSelectorChange() {
		var file = document.getElementById("fileSelector").files[0];

		embedded_svc.liveAgentAPI.sendFileInfo(file);
	};

	/**
	 * Upload the file to the agent.
	 *
	 * @param {object} data - An object containing the upload URL.
	 */
	FileTransfer.prototype.uploadFile = function uploadFile(data) {
		var form = document.getElementById("fileUploadForm");
		
		if(embedded_svc.utils.isProtocolHttpOrHttps(data.url)){
			form.action = data.url;
			form.submit();
			this.resetFileSelector();
		}
	};

	/**
	 * Reset the files on the file selector to undefined so that the next file the user selects
	 * fires the onchange event.
	 */
	FileTransfer.prototype.resetFileSelector = function resetFileSelector() {
		document.getElementById("fileSelector").value = "";
	};

	/**
	 * Append the file transfer form to the iframe body.
	 */
	FileTransfer.prototype.createElements = function createElements() {
		var uploadForm = document.createElement("form");
		var fileInput = document.createElement("input");
		var filenameInput = document.createElement("input");
		var iframe = document.createElement("iframe");

		uploadForm.id = "fileUploadForm";
		uploadForm.enctype = "multipart/form-data";
		uploadForm.method = "post";
		uploadForm.target = "fileUploadIframe";

		fileInput.type = "file";
		fileInput.id = "fileSelector";
		fileInput.name = "file";
		fileInput.style.display = "none";
		fileInput.onchange = this.handleFileSelectorChange;

		filenameInput.name = "filename";
		filenameInput.type = "hidden";

		iframe.id = "fileUploadIframe";
		iframe.name = "fileUploadIframe";
		iframe.title = "FileUploadFrame";
		iframe.style.display = "none";

		uploadForm.appendChild(fileInput);
		uploadForm.appendChild(filenameInput);

		document.body.appendChild(uploadForm);
		document.body.appendChild(iframe);
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
			this.pages = parsedVisitorInfo.pages;

			/**
			 * Set referrer to what was serialized. If "" was serialized, set it to the document.referrer. We must check
			 * document.referrer here because if a user navigated directly to a page with snapins on it, originalReferrer
			 * would be set to "" and serialized that way. From then on, the originalReferrer would always be "".
			 */
			this.originalReferrer = parsedVisitorInfo.originalReferrer || document.referrer;
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
		this.fileTransfer = new FileTransfer();
		this.visitorInfo = new VisitorInfo();
		// Used by the broadcast events (onChatStateLoaded,onCustomEventsScriptsLoaded) in liveAgentStateChat.
		this.browserSessionInfo = {};

		// Invitation element ID
		this.INVITATIONS_CONTAINER_ID = "esw-invite-container";
		this.INVITE_RESOURCE_ID = "esw-invite-resource";
		this.INVITE_API_ID = "esw-invite-api";

		// Invitation button for the chat deployment
		this.inviteButton = {};
		// Flag for whether invitation markup is loaded from static resources.
		// Set to true if invitations markup is already on the page and does not need to be 
		// loaded from static resources; false otherwise.
		this.hasInvitationsLoaded = Boolean(document.getElementById(INVITE_DOM_ID));
		// Flag for whether invitation markup is rendered on the page.
		// Set to true if invitations markup is already on the page and false otherwise.
		this.isInvitationsRendered = Boolean(document.getElementById(INVITE_DOM_ID));

		esw.setDefaultButtonText("LiveAgent", "Chat with an Expert", "Agent Offline", "Live chat:");

		esw.addDefaultSetting("avatarImgURL", "");
		esw.addDefaultSetting("prechatBackgroundImgURL", "");
		esw.addDefaultSetting("waitingStateBackgroundImgURL", "");
		esw.addDefaultSetting("smallCompanyLogoImgURL", "");
		esw.addDefaultSetting("headerBackgroundURL", "");
		esw.addDefaultSetting("extraPrechatInfo", []);
		esw.addDefaultSetting("extraPrechatFormDetails", []);
		esw.addDefaultSetting("agentAvailableOnButtonClick", false);

		// We only want to provide a default label for Offline Cases
		// if offline cases is enabled
		if(esw.settings.isOfflineSupportEnabled) {
			esw.settings.offlineSupportMinimizedText = esw.settings.offlineSupportMinimizedText || "Contact Us";
		}

		// Handle message from iframe and fire event for the components to act on when chat is canceled on a different tab
		esw.addMessageHandler("liveagent.chatCanceledOnDifferentTab", function() {
			esw.fireEvent("liveagent.chatCanceledOnDifferentTab");
		});

		esw.addEventHandler("error", this.disconnect.bind(this));

		esw.addEventHandler("sessionDataRetrieved", function(serializedData) {
			SCRT_ENDPOINT_URL = embedded_svc.liveAgentAPI.constructChatSettingsEndpointURL();
			// Load invite scripts and make the settings call only if its a new session
			if(serializedData.CHASITOR_SERIALIZED_KEY) {
				// Since it's a continued session set the agent available to true
				// Avoids a race condition when the app is loaded before the availability call completes [W-4835813]
				esw.settings.agentAvailableOnButtonClick = true;
				// Re-initiate availaibility calls if its a continued session
				this.ping();
			} else {
				// Get settings for embedded service chat from SCRT endpoint *only* if we are not in channel menu context
				// Else we'll already have the chat button settings
				// If the disableDeploymentDataPrefetch setting is passed in, don't make the settings call on page load
				if(!embedded_svc.menu && !embedded_svc.settings.disableDeploymentDataPrefetch) {
					embedded_svc.liveAgentAPI.getChatSettings();
				}
				// Load the invite script
				esw.loadFeatureScript("Invite", function() {
					// Gets the settings on the button :
					// Since getButtonSettings uses the same SCRTConnection send call internally
					// Only the first call will be to get settings on the button, all subsequent calls will be agent availability calls
					embedded_svc.liveAgentAPI.getButtonSettings();

					// Load inert script if not loaded yet.
					if(document.querySelector("style#inert-style")) {
						return;
					}
					esw.loadScriptFromDirectory("utils", "inert");
				});
			}

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

		esw.addEventHandler("onSettingsCallCompleted", function() {
			if(esw.liveAgentAPI.hasInviteButton() && this.hasInvitationsLoaded) {
				if(!this.isInvitationsRendered) {
					esw.liveAgentAPI.appendInvitationsComponent();
				} else {
					handleInviteButton(esw.liveAgentAPI.inviteButton);
				}
			}
		}.bind(this));

		esw.addEventHandler("onInvitationResourceLoaded", function() {
			if(esw.liveAgentAPI.hasInviteButton() && !this.isInvitationsRendered) {
				esw.liveAgentAPI.appendInvitationsComponent();
			}
		}.bind(this));

		esw.loadStorageScript("Chasitor");

		esw.registerStorageKeys([
			"CHASITOR_SERIALIZED_KEY",
			"LA_ESW_CHAT_SCROLL_POSITION",
			"LA_ESW_UNSEEN_MESSAGES",
			"LA_ESW_SHOW_QUEUE_POSITION",
			"LA_VISITOR_INFO",
			"LA_ESW_FILE_TOKEN",
			"LA_ESW_FILE_UPLOAD_SERVLET_URL",
			"CHATBOT_FOOTER_MENU",
			"PRECHAT_FORM_DETAILS",
			"PRECHAT_ENTITIES"
		]);

		if(esw.settings.entryFeature === "LiveAgent") {
			this.updateButton();
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
		var returnStr = String(str);

		if(typeof window.JSON !== "undefined") {
			return window.JSON.parse(returnStr);
		}
		embedded_svc.utils.error("Browser does not support JSON.parse");

		throw new Error("Error during JSON.parse");
	}

	/**
	 * Gets the Embedded Service Chat Settings from SCRT JSONP endpoint
	 */
	LiveAgentAPI.prototype.getChatSettings = function getChatSettings() {
		// JSONP call to SCRT by adding a script tag to the page
		embedded_svc.utils.loadScriptFromUrl(SCRT_ENDPOINT_URL);

		SCRT_RETRY_ATTEMPTS += 1;
	};

	/**
	 * Retry the settings call if there are available retry
	 * attempts, otherwise log an error message.
	 *
	 * @param {Object} message - Sent in the callback from the jsonp call.
	 */
	function retryChatSettingsCall(message) {
		// Evaluate whether we should not retry the config call
		if(SCRT_RETRY_ATTEMPTS >= SCRT_MAX_RETRY_ATTEMPTS ||
			message.type === "EmbeddedServiceError" && !message.message.shouldRetry) {
			// We should not retry if we have run out of retry attempts.
			// We should not retry if retry is set to false for EmbeddedServiceErrors
			embedded_svc.utils.error("[Chat] " + message.type + " from jsonp call: " + message.message.text);

			return;
		}

		// Retry if we have decided it is safe to retry.
		// TODO - Add retry logic as part of W-7443717. Currently max retry set to 1
		// Below code is never executed, if the SCRT call for settings results in an Error, we'll fallback to the controller call
		embedded_svc.log("[Chat] Getting chat settings failed. Retrying..Attempt:" + SCRT_RETRY_ATTEMPTS);
		embedded_svc.liveAgentAPI.getChatSettings();
	}

	/**
	 * Construct the JSONP URL.
	 *
	 * @return {String} - Returns JSONP URL
	 */
	LiveAgentAPI.prototype.constructChatSettingsEndpointURL = function constructChatSettingsEndpointURL() {
		var endpointPath = "/rest/EmbeddedService/EmbeddedServiceConfig.jsonp";
		var language = embedded_svc.settings.language;
		var configName = embedded_svc.settings.eswConfigDevName;
		var queryParams = "";

		queryParams += "?Settings.prefix=EmbeddedService";
		queryParams += "&org_id=" + embedded_svc.settings.orgId;
		queryParams += "&EmbeddedServiceConfig.configName=" + configName;
		queryParams += "&callback=embedded_svc.liveAgentAPI.handleChatSettings";
		queryParams += "&version=" + SCRT_API_VERSION;
		if(typeof language === "string" && language.trim().length > 0) {
			queryParams += "&EmbeddedServiceConfig.language=" + language;
		}

		return embedded_svc.settings.baseLiveAgentURL + endpointPath + queryParams;
	};

	/**
	 * Process embedded service config settings response from the SCRT JSONP call.
	 * EmbeddedServiceConfig Settings call works in the same way as the Settings call for chat button.
	 * This is the callback function that is passed into the JSONP call
	 *
	 * @param {Array} data - Array of JSON objects e.g. [{type: "", message: {}}] sent in the callback from the jsonp call
	 */
	LiveAgentAPI.prototype.handleChatSettings = function handleChatSettings(data) {
		var resourceHandlers = {};
		data.messages.forEach(function(message) {
			if(message.type === "EmbeddedServiceConfig") {
				// Store response as JSON object on menuConfig.
				embedded_svc.config = message.message;

				// Populate resource handlers
				if (embedded_svc.utils.isCommunityOrSite()) {
					resourceHandlers[INVITATIONS_RSRC_TYPE] = esw.liveAgentAPI.processInvitations;
				}

				// Process customizations from SCRT response, if any.
				if(embedded_svc.utils.isMatchingCustomizationFound(embedded_svc.config, embedded_svc.settings.pageName)) {
					embedded_svc.utils.processCustomizations(
						embedded_svc.settings.pageName,
						embedded_svc.config,
						resourceHandlers
					);
				}
			} else if(message.type === "SwitchServer") {
				// Live agent server has changed due to org migration. Recreating SCRT_ENDPOINT_URL
				embedded_svc.utils.warning("[Chat] Your org has been migrated on the Service Cloud Real Time servers. Consider regenerating the snippet for this page.");
				embedded_svc.settings.baseLiveAgentURL = message.message.newUrl;
				// Reset retry attempts as we'll be using the new url
				SCRT_RETRY_ATTEMPTS = 0;
				SCRT_ENDPOINT_URL = embedded_svc.liveAgentAPI.constructChatSettingsEndpointURL();
				embedded_svc.liveAgentAPI.getChatSettings();
			} else if(message.type === "EmbeddedServiceError" || message.type === "Error") {
				retryChatSettingsCall(message);
			} else {
				embedded_svc.utils.error("[Chat] Unexpected message type from jsonp call:" + message.type);
			}
		});
	};

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
		nouns.push(new Noun("Settings", {
			buttonIds: "[" + esw.settings.buttonId + "]",
			updateBreadcrumb: 1
		}));
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

			embedded_svc.utils.fireEvent("onAvailability", undefined, {
				isAgentAvailable: agentAvailable,
				id: result.id
			});

			if(esw.settings.entryFeature === "LiveAgent") {
				// We want to set agentAvailableOnButtonClick before calling updateButton so that this setting has most
				// up to date value when onButtonStatusChange is called within Experience Cloud sites (formerly Community)
				esw.settings.agentAvailableOnButtonClick = agentAvailable;
				this.updateButton(agentAvailable);
				// Update invite button online state based on agent availability
				if(esw.inviteAPI && esw.inviteAPI.inviteButton.getTracker()) {
					esw.inviteAPI.inviteButton.setOnlineState(agentAvailable);
				}
			}
		}.bind(this));
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
		var agentAvailable;

		/**
		 * Always make sure to update the baseLiveAgentContentURL's reference on the global object with the content URL in settings data, received from the server.
		 * This ensures to have an updated content URL in an event of a switch server.
		 */
		if(typeof message.contentServerUrl === "string") {
			embedded_svc.settings.baseLiveAgentContentURL = message.contentServerUrl;
		}

		// LA getSettings call when made with chatButtonId returns settings for the chat button requested as the first item and all the active invitations on the deployment
		// If the settings call is made with the invitation button id, it returns an unordered list of invitations
		message.buttons.forEach(function(button) {
			if(button.id === esw.settings.buttonId) {
				agentAvailable = button.isAvailable;
				if(button.type === "Invite") {
					// Store button config as a global embedded_svc object.
					esw.liveAgentAPI.inviteButton = button;
				}
			}
		});

		esw.log("Agent Available: " + JSON.stringify(agentAvailable));
		// Use the availability results in settings to toggle button state
		if(esw.settings.entryFeature === "LiveAgent") {
			esw.settings.agentAvailableOnButtonClick = agentAvailable;
			this.updateButton(agentAvailable);
		}

		embedded_svc.utils.fireEvent("onSettingsCallCompleted", undefined, {
			isAgentAvailable: agentAvailable
		});
	};

	/**
	 * When a switch server event occurs, update the base Live Agent URL to the new server.
	 *
	 * @param {Object} message - The switch server event message.
	 */
	LiveAgentAPI.prototype.handleSwitchServer = function handleSwitchServer(message) {
		if(message && message.newUrl && typeof message.newUrl === "string") {
			esw.log("Detected new Live Agent URL: " + message.newUrl + ". Sending a request to new endpoint.");

			esw.settings.baseLiveAgentURL = message.newUrl;

			/**
			 * We can't actually re-ping immediately since we need to reset the pingTimer.
			 * Pass a timeout of 1 to SCRTConnection.prototype.onSuccess to immediately invoke SCRT.connection.handlePing, which will reset state. Then proceed to get button settings.
			 * Expected behavior with a switch server is to call Settings.jsonp again on the new server to ensure
			 * all button configurations are up to date on the client.
			 */
			this.connection.onSuccess(1);
			window.setTimeout(function() {
				// Sid was reset, we need to setup the deployment again.
				this.getButtonSettings();
			}.bind(this), 1);
		} else {
			esw.error("Expected switch server response to return a redirect URL, instead received: " + (message && message.newUrl ? message.newUrl : message) + ".");
		}
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

	/**
	 * Sends a custom event to the agent console of the agent who is currently chatting with a customer.
	 * @param {string} type - The name of the custom event to send to the agent console.
	 * @param {string} data - Additional data you want to send to the agent console along with the custom event.
	 */
	LiveAgentAPI.prototype.sendCustomEvent = function sendCustomEvent(type, data) {
		var postMessageData = {};

		postMessageData.type = type;
		postMessageData.data = data;
		esw.postMessage("chasitor.sendCustomEvent", postMessageData);
	};

	/**
	 * Retrieves a list of custom events from both agent and chasitor that have been received during this chat session.
	 * @param {function} callback - JavaScript method called upon completion of the method.
	 * 								callback function is passed a json formatted string of the events
	 * 	e.g. [{"source":"Agent","type":"startSession","data":"myCustomEventData","date":"Wed Feb 21 2018 12:10:59 GMT-0800 (PST)"}]
	 */
	LiveAgentAPI.prototype.getCustomEvents = function getCustomEvents(callback) {
		esw.addMessageHandler("liveagent.getCustomEventsResult", callback);
		esw.postMessage("chasitor.getCustomEvents");
	};

	/**
	 * Registers a function to call when a custom event is received in the chat window.
	 * @param {string} type - The type of custom event to listen for.
	 * @param {function} callback - JavaScript method called upon completion of the method.
	 * 								The callback function is passed an object which has 2 attributes type and data
	 */
	LiveAgentAPI.prototype.addCustomEventListener = function addCustomEventListener(type, callback) {
		esw.addMessageHandler("liveagent.customEventReceived", callback);
		esw.postMessage("chasitor.addCustomEventListener", type);
	};

	LiveAgentAPI.prototype.getSessionId = function getSessionId() {
		return this.sid;
	};

	/**
	 * Update the help button and the "clickability" of the help button
	 * @param {boolean} agentAvailable - whether of not the agent is online
	 */
	LiveAgentAPI.prototype.updateButton = function updateButton(agentAvailable) {
		if(esw.settings.isOfflineSupportEnabled && !agentAvailable) {
			esw.isButtonDisabled = false;
			esw.setHelpButtonText(esw.settings.offlineSupportMinimizedText);
		} else {
			esw.isButtonDisabled = !agentAvailable;
		}
	};

	/**
	 * Handle invitation resource loaded from SCRT response.
	 */
	LiveAgentAPI.prototype.handleInvitationsResource = function handleInvitationsResource() {
		if(embedded_svc.config.invitation.htmlMarkup) {
			// Mark invitations component loaded.
			esw.liveAgentAPI.hasInvitationsLoaded = true;

			embedded_svc.utils.fireEvent("onInvitationResourceLoaded");
		}
	};

	/**
	 * Append invitations markup and relevant styles and scripts to the DOM and handle invitations logic.
	 */
	LiveAgentAPI.prototype.appendInvitationsComponent = function appendInvitationsComponent() {
		var invitation;
		var invitationStyle;
		var invitationScript;

		// Create and set invitation markup from static resource.
		invitation = document.createElement("div");
		invitation.id = embedded_svc.liveAgentAPI.INVITATIONS_CONTAINER_ID;
		invitation.innerHTML = embedded_svc.config.invitation.htmlMarkup;

		if (embedded_svc.config.invitation.styles) {
			// Create and set style element from static resource.
			invitationStyle = document.createElement("style");
			invitationStyle.type = "text/css";
			invitationStyle.innerHTML = embedded_svc.config.invitation.styles;

			// Append the style element to the markup
			invitation.appendChild(invitationStyle);
		}

		// Append invitation element to the target element (document.body).
		embedded_svc.settings.targetElement.appendChild(invitation);
		this.isInvitationsRendered = true;

		// Append invitation script element to the target element.
		if (embedded_svc.config.invitation.invitationAPIs) {
			// Create and set the script element from static resource.
			invitationScript = document.createElement("script");
			invitationScript.id = embedded_svc.liveAgentAPI.INVITE_API_ID;
			invitationScript.type = "text/javascript";
			invitationScript.innerHTML = embedded_svc.config.invitation.invitationAPIs;

			// Append the script to the target element (document.body).
			embedded_svc.settings.targetElement.appendChild(invitationScript);
		}

		// Handle invitations logic.
		handleInviteButton(esw.liveAgentAPI.inviteButton);
	};

	/**
	 * Process snippet settings file data passed from the customizations object.
	 *
	 * @param resource - The invitations static resource object to be processed.
	 */
	LiveAgentAPI.prototype.processInvitations = function(resource) {
		var siteUrl = embedded_svc.config.embeddedServiceConfig ?
			embedded_svc.utils.getSiteEndpointUrl(embedded_svc.config.embeddedServiceConfig) :
			null;

		if(siteUrl) {
			// Create empty invitation object to be populated from static resource.
			embedded_svc.config.invitation = {};

			// Load invitation static resource from Experience Cloud site (formerly Community) URL.
			embedded_svc.utils.loadScriptFromUrl(
				embedded_svc.utils.generateResourceUrl(siteUrl, resource.resource),
				embedded_svc.liveAgentAPI.handleInvitationsResource,
				function() {
					embedded_svc.utils.error("[Invitations] Something went wrong while loading invitations static resource.");
				}.bind(embedded_svc),
				embedded_svc.liveAgentAPI.INVITE_RESOURCE_ID
			);
		} else {
			embedded_svc.utils.warning("Static resource cannot be loaded because no site endpoint exists for the embedded service deployment.");
		}
	};

	/**
	 * Determines whether the Embedded Service config object contains an invitation button.
	 *
	 * @returns {boolean} true if an invite button exists else false.
	 */
	LiveAgentAPI.prototype.hasInviteButton = function() {
		// Check if the inviteButton object is populated
		return Object.keys(esw.liveAgentAPI.inviteButton).length > 0 &&
			esw.liveAgentAPI.inviteButton.constructor === Object;
	};

	/**
	 * The Start Chat API for the Embedded Service (Snap-ins) Chat application.
	 * This function will boostrap and maximize the sidebar (if applicable) and start a chat request.
	 *
	 * STEP 0: If incompatible, load polyfill for Promises for browser compatibility.
	 *
	 * STEP 1: If sidebar is not rendered, bootstrap Embedded Service application and then call Start Chat API again.
	 *
	 * STEP 2: If sidebar is rendered and minimized, maximize the sidebar. If sidebar is already maximized, continue.
	 *
	 * STEP 3: If sidebar is maximized, validate the start chat parameters and dispatch the event to start a chat request.
	 *
	 * @param {Object} attributes - Map of attributes for this Embedded Service start chat request.
	 *
	 * `attributes` object can contain the following embedded service chat settings to start a chat with:
	 * {Object} prepopulatedPrechatFields - NOTE: not supported if prechat is disabled.
	 * {Array} extraPrechatInfo
	 * {Array} extraPrechatFormDetails
	 * {Array} fallbackRouting
	 * {Function} directToButtonRouting
	 * {Object} directToAgentRouting - NOTE: this setting is only supported in Start Chat API.
	 * 	- {String} buttonId - The ID of the chat button to request a chat to in the Embedded Chat Snap-in (required).
	 * 	- {String} userId - The ID of the agent to directly route chats from the button specified (optional).
	 * 	- {Boolean} fallback - Whether to fall back to the fallbackRouting rules if the button/agent specified is unavailable (default off).
	 *
	 * NOTE: Existing snippet settings will be overridden. If you do not want your snippet settings to be overridden, pass them in under the `attributes` parameter.
	 *
	 * @returns {Promise}
	 */
	LiveAgentAPI.prototype.startChat = function startChat(attributes) {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			esw.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					return esw.liveAgentAPI.startChat(attributes);
				},
				true
			);
		} else {
			// Bootstrap, then maximize the chat.
			return new Promise(function(resolve, reject) {
				var sidebarElement;

				try {
					sidebarElement = document.querySelector(SIDEBAR);

					if(sidebarElement) {
						// Only maximize if sidebar is bootstrapped and minimized (in any state).
						if(sidebarElement.classList.contains(SIDEBAR_MINIMIZED)) {
							// This event is handled in sidebarRenderer.js.
							sidebarElement.dispatchEvent(new CustomEvent
							("embeddedservicemaximizechat", {
								detail: {
									resolve: resolve,
									reject: reject
								}
							}));
						} else if(sidebarElement.classList.contains(SIDEBAR_MAXIMIZED)) {
							resolve("Embedded Service component is already maximized.");
						}
					} else {
						// If sidebar is not rendered, bootstrap Embedded Service.
						// If prechat is disabled, we bootstrap directly into waiting state, so we need to pass in data.
						esw.bootstrapEmbeddedService({ chatAPISettings: attributes })
							.then(function() {
								// Start chat after sidebar is bootstrapped.
								esw.liveAgentAPI.startChat.bind(esw, attributes);
								resolve("Embedded Service application and component bootstrapped");
							}).catch(function(error) {
								reject(error);
							});
					}
				} catch(error) {
					reject(error);
				}
			}).then(function(success) {
				esw.log("[Start Chat API] " + success);

				// Hide the channel menu.
				if(esw.util.isChannelMenuContext() || esw.menu) {
					esw.menu.hideButtonAndMenu();
					esw.menu.hideTopContainer();
				}

				// Start chat.
				return new Promise(function(resolve, reject) {
					var sidebarFeature;
					var sidebarState;

					try {
						sidebarFeature = document.querySelector(SIDEBAR_FEATURE);
						sidebarState = document.querySelector(SIDEBAR_STATE);

						if(sidebarFeature) {
							if(sidebarState.classList.contains(SIDEBAR_WAITING_STATE) || sidebarState.classList.contains(SIDEBAR_CHAT_STATE)) {
								resolve("Restricted from starting chat in current state. Chat request will not fire.");
							} else {
								// This event is handled in sidebarFeatureRenderer.js.
								// Note: if no parameters are passed in, override snippet with empty settings (i.e. do not merge or fallback to any existing settings on embedded_svc).
								sidebarFeature.dispatchEvent(new CustomEvent
								("embeddedservicestartchat", {
									detail: {
										data: attributes ? embedded_svc.validateStartChatAttributes(attributes) : {},
										resolve: resolve,
										reject: reject
									}
								}));

								esw.addMessageHandler("liveagent.initialized", function() {
									resolve("Successfully requested to start chat session.");
								});
							}
						} else if(!sidebarFeature && document.getElementsByClassName(SIDEBAR_DIALOG_STATE)) {
							resolve("Restricted from starting a chat in current state. Chat request will not fire.");
						} else {
							resolve("Embedded Service sidebar feature not rendered. Start Chat was not called.");
						}
					} catch(error) {
						reject(error);
					}
				}).then(function(result) {
					esw.log("[Start Chat API] " + result);
				}).catch(function(error) {
					esw.error("[Start Chat API] Error starting chat: " + error);
				});
			}).catch(function(error) {
				esw.error("[Start Chat API] Error bootstrapping/maximizing chat: " + error);
			});
		}

		return undefined;
	};

	/**
	 * The End Chat API for the Embedded Service (Snap-ins) Chat application.
	 * This function will end the current chat (if applicable) and close the Snap-in.
	 *
	 * STEP 0: If incompatible, load polyfill for Promises for browser compatibility.
	 *
	 * STEP 1: Check that sidebar is rendered.
	 * If not, reject the promise and do nothing if the widget is not rendered/bootstrapped.
	 *
	 * STEP 2: Initialize end chat promise and check the current sidebar state.
	 * - If waiting state:
	 * 1) Dispatch end chat event from waiting state to cancel the chat request. This bypasses the close warning prompt in waiting state.
	 * 2) Log when chat request is successfully cancelled.
	 * 3a) Clear Local Storage and Session Storage so that chat doesn't persist on page navigation for both iframe and parent page.
	 * 3b) The iframe should send a post message to the parent page indicating that session data in iframe has been cleared.
	 * 3c) Log when local and session data is successfully deleted.
	 * - If chat state:
	 * 1) Dispatch end chat event from chat state to the end active chat session. This bypasses the close warning prompt in chat state.
	 * 2) Log when chat session is successfully ended.
	 * 3a) Clear Local Storage and Session Storage so that chat doesn't persist on page navigation for both iframe and parent page.
	 * 3b) The iframe should send a post message to the parent page indicating that session data in iframe has been cleared.
	 * 3c) Log when local and session data is successfully deleted.
	 * - If chat is in pre-chat or post-chat state, resolve the promise so we can just destroy the sidebar.
	 *
	 * STEP 3: After end chat promise is resolved, destroy sidebar if rendered (minimized or maximized).
	 *
	 * @returns {Promise}
	 */
	LiveAgentAPI.prototype.endChat = function endChat() {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			esw.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					return this.endChat();
				}.bind(this),
				true
			);
		} else {
			// Cancel chat requests or end active chat sessions, depending on the current state.
			return new Promise(function(resolve, reject) {
				var activeStates = [SIDEBAR_WAITING_STATE, SIDEBAR_CHAT_STATE, SIDEBAR_DIALOG_STATE];
				var sidebarState;

				try {
					sidebarState = document.querySelector(SIDEBAR_STATE);

					if(sidebarState) {
						// If current state is restricted from calling End Chat API.
						if(!activeStates.some(function(stateElement) { return sidebarState.classList.contains(stateElement); })) {
							// Resolve after deleting remaining session keys leftover after sidebar is only bootstrapped.
							esw.addMessageHandler("session.deletedSessionData", function(data) {
								if(data.indexOf("ESW_IS_MINIMIZED") !== -1) {
									resolve("Successfully deleted session keys after client closed.");
								}
							});

							esw.deleteSessionData(["ESW_IS_MINIMIZED"]);
						} else {
							// This event is handled in liveAgentSidebarFeatureRenderer.js.
							sidebarState.dispatchEvent(new CustomEvent
							("embeddedserviceendchat", {
								detail: {
									resolve: resolve,
									reject: reject
								}
							}));

							// Resolve after deleting remaining session keys leftover after chat is ended.
							esw.addMessageHandler("session.deletedSessionData", function(data) {
								if(data.indexOf("CHASITOR_SERIALIZED_KEY") !== -1 && data.indexOf("MASTER_DEPLOYMENT_ID") !== -1) {
									resolve("Successfully deleted session keys after chat ended.");
								}
							});
						}
					} else {
						resolve("Embedded Service application state is not rendered on this page.");
					}
				} catch(error) {
					reject(error);
				}
			}).then(function(success) {
				esw.log("[End Chat API] " + success);

				// If sidebar still exists, destroy it.
				return new Promise(function(resolve, reject) {
					var sidebarElement;

					try {
						sidebarElement = document.querySelector(SIDEBAR);

						if(sidebarElement) {
							// Resolve after deleting remaining session keys leftover after sidebar is destroyed.
							esw.addMessageHandler("session.deletedSessionData", function(data) {
								if(data.indexOf("ESW_IS_MINIMIZED") !== -1 && data.indexOf("LA_ESW_SHOW_QUEUE_POSITION") !== -1 && data.indexOf("CHATBOT_FOOTER_MENU") !== -1) {
									resolve("Successfully deleted session keys after sidebar destroyed.");
								}
							});

							// This event is handled in sidebarRenderer.js
							sidebarElement.dispatchEvent(new CustomEvent
							("embeddedservicedestroysidebar", {
								detail: {
									resolve: resolve,
									reject: reject
								}
							}));

							// Delete session storage keys pertaining to the client UI from the iframe.
							esw.deleteSessionData([
								"ESW_IS_MINIMIZED",
								"SCROLL_ENABLED",
								"LA_ESW_CHAT_SCROLL_POSITION",
								"CHATBOT_FOOTER_MENU",
								"LA_ESW_SHOW_QUEUE_POSITION"
							]);
						} else {
							resolve("Embedded Service component is not rendered on this page.");
						}
					} catch(error) {
						reject(error);
					} finally {
						// If sidebar still rendered, remove it.
						if(sidebarElement) sidebarElement.remove();
					}
				}).then(function(result) {
					esw.log("[End Chat API] " + result);

					// Delete session session keys pertaining to session continuity from iframe.
					esw.deleteSessionData([
						"CHASITOR_SERIALIZED_KEY",
						"MASTER_DEPLOYMENT_ID",
						"ACTIVE_CHAT_SESSIONS",
						"PRECHAT_FORM_DETAILS",
						"PRECHAT_ENTITIES"
					]);
					// Decrement the active chat session from the local storage keys pertaining to session continuity from iframe.
					embedded_svc.postMessage("chasitor.decrementActiveChatSession", embedded_svc.settings.deploymentId);
					// Delete session storage keys pertaining to session continuity from parent page.
					sessionStorage.removeItem(esw.settings.storageDomain + "MASTER_DEPLOYMENT_ID");

					// Delete session storage keys pertaining to the client UI from the iframe.
					esw.deleteSessionData([
						"ESW_IS_MINIMIZED",
						"SCROLL_ENABLED",
						"LA_ESW_CHAT_SCROLL_POSITION",
						"CHATBOT_FOOTER_MENU",
						"LA_ESW_SHOW_QUEUE_POSITION"
					]);

					// Show the static help button or channel menu again, if configured.
					if(esw.menu && esw.menu.settings.displayChannelMenu) esw.menu.showButtonAndMenu();
					if(!esw.menu && esw.settings.displayHelpButton) esw.showHelpButton();
				}).catch(function(error) {
					esw.error("[End Chat API] Error destroying sidebar: " + error);
				});
			}).catch(function(error) {
				esw.error("[End Chat API] Error ending chat: " + error);
			}).finally(function() {
				esw.log("[End Chat API] Finished executing End Chat API");
			});
		}

		return undefined;
	};

	/**
	 * The Clear Session API for the Embedded Service (Snap-ins) Chat application.
	 * This function will destroy the sidebar and delete all Embedded Service Chat session data.
	 *
	 * STEP 0: If incompatible, load polyfill for Promises for browser compatibility.
	 *
	 * STEP 1: Invoke End Chat API to end any active chat requests/conversations and destroy the sidebar.
	 *
	 * STEP 2: Initialize clear session promise and check for the iframe. If not existant, resolve promise.
	 *
	 * STEP 3: Delete all chat session data.
	 * - Kill any leftover connections with chasitor (by canceling chat requests or ending chat sessions).
	 * - Tell the iframe to delete all session storage and local storage keys.
	 * - Post message back to the parent page saying that all Salesforce data has been removed.
	 * - TODO: Set up event listener for when iframe has finished clearing storage keys and remove the iframe.
	 *
	 * @returns {Promise}
	 */
	LiveAgentAPI.prototype.clearSession = function clearSession() {
		if(typeof Promise !== "function") { // eslint-disable-line no-negated-condition
			esw.loadScriptFromDirectory(
				"common",
				"promisepolyfill",
				function() {
					return this.clearSession();
				}.bind(this),
				true
			);
		} else {
			// Invoke End Chat API to end any active chat requests/conversations and destroy the sidebar.
			return esw.liveAgentAPI.endChat()
				// Then clean up and delete all existing local/session data and dependencies.
				.then(function() {
					return new Promise(function(resolve, reject) {
						var iframeElement;

						try {
							iframeElement = document.getElementById(STORAGE_IFRAME);

							if(iframeElement) {
								if(esw.settings.enabledFeatures.indexOf("LiveAgent") === -1) {
									reject("Embedded Service deployment does not have the LiveAgent feature enabled.");
								} else {
									// Resolve after iframe has finished clearing local storage and session storage keys.
									esw.addMessageHandler("session.deletedAllSessionData", function() {
										resolve("Successfully deleted all tracked ESW storage keys.");
									});

									try {
										// Kill any active connections with chasitor.
										esw.postMessage("chasitor.cancelChat");
										esw.postMessage("chasitor.endChat");
									} finally {
										// Delete session storage keys pertaining to session continuity from the iframe.
										// Additionally, delete any leftover keys still intact after ending chats for a clean slate.
										esw.deleteSessionData([
											"CHASITOR_SERIALIZED_KEY",
											"ACTIVE_CHAT_SESSIONS",
											"LA_VISITOR_INFO",
											"MASTER_DEPLOYMENT_ID",
											"CHASITOR_EVENTS",
											"PRECHAT_FORM_DETAILS",
											"PRECHAT_ENTITIES"
										]);
										// Delete local storage keys pertaining to session continuity from the iframe.
										esw.deleteSessionData([
											"ACTIVE_CHAT_SESSIONS"
										], true);
										// Delete session storage keys pertaining to session continuity from the parent page.
										sessionStorage.removeItem(esw.settings.storageDomain + "MASTER_DEPLOYMENT_ID");

										// Delete all ESW storage keys.
										esw.deleteSessionData(esw.storageKeys);
										// Delete all tracked keys on the current domain.
										esw.postMessage("session.deleteAllKeys", esw.settings.storageDomain);
									}
								}
							} else {
								resolve("Salesforce iframe not present on this page.");
							}
						} catch(error) {
							reject(error);
						}
					}).then(function(result) {
						esw.log("[Clear Session API] " + result);
					}).catch(function(error) {
						esw.error("[Clear Session API] Error deleting session keys or iframe: " + error);
					});
				}).catch(function(error) {
					esw.error("[Clear Session API] Error clearing session: " + error);
				}).finally(function() {
					esw.log("[Clear Session API] Finished executing Clear Session API");
				});
		}

		return undefined;
	};

	esw.liveAgentAPI = new LiveAgentAPI();
});
