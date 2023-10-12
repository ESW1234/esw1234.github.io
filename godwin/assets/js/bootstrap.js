/*
 * Copyright 2020 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */
/**
 * Where possible, we changed noninclusive terms to align with our company value of Equality. We maintained certain terms to avoid any effect on customer implementations.
 */
(() => {
	/**
	 * Conversation button class constants.
	 */
	const CONVERSATION_BUTTON_CLASS = "embeddedMessagingConversationButton";
	const CONVERSATION_BUTTON_WRAPPER_CLASS = CONVERSATION_BUTTON_CLASS + "Wrapper";
	const CONVERSATION_BUTTON_LOADED_CLASS = CONVERSATION_BUTTON_CLASS + "Loaded";
	const CONVERSATION_BUTTON_LOADING_CLASS = CONVERSATION_BUTTON_CLASS + "Loading";
	const CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS = "embeddedMessagingBottomTabBar";
	const CONVERSATION_BUTTON_DEFAULT_ASSISTIVE_TEXT = "Hello, have a question? Let’s chat.";
	const CONVERSATION_BUTTON_MINIMIZE_ASSISTIVE_TEXT = "Minimize the chat window";
	const CHAT_WINDOW_ASSISTIVE_TEXT = "Chat Window";

	/**
	 * Conversation modal state class constants.
	 */
	const MODAL_ISMAXIMIZED_CLASS = "isMaximized";
	const MODAL_ISMINIMIZED_CLASS = "isMinimized";
	const MODAL_HASMINIMIZEDNOTIFICATION_CLASS = "hasMinimizedNotification";

	/**
	 * Iframe platform class constants.
	 */
	const EXPERIENCE_SITE = "experienceSite";
	const MOBILE_PUBLISHER = "mobilePublisher";

	/**
	 * Parent page elements class constants.
	 */
	const TOP_CONTAINER_NAME = "embedded-messaging";
	const BACKGROUND_MODAL_ID = "embeddedMessagingModalOverlay";
	const PREVENT_SCROLLING_CLASS = "embeddedMessagingPreventScrolling";
	const LWR_IFRAME_NAME = "embeddedMessagingFrame";
	const BOOTSTRAP_CSS_NAME = "embeddedMessagingBootstrapStyles";
	const IFRAME_DEFAULT_TITLE = "Chat with an Agent";
	const IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS = LWR_IFRAME_NAME + "MaximizedBottomTabBar";
	const IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS = LWR_IFRAME_NAME + "MinimizedBottomTabBar";
	const FILE_PREVIEW_IFRAME_NAME = "embeddedMessagingFilePreviewFrame";
	const FILE_PREVIEW_IFRAME_DEFAULT_TITLE = "Enlarged image preview";
	const SITE_CONTEXT_IFRAME_NAME = "embeddedMessagingSiteContextFrame";
	const SLDS_ASSISTIVE_TEXT = "slds-assistive-text";
	const MINIMIZED_NOTIFICATION_AREA_CLASS = "embeddedMessagingMinimizedNotification";
	const MINIMIZED_NOTIFICATION_AREA_TEXT_WRAPPER_CLASS = MINIMIZED_NOTIFICATION_AREA_CLASS + "TextWrapper";
	const MINIMIZED_NOTIFICATION_AREA_TEXT_CLASS = MINIMIZED_NOTIFICATION_AREA_CLASS + "Text";
	const MINIMIZED_NOTIFICATION_AREA_DEFAULT_TEXT = "Something went wrong. Log in again to continue your messaging conversation.";
	const MINIMIZED_NOTIFICATION_AREA_DEFAULT_ASSISTIVE_TEXT = "Expand the text.";
	const MINIMIZED_NOTIFICATION_DISMISS_BTN_CLASS = MINIMIZED_NOTIFICATION_AREA_CLASS + "DismissButton";
	const MINIMIZED_NOTIFICATION_DISMISS_BTN_ID = "dismissButton-help";
	const MINIMIZED_NOTIFICATION_DISMISS_BTN_TEXT_CLASS = MINIMIZED_NOTIFICATION_DISMISS_BTN_CLASS + "Text";
	const MINIMIZED_NOTIFICATION_DISMISS_BTN_DEFAULT_TEXT = "Dismiss";
	const MINIMIZED_NOTIFICATION_DISMISS_BTN_DEFAULT_ASSISTIVE_TEXT = "Close the chat notification";

	/**
	 * Icon constants.
	 */
	const DEFAULT_ICONS = {};
	const EMBEDDED_MESSAGING_ICON = "embeddedMessagingIcon";
	const EMBEDDED_MESSAGING_ICON_CHAT = EMBEDDED_MESSAGING_ICON + "Chat";
	const EMBEDDED_MESSAGING_ICON_CONTAINER = EMBEDDED_MESSAGING_ICON + "Container";
	const EMBEDDED_MESSAGING_ICON_LOADING = EMBEDDED_MESSAGING_ICON + "Loading";
	const EMBEDDED_MESSAGING_ICON_MINIMIZE = EMBEDDED_MESSAGING_ICON + "Minimize";
	const EMBEDDED_MESSAGING_ICON_REFRESH = EMBEDDED_MESSAGING_ICON + "Refresh";

	/**
	 * Loading constants.
	 */
	const EMBEDDED_MESSAGING_LOADING = "embeddedMessagingLoading";
	const EMBEDDED_MESSAGING_LOADING_SPINNER = EMBEDDED_MESSAGING_LOADING + "Spinner";
	const EMBEDDED_MESSAGING_LOADING_CIRCLE = EMBEDDED_MESSAGING_LOADING + "Circle";

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

	/**
	  * Capabilities version to be passed as part of Access Token request to register capabilities of the app.
	  * Notes:
	  * 1. The version number is merely a representation and a contract with the IA-Message service and does not necessarily represent the core version. Bump this number when new capabilities are introduced to be supported.
	  * 2. Ensure the version number passed in Access Token request to match the version passed in RegisterDeviceCapabilities endpoint request.
	  * @type {string}
 	  */
	 const capabilitiesVersion = "246";

	// TODO: W-13475085 - confirm event names with CX.
	const APP_LOADED_EVENT_NAME = "ESW_APP_LOADED";
	const APP_INIT_ERROR_EVENT_NAME = "ESW_APP_INITIALIZATION_ERROR";
	const APP_MINIMIZE_EVENT_NAME = "ESW_APP_MINIMIZE";
	const APP_MAXIMIZE_EVENT_NAME = "ESW_APP_MAXIMIZE";
	const EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME = "ESW_SET_JWT_EVENT";
	const EMBEDDED_MESSAGING_CLEAN_UP_JWT_EVENT_NAME = "ESW_CLEAN_UP_JWT_EVENT";
	const EMBEDDED_MESSAGING_APP_READY_EVENT_NAME = "ESW_APP_READY_EVENT";
	const EMBEDDED_MESSAGING_SET_CONFIG_EVENT_NAME = "ESW_SET_CONFIG_EVENT";
	const APP_RESET_INITIAL_STATE_EVENT_NAME = "ESW_APP_RESET_INITIAL_STATE";
	const EMBEDDED_MESSAGING_DOWNLOAD_FILE = "ESW_DOWNLOAD_FILE";
	const EMBEDDED_MESSAGING_UPDATE_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME = "ESW_SET_WEBSTORAGE_FAILEDMESSAGES_EVENT";
	const EMBEDDED_MESSAGING_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME = "ESW_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT";
	const EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME = "ESW_APP_MAXIMIZATION_RESIZING_COMPLETED";
	const EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME = "ESW_APP_MINIMIZATION_RESIZING_COMPLETED";
	const EMBEDDED_MESSAGING_UPDATE_TITLE_NOTIFICATION = "ESW_APP_UPDATE_TITLE_NOTIFICATION";
	const EMBEDDED_MESSAGING_3P_STORAGE_READY_EVENT_NAME = "ESW_3RDPARTY_STORAGE_READY";
	const EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT_NAME = "ESW_APP_SHOW_FILE_PREVIEW_FRAME";
	const EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT_NAME = "ESW_APP_HIDE_FILE_PREVIEW_FRAME";
	const APP_REQUEST_HIDDEN_PRECHAT_FIELDS_EVENT_NAME = "ESW_APP_SEND_HIDDEN_PRECHAT_FIELDS";
	const APP_RECEIVE_HIDDEN_PRECHAT_FIELDS_EVENT_NAME = "ESW_APP_RECEIVE_HIDDEN_PRECHAT_FIELDS";
	const APP_REQUEST_AUTORESPONSE_PARAMETERS_EVENT_NAME = "ESW_APP_SEND_AUTORESPONSE_PARAMETERS";
	const APP_RECEIVE_AUTORESPONSE_PARAMETERS_EVENT_NAME = "ESW_APP_RECEIVE_AUTORESPONSE_PARAMETERS";
	const EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE = "EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE";
	const EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME = "EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT";
	const EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME = "EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT";
	const EMBEDDED_MESSAGING_FOCUS_ON_LAST_FOCUSABLE_ELEMENT_EVENT_NAME = "trapfocustolast";
	const EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT_NAME = "EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT";
	const EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME = "EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT";
	const EMBEDDED_MESSAGING_JWT_RETRIEVAL_FAILURE_EVENT_NAME = "EMBEDDED_MESSAGING_JWT_RETRIEVAL_FAILURE_EVENT";
    const EMBEDDED_MESSAGING_3P_STORAGE_RESPONSE_EVENT_NAME = "ESW_3RDPARTY_STORAGE_RESPONSE";
	const EMBEDDED_MESSAGING_3P_STORAGE_REQUEST_EVENT_NAME = "ESW_3RDPARTY_STORAGE_REQUEST";
	const EMBEDDED_MESSAGING_3P_STORAGE_SET_ITEMS_EVENT_NAME = "ESW_3RDPARTY_STORAGE_SET_ITEMS";
	const EMBEDDED_MESSAGING_3P_STORAGE_CLEAR_ITEMS_EVENT_NAME = "ESW_3RDPARTY_STORAGE_CLEAR";
	const EMBEDDED_MESSAGING_3P_STORAGE_SET_OBJECTS_EVENT_NAME = "ESW_3RDPARTY_STORAGE_SET_OBJECTS";
	const APP_PRECHAT_SUBMIT = "ESW_APP_PRECHAT_SUBMIT";
	const APP_SHOW_MINIMIZED_STATE_NOTIFICATION = "ESW_APP_SHOW_MINIMIZED_STATE_NOTIFICATION";
	const EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS = "EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS";

	/**
     * Hex color constants used for the default chat icon fill colors.
     */
    const WHITE_HEX_CODE = "#FFFFFF";
    const BLACK_HEX_CODE = "#1A1B1E";
	const A11Y_CONTRAST_THRESHOLD = 3.0;
    const HEX_BASE = 16;

    /**
     * Static class containing methods for determining whether two colors meet color contrast ratio accessibility
     * guidelines.
     * 
     * See: https://www.w3.org/WAI/WCAG21/Techniques/general/G207
     */
    class ColorContrastAccessibility {
        /**
         * Checks if the contrast ratio between two colors meets a given threshold or an accessibility standard.
         * 
         * @param {string} colorA - The hexadecimal color value of the first color.
         * @param {string} colorB - The hexadecimal color value of the second color.
         * @param {number} [threshold=3.0] - Optional contrast threshold to check against, defaulted to a11y requirement of 3.0.
         * @returns {boolean} Returns true if the contrast ratio is greater than or equal to the threshold, false otherwise.
         *
         * @example
         * // Returns true
         * const color1 = "#000080"; // Navy
         * const color2 = "#FFFFFF"; // White
         * const contrastIsValid = isValidContrastRatio(color1, color2);
         */
        static isValidContrastRatio(colorA, colorB, threshold = A11Y_CONTRAST_THRESHOLD) {
            return this.getContrastRatio(colorA, colorB) >= threshold;
        }

        /**
         * Calculates the contrast ratio between two colors according to the WCAG 2.0 formula.
         *
         * The contrast ratio is a measure of the difference in perceived brightness between two colors, used
         * in accessibility guidelines to determine if the contrast between two colors meets the minimum contrast
         * requirements for accessibility.
         *
         * The contrast ratio is calculated using the relative luminance of the two colors.
         * WCAG 2.0 documentation: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
         *
         * @param {string} colorA - The hexadecimal color value of the first color
         * @param {string} colorB - The hexadecimal color value of the second color.
         * @returns {string} The contrast ratio between the two colors, rounded to two decimal places.
         */
        static getContrastRatio(colorA, colorB) {
            const rgbColorA = this.convertHexToRGB(colorA);
            const rgbColorB = this.convertHexToRGB(colorB);

            const L1 = this.getRelativeLuminance(rgbColorA);
            const L2 = this.getRelativeLuminance(rgbColorB);

            const contrastRatio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            return contrastRatio.toFixed(2);
        }

        /**
         * Calculates the relative luminance of a color in the sRGB colorspace according to the WCAG 2.0 formula.
         * 
         * The relative luminance represents the relative brightness of a color in a colorspace, normalized to 0
         * for darkest black and 1 for lightest white, and is used in accessibility guidelines for determining color
         * contrast ratios.
         * 
         * WCAG 2.0 documentation: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
         * 
         * @param {{ r: number, g: number, b: number }} color - An object representing an sRGB color.
         * @returns {number} The relative luminance of the input color in the range [0, 1].
         */
        static getRelativeLuminance(color) {
            const [R, G, B] = Object.values(color).map(rgbValue => this.getSRGB(rgbValue));
            return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
        }

        /**
         * Calculates the sRGB value of an RGB color component according to the WCAG 2.0 formula.
         *
         * @param {number} color - One of R, G, B color values. 
         * @returns {number} sRGB representation of an RGB color.
         */
        static getSRGB(color) {
            // Normalize the color value to a range between [0, 1].
            color /= 255;
            return color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
        }

        /**
         * Converts a hexadecimal color value to its corresponding RGB representation.
         * @param {string} hex - The hexadecimal color value to convert to RGB.
         * @returns {{ r: number, g: number, b: number }} An object representing the RGB values.
        */
        static convertHexToRGB(hex) {
            // Extract the red, green, and blue components from the hexadecimal value.
            const red = parseInt(hex.slice(1, 3), HEX_BASE);
            const green = parseInt(hex.slice(3, 5), HEX_BASE);
            const blue = parseInt(hex.slice(5, 7), HEX_BASE);
            return { r: red, g: green, b: blue };
        }
    }

    /**
     * Checks if the color contrast between default icon svg color (white) and the button color from the branding configuration
     * meets the accessibility threshold guidelines.
     * @returns {boolean} Returns true if the color contrast meets the accessibility threshold, otherwise false.
     */
    function hasConversationButtonColorContrastMetA11yThreshold() {
        return ColorContrastAccessibility.isValidContrastRatio(WHITE_HEX_CODE, getButtonColorFromBrandingConfig());
    };

    /**
     * Sets the icon fill color to black by setting a new CSS variable (property) if color contrast accessibility guidelines are not met between the default white icon color on FAB and the button color itself.
     * @returns {void}
     */
    function setConversationButtonIconColor() {
        document.documentElement.style.setProperty("--eswIconFillColor", BLACK_HEX_CODE);
    }

	/*********************************************************
	 *		Embedded Messaging Public Events		*
	 **********************************************************/
	/**
	 * Event dispatched after the client successfully completes bootstrap.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_READY_EVENT_NAME = "onEmbeddedMessagingReady";

	/**
	 * Event dispatched after the client is successfully initialized and rendered.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME = "onEmbeddedMessagingInitSuccess";

	/**
	 * Event dispatched after the client failed to be initialized and rendered.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME = "onEmbeddedMessagingInitError";

	/**
	 * Event dispatched to notify the customer that the user identity token has expired.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_ID_TOKEN_EXPIRED_EVENT_NAME = "onEmbeddedMessagingIdentityTokenExpired";

	/**
	 * Event dispatched to notify the host that it is currently inside business hours.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_STARTED_EVENT_NAME = "onEmbeddedMessagingBusinessHoursStarted";

	/**
	 * Event dispatched to notify the host that it is currently outside business hours.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME = "onEmbeddedMessagingBusinessHoursEnded";

	const SALESFORCE_DOMAINS = [
		// Used by dev, blitz, and prod instances
		".salesforce.com",

		// Used by VPODs
		".force.com",

		// Used by autobuild VMs
		".sfdc.net",

		// Used by local environments and Enhanced Domains CDN
		".site.com",

		// Enhanced domains on sandbox
		".salesforce-sites.com",

		// Used by Salesforce Workspaces environments
		".w.crm.dev"
	];

	/**
	 * Identity token types supported by our application.
	 */
	const ID_TOKEN_TYPE = {
		JWT: "JWT"
	};

	/**
	 * Attributes required to construct SCRT 2.0 Service URL.
	 */
	const IN_APP_SCRT2_API_PREFIX = "embeddedservice";
	const IN_APP_SCRT2_API_VERSION = "v1";

	/**
	 * Default document title of the page.
	 * @type {string}
	 */
	const DEFAULT_DOCUMENT_TITLE = document.title;

	/**
	 * Interval of title notification blinking.
	 * @type {number}
	 */
	const DOCUMENT_TITLE_BLINK_FREQUENCY_MS = 1000;

	/**
	 * Store the interval for the notification blinking.
	 * @type {number}
	 */
	let documentTitleBlinkIntervalID;

	/**
	 * Internal property to track whether the embedded messaging ready event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingReadyEventFired = false;

	/**
	 * Internal property to track whether the embedded messaging initialization event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingInitEventFired = false;

	/**
	 * Internal property to track Hidden Prechat fields from configuration response as well as the fields set by a customer.
	 * @type {object}
	 */
	let hiddenPrechatFields = {};

	/**
	 * Internal property to track page-specific parameters set by a customer for appending query strings to the Auto-Response URL.
	 * @type {Object} - f.e. { parameterName1: parameterValue2, parameterName2: parameterValue2 }
	 */
	let autoResponseParameters = {};

	/**
	 * The identity token set by the customer for authenticating the current end user.
	 * The token is set via the `embeddedservice_bootstrap.userVerificationAPI.setIdentityToken` method.
	 */
	let identityToken;

	/**
	 * This variable holds the top level storage key
	 */
	let storageKey;

	/**
	 * Internal property to track the current conversation id, which to be used in web storage
	 * @type {string}
	 */
	let conversationId;

	/**
	 * This is a resolver function for when the iframe is
	 * ready for data. Used so we can supply the jwt/connectionId when
	 * it becomes available
	 */
	let resolveLwrIframeReady;

	/**
	 * Promise to be resolved when LWR iframe is ready for data
	 */
	let lwrIframeReadyPromise = new Promise((resolve) => {
		resolveLwrIframeReady = resolve;
	});

	/**
	 * resolver function called when iframe for sitecontext.html is ready
	 */
	let siteContextReady;

	/**
	 * Promise resolved when iframe for sitecontext.html is ready
	 */
	const siteContextReadyPromise = new Promise((resolve) => {
		siteContextReady = resolve;
	});

	/**
	 * Resolver function called when we have checked both 3rd and 1st party
	 * web storage for existing session
	 */
	let sessionDataReady;

	/**
	 * Promise resolved when sessionDataReady function called
	 * (i.e. when we have checked 3rd & 1st party web storage
	 * cor existing session)
	 */
	let sessionDataPromise = new Promise((resolve) => {
		sessionDataReady = resolve;
	});

	/**
	 * Store the value of the original viewport meta tag for iOS devices.
	 * @type {string}
	 */
	let originalViewportMetaTag;

	/**
	 * Store the business hours intervals.
	 */
	let businessHoursInterval;

	/**
	 * Store the business hours timer, determines the visibility of the chat button when invoked.
	 */
	let businessHoursTimer;

	/**
	 * Viewport meta tag that disables autozoom for iOS devices
	 * @type {string}
	 */
	const IOS_VIEWPORT_META_TAG = "width=device-width, initial-scale=1, maximum-scale=1";

	/**
	 * Web storage keys
	 * @type {object}
	 */
	const STORAGE_KEYS = {
		JWT: "JWT",
		FAILED_OUTBOUND_MESSAGE_ENTRIES: "FAILED_MESSAGES",
		HIDDEN_PRECHAT_FIELDS: "HIDDEN_PRECHAT_FIELDS",
		AUTORESPONSE_PARAMETERS: "AUTORESPONSE_PARAMETERS"
	};

	/**
	 * Dictionary of keyboard code mappings for identifying keydown events.
	 */
	const KEY_CODES = {
		"ENTER": "Enter",
		"TAB": "Tab",
		"SPACE": " "
	};

	/**
	 * Resolve function for the promise returned by the embeddedservice_bootstrap.userVerificationAPI.clearSession() API.
	 * Tracking the function as an internal property allows us to resolve the promise outside clearSession().
	 * @type {function}
	 */
	let clearUserSessionPromiseResolve;

	/**
	 * Max time (in milliseconds) to wait for an identity token, after one has expired. Token is set in setIdentityToken() method.
	 * @type {number}
	 */
	const SET_IDENTITY_TOKEN_TIMEOUT_IN_MS = 30 * 1000;

	/**
	 * Resolver function for setIdentityToken promise created after the identity token expires.
	 * Promise is resolved after a valid token is set via embeddedservice_bootstrap.userVerificationAPI.setIdentityToken() API.
	 * @type {function}
	 */
	let setIdentityTokenResolve;

	/**
	 * Internal in-memory object populated with current-state and error logs from bootstrap for later to be process and pushed to Splunk in embeddedMessagingFrame#container.
	 * @type {object}
	 */
	let embeddedMessagingLogs = {
		currentStateLogs: [],
		errorLogs: []
	};

	/**
	 * This is a resolver function for when the app (container) has
	 * finished initialization. This is used to send data from bootstrap to container only after app initialization.
	 */
	let resolveAppLoaded;

	/**
	 * Promise to be resolved when the app (container) has finished loading
	 */
	let appLoadedPromise = new Promise((resolve) => {
		resolveAppLoaded = resolve;
	});

	/******************************************************
						Web storage functions
		This is copied from embeddedService:webStorageUtils.js.
		If you change this method, please update the corresponding method in webStorageUtils.js
	******************************************************/
	/**
	 * Determine the type of web storage (local vs. session) to be used
	 * It will prioritize localStorage if specify, otherwise sessionStorage
	 */
	function determineStorageType(inLocalStorage = false) {
		return embeddedservice_bootstrap.isLocalStorageAvailable && inLocalStorage ? localStorage : embeddedservice_bootstrap.isSessionStorageAvailable ? sessionStorage : undefined;
	}

	/**
	 * Get conversationId from payload from web storage
	 */
	function getConversationIdFromPayload(payload) {
		if (payload) {
			for (const key of Object.keys(JSON.parse(payload))) {
				if (!Object.hasOwn(STORAGE_KEYS, key)) {
					return key;
				}
			}
		}
		return undefined;
	}

	/**
	 * Get the existing conversationId from web storage or from provided payload
	 * We currently only support 1 active conversation per org
	 * With this assumption valid, anything aside from storage keys will be the conversationId
	 */
	function getConversationIdFromWebStorage() {
		// Prioritize localStorage if available, use sessionStorage as a backup.
		if (embeddedservice_bootstrap.isLocalStorageAvailable) {
			return getConversationIdFromPayload(localStorage.getItem(storageKey) || '{}');
		} else if (embeddedservice_bootstrap.isSessionStorageAvailable) {
			return getConversationIdFromPayload(sessionStorage.getItem(storageKey) || '{}');
		}
		return undefined;
	}

	/**
	 * Initialize the web storage object for both localStorage & sessionStorage if it doesn't already exist.
	 */
	function initializeWebStorage() {
		let localStorageObj, sessionStorageObj;

		if (getConversationIdFromWebStorage()) {
			conversationId = getConversationIdFromWebStorage();
			log("initializeWebStorage", `Retreived existing conversation-id: ${conversationId} from web storage`);
		} else {
			conversationId = generateUUID();
			log("initializeWebStorage", `Generated a new conversation-id: ${conversationId}`);
		}

		// Only create the structure if this is a new chat session
		const storageObj = JSON.stringify({
			[conversationId]: {}
		});

		// Initialize the web storage object
		if (embeddedservice_bootstrap.isLocalStorageAvailable && !localStorage.getItem(storageKey)) {
			localStorageObj = storageObj;
			localStorage.setItem(storageKey, localStorageObj);
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && !sessionStorage.getItem(storageKey)) {
			sessionStorageObj = storageObj;
			sessionStorage.setItem(storageKey, sessionStorageObj);
		}

		// Initialize 3P storage
		if (localStorageObj || sessionStorageObj) {
			sendPostMessageToSiteContextIframe(EMBEDDED_MESSAGING_3P_STORAGE_SET_OBJECTS_EVENT_NAME,
			{"orgId" : embeddedservice_bootstrap.settings.orgId, "localStorageObj" : localStorageObj,
				"sessionStorageObj" : sessionStorageObj});
		}

		log("initializeWebStorage", `web storage initialized`);
	}

	/**
	 * Returns the item in web storage by the key in this current conversation.
	 * It prioritizes getting the object in localStorage if exists in both
	 * Returns undefined if not found
	 */
	function getItemInWebStorageByKey(key, inLocalStorage = true) {
		let item;
		const storage = determineStorageType(inLocalStorage);

		if (storage) {
			const storageObj = (storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey))) || {};
			if (key === STORAGE_KEYS.JWT) {
				item = storageObj[key];
			} else {
				item = storageObj[conversationId] && storageObj[conversationId][key];
			}
		}
		return item;
	}

	/**
	 * Set items in web storage based on an object map of keys to values
	 */
	function setItemsInWebStorage(values, storage) {
		if(storage && values) {
			const storageObj = (storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey))) || {};

			Object.keys(values).forEach((key) => {
				let value = values[key];
				storageObj[key] = value;
			});

			if (Object.keys(storageObj).length !== 0) {
				storage.setItem(storageKey, JSON.stringify(storageObj));
			}
		}
	}

	/**
	 * Set the item in web storage by the key in this current conversation.
	 *
	 * @param key the storage key, within storageObj
	 * @param value the storage value, within storageObj
	 * @param inLocalStorage if true, first try to store in localStorage, otherwise sessionStorage
	 * @param sendToThirdParty if true, send the key/value pair to 3rd party storage to set there
	 */
	function setItemInWebStorage(key, value, inLocalStorage = true, sendToThirdParty = false) {
		const storage = determineStorageType(inLocalStorage);

		if (storage) {
			const storageObj = (storage.getItem(storageKey) && JSON.parse(storage.getItem(storageKey))) || {};

			// Setting JWT at top level so other conversations from same org can access the JWT
			if (key === STORAGE_KEYS.JWT) {
				storageObj[key] = value;
			} else {
				// Storage for this conversations does not exist yet,
				// create a new one without overwriting storage for other conversations
				if (!storageObj[conversationId]) {
					storageObj[conversationId] = {};
				}

				storageObj[conversationId][key] = value;
			}
			storage.setItem(storageKey, JSON.stringify(storageObj));
			log("setItemInWebStorage", `${key} set in ${inLocalStorage ? "localStorage" : "sessionStorage"}`);

			if (sendToThirdParty) {
				sendPostMessageToSiteContextIframe(EMBEDDED_MESSAGING_3P_STORAGE_SET_ITEMS_EVENT_NAME,
					{"orgId" : embeddedservice_bootstrap.settings.orgId, "conversationId" : conversationId, "key" : key, "value" : value, "inLocalStorage" : inLocalStorage});
			}
		}
	}

	/**
	 * Remove item from both localStorage and sessionStorage that match that given key
	 * As well as item that was originally stored in fallback location
	 */
	function removeItemInWebStorage(key) {
		if (embeddedservice_bootstrap.isLocalStorageAvailable && localStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(localStorage.getItem(storageKey)) || {};
			// Remove top level stored item (e.g. JWT, conversationId)
			delete storageObj[key];
			if (storageObj[conversationId] && storageObj[conversationId][key]) {
				delete storageObj[conversationId][key];
			}
			localStorage.setItem(storageKey, JSON.stringify(storageObj));
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && sessionStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(sessionStorage.getItem(storageKey)) || {};
			// Remove top level stored item (e.g. JWT, conversationId)
			delete storageObj[key];
			if (storageObj[conversationId] && storageObj[conversationId][key]) {
				delete storageObj[conversationId][key];
			}
			sessionStorage.setItem(storageKey, JSON.stringify(storageObj));
		}

		log("removeItemInWebStorage", `${key} removed from web storage`);
	}

	/**
	 * Clear all client side stored items in both localStorage & sessionStorage. Post message to clear 3rd party web storage.
	 * @param isSecondaryTab - Whether we are clearing the web storage in a secondary tab after a primary tab has already
	 * 						   cleared localStorage. Don't clear localStorage again in this case to avoid re-triggering
	 * 						   storage event listeners for Auth mode. In UnAuth mode, we don't have storage event listeners
	 * 						   so isSecondaryTab value doesn't matter.
	 */
	function clearWebStorage(isSecondaryTab) {
		if (embeddedservice_bootstrap.isLocalStorageAvailable && !Boolean(isSecondaryTab)) {
			localStorage.removeItem(storageKey);
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable) {
			sessionStorage.removeItem(storageKey);
		}
		sendPostMessageToSiteContextIframe(EMBEDDED_MESSAGING_3P_STORAGE_CLEAR_ITEMS_EVENT_NAME, embeddedservice_bootstrap.settings.orgId);
		log("clearWebStorage", `web storage cleared`);
	}

	/**
	 * Clear all in-memory data tracked on the client side, for the current conversation.
	 */
	function clearInMemoryData() {
		// Reset LWR iframe ready promise.
		lwrIframeReadyPromise = new Promise((resolve) => {
			resolveLwrIframeReady = resolve;
		});

		// Reset in-memory hidden prechat fields.
		hiddenPrechatFields = {};

		// Reset in-memory auto-response parameters.
		autoResponseParameters = {};

		// Reset identityToken
		identityToken = undefined;

		// Reset hasEmbeddedMessagingReadyEventFired.
		hasEmbeddedMessagingReadyEventFired = false;

		// Reset hasEmbeddedMessagingInitEventFired.
		hasEmbeddedMessagingInitEventFired = false;

		// Reset title notification
		updateTitleNotification();

		// Reset in-memory logs generated in bootstrap.
		cleanUpEmbeddedMessagingLogs();

		log("clearInMemoryData", `Cleared in-memory data.`);
	}

	/**
	 * Update the conversation id in web storage and in-memory
	 * @param {string} updatedConversationId
	 */
	function updateConversationIdInWebStorage(updatedConversationId) {
		if (conversationId !== updatedConversationId) {
			if (embeddedservice_bootstrap.isSessionStorageAvailable) {
				const storageObj = sessionStorage.getItem(storageKey) ? JSON.parse(sessionStorage.getItem(storageKey)) : {};
				if (storageObj[conversationId]) {
					storageObj[updatedConversationId] = storageObj[conversationId];
					delete storageObj[conversationId];
				} else {
					storageObj[updatedConversationId] = {};
				}
				sessionStorage.setItem(storageKey, JSON.stringify(storageObj));
				log("updateConversationIdInWebStorage", `conversationId updated in sessionStorage`);
			}

			if (embeddedservice_bootstrap.isLocalStorageAvailable) {
				const storageObj = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : {};
				if (storageObj[conversationId]) {
					storageObj[updatedConversationId] = storageObj[conversationId];
					delete storageObj[conversationId];
				} else {
					storageObj[updatedConversationId] = {};
				}
				localStorage.setItem(storageKey, JSON.stringify(storageObj));
				log("updateConversationIdInWebStorage", `conversationId updated in localStorage`);
			}

			conversationId = updatedConversationId;
		}
	}

	/**
	 * Merge a key-value mapping into the setting object, such that the provided
	 * values take priority. This allows the settings in the snippet to override
	 * what we get from SCRT
	 *
	 * @param {object} additionalSettings - A key-value mapping.
	 */
	function mergeSettings(additionalSettings) {

		//deep-copy values from object2 to object1
		const mergeObjects = (obj1, obj2) => {
			Object.keys(obj2).forEach((key) => {
				if(typeof(obj1[key]) === "object" && typeof(obj2[key] === "object")) {
					mergeObjects(obj1[key], obj2[key]);
				} else if (obj1[key] === undefined) {
					obj1[key] = obj2[key];
				}
			});
		};

		if(additionalSettings && typeof additionalSettings === "object") {
			mergeObjects(embeddedservice_bootstrap.settings, additionalSettings);
		}
	}

	/**
	 * Checks if the baseObject's functionName method is still native code or if it has been modified.
	 *
	 * @param {Object} baseObject - Base object to check for modification of native code.
	 * @param {string} functionName - Function name to check.
	 * @return {boolean} Is the baseObject's functionName method still native code?
	 */
	function isNativeFunction(baseObject, functionName) {
		return Function.prototype.toString.call(baseObject[functionName]).match(/\[native code\]/);
	}

	/**
	 * Output to the console using a specified method.
	 *
	 * @param {string} method - The console method to use.
	 * @param {Array.<*>} args - Objects to be displayed comma-delimited.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function outputToConsole(method, args, alwaysOutput) {
		if((alwaysOutput || Boolean(embeddedservice_bootstrap.settings.devMode)) && console && console[method]) { // eslint-disable-line no-console
			console[method]("[EmbeddedServiceBootstrap] " + (Array.isArray(args) ? args.join(", ") : args)); // eslint-disable-line no-console
		}
	}

	/**
	 * Log a message to the console.
	 *
	 * @param {string} method - Name of caller.
	 * @param {string} message - The log message to print and optionally push to Splunk.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function log(method, message, alwaysOutput) {
		outputToConsole("log", message, alwaysOutput);

		const obj = {};
		Object.assign(obj, {
			method: method ? method : "",
			stateMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : ""
		});
		processEmbeddedMessagingLogs(obj);
	}

	/**
	 * Log a warning.
	 *
	 * @param {string} message - The warning message to print.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function warning(message, alwaysOutput) {
		if(message) {
			outputToConsole("warn", "Warning: " + message, alwaysOutput);
		} else {
			outputToConsole("warn", "EmbeddedServiceBootstrap sent an anonymous warning.", alwaysOutput);
		}
	}

	/**
	 * Log an error.
	 *
	 * @param {string} method - Name of caller.
	 * @param {string} message - The error message to print.
	 * @param {string} errorCode - Optional error code if the caller was a network request.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function error(method, message, errorCode, alwaysOutput) {
		if(message) {
			outputToConsole("error", message, alwaysOutput);
		} else {
			outputToConsole("error", "EmbeddedServiceBootstrap responded with an unspecified error.", alwaysOutput);
		}

		const obj = {};
		Object.assign(obj, {
			method: method ? method : "",
			errMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "",
			...(errorCode && {errCode: errorCode})
		});
		processEmbeddedMessagingLogs(null, obj);
	}

	/**
	 * Check if this file was loaded into a Salesforce Site.
	 *
	 * @return {boolean} True if this page is a Salesforce Site.
	 */
	function pageIsSiteContext() {
		return window.$A && typeof window.$A.get === "function" && window.$A.get("$Site");
	}

	/**
	 * Some users may have stricter browser security settings.
	 * Determine what web storage APIs are available. Do nothing on error.
	 */
	function detectWebStorageAvailability() {
		try {
			window.localStorage;
		} catch(e) {
			warning("localStorage is not available. User chat sessions continue only in a single-page view and not across multiple pages.");
			embeddedservice_bootstrap.isLocalStorageAvailable = false;
		}
		try {
			window.sessionStorage;
		} catch(e) {
			warning("sessionStorage is not available. User chat sessions end after a web page refresh or across browser tabs and windows.");
			embeddedservice_bootstrap.isSessionStorageAvailable = false;
		}

		// [W-10897270] Limit session continuity in Firefox to a single tab by storing jwt in Session Storage.
		if(isUserFirefox()) {
			embeddedservice_bootstrap.isLocalStorageAvailable = false;
		}
	}

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

	/******************************************************
						Icon rendering
		This is copied from embeddedService:iconHelper.js.
	******************************************************/
	/**
	 * You can add icons by defining either their SVG path or an array of objects representing the SVG structure.
	 *
	 * Your icon should have a `viewBox` of `0 0 100 100`. If it doesn't, you can scale it using this tool:
	 * [https://jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/).
	 * See [https://salesforce.quip.com/1refAeGnpAeW](https://salesforce.quip.com/1refAeGnpAeW) for instructions.
	 *
	 * If you add an icon, make sure you update the icon repository so that we can make sure we don't lose any:
	 * [https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/InAppMessaging](https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/InAppMessaging)
	 *
	 * The parent repository has a `scale.svg` file which you can put your path into and upload to the scaling tool. Make sure you change
	 * the `transform: scale` amount to be the value of `startWidth/endWidth`.
	 */
	/**
	 * Create an SVG element of a given type, using attributes provided in a map.
	 * If an attribute "children" is provided, createSVGElement will be run using the objects in that array.
	 *
	 * @param {SVGElement} parent - The parent element for this SVG element.
	 * @param {String} elementType - The type of element to create.
	 * @param {Object} elementDefinition - Attributes to attach to the element.
	 */
	function createSVGElement(parent, elementType, elementDefinition) {
		const element = document.createElementNS("http://www.w3.org/2000/svg", elementType);

		Object.getOwnPropertyNames(elementDefinition).forEach((attribute) => {
			if(attribute === "children") {
				elementDefinition.children.forEach((childElementDefinition) => {
					createSVGElement(element, childElementDefinition.type, childElementDefinition);
				});
			} else {
				element.setAttribute(attribute, elementDefinition[attribute]);
			}
		});

		// TextNodes added to address accessibility bug in Safari 10.x (https://bugs.webkit.org/show_bug.cgi?id=162866)
		parent.appendChild(document.createTextNode("\n"));
		parent.appendChild(element);
		parent.appendChild(document.createTextNode("\n"));
	}

	/**
	 * Renders the SVG element using the icon data (i.e. path definition).
	 *
	 * @param {String} iconData - Reference to the icon data.
	 * @return {SVGElement} - The reference for this SVG element.
	 */
	function renderSVG(iconData) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		if(iconData) {
			svg.setAttribute("focusable", "false");
			svg.setAttribute("aria-hidden", "true");
			svg.setAttribute("viewBox", "0 0 100 100");

			if(Array.isArray(iconData)) {
				iconData.forEach((pathDefinition) => {
					createSVGElement(svg, pathDefinition.type, pathDefinition);
				});
			} else {
				createSVGElement(svg, "path", { d: iconData });
			}

			return svg;
		} else {
			error("renderSVG", `Invalid icon data.`);
		}

		return undefined;
	}

	/**
	 * Check for modified document/window native JS methods and output a warning for each overriden method.
	 * These methods are used in EmbeddedServiceBootstrap and also in Aura.
	 */
	function checkForNativeFunctionOverrides() {
		let documentFunctionsToCheck = [
			"addEventListener",
			"createAttribute",
			"createComment",
			"createDocumentFragment",
			// SFDC overrides createElement so we'll skip this one.
			// "createElement",
			"createElementNS",
			"createTextNode",
			"createRange",
			"getElementById",
			"getElementsByTagName",
			"getElementsByClassName",
			"querySelector",
			"querySelectorAll",
			"removeEventListener"
		];
		let windowFunctionsToCheck = [
			"addEventListener",
			"clearTimeout",
			"dispatchEvent",
			"open",
			"removeEventListener",
			"requestAnimationFrame",
			"setInterval",
			"setTimeout",
			"fetch"
		];
		let objectsToCheck = [{
			name: "document",
			object: document,
			functions: documentFunctionsToCheck
		}, {
			name: "window",
			object: window,
			functions: windowFunctionsToCheck
		}];

		// For each object type (doc/win), we want to check their expected native functions.
		objectsToCheck.forEach((objectToCheck) => {
			objectToCheck.functions.forEach((nativeFunction) => {
				if(nativeFunction in objectToCheck.object && !isNativeFunction(objectToCheck.object, nativeFunction)) {
					warning(
						"EmbeddedService Messaging Bootstrap may not function correctly with this native JS function modified: " + objectToCheck.name + "." + nativeFunction,
						true
					);
				}
			});
		});
	}

	/**
	 * If the iframe is responsible for getting a new JWT, it will send a post message here to notify the parent of the new JWT. Store this new JWT in web storage for session continuity.
	 * @param {String} jwt - JWT to store in web storage.
	 */
	function storeJwtInWebStorage(jwt) {
		if(typeof jwt !== "string") {
			error("storeJwtInWebStorage", `Expected to receive string, instead received: ${jwt}.`);
		}

		setItemInWebStorage(STORAGE_KEYS.JWT, jwt);
	}

	/**
	 * When the iframe updates its web storage for Failed Conversation Messages, it will send a post message here with Failed Conversation Messages object
	 * to notify the parent to store the same in web storage for session continuity.
	 * @param {Object} failedMessages - Failed end-user conversation messages.
	 */
	function storeFailedMessagesInWebStorage(failedMessages) {
		if (typeof failedMessages !== "object") {
			error("storeFailedMessagesInWebStorage", `Expected to receive object, instead received: ${failedMessages}.`);
			return;
		}

		setItemInWebStorage(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES, failedMessages, false);
	}

	/**
	 * Prepares a final version of configuration response object to be sent to the iframe window.
	 * Note: IA-Message Jwt, Failed Conversation Messages, Hidden Prechat values and Labels are not stored on the original Configuration Settings object.
	 *
	 * @return {object}
	 */
	function prepareConfigurationDataForIframeWindow() {
		const failedConversationMessages = getItemInWebStorageByKey(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES, false);
		const standardLabelsFromConfiguration = embeddedservice_bootstrap.settings.standardLabels;
		const customLabelsFromConfiguration = embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels;
		let imageCompressionOptions;

		if (embeddedservice_bootstrap.settings.imageCompressionOptions) {
			const option = embeddedservice_bootstrap.settings.imageCompressionOptions;

			imageCompressionOptions = {
				...(option.quality && !isNaN(Number(option.quality)) && Number(option.quality) >= 0 && Number(option.quality) <= 1 && {quality: Number(option.quality)}),
				...(option.maxHeight && !isNaN(Number(option.maxHeight)) && Number(option.maxHeight) > 0 && {maxHeight: Number(option.maxHeight)}),
				...(option.maxWidth && !isNaN(Number(option.maxWidth)) && Number(option.maxWidth) > 0 && {maxWidth: Number(option.maxWidth)}),
				...(option.convertTypes && (typeof option.convertTypes === 'string' || Array.isArray(option.convertTypes)) && {convertTypes: option.convertTypes}),
				...(option.convertSize && !isNaN(Number(option.convertSize)) && Number(option.convertSize) >= 0 && {convertSize: option.convertSize})
			};
		}

		const finalConfigurationData = Object.assign({}, embeddedservice_bootstrap.settings.embeddedServiceConfig, {
			identityToken: identityToken,
			failedMessages: failedConversationMessages,
			conversationId,
			devMode: Boolean(embeddedservice_bootstrap.settings.devMode),
			language: embeddedservice_bootstrap.settings.language,
			imageCompressionOptions,
			...(standardLabelsFromConfiguration && {standardLabels: standardLabelsFromConfiguration}),
			...(customLabelsFromConfiguration && {customLabels: customLabelsFromConfiguration}),
			hasConversationButtonColorContrastMetA11yThreshold: hasConversationButtonColorContrastMetA11yThreshold(),
			hostUrl: window.location.href
		});

		return finalConfigurationData || {};
	}

	/**
	 * Adds Message and Storage event listeners on host window.
	 * Message event handlers are used to communicate between the iframe and the host window.
	 * Storage event handlers are used to sync local storage changes across tabs/windows on the same domain.
	 */
	function addEventHandlers() {
		addMessageEventHandlers();
		if (embeddedservice_bootstrap.isLocalStorageAvailable) {
			addStorageEventHandlers();
		}
	}

	/**
	 * Adds message event listeners on host window.
	 */
	function addMessageEventHandlers() {
		window.addEventListener("message", handleMessageEvent);
	}

	/**
	 * Adds storage event listeners on host window.
	 */
	function addStorageEventHandlers() {
		window.addEventListener("storage", handleStorageEvent);
	}

	/**
	 * Remove event listeners on host window including
	 * - message events
	 * - storage events
	 */
	EmbeddedServiceBootstrap.prototype.removeEventHandlers = function removeEventHandlers() {
		window.removeEventListener("message", handleMessageEvent);
		window.removeEventListener("storage", handleStorageEvent);
	}

	/**
	 * Handle message events on the window object.
	 * Message event handlers are used to communicate between the iframe and the host window.
	 * @param {Object} e - Message event
	 */
	function handleMessageEvent(e) {
		if(e && e.data && e.origin) {
			if(embeddedservice_bootstrap.filePreviewFrame && embeddedservice_bootstrap.filePreviewFrame.contentWindow === e.source) {
				// Handle events from File Preview Iframe window.
				switch(e.data.method) {
					case EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT_NAME:
						setFilePreviewFrameVisibility(true);
						break;
					case EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT_NAME:
						setFilePreviewFrameVisibility(false);
						break;
					default:
						warning("Unrecognized event name: " + e.data.method);
						break;
				}
			} else if(embeddedservice_bootstrap.siteContextFrame && embeddedservice_bootstrap.siteContextFrame.contentWindow === e.source) {
				switch(e.data.method) {
					case EMBEDDED_MESSAGING_3P_STORAGE_READY_EVENT_NAME:
						siteContextReady();
						break;
					case EMBEDDED_MESSAGING_3P_STORAGE_RESPONSE_EVENT_NAME:
						if (e.data.data && e.data.data.localStorage){
							setItemsInWebStorage(e.data.data.localStorage, localStorage);
						}
						if (e.data.data && e.data.data.sessionStorage){
							setItemsInWebStorage(e.data.data.sessionStorage, sessionStorage);
						}
						sessionDataReady();
						break;
					default:
						warning("Unrecognized event name: " + e.data.method);
						break;
				}
			} else if(e.origin === "null" ||
				(getSiteURL().indexOf(e.origin) === 0
					&& embeddedservice_bootstrap.isMessageFromSalesforceDomain(e.origin)
					&& getEmbeddedMessagingFrame().contentWindow === e.source)) {
				let frame = getEmbeddedMessagingFrame();

				switch(e.data.method) {
					case EMBEDDED_MESSAGING_APP_READY_EVENT_NAME:
						//resolve the promise, this may cause waiting messages to be sent to iframe window
						resolveLwrIframeReady();
						break;
					case APP_LOADED_EVENT_NAME:
						handleAfterAppLoad();
						break;
					case APP_INIT_ERROR_EVENT_NAME:
						handleInitializationError();
						break;
					case APP_MINIMIZE_EVENT_NAME:
						embeddedservice_bootstrap.minimizeIframe(frame, e.data.data);
						break;
					case APP_MAXIMIZE_EVENT_NAME:
						embeddedservice_bootstrap.maximizeIframe(frame);
						break;
					case APP_RESET_INITIAL_STATE_EVENT_NAME:
						resetClientToInitialState();
						break;
					//TODO: W-12546287 remove this when we no longer renew authenticated jwt in container.
					case EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME:
						storeJwtInWebStorage(e.data.data);
						break;
					case EMBEDDED_MESSAGING_CLEAN_UP_JWT_EVENT_NAME:
						clearWebStorage();
						break;
					case EMBEDDED_MESSAGING_DOWNLOAD_FILE:
						downloadFile(e.data.data);
						break;
					case EMBEDDED_MESSAGING_UPDATE_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME:
						storeFailedMessagesInWebStorage(e.data.data);
						break;
					case EMBEDDED_MESSAGING_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME:
						removeItemInWebStorage(STORAGE_KEYS.FAILED_OUTBOUND_MESSAGE_ENTRIES);
						break;
					case EMBEDDED_MESSAGING_UPDATE_TITLE_NOTIFICATION:
						updateTitleNotification(e.data.data);
						break;
					case APP_REQUEST_HIDDEN_PRECHAT_FIELDS_EVENT_NAME:
						/**
						 * Send Hidden Prechat fields to the container when they are requested, to ensure most recent values are received in the container
						 * at the time of submitting Prechat form (if enabled).
						 * This event is exchanged only when Prechat is enabled in the setup.
						 */
						sendPostMessageToAppIframe(APP_RECEIVE_HIDDEN_PRECHAT_FIELDS_EVENT_NAME, hiddenPrechatFields);
						break;
					case APP_REQUEST_AUTORESPONSE_PARAMETERS_EVENT_NAME:
						sendPostMessageToAppIframe(APP_RECEIVE_AUTORESPONSE_PARAMETERS_EVENT_NAME, autoResponseParameters);
						break;
					case EMBEDDED_MESSAGING_CONVERSATION_ID_UPDATE:
						updateConversationIdInWebStorage(e.data.data);
						break;
					case EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT_NAME:
						handleIdentityTokenExpiredEvent();
						break;
					case EMBEDDED_MESSAGING_JWT_RETRIEVAL_FAILURE_EVENT_NAME:
						handleJwtRetrievalFailure();
						break;
					case APP_PRECHAT_SUBMIT:
						handlePrechatSubmit(e.data.data);
						break;
					case APP_SHOW_MINIMIZED_STATE_NOTIFICATION:
						handleShowMinimizedStateNotification();
						break;
					default:
						warning("Unrecognized event name: " + e.data.method);
						break;
				}
			} else {
				error("handleMessageEvent", `Unexpected message origin: ${e.origin}`);
			}
		}
	}

	/**
	 * Handle storage events on the window object.
	 * Storage event handlers are used to sync local storage changes across tabs/windows on the same domain.
	 * Storage event handlers are not executed on the same tab/window that is making the changes.
	 * @param {Object} e - Storage event
	 */
	function handleStorageEvent(e) {
		// Compare e.key with our storage key
		if (e && e.key && e.key === storageKey) {
			// Handle clear web storage event
			if (e.newValue === null) {
				// If we're in Auth mode, clear user session for current tab/window.
				if (getAuthMode() === AUTH_MODE.AUTH) {
					handleClearUserSession(false, true);
				}
			} else {
				// Handle conversationId change, if new value is non-null and different than old value
				const oldConversationId = getConversationIdFromPayload(e.oldValue);
				const newConversationId = getConversationIdFromPayload(e.newValue);

				// Updating only when both old & new id is non-null
				// So that it doesn't overwrite data on other tabs after reset
				if (oldConversationId && newConversationId && oldConversationId !== newConversationId) {
					log("handleStorageEvent", "ConversationId change detected in web storage");
					updateConversationIdInWebStorage(newConversationId);
				}
			}
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingReady' to the host (i.e. customer) window to indicate the host that bootstrap initialization is complete.
	 */
	EmbeddedServiceBootstrap.prototype.emitEmbeddedMessagingReadyEvent = function emitEmbeddedMessagingReadyEvent() {
		hasEmbeddedMessagingReadyEventFired = true;
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_READY_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingReadyEventFired = false;
			error("emitEmbeddedMessagingReadyEvent", `Something went wrong in firing onEmbeddedMessagingReady event ${err}.`);
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingInitSuccess' to the host (i.e. customer) window to indicate the client is rendered.
	 */
	function emitEmbeddedMessagingInitSuccessEvent() {
		hasEmbeddedMessagingInitEventFired = true;
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingInitEventFired = false;
			error("emitEmbeddedMessagingInitSuccessEvent", `Something went wrong in firing onEmbeddedMessagingInitSuccess event ${err}.`);
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingInitError' to the host (i.e. customer) window to indicate the client is not rendered.
	 */
	function emitEmbeddedMessagingInitErrorEvent() {
		hasEmbeddedMessagingInitEventFired = true;
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingInitEventFired = false;
			error("emitEmbeddedMessagingInitErrorEvent", `Something went wrong in firing onEmbeddedMessagingInitError event ${err}.`);
		}
	}

	/**
	 * Dispatches a custom event with the given name to the host window. Throws an error if something goes wrong while
	 * dispatching the event.
	 * @param eventName - Name of event to dispatch.
	 */
	function dispatchEventToHost(eventName) {
		if (!eventName) {
			throw new Error(`Expected an eventName parameter with a string value. Instead received ${eventName}.`);
		}
		try {
			window.dispatchEvent(new CustomEvent(eventName));
		} catch(err) {
			throw new Error("Something went wrong while dispatching the event " + eventName + ":" + err);
		}
	}

	/**
	 * Updates the title notification on new messages received when page is backgrounded
	 * - If data is defined, then set interval to blink between 2 notifications
	 * - Otherwise, clear the interval and reset to default page title
	 */
	function updateTitleNotification(data) {
		if (data) {
			const messages = JSON.parse(data);

			const firstNotification = messages[0];
			const secondNotification = DEFAULT_DOCUMENT_TITLE;

			// Clear previous interval, if exists
			if (documentTitleBlinkIntervalID) {
				window.clearInterval(documentTitleBlinkIntervalID);
			}

			documentTitleBlinkIntervalID = window.setInterval(() => {
				if (document.title === firstNotification) {
					document.title = secondNotification;
				} else {
					document.title = firstNotification;
				}
			}, DOCUMENT_TITLE_BLINK_FREQUENCY_MS);
		} else {
			window.clearInterval(documentTitleBlinkIntervalID);
			documentTitleBlinkIntervalID = undefined;
			document.title = DEFAULT_DOCUMENT_TITLE;
		}
	}

	/**
	 * Returns a DOM reference to the embedded messaging top level container.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingTopContainer() {
		return document.getElementById(TOP_CONTAINER_NAME);
	}

	/**
	 * Returns a DOM reference to the embedded messaging iframe.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingFrame() {
		return document.getElementById(LWR_IFRAME_NAME);
	}

	/**
	 * Returns a DOM reference to the embedded messaging modal.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingModal() {
		return document.getElementById(BACKGROUND_MODAL_ID);
	}

	/**
	 * Returns a DOM reference to the embedded messaging conversation button.
	 *
	 * @returns {object}
	 */
	function getEmbeddedMessagingConversationButton() {
		return document.getElementById(CONVERSATION_BUTTON_CLASS);
	}

	/**
	 * Returns a DOM reference to the viewport meta tag
	 *
	 * @returns {object}
	 */
	function getViewportMetaTag() {
		return document.querySelector('meta[name="viewport"]');
	}

	/**
	 * Set file preview iframe visibility (i.e. show/hide) based on the param value.
	 *
	 * @param {boolean} showFilePreviewFrame
	 */
	function setFilePreviewFrameVisibility(showFilePreviewFrame) {
		const embeddedMessagingFrame = getEmbeddedMessagingFrame();

		if(embeddedservice_bootstrap.filePreviewFrame && embeddedMessagingFrame) {
			if(Boolean(showFilePreviewFrame)) {
				embeddedservice_bootstrap.filePreviewFrame.classList.add("show");
				embeddedservice_bootstrap.filePreviewFrame.contentWindow.focus();
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "false");
				embeddedMessagingFrame.tabIndex = "-1";
				embeddedMessagingFrame.setAttribute("aria-hidden", "true");
			} else {
				embeddedservice_bootstrap.filePreviewFrame.classList.remove("show");
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "true");
				embeddedMessagingFrame.tabIndex = "0";
				embeddedMessagingFrame.setAttribute("aria-hidden", "false");
			}
			log("setFilePreviewFrameVisibility", `Full size file preview ${Boolean(showFilePreviewFrame) ? "shown" : "hidden"}`);
		}
	}

	/**
	 * Downloads a file to the local file system, from the URL in event data.
	 * Temporarily creates and attaches an iframe to the parent page's DOM to achieve this. Removes the temporary iframe from the DOM as cleanup, post download.
	 */
	function downloadFile(downloadData) {
		let fileDownloadIframe;

		fileDownloadIframe = document.createElement("iframe");
		fileDownloadIframe.style.display = "none";
		fileDownloadIframe.src = downloadData.attachmentDownloadURL || "";

		// Add iframe to the DOM.
		document.body.appendChild(fileDownloadIframe);
		// Open the file in a new tab if the app requires it to.
		if(downloadData.shouldOpenFileInNewTab) {
			window.open(fileDownloadIframe.src, '_blank', 'noreferrer noopener');
		}
		/**
		 * Add a small delay before executing Javascript execution queue, to avoid page navigation interruption.
		 * https://kb.webtrends.com/articles/Information/NS-BINDING-ABORTED-status-message-in-http-debugger/?l=en_US&fs=RelatedArticle
		 */
		setTimeout(() => {
			// Cleanup - remove iframe from the DOM.
			document.body.removeChild(fileDownloadIframe);
		}, 1000);
	}

	/**
	 * Validate all the attributes on the settings object required for bootstrap initialization and for making a request to InApp Config Service.
	 */
	function validateInitParams() {
		if(typeof embeddedservice_bootstrap.settings.siteURL !== "string" || !embeddedservice_bootstrap.settings.siteURL.length) throw new Error(`Expected a valid Site URL value to be a string but received: ${embeddedservice_bootstrap.settings.siteURL}.`);
		if(typeof embeddedservice_bootstrap.settings.scrt2URL !== "string" || !embeddedservice_bootstrap.settings.scrt2URL.length) throw new Error(`Expected a valid SCRT 2.0 URL value to be a string but received: ${embeddedservice_bootstrap.settings.scrt2URL}.`);
		if(!embeddedservice_bootstrap.settings.orgId || !embeddedservice_bootstrap.isOrganizationId(embeddedservice_bootstrap.settings.orgId)) throw new Error("Invalid OrganizationId Parameter Value: " + embeddedservice_bootstrap.settings.orgId);
		if(typeof embeddedservice_bootstrap.settings.eswConfigDevName !== "string" || !embeddedservice_bootstrap.settings.eswConfigDevName.length) throw new Error(`Expected a valid ESW Config Dev Name value to be a string but received: ${embeddedservice_bootstrap.settings.eswConfigDevName}.`);
	}

	/**
	 * Validate all the necessary attributes on the settings object after making a request to InApp Config Service.
	 */
	function validateSettings() {
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig) throw new Error("Embedded Service Config settings not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.name) throw new Error("Embedded Service Config developer name not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel) throw new Error("Embedded Service Messaging Channel settings not present in configuration response.");
		if(!embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode) throw new Error("Auth mode setting not present in configuration response.");
		if(!Object.values(AUTH_MODE).includes(embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode)) throw new Error("Auth mode in configuration response is invalid.");
	}

	/**
	 * Load the bootstrap.css file for this static file.
	 */
	function loadCSS(url) {
		return new Promise((resolve, reject) => {
			let baseURL = getSiteURL();
			let link = document.createElement("link");

			link.id = BOOTSTRAP_CSS_NAME;
			link.class = BOOTSTRAP_CSS_NAME;
			link.href = baseURL + "/assets/styles/bootstrap" + (embeddedservice_bootstrap.settings.devMode ? "" : ".min") + ".css";
			link.type = "text/css";
			link.rel = "stylesheet";

			link.onerror = reject;
			link.onload = resolve;

			document.getElementsByTagName("head")[0].appendChild(link);
		});
	}

	/**
	 * Load the config settings from SCRT 2.0 stack.
	 */
	function getConfigurationData() {
			const configURL = embeddedservice_bootstrap.settings.scrt2URL + "/" + IN_APP_SCRT2_API_PREFIX + "/" + IN_APP_SCRT2_API_VERSION +
				"/embedded-service-config?orgId=" + embeddedservice_bootstrap.settings.orgId + "&esConfigName=" +
				embeddedservice_bootstrap.settings.eswConfigDevName + "&language=" + embeddedservice_bootstrap.settings.language;

		return sendXhrRequest(configURL, "GET", "getConfigurationData");
	}

	/**
	 * Get business hours data from the business hours endpoint.
	 * The API will always retuns the next 2 BH intervals,
	 * so with that being true, the intervals will never start off stale.
	 * But for sake of simplification, we are only storing one interval at a time.
	 */
	function getBusinessHoursInterval() {
		const eswConfigDevName = embeddedservice_bootstrap.settings.eswConfigDevName;
		const orgId = embeddedservice_bootstrap.settings.orgId;

		const endpoint = embeddedservice_bootstrap.settings.scrt2URL + "/" + IN_APP_SCRT2_API_PREFIX + "/" + IN_APP_SCRT2_API_VERSION +
				"/businesshours?orgId=" + orgId + "&esConfigName=" + eswConfigDevName;

		return sendXhrRequest(endpoint, "GET", "getBusinessHoursInterval").then(
			response => {
				const businessHoursInfo = response && response.businessHoursInfo;

				log("getBusinessHoursInterval", "Successfully retrieved Business Hours data");

				if (businessHoursInfo && Array.isArray(businessHoursInfo.businessHours) && businessHoursInfo.businessHours.length > 0 && (isChannelMenuDeployment() || typeof embeddedservice_bootstrap.settings.hideChatButtonOnLoad !== "boolean")) {
					businessHoursInterval = {
						startTime: businessHoursInfo.businessHours[0].startTime,
						endTime: businessHoursInfo.businessHours[0].endTime
					};
					setupBusinessHoursTimer();
				}
			}
		).catch(
			(e) => {
				error("getBusinessHoursInterval", `Error loading business hours metadata: ${e}`, e);
			}
		);
	}

	/**
	 * Send an HTTP request using fetch with a specified path, and method.
	 * @returns {Promise}
	 */
	function sendXhrRequest(apiPath, method, caller) {
		const startTime = performance.now();

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, apiPath, true);

			xhr.onreadystatechange = (response) => {
				const state = response.target;

				// DONE === The operation is complete, per https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState.
				// Business hours return 204 if no business hours is associated with the deployment.
				if(state && state.readyState === state.DONE || state.status === 204) {
					const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3); // Read the timeElapsed in seconds and round the value to 3 decimal places.

					if(state.status === 200 || state.status === 204) {
						const responseJson = state.responseText ? JSON.parse(state.responseText) : state.responseText;

						resolve(responseJson);
					} else {
						reject(state.status);
					}
					log("sendXhrRequest", `${caller ? caller : apiPath} took ${timeElapsed} seconds and returned with the status code ${state.status}`);
				}
			};
			xhr.send();
		});
	}

	/**
	 * Initializes the active state by creating a JWT.
	 * This method does the following -
	 * 1. Create a JWT if in AUTH mode OR if prechat is disabled, ELSE resolve the promise.
	 * 2. If we are in AUTH mode, use the JWT from Step 1 to list existing open conversations of this end-user.
	 *
	 * @returns {Promise}
	 */
	function initializeConversationState() {
		if (getAuthMode() === AUTH_MODE.AUTH) {
			return handleGetAuthenticatedJwt().then((jwtData) => {
				handleListConversation().then((conversationData) => {
					log("initializeConversationState", "finished joining verified user conversation");
					sendConfigurationToAppIframe(jwtData, conversationData);
				}).catch(() => {
					emitEmbeddedMessagingInitErrorEvent();
				});	
			});
		} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
			if (!isPrechatStateEnabled()) {
				return handleGetUnauthenticatedJwt().then((jwtData) => {
					handleCreateNewConversation(hiddenPrechatFields).then((conversationData) => {
						log("initializeConversationState", "finished creating conversation");
						sendConfigurationToAppIframe(jwtData, conversationData);
					}).catch(() => {
						emitEmbeddedMessagingInitErrorEvent();
					});
				});
			} else {
				// Pre-chat is enabled, send configuration to app without jwt & conversation data.
				sendConfigurationToAppIframe();
				return Promise.resolve();
			}
		}

		return Promise.reject(new Error("Something went wrong initializing conversation state."));
	}

	/**
	 * Sends configuration data to LWR app. Optional - Adds jwt & conversation data to configuration before sending if specified.
	 * @param jwtData - Optional jwtData (accessToken & lastEventId).
	 * @param conversationData - Optional new or existing conversation data.
	 */
	function sendConfigurationToAppIframe(jwtData, conversationData) {
		let configData = prepareConfigurationDataForIframeWindow();

		if (jwtData) {
			configData = Object.assign(configData, { jwtData });
		}
		if (conversationData) {
			configData = Object.assign(configData, { conversationData });
		}
		if (embeddedMessagingLogs.currentStateLogs.length || embeddedMessagingLogs.errorLogs.length) {
			configData = Object.assign(configData, { pendingLogs: embeddedMessagingLogs });
			cleanUpEmbeddedMessagingLogs();
		}
		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONFIG_EVENT_NAME, configData);
	}

	/**
	 * Handles pre-chat form submit event from app iframe. This method does the following -
	 * 1. Add hidden pre-chat to visible fields.
	 * 2. In UNAUTH mode, create a jwt and a conversation.
	 * 3. In AUTH mode, create a conversation.
	 * Finally, send jwt and/or conversation data to LWR app.
	 *
	 * @param visiblePrechatFields - Visible pre-chat fields in the format - {fieldName: fieldValue}
	 */
	function handlePrechatSubmit(visiblePrechatFields) {
		const prechatFields = Object.assign(visiblePrechatFields, hiddenPrechatFields);
		if (getAuthMode() === AUTH_MODE.AUTH) {
			handleCreateNewConversation(prechatFields).then((conversationData) => {
				sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, conversationData);
			});
		} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
			handleGetUnauthenticatedJwt().then((jwtData) => {
				sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME, jwtData);
				handleCreateNewConversation(prechatFields).then((conversationData) => {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, conversationData);
				});
			});
		}
	}

	/**
	 * Generate the file preview and application iframe and load the resources.
	 * @returns {Promise}
	 */
	function generateIframes() {
		return new Promise(resolve => {
			// Generate markup for iframes.
			embeddedservice_bootstrap.createFilePreviewFrame();
			embeddedservice_bootstrap.createIframe().then(() => {
				resolve("Created Embedded Messaging frame.");
			});
		});
	}

    /**
     * Handle getting a continuity JWT.
     * @returns {Promise}
     */
    function handleGetContinuityJwt() {
		// Check if jwt exists in web storage, that will be used to fetch a continuityAccessToken.
        if (!getItemInWebStorageByKey(STORAGE_KEYS.JWT)) {
            return Promise.reject(undefined);
        }

		return getContinuityJwt()
			.then(response => {
				storeJwtInWebStorage(response.accessToken);
				log("handleGetContinuityJwt", "Sucessfully retreived a Continuity JWT");
				return response;
			})
			.catch(e => {
				error("handleGetContinuityJwt", `Failed to get Continuity JWT: ${e && e.message ? e.message : e}.`);
				// Reset the client to the initial state when we fail to fetch a continuity jwt.
				// This will mainly occur when a user returns to unverified conversation after the messaging jwt expires.
				resetClientToInitialState();
			});
    }

	/**
	 * Get a JWT with the same subjectId but new clientId as the existing inAppService JWT. This function is used for session continuity across tabs.
	 *
	 * https://git.soma.salesforce.com/pages/service-cloud-realtime/scrt2-docs/openapi/?app=ia-message-service#/paths/~1authorization~1continuityAccessToken/get
	 *
	 * @returns {Promise}
	 */
	function getContinuityJwt() {
		const apiPath = embeddedservice_bootstrap.settings.scrt2URL.concat(CONTINUITY_ACCESS_TOKEN_PATH);
		return sendRequest(
			apiPath,
			"GET",
			"cors",
			null,
			null,
			"getContinuityJwt"
		).then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		});
	}

	/**
     * Handle getting an unauthenticated JWT.
     *
     * @returns {Promise}
     */
	function handleGetUnauthenticatedJwt() {
		return getUnauthenticatedJwt()
			.then(response => {
				storeJwtInWebStorage(response.accessToken);
				log("handleGetUnauthenticatedJwt", "Successfully retreived an Unauthenticated JWT");
				return response;
			})
			.catch(e => {
				return handleGetJwtError(e);
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
		const orgId = embeddedservice_bootstrap.settings.orgId;
		const developerName = embeddedservice_bootstrap.settings.eswConfigDevName;
		const deviceInfoAsQueryParams = getDeviceInfoAsQueryParams();
		const endpoint = deviceInfoAsQueryParams ?
			embeddedservice_bootstrap.settings.scrt2URL.concat(UNAUTHENTICATED_ACCESS_TOKEN_PATH, "?", deviceInfoAsQueryParams):
			embeddedservice_bootstrap.settings.scrt2URL.concat(UNAUTHENTICATED_ACCESS_TOKEN_PATH);

		return fetch(
			endpoint,
			{
				method: "POST",
				mode: "cors",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					orgId,
					developerName,
					capabilitiesVersion
				})
			}
		).then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		});
	}

    /**
     * Handle getting an authenticated jwt.
     * 
     * @returns {Promise<unknown>}
     */
    function handleGetAuthenticatedJwt() {
        return getAuthenticatedJwt()
			.then(response => {
				storeJwtInWebStorage(response.accessToken);
				log("handleGetAuthenticatedJwt", "Successfully retreived an Authenticated JWT");
				return response;
			})
			.catch(e => {
				error("handleGetAuthenticatedJwt", `Error retrieving authenticated token: ${e && e.message ? e.message : e}.`);
				handleJwtRetrievalFailure();
			});
    }

	/**
	 * Get a JWT for an authenticated user. This JWT is used for authenticated conversations.
	 * 
	 * @returns {Promise}
	 */
	function getAuthenticatedJwt() {
		const orgId = embeddedservice_bootstrap.settings.orgId;
		const developerName = embeddedservice_bootstrap.settings.eswConfigDevName;
		const customerIdentityToken = identityToken;
		const deviceInfoAsQueryParams = getDeviceInfoAsQueryParams();
		const apiPath = deviceInfoAsQueryParams ?
			embeddedservice_bootstrap.settings.scrt2URL.concat(AUTHENTICATED_ACCESS_TOKEN_PATH, "?", deviceInfoAsQueryParams) :
			embeddedservice_bootstrap.settings.scrt2URL.concat(AUTHENTICATED_ACCESS_TOKEN_PATH);
		const method = "POST";
		const mode = "cors";
		const requestHeaders = { "Content-Type": "application/json" };
		const requestBody = {
			orgId,
			developerName,
			capabilitiesVersion,
			"authorizationType": ID_TOKEN_TYPE.JWT,
			customerIdentityToken
		};

		if (customerIdentityToken && validateJwt(customerIdentityToken)) {
			// Send fetch request if identity token has not expired.
			return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, "getAuthenticatedJwt")
				.then(response => {
					if (!response.ok) {
						throw response;
					}
					return response.json();
				});
		}

		// Identity token has expired, return a promise that's resolved after a valid token is obtained and the request is executed.
		return new Promise(resolve => {
			handleIdentityTokenExpiry({ apiPath, method, mode, requestHeaders, requestBody, resolve });
		}).then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		});
	}

	/**
	 * Handles registering device capabilities with RegisterDeviceCapabilities ia-message endpoint.
	 */
	function handleRegisterDeviceCapabilities() {
		registerDeviceCapabilities()
		.then(() => {
			log("handleRegisterDeviceCapabilities", "Successfully Registered Device Capabilities.");
		})
		.catch(err => {
			handleRegisterDeviceCapabilitiesError(err);
		});
	}

	/**
	 * Handles failure from registering device capabilities the first time. If the first request fails for any reason, it is retried once.
	 */
	function handleRegisterDeviceCapabilitiesError(err) {
		if (err && err.status && err.status >= 500 && err.status <= 599) {
			error("handleRegisterDeviceCapabilitiesError", `Something went wrong in Registering Device Capabilities: ${err && err.statusText ? err.statusText : err.status}. Retrying the request.`, err.status);
			registerDeviceCapabilities()
			.then(() => {
				log("handleRegisterDeviceCapabilitiesError", `Successfully Registered Device Capabilities after retrying.`);
			})
			.catch(err => {
				error("handleRegisterDeviceCapabilitiesError", `Failed to Register Device Capabilities after retrying: ${err && err.statusText ? err.statusText : err.status}`, err.status);
				return;
			});
		}
		error("handleRegisterDeviceCapabilitiesError", `Something went wrong while registering device capabilities: ${err && err.statusText ? err.statusText : (err.status ? err.status : err)}`);
	}

	/**
	 * Makes a network request to RegisterDeviceCapabilities ia-message endpoint to register device capabilities for the version specified in the request.
	 *
	 * Endpoint info: https://salesforce.quip.com/HaarAI2rvqLD#temp:C:CVQ1633b46f83d44f95a681db466
	 */
	function registerDeviceCapabilities() {
		const apiPath = embeddedservice_bootstrap.settings.scrt2URL.concat(REGISTER_DEVICE_CAPABILITIES_PATH);

		return sendRequest(
			apiPath,
			"POST",
			"cors",
			null,
			{},
			"registerDeviceCapabilities"
		);
	}

    /**
     * List existing open conversations for this end-user.
     *
     * If this end user is a part of 0 open conversations and pre-chat is not enabled, create a new one.
	 * If this end user is a part of exactly 1 open conversation, re-join the conversation.
     * If this end user is a part of more than 1 open conversation, load the conversation with the latest startTimestamp.
	 *
	 * Note:
	 * It's possible there's a delay in scrt2 propagating conversation information to core if this conversation has just ended.
	 * Check for an endTimestamp for both open and closed conversations.
	 * If the conversation's `endTimestamp` value is not 0, the conversation is closed.
	 *
	 * @param isPageLoad - we are attempting to continue an existing session on script load
     * @returns {*}
     */
    function handleListConversation(isPageLoad) {
        return listConversation(false).then(response => {
			let openConversations = [];

			if (!response.conversations || !Array.isArray(response.conversations)) {
				throw new Error(`Invalid conversation list: ${response.conversations}.`);
			}

			// Filter open conversations, i.e conversations with endTimestamp === 0
			openConversations = response.conversations.filter((conversation) => conversation.endTimestamp === 0);

			if (openConversations.length === 0) {
				// No existing conversation. If this is page load, it means we have stale data;

				if (isPageLoad) {
					//delete stale data, show button as on normal page load
					let existingConversationId = getConversationIdFromWebStorage();
					log("handleListConversation", `No open conversation found, deleting stale data with conversationId: ${existingConversationId} from web storage`, true);
					warning("No open conversation found, deleting stale data with conversationId " + existingConversationId + " from web storage");
					resetClientToInitialState();

					throw new Error(`Invalid conversation identifier: ${existingConversationId}.`);
				}

				if (!isPrechatStateEnabled()) {
					// Pre-chat state is not enabled - start a new conversation.
					log("handleListConversation", "No existing conversation found and pre-chat is not enabled. Will start a new conversation.");
					warning("No existing conversation found and pre-chat is not enabled. Will start a new conversation.");
					return handleCreateNewConversation(hiddenPrechatFields).then((newConversationData) => {
						return newConversationData;
					});
				}
				// No-op since pre-chat is enabled.
				return null;
			}

			if (openConversations.length > 1) {
				log("handleListConversation", `Expected the user to be participating in 1 open conversation but instead found ${openConversations.length}. Loading the conversation with latest startTimestamp.`);
				warning(`Expected the user to be participating in 1 open conversation but instead found ${openConversations.length}. Loading the conversation with latest startTimestamp.`);
				openConversations.sort((convA, convB) => convB.startTimestamp - convA.startTimestamp);
			}

			let existingConversationData = openConversations[0];

			if (!isString(existingConversationData.conversationId)) {
				// To restore conversation status and entries, conversationId must be set!
				throw new Error(`Invalid conversation identifier: ${existingConversationData.conversationId}.`);
			}

			log("handleListConversation", `Successfully retrieved existing conversation`);
			existingConversationData.isExistingConversation = true;
			return existingConversationData;
        }).catch(e => {
			error("handleListConversation", `Failed to list conversation entries: ${e && e.message ? e.message : e}.`);
            throw new Error(`Failed to list conversation entries: ${e && e.message ? e.message : e}.`);
        });
    }

	/**
	 * Get a list of all conversations the current subjectId is participating in.
	 * Returns:
	 * - number of open conversations
	 * - number of closed conversations
	 * - array of conversations
	 *
	 * https://git.soma.salesforce.com/pages/service-cloud-realtime/scrt2-docs/openapi/?app=ia-message-service#operation/listConversation
	 *
	 * @param {Boolean} includeClosedConversations - Whether to include closed conversations in list. Optional.
	 * @returns {Promise}
	 */
	function listConversation(includeClosedConversations){
		const endpoint = embeddedservice_bootstrap.settings.scrt2URL.concat(LIST_CONVERSATIONS_PATH);

		return sendRequest(
			endpoint,
			"POST",
			"cors",
			null,
			{ includeClosedConversations },
			"listConversation"
		).then(response => response.json());
	};

	/**
     * Handle error scenarios for getting unauthenticated JWT.
     *
     * @param {Error} e - Error received from getUnauthenticatedJWT endpoint.
     */
	function handleGetJwtError(e) {
		if (e && e.status && e.status === 401) {
			error("handleGetJwtError", `Unauthorized error caused by JWT expiration. Attempt to get another JWT`, e.status);
			// "Unauthorized" error caused by JWT expiration. Attempt to get another JWT.
			return handleGetUnauthenticatedJwt().catch(err => {
				throw new Error(err);
			});
		}

		throw new Error(`Error retrieving unauthenticated token: ${e}.`);
	}

    /**
     * Returns true if prechat has at least one visible field or if terms and conditions is enabled
     *
     * @returns {boolean}
     */
    function isPrechatStateEnabled() {
		return hasVisiblePrechatFields() || hasTermsAndConditions();
    }

	/**
     * Returns true if configuration has a form of type "PreChat" with at-least 1 field; false otherwise.
     * When pre-chat is disabled in Setup, configuration doesn't include a pre-chat form.
     *
     * @returns {boolean}
     */
    function hasVisiblePrechatFields() {
        const forms = embeddedservice_bootstrap.settings.embeddedServiceConfig.forms || [];
        return forms.some((form) => {
            form.formFields = form.formFields || [];
            return form.formType === "PreChat" && form.formFields.length > 0;
        });
    }

    /**
     * Returns true if terms and conditions is enabled; false otherwise.
     *
     * @returns {boolean}
     */
    function hasTermsAndConditions() {
        const termsAndConditions = embeddedservice_bootstrap.settings.embeddedServiceConfig.termsAndConditions || {};
        return Boolean(termsAndConditions.isTermsAndConditionsEnabled)
    }

	/**
	 * Handle creating a new conversation for this end user. Also handles registering device capabilities if the conversation creation is successful.
	 *
	 * @param prechatFields - Pre-chat data to be sent with the request. Includes visible and/or hidden pre-chat fields
	 * 							based on pre-chat setup.
	 * @returns {Promise<*>} - Promise which is resolved when creatConversation call completes.
	 */
	function handleCreateNewConversation(prechatFields) {
		return createNewConversation(prechatFields)
            .then((conversationResponse) => {
                handleRegisterDeviceCapabilities();
                return conversationResponse;
            }).catch(e => {
                return handleCreateNewConversationError(e, prechatFields);
            });
	}

	/**
	 * Handles createConversation error response. This method does the following -
	 * 1. Retry createConversation once in case of server-side error response (5xx response). OR if error/status code is not defined, happens on gateway timed out.
	 * 2. Throw error in case of all other errors.
	 * @param e - ia-message createConversation error response.
	 * @param prechatFields - Pre-chat data to be sent with the retry request. Includes visible and/or hidden pre-chat fields
	 * 							based on pre-chat setup.
	 * @returns {*} - createConversation request promise.
	 */
	function handleCreateNewConversationError(e, prechatFields) {
		if (!e || !e.status || (e.status >= 500 && e.status <= 599)) {
			// Retry createConversation in case of server-side errors
			error("handleCreateNewConversationError", `Something went wrong while creating a conversation: ${e && e.message ? e.message : e}. Re-trying the request.`, e.status);
			return createNewConversation(prechatFields).then((conversationResponse) => {
				handleRegisterDeviceCapabilities();
				return conversationResponse;
			}).catch(err => {
				error("handleCreateNewConversationError", `Create conversation request failed again: ${err && err.message ? err.message : err}.`, err.status ? err.status : undefined);
				throw err;
			});
		}
		// Throw error in case of other errors.
		error("handleCreateNewConversationError", `Something went wrong while creating a conversation: ${e && e.message ? e.message : e}`);
		throw e;
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
		const endpoint = embeddedservice_bootstrap.settings.scrt2URL.concat(CONVERSATION_PATH);

		return sendRequest(
			endpoint,
			"POST",
			"cors",
			null,
			{
				...(routingAttributes && { routingAttributes }),
				conversationId
			},
			"createNewConversation"
		).then(response => response.json());
	};


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
		const messagingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
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
		).then((response) => {
			const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3); // Read the timeElapsed in seconds and round the value to 3 decimal places.
			log("sendFetchRequest", `${caller} took ${timeElapsed} seconds and returned with the status code ${response.status}`);

			if (response.status === 401) {
				clearWebStorage();
			}
			if (!response.ok) {
				throw response;
			}
			return response;
		});
	};

	/**
	 * Send an HTTP request using fetch with a specified path, method, mode, headers, and body.
	 *
	 * @param {String} apiPath - Endpoint to make request to.
	 * @param {String} method - HTTP request method (POST, GET, DELETE).
	 * @param {String} mode - HTTP mode (cors, no-cors, same-origin, navigate).
	 * @param {Object} requestHeaders - Headers to include with request.
	 * @param {Object} requestBody - Body to include with request. This method stringifies the object passed in, except when
	 *                               uploading a file. For file attachments, request body must be binary data.
	 * @param {string} jwt - (Optional) JWT Token to use. If none provided will look in web storage for one
	 * @returns {Promise}
	 */
	function sendRequest(apiPath, method, mode, requestHeaders, requestBody, caller) {
		const messagingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);

		if (getAuthMode() === AUTH_MODE.AUTH) {
			// Send fetch request if ia-message jwt has not expired.
			if (messagingJwt && validateJwt(messagingJwt)) {
				return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller);
			}

			// If the ia-message JWT has expired, check whether the identity token has expired.
			if (identityToken && validateJwt(identityToken)) {
				// Identity token is still valid, return a pending request promise that's resolved after ia-message JWT is renewed.
				return new Promise(resolve => {
					// Handle ia-message JWT expiry along with the pending request details.
					handleAuthenticatedJwtExpiry({apiPath, method, mode, requestHeaders, requestBody, resolve});
				});
			}

			// Identity token has expired, return a promise that's resolved after a valid token is obtained and the request is executed.
			return new Promise(resolve => {
				// Dispatch event to container to notify that token has expired along with request details and the promise resolver.
				handleIdentityTokenExpiry({apiPath, method, mode, requestHeaders, requestBody, resolve});
			});
		}
		return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller);
	};

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

	/**
	 * Gets the Site URL from In-App Config Service Response.
	 */
	function getSiteURL() {
		try {
			return window.location.origin + "/godwin";
		} catch(err) {
			error("getSiteURL", `Error getting Site URL: ${err}`);
		}
	}

	/**
	 * Parse the Config Service response to get labels data.
	 * @param {string} sectionName - section name of the label.
	 * @param {string} labelName - name of the label.
	 */
	function getLabel(sectionName, labelName) {
		for(const label of embeddedservice_bootstrap.settings.embeddedServiceConfig.customLabels) {
			if(label.sectionName === sectionName && label.labelName === labelName) {
				return label.labelValue || "";
			}
		}
		for(const label of embeddedservice_bootstrap.settings.standardLabels) {
			if(label.sectionName === sectionName && label.labelName === labelName) {
				return label.labelValue || "";
			}
		}
		return "";
	}

	/**
	 * Parse the Config Service response to get branding data.
	 * @param {Object} configServiceResponse - JSON object as a response from In-App Config Service.
	 */
	function handleBrandingData(configServiceResponse) {
		if (configServiceResponse && configServiceResponse.branding) {
			embeddedservice_bootstrap.brandingData = configServiceResponse.branding;
		} else {
			embeddedservice_bootstrap.brandingData = [];
		}
	}

	/**
	 * Returns a branding token value given a specified token name.
	 * @param tokenName
	 * @return {String}
	 */
	function getTokenValueFromBrandingConfig(tokenName) {
		for (const brandingToken of embeddedservice_bootstrap.brandingData) {
			if (brandingToken.n && brandingToken.n === tokenName) {
				return brandingToken.v;
			}
		}
	}

	/**
	 * Returns the custom header color branding token value for button background color.
	 * @return {String}
	 */
	function getButtonColorFromBrandingConfig() {
		return getTokenValueFromBrandingConfig("headerColor");
	}

	/**
	 * Returns the custom secondary color branding token value for focus borders.
	 * @return {String}
	 */
	function getButtonFocusBorderColorFromBrandingConfig() {
		return getTokenValueFromBrandingConfig("secondaryColor");
	}

	/**
	 * Returns the font branding token value for minimized notification area.
	 * @return {String}
	 */
	function getFontFamilyFromBrandingConfig() {
		return getTokenValueFromBrandingConfig("font");
	}

	/**
	 * Set loading status for the button after clicking on it. This is to show the loading status of creating an iframe which would load an aura application.
	 */
	function setLoadingStatusForButton() {
		let button = getEmbeddedMessagingConversationButton();
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.createElement("div");
		let circle;
		let i = 1;

		if(button) {
			// Hide the default chat icon on the button.
			chatIcon.style.display = "none";

			// [Animations] Build loading spinner.
			loadingSpinner.setAttribute("class", EMBEDDED_MESSAGING_LOADING_SPINNER);
			loadingSpinner.setAttribute("id", EMBEDDED_MESSAGING_LOADING_SPINNER);
			for(; i < 13; i++) {
				circle = document.createElement("div");
				circle.setAttribute("class", EMBEDDED_MESSAGING_LOADING_CIRCLE + i + " " + EMBEDDED_MESSAGING_LOADING_CIRCLE);
				loadingSpinner.appendChild(circle);
			}

			loadingSpinner.classList.add(EMBEDDED_MESSAGING_ICON_LOADING);

			// Set loading state for the button.
			button.classList.add(CONVERSATION_BUTTON_LOADING_CLASS);
			// Load the animations for button.
			iconContainer.insertBefore(loadingSpinner, chatIcon);
			button.disabled = true;
		}
	}

	/**
	 * Check if we are on a Desktop (non mobile) based on information in the user agent.
	 * Browsers on tablets behave the same as mobile devices.
	 * @returns {boolean} - True if Desktop, false if Mobile client.
	 */
	function isDesktop() {
		return navigator.userAgent.indexOf("Mobi") === -1;
	}

	/**
	 * Determines whether the user is on iOS device.
	 *
	 * @returns {boolean} True if the user is on iOS Device
	 */
	function isUseriOS() {
		return Boolean(navigator.userAgent.match(/iP(hone|ad|od)/i));
	}

	/**
	 * Check if either static settings is present
	 * OR business hours to determine visibility
	 * OR if its a channel menu deployment
	 * @returns {boolean} True if chat button should be hidden on pageload.
	 */
	function shouldHideChatButtonInInitialState() {
		return (typeof embeddedservice_bootstrap.settings.hideChatButtonOnLoad === "boolean") ? embeddedservice_bootstrap.settings.hideChatButtonOnLoad : isChannelMenuDeployment() || !isWithinBusinessHours();
	}

	/**
	 * Determines whether we are currently within business hours
	 * @returns {boolean} True if within business hours, or business hours is not configured
	 */
	function isWithinBusinessHours() {
		// Interval is empty, then it is ALWAYS in business hours.
		if (!businessHoursInterval) {
			return true;
		}

		const startTime = Number(businessHoursInterval.startTime);
		const endTime = Number(businessHoursInterval.endTime);
		const currentTime = Date.now();

		// Current time is within this interval
		if (currentTime >= startTime && currentTime < endTime) {
			return true;
		}

		// The current time is either before this interval or after.
		return false;
	}

	/**
	 * Set a business hours timer that invoke a callback when crosses business hours interval.
	 */
	function setupBusinessHoursTimer() {
		let targetTime;

		if (!businessHoursInterval) {
			return;
		}

		const isCurrentlyWithinBH = isWithinBusinessHours();

		// Determine which interval to use based on business hours
		// If current time is not within BH, then it is before the first interval
		// Otherwise, it is within a BH interval.
		// If initally outside of business hours fire an event to the host to handle outside of business hours on page load
		if (!isCurrentlyWithinBH) {
			targetTime = Number(businessHoursInterval.startTime);
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME);
		} else {
			targetTime = Number(businessHoursInterval.endTime);
		}

		if (!isNaN(targetTime)) {
			// Clear previous timer, if exists
			if (businessHoursTimer) {
				clearTimeout(businessHoursTimer);
			}

			businessHoursTimer = setTimeout(() => {
				// Clean up this executed timer
				clearTimeout(businessHoursTimer);
				businessHoursTimer = undefined;

				businessHoursTimerCallback(isCurrentlyWithinBH);

				// Fires an event to the host to indicate business hours interval change.
				if (isCurrentlyWithinBH) {
					dispatchEventToHost(ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME);
				} else {
					dispatchEventToHost(ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_STARTED_EVENT_NAME);
				}

			}, (targetTime - Date.now()));
		}
	}

	/**
	 * Callback function for business hours timer, to change the visibility of the chat button.
	 * @param {boolean} wasWithinBusinessHours - If the app was within business hours when the timer was set.
	 */
	function businessHoursTimerCallback(wasWithinBusinessHours) {
		if (wasWithinBusinessHours) {
			// Clean up stale interval
			businessHoursInterval = undefined;

			embeddedservice_bootstrap.utilAPI.hideChatButton();

			// Get more intervals before we set another timer since we were within BH.
			getBusinessHoursInterval().then(setupBusinessHoursTimer());
		} else {
			if (!isChannelMenuDeployment()) {
				embeddedservice_bootstrap.utilAPI.showChatButton();
			}

			// Attempt to set subsequent business hours timer.
			setupBusinessHoursTimer();
		}
	}

	/**
	 * Determines whether the user is on an iOS 15+ Safari browser.
	 *
	 * This is what navigator.userAgent returns for iOS Safari:
	 * 1) Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1
	 * 2) Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit / 605.1.15 (KHTML, like Gecko) Mobile / 15E148
	 *
	 * @return {boolean} Is the user agent on iOS 15+ Safari?
	 */
	function isUseriOS15plusSafari() {
		const iOS = isUseriOS();
		const versionMatchArray = navigator.userAgent.match(/(?!=OS)(([0-9]){2})/i);
		const version = versionMatchArray && versionMatchArray.length > 0 ? Number(versionMatchArray[0]) : -1;
		const safari = Boolean(navigator.userAgent.match(/WebKit/i)) &&
			!Boolean(navigator.userAgent.match(/CriOS/i));
		return iOS && safari && version >= 15;
	}

	/**
	 * Determines whether the user is on Firefox browser.
	 *
	 * @returns {boolean} True if the user is on Firefox browser and False otherwise
	 */
	function isUserFirefox() {
		return navigator.userAgent && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	}

	/**
	 * Determines whether the deployment is a channel menu deployment
	 *
	 * @returns {boolean} True if its a channel menu
	 */
	function isChannelMenuDeployment() {
		// Always throws an error for non-CM MIAW deployments
		try {
			if (embedded_svc && embedded_svc.menu) {
				return true;
			}
			return false;
		} catch (e) {
			return false;
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
	 * Check if web client is being used in a experience site (LWR & Aura)
	 *
	 * @returns {boolean} - return 'true' if we are in a LWR or Aura experience site and false otherwise.
	 */
	function isExperienceSite() {
		return window.LWR !== undefined || pageIsSiteContext();
	}

	/**
	 * Sets viewport meta content back to the original value
	 *
	 */
	function restoreViewportMetaTag() {
		const viewportMetaTag = getViewportMetaTag();

		if (viewportMetaTag) {
			viewportMetaTag.setAttribute("content", originalViewportMetaTag);
			originalViewportMetaTag = undefined;

		}
	}

	/**
	 * Send a post message to the LWR App iframe window. If the frame is not ready, wait for it.
	 *
	 * @param {String} method - Name of method.
	 * @param {Object} data - Data to send with message. Only included in post message if data is defined.
	 */
	function sendPostMessageToAppIframe(method, data) {
		lwrIframeReadyPromise.then(() => {
			const iframe = getEmbeddedMessagingFrame();

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
				warning(`Embedded Messaging iframe not available for post message with method ${method}.`);
			}
		});
	}

	/**
	 * Send a post message to the LWR App iframe window. If the frame is not ready, wait for it.
	 *
	 * @param {String} method - Name of method.
	 * @param {Object} data - Data to send with message. Only included in post message if data is defined.
	 */
	function sendPostMessageToSiteContextIframe(method, data) {
		siteContextReadyPromise.then(() => {
			const iframe = embeddedservice_bootstrap.siteContextFrame;

			if(typeof method !== "string") {
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
				warning(`Embedded Messaging iframe not available for post message with method ${method}.`);
			}
		});
	}

	/**
	 * Handles Aura site endpoint. Sets iframe.src and logs success message on iframe load.
	 * TODO W-10165756 - Remove support for aura sites & the aura app.
	 * @param iframe - iframe element
	 */
	function handleAuraSite(iframe) {
		if(!iframe) {
			error("handleAuraSite", `Failed to load aura app. Iframe is undefined.`);
		}

		iframe.src = getSiteURL() + "/embeddedService/embeddedService.app";
	}

	/**
	 * Handles LWR site endpoint. Sets iframe.src and updates FAB and iframe styling on site load.
	 * @param iframe - iframe element
	 */
	function handleLWRSite(iframe) {
		let siteURL = getSiteURL();

		if(!iframe) {
			error("handleLWRSite", `Failed to load LWR site. Iframe is undefined.`);
		}

		// Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
		if(!siteURL.endsWith("/")) siteURL += "/";

		iframe.src = siteURL + "?lwc.mode=" + (embeddedservice_bootstrap.settings.devMode ? "dev" : "prod");
	}

	/**
	 * Handle the click action on the conversation button.
	 * If the button is in its initial state and iframe hasn't been loaded, initialize the conversation state and create the iframes.
	 * If iframe has already been loaded and the modal is maximized, minimize the client.
	 *
	 * In all other cases, throw a generic error indicating something went wrong.
	 */
	function handleClick() {
		return new Promise((resolve, reject) => {
			try {
				let button = getEmbeddedMessagingConversationButton();
				let frame = getEmbeddedMessagingFrame();

				// eslint-disable-next-line no-negated-condition
				if(button && !button.classList.contains(CONVERSATION_BUTTON_LOADED_CLASS)) {
					// Change the button to a loading icon.
					setLoadingStatusForButton();

					log("handleClick", `Conversation button clicked`);

					// Create iframes and load app.
					generateIframes().then(() => {
						resolve();
					}).catch((err) => {
						error("handleClick", err.message);
						reject(err);
					});

					// Initialize conversation state and fetch messaging JWTs.
					initializeConversationState().catch((err) => {
						emitEmbeddedMessagingInitErrorEvent();
						error("handleClick", err.message);
						reject(err);
					});
				} else if((button && button.classList.contains(CONVERSATION_BUTTON_LOADED_CLASS)) && (frame && frame.classList && frame.classList.contains(MODAL_ISMAXIMIZED_CLASS))) {
					// Minimize the chat if it is already maximized.
					sendPostMessageToAppIframe(APP_MINIMIZE_EVENT_NAME);
				} else {
					error("handleClick", `Something went wrong handling button click event.`);
				}
			} catch(e) {
				reject(e);
			}
		});

	}

	/**
	 * Handles key down events on static chat button on parent page.
	 * @param evt
	 */
	function handleKeyDown(evt) {
		let frame = getEmbeddedMessagingFrame();

		if (evt && evt.key) {
			if (evt.key === KEY_CODES.SPACE || evt.key === KEY_CODES.ENTER) {
				evt.preventDefault();
				// SPACE or ENTER fires onclick handler for the button.
				handleClick();
			} else if (evt.key === KEY_CODES.TAB && evt.shiftKey) {
				if (frame && frame.classList && frame.classList.contains(MODAL_ISMAXIMIZED_CLASS)) {
					// SHIFT + TAB: Trap focus to last element in client.
					evt.preventDefault();
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_FOCUS_ON_LAST_FOCUSABLE_ELEMENT_EVENT_NAME);
				}
			}
		}
	}

	/**
	 * Handles notification area dismiss button click.
	 */
	function handleNotificationDimissButtonClick() {
		const notificationArea = document.getElementById(MINIMIZED_NOTIFICATION_AREA_CLASS);
		const button = getEmbeddedMessagingConversationButton();

		// Removes the notification area.
		if (notificationArea) {
			notificationArea.parentNode.removeChild(notificationArea);
		}
		// Move focus to minimized button in minimized state.
		if (button) {
			button.focus();
		}
	}

	/**
	 * Handles notification area dismiss button key down.
	 * @param evt
	 */
	function handleDimissButtonKeyDown(evt) {
		if (evt.key === KEY_CODES.ENTER || evt.key === KEY_CODES.SPACE) {
            // ENTER or SPACE dismisses the minimized notification
            evt.preventDefault();
            this.handleNotificationDimissButtonClick();
        }
	}

	/**
	 * Returns true if there is an existing session (i.e. JWT exists in web storage).
	 */
	function sessionExists() {
		return Boolean(getItemInWebStorageByKey(STORAGE_KEYS.JWT));
	}

	/**
	 * If Web Storage is available, check if there's an existing session to show.
	 */
	function bootstrapExistingSession() {
		let existingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
		if (existingJwt) {
			// Change the button to a loading icon.
			setLoadingStatusForButton();

			// Create iframes and load app.
			generateIframes().catch(error);

			// Fetch a continuity jwt, load the conversation & send config data to app.
			return handleGetContinuityJwt().then((jwtData) => {
				handleListConversation(true).then((conversationData) => {
					sendConfigurationToAppIframe(jwtData, conversationData);
				});
			})
			.catch(error);
		}
	}

	/**
	 * Handle updates to FAB and Iframe after app loaded event is received from container with the aura app
	 * OR after a LWR site is loaded.
	 */
	function handleAfterAppLoad() {
		let button = getEmbeddedMessagingConversationButton();
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.getElementById(EMBEDDED_MESSAGING_LOADING_SPINNER);
		let iframe = getEmbeddedMessagingFrame();

		if(!iframe) {
			warning("Embedded Messaging iframe not available for post-app-load updates.");
		}

		if(!button) {
			warning("Embedded Messaging static button not available for post-app-load updates.");
		} else {
			// Reset the Conversation button once the aura application is loaded in the iframe. Ifame/Chat window is rendered on top of FAB.
			if (iconContainer && loadingSpinner) {
				iconContainer.removeChild(loadingSpinner);
			}

			if (chatIcon) {
				chatIcon.style.display = "none";
			}

			button.disabled = false;
			button.classList.remove(CONVERSATION_BUTTON_LOADING_CLASS);
			button.classList.add(CONVERSATION_BUTTON_LOADED_CLASS);
			button.classList.add("no-hover");
		}

		// Send any unsent pending logs from bootstrap to container, once the app/container is finished loading.
		resolveAppLoaded();
		handleInitializationSuccess();
	}

	/**
	 * Handles initialization success from the components.
	 * See container.js#finishInitialization.
	 */
	function handleInitializationSuccess() {
		emitEmbeddedMessagingInitSuccessEvent();
	}

	/**
	 * Handles initialization error from the components.
	 * See container.js#beginInitialization.
	 */
	function handleInitializationError() {
		emitEmbeddedMessagingInitErrorEvent();
	}

	/**
	 * Cleanup after closing the client, i.e after closing a conversation in Unauth mode OR
	 * clearing the user session in Auth mode.
	 * This method resets the client to the initial state (State Zero) for Auth/Unauth modes.
	 * @param isSecondaryTab - Whether we are trying to reset the client to initial state in a secondary tab. Only used by Auth mode.
	*/
	function resetClientToInitialState(isSecondaryTab) {
		try {
			// Clear existing items stored in current conversation
			clearWebStorage(isSecondaryTab);
			// Clear existing items stored in current conversation from in-memory
			clearInMemoryData();
			// Re-init web storage, for subsequent conversations
			initializeWebStorage();
		} catch(err) {
			error("resetClientToInitialState", `Error on clearing web storage for the previously ended conversation: ${err}`);
		}

		// Resolve clearSession() promise, for both Auth and UnAuth (W-12338093) mode.
		resolveClearSessionPromise();

		// [iOS Devices] Restore the meta viewport tag to its original value
		if (originalViewportMetaTag) {
			restoreViewportMetaTag();
		}

		// Remove markup from the page.
		embeddedservice_bootstrap.removeMarkup();

		// Regenerate markup if we are in unverified user mode.
		if (getAuthMode() === AUTH_MODE.UNAUTH) {
			embeddedservice_bootstrap.generateMarkup();	
		}
		log("resetClientToInitialState", `Client reset to initial state`);
	}


	/**
	 * Remove all markup from the page.
	 * @param {Boolean} isExperienceSiteContext - Indicates whether we are in the experience site context.
	 */
	EmbeddedServiceBootstrap.prototype.removeMarkup = function removeMarkup(isExperienceSiteContext) {
		const iframe = getEmbeddedMessagingFrame();
		const button = getEmbeddedMessagingConversationButton();
		const modal = getEmbeddedMessagingModal();
		const minimizedNotification = document.getElementById(MINIMIZED_NOTIFICATION_AREA_CLASS);
		const topContainer = getEmbeddedMessagingTopContainer();

		if(iframe) {
			// Remove the iframe from DOM. This should take care of clearing Conversation Entries as well.
			iframe.parentNode.removeChild(iframe);
		} else {
			warning("Embedded Messaging iframe not available for resetting the client to initial state.");
		}

		if(embeddedservice_bootstrap.filePreviewFrame && embeddedservice_bootstrap.filePreviewFrame.parentNode) {
			// Remove the file preview iframe from DOM.
			embeddedservice_bootstrap.filePreviewFrame.parentNode.removeChild(embeddedservice_bootstrap.filePreviewFrame);
		} else {
			warning("Embedded Messaging file preview iframe not available for resetting the client to initial state.");
		}

		if(Boolean(isExperienceSiteContext) && embeddedservice_bootstrap.siteContextFrame && embeddedservice_bootstrap.siteContextFrame.parentNode) {
			// Remove the site context iframe from DOM if we are in experience site context.
			embeddedservice_bootstrap.siteContextFrame.parentNode.removeChild(embeddedservice_bootstrap.siteContextFrame);
		} else {
			warning("Embedded Messaging site context iframe not available for resetting the client to initial state.");
		}

		if (modal) {
			// [Mobile] Remove the background modal overlay from the DOM.
			modal.parentNode.removeChild(modal);
		}

		if (document.body.classList.contains(PREVENT_SCROLLING_CLASS)) {
			// [Mobile] Remove class that prevents background clicking and scrolling.
			// Restore document body's scroll position only for mobile devices
			document.body.classList.remove(PREVENT_SCROLLING_CLASS);
			if (embeddedservice_bootstrap.documentScrollPosition) {
				window.scrollTo(0, embeddedservice_bootstrap.documentScrollPosition);
			}
		}

		if (button) {
			// Remove button from DOM.
			button.parentNode.removeChild(button);
		} else {
			warning("Embedded Messaging static button not available for resetting the client to initial state.");
		}

		// Remove the minimized notification area if exists.
		if (minimizedNotification) {
			minimizedNotification.parentNode.removeChild(minimizedNotification);
		}

		// Remove the top container element.
		if (topContainer) {
			topContainer.parentNode.removeChild(topContainer);
		}

		// Emit onEmbeddedMessagingReady event again after resetting the client to initial state for subsequent conversations/sessions.
		embeddedservice_bootstrap.emitEmbeddedMessagingReadyEvent();
	}

	/***************************
	 Markup generation functions
	 ***************************/
	/**
	 * Generate markup for the top-level container element on the parent page.
	 * @return {HTMLElement}
	 */
	function createTopContainer() {
		const topContainerElement = document.createElement("div");

		topContainerElement.id = TOP_CONTAINER_NAME;
		topContainerElement.className = TOP_CONTAINER_NAME;

		return topContainerElement;
	}

	/**
	 * Generate markup for the static conversation button's icon.
	 * @return {HTMLElement}
	 */
	function createConversationButtonIcon() {
		if (!hasConversationButtonColorContrastMetA11yThreshold()) {
            setConversationButtonIconColor();
        }

		const buttonIconWrapper = document.createElement("div");
		const buttonIconElement = renderSVG(DEFAULT_ICONS.CHAT);

		buttonIconElement.setAttribute("id", EMBEDDED_MESSAGING_ICON_CHAT);
		buttonIconElement.setAttribute("class", EMBEDDED_MESSAGING_ICON_CHAT);

		buttonIconWrapper.id = EMBEDDED_MESSAGING_ICON_CONTAINER;
		buttonIconWrapper.className = EMBEDDED_MESSAGING_ICON_CONTAINER;

		buttonIconWrapper.appendChild(buttonIconElement);

		return buttonIconWrapper;
	}

	/**
	 * Generate markup for the static conversation button.
	 * @return {HTMLElement}
	 */
	function createConversationButton() {
		const buttonWrapper = document.createElement("div");
		const buttonElement = document.createElement("button");
		const buttonIcon = createConversationButtonIcon();

		buttonWrapper.className = CONVERSATION_BUTTON_WRAPPER_CLASS;
		buttonElement.classList.add(CONVERSATION_BUTTON_CLASS);
		buttonElement.id = CONVERSATION_BUTTON_CLASS;
		buttonElement.href = "javascript:void(0)";

		// Click event handler for the conversation button.
		buttonElement.addEventListener("click", handleClick);
		buttonElement.addEventListener("keydown", handleKeyDown);

		// [A11Y] Button is focusable when initially loaded.
		buttonElement.setAttribute("tabindex", 0);

		// [A11Y] Accessible name
		buttonElement.setAttribute("role", "button");
		buttonElement.setAttribute("aria-label", getLabel("EmbeddedMessagingMinimizedState", "DefaultMinimizedText") || CONVERSATION_BUTTON_DEFAULT_ASSISTIVE_TEXT);

		// [A11Y] Assistive text
		buttonElement.setAttribute("title", getLabel("EmbeddedMessagingMinimizedState", "DefaultMinimizedText") || CONVERSATION_BUTTON_DEFAULT_ASSISTIVE_TEXT);

		// Update the color of FAB to match the color of Chat Header, i.e. --headerColor branding token from setup.
		buttonElement.style.setProperty("--eswHeaderColor", getButtonColorFromBrandingConfig());
		// Update the focus border color to match the Secondary Color, i.e. --secondaryColor branding token from setup.
		buttonElement.style.setProperty("--eswSecondaryColor", getButtonFocusBorderColorFromBrandingConfig());

		// Adjust button height if browser has bottom tab bar.
		if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
			buttonElement.classList.add(CONVERSATION_BUTTON_BOTTOM_TAB_BAR_CLASS);
		}

		// Check if the chat button should be hidden in initial state.
		if (shouldHideChatButtonInInitialState() && !sessionExists()) {
			buttonElement.style.display = "none";
		}

		// Set HTML direction based on language
		if (embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection && typeof embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection === "string") {
			buttonElement.setAttribute("dir", embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection.toLowerCase());
		}

		// Check if it is on experience site
		if (isExperienceSite()) {
			buttonElement.classList.add(EXPERIENCE_SITE);
		}

		// Construct the static conversation button.
		buttonElement.appendChild(buttonIcon);
		buttonWrapper.appendChild(buttonElement);

		return buttonWrapper;
	}

	/**
	 * Generates markup for the background overlay (for modal view displayed on mobile only).
	 * @return {HTMLElement}
	 */
	function createBackgroundModalOverlay() {
		const modal = document.createElement("div");

		modal.id = BACKGROUND_MODAL_ID;

		return modal;
	}

	/**
	 * Generates markup for the minimized notification area element.
	 * @returns {HTMLElement}
	 */
	function createMinimizedNotifaction() {
		const notificationElement = document.createElement("div");
		const notificationTextWrapperElement = document.createElement("div");
		const notificationTextElement = document.createElement("span");
		const notificationAssistiveTextElement = document.createElement("span");
		const notificationDismissButton = createMinimizedNotificationDimissButton();

		notificationElement.id = MINIMIZED_NOTIFICATION_AREA_CLASS;
		notificationElement.className = MINIMIZED_NOTIFICATION_AREA_CLASS;

		notificationTextWrapperElement.className = MINIMIZED_NOTIFICATION_AREA_TEXT_WRAPPER_CLASS;

		notificationTextElement.className = MINIMIZED_NOTIFICATION_AREA_TEXT_CLASS;
		notificationTextElement.role = "status";
		notificationTextElement.title = getLabel("EmbeddedMessagingMinimizedState", "JWTRetrievalFailureText") || MINIMIZED_NOTIFICATION_AREA_DEFAULT_TEXT;
		notificationTextElement.innerHTML = getLabel("EmbeddedMessagingMinimizedState", "JWTRetrievalFailureText") || MINIMIZED_NOTIFICATION_AREA_DEFAULT_TEXT;
		notificationTextElement.style.setProperty("font-family", getFontFamilyFromBrandingConfig());

		notificationAssistiveTextElement.className = SLDS_ASSISTIVE_TEXT;
		notificationAssistiveTextElement.innerHTML = getLabel("EmbeddedMessagingMinimizedState", "MinimizedNotificationAssistiveText") || MINIMIZED_NOTIFICATION_AREA_DEFAULT_ASSISTIVE_TEXT;

		notificationTextWrapperElement.appendChild(notificationTextElement);
		notificationTextWrapperElement.appendChild(notificationAssistiveTextElement);
		notificationElement.appendChild(notificationTextWrapperElement);
		notificationElement.appendChild(notificationDismissButton);

		return notificationElement;
	}

	/**
	 * Generates markup for the minimized notification area dismiss button element.
	 * @returns {HTMLElement}
	 */
	function createMinimizedNotificationDimissButton() {
		const buttonElement = document.createElement("button");
		const buttonTextElement = document.createElement("span");
		const buttonAssistiveTextElement = document.createElement("span");

		buttonElement.className = MINIMIZED_NOTIFICATION_DISMISS_BTN_CLASS;
		buttonElement.addEventListener("click", handleNotificationDimissButtonClick);
		buttonElement.addEventListener("keydown", handleDimissButtonKeyDown);
		buttonElement.setAttribute("aria-describedby", MINIMIZED_NOTIFICATION_DISMISS_BTN_ID);

		buttonTextElement.className = MINIMIZED_NOTIFICATION_DISMISS_BTN_TEXT_CLASS;
		buttonTextElement.title = getLabel("EmbeddedMessagingMinimizedState", "NotificationDismissButtonText") || MINIMIZED_NOTIFICATION_DISMISS_BTN_DEFAULT_TEXT;
		buttonTextElement.innerHTML = getLabel("EmbeddedMessagingMinimizedState", "NotificationDismissButtonText") || MINIMIZED_NOTIFICATION_DISMISS_BTN_DEFAULT_TEXT;
		buttonTextElement.style.setProperty("font-family", getFontFamilyFromBrandingConfig());
		buttonAssistiveTextElement.className = SLDS_ASSISTIVE_TEXT;
		buttonAssistiveTextElement.id = MINIMIZED_NOTIFICATION_DISMISS_BTN_ID;
		buttonAssistiveTextElement.innerHTML = getLabel("EmbeddedMessagingMinimizedState", "MinimizedNotificationDismissButtonAssistiveText") || MINIMIZED_NOTIFICATION_DISMISS_BTN_DEFAULT_ASSISTIVE_TEXT;

		buttonElement.appendChild(buttonTextElement);
		buttonElement.appendChild(buttonAssistiveTextElement);

		return buttonElement;
	}

	/**
	 * Processes embedded messaging logs generated from bootstrap.js. When a log is generated,
	 * 1. it is directly sent to the container via postMessage if the container has finished initialization or kept in-memory otherwise.
	 * 2. reset in-memory storage if log(s) are sent to the container
	 *
	 * @param {object} currentStateLogObj - a standard/current state log object generated from a log statement in bootstrap, for a change of event
	 * @param {object} errorLogObj - an error log object generated from an error statement in bootstrap, for an encountered error
	 */
	function processEmbeddedMessagingLogs(currentStateLogObj, errorLogObj) {
		currentStateLogObj && embeddedMessagingLogs.currentStateLogs.push(currentStateLogObj);
		errorLogObj && embeddedMessagingLogs.errorLogs.push(errorLogObj);

		appLoadedPromise.then(() => {
			sendPostMessageToAppIframe(EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS, {pendingLogs: embeddedMessagingLogs});
			cleanUpEmbeddedMessagingLogs();
		});
	}

	/**
	 * Logs web storage items (top level keys) during initialization.
	 */
	function logWebStorageItemsOnInit() {
		let localStorageObjects = [];
		let sessionStorageObjects = [];

		if (embeddedservice_bootstrap.isLocalStorageAvailable) {
			localStorageObjects = Object.keys(JSON.parse(localStorage.getItem(storageKey)));
			log("logWebStorageItemsOnInit", `Local storage items on init: ${localStorageObjects}`);
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable) {
			sessionStorageObjects = Object.keys(JSON.parse(sessionStorage.getItem(storageKey)));
			log("logWebStorageItemsOnInit", `Session storage items on init: ${sessionStorageObjects}`);
		}
	}

	/**
	 * Clean up logs generated from bootsrap.js in-memory.
	 */
	function cleanUpEmbeddedMessagingLogs() {
		embeddedMessagingLogs = {currentStateLogs: [], errorLogs: []};
	}

	/*************************************************************
	*		Embedded Messaging User Verification Public API      *
	**************************************************************/
	/**
	 * Parameters for the identity token data object passed in via
	 * embeddedservice_bootstrap.userVerificationAPI.setIdentityToken API call.
	 */
	const IDENTITY_TOKEN_PARAM = {
		ID_TOKEN_TYPE: "identityTokenType",
		ID_TOKEN: "identityToken"
	};

	/**
	 * The authorization mode values for the deployment.
	 */
	const AUTH_MODE = {
		AUTH: "Auth",
		UNAUTH: "UnAuth"
	}

	/**
	 * Embedded Messaging User Verification exposed in window.embeddedservice_bootstrap.userVerificationAPI
	 * for managing authorized conversation sessions.
	 * @class
	 */
	function EmbeddedMessagingUserVerification() {}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * User verification API method for setting the identity token used to authorize the end user's session.
	 * This API is used to set the initial identity token as well as any subsequent tokens generated by the customer
	 * to extend the end user's session.
	 *
	 * For 242, only JWT-based identity tokens are accepted.
	 * @param {Object} identityTokenData - The customer-supplied identity token data object.
	 * Per the user verification contract, the object contains the following fields:
	 * 		- {String} identityTokenType : the verification scheme of the identity token.
	 *      - {Object} identityToken : the identity token used to authorize the user session.
	 * @return {Boolean} true if identity token provided is valid and false otherwise.
	 */
	EmbeddedMessagingUserVerification.prototype.setIdentityToken = function setIdentityToken(identityTokenData) {
		let identityTokenType;
		let token;

		// Cannot be invoked before `afterInit` event has been emitted.
		if (!hasEmbeddedMessagingReadyEventFired) {
			error("setIdentityToken", `Method can’t be invoked before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		// Check whether we are in authorization mode.
		if (getAuthMode() !== AUTH_MODE.AUTH) {
			error("setIdentityToken", `User Verification isn’t enabled in Messaging Settings.`);
			return false;
		}

		// Perform validation on the identity token data supplied.
		if (!validateIdentityTokenData(identityTokenData)) {
			error("setIdentityToken", `Invalid identity token parameter passed into the setIdentityToken method. Specify a valid object containing the token data.`);
			return false;
		}

		// Set the identityTokenType and token fields.
		identityTokenType = identityTokenData[IDENTITY_TOKEN_PARAM.ID_TOKEN_TYPE];
		token = identityTokenData[IDENTITY_TOKEN_PARAM.ID_TOKEN];

		// Only JWT-based identity tokens are supported in 242.
		if (typeof identityTokenType !== "string" || identityTokenType.trim().toUpperCase() !== ID_TOKEN_TYPE.JWT) {
			error("setIdentityToken", `Unsupported identity token. Only JWT-based identity tokens are supported.`);
			return false;
		}

		// Perform validation on the identity token received.
		if (!validateIdentityToken(identityTokenType, token)) {
			error("setIdentityToken", `Invalid identity token passed into the setIdentityToken method.`);
			return false;
		}

		// Store (or replace existing) customer identity token in memory.
		identityToken = token;

		// Resolve setIdentityTokenPromise created while handling identity token expiry.
		if (setIdentityTokenResolve && typeof setIdentityTokenResolve === "function") {
			setIdentityTokenResolve();
			setIdentityTokenResolve = undefined;
		}

		if (getEmbeddedMessagingFrame()) {
			// If iframe is initialized, replace the identity token passed down during initialization.
			sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME, identityToken);
		} else if (!getEmbeddedMessagingConversationButton()) {	
			// Render conversation button if identity token passes basic validation.
			embeddedservice_bootstrap.generateMarkup();
		} else if (getEmbeddedMessagingConversationButton() && document.getElementById(EMBEDDED_MESSAGING_ICON_REFRESH)) {
			// Remove existing markup on the page if we're in error state before regenerating the button markup.
			embeddedservice_bootstrap.removeMarkup();
			embeddedservice_bootstrap.generateMarkup();
		}

		return true;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * User verification API method for clearing the current user's session.
	 * Per the user verification contract, the customer is responsible for invoking this API method when the end-user
	 * logs out of the current session.
	 *
	 * NOTE: W-12338093 - This API is also extended to UnAuth mode. In UnAuth mode, clearSession will close the current
	 * 					  conversation (if it's active) and reset the client to the initial state (in the same tab).
	 *
	 * @return {Promise} - Promise that resolves after a session is successfully cleared OR is rejected with relevant error message.
	 */
	EmbeddedMessagingUserVerification.prototype.clearSession = function clearSession() {
		return new Promise((resolve, reject) => {
			clearUserSessionPromiseResolve = resolve;

			// Cannot be invoked before `afterInit` event has been emitted.
			if (!hasEmbeddedMessagingReadyEventFired) {
				reject(`Method can't be invoked before the onEmbeddedMessagingReady event is fired.`);
				error("clearSession", `Method cannot be invoked before the onEmbeddedMessagingReady event is fired.`);
				return;
			}

			// Revoke JWT only for Auth mode.
			handleClearUserSession(getAuthMode() === AUTH_MODE.AUTH, false);
		});
	}

	/**
	 * Clear user session in the same tab/window.
	 * This method is called by -
	 * 1. embeddedservice_bootstrap.userVerificationAPI.clearSession() API to clear user session in primary tab.
	 * 2. Storage event handler to clear user session across secondary tabs (Auth mode only).
	 * @param shouldRevokeJwt - Whether to revoke the ia-message jwt.
	 * @param isSecondaryTab - Whether we are trying to clear user session in a secondary tab.
	 * 						   To clear a user session,
	 * 						   in primary tab - use the clearSession() API.
	 * 						   in secondary tab - use storage event handlers.
	 */
	function handleClearUserSession(shouldRevokeJwt, isSecondaryTab) {
		const iframe = getEmbeddedMessagingFrame();
		if (iframe) {
			sendPostMessageToAppIframe(EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME, shouldRevokeJwt);
		} else {
			resetClientToInitialState(isSecondaryTab);
		}
	}

	/**
	 * Handles authenticated JWT expiry.
	 *
	 * @param eventData - Data containing details about the pending request along with it's resolver function.
	 */
	function handleAuthenticatedJwtExpiry(pendingRequest) {
		if (pendingRequest) {
			renewAuthenticatedJwt(pendingRequest);
		}
	}

	/**
	 * Renews authenticated JWT. This method does the following -
	 * 1. Renew authenticated jwt.
	 * 2. Set the renewed JWT on inAppService lib and in web storage (1P and 3P).
	 * 3. Reconnect to the SSE with the renewed JWT.
	 * 4. Handle pending ia-message requests generated while JWT was being renewed.
	 *
	 * @param pendingRequestQueue - Queues that stores pending requests generated during renewal.
	 * @returns {Promise<unknown>}
	 */
	function renewAuthenticatedJwt(pendingRequest) {
		return new Promise(resolve => {
			log("renewAuthenticatedJwt", `Renewing Authenticated JWT`);
            handleGetAuthenticatedJwt().then(() => {
                handlePendingRequest(pendingRequest);
                resolve();
            });
        });
	}

	/**
	 * Handles pending ia-message request. A request is marked as pending while we renew the authenticated JWT and re-connect to the SSE.
	 *
	 * @param pendingRequest - Pending request details. Request should include a resolver function (generated by messagingService).
	 *                         Request is resolved after we have finished renewing the JWT and re-connecting to the SSE.

	 */
	function handlePendingRequest(pendingRequest) {
		if (pendingRequest) {
			sendFetchRequest(
				pendingRequest.apiPath,
				pendingRequest.method,
				pendingRequest.mode,
				pendingRequest.requestHeaders,
				pendingRequest.requestBody
			).then(response => {
				if (pendingRequest.resolve && typeof pendingRequest.resolve === "function") {
					pendingRequest.resolve(response);
				}
			}).catch(err => {
				throw err;
			});
		}
	}

	/**
	 * Handles customer identity token expiry. This method does the following -
	 * 1. Notifies parent page about token expiry and waits for a valid token.
	 * 2. Enqueues ia-message requests generated while waiting.
	 * 3. If token is provided (before timeout), this method -
	 *      a. Renews authenticated JWT
	 *      b. Re-connects to the SSE
	 *      c. Execute pending requests.
	 * 4. If timeout occurs, clears the messaging session on all tabs.
	 */
	function handleIdentityTokenExpiry(pendingRequest) {
		if (!pendingRequest) {
			return;
		}

		dispatchEventToHost(ON_EMBEDDED_MESSAGING_ID_TOKEN_EXPIRED_EVENT_NAME);

		// Promise to be resolved when a new valid token is supplied by the host page.
		const setIdentityTokenPromise = new Promise((resolve) => {
			setIdentityTokenResolve = resolve;
		});
		// Apply timeout for waiting on a new token.
		const setIdentityTokenPromiseTimeout = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject();
			}, SET_IDENTITY_TOKEN_TIMEOUT_IN_MS);
		});
		// Promise returned by Promise.race is resolved if a valid token is received before timeout, else it's rejected.
		Promise.race([setIdentityTokenPromise, setIdentityTokenPromiseTimeout])
			.then(() => {
				log("handleIdentityTokenExpiry", `Valid identity token found. Fetch authenticated JWT.`);
				// Process pending request(s).
				if (pendingRequest.apiPath.includes(ACCESS_TOKEN_PATH)) {
					// Handle authenticated JWT request separately, because we only need to fetch the JWT in this case.
					// This request is generated on button click with an expired token.
					// Set new token before fetching authenticated JWT.
					pendingRequest.requestBody.customerIdentityToken = identityToken;
					handlePendingRequest(pendingRequest);
				} else {
					// Handle other requests (i.e, not that ACCESS_TOKEN_PATH request).
					// Renew authenticate JWT before executing pending requests.
					renewAuthenticatedJwt(pendingRequest);
				}
			})
			.catch(() => {
				error("handleIdentityTokenExpiry", `Failed to fetch authenticated JWT due to setIdentityToken timeout or other error. Clearing the messaging session on all tabs.`);
				handleClearUserSession(false, false);
			});
	}

	/**
	 * Handle customer identity token expired event from app iframe. This method does the following -
	 * 1. Check whether User Verification is enabled.
	 * 2. If enabled, dispatch "onEmbeddedMessagingIdentityTokenExpired" event to notify the customer that their token has expired.
	 */
	function handleIdentityTokenExpiredEvent() {
		if (getAuthMode() !== AUTH_MODE.AUTH) {
			warning(`handleIdentityTokenExpiredEvent method called but User Verification isn’t enabled in Messaging Settings.`);
			return;
		}
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_ID_TOKEN_EXPIRED_EVENT_NAME);
	}

	/**
	 * Handle the scenario where the client failed to retrieve an authenticated jwt or renew a jwt.
	 */
	function handleJwtRetrievalFailure() {
		let button;
		let chatIcon;
		let iconContainer;
		let refreshIcon;
		let minimizedNotification;

		// Handle client reset and surface error state only in the primary tab.
		// In clearing the web storage, this should trigger user session clearing in secondary tabs.
		resetClientToInitialState(false);

		// Generate markup for button.
		embeddedservice_bootstrap.generateMarkup();

		// Use selectors to find DOM elements.
		button = getEmbeddedMessagingConversationButton();
		chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);

		if(button) {
			// Static button is displayed under client when maximized.
			button.style.display = "block";

			// [A11Y] Button is not focusable when maximized.
			button.setAttribute("tabindex", -1);
			button.style.setProperty("cursor", "default");
			button.classList.add("no-hover");

			// Remove the chat icon from the icon container.
			if (iconContainer && chatIcon) {
				iconContainer.removeChild(chatIcon);
			}

			// Create the minimize button markup and insert into the DOM.
			refreshIcon = renderSVG(DEFAULT_ICONS.REFRESH);
			refreshIcon.setAttribute("id", EMBEDDED_MESSAGING_ICON_REFRESH);
			refreshIcon.setAttribute("class", EMBEDDED_MESSAGING_ICON_REFRESH);
			iconContainer.appendChild(refreshIcon);

			minimizedNotification = createMinimizedNotifaction();

			button.disabled = true;

			embeddedservice_bootstrap.settings.targetElement.appendChild(minimizedNotification);
		}
	}

	/**
	 * Validation method for customer supplied identity token data to the setIdentityToken call.
	 * @param {Object} identityTokenData - The identity token data parameter to be validated.
	 * @returns true if identity token data parameter is well formed and false otherwise.
	 */
	function validateIdentityTokenData(identityTokenData) {
		return identityTokenData && identityTokenData !== null && typeof identityTokenData === "object";
	}

	/**
	 * Validation method for customer supplied identity token.
	 * For 242, the only verification scheme supported is JWT-based verification.
	 * @param {Object} identityToken
	 * @returns true if identity token is valid and false otherwise.
	 */
	function validateIdentityToken(identityTokenType, identityToken) {
		let isValid = false;

		switch(identityTokenType) {
			case ID_TOKEN_TYPE.JWT:
				isValid = validateJwt(identityToken);
				break;
			default:
				break;
		}
		return isValid;
	}

	/**
	 * Method for parsing JWT and extracting the JSON payload.
	 * @param {Object} jwt - The JWT to be parsed.
	 * @returns JSON payload of the jwt
	 */
	function parseJwt(jwt) {
		// Split out the payload from the header
		var base64Url = jwt.split('.')[1];
		// Convert base64Url string to base64
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		// Decode base64 payload
		var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}

	/**
	 * Validation method for identity token of type JWT.
	 * @param {*} jwt - The JWT to be validated.
	 * @returns true if JWT is valid and false otherwise.
	 */
	function validateJwt(jwt) {
		let jwtPayload;
		let isValid;

		try {
			// Extract JWT payload.
			jwtPayload = parseJwt(jwt);

			// Validate that the JWT has not expired.
			// Per RFC 7519, a JWT is valid if the current time (in seconds) is before
			// the `exp` claim value.
			// See: https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4
			isValid = Math.floor(Date.now()/1000) < jwtPayload.exp;

			// Log JWT expiry to console if devMode is on and JWT has expired.
			if (Boolean(embeddedservice_bootstrap.settings.devMode) && !isValid) {
				log("validateJwt", `JWT has expired at ${(new Date(jwtPayload.exp * 1000)).toString()}`);
			}

			return isValid;
		} catch (e) {
			if (Boolean(embeddedservice_bootstrap.settings.devMode)) {
				error("validateJwt", `JWT validation failed: ${e.message}`);
			}
			return false;
		}
	}

	/**
	 * Helper function for determining the authorization mode set in Messaging Channel configuration.
	 *
	 * @returns {String} The authorization mode ("Auth" / "UnAuth").
	 */
	function getAuthMode() {
		let authMode = null;

		try {
			authMode = embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode;
		} catch (e) {
			error("getAuthMode", `Failed to retrieve auth mode flag: ${e.message}`);
		}
		return authMode;
	}

	/**
	 * Helper function to resolve the promise returned by embeddedservice_bootstrap.userVerificationAPI.clearSession(), if it exists.
	 */
	function resolveClearSessionPromise() {
		if (clearUserSessionPromiseResolve && typeof clearUserSessionPromiseResolve === "function") {
			clearUserSessionPromiseResolve();
			clearUserSessionPromiseResolve = undefined;
		}
	}

	/****************************************
	 *		HIDDEN/VISIBLE PRECHAT API      *
	/****************************************/
	/* Hidden/Visible Prechat functions exposed in window.embeddedservice_bootstrap.prechatAPI for setting/updating and removing hidden/visible prechat fields.
	 *
	 * @class
	 */
	function EmbeddedMessagingPrechat() {
		// Restore/Re-Initialize Hidden Prechat fields property on page reload from Session Storage.
		hiddenPrechatFields = getItemInWebStorageByKey(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, false) || {};
	}

	/**
	 * Validates the Hidden Prechat fields from the configuration response object.
	 * @return {boolean} True if valid and False otherwise.
	 */
	function validateHiddenPrechatFieldsFromConfig() {
		if (Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms) && embeddedservice_bootstrap.settings.embeddedServiceConfig.forms.length && Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].hiddenFormFields)) {
			return true;
		}
		return false;
	}

	/**
	 * Validates the Visible Prechat fields from the configuration response object.
	 * @return {boolean} True if valid and False otherwise.
	 */
	function validateVisiblePrechatFieldsFromConfig() {
		return Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms) && embeddedservice_bootstrap.settings.embeddedServiceConfig.forms.length
				&& Array.isArray(embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].formFields) && embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].formFields.length;
	}

	/**
	 * Validates a Hidden Pre-Chat field set by host in setHiddenPrechatFields method.
	 * @return {boolean} True if fieldName and/or fieldValue are valid and False otherwise.
	 */
	function validateHiddenPrechatField(fieldName, fieldValue) {
		const hiddenPrechatFieldsFromConfig = getHiddenPrechatFieldsFromConfig();
		// List of field names from configuration response.
		const hiddenPrechatFieldNamesFromConfig = hiddenPrechatFieldsFromConfig.map(({ name }) => name);
		// Field name object from configuration response for the passed in fieldName.
		const hiddenPrechatField = hiddenPrechatFieldsFromConfig.find(fields => fields.name === fieldName);

		if (!hiddenPrechatFieldNamesFromConfig.includes(fieldName)) {
			error("validateHiddenPrechatField", `setHiddenPrechatFields called with an invalid field name ${fieldName}.`);
			return false;
		}
		if (typeof fieldValue !== "string") {
			error("validateHiddenPrechatField", `You must specify a string for the ${fieldName} field in setHiddenPrechatFields instead of a ${typeof fieldValue} value.`);
			return false;
		}
		if (fieldValue.toLowerCase().includes("javascript:") || fieldValue.toLowerCase().includes("<script>")) {
			error("validateHiddenPrechatField", `JavaScript isn't allowed in the value for the ${fieldName} field when calling setHiddenPrechatFields.`);
			return false;
		}
		if (fieldValue.length > hiddenPrechatField['maxLength']) {
			error("validateHiddenPrechatField", `Value for the ${fieldName} field in setHiddenPrechatFields exceeds the maximum length restriction of ${hiddenPrechatField['maxLength']} characters.`);
			return false;
		}
		return true;
	}

	/**
	 * Gets the Hidden Prechat fields from the configuration response object.
	 * @return {object} Array of Hidden Prechat fields.
	 */
	function getHiddenPrechatFieldsFromConfig() {
		let hiddenPrechatFieldsFromConfig = [];

		if (validateHiddenPrechatFieldsFromConfig()) {
			hiddenPrechatFieldsFromConfig = embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].hiddenFormFields;
		}
		return hiddenPrechatFieldsFromConfig;
	}

	/**
	 * Gets the Visible Prechat fields from the configuration response object.
	 * @returns {object} Array of Visible Prechat fields.
	 */
	function getVisiblePrechatFieldsFromConfig() {
		return validateVisiblePrechatFieldsFromConfig() ? embeddedservice_bootstrap.settings.embeddedServiceConfig.forms[0].formFields : [];
	}

	/**
	 * Determine whether the client is ready for the host to set/update and/or remove Prechat fields.
	 * @param {string} caller - caller method name which invokes 'shouldProcessPrechatFieldsFromHost'.
	 * @return {boolean} True if the client is ready for the host to set/update and/or remove Prechat fields AND False otherwise.
	 */
	function shouldProcessPrechatFieldsFromHost(caller) {
		if (!hasEmbeddedMessagingReadyEventFired) {
			error("shouldProcessPrechatFieldsFromHost", `Can't call ${caller} before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}
		return true;
	}

	/**
	 * Whether or not the supplied value is a non-empty String.
	 * @param str - The value to be checked.
	 * @return {boolean} - True if value is a non-empty String.
	 */
	function isString(str) {
		if (typeof str === "string") {
			if (str.trim().length > 0) {
				return true;
			}
		}
		return false;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and set/update Hidden Prechat fields.
	 * Sets a new Hidden Prechat field or updates an existing field with the passed in value.
	 *
	 * @param {object} hiddenFields - an object (in the form of a Map) of key-value pairs (e.g. { HiddenPrechatFieldName1 : HiddenPrechatFieldValue1, HiddenPrechatFieldName2 : HiddenPrechatFieldValue2 }) of Hidden Prechat fields as set by the host.
	 */
	EmbeddedMessagingPrechat.prototype.setHiddenPrechatFields = function setHiddenPrechatFields(hiddenFields) {
		if (!shouldProcessPrechatFieldsFromHost('setHiddenPrechatFields')) {
			return;
		}

		if (hiddenFields && typeof hiddenFields === "object") {
			for (const [fieldName, fieldValue] of Object.entries(hiddenFields)) {
				if (validateHiddenPrechatField(fieldName, fieldValue)) {
					hiddenPrechatFields[fieldName] = fieldValue;
					// Store/Update Session storage with Hidden Prechat fields object for a valid field.
					setItemInWebStorage(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, hiddenPrechatFields, false, true);
					// Log successful update action on Hidden Prechat fields for debugging purposes.
					log("setHiddenPrechatFields", `[setHiddenPrechatFields] Successfully updated Hidden Pre-Chat field ${fieldName}.`);
				}
			}
		} else {
			error("setHiddenPrechatFields", `When calling setHiddenPrechatFields, you must pass in an object with key-value pairs.`);
		}
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and remove Hidden Prechat fields.
	 * Removes an existing Hidden Prechat field with the passed in key name.
	 *
	 * @param {object} hiddenFields - an object (in the form of an Array) of Hidden Prechat field names (e.g. [ HiddenPrechatFieldName1, HiddenPrechatFieldName2 ]) to be removed/deleted.
	 */
	EmbeddedMessagingPrechat.prototype.removeHiddenPrechatFields = function removeHiddenPrechatFields(hiddenFields) {
		if (!shouldProcessPrechatFieldsFromHost('removeHiddenPrechatFields')) {
			return;
		}

		if (hiddenFields && Array.isArray(hiddenFields)) {
			hiddenFields.forEach(function(fieldName) {
				if (hiddenPrechatFields.hasOwnProperty(fieldName)) {
					delete hiddenPrechatFields[fieldName];
					// Update Session storage with Hidden Prechat fields object for a valid field.
					setItemInWebStorage(STORAGE_KEYS.HIDDEN_PRECHAT_FIELDS, hiddenPrechatFields, false, true);
					// Log successful remove action on Hidden Prechat fields for debugging purposes.
					log("removeHiddenPrechatFields", `[removeHiddenPrechatFields] Successfully removed Hidden Pre-Chat field ${fieldName}.`);
				} else {
					error("removeHiddenPrechatFields", `removeHiddenPrechatFields called with an invalid field name ${fieldName}.`);
				}
			});
		} else {
			error("removeHiddenPrechatFields", `When calling removeHiddenPrechatFields, you must pass in an array of fields.`);
		}
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and set Visible Prechat fields.
	 * Sets a new Visible Prechat field or updates an existing field with the passed in value.
	 *
	 * @param {object} hiddenFields - Array of objects with key-value pairs, with 2 fields in each object. (i.e. field name & value, editability boolean flag).
	 */
	EmbeddedMessagingPrechat.prototype.setVisiblePrechatFields = function setVisiblePrechatFields(visibleFields) {
		if (!shouldProcessPrechatFieldsFromHost('setVisiblePrechatFields')) {
			return;
		}
		const formFields = getVisiblePrechatFieldsFromConfig();

		if (visibleFields) {
			for (const [fieldName, fieldData] of visibleFields) {
				// TODO: Add validation 
				const matchedField = formFields.find((field) => field.name === fieldName);
				if (matchedField) {
					matchedField['value'] = fieldData['value'];
					if (typeof fieldData['isEditableByEndUser'] === 'boolean') {
						matchedField['isEditableByEndUser'] = fieldData['isEditableByEndUser'];
					}
				}
			}
		} else {
			error("setVisiblePrechatFields", `When calling setVisiblePrechatFields, you must pass in an array of objects of key-value pairs`);
		}
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and remove Visible Prechat field(s).
	 * Removes existing Visible Prechat field(s) with the passed in key name.
	 *
	 * @param {object} visibleFields - Array of field names to be removed
	 */
	EmbeddedMessagingPrechat.prototype.removeVisiblePrechatFields = function removeVisiblePrechatFields(visibleFields) {
        if (!shouldProcessPrechatFieldsFromHost('removeVisiblePrechatFields')) {
            return;
        }
		const formFields = getVisiblePrechatFieldsFromConfig();

		if (visibleFields) {
			visibleFields.forEach((fieldName) => {
				const matchedField = formFields.find((field) => field.name === fieldName);
				if (matchedField) {
					delete matchedField['value'];
					delete matchedField['isEditableByEndUser'];
				} else {
					error("removeVisiblePrechatFields", `removeVisiblePrechatFields called with an invalid field name ${fieldName}.`);
				}
			});
		} else {
			error("removeVisiblePrechatFields", `When calling removeVisiblePrechatFields, you must pass in an array of fields.`);
		};
	}

	/****************************************
	 * .           AUTO-RESPONSE API        *
	/****************************************/
	/**
	 * Auto-Response API methods exposed in window.embeddedservice_bootstrap.autoResponseAPI
	 * for setting/updating/removing query string parameters on the Auto-Response Web View URL from the host domain.
	 *
	 * @class
	 */
	function EmbeddedMessagingAutoResponse() {
		// Restore Auto-Response API parameter map on page reload from session storage.
		autoResponseParameters = getItemInWebStorageByKey(STORAGE_KEYS.AUTORESPONSE_PARAMETERS, false) || {};
	}

	/**
	 * Determine whether the client is ready for the host (customer) to invoke public Auto-Response API methods.
	 *
	 * @param {String} caller - Name of caller method which invokes `shouldProcessAutoResponseParametersFromHost`
	 * @returns {Boolean} true if client is ready for host to update/remove auto-response parameters. Otherwise, false.
	 */
	function shouldProcessAutoResponseParametersFromHost(caller) {
		if (!hasEmbeddedMessagingReadyEventFired) {
			error("shouldProcessAutoResponseParametersFromHost", `[${caller}] Cannot invoke Auto-Response API before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		return true;
	}

	/**
	 * Validate an auto-response's page query string parameter set by host via the `setAutoResponseParameters` API method
	 * @param {String} parameterName - Key of auto-response page parameter provided by host.
	 * @param {String} parameterValue - Value of auto-response page parameter provided by host.
	 * @returns {Boolean} Returns true if parameter key and/or value are valid. Otherwise, returns false.
	 */
	function validateAutoResponseParameter(parameterName, parameterValue) {
		if (typeof parameterName !== "string" || parameterName.trim().length < 1) {
			error("validateAutoResponseParameter", `Expected a non-empty string for the parameter name, but received ${typeof parameterName}`);
			return false;
		}

		if (typeof parameterValue !== "string" || parameterValue.trim().length < 1) {
			error("validateAutoResponseParameter", `Expected a non-empty string for the parameter value, but received ${typeof parameterValue}`);
			return false;
		}

		return true;
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to set/update auto-response page parameters.
	 * Sets a new parameter (key-value pair) or updates an existing parameter with the same key to a new value.
	 *
	 * @param {Object} pageParameters - Map containing key-value pairs of query string parameters as invoked by the host.
	 * (e.g. { parameterName1: parameterValue2, parameterName2: parameterValue2 })
	 */
	EmbeddedMessagingAutoResponse.prototype.setAutoResponseParameters = function setAutoResponseParameters(pageParameters) {
		if (!shouldProcessAutoResponseParametersFromHost("setAutoResponseParameters")) {
			return;
		}

		if (pageParameters && typeof pageParameters === "object") {
			for (const [paramKey, paramValue] of Object.entries(pageParameters)) {
				// Validate parameters are valid non-empty strings.
				if (validateAutoResponseParameter(paramKey, paramValue)) {
					autoResponseParameters[paramKey] = paramValue;
					setItemInWebStorage(STORAGE_KEYS.AUTORESPONSE_PARAMETERS, autoResponseParameters, false, true);
					// Log successfully updated auto-response parameters for debugging purposes.
					log("setAutoResponseParameters", `[setAutoResponseParameters] Successfully updated auto-response parameter ${paramKey}`);
				} else {
					warning(`[setAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`)
				}
			}
		} else {
			error("setAutoResponseParameters", `[setAutoResponseParameters] Must pass in an object of parameters as key-value pairs.`);
		}
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to remove auto-response page parameters.
	 * Removes an existing parameter with the specified key.
	 *
	 * @param {Array} pageParameters - Array containing parameter names/keys (e.g. [ parameterName1, parameterName2 ])
	 */
	EmbeddedMessagingAutoResponse.prototype.removeAutoResponseParameters = function removeAutoResponseParameters(pageParameters) {
		if (!shouldProcessAutoResponseParametersFromHost("removeAutoResponseParameters")) {
			return;
		}

		if (pageParameters && Array.isArray(pageParameters)) {
			pageParameters.forEach(function(paramKey) {
				if (autoResponseParameters.hasOwnProperty(paramKey)) {
					delete autoResponseParameters[paramKey];
					setItemInWebStorage(STORAGE_KEYS.AUTORESPONSE_PARAMETERS, autoResponseParameters, false);
					// Log successfully removed auto-response page parameter for debugging purposes.
					log("removeAutoResponseParameters", `[removeAutoResponseParameters] Successfully removed auto-response parameter ${paramKey}`);
				} else {
					warning(`[removeAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`);
				}
			});
		} else {
			error("removeAutoResponseParameters", `[removeAutoResponseParameters] Must pass in an array of parameter names.`);
		}
	};

	/*********************************************************
	*		    Util API         *
	**********************************************************/

	/**
	 * Embedded Messaging Hide/Show exposed in window.embeddedservice_bootstrap.utilAPI
	 * for managing visibility of chat button dynamically.
	 * @class
	 */
	function EmbeddedMessagingUtil() {}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to display chat button dynamically.
	 */
	EmbeddedMessagingUtil.prototype.showChatButton = function showChatButton() {
		const authMode = getAuthMode();

		if (!hasEmbeddedMessagingReadyEventFired) {
			error("showChatButton", `Method can't be invoked before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		// Only show button if it is unauth, or identityToken is present in auth
		if (authMode === AUTH_MODE.UNAUTH || identityToken) {
			const conversationButton = getEmbeddedMessagingConversationButton();
			if (conversationButton) {
				conversationButton.style.display = "block";
				return true;
			}
		} else {
			error("showChatButton", `Can't call showChatButton for a verified user before calling the setIdentity method with a valid token.`);
		}

		return false;
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly exposed API for the host (i.e. customer) to hide chat button dynamically.
	 *
	 */
	EmbeddedMessagingUtil.prototype.hideChatButton = function hideChatButton() {
		if (!hasEmbeddedMessagingReadyEventFired) {
			error("hideChatButton", `Method can't be invoked before the onEmbeddedMessagingReady event is fired.`);
			return false;
		}

		// We only hide the button if iframe is not present
		if (!getEmbeddedMessagingFrame()) {
			const conversationButton = getEmbeddedMessagingConversationButton();
			if (conversationButton) {
				conversationButton.style.display = "none";
				return true;
			}
		} else {
			error("hideChatButton", `Can’t call hideChatButton once the messaging window is showing.`);
		}

		return false;
	};

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly expose API for the host (i.e. customer) to launch the client dynamically.
	 * @returns {Promise}
	 */
	EmbeddedMessagingUtil.prototype.launchChat = function launchChat() {
		return new Promise((resolve, reject) => {
			let consoleMessage;

			/**
			 * onEmbeddedMessagingInitSuccess event listener to handle resolving Promise.
			 */
			const handleBootstrapSuccess = () => {
				let successMessage;

				// onEmbeddedMessagingInitSuccess or onEmbeddedMessagingInitError event is not fired.
				if (!hasEmbeddedMessagingInitEventFired) {
					successMessage = `[Launch Chat API] The messaging client initialized successfully or failed event isn’t fired.`;

					warning(successMessage);
					reject(successMessage);

					return;
				}

				successMessage = `[Launch Chat API] Successfully initialized the messaging client.`;
				log("launchChat", successMessage);
				resolve(successMessage);

				window.removeEventListener(ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME, handleBootstrapSuccess);
				window.removeEventListener(ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME, handleBootstrapError);
			};

			/**
			 * onEmbeddedMessagingInitError event listener to handle rejecting Promise.
			 */
			const handleBootstrapError = () => {
				let errorMessage;

				// onEmbeddedMessagingInitSuccess or onEmbeddedMessagingInitError event is not fired.
				if (!hasEmbeddedMessagingInitEventFired) {
					errorMessage = `[Launch Chat API] The messaging client initialized successfully or failed event isn’t fired.`;

					warning(errorMessage);
					reject(errorMessage);

					return;
				}

				errorMessage = `[Launch Chat API] Error launching the messaging client.`;
				error("handleBootstrapError", errorMessage);
				reject(errorMessage);

				window.removeEventListener(ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME, handleBootstrapSuccess);
				window.removeEventListener(ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME, handleBootstrapError);

				resetClientToInitialState();
			};

			try {
				// Cannot be invoked before `afterInit` event has been emitted.
				if (!hasEmbeddedMessagingReadyEventFired) {
					consoleMessage = `[Launch Chat API] Can’t invoke API before the onEmbeddedMessagingReady event is fired.`;

					warning(consoleMessage);
					reject(consoleMessage);

					return;
				}

				// Cannot be invoked if static button is not present.
				if (!getEmbeddedMessagingConversationButton()) {
					if(isChannelMenuDeployment()) {
						// [W-13992566] Generate button markup for Channel Menu only.
						if (getAuthMode() === AUTH_MODE.UNAUTH) {
							// Only generate button markup if it is unauth, or identityToken is present in auth.
							embeddedservice_bootstrap.generateMarkup(true);
						}
					} else {
						consoleMessage = `[Launch Chat API] Default chat button isn’t present. Check if the messaging client initialized successfully.`;

						warning(consoleMessage);
						reject(consoleMessage);

						return;
					}
				}

				// Cannot be invoked if iframe is already present.
				if (getEmbeddedMessagingFrame()) {
					let iframe = getEmbeddedMessagingFrame();

					consoleMessage = `[Launch Chat API] The messaging client window is already present.`;

					warning(consoleMessage);
					resolve(consoleMessage);

					return;
				}

				window.addEventListener(ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME, handleBootstrapSuccess);
				window.addEventListener(ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME, handleBootstrapError);

				// Simulate button click to initiate app.
				handleClick().catch((err) => {
					consoleMessage = `[Launch Chat API] Error when API simulates clicking the custom messaging client button: ${err}`;

					error("launchChat", consoleMessage);
					reject(consoleMessage);

					return;
				});
			} catch(e) {
				consoleMessage = `[Launch Chat API] Something went wrong launching the API: ${e}`;

				error("launchChat", consoleMessage);
				reject(consoleMessage);
			}
		});
	}

	/*********************************************************
	*		    Embedded Messaging Bootstrap Object          *
	**********************************************************/
	/**
	 * EmbeddedServiceBootstrap global object which creates and renders an embeddedService.app in an iframe.
	 *
	 * @class
	 * @property {object} settings - A list of settings that can be set here or within init.
	 */
	function EmbeddedServiceBootstrap() {
		this.settings = {
			devMode: false,
			targetElement: document.body
		};

		this.isLocalStorageAvailable = true;
		this.isSessionStorageAvailable = true;

		// Default chat icon data.
		Object.defineProperties(DEFAULT_ICONS, {
			CHAT: {
				value: "M50 0c27.614 0 50 20.52 50 45.833S77.614 91.667 50 91.667c-8.458 0-16.425-1.925-23.409-5.323-13.33 6.973-21.083 9.839-23.258 8.595-2.064-1.18.114-8.436 6.534-21.767C3.667 65.54 0 56.08 0 45.833 0 20.52 22.386 0 50 0zm4.583 61.667H22.917a2.917 2.917 0 000 5.833h31.666a2.917 2.917 0 000-5.833zm12.5-15.834H22.917a2.917 2.917 0 000 5.834h44.166a2.917 2.917 0 000-5.834zM79.583 30H22.917a2.917 2.917 0 000 5.833h56.666a2.917 2.917 0 000-5.833z"
			},
			MINIMIZE_MODAL: {
				value: "M47.6,17.8L27.1,38.5c-0.6,0.6-1.6,0.6-2.2,0L4.4,17.8c-0.6-0.6-0.6-1.6,0-2.2l2.2-2.2 c0.6-0.6,1.6-0.6,2.2,0l16.1,16.3c0.6,0.6,1.6,0.6,2.2,0l16.1-16.2c0.6-0.6,1.6-0.6,2.2,0l2.2,2.2C48.1,16.3,48.1,17.2,47.6,17.8z"
			},
			REFRESH: {
				value: "M46.5,4h-3C42.7,4,42,4.7,42,5.5v7c0,0.9-0.5,1.3-1.2,0.7l0,0c-0.3-0.4-0.6-0.7-1-1c-5-5-12-7.1-19.2-5.7 c-2.5,0.5-4.9,1.5-7,2.9c-6.1,4-9.6,10.5-9.7,17.5c-0.1,5.4,2,10.8,5.8,14.7c4,4.2,9.4,6.5,15.2,6.5c5.1,0,9.9-1.8,13.7-5 c0.7-0.6,0.7-1.6,0.1-2.2l-2.1-2.1c-0.5-0.5-1.4-0.6-2-0.1c-3.6,3-8.5,4.2-13.4,3c-1.3-0.3-2.6-0.9-3.8-1.6 C11.7,36.6,9,30,10.6,23.4c0.3-1.3,0.9-2.6,1.6-3.8C15,14.7,19.9,12,25.1,12c4,0,7.8,1.6,10.6,4.4c0.5,0.4,0.9,0.9,1.2,1.4 c0.3,0.8-0.4,1.2-1.3,1.2h-7c-0.8,0-1.5,0.7-1.5,1.5v3.1c0,0.8,0.6,1.4,1.4,1.4h18.3c0.7,0,1.3-0.6,1.3-1.3V5.5 C48,4.7,47.3,4,46.5,4z"
			}
		});

		this.brandingData = [];
	}

	/**
	 * Determine if a string is a valid Salesforce entity ID.
	 *
	 * @param {string} entityId - The value that should be checked.
	 * @returns {boolean} Is this a valid entity Id?
	 */
	EmbeddedServiceBootstrap.prototype.isValidEntityId = function isValidEntityId(entityId) {
		return typeof entityId === "string" && (entityId.length === 18 || entityId.length === 15);
	};

	/**
	 * Extract the entity key prefix from a valid entity ID.
	 *
	 * @param {string} entityId = The string from which to extract the entity ID.
	 * @returns {string} The key prefix, if this ID is valid.
	 */
	EmbeddedServiceBootstrap.prototype.getKeyPrefix = function getKeyPrefix(entityId) {
		if(embeddedservice_bootstrap.isValidEntityId(entityId)) return entityId.substr(0, 3);

		return undefined;
	};

	/**
	 * Determines if a string is a valid Salesforce organization ID.
	 *
	 * @param {string} entityId - An entity ID.
	 * @returns {boolean} Is the string an organization ID?
	 */
	EmbeddedServiceBootstrap.prototype.isOrganizationId = function isOrganizationId(entityId) {
		return embeddedservice_bootstrap.getKeyPrefix(entityId) === "00D";
	};
	/**
	 * Determines if a message origin url has a Salesforce domain. Used for filtering non-Salesforce messages.
	 *
	 * @param {string} messageOriginUrl - String containing the origin url. This should end with the domain (strip off the port before passing to this function).
	 * @return {boolean} Did message come from page hosted on Salesforce domain?
	 */
	EmbeddedServiceBootstrap.prototype.isMessageFromSalesforceDomain = function isMessageFromSalesforceDomain(messageOriginUrl) {
		var endsWith;
		var messageOrigin = messageOriginUrl.split(":")[1].replace("//", "");

		/**
		 * 1st check - if on Experience Cloud platform, and endpoint is same as hosting site, message origin will be from same domain as document.
		 */
		if(pageIsSiteContext() && messageOrigin === document.domain) {
			return true;
		}

		/**
		 * "Polyfill" for String.prototype.endsWith since IE doesn't support it.
		 *
		 * @param {string} first - Does the first string...
		 * @param {string} second - ...end with the second string?
		 * @return {boolean} Does it?
		 */
		endsWith = function(first, second) {
			return first.indexOf(second, first.length - second.length) !== -1;
		};

		/**
		 * 2nd check - message origin is an actual salesforce domain
		 */
		return SALESFORCE_DOMAINS.some(function(salesforceDomain) {
			return endsWith(messageOrigin, salesforceDomain);
		});
	};

	/**
	 * Generate markup and render static conversation button on parent page.
	 * @param {boolean} generateMarkupInChannelMenu - Whether or not method is invoked by #bootstrapEmbeddedMessaging() API
	 */
	EmbeddedServiceBootstrap.prototype.generateMarkup = function generateMarkup(generateMarkupInChannelMenu = false) {
		const markupFragment = document.createDocumentFragment();
		let topContainerElement = getEmbeddedMessagingTopContainer();
		let conversationButtonElement = getEmbeddedMessagingConversationButton();

		// Do not generate markup for channel menu deployments unless invoked by bootstrapEmbeddedMessaging API.
		if (isChannelMenuDeployment() && !generateMarkupInChannelMenu) {
			return;
		}

		if (topContainerElement && conversationButtonElement) {
			return;
		}

		// Generate markup, if not found in DOM.
		topContainerElement = createTopContainer();
		conversationButtonElement = createConversationButton();

		markupFragment.appendChild(topContainerElement);
		topContainerElement.appendChild(conversationButtonElement);

		// Render static conversation button.
		embeddedservice_bootstrap.settings.targetElement.appendChild(markupFragment);
	};

	/**
	 * Create an iframe on the parent window for executing code in site (3rd party) context
	 * withot loading entire LWR app. See sitecontext.js
	 */
	function createSiteContextFrame() {
		const siteContextFrame = document.createElement("iframe");
		const siteContextFrameUrl = `${getSiteURL()}/assets/htdocs/sitecontext${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.html?parent_domain=${window.location.origin}`;

		siteContextFrame.classList.add(SITE_CONTEXT_IFRAME_NAME);
		siteContextFrame.id = SITE_CONTEXT_IFRAME_NAME;
		siteContextFrame.name = SITE_CONTEXT_IFRAME_NAME;
		siteContextFrame.src = siteContextFrameUrl;
		siteContextFrame.onload = () => {
			log("createSiteContextFrame", `Created an iframe for siteContext.`);
		};
		embeddedservice_bootstrap.siteContextFrame = siteContextFrame;
		document.body.appendChild(siteContextFrame);
	}

	/**
	 * Create an iframe on the parent window for rendering a full size File Preview.
	 * Set the source of this iframe to an objectUrl generated by #getGeneratedPageURLForFilePreviewFrame.
	 */
	EmbeddedServiceBootstrap.prototype.createFilePreviewFrame = function createFilePreviewFrame() {
		const filePreviewFrame = document.createElement("iframe");
		const filePreviewFrameUrl = `${getSiteURL()}/assets/htdocs/filepreview${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.html?parent_domain=${window.location.origin}`;

		filePreviewFrame.classList.add(FILE_PREVIEW_IFRAME_NAME);
		filePreviewFrame.id = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.name = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.src = filePreviewFrameUrl;
		filePreviewFrame.title = getLabel("EmbeddedMessagingIframesAndContents", "FilePreviewIframeTitle") || FILE_PREVIEW_IFRAME_DEFAULT_TITLE;
		filePreviewFrame.onload = () => {
			log("createFilePreviewFrame", `Created an iframe for file preview.`);
		};
		embeddedservice_bootstrap.filePreviewFrame = filePreviewFrame;
		document.body.appendChild(filePreviewFrame);
	};

	/**
	 * On click of conversation button,
	 * (i) Create an iframe and set source as the aura application, loaded through the experienceSiteEndpointURL.
	 * 	- Wrap iframe in 2 divs to allow scrolling/responsiveness in iframe without viewport on page header.
	 * (ii) Create a div element to be the modal overlay for mobile clients only.
	 * (iii) Append iframe and modal to the top-level container of the parent page.
	 * (iv) Hide the conversation button once iframe is loaded.
	 */
	EmbeddedServiceBootstrap.prototype.createIframe = function createIframe() {
		return new Promise((resolve, reject) => {
			try {
				const parent = getEmbeddedMessagingTopContainer();
				const iframe = document.createElement("iframe");
				const modal = createBackgroundModalOverlay();

				iframe.title = getLabel("EmbeddedMessagingIframesAndContents", "MessagingIframeTitle") || IFRAME_DEFAULT_TITLE;
				iframe.className = LWR_IFRAME_NAME;
				iframe.id = LWR_IFRAME_NAME;
				iframe.onload = resolve;
				iframe.onerror = reject;
				iframe.style.backgroundColor = "transparent";
				iframe.allowTransparency = "true";
				iframe.setAttribute("aria-label", getLabel("EmbeddedMessagingChatHeader", "ChatWindowAssistiveText") || CHAT_WINDOW_ASSISTIVE_TEXT);

				// Set sandbox attributes on iframe unless omitSandbox flag is on.
				if(!embeddedservice_bootstrap.settings.omitSandbox) {
					// TODO: remove allow-same-origin when Aura/LWR allows
					// Add allow-modals to throw alert for unauthenticated user losing session.
					// Add allow-popups-to-escape-sandbox to enable links to escape sandbox context.
					iframe.sandbox = "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox";
				}

				// Handle Aura/LWR site endpoints separately until W-10165756 is implemented.
				if(embeddedservice_bootstrap.settings.isAuraSite) {
					handleAuraSite(iframe);
				} else {
					handleLWRSite(iframe);
				}

				// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
				if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
					iframe.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
					iframe.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
				}

				// Adjust iframe size based on platform the app is on.
				if (isMobilePublisherApp()) {
					iframe.classList.add(MOBILE_PUBLISHER);
				} else if (isExperienceSite()) {
					iframe.classList.add(EXPERIENCE_SITE);
				}

				// Set HTML direction based on language
				if (embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection && typeof embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection === "string") {
					iframe.setAttribute("dir", embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection.toLowerCase());
				}

				iframe.onload = () => {
					log("createIframe", `Created Embedded Messaging frame.`);
				};

				parent.appendChild(modal);
				parent.appendChild(iframe);
			} catch(e) {
				reject(e);
			}
		});
	};

	/**
	 * Handles simulating button click to bootstrap Embedded Messaging and launch the chat client.
	 * - embeddedservice_bootstrap.init() will take care of restoring the session.
	 * 
	 * NOTE: this API is invoked by Channel Menu (see channelMenu.js#bootstrapEmbeddedMessagingInChannelMenu)
	 * - For Channel Menu deployments only, this also generates button markup on channel click.
	 *
	 * @returns {Promise} - Resolves if chat client is launched successfully, or rejects if there was an error launching chat.
	 */
	EmbeddedServiceBootstrap.prototype.bootstrapEmbeddedMessaging = function bootstrapEmbeddedMessaging() {
		try {
			return embeddedservice_bootstrap.utilAPI.launchChat();
		} catch(e) {
			throw new Error("[Bootstrap API] Something went wrong bootstrapping Embedded Messaging: " + e);
		}
	};

	/**
	 * Maximize the iframe which holds the LWR application. Use branding width/height if screen is
	 * big enough, else just fill what we have.
	 * @param {Object} iframe - Reference to iframe DOM element.
	 */
	EmbeddedServiceBootstrap.prototype.maximizeIframe = function maximizeIframe(frame) {
		const button = getEmbeddedMessagingConversationButton();
		const modal = getEmbeddedMessagingModal();
		const chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		const iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		const viewportMetaTag = getViewportMetaTag();
		const isiOS = isUseriOS();
		let minimizeButton;

		if(frame) {
			frame.classList.add(MODAL_ISMAXIMIZED_CLASS);

			frame.classList.remove(MODAL_ISMINIMIZED_CLASS);

			frame.classList.remove(MODAL_HASMINIMIZEDNOTIFICATION_CLASS);

			// Adjust iframe distance from bottom to maximized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
				frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
			}
		}

		if(button) {
			// Static button is displayed under client when maximized.
			button.style.display = "block";

			// [A11Y] Button is not focusable when maximized.
			button.setAttribute("tabindex", -1);

			// [A11Y] Accessible name
			button.setAttribute("aria-label", getLabel("EmbeddedMessagingChatHeader", "MinimizeButtonAssistiveText") || CONVERSATION_BUTTON_MINIMIZE_ASSISTIVE_TEXT);

			// [A11Y] Assistive text
			button.setAttribute("title", getLabel("EmbeddedMessagingChatHeader", "MinimizeButtonAssistiveText") || CONVERSATION_BUTTON_MINIMIZE_ASSISTIVE_TEXT);

			// Hide the default chat icon on the button.
			chatIcon.style.display = "none";

			if (!document.getElementById(EMBEDDED_MESSAGING_ICON_MINIMIZE)) {
				// Create the minimize button markup and insert into the DOM.
				minimizeButton = renderSVG(DEFAULT_ICONS.MINIMIZE_MODAL);
				minimizeButton.setAttribute("id", EMBEDDED_MESSAGING_ICON_MINIMIZE);
				minimizeButton.setAttribute("class", EMBEDDED_MESSAGING_ICON_MINIMIZE);
				iconContainer.insertBefore(minimizeButton, chatIcon);
			}
		}

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen's max-width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(modal && !modal.classList.contains(MODAL_ISMAXIMIZED_CLASS)) {
			modal.classList.add(MODAL_ISMAXIMIZED_CLASS);
		}

		// The `embeddedMessagingPreventScrolling` class is appended/removed from the document.body
		// to prevent background scrolling on devices that display the background modal.
		// Also storing document body's scroll position so we can restore when chat gets minimized for mobile devices only
		if(!isDesktop() && !document.body.classList.contains(PREVENT_SCROLLING_CLASS)) {
			// Most browsers will have scrollElement to keep track of scroll positions
			// Some older browsers do not, so using getBoundingClientRect() for those older brosers
			if (document.scrollingElement) {
				embeddedservice_bootstrap.documentScrollPosition = document.scrollingElement.scrollTop;
			} else {
				const docElementRect = document.documentElement.getBoundingClientRect();
				embeddedservice_bootstrap.documentScrollPosition = Math.abs(docElementRect.top);
			}
			document.body.classList.add(PREVENT_SCROLLING_CLASS);
		}

		// Only on iOS devices modify the meta viewport tag
		if (isiOS && viewportMetaTag) {
			originalViewportMetaTag = viewportMetaTag.content;
			viewportMetaTag.setAttribute("content", IOS_VIEWPORT_META_TAG);
		}

		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME);
		log("maximizeIframe", `Maximized the app`);
	};

	/**
	 * Resize iframe to fit over button dimensions
	 */
	EmbeddedServiceBootstrap.prototype.minimizeIframe = function minimizeIframe(frame, data) {
		const button = getEmbeddedMessagingConversationButton();
		const modal = getEmbeddedMessagingModal();
		const minimizeIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_MINIMIZE);
		const hasMinimizedNotification = data.hasMinimizedNotification;

		if(frame) {
			frame.classList.remove(MODAL_ISMAXIMIZED_CLASS);
			frame.classList.add(MODAL_ISMINIMIZED_CLASS);

			if(hasMinimizedNotification) {
				// Resize and style iframe to render minimized button and notification.
				frame.classList.add(MODAL_HASMINIMIZEDNOTIFICATION_CLASS);
			} else {
				// Resize and style iframe to render minimized button only.
				frame.classList.remove(MODAL_HASMINIMIZEDNOTIFICATION_CLASS);
			}

			// Adjust iframe distance from bottom to minimized position if browser has bottom tab bar.
			if(embeddedservice_bootstrap.settings.hasBottomTabBar) {
				frame.classList.remove(IFRAME_BOTTOM_TAB_BAR_MAXIMIZED_CLASS);
				frame.classList.add(IFRAME_BOTTOM_TAB_BAR_MINIMIZED_CLASS);
			}
		}

		// Remove the minimize icon from the button.
		if(minimizeIcon) {
			minimizeIcon.remove();
		}

		if(button) {
			// Hide the default FAB when chat client is minimized so that only the minimized FAB is shown.
			button.style.display = "none";
			button.setAttribute("tabindex", -1);
			button.removeAttribute("title");
			button.removeAttribute("aria-label");
		}

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen max width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(modal && modal.classList.contains(MODAL_ISMAXIMIZED_CLASS)) {
			modal.classList.remove(MODAL_ISMAXIMIZED_CLASS);
		}

		// [Mobile] The `embeddedMessagingPreventScrolling` class is appended/removed from the
		// document.body to prevent background scrolling on devices that display the background modal.
		// Also restore document body's scroll position before chat window was maximized for mobile devices only
		if(!isDesktop()) {
			document.body.classList.remove(PREVENT_SCROLLING_CLASS);
			if (embeddedservice_bootstrap.documentScrollPosition) {
				window.scrollTo(0, embeddedservice_bootstrap.documentScrollPosition);
			}
		}

		// [iOS Devices] Restore the meta viewport tag to its original value
		if (originalViewportMetaTag) {
			restoreViewportMetaTag();
		}

		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME);
		log("minimizeIframe", `Minimized the app`);
	};

	/**
     * Resize iframe to fit the minimize state notification area (modal).
     */
    function handleShowMinimizedStateNotification() {
        const embeddedMessagingFrame = getEmbeddedMessagingFrame();

        if(embeddedMessagingFrame) {
            // Resize and style iframe to render minimized button and notification.
            embeddedMessagingFrame.classList.add(MODAL_HASMINIMIZEDNOTIFICATION_CLASS);
        }
    }

	/**
	 * Initialize feature specific objects on the global bootstrap object 'embeddedservice_bootstrap' to expose certain feature related APIs/properties externally.
	 */
	EmbeddedServiceBootstrap.prototype.initializeFeatureObjects = function initializeFeatureObjects() {
		// Initialize a prechat object 'prechatAPI' on 'embeddedservice_bootstrap' global object for Hidden Prechat feature.
		embeddedservice_bootstrap.prechatAPI = new EmbeddedMessagingPrechat();

		// Initialize an auto-response object 'autoResponseAPI' on 'embeddedservice_bootstrap' global object fo Auto-Response Web View feature.
		embeddedservice_bootstrap.autoResponseAPI = new EmbeddedMessagingAutoResponse();

		// Initialize user verification API
		embeddedservice_bootstrap.userVerificationAPI = new EmbeddedMessagingUserVerification();

		// Initialize util API
		embeddedservice_bootstrap.utilAPI = new EmbeddedMessagingUtil();
	}

	/**
	 * Validate settings and begin the process of rendering DOM elements.
	 *
	 * @param {string} orgId - the entity ID for the organization.
	 * @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	 * @param {string} siteURL - the base URL for the core (site) for the deployment.
	 * @param {object} snippetConfig - configuration on container page. Takes preference over server-side configuration.
	 */
	EmbeddedServiceBootstrap.prototype.init = function init(orgId, eswConfigDevName, siteURL, snippetConfig) {
		try {
			embeddedservice_bootstrap.settings.orgId = orgId;
			embeddedservice_bootstrap.settings.eswConfigDevName = eswConfigDevName;
			embeddedservice_bootstrap.settings.siteURL = siteURL;
			embeddedservice_bootstrap.settings.snippetConfig = snippetConfig;

			mergeSettings(snippetConfig || {});

			validateInitParams();

			detectWebStorageAvailability();

			checkForNativeFunctionOverrides();

			if(!embeddedservice_bootstrap.settings.targetElement) throw new Error("No targetElement specified.");

			addEventHandlers();

			// Check to see whether browser has bottom tab bar.
			embeddedservice_bootstrap.settings.hasBottomTabBar = isUseriOS15plusSafari();

			// isAuraSite - Temporary setting to fallback to Aura embeddedService.app. To be removed in W-10165756.
			embeddedservice_bootstrap.settings.isAuraSite = Boolean(embeddedservice_bootstrap.settings.isAuraSite);

			// Default app to use sandbox on iframe unless the flag is turned on.
			embeddedservice_bootstrap.settings.omitSandbox = Boolean(embeddedservice_bootstrap.settings.omitSandbox);

			// hideChatButtonOnLoad - Static setting for visibility of chat button on page load.
			embeddedservice_bootstrap.settings.hideChatButtonOnLoad = embeddedservice_bootstrap.settings.hideChatButtonOnLoad;

			// Load CSS file for bootstrap.js from GSLB.
			const cssPromise = loadCSS().then(
				Promise.resolve.bind(Promise),
				() => {
					// Retry loading CSS file from Core, if failed to load from GSLB.
					return loadCSS(getSiteURL());
				}
			).catch(
				() => {
					throw new Error("Error loading CSS.");
				}
			);

			// Load config settings from SCRT 2.0.
			const configPromise = getConfigurationData().then(
				response => {
					log("init", `Successfully retrieved configuration settings`);
					// Merge the Config Settings into embeddedservice_bootstrap.settings.
					mergeSettings(response);

					// Prepare the branding data.
					handleBrandingData(embeddedservice_bootstrap.settings.embeddedServiceConfig);

					// Merge SCRT 2.0 URL and Org Id into the Config Settings object, to be passed to the iframe.
					embeddedservice_bootstrap.settings.embeddedServiceConfig.scrt2URL = embeddedservice_bootstrap.settings.scrt2URL;
					embeddedservice_bootstrap.settings.embeddedServiceConfig.orgId = embeddedservice_bootstrap.settings.orgId;

					validateSettings();

					// We have to wait until we have configuration to do this
					storageKey = `${embeddedservice_bootstrap.settings.orgId}_WEB_STORAGE`;
					createSiteContextFrame();
				},
				responseStatus => {
					error("init", `Failed to retrieve configuration settings. Retrying the request`);
					// Retry one more time to load config settings from SCRT 2.0 if the first attempt fails.
					return new Promise((resolve, reject) => {
						getConfigurationData().then(resolve, reject);
					});
				}
			).catch(
				() => {
					throw new Error("Unable to load Embedded Messaging configuration.");
				}
			);

			//once we have config we can check 3rd party storage
			configPromise.then(() => {
				sendPostMessageToSiteContextIframe(
					EMBEDDED_MESSAGING_3P_STORAGE_REQUEST_EVENT_NAME, {orgId : embeddedservice_bootstrap.settings.orgId})
			});

			// Show button when we've loaded everything.
			Promise.all([cssPromise, configPromise, getBusinessHoursInterval(), sessionDataPromise]).then(() => {
				initializeWebStorage();

				logWebStorageItemsOnInit();

				embeddedservice_bootstrap.initializeFeatureObjects();

				embeddedservice_bootstrap.emitEmbeddedMessagingReadyEvent();

				// If session exists in web storage, generate button markup and bootstrap the session.
				// Else, generate button markup only for unauth mode. For auth mode, markup is generated in #setIdentityToken() API.
				// For MIAW in Channel Menu, static button markup is generated on menu item click in #bootstrapEmbeddedMessaging() API
				if (sessionExists()) {
					embeddedservice_bootstrap.generateMarkup(true);
					bootstrapExistingSession();
				} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
					embeddedservice_bootstrap.generateMarkup();
				}
			});
		} catch(err) {
			error("init", `Error: ${err}`);
		}
	};

	window.embeddedservice_bootstrap = new EmbeddedServiceBootstrap();
})();
