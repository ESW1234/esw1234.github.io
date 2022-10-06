/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of chasitor.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * 	TO MINIFY: Use Google Closure Compiler:
 *				google-closure-compiler --js=chasitor.esw.js --js_output_file=chasitor.esw.min.js --rewrite_polyfills=false
 *
 *			Install google-closure-compiler by running:
 *				npm install -g google-closure-compiler
 */

/**
 * Messages handled by this module:
 *     chasitor.load|chasitor.sendMessage|chasitor.cancelChat|chasitor.endChat|chasitor.sendSneakPeekOrTypingUpdate|chasitor.saveChat|chasitor.sendCustomEvent|chasitor.getCustomEvents|chasitor.addCustomEventListener
 *
 * Messages sent from this module:
 *    - On LiveAgentChasitor event:
 *      {
 *        method : liveagent.event
 *        data: an object with event details with sessionId
 *      }
 *    - On ChasitorInitialization:
 *      {
 *        method : liveagent.initialized
 *        data : an object with chatMessages, chasitorSettings, Agent details and sessionId.
 *      }
 *    - On restoreSession:
 *      {
 *        method : liveagent.restored
 *        data : an object with chatMessages, chasitorSettings and sessionId details.
 *      }
 */
window.esw.defineFeature("Chasitor", function(esw) {
	var GETTER_REGEX = /get[A-Z][A-Za-z0-9_]*/;
	var VALID_CHASITOR_DOMAINS = [".soma.salesforce.com", ".salesforceliveagent.com", ".internal.salesforce.com", ".eng.sfdc.net", ".gus.salesforce.com", ".salesforcescrt.com", ".stm.salesforce.com"];

	/**
	 * Storage feature module for providing chasitor.js functionality.
	 *
	 * @class
	 * @property {ESW} esw - The parent ESW object.
	 * @property {object} liveAgentChasitor - The chasitor object created by chasitor.js
	 * @property {object} events - A list of events provided by chasitor.
	 * @property {object} chasitorSettings - Configuration data for chasitor.
	 * @property {object} prechatFormDetails - Form details provided by prechat.
	 * @property {object} prechatEntities - Entities provided by prechat.
	 * @property {string} chatWindowStateName - The name of the currently active Live Agent feature state.
	 */
	function ChasitorAPI() {
		this.esw = esw;
		this.liveAgentChasitor = undefined;

		// Liveagent events to register and handle Chasitor callback events
		this.events = undefined;

		this.chasitorSettings = undefined;
		this.prechatFormDetails = undefined;
		this.prechatEntities = undefined;
		this.chatWindowStateName = undefined;
		this.chatKey = undefined;

		// Store whether or not this tab is the primary. Set in loadChasitor.
		this.isTabPrimary = undefined;

		// Function to receive broadcasts for receiveIsTabPrimary.
		this.receiveIsTabPrimaryFunction = undefined;

		this.registerMessageHandlers();
		// SC across tabs not supported on ios
		// Skip registering handlers to avoid running into W-5661409, W-5854404
		if(esw.getSafariType() !== "mobile") {
			this.registerBroadcastHandlers();
		}
		
		esw.loadFeatureScript("FileTransfer");

		window.addEventListener("pagehide", function() {
			// Always decrement the active chat session - primary or secondary.
			if(this.chasitorSettings && this.chasitorSettings.deploymentId) {
				this.decrementActiveChatSession(this.chasitorSettings.deploymentId);
			}
		}.bind(this), {capture: true});
	}

	/**
	 * Get the content from a message with an object as it's content.
	 * This function was copied directly from saveChat() in chasitor.js
	 *
	 * @param {Object} content - Object that describes the content of the message.
	 */
	function getRichMessageContent(content) {
		var text = "";

		if(content && typeof content === "string") {
			return content;
		} else {
			// Specify the type of rich message.
			if(content.type === "ChatWindowButton") {
				text += "Button Selections:";
			} else if(content.type === "ChatWindowMenu") {
				text += "Menu Options:";
			}

			// Add the content of the message's items.
			if(content.items) {
				content.items.forEach(function(item) {
					text += "\n\t" + item.text;
				});
			}
		}

		return text;
	}

	/**
	 * Use the broadcastAPI to send an event and data to secondary tabs.
	 *
	 * Add these items to the data to send:
	 * - {String} domain - The domain of the parent this iframe is on.
	 * - {String} chatKey - The chat key of the current chasitor connection.
	 *
	 * This function should be on the ChasitorAPI proto so that it has references to domain and chatKey variables.
	 *
	 * @param {String} eventName - The name of the event to broadcast.
	 * @param {Object} eventData - Data associated with this event.
	 */
	ChasitorAPI.prototype.sendBroadcastEventToSecondaryTabs = function sendBroadcastEventToSecondaryTabs(eventName, eventData) {
		// Check if data is undefined.
		var data = eventData || {};

		// Add domain and chatKey attributes to the data object if it doesn't already have them.
		if(!data.domain) data.domain = this.domain;
		if(!data.chatKey) data.chatKey = this.chatKey;

		// Broadcast the event.
		esw.broadcastAPI.send(eventName, data);
	};

	/**
	 * Get the current chat key from session storage. This function is to be used by secondary tabs
	 * where there is no live agent connection (chasitor is not loaded in that tab's iframe).
	 *
	 * @param {String} domain - The domain needed to find the appropriate session storage key.
	 */
	ChasitorAPI.prototype.getChatKeyFromSessionStorage = function getChatKeyFromSessionStorage(domain) {
		var serializedKey = JSON.parse(esw.sessionAPI.getSessionData(domain, ["CHASITOR_SERIALIZED_KEY"]).CHASITOR_SERIALIZED_KEY);

		if(serializedKey && serializedKey.chasitorData) {
			return serializedKey.chasitorData.chatKey;
		}

		return undefined;
	};

	/**
	 * Check that the chatKey received by a broadcast event matches the chatKey in window.liveagent.chasitor.
	 * This prevents this chat session from picking up broadcasts from other chat sessions.
	 *
	 * @param {string} chatKeyFromBroadcastEvent - Chat key received from broadcast event.
	 */
	ChasitorAPI.prototype.isChatKeyValid = function isChatKeyValid(chatKeyFromBroadcastEvent) {
		if(!chatKeyFromBroadcastEvent) {
			esw.log("Chat key was not defined on receiving broadcast event.");
		}

		return this.chatKey === chatKeyFromBroadcastEvent;
	};

	/**
	 * Register message handlers within the parent ESW object.
	 */
	ChasitorAPI.prototype.registerMessageHandlers = function registerMessageHandlers() {
		esw.addMessageHandler("chasitor.load", this.loadChasitor.bind(this));

		esw.addMessageHandler("chasitor.sendMessage", function(domain, data) {
			this.sendMessage(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.sendRichMessage", function(domain, data) {
			this.sendRichMessage(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.cancelChat", function() {
			this.cancelChat();
		}.bind(this));

		esw.addMessageHandler("chasitor.endChat", function() {
			this.endChat();
		}.bind(this));

		esw.addMessageHandler("chasitor.abortConnection", function() {
			this.abortConnection();
		}.bind(this));

		esw.addMessageHandler("chasitor.sendSneakPeekOrTypingUpdate", function(domain, data) {
			this.sendSneakPeekOrTypingUpdate(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.saveChat", function() {
			this.saveChat();
		}.bind(this));

		esw.addMessageHandler("chasitor.updateChatWindowState", function(domain, data) {
			this.updateChatWindowState(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.removeEventListeners", function() {
			this.removeEventListeners();
		}.bind(this));

		esw.addMessageHandler("chasitor.stopChasitorIdleTimeout", function() {
			this.stopChasitorIdleTimeout();
		}.bind(this));

		esw.addMessageHandler("chasitor.sendCustomEvent", function(domain, data) {
			this.sendCustomEvent(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.getCustomEvents", function() {
			this.getCustomEvents();
		}.bind(this));

		esw.addMessageHandler("chasitor.addCustomEventListener", function(domain, data) {
			this.addCustomEventListener(data);
		}.bind(this));

		esw.addMessageHandler("chasitor.decrementActiveChatSession", function(domain, deploymentId) {
			this.decrementActiveChatSession(domain, deploymentId);
		}.bind(this));
	};

	/**
	 * Register broadcast event handlers for events coming in from other tabs
	 */
	ChasitorAPI.prototype.registerBroadcastHandlers = function registerBroadcastHandlers() {
		esw.broadcastAPI.on("incrementActiveChatSession", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.incrementActiveChatSession();
			}
		}.bind(this));

		esw.broadcastAPI.on("decrementActiveChatSession", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.decrementActiveChatSession();
			}
		}.bind(this));

		// Chasitor event from primary to act on for secondary tabs
		esw.broadcastAPI.on("liveAgentChasitorEvent", function(data) {
			// Check if not primary and valid chatKey before acting on the event
			if(this.isChatKeyValid(data.chatKey) && !this.isTabPrimary) {
				parent.postMessage({
					method: "liveagent.event",
					data: data
				}, esw.parentOrigin);
			}
		}.bind(this));

		// Gather chasitor session data from live agent and send it over to other tabs
		esw.broadcastAPI.on("gatherChasitorSessionData", function(data) {
			if(this.liveAgentChasitor) {
				this.gatherChasitorSessionData(data);
			}
		}.bind(this));

		// Broadcast handlers for actions on secondary tabs that need a chasitor connection
		// Check for this.liveAgentChasitor to avoid echoing events from multiple secondary tabs
		esw.broadcastAPI.on("sendMessage", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.sendMessage(data.message);
			}
		}.bind(this));

		esw.broadcastAPI.on("sendRichMessage", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.sendRichMessage(data.message);
			}
		}.bind(this));

		esw.broadcastAPI.on("serializeChat", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.serializeChat();
			}
		}.bind(this));

		esw.broadcastAPI.on("cancelChat", function(data) {
			if(this.isChatKeyValid(data.chatKey)) {
				// Notify parent window to destroy sidebar as chat has been canceled on a different tab.
				parent.postMessage({
					method: "liveagent.chatCanceledOnDifferentTab"
				}, esw.parentOrigin);
				if(this.liveAgentChasitor) {
					this.cancelChat();
				}
			}
		}.bind(this));

		esw.broadcastAPI.on("endChat", function(data) {
			if(this.isChatKeyValid(data.chatKey)) {
				// Notify parent window to destroy sidebar as chat has been canceled on a different tab.
				parent.postMessage({
					method: "liveagent.chatCanceledOnDifferentTab"
				}, esw.parentOrigin);
				if(this.liveAgentChasitor) {
					this.endChat();
				}
			}
		}.bind(this));

		esw.broadcastAPI.on("abortConnection", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.abortConnection();
			}
		}.bind(this));

		esw.broadcastAPI.on("sendCustomEvent", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.sendCustomEvent(data);
			}
		}.bind(this));

		esw.broadcastAPI.on("addCustomEventListener", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.addCustomEventListener();
			}
		}.bind(this));

		esw.broadcastAPI.on("sendSneakPeekOrTypingUpdate", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.sendSneakPeekOrTypingUpdate(data.message);
			}
		}.bind(this));

		esw.broadcastAPI.on("saveChat", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.saveChat();
			}
		}.bind(this));

		esw.broadcastAPI.on("removeEventListeners", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.removeEventListeners();
			}
		}.bind(this));

		esw.broadcastAPI.on("stopChasitorIdleTimeout", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.stopChasitorIdleTimeout();
			}
		}.bind(this));

		esw.broadcastAPI.on("getQueuePosition", function(data) {
			if(this.liveAgentChasitor && this.isChatKeyValid(data.chatKey)) {
				this.getQueuePosition();
			}
		}.bind(this));

		// On "getIsTabPrimary" - send a broadcast to other tabs noting this tab a primary or secondary.
		esw.broadcastAPI.on("getIsTabPrimary", function(data) {
			// Do not check for liveAgentChasitor, broadcast if this is a primary or secondary tab no matter what.
			if(data.domain === this.domain && data.deploymentId === this.chasitorSettings.deploymentId) {
				esw.broadcastAPI.send("receiveIsTabPrimary", {
					isPrimary: this.isTabPrimary,
					domain: this.domain,
					deploymentId: this.chasitorSettings.deploymentId
				});
			}
		}.bind(this));

		// On "receiveIsTabPrimary" - receive broadcasts noting if another tab is a primary or secondary.
		esw.broadcastAPI.on("receiveIsTabPrimary", function(data) {
			// Do not check for liveAgentChasitor, receive broadcasts to determine if this is a primary or secondary tab.
			if(data.domain === this.domain && data.deploymentId === this.chasitorSettings.deploymentId && this.receiveIsTabPrimaryFunction && typeof this.isTabPrimary === "undefined") {
				// At this point we know this tab doesn't know if it's a primary or secondary, so continue.
				this.receiveIsTabPrimaryFunction(data.isPrimary);
			}
		}.bind(this));
	};

	/**
	 * Set the information needed by chasitor as provided by the sidebar (ChasitorWrapper.js).
	 *
	 * @param {String} domain - The domain of the parent page.
	 * @param {Object} data - Data received from ChasitorWrapper.js - chasitorSettings, hasOnlyExtraPrechatInfo, prechatFormDetails, prechatEntities.
	 */
	ChasitorAPI.prototype.setChasitorData = function setChasitorData(domain, data) {
		this.domain = domain;
		this.chasitorSettings = data.settingsObj;
		this.hasOnlyExtraPrechatInfo = data.hasOnlyExtraPrechatInfo;
		this.prechatFormDetails = [];
		this.prechatEntities = [];

		/**
		 * If this is the primary tab, prechatFormDetails and prechatEntities will come in as
		 * properties of the `data` param. If this is a secondary tab, get them from session storage.
		 *
		 * Precedence for prechatFormDetails and prechatEntities:
		 * 1. from `data` param, which is set by the components (ChasitorWrapper.js)
		 * 2. from session storage, stored by another tab
		 * 3. default to empty arrays
		 */

		if(Array.isArray(data.prechatFormDetails) && data.prechatFormDetails.length) {
			this.prechatFormDetails = data.prechatFormDetails;
			esw.sessionAPI.setSessionData(this.domain, {
				PRECHAT_FORM_DETAILS: JSON.stringify(this.prechatFormDetails)
			});
		} else if(esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_FORM_DETAILS"]) && esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_FORM_DETAILS"]).PRECHAT_FORM_DETAILS) {
			this.prechatFormDetails = JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_FORM_DETAILS"]).PRECHAT_FORM_DETAILS);
		}
		if(Array.isArray(data.prechatEntities) && data.prechatEntities.length) {
			this.prechatEntities = data.prechatEntities;
			esw.sessionAPI.setSessionData(this.domain, {
				PRECHAT_ENTITIES: JSON.stringify(this.prechatEntities)
			});
		} else if(esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_ENTITIES"]) && esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_ENTITIES"]).PRECHAT_ENTITIES) {
			this.prechatEntities = JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["PRECHAT_ENTITIES"]).PRECHAT_ENTITIES);
		}
	};

	/**
	 * Load the chasitor.js script file.
	 */
	ChasitorAPI.prototype.createScriptElement = function createScriptElement() {
		var scriptEl = document.createElement("script");

		scriptEl.id = "chasitorScript";
		scriptEl.type = "text/javascript";

		scriptEl.onload = function() {
			this.chasitorInit();
		}.bind(this);
		scriptEl.onerror = function() {
			throw new Error("Loading chasitor script from SCRT threw an error.");
		};

		scriptEl.src = this.chasitorSettings.chasitorSrc;
		document.getElementsByTagName("head")[0].appendChild(scriptEl);
	};

	/**
	 * Serialize the current state of the chat and store it within session storage.
	 */
	ChasitorAPI.prototype.serializeChat = function serializeChat() {
		var rawSerializedJSON;
		var serializedData;

		if(this.liveAgentChasitor && !this.liveAgentChasitor.isChatEnded() && (this.liveAgentChasitor.isChatRequestSuccessful() || this.liveAgentChasitor.isChatEngaged())) {
			rawSerializedJSON = this.liveAgentChasitor.serialize();

			// We need to serialize our local copy of isChatEstablished because once the connections are aborted on the LA side, they try
			// to reConnect() which resets this state var. In order to preserve it for waiting/chat state, we must use our local copy.
			serializedData = JSON.parse(rawSerializedJSON);
			serializedData.chasitorData.isChatEstablished = this.chatWindowStateName === "Chat";

			esw.sessionAPI.setSessionData(this.domain, {
				CHASITOR_SERIALIZED_KEY: JSON.stringify(serializedData)
			});
		}
	};

	/**
	 * Handle a chasitor event and pass the accompanying data to the sidebar.
	 *
	 * @param {string} event - The name of the event.
	 * @param {object} params - A map of parameters provided by the event.
	 */
	ChasitorAPI.prototype.handleLiveAgentChasitorEvent = function handleLiveAgentChasitorEvent(event, params) {
		var formattedParams = params;
		var eventData;
		var chatDisconnectionEvents = ["chasitorAgentChatEnded", "chasitorAgentDisconnected", "chasitorChasitorChatCanceled", "chasitorChatRequestFailed", "chasitorConnectionError", "chatbotEndedChat", "postChat"];

		// Listen for chat disconnection events and remove MASTER_DEPLOYMENT_ID and ACTIVE_CHAT_SESSION
		if(chatDisconnectionEvents.indexOf(event) >= 0) {
			this.esw.sessionAPI.deleteSessionData(this.domain, ["MASTER_DEPLOYMENT_ID"]);
			// Remove ACTIVE_CHAT_SESSIONS for the deploymentId from localStorage
			this.removeActiveChatSession(this.domain, this.chasitorSettings.deploymentId);
		}

		// Store the chat key on chat request success for verification in broadcastAPI.on function calls.
		if(event === this.liveAgentChasitor.Events.CHAT_REQUEST_SUCCESSFUL) {
			this.chatKey = this.liveAgentChasitor.getChatKey();
		}

		// TODO: this should be done in chasitor
		// Remove the functions from the object to make the payload serializable
		if(typeof params === "object") {
			formattedParams = {};
			Object.getOwnPropertyNames(params).forEach(function(prop) {
				if(typeof params[prop] === "function" && GETTER_REGEX.test(prop)) {
					formattedParams[prop] = params[prop]();
				} else {
					formattedParams[prop] = params[prop];
				}
			});
		} else {
			formattedParams = params;
		}

		eventData = {
			event: event,
			params: formattedParams,
			chasitorData: this.gatherChasitorSessionData()
		};

		// Broadcast event after acting on it so that the other tabs can act on it
		// Broadcasting chat request successful event hits a corner case as outlined in W-5348690
		// Also this event is fired right when the chasitor goes into waiting state and SC comes into play right after so doesn't make sense to broadcast it
		if(event !== "chasitorChatRequestSuccessful") {
			this.sendBroadcastEventToSecondaryTabs("liveAgentChasitorEvent", eventData);
		}

		// Pass to parent frame
		parent.postMessage({
			method: "liveagent.event",
			data: eventData
		}, esw.parentOrigin);
	};

	/**
	 * Register our event listeners into chasitor.
	 */
	ChasitorAPI.prototype.registerEvents = function registerEvents() {
		if(this.events) {
			Object.keys(this.events).forEach(function(event) {
				var eventIdentifier = this.events[event];

				this.liveAgentChasitor.addEventListener(
					eventIdentifier,
					this.handleLiveAgentChasitorEvent.bind(this, eventIdentifier),
					"ESW_" + eventIdentifier
				);
			}.bind(this));
		}
	};

	/**
	 * Format the provided prechat data so that it is consumable by Live Agent, and provide
	 * it to chasitor.
	 */
	ChasitorAPI.prototype.passPrechatDataToLiveAgent = function passPrechatDataToLiveAgent() {
		// Set the prechat details through the live agent chasitor api before init
		if(this.prechatFormDetails === undefined || !this.prechatFormDetails.length) {
			return;
		}

		this.prechatFormDetails.forEach(function(prechatDetailField) {
			var prechatFieldValue = prechatDetailField.value;
			var transcriptFields = prechatDetailField.transcriptFields;
			var customDetail;

			if(typeof prechatFieldValue === "string") {
				prechatFieldValue = prechatDetailField.value.trim();
			}

			// If a customer has specified transcript field mappings in their extra prechat form details, pass them to Live Agent here.
			customDetail = this.liveAgentChasitor.addCustomDetail(prechatDetailField.label, prechatFieldValue, prechatDetailField.displayToAgent);

			if(transcriptFields) {
				transcriptFields.forEach(customDetail.addTranscriptField);
			}

			if(prechatDetailField.name === "FirstName") {
				this.liveAgentChasitor.setName(prechatFieldValue);
				this.liveAgentChasitor.setLocalName(prechatFieldValue);
			}
		}.bind(this));

		this.liveAgentChasitor.addCustomDetail("eswLiveAgentDevName", this.chasitorSettings.eswLiveAgentDevName, false);
		this.liveAgentChasitor.addCustomDetail("hasOnlyExtraPrechatInfo", this.hasOnlyExtraPrechatInfo, false);

		// Add the configured entities in setup
		// var prechatEntities = prechatEntities = [{"entityName":"Contact","showOnCreate":true,"linkToEntityName":"Case","linkToEntityField":"ContactId","saveToTranscript":"Contact","entityFieldMaps":[{"isExactMatch":true,"fieldName":"FirstName","doCreate":true,"doFind":true,"label":"firstName"},{"isExactMatch":true,"fieldName":"LastName","doCreate":true,"doFind":true,"label":"LastName"},{"isExactMatch":true,"fieldName":"Email","doCreate":true,"doFind":true,"label":"Email"}]},{"entityName":"Case","showOnCreate":true,"entityFieldMaps":[{"isExactMatch":false,"fieldName":"Subject","doCreate":true,"doFind":false,"label":"issue"},{"isExactMatch":false,"fieldName":"Status","doCreate":true,"doFind":false,"label":"Status"},{"isExactMatch":false,"fieldName":"Origin","doCreate":true,"doFind":false,"label":"Origin"}]}];
		this.prechatEntities.forEach(function(prechatEntity) {
			var entityFieldMaps;

			// "addEntity": function(entityName, showOnCreate, linkToEntityName, linkToEntityField, saveToTranscript)
			this.liveAgentChasitor.addEntity(
				prechatEntity.entityName,
				prechatEntity.showOnCreate,
				prechatEntity.linkToEntityName,
				prechatEntity.linkToEntityField,
				prechatEntity.saveToTranscript
			);

			// For each entity add the entity field map
			// "addEntityFieldsMap": function(entityName, fieldName, label, doFind, isExactMatch, doCreate)
			entityFieldMaps = prechatEntity.entityFieldMaps;

			entityFieldMaps.forEach(function(entityFieldMap) {
				this.liveAgentChasitor.addEntityFieldsMap(
					prechatEntity.entityName,
					entityFieldMap.fieldName,
					entityFieldMap.label,
					entityFieldMap.doFind,
					entityFieldMap.isExactMatch,
					entityFieldMap.doCreate
				);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Format the provided custom detail data so that it is consumable by Live Agent, and provide
	 * it to chasitor.
	 */
	ChasitorAPI.prototype.passCustomDetailsToLiveAgent = function passCustomDetailsToLiveAgent() {
		if(this.chasitorSettings.hasOwnProperty("chatbotVersion") && this.chasitorSettings.chatbotVersion) {
			this.liveAgentChasitor.addCustomDetail("chatbotVersion", this.chasitorSettings.chatbotVersion, false);
		}
	};

	/**
	 * Determine whether this is a new chat session.
	 *
	 * @returns {boolean} Is this a new chat session?
	 */
	ChasitorAPI.prototype.isNewChatSession = function isNewChatSession() {
		return !esw.sessionAPI.getSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY"]).CHASITOR_SERIALIZED_KEY;
	};

	/**
	 * Retrieve all session data from chasitor so that it can be consumed by this module.
	 *
	 * @returns {object} A map of chasitor session data.
	 */
	ChasitorAPI.prototype.gatherChasitorSessionData = function gatherChasitorSessionData(data) {
		var chasitorData = {
			chasitorSettings: this.chasitorSettings,
			acceptTime: this.liveAgentChasitor.getAcceptTime(),
			requestTime: this.liveAgentChasitor.getRequestTime(),
			oref: this.liveAgentChasitor.getOref(),
			chatKey: this.liveAgentChasitor.getChatKey(),
			connectionSessionId: this.liveAgentChasitor.getConnectionSessionId(),
			details: this.liveAgentChasitor.getDetails(),
			name: this.liveAgentChasitor.getName(),
			chatMessages: this.getChatMessages(),
			isSneakPeekEnabled: this.liveAgentChasitor.isSneakPeekEnabled(),
			isAgentTyping: this.liveAgentChasitor.isAgentTyping(),
			isFileRequested: this.liveAgentChasitor.isFileRequested(),
			isChatEstablished: this.liveAgentChasitor.isChatEstablished(),
			isChatEngaged: this.liveAgentChasitor.isChatEngaged(),
			isChatEnded: this.liveAgentChasitor.isChatEnded(),
			isChatRequestSuccessful: this.liveAgentChasitor.isChatRequestSuccessful(),
			isChatTransferredToBot: this.liveAgentChasitor.isChatTransferredToBot(),
			isChatTransferredToQueue: this.liveAgentChasitor.isChatTransferredToQueue(),
			isChatTransferredToSbrSkill: this.liveAgentChasitor.isChatTransferredToSbrSkill(),
			queuePosition: this.liveAgentChasitor.getQueuePosition(),
			orgId: this.liveAgentChasitor.getOrgId(),
			language: this.liveAgentChasitor.getLanguage(),
			lastUrl: this.liveAgentChasitor.getLastUrl(),
			transcriptSaveEnabled: this.liveAgentChasitor.getTranscriptSaveEnabled()
		};

		if(data) {
			// Restoring secondary tab, adding isSnapinsSecondaryTab for components to consume
			chasitorData.isSnapinsSecondaryTab = true;
			this.sendBroadcastEventToSecondaryTabs("chasitorSessionDataRefreshed", chasitorData);
		}

		return chasitorData;
	};

	/**
	 * Retrieve the list of sent and received chat messages and serialize them
	 * for message transfer.
	 *
	 * @returns {Array.<object>} A list of serialized messages.
	 */
	ChasitorAPI.prototype.getChatMessages = function getChatMessages() {
		var chatMessages = this.liveAgentChasitor.getChatMessages();
		var serializableChatMessages = [];

		chatMessages.forEach(function(chatMessage) {
			var serializableChatMessage = {};

			Object.getOwnPropertyNames(chatMessage).forEach(function(prop) {
				if(typeof chatMessage[prop] === "function" && GETTER_REGEX.test(prop)) {
					serializableChatMessage[prop] = chatMessage[prop]();
				}
			});
			serializableChatMessages.push(serializableChatMessage);
		});

		return serializableChatMessages;
	};

	/**
	 * Initialize chasitor functionality.
	 */
	ChasitorAPI.prototype.initializeChasitor = function initializeChasitor() {
		// W-5182346 loggingIdentifier is passed into chasitor.js and is used to
		// identify that the chat originated from Snap-ins.  If loggingIdentifier
		// is changed, chasitor.js will need to be updated as well.
		var loggingIdentifier = "snapins";
		var endpointURL = this.chasitorSettings.endpointURL;
		var contentServerURL = this.chasitorSettings.contentServerURL;
		var visitorInfo = this.chasitorSettings.visitorInfo;

		this.liveAgentChasitor.resetChasitorState();

		this.liveAgentChasitor.setOrgId(this.chasitorSettings.orgId);
		this.liveAgentChasitor.setDeploymentId(this.chasitorSettings.deploymentId);
		this.liveAgentChasitor.setButtonId(this.chasitorSettings.buttonId);

		this.passPrechatDataToLiveAgent();
		this.passCustomDetailsToLiveAgent();

		this.liveAgentChasitor.setReceiveQueueUpdates(this.chasitorSettings.isQueuePositionEnabled || false);
		this.liveAgentChasitor.setVisitorInfo(visitorInfo.visitCount, visitorInfo.originalReferrer, visitorInfo.pages);
		this.liveAgentChasitor.init(endpointURL, contentServerURL, this.chasitorSettings.fallbackRouting, false);
		this.liveAgentChasitor.startChat(loggingIdentifier);
		parent.postMessage({
			method: "liveagent.initialized",
			data: {
				chasitorEvents: this.events,
				chasitorSessionData: this.gatherChasitorSessionData()
			}
		}, esw.parentOrigin);
	};

	/**
	 * Restore an existing chasitor session.
	 */
	ChasitorAPI.prototype.restoreSession = function restoreSession() {
		var events;
		var hasChasitorSessionDataRefreshed = false;

		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.deserialize(esw.sessionAPI.getSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY"]).CHASITOR_SERIALIZED_KEY);
			this.liveAgentChasitor.setReceiveQueueUpdates(this.chasitorSettings.isQueuePositionEnabled);
			this.liveAgentChasitor.init(this.chasitorSettings.endpointURL, this.chasitorSettings.contentServerURL, this.chasitorSettings.fallbackRouting, false);
			this.liveAgentChasitor.reinitializeSession();
			this.liveAgentChasitor.restoreChasitorIdleTimeout();

			// This is the primary tab, store the chat key directly from the chasitor connection.
			this.chatKey = this.liveAgentChasitor.getChatKey();

			// Pass to parent frame
			parent.postMessage({
				method: "liveagent.restored",
				data: {
					chasitorEvents: this.events,
					chasitorSessionData: this.gatherChasitorSessionData()
				}
			}, esw.parentOrigin);
		} else {
			// Get chasitor events from the session storage.
			events = JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["CHASITOR_EVENTS"]).CHASITOR_EVENTS);

			// This is a secondary tab, store the chat key from session storage.
			this.chatKey = this.getChatKeyFromSessionStorage(this.domain);

			// Wait for getting the chasitor session data from the primary tab before restoring
			esw.broadcastAPI.on("chasitorSessionDataRefreshed", function(chasitorSessionData) {
				// Event chasitorSessionDataRefreshed is fired each time a new secondary tab is opened
				// hasChasitorSessionDataRefreshed makes sure we only listen to it once per tab
				if(!hasChasitorSessionDataRefreshed) {
					// Pass to parent frame.
					parent.postMessage({
						method: "liveagent.restored",
						data: {
							chasitorEvents: events,
							chasitorSessionData: chasitorSessionData
						}
					}, esw.parentOrigin);
					hasChasitorSessionDataRefreshed = true;
				}
			});
			// Call out to primary tab to gather chasitor session data to restore secondary tab
			esw.broadcastAPI.send("gatherChasitorSessionData", "secondaryTabRestore");
		}
	};

	/**
	 * Initialize chasitor once it has been loaded.
	 */
	ChasitorAPI.prototype.chasitorInit = function chasitorInit() {
		// Make a local copy of the liveagent.chasitor object
		this.liveAgentChasitor = window.liveagent.chasitor;

		Object.defineProperty(this, "events", {
			get: function() {
				return this.liveAgentChasitor.Events;
			}.bind(this)
		});

		// Setting chasitor events on the session storage for the secondary tabs to access
		esw.sessionAPI.setSessionData(this.domain, { CHASITOR_EVENTS: JSON.stringify(this.liveAgentChasitor.Events) });
		this.registerEvents();

		this.liveAgentChasitor.onMutate = function() {
			this.serializeChat();
		}.bind(this);

		this.startChatSession();
	};

	/**
	 * Begin a chat session or restore an existing one.
	 */
	ChasitorAPI.prototype.startChatSession = function startChatSession() {
		// Initialize chat widget as a new widget or restore its state from session storage if its
		// being continued from a previous page
		if(this.isNewChatSession()) {
			this.initializeChasitor();
		} else {
			this.restoreSession();
		}
	};

	/**
	 * Send a chat message to Live Agent.
	 *
	 * @param {string} message - The text contents of the messsage.
	 */
	ChasitorAPI.prototype.sendMessage = function sendMessage(message) {
		var data = {};

		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.sendMessage(message);
		} else if(!document.hidden) {
			data.message = message;
			this.sendBroadcastEventToSecondaryTabs("sendMessage", data);
		}
	};

	/**
	 * Send a rich message to Live Agent.
	 *
	 * @param {object} message - The object of the messsage.
	 */
	ChasitorAPI.prototype.sendRichMessage = function sendRichMessage(message) {
		var data = {};

		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.sendSnapInRichMessage(message);
		} else if(!document.hidden) {
			data.message = message;
			this.sendBroadcastEventToSecondaryTabs("sendRichMessage", data);
		}
	};

	/**
	 * Cancel the active chat request.
	 */
	ChasitorAPI.prototype.cancelChat = function cancelChat() {
		if(this.liveAgentChasitor) {
			// Cancel the chat request on the primary tab.
			this.liveAgentChasitor.cancelChat();

			// Remove ACTIVE_CHAT_SESSIONS from localStorage.
			this.removeActiveChatSession(this.domain, this.chasitorSettings.deploymentId);
		}
		// Clear session data for both primary and secondary tabs.
		this.esw.sessionAPI.deleteSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY", "MASTER_DEPLOYMENT_ID", "PRECHAT_FORM_DETAILS", "PRECHAT_ENTITIES"]);
		// Send a message to the other tabs to destroy sidebar.
		this.sendBroadcastEventToSecondaryTabs("cancelChat");
	};

	/**
	 * End the active chat.
	 */
	ChasitorAPI.prototype.endChat = function endChat() {
		if(this.liveAgentChasitor) {
			try {
				// End the chat on the primary tab.
				this.liveAgentChasitor.endChat();

				// Remove ACTIVE_CHAT_SESSIONS from localStorage
				this.removeActiveChatSession(this.domain, this.chasitorSettings.deploymentId);
			} catch(error) {
				console.error(error);
			}
		}
		// Clear session data for both primary and secondary tabs.
		this.esw.sessionAPI.deleteSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY", "MASTER_DEPLOYMENT_ID", "PRECHAT_FORM_DETAILS", "PRECHAT_ENTITIES"]);
		// Send a message to the other tabs to destroy sidebar.
		this.sendBroadcastEventToSecondaryTabs("endChat");
	};

	/**
	 * Get the chasitor's latest position in the queue.
	 *
	 * @return {Number} - Queue position
	 */
	ChasitorAPI.prototype.getQueuePosition = function getQueuePosition() {
		if(this.liveAgentChasitor && this.chasitorSettings.isQueuePositionEnabled) {
			return this.liveAgentChasitor.getQueuePosition();
		} else {
			this.sendBroadcastEventToSecondaryTabs("getQueuePosition");
		}

		return undefined;
	};

	/**
	 * Remove the passed in deploymentId details from active chat sessions.
	 *
	 * @param {*} domain - The root-level domain
	 * @param {*} deploymentId - deploymentId to remove active chat session for
	 */
	ChasitorAPI.prototype.removeActiveChatSession = function removeActiveChatSession(domain, deploymentId) {
		var activeChatSessions = JSON.parse(esw.sessionAPI.getSessionData(domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}");

		delete activeChatSessions[deploymentId];
		esw.sessionAPI.setSessionData(domain, { ACTIVE_CHAT_SESSIONS: JSON.stringify(activeChatSessions) }, true);
		// Notify parent window that it's no longer the primary
		this.updatePrimary(false, 0);
	};

	/**
	 * Increments the active sessions count for the deploymentId in localStorage
	 */
	ChasitorAPI.prototype.incrementActiveChatSession = function incrementActiveChatSession() {
		var activeChatSessions = this.domain ? JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}") : "{}";
		var deploymentId = this.chasitorSettings.deploymentId;

		if(this.liveAgentChasitor) {
			if(!activeChatSessions[deploymentId]) {
				activeChatSessions[deploymentId] = 0;
			}
			activeChatSessions[deploymentId] += 1;
			esw.sessionAPI.setSessionData(this.domain, { ACTIVE_CHAT_SESSIONS: JSON.stringify(activeChatSessions) }, true);
			esw.log("Setting number of tabs for deploymentId " + deploymentId + " to: " + activeChatSessions[deploymentId]);

			this.updatePrimary(true, activeChatSessions[deploymentId]);
		} else {
			// Post message to parent to set the browserSessionInfo
			// Incrementing by 1 to make browserSessionInfo accurate as session storage update happens only on the primary tab and is async
			this.updatePrimary(false, activeChatSessions[deploymentId] + 1);
			this.sendBroadcastEventToSecondaryTabs("incrementActiveChatSession");
		}
	};

	/**
	 * Decrements the active sessions count for the deploymentId in localStorage
	 */
	ChasitorAPI.prototype.decrementActiveChatSession = function decrementActiveChatSession() {
		var activeChatSessions = this.domain ? JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}") : "{}";
		var deploymentId = this.chasitorSettings ? this.chasitorSettings.deploymentId : undefined;

		if(this.liveAgentChasitor) {
			activeChatSessions = this.domain ? JSON.parse(esw.sessionAPI.getSessionData(this.domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}") : "{}";

			if(activeChatSessions[deploymentId]) {
				activeChatSessions[deploymentId] -= 1;
			} else {
				esw.log("Decrement active chat sessions : Local Storage item ACTIVE_CHAT_SESSIONS not found for deployment id :" + deploymentId);
			}
			esw.sessionAPI.setSessionData(this.domain, { ACTIVE_CHAT_SESSIONS: JSON.stringify(activeChatSessions) }, true);
			esw.log("Setting number of tabs for deploymentId " + deploymentId + " to: " + activeChatSessions[deploymentId]);

			this.updatePrimary(true, activeChatSessions[deploymentId]);
		} else {
			// Post message to parent to set the browserSessionInfo
			// Decrementing by 1 to make browserSessionInfo accurate as session storage update happens only on the primary tab and is async
			this.updatePrimary(false, activeChatSessions[deploymentId] - 1);
			this.sendBroadcastEventToSecondaryTabs("decrementActiveChatSession");
		}
	};

	/**
	 * Sends a postMessage to parent notifying it if it's the primary tab and the number of currently active tabs.
	 *
	 * @param {*} isPrimary - Boolean notifying if the tab is primary
	 * @param {*} activeChatSessions - number of active tabs in chat session
	 */
	ChasitorAPI.prototype.updatePrimary = function updatePrimary(isPrimary, activeChatSessions) {
		var data = {};

		data.isPrimary = this.isTabPrimary;
		data.activeChatSessions = activeChatSessions;

		esw.postMessage("session.updatePrimary", data);
	};

	/**
	 * Function to initialize a secondary tab to restore a chat session.
	 *
	 * Secondary tabs do not have an active chasitor connection.
	 */
	ChasitorAPI.prototype.loadChasitorSecondaryTab = function loadChasitorSecondaryTab() {
		this.restoreSession();
		this.incrementActiveChatSession();
	};

	/**
	 * Function to initialize a primary tab with a chasitor connection.
	 *
	 * @param {string} domain - The root-level domain which made the request.
	 * @param {object} data - Data provided by the message.
	 */
	ChasitorAPI.prototype.loadChasitorPrimaryTab = function loadChasitorPrimaryTab(domain, data) {
		var deploymentId = data.settingsObj.deploymentId;
		var activeChatSessions = JSON.parse(esw.sessionAPI.getSessionData(domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}");
		var chasitorScript = document.getElementById("chasitorScript");

		// Chasitor should only ever be loaded once.
		if(chasitorScript) {
			// If chasitor is already loaded, destroy it.
			chasitorScript.parentNode.removeChild(chasitorScript);

			// Find the CDM frame and destroy it.
			[].slice.apply(document.querySelectorAll("iframe")).forEach(function(frame) {
				var src = frame.getAttribute("src");

				if(src && src.indexOf("cdm") !== -1) {
					frame.parentNode.removeChild(frame);
				}
			});

			// Remove existing event listeners to prevent duplicate events.
			this.removeEventListeners();
		}

		// Need to confirm domain on chasitor src before loading
		this.verifyScriptHost(this.chasitorSettings.chasitorSrc);
		this.verifyScriptHost(this.chasitorSettings.endpointURL, "Invalid chat endpoint; valid choices are: " + VALID_CHASITOR_DOMAINS.join(", "));

		this.createScriptElement();

		// Set the sessionStorage variable to denote the primary tab.
		esw.sessionAPI.setSessionData(domain, { MASTER_DEPLOYMENT_ID: deploymentId });

		// Update/add the localStorage ACTIVE_CHAT_SESSIONS to denote active chats for a deploymentId.
		// Don't set localStorage for iOS devices to block session continuity on iOS.
		if(esw.getSafariType() !== "mobile") {
			activeChatSessions[deploymentId] ? activeChatSessions[deploymentId] += 1 : activeChatSessions[deploymentId] = 1;
			esw.sessionAPI.setSessionData(domain, { ACTIVE_CHAT_SESSIONS: JSON.stringify(activeChatSessions) }, true);
		}
		this.updatePrimary(true, 1);
	};

	/**
	 * Destroy an existing copy of chasitor if one exists, then load a new one.
	 *
	 * @param {string} domain - The root-level domain which made the request.
	 * @param {object} data - Data provided by the message.
	 */
	ChasitorAPI.prototype.loadChasitor = function loadChasitor(domain, data) {
		var deploymentId = data.settingsObj.deploymentId;
		var activeChatSessions = JSON.parse(esw.sessionAPI.getSessionData(domain, ["ACTIVE_CHAT_SESSIONS"], true).ACTIVE_CHAT_SESSIONS || "{}");
		var numActiveChatSessions = activeChatSessions[deploymentId] || 0;

		this.setChasitorData(domain, data);

		/**
		 * This function will receive broadcasts from other tabs about whether or not they are the primary tab.
		 *
		 * This function assumes that all tabs will respond.
		 *
		 * Call esw.broadCastAPI.off("receiveIsTabPrimary") once we figure out if this tab is a primary or secondary,
		 * no need to listen from other tabs once we know if this tab is a primary or a secondary.
		 *
		 * @param {boolean} isOtherTabPrimary - True if the tab that send the broadcast is the primary tab for this deploymentId.
		 */
		this.receiveIsTabPrimaryFunction = function(isOtherTabPrimary) {
			if(isOtherTabPrimary) {
				// If another tab is the primary, you are a secondary.
				this.isTabPrimary = false;
				this.loadChasitorSecondaryTab();
				esw.broadcastAPI.off("receiveIsTabPrimary");
			} else if(numActiveChatSessions === 1 && !isOtherTabPrimary) {
				/**
				 * This case accounts for refreshing the primary tab when there is any number of secondary tabs open.
				 * If there's only one other tab that's a secondary tab or this is the last tab we hear from, this tab is the primary.
				 */
				this.isTabPrimary = true;
				this.loadChasitorPrimaryTab(domain, data);
				esw.broadcastAPI.off("receiveIsTabPrimary");
			} else {
				// Decrement the number of tabs we expect to hear from.
				numActiveChatSessions -= 1;
			}
		}.bind(this);

		/**
		 * If there are no other active chat sessions, this is a new session (so this is definitely the primary tab).
		 * Session continuity across tabs is not supported in IE11 or Edge. Always initialize chasitor.
		 */
		if(numActiveChatSessions === 0 || esw.isInternetExplorer() || esw.isEdge()) {
			this.isTabPrimary = true;
			this.loadChasitorPrimaryTab(domain, data);
		} else {
			// Send request to get primary tab information about all other tabs.
			esw.broadcastAPI.send("getIsTabPrimary", {
				domain: this.domain,
				deploymentId: deploymentId
			});
		}
	};

	/**
	 * Verify that a script's host is from Salesforce live agent URL
	 *
	 * From https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string/23945027#23945027.
	 *
	 * @param {String} url - The URL to verify.
	 * @param {String} [message] - A message to display if the host is not valid.
	 * @returns {boolean} Is the host correct?
	 */
	ChasitorAPI.prototype.verifyScriptHost = function verifyScriptHost(url, message) {
		var hostname;

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

		// Validate that the hostname is valid.
		if(!this.isValidHostname(hostname)) {
			throw new Error(message ||
				"Chasitor script served from invalid host! Chasitor script must come from one of the following domains: " + VALID_CHASITOR_DOMAINS.join(", "));
		}
	};

	/**
	 * Verify that the given hostname is valid to load chasitor script from.
	 */
	ChasitorAPI.prototype.isValidHostname = function isValidHostname(hostname) {
		// If the hostname ends with one of the validSalesforceDomains, it is valid.
		return VALID_CHASITOR_DOMAINS.some(function(validDomain) {
			return hostname.indexOf(validDomain, hostname.length - validDomain.length) > 0;
		});
	};

	/**
	 * Send a sneak peek or typing update to the agent.
	 *
	 * @param {string} message - The message currently typed by the visitor.
	 */
	ChasitorAPI.prototype.sendSneakPeekOrTypingUpdate = function sendSneakPeekOrTypingUpdate(message) {
		var data = {};

		if(this.liveAgentChasitor) {
			if(this.liveAgentChasitor.isSneakPeekEnabled()) {
				this.liveAgentChasitor.sendSneakPeek(message);
			} else {
				this.liveAgentChasitor.sendTypingUpdate(message.length);
			}
		} else {
			data.message = message;
			this.sendBroadcastEventToSecondaryTabs("sendSneakPeekOrTypingUpdate", data);
		}
	};

	/**
	 * Save and download the chat transcript. Due to an iOS issue with form submission inside iframes, we must do the
	 * save chat request in the parent window, instead of here. In that scenario, we just send the necessary data to the
	 * parent.
	 *
	 * This implementation is copied from chasitor.js's saveChat function.
	 */
	ChasitorAPI.prototype.saveChat = function saveChat() {
		var textLog = "";
		var names = [];
		var timestamps = [];
		var messages = [];

		if(this.liveAgentChasitor) {
			// If iOS and iOS version < 14, then package the request data and send it to the parent window.
			// W-8794188 - iOS version 14 and onwards don't require special handling for saving the transcript.
			if(this.isIOS() && this.getOSVersion() < 14) {
				this.liveAgentChasitor.getChatMessages().forEach(function(chatMessage) {
					var messageContent = chatMessage.getContent();

					// Convert rich content to a string (if necessary) before adding message content.
					if(typeof messageContent !== "string") messageContent = getRichMessageContent(messageContent);

					if(messageContent) {
						names.push(chatMessage.getName());
						timestamps.push(chatMessage.getTimestamp());
						messages.push(messageContent);
					}
				});
				textLog = JSON.stringify({
					names: names,
					timestamps: timestamps,
					messages: messages
				});

				esw.postMessage(
					"liveagent.saveChatIOSCallback",
					{
						chasitorData: this.gatherChasitorSessionData(),
						textLog: textLog
					}
				);
			} else {
				this.liveAgentChasitor.saveChat();
			}
		} else if(!document.hidden) {
			this.sendBroadcastEventToSecondaryTabs("saveChat");
		}
	};

	/**
	 * Returns true if the user-agent is a browser running on iOS (and also not IE on Windows Phone; there's some iOS in
	 * Windows Phone https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx).
	 *
	 * This implementation is copied from chasitor.js's saveChat function.
	 *
	 * @return {boolean} True, if the user-agent is on iOS; false otherwise.
	 */
	ChasitorAPI.prototype.isIOS = function isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	};

	/**
	 * Returns the OS version for the user-agent.
	 * Note: Though this regex can match any OS version, it works best in the case of iOS (iPhone OS 13_7).
	 *
	 * Example of an iOS user-agent -
	 * "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1"
	 * For the above example, this function returns 13.
	 *
	 * This implementation is copied from chasitor.js's saveChat function.
	 *
	 * @return {number} OS version number as an integer.
	 */
	ChasitorAPI.prototype.getOSVersion = function getOSVersion() {
		var version = navigator.userAgent.match(/OS (\d+)(_\d+)+/);
		if (version) {
			return parseInt(version[1]);
		}
		return -1;
	};

	/**
	 * Abort the active connection and serialize active chat.
	 * Doesn't really abort the connection but pauses the long poll.
	 */
	ChasitorAPI.prototype.abortConnection = function abortConnection() {
		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.abortConnection();
			this.serializeChat();
		} else {
			this.sendBroadcastEventToSecondaryTabs("abortConnection");
		}
	};

	/**
	 * Serialize the chasitor session data.
	 */
	ChasitorAPI.prototype.serialize = function serialize() {
		this.liveAgentChasitor.serialize();
	};

	/**
	 * Sends a custom event to the agent console of the agent who is currently chatting with a customer.
	 *
	 * @param {string} postMessageData - Data provided by the message.
	 */
	ChasitorAPI.prototype.sendCustomEvent = function sendCustomEvent(postMessageData) {
		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.sendCustomEvent(postMessageData.type, postMessageData.data);
		} else {
			this.sendBroadcastEventToSecondaryTabs("sendCustomEvent", postMessageData);
		}
	};

	/**
	 * Retrieves a list of custom events that have been received in this chat window during this chat session.
	 * Sends a message back to the parentframe with the events as a JSON formatted string
	 * e.g. [{"source":"Agent","type":"startSession","data":"myCustomEventData","date":"Wed Feb 21 2018 12:10:59 GMT-0800 (PST)"}]
	 */
	ChasitorAPI.prototype.getCustomEvents = function getCustomEvents() {
		var customEvents = this.liveAgentChasitor.getCustomEvents();
		var customEventsPayload = customEvents.map(function(customEvent) {
			return {
				source: customEvent.getSource(),
				type: customEvent.getType(),
				data: customEvent.getData(),
				date: customEvent.getDate()
			};
		});
		var customEventsPayloadJson = JSON.stringify(customEventsPayload);

		parent.postMessage({
			method: "liveagent.getCustomEventsResult",
			data: {
				customEvents: customEventsPayloadJson
			}
		}, esw.parentOrigin);
	};

	/**
	 * Registers a function to call when a custom event is received in the chat window.
	 * @param {string} type - The type of custom event to listen for.
	 */
	ChasitorAPI.prototype.addCustomEventListener = function addCustomEventListener(type) {
		var customEventCallback = function(result) {
			parent.postMessage({
				method: "liveagent.customEventReceived",
				data: {
					type: result.getType(),
					data: result.getData()
				}
			}, esw.parentOrigin);
		};

		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.addCustomEventListener(type, customEventCallback);
		} else {
			this.sendBroadcastEventToSecondaryTabs("addCustomEventListener", type);
		}
	};

	/**
	 * Remove any attached chasitor event listeners.
	 */
	ChasitorAPI.prototype.removeEventListeners = function removeEventListeners() {
		if(this.liveAgentChasitor) {
			window.liveagent.removeEventListeners();
		} else {
			this.sendBroadcastEventToSecondaryTabs("removeEventListeners");
		}
	};

	/**
	 * Update the stored sidebar Live Agent feature state.
	 *
	 * @param {string} chatWindowState - The current Live Agent feature state.
	 */
	ChasitorAPI.prototype.updateChatWindowState = function updateChatWindowState(chatWindowState) {
		this.chatWindowStateName = chatWindowState;
		if(this.liveAgentChasitor) {
			this.serializeChat();
		} else {
			this.sendBroadcastEventToSecondaryTabs("serializeChat");
		}
	};

	/**
	 * Stop the idle countdown.
	 */
	ChasitorAPI.prototype.stopChasitorIdleTimeout = function stopChasitorIdleTimeout() {
		if(this.liveAgentChasitor) {
			this.liveAgentChasitor.stopChasitorIdleTimeout();
		} else {
			this.sendBroadcastEventToSecondaryTabs("stopChasitorIdleTimeout");
		}
	};

	esw.chasitorAPI = new ChasitorAPI();
});