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
	const CHAT_BUTTON_LOADING_ASSISTIVE_TEXT = "Loading";

	/**
	 * Conversation modal state class constants.
	 */
	const MODAL_ISMAXIMIZED_CLASS = "isMaximized";
	const MODAL_ISMINIMIZED_CLASS = "isMinimized";
	const MODAL_HASMINIMIZEDNOTIFICATION_CLASS = "hasMinimizedNotification";

	/**
	 * Iframe platform class constants.
	 */
	const EXPERIENCE_SITE = "eswExperienceSite";
	const MOBILE_PUBLISHER = "eswMobilePublisher";
	const IS_DESKTOP = "eswIsDesktop";

	/**
	 * Parent page elements class constants.
	 */
	const TOP_CONTAINER_NAME = "embedded-messaging";
	const BACKGROUND_MODAL_ID = "embeddedMessagingModalOverlay";
	const PREVENT_SCROLLING_CLASS = "embeddedMessagingPreventScrolling";
	const LWR_IFRAME_NAME = "embeddedMessagingFrame";
	const LWR_INLINE_IFRAME_CLASS = LWR_IFRAME_NAME + "Inline";
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
	const INERT_SCRIPT_ID = "inert-script";

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
	const TRANSCRIPT_PATH = "/transcript";

	/**
	 * Experience Site User Verification
	 */
	const EXP_SITE_ACCESS_TOKEN_PATH = "/miaw/auth/accesstoken";
	const EXP_SITE_SESSION_TIMEOUT = "/_nc_external/system/security/session/SessionTimeServlet?buster=";

	/**
	 * Capabilities version to be passed as part of Access Token request to register capabilities of the app.
	 * Notes:
	 * 1. The version number is merely a representation and a contract with the IA-Message service and does not necessarily represent the core version. Bump this number when new capabilities are introduced to be supported.
	 * 2. Ensure the version number passed in Access Token request to match the version passed in RegisterDeviceCapabilities endpoint request.
	 * 3. Maintain the same version here and in embeddedMessaging#constants.js
	 * @type {string}
	 */
	const capabilitiesVersion = "254";

	// TODO: W-13475085 - confirm event names with CX.
	const APP_LOADED_EVENT_NAME = "ESW_APP_LOADED";
	const APP_INIT_ERROR_EVENT_NAME = "ESW_APP_INITIALIZATION_ERROR";
	const APP_MINIMIZE_EVENT_NAME = "ESW_APP_MINIMIZE";
	const APP_MAXIMIZE_EVENT_NAME = "ESW_APP_MAXIMIZE";
	const EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME = "ESW_SET_JWT_EVENT";
	const EMBEDDED_MESSAGING_CLEAR_WEBSTORAGE_EVENT_NAME = "ESW_CLEAR_WEBSTORAGE_EVENT";
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
	const EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS = "EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS";
	const EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_EVENT_NAME = "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_EVENT";
	const EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_SUCCESS_EVENT_NAME = "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_SUCCESS_EVENT";
	const EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT_NAME = "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT";
	const EMBEDDED_MESSAGING_PREFETCH_EVENT_NAME = "ESW_PREFETCH_LWR_RESOURCES";
	const EMBEDDED_MESSAGING_APP_AFTER_REFRESH = "EMBEDDED_MESSAGING_APP_AFTER_REFRESH";
	const EMBEDDED_MESSAGING_DISPATCH_EVENT_TO_HOST = "EMBEDDED_MESSAGING_DISPATCH_EVENT_TO_HOST";
	const EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_REQUEST_EVENT_NAME = "EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_REQUEST";
	const EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_RESPONSE_EVENT_NAME = "EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_RESPONSE";
	const EMBEDDED_MESSAGING_CONVO_ERROR_DATA_RECEIVED_EVENT_NAME = "EMBEDDED_MESSAGING_CONVO_ERROR_DATA_RECEIVED";
	const ERR_MESSAGE_ORG_NOT_SUPPORTED = "ORG_NOT_SUPPORTED";
	const ERR_MESSAGE_ORG_UNDER_MAINTENANCE = "ORG_UNDER_MAINTENANCE";

	/**
	 * Conversation transcript file name.
	 * @type {string}
	 */
	const EMBEDDED_MESSAGING_TRANSCRIPT_FILENAME = "ConversationTranscript.pdf";

	/**
	 * Hex color constants used for the default chat icon fill colors.
	 */
	const WHITE_HEX_CODE = "#FFFFFF";
	const BLACK_HEX_CODE = "#1A1B1E";
	const A11Y_CONTRAST_THRESHOLD = 3.0;
	const HEX_BASE = 16;

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
		UNAUTH: "UnAuth",
		EXP_SITE_AUTH: "ExperienceSiteAuth"
	}

	/**
	 * The prechat display field name, used in the onEmbeddedMessagingPreChatLoaded & onEmbeddedMessagingPreChatSubmitted.
	 */
	const PRECHAT_DISPLAY_EVENT_DETAIL_NAME = "prechatDisplay"

	/**
	 * The prechat display type enum, used in the 2 prechat standard events, onEmbeddedMessagingPreChatLoaded & onEmbeddedMessagingPreChatSubmitted.
	 */
	const PRECHAT_DISPLAY_EVENT_DETAIL_VALUE = {
		CONVERSATION: "Conversation",
		SESSION: "Session"
	}

	/**
	 * Display mode for the client.
	 */
	const DISPLAY_MODE = {
		INLINE: "inline",
		POPUP: "default"
	}

	/**
	 * The conversation button visibility field name, used in onEmbeddedMessagingButtonCreated.
	 */
	const CONVERSATION_BUTTON_CREATED_EVENT_DETAIL_NAME = "buttonVisibility"

	/**
	 * The conversation button visibility enum, used in onEmbeddedMessagingButtonCreated.
	 */
	const CONVERSATION_BUTTON_CREATED_EVENT_DETAIL_VALUE = {
		SHOW: "Show",
		HIDE: "Hide"
	}

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

	/**
	 * Returns if a string is a valid URL with https protocol
	 *
	 * @param {String} urlStr
	 * @returns Boolean
	 */
	function isHttpsURL(urlStr) {
		try {
			var url = new URL(urlStr);
			return Boolean(url) && url.protocol === "https:";
		}
		catch(e){
			return false;
		}
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

	/**
	 * Event dispatched to notify the Channel Menu that visibility of the Embedded Messaging channel is changing.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_CHANNEL_MENU_VISIBILITY_CHANGE_EVENT_NAME = "onEmbeddedMessagingChannelMenuVisibilityChanged";

	/**
	 * Event dispatched when the MIAW is maximized by the end user.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_WINDOW_MAXIMIZED_EVENT_NAME = "onEmbeddedMessagingWindowMaximized";

	/**
	 * Event dispatched when the MIAW is minimized by the end user.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_WINDOW_MINIMIZED_EVENT_NAME = "onEmbeddedMessagingWindowMinimized";

	/**
	 * Event dispatched when Transcript request fails
	 */
	const ON_EMBEDDED_MESSAGING_TRANSCRIPT_REQUEST_FAILED_EVENT_NAME = "onEmbeddedMessagingTranscriptRequestFailed";

	/**
	 * Event dispatched when Transcript download succeeds
	 */
	const ON_EMBEDDED_MESSAGING_TRANSCRIPT_DOWNLOAD_SUCCESSFUL_EVENT_NAME = "onEmbeddedMessagingTranscriptDownloadSuccessful";

	/**
	 * Event dispatched when conversation is started
	 */
	const ON_EMBEDDED_MESSAGING_CONVERSATION_STARTED_EVENT_NAME = "onEmbeddedMessagingConversationStarted";

	/**
	 * Event dispatched to notify the host that conversation is opened.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGEING_CONVERSATION_OPENED_EVENT_NAME = "onEmbeddedMessagingConversationOpened";

	/**
	 * Event dispatched when the transcript is requested by the end user.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_TRANSCRIPT_REQUESTED_EVENT_NAME = "onEmbeddedMessagingTranscriptRequested";

	/**
	 * Event dispatched to notify the host that prechat is submitted.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_PRECHAT_SUBMITTED_EVENT_NAME = "onEmbeddedMessagingPreChatSubmitted";

	/**
	 * Event dispatched to notify the host that button is clicked.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_BUTTON_CLICKED_EVENT_NAME = "onEmbeddedMessagingButtonClicked";

	/**
	 * Event dispatched to notify the host that the chat button markeup has been added.
	 * @type {string}
	 */
	const ON_EMBEDDED_MESSAGING_BUTTON_CREATED = "onEmbeddedMessagingButtonCreated";

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
		".crm.dev"
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
	 * Flag set to prevent multiple initializations
	 */
	let initialized = false;

	/**
	 * Internal property to track whether the embedded messaging ready event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingReadyEventFired = false;

	/**
	 * Internal property to track whether the embedded messaging initialization success event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingInitSuccessEventFired = false;

	/**
	 * Internal property to track whether the embedded messaging initialization failure event is fired already.
	 * @type {boolean}
	 */
	let hasEmbeddedMessagingInitFailureEventFired = false;

	/**
	 * Internal property to track whether the onEmbeddedMessagingConversationOpened has fired.
	 */
	let hasEmbeddedMessagingConversationOpenedEventFired = false;


	/**
	 * Internal property to track whether the launchChat API has been called.
	 */
	let startingConversation = false;

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
	 * Access token used with each ia-message request. JWT is stored in 1P/3P browser storage as well as held in-memory.
	 * In-memory jwt enables client to continue to make ia-message requests after web storage is cleared (for eg, requesting
	 * a transcript after the conversation is closed) OR if web-storage is inaccessible.
	 *
	 */
	let messagingJwt;

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
	 * Store the experience site user session timer, determines if the session is still valid.
	 */
	let expSiteUserSessionTimer;

	/**
	 * Viewport meta tag that disables autozoom for iOS devices
	 * @type {string}
	 */
	const IOS_VIEWPORT_META_TAG = "width=device-width, initial-scale=1, maximum-scale=1";

	/**
	 * Viewport meta tag for Android devices on Chrome.
	 */
	const ANDROID_CHROME_VIEWPORT_META_TAG = "width=device-width, initial-scale=1, minimum-scale=1, interactive-widget=resizes-content";

	/**
	 * Web storage keys
	 * @type {object}
	 */
	const STORAGE_KEYS = {
		JWT: "JWT",
		FAILED_OUTBOUND_MESSAGE_ENTRIES: "FAILED_MESSAGES",
		CONVERSATION_BUTTON_CLICK_TIME: "CONVERSATION_BUTTON_CLICK_TIME"
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
	 * Regex pattern for extracting if user is on mobile web from navigator.userAgent
	 * Source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
	 * @type {RegExp}
	 */
	const MOBILE_OS_REGEX = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;

	/**
	 * Context of experience site.
	 */
	const EXP_SITE_CONTEXT = {
		AURA: "AURA",
		LWR: "LWR"
	};

	/**
	 * Resolve function for the promise returned by the embeddedservice_bootstrap.userVerificationAPI.clearSession() API.
	 * Tracking the function as an internal property allows us to resolve the promise outside clearSession().
	 * @type {function}
	 */
	let clearUserSessionPromiseResolve;

	/**
	 * Resolve and Reject functions for the promise returned by the embeddedservice_bootstrap.utilAPI.sendTextMessage() API.
	 * Tracking the function as an internal property allows us to resolve the promise outside sendTextMessage() after container has responded.
	 * @type {function}
	 */
	let sendTextMessagePromiseResolve;
	let sendTextMessagePromiseReject;

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

	/**
	 * Constant for Channel Address Identifier claim in ia-message jwt.
	 * @type {string}
	 */
	const MESSAGING_JWT_CHANNEL_ADD_ID_CLAIM = "channelAddId";

	/**
	 * Default dimension for custom window size
	 */
	const DEFAULT_WINDOW_WIDTH = 320;
	const DEFAULT_WINDOW_HEIGHT = 480;

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
	 * Initialize the web storage object for both localStorage & sessionStorage if it doesn't already exist.
	 */
	function initializeWebStorage() {
		let localStorageObj, sessionStorageObj;

		// Only create the structure if this is a new chat session
		const storageObj = JSON.stringify({});

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
			item = storageObj[key];
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
			storageObj[key] = value;
			storage.setItem(storageKey, JSON.stringify(storageObj));
			log("setItemInWebStorage", `${key} set in ${inLocalStorage ? "localStorage" : "sessionStorage"}`);

			if (sendToThirdParty) {
				sendPostMessageToSiteContextIframe(EMBEDDED_MESSAGING_3P_STORAGE_SET_ITEMS_EVENT_NAME,
					{"orgId" : embeddedservice_bootstrap.settings.orgId, "key" : key, "value" : value, "inLocalStorage" : inLocalStorage});
			}
		}
	}

	/**
	 * Remove item from both localStorage and sessionStorage that match the given key.
	 */
	function removeItemInWebStorage(key) {
		if (embeddedservice_bootstrap.isLocalStorageAvailable && localStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(localStorage.getItem(storageKey)) || {};
			delete storageObj[key];
			localStorage.setItem(storageKey, JSON.stringify(storageObj));
		}
		if (embeddedservice_bootstrap.isSessionStorageAvailable && sessionStorage.getItem(storageKey)) {
			const storageObj = JSON.parse(sessionStorage.getItem(storageKey)) || {};
			delete storageObj[key];
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
		// Reset in-memory jwt.
		messagingJwt = undefined;

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

		// Reset hasEmbeddedMessagingInitSuccessEventFired.
		hasEmbeddedMessagingInitSuccessEventFired = false;
		
		// Reset hasEmbeddedMessagingInitFailureEventFired.
		hasEmbeddedMessagingInitFailureEventFired = false;

		// Reset hasEmbeddedMessagingConversationOpenedEventFired.
		hasEmbeddedMessagingConversationOpenedEventFired = false;

		//reset startingConversation
		startingConversation = false;

		// Reset sendTextMessage API promises.
		sendTextMessagePromiseResolve = undefined;
		sendTextMessagePromiseReject = undefined;

		// Reset title notification
		updateTitleNotification();

		// Reset in-memory logs generated in bootstrap.
		cleanUpEmbeddedMessagingLogs();

		// Reset in-memory pre-populate prechat data.
		cleanUpPrepopulateVisiblePrechat();

		log("clearInMemoryData", `Cleared in-memory data.`);

		// Reset conversationId
		const newConversationId = generateUUID();
		log("clearInMemoryData", `Reset conversationId. Old conversationId: ${conversationId} & New conversationId: ${newConversationId}`);
		conversationId = newConversationId;
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
			configDev: embeddedservice_bootstrap.settings.eswConfigDevName,
			method: method ? method : "",
			stateMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "",
			convId: conversationId,
			convType: getAuthMode(),
			hostUrl: window.location.href
		});
		processEmbeddedMessagingLogs(obj);
	}

	/**
	 * Log a warning.
	 *
	 * @param {string} method - Name of caller.
	 * @param {string} message - The warning message to print.
	 * @param {boolean} alwaysOutput - Always log to console regardless of devMode setting.
	 */
	function warning(method, message, alwaysOutput) {
		if(message) {
			outputToConsole("warn", "Warning: " + message, alwaysOutput);
		} else {
			outputToConsole("warn", "EmbeddedServiceBootstrap sent an anonymous warning.", alwaysOutput);
		}

		const obj = {};
		Object.assign(obj, {
			configDev: embeddedservice_bootstrap.settings.eswConfigDevName,
			method: method ? method : "",
			stateMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "",
			convId: conversationId,
			convType: getAuthMode(),
			hostUrl: window.location.href
		});
		processEmbeddedMessagingLogs(obj);
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
			configDev: embeddedservice_bootstrap.settings.eswConfigDevName,
			method: method ? method : "",
			errMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "",
			...(errorCode && {errCode: errorCode}),
			convId: conversationId,
			convType: getAuthMode(),
			hostUrl: window.location.href
		});
		processEmbeddedMessagingLogs(null, obj);
	}

	/**
	 * Some users may have stricter browser security settings.
	 * Determine what web storage APIs are available. Do nothing on error.
	 */
	function detectWebStorageAvailability() {
		try {
			window.localStorage;
		} catch(e) {
			warning("detectWebStorageAvailability", "localStorage is not available. User chat sessions continue only in a single-page view and not across multiple pages.");
			embeddedservice_bootstrap.isLocalStorageAvailable = false;
		}
		try {
			window.sessionStorage;
		} catch(e) {
			warning("detectWebStorageAvailability", "sessionStorage is not available. User chat sessions end after a web page refresh or across browser tabs and windows.");
			embeddedservice_bootstrap.isSessionStorageAvailable = false;
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
	 * See [https://confluence.internal.salesforce.com/display/SCDTEG/Icons) for instructions.
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
						"checkForNativeFunctionOverrides",
						"EmbeddedService Messaging Bootstrap may not function correctly with this native JS function modified: " + objectToCheck.name + "." + nativeFunction,
						true
					);
				}
			});
		});
	}

	/**
	 * Sets in-memory jwt and stores it in web storage for session continuity.
	 * If the iframe is responsible for getting a new JWT, it will send a post message here to notify the parent of the new JWT.
	 * @param {String} jwt - JWT to set in-memory and store in web storage.
	 */
	function setAndStoreJwt(jwt) {
		if(typeof jwt !== "string") {
			error("setAndStoreJwt", `Expected to receive string, instead received: ${jwt}.`);
			return;
		}
		messagingJwt = jwt;
		setItemInWebStorage(STORAGE_KEYS.JWT, messagingJwt);
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

		const snippetSettings = {
			...(imageCompressionOptions && {imageCompressionOptions}),
			...((typeof embeddedservice_bootstrap.settings.enableUserInputForConversationWithBot === "boolean") && {enableUserInputForConversationWithBot: Boolean(embeddedservice_bootstrap.settings.enableUserInputForConversationWithBot)}),
			...((typeof embeddedservice_bootstrap.settings.shouldShowParticipantChgEvntInConvHist === "boolean") && {shouldShowParticipantChgEvntInConvHist: Boolean(embeddedservice_bootstrap.settings.shouldShowParticipantChgEvntInConvHist)}),
			shouldMinimizeWindowOnNewTab: embeddedservice_bootstrap.settings.shouldMinimizeWindowOnNewTab
		};

		const finalConfigurationData = Object.assign({}, embeddedservice_bootstrap.settings.embeddedServiceConfig, {
			identityToken: identityToken,
			failedMessages: failedConversationMessages,
			conversationId,
			devMode: Boolean(embeddedservice_bootstrap.settings.devMode),
			noSsePatch: Boolean(embeddedservice_bootstrap.settings.noSsePatch),
			language: embeddedservice_bootstrap.settings.language,
			...(standardLabelsFromConfiguration && {standardLabels: standardLabelsFromConfiguration}),
			...(customLabelsFromConfiguration && {customLabels: customLabelsFromConfiguration}),
			hasConversationButtonColorContrastMetA11yThreshold: hasConversationButtonColorContrastMetA11yThreshold(),
			hostUrl: window.location.href,
			...(getAuthMode() === AUTH_MODE.EXP_SITE_AUTH && {expSiteUrl: embeddedservice_bootstrap.settings.snippetConfig.expSiteUrl}),
			...(embeddedservice_bootstrap.settings.displayMode && {displayMode: embeddedservice_bootstrap.settings.displayMode}),
			snippetSettings,
			capabilitiesVersion: capabilitiesVersion
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
		// Add aura site event handlers.
		if (isAuraExpSite()) {
			addAuraSiteEventHandlers();
		}

		try {
			// Monitor if the page was refreshed in the same tab.
			const observer = new PerformanceObserver((list) => {
				list.getEntries().forEach((entry) => {
					if (entry.type === "reload") {
						sendPostMessageToAppIframe(EMBEDDED_MESSAGING_APP_AFTER_REFRESH);
					}
				})
			});

			observer.observe({ type: "navigation", buffered: true });
		} catch (err) {
			error("addEventHandlers", `Unable to initialize PerformanceObserver ${err}.`);
		}
	}

	/**
	 * Adds aura site event listeners.
	 */
	function addAuraSiteEventHandlers() {
		if (window.$A.eventService && getAuthMode() === AUTH_MODE.EXP_SITE_AUTH) {
			// Add a logout event handler if we are currently in auth mode and user is logged into aura site
			window.$A.eventService.addHandler({
				"event": "force:logout",
				"handler": handleAuraLogoutEvent
			});
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
		if (isAuraExpSite() && window.$A.eventService && getAuthMode() === AUTH_MODE.EXP_SITE_AUTH) {
			window.$A.eventService.removeHandler({
				"event": "force:logout",
				"handler": handleAuraLogoutEvent
			});
		}
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
						warning("handleMessageEvent", "Unrecognized event name: " + e.data.method);
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
						warning("handleMessageEvent", "Unrecognized event name: " + e.data.method);
						break;
				}
			} else if(getSiteURL().indexOf(e.origin) === 0
				&& embeddedservice_bootstrap.isMessageFromSalesforceDomain(e.origin)
				&& embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame().contentWindow === e.source) {
				let frame = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

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
						embeddedservice_bootstrap.maximizeIframe(frame, e.data.data);
						break;
					case APP_RESET_INITIAL_STATE_EVENT_NAME:
						resetClientToInitialState();
						break;
					//TODO: W-12546287 remove this when we no longer renew authenticated jwt in container.
					case EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME:
						setAndStoreJwt(e.data.data);
						break;
					case EMBEDDED_MESSAGING_CLEAR_WEBSTORAGE_EVENT_NAME:
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
					case EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_EVENT_NAME:
						handleRequestTranscript();
						break;
					case EMBEDDED_MESSAGING_DISPATCH_EVENT_TO_HOST:
						dispatchEventToHost(e.data.data && e.data.data.eventName, {detail: (e.data.data.eventDetails || {})});
						break;
					case EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_RESPONSE_EVENT_NAME:
						handleSendTextMessageResponse(e.data.data);
						break;
					default:
						warning("handleMessageEvent", "Unrecognized event name: " + e.data.method);
						break;
				}
			} else {
				error("handleMessageEvent", `Unexpected message origin: ${e.origin}`);
			}
		}
	}

	/**
	 * Handle conversation button clicks
	 * Dispatch event to host for the first click only
	 */
	function onConversationButtonClick() {
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_BUTTON_CLICKED_EVENT_NAME);
		return handleClick();
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
				if (isUserVerificationEnabled()) {
					handleClearUserSession(false, true);
				}
			}
		}
	}

	/**
	 * Handle aura logout event, clear the session on logout.
	 */
	function handleAuraLogoutEvent() {
		log("handleAuraLogoutEvent", `Received force:logout event in auth mode, proceeds to clear session`);
		return embeddedservice_bootstrap.userVerificationAPI.clearSession();
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
		hasEmbeddedMessagingInitSuccessEventFired = true;
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_INIT_SUCCESS_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingInitSuccessEventFired = false;
			error("emitEmbeddedMessagingInitSuccessEvent", `Something went wrong in firing onEmbeddedMessagingInitSuccess event ${err}.`);
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingInitError' to the host (i.e. customer) window to indicate the client is not rendered.
	 */
	function emitEmbeddedMessagingInitErrorEvent() {
		hasEmbeddedMessagingInitFailureEventFired = true;
		try {
			// Send any pending logs to container, to be pushed to Splunk, even if app initialization fails.
			processEmbeddedMessagingLogs();
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_INIT_ERROR_EVENT_NAME);
		} catch(err) {
			hasEmbeddedMessagingInitFailureEventFired = false;
			error("emitEmbeddedMessagingInitErrorEvent", `Something went wrong in firing onEmbeddedMessagingInitError event ${err}.`);
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingVisibilityChanged' to the menu object to indicate the Embedded Messaging visibility is changing.
	 * @param {Boolean} setUtilAPIVisibility - Visibility value set via utilAPI.
	 */
	function emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(setUtilAPIVisibility) {
		const isVisible = shouldRenderEmbeddedMessagingInChannelMenu(setUtilAPIVisibility);

		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_CHANNEL_MENU_VISIBILITY_CHANGE_EVENT_NAME, {
				detail: {
					devName: embeddedservice_bootstrap.settings.eswConfigDevName,
					isVisible
				}
			});
		} catch(err) {
			error("emitEmbeddedMessagingChannelMenuVisibilityChangeEvent", `Something went wrong in firing emitEmbeddedMessagingChannelMenuVisibilityChange event ${err}.`);
		}
	}

	/**
	 * Fires an event 'onEmbeddedMessagingButtonCreated' to the host (i.e. customer) window to indicate the chat button markup has been added.
	 */
	function emitEmbeddedMessagingButtonCreatedEvent() {
		try {
			dispatchEventToHost(ON_EMBEDDED_MESSAGING_BUTTON_CREATED, {
				detail: {
					[CONVERSATION_BUTTON_CREATED_EVENT_DETAIL_NAME]: !shouldShowChatButtonInInitialState() && !sessionExists() ? CONVERSATION_BUTTON_CREATED_EVENT_DETAIL_VALUE.HIDE : CONVERSATION_BUTTON_CREATED_EVENT_DETAIL_VALUE.SHOW
				}
			});
		} catch(err) {
			error("onEmbeddedMessagingButtonCreated", `Something went wrong in firing onEmbeddedMessagingButtonCreated event ${err}.`);
		}
	}

	/**
	 * Dispatches a custom event with the given name to the host window. Throws an error if something goes wrong while
	 * dispatching the event.
	 * @param eventName - Name of event to dispatch.
	 * @param options - Options to dispatch along with the event.
	 */
	function dispatchEventToHost(eventName, options = { detail: {} }) {
		if (!eventName) {
			throw new Error(`Expected an eventName parameter with a string value. Instead received ${eventName}.`);
		}
		if (options && !('detail' in options)) {
			throw new Error(`The options parameter of the event is malformed: ${options}.`);
		}
		try {
			// Update hasEmbeddedMessagingConversationOpenedEventFired if incoming eventName matches.
			if (eventName === ON_EMBEDDED_MESSAGEING_CONVERSATION_OPENED_EVENT_NAME) {
				hasEmbeddedMessagingConversationOpenedEventFired = true;
			}

			window.dispatchEvent(new CustomEvent(eventName, options));
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
	 * Returns a DOM reference to the inert script tag
	 *
	 * @returns {object}
	 */
	function getInertScript() {
		return document.getElementById(INERT_SCRIPT_ID);
	}


	/**
	 * Set file preview iframe visibility (i.e. show/hide) based on the param value.
	 *
	 * @param {boolean} showFilePreviewFrame
	 */
	function setFilePreviewFrameVisibility(showFilePreviewFrame) {
		const embeddedMessagingFrame = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

		if(embeddedservice_bootstrap.filePreviewFrame && embeddedMessagingFrame) {
			if(Boolean(showFilePreviewFrame)) {
				embeddedservice_bootstrap.filePreviewFrame.classList.add("show");
				embeddedservice_bootstrap.filePreviewFrame.contentWindow.focus();
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "false");
				embeddedMessagingFrame.tabIndex = "-1";
				embeddedMessagingFrame.setAttribute("aria-hidden", "true");
				toggleInertOnMessagingContainer(true);
			} else {
				embeddedservice_bootstrap.filePreviewFrame.classList.remove("show");
				embeddedservice_bootstrap.filePreviewFrame.setAttribute("aria-hidden", "true");
				embeddedMessagingFrame.tabIndex = "0";
				embeddedMessagingFrame.setAttribute("aria-hidden", "false");
				toggleInertOnMessagingContainer(false);
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
		if(!isHttpsURL(downloadData.attachmentDownloadURL)){
			throw new Error(`Invalid attachmentDownloadURL : ${downloadData.attachmentDownloadURL}.`);
		}

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

				if (businessHoursInfo && Array.isArray(businessHoursInfo.businessHours) && businessHoursInfo.businessHours.length > 0) {
					businessHoursInterval = {
						startTime: businessHoursInfo.businessHours[0].startTime,
						endTime: businessHoursInfo.businessHours[0].endTime
					};
					setupBusinessHoursTimer();
				}
			}
		).catch(e => {
				throw e;
			}
		);
	}

	/**
	 * Handle Business Hours request failure to retry the request once.
	 * @returns {Promise}
	 */
	function handleBusinessHoursError(err) {
		error("handleBusinessHoursError", `Failed to retrieve Business Hours data. Retrying the request.`, err);
		return getBusinessHoursInterval();
	}

	/**
    * Continously polls the session timeout from SessionTimeServlet, until the session expires which it will clear the session.
    * SessionTimeServlet returns number <= 0 for expired session/guest user.
	* endpoint is ONLY available in Aura.
    */
	function getExpSiteSessionTimeout() {
		if (embeddedservice_bootstrap.settings.snippetConfig.expSiteUrl) {
			const endpoint = embeddedservice_bootstrap.settings.snippetConfig.expSiteUrl + (isAuraExpSite() ? "" : "vforcesite") + EXP_SITE_SESSION_TIMEOUT + (new Date().getTime());
			return sendXhrRequest(endpoint, "GET", "getExpSiteSessionTimeout").then(response => {
				try {
					// Response text includes some strings before the { }
					response = JSON.parse(response.substring(response.indexOf("{"), response.indexOf("}") + 1));
				} catch(err) {
					error("getExpSiteSessionTimeout", "Error parsing response text from server ", err);
				}

				// sr is the time remaing until session timeout in the response object.
				if (response.sr) {
					log("getExpSiteSessionTimeout", "Successfully retrieved experience site session timeout");
					if (response.sr > 0) {
						// Clear previous timer, if exists
						if (expSiteUserSessionTimer) {
							clearTimeout(expSiteUserSessionTimer);
						}

						// On page load, determine if we should generate markup or continue with existing session.
						// If button is present, (i.e. subsequent timeout), then we skip generating markup.
						if (!getEmbeddedMessagingConversationButton()) {
							if (sessionExists()) {
								handleExistingSession()
							} else {
								embeddedservice_bootstrap.generateMarkup();
							}
						}

						expSiteUserSessionTimer = setTimeout(() => {
							// Poll this endpoint at the end of the timer, to see if session has been extended.
							getExpSiteSessionTimeout();
						}, response.sr * 1000);
					} else {
						// Timeout is 0 or less, so session has expired.
						embeddedservice_bootstrap.userVerificationAPI.clearSession();
					}
				}
			});
		}
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
						if (caller !== 'getExpSiteSessionTimeout') {
							const responseJson = state.responseText ? JSON.parse(state.responseText) : state.responseText;
							resolve(responseJson);
						} else {
							resolve(state.responseText);
						}
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
		if (isUserVerificationEnabled()) {
			return handleGetAuthenticatedJwt().then((jwtData) => {
				return handleListConversation().then((conversationData) => {
					log("initializeConversationState", "finished joining verified user conversation");
					sendConfigurationToAppIframe(jwtData, conversationData);
				}).catch(() => {
					emitEmbeddedMessagingInitErrorEvent();
				});
			});
		} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
			if (!isPrechatStateEnabled()) {
				return handleGetUnauthenticatedJwt().then((jwtData) => {
					return handleCreateNewConversation(hiddenPrechatFields).then((conversationData) => {
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
	 * Initializes the unavailable state in the chat client.
	 * @param errorData - Optional error data to pass to Chat Unavailable State.
	 * @returns {Promise}
	 */
	function initializeChatUnavailableState(errorData) {
		sendConfigurationToAppIframe(null, null, errorData);
		return Promise.resolve();
	}

	/**
	 * Sends configuration data to LWR app. Optional - Adds jwt & conversation data to configuration before sending if specified.
	 * @param jwtData - Optional jwtData (accessToken & lastEventId).
	 * @param conversationData - Optional new or existing conversation data.
	 * @param errorData - Optional error data to pass to Chat Unavailable State.
	 * @param isPageLoad - Whether we are attempting to continue an existing session (using an existing JWT from web storage) on page/script load.
	 */
	function sendConfigurationToAppIframe(jwtData, conversationData, errorData, isPageLoad = false) {
		let configData = prepareConfigurationDataForIframeWindow();

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
		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONFIG_EVENT_NAME, configData);
	}

	/**
	 * Handles pre-chat form submit event from app iframe. This method does the following -
	 * 1. Add hidden pre-chat to visible fields.
	 * 2. For UNAUTH mode,
	 * 		a. If JWT is found in web storage, join the existing conversation (W-13839470).
	 * 		b. Else, create a jwt and a conversation.
	 * 3. In AUTH mode, list existing conversations to check if other tab/device started a conversation after pre-chat form was
	 * rendered but before it was submitted (W-13839470).
	 * 		a. If a conversation already exists, join the conversation.
	 * 		b. Else, create a new conversation.
	 * Finally, send jwt and/or conversation data to LWR app.
	 *
	 * @param visiblePrechatFields - Visible pre-chat fields in the format - {fieldName: fieldValue}
	 */
	function handlePrechatSubmit(visiblePrechatFields) {
		const prechatFields = Object.assign(visiblePrechatFields, hiddenPrechatFields);
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_PRECHAT_SUBMITTED_EVENT_NAME, {
			detail: {
				[PRECHAT_DISPLAY_EVENT_DETAIL_NAME]: PRECHAT_DISPLAY_EVENT_DETAIL_VALUE.CONVERSATION
			}
		});
		if (isUserVerificationEnabled()) {
			handleListConversation().then((existingConversationData) => {
				if (existingConversationData && existingConversationData.isExistingConversation) {
					log("handlePrechatSubmit", `Pre-chat submitted but a conversation already exits for the verified user. Joining the existing conversation.`);
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, existingConversationData);
				} else {
					log("handlePrechatSubmit", `Pre-chat submitted. Creating a new conversation.`);
					handleCreateNewConversation(prechatFields).then((conversationData) => {
						sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, conversationData);
					});
				}
			});
		} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
			if (sessionExists()) {
				log("handlePrechatSubmit", `Pre-chat submitted but a JWT exists in web storage. Fetching existing conversations.`);
				messagingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
				handleGetContinuityJwt().then((jwtData) => {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME, jwtData);
					handleListConversation().then((existingConversationData) => {
						if (existingConversationData && existingConversationData.isExistingConversation) {
							log("handlePrechatSubmit", `Pre-chat submitted but a conversation already exits for the unverified user. Joining the existing conversation.`);
							sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, existingConversationData);
						} else {
							log("handlePrechatSubmit", `Pre-chat submitted and no existing conversations found. Creating a new conversation.`);
							handleCreateNewConversation(prechatFields).then((conversationData) => {
								sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, conversationData);
							});
						}
					});
				});
			} else {
				log("handlePrechatSubmit", `Pre-chat submitted. Fetching a JWT and starting a new conversation.`);
				handleGetUnauthenticatedJwt().then((jwtData) => {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME, jwtData);
					handleCreateNewConversation(prechatFields).then((conversationData) => {
						sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME, conversationData);
					});
				});
			}
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
				setAndStoreJwt(response.accessToken);
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
				setAndStoreJwt(response.accessToken);
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

		return sendRequest(
			endpoint,
			"POST",
			"cors",
			{
				"Content-Type": "application/json"
			},
			{
				orgId,
				developerName,
				capabilitiesVersion
			},
			"getUnauthenticatedJwt"
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
		const jwtPromise = getAuthMode() === AUTH_MODE.EXP_SITE_AUTH ? getExpSiteAuthenticatedJwt() : getAuthenticatedJwt();

		return jwtPromise
			.then(response => {
				const jwtData = getAuthMode() === AUTH_MODE.EXP_SITE_AUTH ? response.data : response;
				setAndStoreJwt(jwtData.accessToken);
				log("handleGetAuthenticatedJwt", "Successfully retreived an Authenticated JWT");
				return jwtData;
			})
			.catch(e => {
				error("handleGetAuthenticatedJwt", `Error retrieving authenticated token: ${e && e.message ? e.message : e}.`);
				handleJwtRetrievalFailure();
			});
	}

	/**
	 * Get a authenticated jwt for experience site.
	 * @returns {Promise}
	 */
	function getExpSiteAuthenticatedJwt() {
		const requestType = "Community";
		const developerName = embeddedservice_bootstrap.settings.eswConfigDevName;
		const channelAddressIdentifier = embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.channelAddressIdentifier || "";
		const platformType = "Web"

		// TODO: Update hardcoded variable in endpoint.
		const endpoint = embeddedservice_bootstrap.settings.snippetConfig.expSiteUrl + EXP_SITE_ACCESS_TOKEN_PATH
			+ `?platformType=${platformType}&requestType=${requestType}&developerName=${developerName}&channelAddressIdentifier=${channelAddressIdentifier}&capabilitiesVersion=${capabilitiesVersion}&deviceId="abcd"`;
		const method = "GET";
		const mode = "cors";
		const caller = "getExpSiteAuthenticatedJwt";

		return sendFetchRequest(endpoint, method, mode, null, null, caller)
			.then(response => {
				if (!response.ok) {
					throw response;
				}
				return response.json();
			})
			.catch(err => {
				return handleSendFetchRequestError(err, endpoint, method, mode, null, null, caller);
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
		const caller = "getAuthenticatedJwt";

		if (customerIdentityToken && validateJwt(customerIdentityToken)) {
			// Send fetch request if identity token has not expired.
			return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller)
				.then(response => {
					if (!response.ok) {
						throw response;
					}
					return response.json();
				})
				.catch(err => {
					return handleSendFetchRequestError(err, apiPath, method, mode, requestHeaders, requestBody, caller);
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
			});
	}

	/**
	 * Makes a network request to RegisterDeviceCapabilities ia-message endpoint to register device capabilities for the version specified in the request.
	 *
	 * Endpoint info: https://confluence.internal.salesforce.com/pages/viewpage.action?pageId=842335446
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
		const channelAddressIdentifier = embeddedservice_bootstrap.settings.restrictSessionOnMessagingChannel ?
			embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.channelAddressIdentifier : null;
		return listConversation(false, channelAddressIdentifier).then(response => {
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
					warning("handleListConversation", `No open conversation found, deleting stale data from web storage.`, true);
					resetClientToInitialState();

					throw new Error(`No open conversation found for JWT in web storage.`);
				}

				if (!isPrechatStateEnabled()) {
					// Pre-chat state is not enabled - start a new conversation.
					warning("handleListConversation", "No existing conversation found and pre-chat is not enabled. Will start a new conversation.");
					return handleCreateNewConversation(hiddenPrechatFields).then((newConversationData) => {
						return newConversationData;
					});
				}
				// No-op since pre-chat is enabled.
				return null;
			}

			if (openConversations.length > 1) {
				warning("handleListConversation", `Expected the user to be participating in 1 open conversation but instead found ${openConversations.length}. Loading the conversation with latest startTimestamp.`);
				openConversations.sort((convA, convB) => convB.startTimestamp - convA.startTimestamp);
			}

			let existingConversationData = openConversations[0];

			if (!isString(existingConversationData.conversationId)) {
				// To restore conversation status and entries, conversationId must be set!
				throw new Error(`Invalid conversation identifier: ${existingConversationData.conversationId}.`);
			}

			log("handleListConversation", `Successfully retrieved existing conversation`);
			if (conversationId !== existingConversationData.conversationId) {
				log("handleListConversation", `ConversationId change detected. Old conversation-id: ${conversationId} & New conversation-id: ${existingConversationData.conversationId}`);
				conversationId = existingConversationData.conversationId;
			}

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
	 * @param {String} channelAddressIdentifier - Whether to filter conversations list by channelAddressIdentifier. Optional.
	 * @returns {Promise}
	 */
	function listConversation(includeClosedConversations, channelAddressIdentifier){
		const endpoint = embeddedservice_bootstrap.settings.scrt2URL.concat(LIST_CONVERSATIONS_PATH);

		return sendRequest(
			endpoint,
			"POST",
			"cors",
			null,
			{
				includeClosedConversations,
				...(channelAddressIdentifier && { channelAddressIdentifier })
			},
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
	 * Returns true if functional fallback is enabled; false otherwise.
	 *
	 * @returns {boolean}
	 */
	function hasFunctionalFallbackEnabled(){
		const functionalFallback = embeddedservice_bootstrap.settings.embeddedServiceConfig.fallbackMessage || {};
		return Boolean(functionalFallback.isFallbackMessageEnabled);
	}

	/**
	 * Handle creating a new conversation for this end user. Also handles registering device capabilities if the conversation creation is successful.
	 *
	 * @param prechatFields - Pre-chat data to be sent with the request. Includes visible and/or hidden pre-chat fields
	 * 							based on pre-chat setup.
	 * @returns {Promise<*>} - Promise which is resolved when creatConversation call completes.
	 */
	function handleCreateNewConversation(prechatFields) {
		//Check if this has already been called
		if (startingConversation) {
			error("handleCreateNewConversation", "Attempting to create new conversation multiple times!", null, true);
			return Promise.resolve();
		}

		if (prechatFields) {
			if (typeof prechatFields === "object") {
				for (const [key, value] of Object.entries(prechatFields)) {
					log("handleCreateNewConversation", `Pre-chat field: ${key} ${value && value.trim().length > 0 ? `is set with a value of ${value.length} characters.` : `is not set.`}`);
				}
			} else {
				error("handleCreateNewConversation", `Expected to receive a valid object for Pre-Chat fields, instead received ${typeof prechatFields}`);
			}
		}

		startingConversation = true;
		return createNewConversation(prechatFields)
			.then((conversationResponse) => {
				//Dispatch ON_EMBEDDED_MESSAGING_CONVERSATION_STARTED event to parent window
				dispatchEventToHost(ON_EMBEDDED_MESSAGING_CONVERSATION_STARTED_EVENT_NAME, { detail: { conversationId } });
				handleRegisterDeviceCapabilities();
				// Track the ES Developer name for the newly created conversation. It would be typically the one from the page snippet.
				conversationResponse.esDeveloperName = embeddedservice_bootstrap.settings.eswConfigDevName;
				log("handleCreateNewConversation", `Initialized the esDeveloperName associated with current conversation to: ${embeddedservice_bootstrap.settings.eswConfigDevName}`);
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
	 * Fetches transcript for the current conversation. Response is a byte array of the transcript PDF.
	 *
	 * @returns {Promise} - Promise that resoles with an ArrayBuffer (byte array) of transcript PDF if request is successful, else an error response object is returned.
	 */
	function getTranscript() {
		const endpoint = embeddedservice_bootstrap.settings.scrt2URL.concat(CONVERSATION_PATH, "/", conversationId, TRANSCRIPT_PATH);
		return sendRequest(
			endpoint,
			"GET",
			"cors",
			null,
			null,
			"getTranscript"
		).then(response => response.arrayBuffer());
	}

	/**
	 * Initializes a blob with byte array and saves the blob to a file.
	 * The MIME type used for blob content (byte array) is "octet/stream".
	 *
	 * @param fileName - File name.
	 * @param arrayBuffer - File content in the form of a byte array.
	 */
	function saveFile(fileName, arrayBuffer) {
		const blob = new Blob([arrayBuffer], {type: "octet/stream"});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		link.click();
		window.URL.revokeObjectURL(url);
	}

	/**
	 * Handles app's request for a transcript. Fetches the transcript and saves it to a PDF file with a pre-defined name.
	 * Notifies app of the request status (success/error) on complete.
	 */
	function handleRequestTranscript() {
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_TRANSCRIPT_REQUESTED_EVENT_NAME, { detail: { conversationId } });
		getTranscript()
			.then((response) => {
				saveFile(EMBEDDED_MESSAGING_TRANSCRIPT_FILENAME, response);
				sendPostMessageToAppIframe(EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_SUCCESS_EVENT_NAME);
				// Dispatch ON_EMBEDDED_MESSAGING_TRANSCRIPT_DOWNLOAD_SUCCESSFUL event to parent window
				dispatchEventToHost(ON_EMBEDDED_MESSAGING_TRANSCRIPT_DOWNLOAD_SUCCESSFUL_EVENT_NAME, { detail: { conversationId } });
			})
			.catch(errResponse => {
				if (errResponse) {
					const errorCode = errResponse.status;
					const errorMessage = errResponse.message || undefined;
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT_NAME, { detail: { errorCode, errorMessage } });
					error("handleRequestTranscript", `Transcript request failed with status code: ${errorCode} & message: ${errorMessage}`, errorCode);
				} else {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT_NAME);
				}
				// Dispatch ON_EMBEDDED_MESSAGING_TRANSCRIPT_DOWNLOAD_FAILED event to parent window
				dispatchEventToHost(ON_EMBEDDED_MESSAGING_TRANSCRIPT_REQUEST_FAILED_EVENT_NAME, { detail: { conversationId } });
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
			log("sendFetchRequest", `${caller} took ${timeElapsed} seconds and returned with the status code ${response.status}`);

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

	/**
	 * Handles failure for HTTP requests using fetch with a specified path, method, mode, headers, and body.
	 * If the first request failed due to a service side error (i.e. 5xx response codes), retry the request once.
	 * If the retry also fails, log ang exit.
	 *
	 * @param {object} err - Error object from the fetch request when it failed the first time.
	 * @param {String} apiPath - Endpoint to make request to.
	 * @param {String} method - HTTP request method (POST, GET, DELETE).
	 * @param {String} mode - HTTP mode (cors, no-cors, same-origin, navigate).
	 * @param {Object} requestHeaders - Headers to include with request.
	 * @param {Object} requestBody - Body to include with request. This method stringifies the object passed in, except when
	 *                               uploading a file. For file attachments, request body must be binary data.
	 * @param {object} caller - Method name where request was made from.
	 *
	 * @returns {Promise}
	 */
	function handleSendFetchRequestError(err, apiPath, method, mode, requestHeaders, requestBody, caller=apiPath) {
		if (!err || !err.status || (err.status >= 500 && err.status <= 599)) {
			error("handleSendFetchRequestError", `Something went wrong in ${caller}: ${err && err.message ? err.message : JSON.stringify(Object.assign({}, err, {status: err.status, statusText: err.statusText, type: err.type}))}. Re-trying the request.`, err && err.status);
			return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller)
				.catch(err => {
					error("handleSendFetchRequestError", `${caller} request failed again: ${err && err.message ? err.message : JSON.stringify(Object.assign({}, err, {status: err.status, statusText: err.statusText, type: err.type}))}.`, err && err.status);
					throw err;
				});
		} else if (err.status === 401) {
			error("handleSendFetchRequestError", `${caller}: ${err && err.message ? err.message : JSON.stringify(Object.assign({}, err, {status: err.status, statusText: err.statusText, type: err.type}))}.`, err && err.status);
			if (getAuthMode() === AUTH_MODE.UNAUTH) {
				clearWebStorage();
				throw err;
			} else if (isUserVerificationEnabled()) {
				// For JWT based auth mode, check if identityToken is still valid.
				// OR currently the client is in experience site auth mode.
				// Then return a pending request promise that's resolved after ia-message JWT is renewed.
				if (identityToken && validateJwt(identityToken) || getAuthMode() === AUTH_MODE.EXP_SITE_AUTH) {
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
		} else if (err.status === 423) {
			const errorData = {};
			Object.assign(errorData, { errorStatus: err.status, errorCode: err.errorCode});

			if (err.errorCode && err.errorCode === ERR_MESSAGE_ORG_UNDER_MAINTENANCE || err.errorCode === ERR_MESSAGE_ORG_NOT_SUPPORTED) {
				error("handleSendFetchRequestError", `Received a ${err.status} in ${caller}: ${err && err.message ? err.message : JSON.stringify(Object.assign({}, err, {status: err.status, statusText: err.statusText, type: err.type}))}`, err && err.status);
				if (hasEmbeddedMessagingInitSuccessEventFired) {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_CONVO_ERROR_DATA_RECEIVED_EVENT_NAME, errorData);
				} else {
					initializeChatUnavailableState(errorData);
				}
			}
		} else {
			// Throw error in case of other errors.
			error("handleSendFetchRequestError", `Something went wrong in ${caller}: ${err && err.message ? err.message : JSON.stringify(Object.assign({}, err, {
				status: err.status,
				statusText: err.statusText,
				type: err.type
			}))}`, err && err.status);
			throw err;
		}
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
	 * @param {String} caller - The caller of this function.
	 * @returns {Promise}
	 */
	function sendRequest(apiPath, method, mode, requestHeaders, requestBody, caller) {
		return sendFetchRequest(apiPath, method, mode, requestHeaders, requestBody, caller)
			.catch(err => {
				return handleSendFetchRequestError(err, apiPath, method, mode, requestHeaders, requestBody, caller);
			});
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
			return embeddedservice_bootstrap.settings.siteURL;
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
	 * Sets --eswButtonBottom & --eswButtonRight CSS properties which determine the location of the static and the minimized button on a page.
	 * bottom, right values are specified using the embeddedservice_bootstrap.settings.chatButtonPosition snippet setting.
	 * For eg, If embeddedservice_bootstrap.settings.chatButtonPosition = "25px, 30px"; , set --eswButtonBottom = 25px, --eswButtonRight = 30px.
	 */
	function setButtonPositionStyles() {
		const position = embeddedservice_bootstrap.settings.chatButtonPosition;
		if (typeof position === "string" && position.length > 0) {
			const positionValues = position.split(",");
			if (positionValues.length !== 2) {
				error("setButtonPositionStyles", `Invalid embeddedservice_bootstrap.settings.chatButtonPosition value specified: ${position}. Valid format is "25px, 30px".`);
				return;
			}
			document.documentElement.style.setProperty("--eswButtonBottom", positionValues[0].trim());
			document.documentElement.style.setProperty("--eswButtonRight", positionValues[1].trim());
		}
	}

	/**
	 * Set loading status for the button after clicking on it. This is to show the loading status of creating an iframe which would load an aura application.
	 */
	function setLoadingStatusForButton() {
		let button = getEmbeddedMessagingConversationButton();
		let iconContainer = document.getElementById(EMBEDDED_MESSAGING_ICON_CONTAINER);
		let chatIcon = document.getElementById(EMBEDDED_MESSAGING_ICON_CHAT);
		let loadingSpinner = document.createElement("div");
		let assistiveTextElement = document.createElement("span");
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

			// [A11Y] Screen reader announce loading status
			assistiveTextElement.className = SLDS_ASSISTIVE_TEXT;
			assistiveTextElement.setAttribute("role", "alert");
			assistiveTextElement.innerHTML = getLabel("EmbeddedMessagingPrechat", "PrechatSubmitButtonLoading") || CHAT_BUTTON_LOADING_ASSISTIVE_TEXT;
			loadingSpinner.appendChild(assistiveTextElement);
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
	 * Determines whether the user is on Android device.
	 * @returns {boolean} True if the user is on Android Device.
	 */
	function isUserAndroid() {
		return getUserEnvironmentDetails().os.name === "Android";
	}

	/**
	 * Determines whether the user is on Chrome browser
	 * @returns {boolean} True if the user is on Chrome browser.
	 */
	function isUserChromeBrowser() {
		return getUserEnvironmentDetails().browser.name === "Chrome";
	}

	/**
	 * Determine whether to show chat button in initial state based on business hours and static setting.
	 * If displayMode is set to inline, then button is hidden.
	 * @returns {boolean} True if chat button should be hidden on page load and false otherwise.
	 */
	function shouldShowChatButtonInInitialState() {
		return isWithinBusinessHours() && !embeddedservice_bootstrap.settings.hideChatButtonOnLoad;
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
			getBusinessHoursInterval()
				.then(setupBusinessHoursTimer())
				.catch(err => {
					return handleBusinessHoursError(err);
				});
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
	function isExpSite() {
		return embeddedservice_bootstrap.settings.snippetConfig.expSiteContext === EXP_SITE_CONTEXT.LWR || isAuraExpSite();
	}

	/**
	 * Check if this file was loaded into a Salesforce Site.
	 *
	 * @return {boolean} True if this page is a Salesforce Site.
	 */
	function isAuraExpSite() {
		return embeddedservice_bootstrap.settings.snippetConfig.expSiteContext === EXP_SITE_CONTEXT.AURA;
	}

	/**
	 *
	 * @returns {boolean} - True if the displayMode flag is set to "inline"
	 */
	function isAppDisplayModeInline() {
		return embeddedservice_bootstrap.settings.displayMode === DISPLAY_MODE.INLINE;
	}

	/**
	 * Determines whether the user is on mobile device, not including tablets.
	 *
	 * @returns {boolean} True if the user is on mobile device.
	 */
	function isMobile() {
		return MOBILE_OS_REGEX.test(navigator.userAgent);
	}

	/**
	 * Determines whether the Embedded Messaging channel should be rendered in Channel Menu.
	 *
	 * @param {Boolean} setUtilAPIVisibility - Visibility value set via utilAPI.
	 * @returns {boolean} True if the Embedded Messaging channel should be rendered and false otherwise.
	 */
	function shouldRenderEmbeddedMessagingInChannelMenu(setUtilAPIVisibility) {
		// Set visibility according to initial state, which is inferred from business hours and hide button static setting.
		let shouldRender = shouldShowChatButtonInInitialState();

		// Set visibility according to show/hide chat button API if value supplied.
		shouldRender = setUtilAPIVisibility !== undefined && setUtilAPIVisibility !== null ? setUtilAPIVisibility : shouldRender;

		// If we are in authenticated mode, set visibility depending on whether the jwt is valid.
		if (getAuthMode() === AUTH_MODE.AUTH) {
			shouldRender = shouldRender && validateJwt(identityToken);
		}

		return shouldRender;
	}

	/**
	 * Create a script element on the parent window for inert.
	 */
	function addInertScript() {
		const script = document.createElement("script");
		const inertURL = `${getSiteURL()}/assets/js/inert${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.js`;

		script.id = INERT_SCRIPT_ID;
		script.type = 'text/javascript';
		script.src = inertURL;

		embeddedservice_bootstrap.settings.targetElement.appendChild(script);
	};

	/**
	 * Toggles the inert attribute on background elements for the page.
	 * The inert attribute needs to be set on sibling elements of the iframe on the page.
	 * @param {boolean} inertEnabled - Whether inert should be enabled on elements.
	 */
	function toggleInertOnSiblingElements(inertEnabled) {
		const siblingElements = embeddedservice_bootstrap.settings.targetElement.children;
		let element;

		for (const index in siblingElements) {
			element = siblingElements[index];
			// Do not apply inert to our iframe elements
			if (element !== getEmbeddedMessagingTopContainer() && element !== embeddedservice_bootstrap.filePreviewFrame) {
				element.inert = inertEnabled;
			}
		}
	}

	/**
	 * [A11Y] Toggles the inert attribute on the messaging container when file preview is opened
	 * @param {boolean} inertEnabled - Whether inert should be enabled.
	 */
	function toggleInertOnMessagingContainer(inertEnabled) {
		const messagingContainer = getEmbeddedMessagingTopContainer();
		if (messagingContainer) {
			messagingContainer.inert = inertEnabled;
		}
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
			const iframe = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

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
				warning("sendPostMessageToAppIframe", `Embedded Messaging iframe not available for post message with method ${method}.`);
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
				warning("sendPostMessageToSiteContextIframe", `Embedded Messaging site context iframe not available for post message with method ${method}.`);
			}
		});
	}

	/**
	 * Send a request to the site context iframe to prefetch resources.
	 */
	function prefetchResources() {
		sendPostMessageToSiteContextIframe(EMBEDDED_MESSAGING_PREFETCH_EVENT_NAME);
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
				let frame = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

				// eslint-disable-next-line no-negated-condition
				if(button && !button.classList.contains(CONVERSATION_BUTTON_LOADED_CLASS)) {
					// W-13899900 - Join existing session if JWT is found in web storage.
					if (sessionExists()) {
						log("handleClick", `Conversation button clicked but a JWT exists in web storage. Joining the existing conversation.`);
						messagingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
						return bootstrapExistingSession(false).then(() => {
							resolve();
						}).catch((err) => {
							emitEmbeddedMessagingInitErrorEvent();
							error("handleClick", err.message);
							reject(err);
						});
					}

					// JWT not found in web storage, initialize a new session.
					// Store Conversation Button's click time in localstorage for later use.
					setItemInWebStorage(STORAGE_KEYS.CONVERSATION_BUTTON_CLICK_TIME, Date.now(), true, true);

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

					// Initialize conversation state and fetch messaging JWTs if functional fallback is not enabled.
					if (hasFunctionalFallbackEnabled()) {
						initializeChatUnavailableState();
					} else {
						initializeConversationState().catch((err) => {
							emitEmbeddedMessagingInitErrorEvent();
							error("handleClick", err.message);
							reject(err);
						});
					}
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
		let frame = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

		if (evt && evt.key) {
			if (evt.key === KEY_CODES.SPACE || evt.key === KEY_CODES.ENTER) {
				evt.preventDefault();
				// SPACE or ENTER fires onclick handler for the button.
				onConversationButtonClick();
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
	 *
	 * @param isPageLoad - Whether we are attempting to continue an existing session on page/script load.
	 */
	function bootstrapExistingSession(isPageLoad) {
		let existingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
		if (existingJwt) {
			// Change the button to a loading icon.
			setLoadingStatusForButton();

			// Create iframes and load app.
			generateIframes().catch(error);

			// Fetch a continuity jwt, load the conversation & send config data to app.
			return handleGetContinuityJwt().then((jwtData) => {
				handleListConversation(isPageLoad).then((conversationData) => {
					sendConfigurationToAppIframe(jwtData, conversationData, null, isPageLoad);
				});
			})
				.catch(error);
		}
	}

	/**
	 * Helper function to generate button markup & bootstrap existing session in web storage.
	 *
	 * When embeddedservice_bootstrap.settings.restrictSessionOnMessagingChannel = true, this function compares the channelAddressIdentifier
	 * received in config to the one set in ia-messsage jwt & clears the existing session on value mismatch. This is useful for customers
	 * who want to clear session on -
	 * 1. user verification change (going from a verified to an unverified deployment)
	 * 2. language-specific auto-response change (customer has language-specific auto-responses configured)
	 * 3. any other channel setting change (like routing, consent keywords, file attachment, inactivity rules)
	 */
	function handleExistingSession() {
		messagingJwt = getItemInWebStorageByKey(STORAGE_KEYS.JWT);
		const channelAddIdFromConfig =  embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.channelAddressIdentifier || "";
		// Extract messaging JWT payload.
		const jwtPayload = parseJwt(messagingJwt) || {};
		// Extract channelAddId claim.
		const channelAddIdFromJwt = jwtPayload[MESSAGING_JWT_CHANNEL_ADD_ID_CLAIM] || "";

		if (embeddedservice_bootstrap.settings.restrictSessionOnMessagingChannel && (channelAddIdFromConfig !== channelAddIdFromJwt)) {
			embeddedservice_bootstrap.userVerificationAPI.clearSession();
			return;
		}

		embeddedservice_bootstrap.generateMarkup(true);
		bootstrapExistingSession(true);
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
		let iframe = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

		if(!iframe) {
			warning("handleAfterAppLoad", "Embedded Messaging iframe not available for post-app-load updates.");
		}

		if(!button) {
			warning("handleAfterAppLoad", "Embedded Messaging static button not available for post-app-load updates.");
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
		log("resetClientToInitialState", `Resetting client to initial state.`);
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

		// [iOS Devices] Restore the meta viewport tag to its original value
		if (originalViewportMetaTag) {
			restoreViewportMetaTag();
		}

		// [Mobile Web] Remove inert state from background elements.
		if (isMobile()) {
			toggleInertOnSiblingElements(false);
		}

		// Remove markup from the page.
		embeddedservice_bootstrap.removeMarkup();

		// Regenerate markup if we are in unverified user mode.
		if (getAuthMode() === AUTH_MODE.UNAUTH) {
			embeddedservice_bootstrap.generateMarkup();

			if (getEmbeddedMessagingConversationButton()) {
				getEmbeddedMessagingConversationButton().focus();
			}
		}
		log("resetClientToInitialState", `Successfully reset client to initial state.`);

		// Resolve clearSession() promise, for both Auth and UnAuth (W-12338093) mode.
		// The reason we do this here is because in some cases we need to wait for the iframe
		// document to process clearSession asynchronousl; see handleClearUserSession
		// and handler for APP_RESET_INITIAL_STATE_EVENT_NAME
		// This should always be the last thing we do in this function.
		resolveClearSessionPromise();
	}


	/**
	 * Remove all markup from the page.
	 * * @param {Boolean} shouldRemoveSiteContextFrame - Indicates whether siteContextFrame should be removed, true for exp site & removeAllComponents API.
	 */
	EmbeddedServiceBootstrap.prototype.removeMarkup = function removeMarkup(shouldRemoveSiteContextFrame) {
		const iframe = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();
		const button = getEmbeddedMessagingConversationButton();
		const modal = getEmbeddedMessagingModal();
		const minimizedNotification = document.getElementById(MINIMIZED_NOTIFICATION_AREA_CLASS);
		const topContainer = getEmbeddedMessagingTopContainer();
		const inertScript = getInertScript();

		if(iframe) {
			// Remove the iframe from DOM. This should take care of clearing Conversation Entries as well.
			iframe.parentNode.removeChild(iframe);
		} else {
			warning("removeMarkup", "Embedded Messaging iframe not available for resetting the client to initial state.");
		}

		if(embeddedservice_bootstrap.filePreviewFrame && embeddedservice_bootstrap.filePreviewFrame.parentNode) {
			// Remove the file preview iframe from DOM.
			embeddedservice_bootstrap.filePreviewFrame.parentNode.removeChild(embeddedservice_bootstrap.filePreviewFrame);
		} else {
			warning("removeMarkup", "Embedded Messaging file preview iframe not available for resetting the client to initial state.");
		}

		if(Boolean(shouldRemoveSiteContextFrame) && embeddedservice_bootstrap.siteContextFrame && embeddedservice_bootstrap.siteContextFrame.parentNode) {
			// Remove the site context iframe from DOM if we are in experience site context.
			embeddedservice_bootstrap.siteContextFrame.parentNode.removeChild(embeddedservice_bootstrap.siteContextFrame);
		} else {
			warning("removeMarkup", "Embedded Messaging site context iframe not available for resetting the client to initial state.");
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
			warning("removeMarkup", "Embedded Messaging static button not available for resetting the client to initial state.");
		}

		// Remove the minimized notification area if exists.
		if (minimizedNotification) {
			minimizedNotification.parentNode.removeChild(minimizedNotification);
		}

		// Remove the top container element.
		if (topContainer) {
			topContainer.parentNode.removeChild(topContainer);
		}

		// Remove inert script
		if (inertScript) {
			inertScript.parentNode.removeChild(inertScript);
		}

		// Emit onEmbeddedMessagingReady event again after resetting the client to initial state for subsequent conversations/sessions.
		embeddedservice_bootstrap.emitEmbeddedMessagingReadyEvent();

		// Emit onEmbeddedMessagingChannelMenuVisibilityChange event to hide the Embedded Messaging channel.
		emitEmbeddedMessagingChannelMenuVisibilityChangeEvent();
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
		topContainerElement.className = TOP_CONTAINER_NAME + (isAppDisplayModeInline() ? `-${DISPLAY_MODE.INLINE}` : "");

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
		buttonElement.addEventListener("click", onConversationButtonClick);
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
		if ((!shouldShowChatButtonInInitialState() && !sessionExists()) || isAppDisplayModeInline()) {
			buttonElement.style.display = "none";
		}

		// Set HTML direction based on language
		if (embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection && typeof embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection === "string") {
			buttonElement.setAttribute("dir", embeddedservice_bootstrap.settings.embeddedServiceConfig.htmlDirection.toLowerCase());
		}

		// Check if it is on experience site
		if (isExpSite()) {
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
	 * 1. it is directly sent to the container via postMessage if the container is ready i.e. on 'ESW_APP_READY_EVENT' event or kept in-memory otherwise.
	 * 2. reset in-memory storage if/when log(s) are sent to the container
	 *
	 * @param {object} currentStateLogObj - a standard/current state log object generated from a log statement in bootstrap, for a change of event
	 * @param {object} errorLogObj - an error log object generated from an error statement in bootstrap, for an encountered error
	 */
	function processEmbeddedMessagingLogs(currentStateLogObj, errorLogObj) {
		currentStateLogObj && embeddedMessagingLogs.currentStateLogs.push(currentStateLogObj);
		errorLogObj && embeddedMessagingLogs.errorLogs.push(errorLogObj);

		lwrIframeReadyPromise.then(() => {
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
		log("setIdentityToken", `Successfully set the customer identity token.`);

		if (embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame()) {
			// If iframe is initialized, replace the identity token passed down during initialization.
			sendPostMessageToAppIframe(EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME, identityToken);
		} else if (!getEmbeddedMessagingConversationButton()) {
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
	 * @param {Boolean} shouldEndSession - Flag to determine if current session should be ended.
	 * @return {Promise} - Promise that resolves after a session is successfully cleared OR is rejected with relevant error message.
	 */
	EmbeddedMessagingUserVerification.prototype.clearSession = function clearSession(shouldEndSession) {
		return new Promise((resolve, reject) => {
			clearUserSessionPromiseResolve = resolve;

			// Cannot be invoked before `afterInit` event has been emitted.
			if (!hasEmbeddedMessagingReadyEventFired) {
				reject(`Method can't be invoked before the onEmbeddedMessagingReady event is fired.`);
				error("clearSession", `Method cannot be invoked before the onEmbeddedMessagingReady event is fired.`);
				return;
			}

			// Revoke JWT only for User Verification.
			handleClearUserSession(isUserVerificationEnabled(),  false, shouldEndSession);
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
	function handleClearUserSession(shouldRevokeJwt, isSecondaryTab, shouldEndSession = false) {
		const iframe = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();
		if (iframe) {
			sendPostMessageToAppIframe(EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME, {shouldRevokeJwt, shouldEndSession});
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
			)
				.then(response => {
					if (pendingRequest.resolve && typeof pendingRequest.resolve === "function") {
						pendingRequest.resolve(response);
					}
				})
				.catch(err => {
					return handleSendFetchRequestError(err, pendingRequest.apiPath, pendingRequest.method, pendingRequest.mode, pendingRequest.requestHeaders, pendingRequest.requestBody);
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
			warning("handleIdentityTokenExpiredEvent", `handleIdentityTokenExpiredEvent method called but User Verification isn’t enabled in Messaging Settings.`);
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
	 * @param {Object} token - token to be validated.
	 * @returns true if identity token is valid and false otherwise.
	 */
	function validateIdentityToken(identityTokenType, token) {
		let isValid = false;

		switch(identityTokenType) {
			case ID_TOKEN_TYPE.JWT:
				isValid = validateJwt(token);
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

		// Perform null check on the token
		if (!jwt) {
			if (Boolean(embeddedservice_bootstrap.settings.devMode)) {
				log("validateJwt", `Empty jwt parameter passed in - skipping validation.`);
			}
			return false;
		}

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
			authMode = embeddedservice_bootstrap.settings.embeddedServiceConfig && embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel && embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode;
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
			log("resolveClearSessionPromise", "Resolved Clear Session promise.");
			clearUserSessionPromiseResolve = undefined;
		}
	}

	/**
	 * Helper function to check if currently user verification is enabled, either JWT based OR experience site.
	 *
	 * @returns {Boolean} True if either JWT based user verification or experience site user verification is enabled.
	 */
	function isUserVerificationEnabled() {
		return getAuthMode() === AUTH_MODE.AUTH || getAuthMode() === AUTH_MODE.EXP_SITE_AUTH;
	}

	/****************************************
	 *		HIDDEN/VISIBLE PRECHAT API      *
	 /****************************************/
	/* Hidden/Visible Prechat functions exposed in window.embeddedservice_bootstrap.prechatAPI for setting/updating and removing hidden/visible prechat fields.
	 *
	 * @class
	 */
	function EmbeddedMessagingPrechat() {}

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
	 * Validates a Hidden/Visible Pre-Chat field set by host in setHiddenPrechatFields/setVisiblePrechatFields method.
	 * @return {boolean} True if fieldName and/or fieldValue are valid and False otherwise.
	 */
	function validatePrechatField(caller, fieldName, fieldValue, isEditableByEndUser) {
		const isHiddenField = caller === 'setHiddenPrechatFields';
		const prechatFieldsFromConfig = isHiddenField ? getHiddenPrechatFieldsFromConfig() : getVisiblePrechatFieldsFromConfig();
		// List of field names from configuration response.
		const prechatFieldNamesFromConfig = prechatFieldsFromConfig.map(({ name }) => name);
		// Field name object from configuration response for the passed in fieldName.
		const prechatField = prechatFieldsFromConfig.find(fields => fields.name === fieldName);

		if (!prechatFieldNamesFromConfig.includes(fieldName)) {
			error("validatePrechatField", `${caller} called with an invalid field name ${fieldName}.`);
			return false;
		}

		if (typeof fieldValue ==='string' && (fieldValue.toLowerCase().includes("javascript:") || fieldValue.toLowerCase().includes("<script>"))) {
			error("validatePrechatField", `JavaScript isn't allowed in the value for the ${fieldName} field when calling ${caller}.`);
			return false;
		}

		if (fieldValue && String(fieldValue).length > prechatField['maxLength']) {
			error("validatePrechatField", `Value for the ${fieldName} field in ${caller} exceeds the maximum length restriction of ${prechatField['maxLength']} characters.`);
			return false;
		}

		// These checks are only applicable to hidden fields.
		if (isHiddenField) {
			if (typeof fieldValue !== "string") {
				error("validatePrechatField", `You must specify a string for the ${fieldName} field in ${caller} instead of a ${typeof fieldValue} value.`);
				return false;
			}
		}

		// This check is only applicable to visible fields.
		if (isEditableByEndUser && typeof isEditableByEndUser !== 'boolean') {
			error("validatePrechatField", `setVisiblePrechatFields was called with isEditableByEndUser set to a value that’s not boolean. Enter a boolean value.`);
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
				if (validatePrechatField('setHiddenPrechatFields', fieldName, fieldValue)) {
					hiddenPrechatFields[fieldName] = fieldValue;
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
	 * @param {object} hiddenFields - Object with key-value pairs, with 2 fields in each object. (i.e. field value, editability boolean flag).
	 */
	EmbeddedMessagingPrechat.prototype.setVisiblePrechatFields = function setVisiblePrechatFields(visibleFields) {
		if (!shouldProcessPrechatFieldsFromHost('setVisiblePrechatFields')) {
			return;
		}
		const formFields = getVisiblePrechatFieldsFromConfig();

		if (visibleFields && typeof visibleFields === 'object' && !Array.isArray(visibleFields)) {
			const visibleFieldsEntries = Object.entries(visibleFields);

			for (const [fieldName, fieldData] of visibleFieldsEntries) {
				if (validatePrechatField('setVisiblePrechatFields', fieldName, fieldData.value, fieldData['isEditableByEndUser'])) {
					const matchedField = formFields.find((field) => field.name === fieldName);
					matchedField['value'] = fieldData['value'];

					// Only set the value if the variable is boolean (i.e. defined)
					if (typeof fieldData['isEditableByEndUser'] === 'boolean') {
						matchedField['isEditableByEndUser'] = fieldData['isEditableByEndUser'];
					}

					// Log successful update action on Visible Prechat fields for debugging purposes.
					log("setVisiblePrechatFields", `[setVisiblePrechatFields] Successfully updated Visible Pre-Chat field ${fieldName}.`);
				}
			}

			// Send updated pre-filled visible fields to iframe.
			if (visibleFieldsEntries.length) {
				appLoadedPromise.then(() => {
					sendPostMessageToAppIframe(EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS, getVisiblePrechatFieldsFromConfig());
				});
			}
		} else {
			error("setVisiblePrechatFields", `setVisiblePrechatFields was called with an invalid object. Pass in an object with key-value pairs.`);
		}
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE
	 * A publicly exposed api for the host (i.e. customer) to invoke and unset Visible Prechat field(s).
	 * Unset existing Visible Prechat field(s) with the passed in key name.
	 *
	 * @param {object} visibleFields - Array of field names to be unset
	 */
	EmbeddedMessagingPrechat.prototype.unsetVisiblePrechatFields = function unsetVisiblePrechatFields(visibleFields) {
		if (!shouldProcessPrechatFieldsFromHost('unsetVisiblePrechatFields')) {
			return;
		}
		const formFields = getVisiblePrechatFieldsFromConfig();

		if (visibleFields && Array.isArray(visibleFields) && visibleFields.length) {
			visibleFields.forEach((fieldName) => {
				const matchedField = formFields.find((field) => field.name === fieldName);
				if (matchedField) {
					delete matchedField['value'];
					delete matchedField['isEditableByEndUser'];

					// Log successful unset action on Visible Prechat fields for debugging purposes.
					log("unsetVisiblePrechatFields", `[unsetVisiblePrechatFields] Successfully unset Visible Pre-Chat field ${fieldName}.`);
				} else {
					error("unsetVisiblePrechatFields", `unsetVisiblePrechatFields was called with an invalid field name: ${fieldName}. Enter a valid field name to remove.`);
				}
			});

			// Send updated pre-filled visible fields to iframe.
			appLoadedPromise.then(() => {
				sendPostMessageToAppIframe(EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS, getVisiblePrechatFieldsFromConfig());
			});
		} else {
			error("unsetVisiblePrechatFields", `When calling unsetVisiblePrechatFields, you must pass in an array of fields.`);
		};
	}

	/**
	 * Clean up in-memory pre-populate prechat data set by API.
	 */
	function cleanUpPrepopulateVisiblePrechat() {
		getVisiblePrechatFieldsFromConfig().forEach((field) => {
			delete field['value'];
			delete field['isEditableByEndUser'];
		});
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
	function EmbeddedMessagingAutoResponse() {}

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
					// Log successfully updated auto-response parameters for debugging purposes.
					log("setAutoResponseParameters", `[setAutoResponseParameters] Successfully updated auto-response parameter ${paramKey}`);
				} else {
					warning("setAutoResponseParameters", `[setAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`)
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
					// Log successfully removed auto-response page parameter for debugging purposes.
					log("removeAutoResponseParameters", `[removeAutoResponseParameters] Successfully removed auto-response parameter ${paramKey}`);
				} else {
					warning("removeAutoResponseParameters", `[removeAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`);
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
	 * Returns a DOM reference to the embedded messaging iframe.
	 *
	 * @returns {object}
	 */
	EmbeddedMessagingUtil.prototype.getEmbeddedMessagingFrame = function getEmbeddedMessagingFrame() {
		return document.getElementById(LWR_IFRAME_NAME);
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * API for prefetching static LWR resource
	 */
	EmbeddedMessagingUtil.prototype.prefetchResources = prefetchResources;

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
			} else if (isChannelMenuDeployment()) {
				emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(true);
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
		if (!embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame()) {
			const conversationButton = getEmbeddedMessagingConversationButton();
			if (conversationButton) {
				conversationButton.style.display = "none";
				return true;
			} else if (isChannelMenuDeployment()) {
				emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(false);
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
				if (!(hasEmbeddedMessagingInitSuccessEventFired || hasEmbeddedMessagingInitFailureEventFired)) {
					successMessage = `[Launch Chat API] The messaging client initialized successfully or failed event isn’t fired.`;

					warning("launchChat", successMessage);
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
				if (!(hasEmbeddedMessagingInitSuccessEventFired || hasEmbeddedMessagingInitFailureEventFired)) {
					errorMessage = `[Launch Chat API] The messaging client initialized successfully or failed event isn’t fired.`;

					warning("launchChat", errorMessage);
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

					warning("launchChat", consoleMessage);
					reject(consoleMessage);

					return;
				}

				// Cannot be invoked if static button is not present.
				if (!getEmbeddedMessagingConversationButton()) {
					if(isChannelMenuDeployment() && (!isUserVerificationEnabled() || isUserVerificationEnabled() && identityToken)) {
						// [W-13992566] Generate button markup for Channel Menu only.
						embeddedservice_bootstrap.generateMarkup(true);
					} else {
						consoleMessage = `[Launch Chat API] Default chat button isn’t present. Check if the messaging client initialized successfully.`;

						warning("launchChat", consoleMessage);
						reject(consoleMessage);

						return;
					}
				}

				// Handle invocation when iframe is already present.
				if (embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame()) {
					let iframe = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();
					// Maximize the iframe if it's minimized, else return.
					if (iframe && iframe.classList && iframe.classList.contains(MODAL_ISMINIMIZED_CLASS)) {
						let successMessage;

						sendPostMessageToAppIframe(APP_MAXIMIZE_EVENT_NAME);

						successMessage = `[Launch Chat API] Successfully maximized the messaging client.`;

						log("launchChat", successMessage);
						resolve(successMessage);

						return;
					}

					consoleMessage = `[Launch Chat API] The messaging client window is already present and maximized.`;

					warning("launchChat", consoleMessage);
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

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly expose API for the host (i.e. customer) to send text message.
	 * @returns {Promise}
	 */
	EmbeddedMessagingUtil.prototype.sendTextMessage = function sendTextMessage(text) {
		return new Promise((resolve, reject) => {
			try {
				if (!hasEmbeddedMessagingConversationOpenedEventFired) {
					const errorMsg = "[Send Text Message API] Can’t invoke API before the onEmbeddedMessagingConversationOpened event is fired.";
					error("sendTextMessage", errorMsg);
					reject(errorMsg);

					return;
				}
				// Store the promise for later use, once container responds.
				sendTextMessagePromiseResolve = resolve;
				sendTextMessagePromiseReject = reject;
				// Calling container's send text message API.
				sendPostMessageToAppIframe(EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_REQUEST_EVENT_NAME, text);
			} catch(e) {
				sendTextMessagePromiseResolve = undefined;
				sendTextMessagePromiseReject = undefined;

				const errorMsg = `[Send Text Message API] Something went wrong sending text message: ${e}`;
				error("sendTextMessage", errorMsg);
				reject(errorMsg);
			}
		});
	}

	/**
	 * EXTERNAL API - DO NOT CHANGE SHAPE!
	 * A publicly expose API for the host (i.e. customer) to remove all MIAW components off the page
	 * This should only be called after clearSession().
	 * @returns {Promise}
	 */
	EmbeddedMessagingUtil.prototype.removeAllComponents = function removeAllComponents() {
		return new Promise((resolve) => {
			// Remove markup from the page.
			embeddedservice_bootstrap.removeMarkup(true);
			embeddedservice_bootstrap.removeEventHandlers();

			// Remove CSS file.
			if (document.querySelector(`#${BOOTSTRAP_CSS_NAME}`)) {
				document.querySelector(`#${BOOTSTRAP_CSS_NAME}`).remove();
			}

			// Remove bootstrap file.
			const bootstrapSrc = `${getSiteURL()}/assets/js/bootstrap` + (embeddedservice_bootstrap.settings.devMode ? "" : ".min") + ".js";
			if (document.body.querySelector(`script[src="${bootstrapSrc}"]`)) {
				document.body.querySelector(`script[src="${bootstrapSrc}"]`).remove();
			}

			log("removeAllComponents", `Successfully removed all components.`);

			// Remove all javascript objects.
			delete window.embeddedservice_bootstrap;

			resolve();
		});
	}

	/**
	 * Helper function for receiving container's post message after sendTextMessage API is called.
	 * @param {Object} data - response object from the server.
	 */
	function handleSendTextMessageResponse(data) {
		if (data.success) {
			sendTextMessagePromiseResolve();
		} else {
			sendTextMessagePromiseReject(data.error);
		}
		sendTextMessagePromiseResolve = undefined;
		sendTextMessagePromiseReject = undefined;
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
		if(isExpSite() && messageOrigin === document.domain) {
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

		if (isChannelMenuDeployment() && !generateMarkupInChannelMenu) {
			emitEmbeddedMessagingChannelMenuVisibilityChangeEvent();
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

		emitEmbeddedMessagingButtonCreatedEvent();

		// Generate inert script if not found in DOM.
		if(!getInertScript()) {
			addInertScript();
		}
	};

	/**
	 * Create an iframe on the parent window for executing code in site (3rd party) context
	 * withot loading entire LWR app. See sitecontext.js
	 */
	function createSiteContextFrame() {
		const siteContextFrame = document.createElement("iframe");
		const siteContextFrameUrl = new URL(`${getSiteURL()}/assets/htdocs/sitecontext${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.html`);
		siteContextFrameUrl.searchParams.set("parent_domain", window.location.origin);
		if (embeddedservice_bootstrap.settings.devMode){
			siteContextFrameUrl.searchParams.set("dev_mode", true);
		}

		siteContextFrame.classList.add(SITE_CONTEXT_IFRAME_NAME);
		siteContextFrame.id = SITE_CONTEXT_IFRAME_NAME;
		siteContextFrame.name = SITE_CONTEXT_IFRAME_NAME;
		siteContextFrame.src = siteContextFrameUrl.href;

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
		const filePreviewFrameUrl = new URL(`${getSiteURL()}/assets/htdocs/filepreview${(embeddedservice_bootstrap.settings.devMode ? "" : ".min")}.html`);
		filePreviewFrameUrl.searchParams.set("parent_domain", window.location.origin);

		filePreviewFrame.classList.add(FILE_PREVIEW_IFRAME_NAME);
		filePreviewFrame.id = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.name = FILE_PREVIEW_IFRAME_NAME;
		filePreviewFrame.src = filePreviewFrameUrl.href;
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
				iframe.setAttribute("role", "dialog");
				iframe.setAttribute("aria-modal", "true");

				if (isAppDisplayModeInline()) {
					iframe.classList.add(LWR_INLINE_IFRAME_CLASS);
				}

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
				} else if (isExpSite()) {
					iframe.classList.add(EXPERIENCE_SITE);
				} else if (isDesktop()) {
					iframe.classList.add(IS_DESKTOP);
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
	EmbeddedServiceBootstrap.prototype.maximizeIframe = function maximizeIframe(frame, data) {
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

			const width = data && data.width ? `${data.width}px` : `${DEFAULT_WINDOW_WIDTH}px`;
			const height = data && data.height ? `${data.height}px` : `${DEFAULT_WINDOW_HEIGHT}px`;
			document.documentElement.style.setProperty("--eswWidth", width);
			document.documentElement.style.setProperty("--eswHeight", height);
		}

		if(button) {
			// Static button is displayed under client when maximized.
			button.style.display = "none";

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

		// Modify the meta viewport tag
		// For IOS or Android Chrome devices.
		if (isiOS && viewportMetaTag) {
			originalViewportMetaTag = viewportMetaTag.content;
			viewportMetaTag.setAttribute("content", IOS_VIEWPORT_META_TAG);
		} else if (isUserAndroid() && isUserChromeBrowser() && viewportMetaTag) {
			originalViewportMetaTag = viewportMetaTag.content;
			viewportMetaTag.setAttribute("content", ANDROID_CHROME_VIEWPORT_META_TAG);
		}

		// [A11Y] Only on mobile web
		if (isMobile()) {
			toggleInertOnSiblingElements(true);
		}

		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME);
		log("maximizeIframe", `Maximized the app`);
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_WINDOW_MAXIMIZED_EVENT_NAME);
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

		// [A11Y] Only on mobile web
		if (isMobile()) {
			toggleInertOnSiblingElements(false);
		}

		sendPostMessageToAppIframe(EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME);
		log("minimizeIframe", `Minimized the app`);
		dispatchEventToHost(ON_EMBEDDED_MESSAGING_WINDOW_MINIMIZED_EVENT_NAME);
	};

	/**
	 * Resize iframe to fit the minimize state notification area (modal).
	 */
	function handleShowMinimizedStateNotification() {
		const embeddedMessagingFrame = embeddedservice_bootstrap.utilAPI.getEmbeddedMessagingFrame();

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
		if (initialized) {
			error("init", "Attempted to initialize bootstrap multiple times", null, true);
			return;
		}
		initialized = true;
		try {
			embeddedservice_bootstrap.settings.orgId = orgId;
			embeddedservice_bootstrap.settings.eswConfigDevName = eswConfigDevName;
			embeddedservice_bootstrap.settings.siteURL = siteURL;
			embeddedservice_bootstrap.settings.snippetConfig = snippetConfig;

			// Initialize a conversationId.
			conversationId = generateUUID();
			log("init", `Initialized a new conversationId: ${conversationId}`);

			mergeSettings(snippetConfig || {});

			validateInitParams();

			detectWebStorageAvailability();

			checkForNativeFunctionOverrides();

			if(!embeddedservice_bootstrap.settings.targetElement) throw new Error("No targetElement specified.");

			addEventHandlers();

			// Set button {bottom, right} CSS styles from snippet settings.
			setButtonPositionStyles();

			// Check to see whether browser has bottom tab bar.
			embeddedservice_bootstrap.settings.hasBottomTabBar = isUseriOS15plusSafari();

			// isAuraSite - Temporary setting to fallback to Aura embeddedService.app. To be removed in W-10165756.
			embeddedservice_bootstrap.settings.isAuraSite = Boolean(embeddedservice_bootstrap.settings.isAuraSite);

			// Default app to use sandbox on iframe unless the flag is turned on.
			embeddedservice_bootstrap.settings.omitSandbox = Boolean(embeddedservice_bootstrap.settings.omitSandbox);

			// Whether to clear the session on messaging channel change & filter listConversation response by channelAddressIdentifier.
			embeddedservice_bootstrap.settings.restrictSessionOnMessagingChannel = Boolean(embeddedservice_bootstrap.settings.restrictSessionOnMessagingChannel);

			// Whether to minimize the chat window when continuing an existing session in a new tab.
			embeddedservice_bootstrap.settings.shouldMinimizeWindowOnNewTab = Boolean(embeddedservice_bootstrap.settings.shouldMinimizeWindowOnNewTab);

			// Load CSS file for bootstrap.js from GSLB.
			const cssPromise = loadCSS().then(
				Promise.resolve.bind(Promise),
				() => {
					// Retry loading CSS file from Core, if failed to load from GSLB.
					return loadCSS(getSiteURL());
				}
			).catch(
				() => {
					emitEmbeddedMessagingInitErrorEvent();
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

					// Experience site user verification, since the setting is on a page level, it will override the org setting.
					if (isExpSite()) {
						log("init", `Messaging for Web used in ${embeddedservice_bootstrap.settings.snippetConfig.expSiteContext} Experience Site context.`);
						if (embeddedservice_bootstrap.settings.expSiteAuthMode) {
							embeddedservice_bootstrap.settings.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode = AUTH_MODE.EXP_SITE_AUTH;
						}
					} else {
						log("init", "Messaging for Web used in External Site context.");
					}

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
					emitEmbeddedMessagingInitErrorEvent();
					throw new Error("Unable to load Embedded Messaging configuration.");
				}
			);

			//once we have config we can check 3rd party storage
			configPromise.then(() => {
				sendPostMessageToSiteContextIframe(
					EMBEDDED_MESSAGING_3P_STORAGE_REQUEST_EVENT_NAME, {orgId : embeddedservice_bootstrap.settings.orgId});
				if(!embeddedservice_bootstrap.settings.disablePrefetch) {
					prefetchResources();
				}
			});

			// Retrieve Business Hours intervals for the deployment.
			const businessHoursPromise = getBusinessHoursInterval()
				.then(
					Promise.resolve.bind(Promise),
					(err) => {
						return handleBusinessHoursError(err);
					}
				)
				.catch(err => {
					error("init", `Failed to retrieve Business Hours data.`, err);
					emitEmbeddedMessagingInitErrorEvent();
					throw new Error("Failed to retrieve Business Hours data.");
				});

			// Show button when we've loaded everything.
			Promise.all([cssPromise, configPromise, businessHoursPromise, sessionDataPromise]).then(() => {
				initializeWebStorage();

				logWebStorageItemsOnInit();

				embeddedservice_bootstrap.initializeFeatureObjects();

				embeddedservice_bootstrap.emitEmbeddedMessagingReadyEvent();

				// For experience site auth mode, markup is generated if user is logged in.
				// If session exists in web storage, generate button markup and bootstrap the session.
				// Else, generate button markup only for unauth mode. For external site auth mode, markup is generated in #setIdentityToken() API.
				// For MIAW in Channel Menu, static button markup is generated on menu item click in #bootstrapEmbeddedMessaging() API
				if (getAuthMode() === AUTH_MODE.EXP_SITE_AUTH) {
					getExpSiteSessionTimeout();
				} else if (sessionExists()) {
					handleExistingSession();
				} else if (getAuthMode() === AUTH_MODE.UNAUTH) {
					embeddedservice_bootstrap.generateMarkup();
				}

				// Launch chat immediately on init in inline display mode.
				if (isAppDisplayModeInline()) {
					embeddedservice_bootstrap.utilAPI.launchChat();
				}
			});
		} catch(err) {
			emitEmbeddedMessagingInitErrorEvent();
			error("init", `Error: ${err}`);
		}
	};
	if (!window.embeddedservice_bootstrap) {
		window.embeddedservice_bootstrap = new EmbeddedServiceBootstrap();
	} else {
		error("bootstrap load", "attempting to load MIAW script when one is already loaded", null, true);
	}
})();
