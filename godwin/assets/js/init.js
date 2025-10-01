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

    /**
     * Attributes required to construct SCRT 2.0 Service URL.
     */
    const IN_APP_SCRT2_API_PREFIX = "embeddedservice";
    const IN_APP_SCRT2_API_VERSION = "v1";

    /**
     * Default label for the chat button.
     * @type {string}
     */
    const DEFAULT_CHAT_BUTTON_LABEL = "Chat";

    let rpcManager;

    // Conversation Status
    const CONVERSATION_STATUS = {
        NOT_STARTED: "NOT_STARTED",
        OPEN: "OPEN",
        CLOSED: "CLOSED",
    };

    // Track conversation status
    let conversationStatus = CONVERSATION_STATUS.NOT_STARTED

    /**
     * 
     */
    let hasEmbeddedMessagingReadyEventFired = false;

    /**
	 * This is a resolver function for when the iframe is ready for data.
     */
  let resolveLwrIframeReady;
  let lwrIframeReadyPromise = new Promise((resolve) => {
    resolveLwrIframeReady = resolve;
  });

    /**
     * The label for the chat button.
     * @type {string}
     */
    let chatButtonLabel = DEFAULT_CHAT_BUTTON_LABEL;

    // =========================
    //  Utils
    // =========================
    /**
     * Generate a UUID.
     * Taken from CSI team:
     * https://codesearch.data.sfdc.net/source/xref/app_main_core/app/main/core/ui-conversation-agent-components/modules/scrt/utils/utils.js#60
     */
    function generateUUID() {
        const hexDigits = "0123456789abcdef";
        const valueArray = new Uint32Array(32);
        crypto.getRandomValues(valueArray);

        let res = "";
        for (let i = 0; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                res += "-";
            }
            if (i === 12) {
                res += "4"; // UUID version
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
        const header = [
            navigator.platform,
            navigator.userAgent,
            navigator.appVersion,
            navigator.vendor,
            window.opera
        ];
        const dataos = [
            { name: "Windows Phone", value: "Windows Phone", version: "OS" },
            { name: "Windows", value: "Win", version: "NT" },
            { name: "iPhone", value: "iPhone", version: "OS" },
            { name: "iPad", value: "iPad", version: "OS" },
            { name: "Kindle", value: "Silk", version: "Silk" },
            { name: "Android", value: "Android", version: "Android" },
            { name: "PlayBook", value: "PlayBook", version: "OS" },
            { name: "BlackBerry", value: "BlackBerry", version: "/" },
            { name: "Macintosh", value: "Mac", version: "OS X" },
            { name: "Linux", value: "Linux", version: "rv" },
            { name: "Palm", value: "Palm", version: "PalmOS" }
        ];
        const databrowser = [
            { name: "Edge", value: "Edg", version: "Edg" },
            { name: "Chrome", value: "Chrome", version: "Chrome" },
            { name: "Firefox", value: "Firefox", version: "Firefox" },
            { name: "Safari", value: "Safari", version: "Version" },
            { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
            { name: "Opera", value: "Opera", version: "Opera" },
            { name: "BlackBerry", value: "CLDC", version: "CLDC" },
            { name: "Mozilla", value: "Mozilla", version: "Mozilla" }
        ];

        const agent = header.join(" ");
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
            regex = new RegExp(data[i].value, "i");
            match = regex.test(string);
            if (match) {
                regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
                matches = string.match(regexv);
                version = "";
                if (matches) {
                    if (matches[1]) {
                        matches = matches[1];
                    }
                }
                if (matches) {
                    matches = matches.split(/[._]+/);
                    for (j = 0; j < matches.length; j += 1) {
                        if (j === 0) {
                            version += matches[j] + ".";
                        } else {
                            version += matches[j];
                        }
                    }
                } else {
                    version = "0";
                }
                return {
                    name: data[i].name,
                    version: parseFloat(version)
                };
            }
        }
        return { name: "unknown", version: 0 };
    }

    /**
     * Check if web client is being used in a Mobile Publisher context.
     * Detect Mobile Publisher (https://sourcegraph.soma.salesforce.com/perforce.soma.salesforce.com/app/main/core@HEAD/-/blob/sites/java/src/sites/communities/hybridapp/util/CoreCommunityHybridAppUtilImpl.java?L25).
     * Update this check in W-12462964.
     *
     * @returns {boolean} - return 'true' if we are in a Mobile Publisher context and 'false' otherwise.
     */
    function isMobilePublisherApp() {
        return (
            navigator.userAgent.includes("CommunityHybridContainer") ||
            navigator.userAgent.includes("playgroundcommunity")
        );
    }

    // =========================
    //  Minimization / Maximization
    // =========================
    function handleMinimize() {
        const frame = getIframe();

        if (frame) {
            // Update width and height if options are provided
            if (postMessage.width || postMessage.height) {
                if (postMessage.width) {
                    frame.style.width = postMessage.width;
                }
                if (postMessage.height) {
                    frame.style.height = postMessage.height;
                }
            }

            frame.classList.add("minimized");
            frame.classList.remove("maximized");
        }
    }

    function handleMaximize() {
        const frame = getIframe();

        if (frame) {
            // Update width and height if options are provided
            if (postMessage.width || postMessage.height) {
                if (postMessage.width) {
                    frame.style.width = postMessage.width;
                }
                if (postMessage.height) {
                    frame.style.height = postMessage.height;
                }
            }

            frame.classList.add("maximized");
            frame.classList.remove("minimized");
        }
    }

    // =========================
    //  DOM Selectors
    // =========================
    function getTopContainer() {
        return document.getElementById(TOP_CONTAINER_NAME);
    }

    function getIframe() {
        return document.getElementById(LWR_IFRAME_NAME);
    }

    function getSiteURL() {
        try {
            return agentforce_messaging.settings.siteURL;
        } catch (err) {
            console.error(`Error retrieving site URL: ${err}`);
        }
    }

    function getButtonLabel(configData) {
        const customLabels = configData?.embeddedServiceConfig?.customLabels || [];
        const standardLabels = configData?.standardLabels || [];

        const customLabel = customLabels.find(label =>
            label.sectionName === "EmbeddedMessagingMinimizedState" &&
            label.labelName === "CwcMinimizedState"
        );

        if (customLabel) {
            return customLabel.labelValue;
        }

        const standardLabel = standardLabels.find(label =>
            label.sectionName === "EmbeddedMessagingMinimizedState" &&
            label.labelName === "CwcMinimizedState"
        );

        return standardLabel?.labelValue || "Chat";
    }

    /**
	 * Clear all in-memory data tracked on the client side, for the current conversation.
	 */
	function clearInMemoryData() {
		// Reset LWR iframe ready promise.
		lwrIframeReadyPromise = new Promise((resolve) => {
			resolveLwrIframeReady = resolve;
		});
    }

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
     * Agentforce Messaging Utility class for client API.
     */
    function AgentforceMessagingUtil() {}

    /**
     * Centralized function to validate if API calls can be processed.
     * Checks if the onEmbeddedMessagingReady event has been fired.
     * @param {string} apiName - The name of the API being called (for error logging)
     * @throws {Error} - Throws an Error if validation fails
     */
    function shouldProcessApiCall() {
        if (!hasEmbeddedMessagingReadyEventFired) {
            throw new Error("API not available before onEmbeddedMessagingReady is fired.");
        }
    }

    /**
     * Client API method to send a text message programatically 
     */
    AgentforceMessagingUtil.prototype.sendTextMessage = function (message) {
        try {
            shouldProcessApiCall();
            
            if (typeof message !== 'string') {
                throw new Error("Message must be a string");
            }
            if (message.trim() === "") {
                throw new Error("Message must be non empty");
            }

            return callRpcClient("sendTextMessage", { message })
                .then(() => Promise.resolve())
                .catch((error) => {
                    throw error;
                });
        } catch (error) {
            console.error("Failed to send message:", error);
            return Promise.reject(error);
        }
    };

    /**
     * Validate the session context object.
     * @param {object} context 
     * @throws {Error} - Throws an Error if validation fails
     */
    function validateSessionContext(context) {
        // Check if context exists and is an array
        if (!context || !Array.isArray(context)) {
            throw new Error("Context must be an array");
        }

        // Check if array is not empty
        if (context.length === 0) {
            throw new Error("Context array cannot be empty");
        }

        // Validate each context item
        for (let i = 0; i < context.length; i++) {
            const item = context[i];
            
            // Check if item has required properties
            if (!item || typeof item !== 'object') {
                throw new Error(`Context item at index ${i} must be an object`);
            }

            // Validate 'name' property
            if (!item.name || typeof item.name !== 'string') {
                throw new Error(`Context item at index ${i} must have a valid 'name' property`);
            }

            // Validate 'value' property exists
            if (!item.value || typeof item.value !== 'object') {
                throw new Error(`Context item at index ${i} must have a valid 'value' property`);
            }

            // Validate 'valueType' property
            if (!item.value.valueType || typeof item.value.valueType !== 'string' || item.value.valueType !== "StructuredValue") {
                throw new Error(`Context item at index ${i} must have a valid 'valueType' property`);
            }

            // Validate 'value.value' property
            if (!item.value.value || typeof item.value.value !== 'object') {
                throw new Error(`Context item at index ${i} must have a valid 'value.value' property`);
            }
        }
    }

    /**
     * Client API method to set agent context programatically.
     *
     * Expected shape - "AgentContext" & "StructuredValue" are hardcoded values
     * [{
            "name": "AgentContext",
            "value": {
                "valueType": "StructuredValue",
                "value": {
                "navigation": {
                    "prevPage": "",
                    "destinationPage": "",
                    "tabId": ""
                },
                "search": {
                    "term": "",
                    
                },
                "timezone": {
                    "type": ""
                },
                "searchResultFilters": {
                    "values": [
                    "A",
                    "B"
                    ]
                }
                }
            }
        }]
     */
    AgentforceMessagingUtil.prototype.setSessionContext = function (context) {
        try {
            shouldProcessApiCall();
            validateSessionContext(context);

            return callRpcClient("setSessionContext", context)
                .then(() => Promise.resolve())
                .catch((error) => {
                    console.error("Failed to set session context:", error.message);
                    Promise.reject(error);
                });
        } catch (error) {
            console.error("Failed to set session context:", error.message);
            return Promise.reject(error);
        }
    };

    /**
     * EXTERNAL API - DO NOT CHANGE SHAPE
     * A publicly exposed api for the host (i.e. customer) to invoke and set/update Hidden Prechat fields.
     * Sets a new Hidden Prechat field or updates an existing field with the passed in value.
     *
     * @param {object} hiddenFields - an object (in the form of a Map) of key-value pairs (e.g. { HiddenPrechatFieldName1 : HiddenPrechatFieldValue1, HiddenPrechatFieldName2 : HiddenPrechatFieldValue2 }) of Hidden Prechat fields as set by the host.
     */
    AgentforceMessagingUtil.prototype.setHiddenPrechatFields = function (hiddenFields) {
        try {
            shouldProcessApiCall();
            
            // TODO: Validate hidden fields

            if (hiddenFields && typeof hiddenFields === "object") {
                return callRpcClient("setHiddenPrechatFields", { hiddenFields })
                    .then(() => Promise.resolve())
                    .catch((error) => {
                        throw error;
                    });
            }
            throw new Error("Hidden fields must be key-value pairs.");
        } catch (error) {
            console.error("Failed to set hidden prechat fields:", error);
            return Promise.reject(error);
        }
    };

    /**
     * EXTERNAL API - DO NOT CHANGE SHAPE
     * A publicly exposed api for the host (i.e. customer) to invoke and remove Hidden Prechat fields.
     * Removes an existing Hidden Prechat field with the passed in key name.
     *
     * @param {object} hiddenFields - an object (in the form of an Array) of Hidden Prechat field names (e.g. [ HiddenPrechatFieldName1, HiddenPrechatFieldName2 ]) to be removed/deleted.
     */
    AgentforceMessagingUtil.prototype.removeHiddenPrechatFields = function (hiddenFields) {
        try {
            shouldProcessApiCall();

            // TODO: Validate hidden fields

            if (hiddenFields && Array.isArray(hiddenFields)) {
                return callRpcClient("removeHiddenPrechatFields", { hiddenFields })
                    .then(() => Promise.resolve())
                    .catch((error) => {
                        throw error;
                    });
            }
            throw new Error("removeHiddenPrechatFields must be called with array of strings.");
        } catch (error) {
            console.error("Failed to remove hidden prechat fields:", error);
            return Promise.reject(error);
        }
    };


    /**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to launch the chat programatically.
	 *
	 */
    AgentforceMessagingUtil.prototype.launchChat = function () {
        try {
            shouldProcessApiCall();

            const iframe = getIframe();
            if (iframe && iframe.classList.contains("minimized")) {
                // Unhide iframe in case hideChatButton was previously called.
                toggleChatFabVisibility(false);
                return callRpcClient("launchChat")
                    .then(() => Promise.resolve())
                    .catch((error) => {
                        throw error;
                    });
            }
            return Promise.resolve();
        } catch (error) {
            console.error("Failed to launch chat:", error);
            return Promise.reject(error);
        }
    }

    /**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to minimize the chat programatically.
	 *
	 */
    AgentforceMessagingUtil.prototype.minimizeChat = function () {
        try {
            shouldProcessApiCall();

            const iframe = getIframe();
            if (iframe && iframe.classList.contains("maximized")) {
                return callRpcClient("minimizeChat")
                    .then(() => Promise.resolve())
                    .catch((error) => {
                        throw error;
                    });
            }
            return Promise.resolve();
        } catch (error) {
            console.error("Failed to minimize chat:", error);
            return Promise.reject(error);
        }
    }

    /**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to show chat button programatically.
	 *
	 */
    AgentforceMessagingUtil.prototype.showChatButton = function () {
        return toggleChatFabVisibility(false);
    }

    /**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to hide chat button programatically.
	 *
	 */
    AgentforceMessagingUtil.prototype.hideChatButton = function () {
        return toggleChatFabVisibility(true);
    }

    /**
     * Helper function for show/hideChatButton.
     * @param {boolean} isHidden 
     */
    function toggleChatFabVisibility(isHidden) {
        try {
            shouldProcessApiCall();
            if (conversationStatus === CONVERSATION_STATUS.NOT_STARTED) {
                toggleIframeVisibility(isHidden);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to ${isHidden ? "hide" : "show"} chat button:`, error);
            return false
        }
    }

    /**
     * Toggle iframe between display none to visible.
     * @param {boolean} isHidden 
     */
    function toggleIframeVisibility(isHidden) {
        const iframe = getIframe();
        if (iframe) {
            iframe.style.display = (isHidden ? "none" : "");
        }
    }

    /**
     * Calculate dynamic width based on label text length.
     * @returns {string} Width in rem (e.g., "7.5rem").
     */
    function calculateChatButtonWidth() {
        // const MIN_WIDTH = 3.875;
        // const MAX_WIDTH = 15.625;
		const SPACING = 12;
		const HORIZONTAL_PADDING = 24;
		const ICON_WIDTH = 24;
        // const CHAR_WIDTH = 0.72;
        const labelText = chatButtonLabel;
        // if (!labelText || labelText.length === 0) {
        //     return `${MIN_WIDTH}rem`;
        // }
        // const calculatedWidth = (labelText.length * CHAR_WIDTH);
        // const width = Math.min(Math.max(calculatedWidth, MIN_WIDTH), MAX_WIDTH) + PADDING * 2;
        // return `${width}rem`;
		return getTextWidth(labelText, '700 16px "ITC Avant Garde"') + SPACING + ICON_WIDTH + HORIZONTAL_PADDING * 2; 
    }

	function getTextWidth(text, font) {
	  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	  const context = canvas.getContext("2d");
	  context.font = font;
	  const metrics = context.measureText(text);
	  return metrics.width;
	}

    function callRpcClient(eventName, eventData = {}) {
        if (!rpcManager) {
            console.error("RPC not available");
            return Promise.resolve(false);
        }

        return rpcManager
            .waitForConnection()
            .then(() =>
                rpcManager.callRemote(eventName, eventData)
            )
            .then((response) => {
                console.debug("Event sent to iframe");
                return response;
            })
            .catch((error) => {
                console.error("Failed to send event:", error);
                return false;
            });
    };

    /**
     * Load the bootstrap.css file for this static file.
     */
    function loadCSS() {
        return new Promise((resolve, reject) => {
            let baseURL = getSiteURL();
            let link = document.createElement("link");

            link.id = "css";
            link.class = "css";
            link.href = baseURL + "/assets/styles/init" + (agentforce_messaging.settings.devMode ? "" : ".min") + ".css";
            link.type = "text/css";
            link.rel = "stylesheet";

            link.onerror = reject;
            link.onload = resolve;

            document.getElementsByTagName("head")[0].appendChild(link);
        });
    }

    /**
     * Cleanup RPC resources
     */
    function cleanupRPC() {
        if (rpcManager) {
            rpcManager.stopListening();
            rpcManager = null;
        }
    }

    /**
     * Load the RPC script for the iframe.
     */
    function loadRPCScript() {
        return new Promise((resolve, reject) => {
            if (window.RPCManager && window.RPCManager.RPCManager) {
                resolve(true);
                return;
            }
            const siteUrl = getSiteURL();
            const script = document.createElement("script");
            script.src = new URL("assets/js/rpc-manager.iife.js", siteUrl + "/").href;
            script.onload = () => {
                initializeRPC();
            };
            script.onerror = () => reject(new Error("Failed to load RPC script"));
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize the RPC manager.
     */
    function initializeRPC() {
        try {
            if (
                !window.RPCManager ||
                !window.RPCManager.RPCManager ||
                typeof window.RPCManager.RPCManager !== "function"
            ) {
                console.error("RPCManager constructor not available");
                return;
            }

            rpcManager = new window.RPCManager.RPCManager({
                isHost: true,
                targetOrigin: getSiteURL(),
                targetFrameId: LWR_IFRAME_NAME
            });

            // Register handlers for client requests
            rpcManager.registerHandler("connect", () => {
                return { allowed: true };
            });

            // Register event handlers
            registerRpcHandlers();

            // Listen for client connection
            rpcManager.onConnectionChange((connected) => {
                console.debug(
                `RPC connection status: ${connected ? "Connected" : "Disconnected"}`
                );
            });
            rpcManager.startListening();
            console.debug("RPC host initialized successfully");
            // Cleanup on page unload
            window.addEventListener("beforeunload", cleanupRPC);
        } catch (error) {
            console.error("RPC initialization failed:", error);
        }
    }

    function registerRpcHandlers() {
        // Iframe app ready event handler
        rpcManager.registerHandler("ESW_APP_READY_EVENT", () => {
            unhideIframe();
            const configuration = prepareConfigObject();
            return { configuration };
        });

        // Iframe maximize/minimize event handler
        rpcManager.registerHandler("ESW_APP_MAXIMIZE", handleMaximize);
        rpcManager.registerHandler("ESW_APP_MINIMIZE", handleMinimize);

        rpcManager.registerHandler("cwcAppInitialized", () => {
            emitEmbeddedMessagingReadyEvent();
        });

        rpcManager.registerHandler("cwcsetconversationstatus", (event) => {
            conversationStatus = event?.data?.conversationStatus || CONVERSATION_STATUS.NOT_STARTED;
        });
    }

    function emitEmbeddedMessagingReadyEvent() {
        hasEmbeddedMessagingReadyEventFired = true;
		try {
			window.dispatchEvent(new CustomEvent("onEmbeddedMessagingReady", { detail: {} }));
		} catch(err) {
			hasEmbeddedMessagingReadyEventFired = false;
			console.error(`emitEmbeddedMessagingReadyEvent: Something went wrong in firing onEmbeddedMessagingReady event ${err}.`);
		}
    }

    function prepareConfigObject() {
        // Remove targetElement since HTMLElement cannot be cloned.
        const { targetElement, ...configuration } = agentforce_messaging.settings;
        try {
            const hostLocation = new URL(window.location.href);
            // Pass hostUrl to iframe
            configuration.metrics.hostUrl = hostLocation.origin + hostLocation.pathname;
        } catch (err) {
            console.error(`prepareConfigObject: Something went wrong in getting the hostUrl.`);
        }
        return configuration
    }

    function createTopContainer() {
        const topContainerElement = document.createElement("div");

        if (getTopContainer()) return getTopContainer();

        topContainerElement.id = TOP_CONTAINER_NAME;
        topContainerElement.className = TOP_CONTAINER_NAME;

        return topContainerElement;
    }

    function unhideIframe() {
        const iframe = getIframe();
        let buttonWidth = calculateChatButtonWidth();
        if (iframe) {
            iframe.style.width = buttonWidth;
            iframe.classList.add("minimized");
        }
    }

    /**
    * Load the configuration settings from SCRT 2.0.   
    * Congiguration object shape:
    * {
    *      "embeddedServiceConfig": {
    *          "customLabels": {},
    *          "standardLabels": {}
    *      }
    *  } 
    * @returns {Promise}
    */
    function loadConfigurationSettings() {
        return new Promise((resolve, reject) => {
            console.debug(`Loading configuration settings`);
            const configurationUrl = `${agentforce_messaging.settings.scrt2URL}/${IN_APP_SCRT2_API_PREFIX}/${IN_APP_SCRT2_API_VERSION}/embedded-service-config?orgId=${agentforce_messaging.settings.orgId}&esConfigName=${agentforce_messaging.settings.eswConfigDevName}&language=${agentforce_messaging.settings.language}`;
            fetch(configurationUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    console.debug(`Configuration settings loaded:`, data);
                    resolve(data);
                })
                .catch(error => {
                    console.error(`Error loading configuration settings: ${error}`);
                    reject(error);
                });
        });
    }

    /**
     * Merge a key-value mapping into the setting object, such that the provided
     * values take priority. This allows the settings in the snippet to override
     * what we get from SCRT
     *
     * @param {object} additionalSettings - A key-value mapping.
     */
    function mergeObjects(targetObj, sourceObj) {
        Object.keys(sourceObj).forEach((key) => {
            if (Array.isArray(sourceObj[key])) {
                // Handle array merging
                if (Array.isArray(targetObj[key])) {
                    // If both are arrays, append items in source array to target array
                    targetObj[key].push(...sourceObj[key]);
                } else if (targetObj[key] === undefined) {
                    // If array exists in source but not target, just use it
                    targetObj[key] = sourceObj[key];
                }
            } else if (typeof(targetObj[key]) === "object" && typeof(sourceObj[key]) === "object" && targetObj[key] !== null && sourceObj[key] !== null) {
                // Handle object merging (existing logic with null checks)
                mergeObjects(targetObj[key], sourceObj[key]);
            } else if (targetObj[key] === undefined) {
                // Handle primitive values (existing logic)
                targetObj[key] = sourceObj[key];
            }
        });
    }
    AgentforceMessaging.prototype.createIframe = function createIframe() {
        return new Promise((resolve, reject) => {
            try {
                const markupFragment = document.createDocumentFragment();
                const topContainer = createTopContainer();
                const iframe = document.createElement("iframe");

                iframe.title = LWR_IFRAME_NAME;
                iframe.className = LWR_IFRAME_NAME;
                iframe.id = LWR_IFRAME_NAME;

                iframe.style.backgroundColor = "transparent";
                iframe.allowTransparency = "true";

                let siteURL = getSiteURL();
                // Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
                if (!siteURL.endsWith("/")) siteURL += "/";

                iframe.src =
                    siteURL +
                    "?lwc.mode=" +
                    (agentforce_messaging.settings.devMode ? "dev" : "prod");
                // Allow microphone access for voice conversations.
                iframe.allow = "microphone";
                iframe.sandbox =
                    "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox";

                iframe.onload = resolve;
                iframe.onerror = reject;

                topContainer.appendChild(iframe);
                markupFragment.appendChild(topContainer);

                // Render static conversation button.
                agentforce_messaging.settings.targetElement.appendChild(
                    markupFragment
                );
            } catch (e) {
                reject(e);
            }
        });
    };

    AgentforceMessaging.prototype.init = function init(
        orgId,
        eswConfigDevName,
        siteURL,
        snippetConfig
    ) {
        try {
            // Record the time when CWC init was invoked for evaluating perf metrics.
            agentforce_messaging.settings.metrics = {
                cwcInitTime: Date.now()
            }
            agentforce_messaging.settings.orgId = orgId;
            agentforce_messaging.settings.eswConfigDevName = eswConfigDevName;
            agentforce_messaging.settings.siteURL = siteURL;
            agentforce_messaging.settings.snippetConfig = snippetConfig;
            mergeObjects(agentforce_messaging.settings, snippetConfig);

            // Load CSS file.
            loadCSS()
                .then(() => {
                    console.log(`Loaded CSS`);
                })
                .catch(() => {
                    console.error(`Error loading CSS`);
                });

            // Load the RPC script for iframe & host communication
            loadRPCScript()
                .then(() => {
                    console.debug(`Loaded RPC script`);
                })
                .catch(() => {
                    console.error(`Error loading RPC script`);
                });

            // Load configuration settings from SCRT 2.0.
            loadConfigurationSettings()
                .then((data) => {
                    console.debug(`Loaded configuration settings`);
                    chatButtonLabel = getButtonLabel(data);
                    mergeObjects(agentforce_messaging.settings, data);
                })
                .catch(() => {
                    console.error(`Error loading configuration settings`);
                });

            // Load LWR site on page load.
            agentforce_messaging
                .createIframe()
                .then(() => {
                    console.log(`Created Agentforce Messaging frame`);
                })
                .catch((e) => {
                    console.error(
                        `Error creating Agentforce Messaging frame: ${e}`
                    );
                });
        } catch (initError) {
            console.error(initError);
        }
    };

    // Function to create a proxy that forwards to a target object
    function createProxy(targetObject, objectName, functionMap = {}) {
        return new Proxy({}, {
            get: function(proxyTarget, prop) {
                // Check if there's a mapped function name
                if (prop in functionMap) {
                    return targetObject[functionMap[prop]];
                }
                if (prop in targetObject) {
                    return targetObject[prop];
                }
                console.error(`Property '${String(prop)}' is not implemented on ${objectName}`);
                return undefined;
            },
            set: function(proxyTarget, prop, value) {
                if (prop in targetObject) {
                    targetObject[prop] = value;
                    return true;
                }
                console.error(`Property '${String(prop)}' is not implemented on ${objectName}`);
                return false;
            }
        });
    }

    if (!window.agentforce_messaging) {
        window.agentforce_messaging = new AgentforceMessaging();
        window.agentforce_messaging.util = new AgentforceMessagingUtil();
        
        // Create proxies for embeddedservice_bootstrap and its utilApi
        window.embeddedservice_bootstrap = createProxy(window.agentforce_messaging, 'agentforce_messaging');
        window.agentforce_messaging.utilApi = createProxy(
            window.agentforce_messaging.util, 
            'agentforce_messaging.util'
        );
    } else {
        console.error(`Agentforce Messaging has already been initialized`);
    }
})();
