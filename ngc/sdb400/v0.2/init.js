/*
 * Copyright 2025 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

(() => {
	/**
	 * Parent page elements class constants.
	 */
	const TOP_CONTAINER_NAME = "agentforce-messaging";
	const LWR_IFRAME_NAME = "agentforce-messaging-frame";

	let messagingJwt;
	let conversationId = generateUUID();

	/**
	 * Generate a UUID.
	 * Taken from CSI team:
	 * https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/ui-conversation-agent-components/modules/scrt/utils/utils.js#60
	 */
	function generateUUID() {
		const hexDigits = "0123456789abcdef";
		const valueArray = new Uint32Array(32);
		crypto.getRandomValues(valueArray);

		let res = '';
		for (let i = 0; i < 32; i++) {
			if (i === 8 || i === 12 || i === 16 || i === 20) {
				res += '-';
			}
			if (i === 12) {
				res += '4'; // UUID version
			} else if (i === 16) {
				res += hexDigits.charAt((valueArray[i] & 0x3) | 0x8); // Bits need to start with 10
			} else {
				res += hexDigits.charAt(valueArray[i] & 0xf);
			}
		}

		return res;
	}
	
	/**
	 * Returns end-user device information (OS and browser details) in the form of URL query parameters. This utility method
	 * is mainly used by the capabilities registration feature.
	 *
	 * @returns {string} OS and browser details as query params.
	 */
	function getDeviceInfoAsQueryParams() {
		let deviceInfo = "";
		const userEnvironmentDetails = getUserEnvironmentDetails();
		if (userEnvironmentDetails) {
			deviceInfo = new URLSearchParams({
				os: userEnvironmentDetails.os.name,
				osVersion: userEnvironmentDetails.os.version,
				browser: userEnvironmentDetails.browser.name,
				browserVersion: userEnvironmentDetails.browser.version
			}).toString();
		}
		return deviceInfo;
	}

	/**
	 * Get User Environment details, specifically Browser and OS details using navigator.userAgent.
	 * Based on an existing JS implementation (https://jsfiddle.net/kmturley/Gd6c8/).
	 *
	 * @returns {object} - returns OS and Browser info.
	 */
	function getUserEnvironmentDetails() {
		const header = [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera];
		const dataos = [
			{ name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
			{ name: 'Windows', value: 'Win', version: 'NT' },
			{ name: 'iPhone', value: 'iPhone', version: 'OS' },
			{ name: 'iPad', value: 'iPad', version: 'OS' },
			{ name: 'Kindle', value: 'Silk', version: 'Silk' },
			{ name: 'Android', value: 'Android', version: 'Android' },
			{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
			{ name: 'BlackBerry', value: 'BlackBerry', version: '/' },
			{ name: 'Macintosh', value: 'Mac', version: 'OS X' },
			{ name: 'Linux', value: 'Linux', version: 'rv' },
			{ name: 'Palm', value: 'Palm', version: 'PalmOS' }
		];
		const databrowser = [
			{ name: 'Edge', value: 'Edg', version: 'Edg' },
			{ name: 'Chrome', value: 'Chrome', version: 'Chrome' },
			{ name: 'Firefox', value: 'Firefox', version: 'Firefox' },
			{ name: 'Safari', value: 'Safari', version: 'Version' },
			{ name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
			{ name: 'Opera', value: 'Opera', version: 'Opera' },
			{ name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
			{ name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
		];

		const agent = header.join(' ');
		const os = matchItem(agent, dataos);
		const browser = matchItem(agent, databrowser);

		return { os, browser };
	}

	/**
	 * Performs regex operations on navigator.userAgent when invoked by #getUserEnvironmentDetails to extract Browser info (name & version) and OS info (name & version).
	 */
	function matchItem(string, data) {
		let i = 0;
		let j = 0;
		let regex;
		let regexv;
		let match;
		let matches;
		let version;

		for (i = 0; i < data.length; i += 1) {
			regex = new RegExp(data[i].value, 'i');
			match = regex.test(string);
			if (match) {
				regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
				matches = string.match(regexv);
				version = '';
				if (matches) {
					if (matches[1]) {
						matches = matches[1];
					}
				}
				if (matches) {
					matches = matches.split(/[._]+/);
					for (j = 0; j < matches.length; j += 1) {
						if (j === 0) {
							version += matches[j] + '.';
						} else {
							version += matches[j];
						}
					}
				} else {
					version = '0';
				}
				return {
					name: data[i].name,
					version: parseFloat(version)
				};
			}
		}
		return { name: 'unknown', version: 0 };
	}

	// =========================
    //  DOM Selectors
    // =========================
	function getTopContainer() {
		return document.getElementById(TOP_CONTAINER_NAME);
	};

	function getIframe() {
		return document.getElementById(LWR_IFRAME_NAME);
	};

	function getSiteURL() {
		try {
			return agentforce_messaging.settings.siteURL;
		} catch(err) {
			console.error(`Error retrieving site URL: ${err}`);
		}
	}

	// =========================
    //  Iframe Resizing
    // =========================
	function handleMinimize() {
        const frame = getIframe();

        if (frame) {
            if (frame.classList.contains("maximized")) {
				frame.classList.remove("maximized");
				frame.classList.add("minimized");
            } else if (frame.classList.contains("entry") || frame.classList.contains("minimized")) {
				if (frame.classList.contains("entry")) {
					frame.classList.remove("entry");
					frame.classList.add("minimized");
				}
            }
        }
	}

	function handleResize() {
        const frame = getIframe();

        if (frame) {
            if (frame.classList.contains("expanded")) {
				frame.classList.remove("expanded");
				frame.classList.add("contracted");
            } else if (frame.classList.contains("contracted")) {
				frame.classList.remove("contracted");
				frame.classList.add("expanded");
            }
        }

    }

	// =========================
    //  Iframe Message Handlers
    // =========================
	function handleMessageEvent(postMessage) {
		switch (postMessage.data.method) {
			case "resize":
				handleResize();
				break;
			case "minimize":
				handleMinimize();
				break;
			case "text_message_link_click":
				handleLinkClick(postMessage);
			default:
				console.warn("Unrecognized event name: " + postMessage.data.method);
				break;
		}
	}

	/**
	 * Check if web client is being used in a Mobile Publisher context.
	 * Detect Mobile Publisher (https://sourcegraph.soma.salesforce.com/perforce.soma.salesforce.com/app/main/core@HEAD/-/blob/sites/java/src/sites/communities/hybridapp/util/CoreCommunityHybridAppUtilImpl.java?L25).
	 * Update this check in W-12462964.
	 *
	 * @returns {boolean} - return 'true' if we are in a Mobile Publisher context and 'false' otherwise.
	 */
	function isMobilePublisherApp() {
	   return navigator.userAgent.includes("CommunityHybridContainer") || navigator.userAgent.includes("playgroundcommunity");
   	}

	/**
	 * Handle a link click. If 'shouldOpenLinksInSameTab' setting is TRUE, open the link in the same tab and open a new tab if FALSE.
	 * In case of Mobile Publisher, let the link navigation happen as usual per the app's control behavior.
	 * @param {object} event - message event containing the link details
	 */
	function handleLinkClick(event) {
		try {
			if (event && event.data && event.data.data && event.data.data.link) {
				const linkElement = document.createElement("a");
				linkElement.setAttribute('href', event.data.data.link);
				linkElement.setAttribute('rel', 'noopener noreferrer');
				if (isMobilePublisherApp() || !Boolean(agentforce_messaging.settings.shouldOpenLinksInSameTab)) {
					linkElement.setAttribute('target', "_blank");
				}
				linkElement.click();
			}
		} catch (err) {
			throw new Error("handleLinkClick", `Something went wrong in handling a link click: ${err}`);
		}
	}

	/**
	 * Sends configuration data to LWR app. Optional - Adds jwt & conversation data to configuration before sending if specified.
	 * @param jwtData - Optional jwtData (accessToken & lastEventId).
	 * @param conversationData - Optional new or existing conversation data.
	 * @param errorData - Optional error data to pass to Chat Unavailable State.
	 * @param isPageLoad - Whether we are attempting to continue an existing session (using an existing JWT from web storage) on page/script load.
	 */
	function sendConfigurationToAppIframe(jwtData, conversationData, errorData, isPageLoad = false) {
		let configData = Object.assign({}, 
			agentforce_messaging.settings, 
			agentforce_messaging.settings.snippetConfig, {
			conversationId,
			devMode: Boolean(agentforce_messaging.settings.devMode),
			noSsePatch: Boolean(agentforce_messaging.settings.noSsePatch),
			language: agentforce_messaging.settings.language,
			hostUrl: window.location.href,
			capabilitiesVersion: "254"
		})


		if (jwtData) {
			configData = Object.assign(configData, { jwtData });
		}
		if (conversationData) {
			configData = Object.assign(configData, { conversationData });
		}

		if (errorData) {
			configData = Object.assign(configData, { errorData });
		}

		configData.isExistingSessionOnPageLoad = isPageLoad;
		// TODO - Avoid adding targetElement to config data
		delete configData.targetElement;
		sendPostMessageToAppIframe("ESW_SET_CONFIG_EVENT", configData);
	}

	/**
	 * Send a post message to the LWR App iframe window. If the frame is not ready, wait for it.
	 *
	 * @param {String} method - Name of method.
	 * @param {Object} data - Data to send with message. Only included in post message if data is defined.
	 */
	function sendPostMessageToAppIframe(method, data) {
		// lwrIframeReadyPromise.then(() => {
			const iframe = getIframe();

			if (typeof method !== "string") {
				throw new Error(`Expected a string to use as message param in post message, instead received ${method}.`);
			}

			if(iframe && iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{
						method,
						...data && { data }
					},
					getSiteURL()
				);
			} else {
				console.warning(`Embedded Messaging iframe not available for post message with method ${method}.`);
			}
		// });
	}

	// =========================
    //  ia-message-service
    // ========================
	/**
	 * SCRT Paths
	 */
	const IN_APP_API_PREFIX = "/iamessage";
	const IN_APP_API_VERSION = "/v1";
	const ACCESS_TOKEN_PATH = "/accessToken";
	const AUTHORIZATION_PATH = "/authorization";
	const UNAUTHENTICATED_PATH = "/unauthenticated";
	const AUTHENTICATED_PATH = "/authenticated";
	const QUERIES_PATH = "/queries";
	const CAPABILITIES_PATH = "/device/registerDeviceCapabilities";
	const UNAUTHENTICATED_ACCESS_TOKEN_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + AUTHORIZATION_PATH + UNAUTHENTICATED_PATH + ACCESS_TOKEN_PATH;
	const AUTHENTICATED_ACCESS_TOKEN_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + AUTHORIZATION_PATH + AUTHENTICATED_PATH + ACCESS_TOKEN_PATH;
	const CONVERSATION_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + "/conversation";
	const CONTINUITY_ACCESS_TOKEN_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + AUTHORIZATION_PATH +  "/continuityAccessToken";
	const LIST_CONVERSATIONS_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + QUERIES_PATH + "/conversation/list";
	const REGISTER_DEVICE_CAPABILITIES_PATH = IN_APP_API_PREFIX + IN_APP_API_VERSION + CAPABILITIES_PATH;
	const TRANSCRIPT_PATH = "/transcript";

	/**
	 * Initializes the active state by creating a JWT.
	 * This method does the following -
	 * 1. Create a JWT if in AUTH mode OR if prechat is disabled, ELSE resolve the promise.
	 * 2. If we are in AUTH mode, use the JWT from Step 1 to list existing open conversations of this end-user.
	 *
	 * @returns {Promise}
	 */
	function initializeConversationState() {
		return handleGetUnauthenticatedJwt().then((jwtData) => {
			return handleCreateNewConversation().then((conversationData) => {
				console.log("finished creating conversation");
				sendConfigurationToAppIframe(jwtData, conversationData);
			}).catch((e) => {
				console.error(`error creating conversation: ${e}`);
			});
		});
	}

	/**
	 * Handle creating a new conversation for this end user. Also handles registering device capabilities if the conversation creation is successful.
	 *
	 * @param prechatFields - Pre-chat data to be sent with the request. Includes visible and/or hidden pre-chat fields
	 * 							based on pre-chat setup.
	 * @returns {Promise<*>} - Promise which is resolved when creatConversation call completes.
	 */
	function handleCreateNewConversation() {
		//Check if this has already been called
		// if (startingConversation) {
		// 	error("handleCreateNewConversation", "Attempting to create new conversation multiple times!", null, true);
		// 	return Promise.resolve();
		// }

		// startingConversation = true;
		return createNewConversation()
			.then((conversationResponse) => {
				// //Dispatch ON_EMBEDDED_MESSAGING_CONVERSATION_STARTED event to parent window
				// dispatchEventToHost(ON_EMBEDDED_MESSAGING_CONVERSATION_STARTED_EVENT_NAME, { detail: { conversationId } });
				// handleRegisterDeviceCapabilities();
				// // Track the ES Developer name for the newly created conversation. It would be typically the one from the page snippet.
				// conversationResponse.esDeveloperName = agentforce_messaging.settings.eswConfigDevName;
				console.log(`Initialized the esDeveloperName associated with current conversation to: ${agentforce_messaging.settings.eswConfigDevName}`);
				return conversationResponse;
		});
	}

	/**
	 * Create a new conversation.
	 *
	 * https://git.soma.salesforce.com/pages/service-cloud-realtime/scrt2-docs/openapi/?app=ia-message-service#operation/createConversation
	 *
	 * @param {Object} routingAttributes - Optional. Prechat data to be used while routing the conversation request.
	 * @returns {Promise}
	 */
	function createNewConversation(routingAttributes) {
		// TODO: snippetConfig
		const endpoint = agentforce_messaging.settings.snippetConfig.scrt2URL.concat(CONVERSATION_PATH);

		return sendFetchRequest(
			endpoint,
			"POST",
			"cors",
			null,
			{
				...(routingAttributes && { routingAttributes }),
				conversationId
			},
		).then(response => response.json());
	};

	/**
	 * Handle getting an unauthenticated JWT.
	 *
	 * @returns {Promise}
	 */
	function handleGetUnauthenticatedJwt() {
		return getUnauthenticatedJwt()
			.then(response => {
				messagingJwt = (response.accessToken);
				console.log("Successfully retreived an Unauthenticated JWT");
				return response;
			})
			.catch(e => {
				console.error("Error retreived an Unauthenticated JWT");
				return e; // handleGetJwtError(e);
			});
	}

	/**
	 * Get a JWT for an anonymous user. This JWT is used for unauthenticated conversations.
	 *
	 * https://git.soma.salesforce.com/pages/service-cloud-realtime/scrt2-docs/openapi/?app=ia-message-service#operation/unAuthenticatedAccessToken
	 *
	 * @returns {Promise}
	 */
	function getUnauthenticatedJwt() {
		const orgId = agentforce_messaging.settings.orgId;
		const developerName = agentforce_messaging.settings.eswConfigDevName;
		// const deviceInfoAsQueryParams = getDeviceInfoAsQueryParams();
		// TODO snippetConfig
		const endpoint = agentforce_messaging.settings.snippetConfig.scrt2URL.concat(UNAUTHENTICATED_ACCESS_TOKEN_PATH);
			// deviceInfoAsQueryParams ?
			// agentforce_messaging.settings.scrt2URL.concat(UNAUTHENTICATED_ACCESS_TOKEN_PATH, "?", deviceInfoAsQueryParams):
			// ;

		return sendFetchRequest(
			endpoint,
			"POST",
			"cors",
			{
				"Content-Type": "application/json"
			},
			{
				orgId,
				developerName,
				capabilitiesVersion: "254"
			}
		).then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		});
	}

	/**
	 * Send an HTTP request using fetch with a specified path, method, mode, headers, and body.
	 *
	 * @param {String} apiPath - Endpoint to make request to.
	 * @param {String} method - HTTP request method (POST, GET, DELETE).
	 * @param {String} mode - HTTP mode (cors, no-cors, same-origin, navigate).
	 * @param {Object} requestHeaders - Headers to include with request.
	 * @param {Object} requestBody - Body to include with request. This method stringifies the object passed in, except when
	 *                               uploading a file. For file attachments, request body must be binary data.
	 * @returns {Promise}
	 */
	function sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller=apiPath) {
		const headers = requestHeaders ?
			requestHeaders :
			{
				"Content-Type": "application/json",
				...(messagingJwt && { "Authorization": "Bearer " + messagingJwt })
			};
		const body = requestBody ? JSON.stringify(requestBody) : undefined;
		const startTime = performance.now();

		return fetch(
			apiPath,
			{
				method,
				mode,
				headers,
				...(body && { body })
			}
		).then(async (response) => {
			const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3); // Read the timeElapsed in seconds and round the value to 3 decimal places.
			console.log("sendFetchRequest", `${caller} took ${timeElapsed} seconds and returned with the status code ${response.status}`);

			if (!response.ok) {
				let responseObject;
				try {
					// [W-15136826] Wait for the promise to be fullfilled to read the entire body stream of the error response object.
					responseObject = Object.assign(response, await response.json());
				} catch (e) {
					responseObject = Object.assign(response, {"message": `Error reading the body stream of error object: ${response}`});
				}
				throw responseObject;
			}
			return response;
		});
	};

    // =========================
    //  Initialization
    // =========================
	function AgentforceMessaging() {
		this.settings = {
			devMode: false,
			targetElement: document.body
		};
	}

	/**
	 * Load the bootstrap.css file for this static file.
	 */
	function loadCSS() {
		return new Promise((resolve, reject) => {
			let baseURL = getSiteURL();
			let link = document.createElement("link");

			link.id = "css";
			link.class = "css";
			link.href = baseURL + "/assets/styles/init.css" 
			// + (agentforce_messaging.settings.devMode ? "" : ".min") + ".css";
			link.type = "text/css";
			link.rel = "stylesheet";

			link.onerror = reject;
			link.onload = resolve;

			document.getElementsByTagName("head")[0].appendChild(link);
		});
	}
			
	function createTopContainer() {
		const topContainerElement = document.createElement("div");

		// TODO check if top container already there

		topContainerElement.id =  TOP_CONTAINER_NAME;
		topContainerElement.className = TOP_CONTAINER_NAME;
		
		return topContainerElement;
	};

	AgentforceMessaging.prototype.createIframe = function createIframe() {
		return new Promise((resolve, reject) => {
			try {
				const markupFragment = document.createDocumentFragment();
				const topContainer = createTopContainer();
				const iframe = document.createElement("iframe");

				iframe.title = LWR_IFRAME_NAME;
				iframe.className = LWR_IFRAME_NAME;
				iframe.id = LWR_IFRAME_NAME;

				// TESTING
				iframe.className += " contracted";
				iframe.className += " entry";

				iframe.style.backgroundColor = "transparent";
				iframe.allowTransparency = "true";

				let siteURL = getSiteURL();
				// Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
				if(!siteURL.endsWith("/")) siteURL += "/";
		
				iframe.src = siteURL + "?lwc.mode=" + (agentforce_messaging.settings.devMode ? "dev" : "prod");
				iframe.allow="microphone";
				iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox";

				iframe.onload = resolve;
				iframe.onerror = reject;

				topContainer.appendChild(iframe);
				markupFragment.appendChild(topContainer)

				// Render static conversation button.
				agentforce_messaging.settings.targetElement.appendChild(markupFragment);
			} catch(e) {
				reject(e);
			}
		});
	};

	AgentforceMessaging.prototype.init = function init(orgId, eswConfigDevName, siteURL, snippetConfig) {
		try {
			agentforce_messaging.settings.orgId = orgId;
			agentforce_messaging.settings.eswConfigDevName = eswConfigDevName;
			agentforce_messaging.settings.siteURL = siteURL;
			agentforce_messaging.settings.snippetConfig = snippetConfig; // TODO scrt2URL - api

			// Load CSS file.
			loadCSS().then(() => {
				console.log(`Loaded CSS`);
			}).catch(() => {
				console.error(`Error loading CSS`);
			});

			// Load LWR site on page load.
			agentforce_messaging.createIframe().then(() => {
				console.log(`Created Agentforce Messaging frame`);

				window.addEventListener("message", handleMessageEvent);

				initializeConversationState(conversationId);
			}).catch((e) => {
				console.error(`Error creating Agentforce Messaging frame: ${e}`);
			});
		} catch(initError) {
			console.error(initError);
		}
	};

	if (!window.agentforce_messaging) {
		window.agentforce_messaging = new AgentforceMessaging();
	} else {
		console.error(`Agentforce Messaging has already been initialized`);
	}
})();
