/* Copyright, 2016, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 * To create a new version of chasitor.esw.js:
 * https://docs.google.com/a/salesforce.com/document/d/1SofIGBPyHJtNTrZ5zSeFbLvngomJOCmdCTjBOq_-2LI/edit?usp=sharing
 *
 * Version 3.0 - Refactored to follow prototype pattern and utilize 3.0 modulization system.
 *
 * TO MINIFY: java -jar ~/yuicompressor-2.4.8.jar --preserve-semi --disable-optimizations chasitorapi.esw.js -o chasitorapi.esw.min.js
 */

/**
 * Messages handled by this module:
 *     chasitor.load|chasitor.sendMessage|chasitor.cancelChat|chasitor.endChat|chasitor.sendSneakPeekOrTypingUpdate|chasitor.saveChat
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

	/**
	 * Storage feature module for providing chasitor.js functionality.
	 *
	 * @class
	 * @property {ESW} esw - The parent ESW object.
	 * @property {object} liveAgentChasitor - The chasitor object created by chasitor.js
	 * @property {object} events - A list of events provided by chasitor.
	 * @property {object} chasitorSettings - Configuration data for chasitor.
	 * @property {object} prechatFormDetails - Form details provided by prechat.
	 * @property {object} prechatEntiteis - Entities provided by prechat.
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

		this.registerMessageHandlers();

		esw.loadFeatureScript("FileTransfer");
	}

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
	};

	/**
	 * Set the information needed by chasitor as provided by the sidebar.
	 */
	ChasitorAPI.prototype.setChasitorData = function setChasitorData(domain, data) {
		this.domain = domain;
		this.chasitorSettings = data.settingsObj;
		this.hasOnlyExtraPrechatInfo = data.hasOnlyExtraPrechatInfo;
		this.prechatFormDetails = data.prechatFormDetails;
		this.prechatEntities = data.prechatEntities;
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

		scriptEl.src = this.chasitorSettings.chasitorSrc;
		document.getElementsByTagName("head")[0].appendChild(scriptEl);
	};

	/**
	 * Serialize the current state of the chat and store it within session storage.
	 */
	ChasitorAPI.prototype.serializeChat = function serializeChat() {
		var rawSerializedJSON;
		var serializedData;

		if(!this.liveAgentChasitor.isChatEnded() && (this.liveAgentChasitor.isChatRequestSuccessful() || this.liveAgentChasitor.isChatEngaged())) {
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

		// Pass to parent frame
		parent.postMessage({
			method: "liveagent.event",
			data: {
				event: event,
				params: formattedParams,
				chasitorData: this.gatherChasitorSessionData()
			}
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
	ChasitorAPI.prototype.gatherChasitorSessionData = function gatherChasitorSessionData() {
		return {
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
			isChatTransferredToQueue: this.liveAgentChasitor.isChatTransferredToQueue(),
			isChatRequestSuccessful: this.liveAgentChasitor.isChatRequestSuccessful(),
			orgId: this.liveAgentChasitor.getOrgId(),
	        language: this.liveAgentChasitor.getLanguage(),
			lastUrl: this.liveAgentChasitor.getLastUrl(),
			transcriptSaveEnabled: this.liveAgentChasitor.getTranscriptSaveEnabled()
		};
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

		this.liveAgentChasitor.setVisitorInfo(visitorInfo.visitCount, visitorInfo.originalReferrer, visitorInfo.pages);

		this.liveAgentChasitor.init(endpointURL, contentServerURL, [], false);
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
		this.liveAgentChasitor.deserialize(esw.sessionAPI.getSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY"]).CHASITOR_SERIALIZED_KEY);
		this.liveAgentChasitor.init(this.chasitorSettings.endpointURL, this.chasitorSettings.contentServerURL, [], false);
		this.liveAgentChasitor.reinitializeSession();
		this.liveAgentChasitor.restoreChasitorIdleTimeout();

		// Pass to parent frame
		parent.postMessage({
			method: "liveagent.restored",
			data: {
				chasitorEvents: this.events,
				chasitorSessionData: this.gatherChasitorSessionData()
			}
		}, esw.parentOrigin);
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
		this.liveAgentChasitor.sendMessage(message);
	};

	/**
	 * Send a rich message to Live Agent.
	 *
	 * @param {object} message - The object of the messsage.
	 */
	ChasitorAPI.prototype.sendRichMessage = function sendRichMessage(message) {
		this.liveAgentChasitor.sendSnapInRichMessage(message);
	};

	/**
	 * Cancel the active chat request.
	 */
	ChasitorAPI.prototype.cancelChat = function cancelChat() {
		this.liveAgentChasitor.cancelChat();
		this.esw.sessionAPI.deleteSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY"]);
	};

	/**
	 * End the active chat.
	 */
	ChasitorAPI.prototype.endChat = function endChat() {
		this.liveAgentChasitor.endChat();
		this.esw.sessionAPI.deleteSessionData(this.domain, ["CHASITOR_SERIALIZED_KEY"]);
	};

	/**
	 * Destroy an exiting copy of chasitor if one exists, then load a new one.
	 *
	 * @param {string} domain - The root-level domain which made the request.
	 * @param {object} data - Data provided by the message.
	 */
	ChasitorAPI.prototype.loadChasitor = function loadChasitor(domain, data) {
		var chasitorScript = document.getElementById("chasitorScript");

		this.setChasitorData(domain, data);

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

		this.createScriptElement();
	};

	/**
	 * Send a sneak peek or typing update to the agent.
	 *
	 * @param {string} message - The message currently typed by the visitor.
	 */
	ChasitorAPI.prototype.sendSneakPeekOrTypingUpdate = function sendSneakPeekOrTypingUpdate(message) {
		if(this.liveAgentChasitor.isSneakPeekEnabled()) {
			this.liveAgentChasitor.sendSneakPeek(message);
		} else {
			this.liveAgentChasitor.sendTypingUpdate(message.length);
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

		// If iOS, package the request data and send it to the parent window.
		if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
			this.liveAgentChasitor.getChatMessages().forEach(function(chatMessage) {
				names.push(chatMessage.getName());
				timestamps.push(chatMessage.getTimestamp());
				messages.push(chatMessage.getContent());
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
	};

	/**
	 * Abort the active connection.
	 */
	ChasitorAPI.prototype.abortConnection = function abortConnection() {
		this.liveAgentChasitor.abortConnection();
	};

	/**
	 * Serialize the chasitor session data.
	 */
	ChasitorAPI.prototype.serialize = function serialize() {
		this.liveAgentChasitor.serialize();
	};

	/**
	 * Remove any attached chasitor event listeners.
	 */
	ChasitorAPI.prototype.removeEventListeners = function removeEventListeners() {
		window.liveagent.removeEventListeners();
	};

	/**
	 * Update the stored sidebar Live Agent feature state.
	 *
	 * @param {string} chatWindowState - The current Live Agent feature state.
	 */
	ChasitorAPI.prototype.updateChatWindowState = function updateChatWindowState(chatWindowState) {
		this.chatWindowStateName = chatWindowState;
		this.serializeChat();
	};

	/**
	 * Stop the idle countdown.
	 */
	ChasitorAPI.prototype.stopChasitorIdleTimeout = function stopChasitorIdleTimeout() {
		this.liveAgentChasitor.stopChasitorIdleTimeout();
	};

	esw.chasitorAPI = new ChasitorAPI();
});
