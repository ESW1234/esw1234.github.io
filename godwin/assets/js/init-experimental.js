(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /*
     * Copyright 2025 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * Event name constants for communication.
     */
    // TODO: W-13475085 - confirm event names with CX.
    const EVENT = {
        APP_LOADED_EVENT_NAME: "ESW_APP_LOADED",
        APP_INIT_ERROR_EVENT_NAME: "ESW_APP_INITIALIZATION_ERROR",
        APP_MINIMIZE_EVENT_NAME: "ESW_APP_MINIMIZE",
        APP_MAXIMIZE_EVENT_NAME: "ESW_APP_MAXIMIZE",
        EMBEDDED_MESSAGING_SET_JWT_EVENT_NAME: "ESW_SET_JWT_EVENT",
        EMBEDDED_MESSAGING_CLEAR_WEBSTORAGE_EVENT_NAME: "ESW_CLEAR_WEBSTORAGE_EVENT",
        EMBEDDED_MESSAGING_APP_READY_EVENT_NAME: "ESW_APP_READY_EVENT",
        EMBEDDED_MESSAGING_SET_CONFIG_EVENT_NAME: "ESW_SET_CONFIG_EVENT",
        APP_RESET_INITIAL_STATE_EVENT_NAME: "ESW_APP_RESET_INITIAL_STATE",
        EMBEDDED_MESSAGING_DOWNLOAD_FILE: "ESW_DOWNLOAD_FILE",
        EMBEDDED_MESSAGING_UPDATE_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME: "ESW_SET_WEBSTORAGE_FAILEDMESSAGES_EVENT",
        EMBEDDED_MESSAGING_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT_NAME: "ESW_CLEAN_UP_WEBSTORAGE_FAILEDMESSAGES_EVENT",
        EMBEDDED_MESSAGING_MAXIMIZE_RESIZING_COMPLETED_EVENT_NAME: "ESW_APP_MAXIMIZATION_RESIZING_COMPLETED",
        EMBEDDED_MESSAGING_MINIMIZE_RESIZING_COMPLETED_EVENT_NAME: "ESW_APP_MINIMIZATION_RESIZING_COMPLETED",
        EMBEDDED_MESSAGING_UPDATE_TITLE_NOTIFICATION: "ESW_APP_UPDATE_TITLE_NOTIFICATION",
        EMBEDDED_MESSAGING_3P_STORAGE_READY_EVENT_NAME: "ESW_3RDPARTY_STORAGE_READY",
        EMBEDDED_MESSAGING_SHOW_FILE_PREVIEW_FRAME_EVENT_NAME: "ESW_APP_SHOW_FILE_PREVIEW_FRAME",
        EMBEDDED_MESSAGING_HIDE_FILE_PREVIEW_FRAME_EVENT_NAME: "ESW_APP_HIDE_FILE_PREVIEW_FRAME",
        APP_REQUEST_HIDDEN_PRECHAT_FIELDS_EVENT_NAME: "ESW_APP_SEND_HIDDEN_PRECHAT_FIELDS",
        APP_RECEIVE_HIDDEN_PRECHAT_FIELDS_EVENT_NAME: "ESW_APP_RECEIVE_HIDDEN_PRECHAT_FIELDS",
        APP_REQUEST_AUTORESPONSE_PARAMETERS_EVENT_NAME: "ESW_APP_SEND_AUTORESPONSE_PARAMETERS",
        APP_RECEIVE_AUTORESPONSE_PARAMETERS_EVENT_NAME: "ESW_APP_RECEIVE_AUTORESPONSE_PARAMETERS",
        EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT_NAME: "EMBEDDED_MESSAGING_SET_CONVERSATION_DATA_EVENT",
        EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT_NAME: "EMBEDDED_MESSAGING_CLEAR_USER_SESSION_EVENT",
        EMBEDDED_MESSAGING_FOCUS_ON_LAST_FOCUSABLE_ELEMENT_EVENT_NAME: "trapfocustolast",
        EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT_NAME: "EMBEDDED_MESSAGING_IDENTITY_TOKEN_EXPIRED_EVENT",
        EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT_NAME: "EMBEDDED_MESSAGING_SET_IDENTITY_TOKEN_EVENT",
        EMBEDDED_MESSAGING_JWT_RETRIEVAL_FAILURE_EVENT_NAME: "EMBEDDED_MESSAGING_JWT_RETRIEVAL_FAILURE_EVENT",
        EMBEDDED_MESSAGING_3P_STORAGE_RESPONSE_EVENT_NAME: "ESW_3RDPARTY_STORAGE_RESPONSE",
        EMBEDDED_MESSAGING_3P_STORAGE_REQUEST_EVENT_NAME: "ESW_3RDPARTY_STORAGE_REQUEST",
        EMBEDDED_MESSAGING_3P_STORAGE_SET_ITEMS_EVENT_NAME: "ESW_3RDPARTY_STORAGE_SET_ITEMS",
        EMBEDDED_MESSAGING_3P_STORAGE_CLEAR_ITEMS_EVENT_NAME: "ESW_3RDPARTY_STORAGE_CLEAR",
        EMBEDDED_MESSAGING_3P_STORAGE_SET_OBJECTS_EVENT_NAME: "ESW_3RDPARTY_STORAGE_SET_OBJECTS",
        APP_PRECHAT_SUBMIT: "ESW_APP_PRECHAT_SUBMIT",
        APP_SHOW_MINIMIZED_STATE_NOTIFICATION: "ESW_APP_SHOW_MINIMIZED_STATE_NOTIFICATION",
        EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS: "EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS",
        EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS: "EMBEDDED_MESSAGING_PUSH_VISIBLE_PRECHAT_FIELDS",
        EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_EVENT_NAME: "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_EVENT",
        EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_SUCCESS_EVENT_NAME: "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_SUCCESS_EVENT",
        EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT_NAME: "EMBEDDED_MESSAGING_REQUEST_TRANSCRIPT_ERROR_EVENT",
        EMBEDDED_MESSAGING_PREFETCH_EVENT_NAME: "ESW_PREFETCH_LWR_RESOURCES",
        EMBEDDED_MESSAGING_APP_AFTER_REFRESH: "EMBEDDED_MESSAGING_APP_AFTER_REFRESH",
        EMBEDDED_MESSAGING_DISPATCH_EVENT_TO_HOST: "EMBEDDED_MESSAGING_DISPATCH_EVENT_TO_HOST",
        EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_REQUEST_EVENT_NAME: "EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_REQUEST",
        EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_RESPONSE_EVENT_NAME: "EMBEDDED_MESSAGING_PUBLIC_SEND_TEXT_MESSAGE_API_RESPONSE",
        EMBEDDED_MESSAGING_CONVO_ERROR_DATA_RECEIVED_EVENT_NAME: "EMBEDDED_MESSAGING_CONVO_ERROR_DATA_RECEIVED",
        EMBEDDED_MESSAGING_SCREENREADER_ANNOUNCEMENT: "EMBEDDED_MESSAGING_SCREENREADER_ANNOUNCEMENT",
        EMBEDDED_MESSAGING_INVITATIONS_NO_CONDITIONS_CONFIGURED: "EMBEDDED_MESSAGING_INVITATIONS_NO_CONDITIONS_CONFIGURED",
        EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_CREATED: "EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_CREATED",
        EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_EVALUATED: "EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_EVALUATED",
        EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_CREATION_ERROR: "EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_CREATION_ERROR",
        EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_EVALUATION_ERROR: "EMBEDDED_MESSAGING_INVITATIONS_RULE_TREE_EVALUATION_ERROR",
        EMBEDDED_MESSAGING_INVITATIONS_CONDITIONS_MET: "EMBEDDED_MESSAGING_INVITATIONS_CONDITIONS_MET",
        EMBEDDED_MESSAGING_TEXT_MESSAGE_LINK_CLICK: "EMBEDDED_MESSAGING_TEXT_MESSAGE_LINK_CLICK",
        ESW_APP_RESET_AND_RELAUNCH_EVENT_NAME: "ESW_APP_RESET_AND_RELAUNCH",
        EMBEDDED_MESSAGING_CLEAR_USER_SESSION_ERROR: "EMBEDDED_MESSAGING_CLEAR_USER_SESSION_ERROR"
    };

    /*
     * Copyright 2025 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * LoggingUtils class for processing embedded messaging logs.
     * Tracks pending logs in-memory and sends to the container via postMessage/rpc depending on client when ready.
     * Singleton pattern - use getInstance() to get the instance.
     */
    class LoggingUtils {
        /**
         * Private constructor to enforce singleton pattern.
         * Use getInstance() instead.
         * @param {Promise<void>} appReadyPromise - promise that resolves when the app is ready
         * @param {(eventType: string, data: any) => void} [sendPostMessageToAppIframe] - function to send postMessage to the app iframe
         * @param {LoggingUtilsConfig} config - configuration for logging
         */
        constructor(appReadyPromise, config, sendPostMessageToAppIframe) {
            this.pendingLogs = {
                currentStateLogs: [],
                errorLogs: []
            };
            this.appReadyPromise = appReadyPromise;
            this.sendPostMessageToAppIframe = sendPostMessageToAppIframe;
            this.config = config;
        }
        isClientVersionV1() {
            var _a;
            return ((_a = this.config) === null || _a === void 0 ? void 0 : _a.clientVersion) === 'v1';
        }
        /**
         * Gets the singleton instance of LoggingUtils.
         * - If instance exists, returns it and optionally updates config if provided (appReadyPromise and sendPostMessageToAppIframe are ignored).
         * - If no instance exists and parameters are provided, creates and returns a new instance.
         * - If no instance exists and no parameters are provided, throws an error.
         *
         * @param {object} [config] - configuration for logging (will update existing instance's config if provided)
         * @param {Promise<void>} [appReadyPromise] - promise that resolves when the app is ready (required on first call only)
         * @param {(eventType: string, data: any) => void} [sendPostMessageToAppIframe] - function to send postMessage to the app iframe (required on first call only)
         * @returns {LoggingUtils} The singleton instance
         * @throws {Error} If no instance exists and appReadyPromise is not provided
         */
        static getInstance(config, appReadyPromise, sendPostMessageToAppIframe) {
            if (!LoggingUtils.instance) {
                if (!appReadyPromise || !config) {
                    throw new Error("LoggingUtils.getInstance() requires appReadyPromise and config parameters on first call.");
                }
                LoggingUtils.instance = new LoggingUtils(appReadyPromise, config, sendPostMessageToAppIframe);
            }
            else if (config) {
                // Update config if provided
                Object.assign(LoggingUtils.instance.config, config);
            }
            return LoggingUtils.instance;
        }
        setRpcManager(rpcManager) {
            this.rpcManager = rpcManager;
        }
        /**
         * Creates a log object with the provided parameters.
         * @private
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The log message.
         * @param {string} [errorCode] - Optional error code (only for error logs).
         * @param {boolean} isErrorLog - Whether this is an error log (true) or state log (false).
         * @returns {any} The created log object.
         */
        createLogObject(method, message, errorCode, isErrorLog = false) {
            var _a, _b, _c, _d, _e;
            const baseLogObj = {
                configDev: ((_a = this.config) === null || _a === void 0 ? void 0 : _a.eswConfigDevName) || "",
                method: method || "",
                convId: ((_c = (_b = this.config) === null || _b === void 0 ? void 0 : _b.getConversationId) === null || _c === void 0 ? void 0 : _c.call(_b)) || "",
                convType: ((_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.getAuthMode) === null || _e === void 0 ? void 0 : _e.call(_d)) || "",
                hostUrl: window.location.href
            };
            if (isErrorLog) {
                return Object.assign(Object.assign(Object.assign({}, baseLogObj), { errMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "" }), (errorCode && { errCode: errorCode }));
            }
            else {
                return Object.assign(Object.assign({}, baseLogObj), { stateMessage: message ? `[bootstrap][timestamp: ${Date.now()}] ${message}` : "" });
            }
        }
        /**
         * Processes embedded messaging logs generated from bootstrap.js. When a log is generated,
         * 1. it is directly sent to the container via postMessage/rpc if the container is ready i.e. on 'ESW_APP_READY_EVENT' event or kept in-memory otherwise.
         * 2. reset in-memory storage if/when log(s) are sent to the container
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The log message.
         * @param {string} [errorCode] - Optional error code (only for error logs).
         * @param {boolean} isErrorLog - Whether this is an error log (true) or state log (false).
         */
        processEmbeddedMessagingLogs(method, message, errorCode, isErrorLog = false) {
            if (method && message) {
                const logObj = this.createLogObject(method, message, errorCode, isErrorLog);
                isErrorLog ? this.pendingLogs.errorLogs.push(logObj) : this.pendingLogs.currentStateLogs.push(logObj);
            }
            this.appReadyPromise.then(() => {
                // TODO: Handle v2 communication here via rpcManager.
                if (this.isClientVersionV1() && this.sendPostMessageToAppIframe) {
                    this.sendPostMessageToAppIframe(EVENT.EMBEDDED_MESSAGING_PUSH_PARENT_FRAME_LOGS, { pendingLogs: this.pendingLogs });
                }
                this.cleanUpEmbeddedMessagingLogs();
            });
        }
        /**
         * Clean up logs generated from bootstrap.js in-memory.
         */
        cleanUpEmbeddedMessagingLogs() {
            this.pendingLogs = {
                currentStateLogs: [],
                errorLogs: []
            };
        }
        /**
         * Output to console if devMode is enabled.
         * @private
         */
        outputToConsole(method, args) {
            var _a;
            if (((_a = this.config) === null || _a === void 0 ? void 0 : _a.devMode) && console && console[method]) {
                console[method]("[EmbeddedServiceBootstrap] " + args);
            }
        }
        /**
         * Log a message to the console.
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The log message to print and optionally push to Splunk.
         */
        log(method, message) {
            this.outputToConsole("log", message);
            this.processEmbeddedMessagingLogs(method, message);
        }
        /**
         * Log a debug message to the console.
         * Debug messages are only output to console (not sent to Splunk) and only when devMode is enabled.
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The debug message to print.
         */
        debug(method, message) {
            this.outputToConsole("debug", message);
            this.processEmbeddedMessagingLogs(method, message);
        }
        /**
         * Log a warning.
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The warning message to print.
         */
        warning(method, message) {
            this.outputToConsole("warn", "Warning: " + (message ? message : "EmbeddedServiceBootstrap sent an anonymous warning."));
            this.processEmbeddedMessagingLogs(method, message);
        }
        /**
         * Log an error.
         *
         * @param {string} method - Name of caller.
         * @param {string} message - The error message to print.
         * @param {string} [errorCode] - Optional error code if the caller was a network request.
         */
        error(method, message, errorCode) {
            this.outputToConsole("error", (message ? message : "EmbeddedServiceBootstrap responded with an unspecified error."));
            this.processEmbeddedMessagingLogs(method, message, errorCode, true);
        }
    }

    /*
     * Copyright 2025 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * Business Hours Utilities for Enhanced Chat V1 & V2
     * This file contains business hours related utilities that can be used across the 2 clients.
     */
    /**
     * Business Hours Utilities Class
     * Manages business hours intervals, timers, and API interactions
     */
    class BusinessHoursUtils {
        /**
         * Constructor
         * @param config - Configuration object
         * @throws {Error} If any required parameter is missing
         */
        constructor(config) {
            /**
             * LoggingUtils instance
             */
            this.loggingUtils = LoggingUtils.getInstance();
            if (!config) {
                throw new Error('BusinessHoursUtils: config must be provided');
            }
            // Validate all required parameters
            const requiredFields = [
                'orgId',
                'scrt2URL',
                'eswConfigDevName',
                'businessHoursTimerCallback'
            ];
            for (const field of requiredFields) {
                if (!config[field]) {
                    throw new Error(`BusinessHoursUtils: ${field} is required`);
                }
            }
            this.orgId = config.orgId;
            this.scrt2URL = config.scrt2URL;
            this.eswConfigDevName = config.eswConfigDevName;
            this.businessHoursTimerCallback = config.businessHoursTimerCallback;
        }
        /**
         * Determines whether we are currently within business hours
         * @returns True if within business hours, or business hours is not configured
         */
        isWithinBusinessHours() {
            // Interval is empty, then it is ALWAYS in business hours.
            if (!this.businessHoursInterval) {
                return true;
            }
            const startTime = Number(this.businessHoursInterval.startTime);
            const endTime = Number(this.businessHoursInterval.endTime);
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
         * Uses stored businessHoursTimerCallback.
         */
        setupBusinessHoursTimer() {
            let targetTime;
            if (!this.businessHoursInterval) {
                return;
            }
            const isCurrentlyWithinBH = this.isWithinBusinessHours();
            // Determine which interval to use based on business hours
            // If current time is not within BH, then it is before the first interval
            // Otherwise, it is within a BH interval.
            if (!isCurrentlyWithinBH) {
                targetTime = Number(this.businessHoursInterval.startTime);
            }
            else {
                targetTime = Number(this.businessHoursInterval.endTime);
            }
            if (!isNaN(targetTime)) {
                // Clear previous timer, if exists
                if (this.businessHoursTimer) {
                    clearTimeout(this.businessHoursTimer);
                    this.businessHoursTimer = undefined;
                }
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                this.businessHoursTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    // Clean up this executed timer
                    if (this.businessHoursTimer) {
                        clearTimeout(this.businessHoursTimer);
                    }
                    this.businessHoursTimer = undefined;
                    yield this.businessHoursTimerCallback(isCurrentlyWithinBH);
                }), (targetTime - Date.now()));
            }
        }
        /**
         * Send an HTTP request using fetch with a specified path, and method.
         * @private
         * @param apiPath g- The API endpoint to call
         * @param method - HTTP method (GET, POST, etc.)
         * @param caller - Name of the calling function for logging
         * @returns Promise that resolves with the response data
         */
        sendRequest(apiPath, method, caller) {
            return __awaiter(this, void 0, void 0, function* () {
                const startTime = performance.now();
                try {
                    const response = yield fetch(apiPath, {
                        method: method
                    });
                    const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3);
                    // Business hours return 204 if no business hours is associated with the deployment.
                    if (response.status === 200 || response.status === 204) {
                        const responseJson = response.status === 204 ? '' : yield response.json();
                        this.loggingUtils.debug("sendRequest", `${caller ? caller : apiPath} took ${timeElapsed} seconds and returned with the status code ${response.status}`);
                        return responseJson;
                    }
                    this.loggingUtils.debug("sendRequest", `${caller ? caller : apiPath} took ${timeElapsed} seconds and returned with the status code ${response.status}`);
                    throw response.status;
                }
                catch (error) {
                    const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(3);
                    this.loggingUtils.debug("sendRequest", `${caller ? caller : apiPath} took ${timeElapsed} seconds and failed with error`, error);
                    throw error;
                }
            });
        }
        /**
         * Load business hours data from SCRT2 API.
         * Gets business hours interval data, stores it internally, and sets up the business hours timer.
         * Uses stored businessHoursTimerCallback.
         *
         * @returns Promise that resolves when business hours are loaded and timer is set
         */
        loadBusinessHours() {
            return new Promise((resolve) => {
                const endpoint = this.scrt2URL + "/" + BusinessHoursUtils.constants.IN_APP_SCRT2_API_PREFIX + "/" + BusinessHoursUtils.constants.IN_APP_SCRT2_API_VERSION +
                    "/businesshours?orgId=" + this.orgId + "&esConfigName=" + this.eswConfigDevName;
                this.sendRequest(endpoint, "GET", "loadBusinessHours")
                    .then(response => {
                    const businessHoursInfo = response === null || response === void 0 ? void 0 : response.businessHoursInfo;
                    this.loggingUtils.debug("loadBusinessHours", "Successfully retrieved Business Hours data");
                    if (businessHoursInfo && Array.isArray(businessHoursInfo.businessHours) && businessHoursInfo.businessHours.length > 0) {
                        const currentTime = Date.now();
                        // Find the first non-stale interval
                        const validInterval = businessHoursInfo.businessHours.find(interval => interval.endTime >= currentTime);
                        if (validInterval) {
                            // Log if we skipped any stale intervals
                            if (businessHoursInfo.businessHours.indexOf(validInterval) > 0) {
                                this.loggingUtils.debug("loadBusinessHours", "Skipping stale business hours interval(s)");
                            }
                            this.businessHoursInterval = {
                                startTime: validInterval.startTime,
                                endTime: validInterval.endTime
                            };
                            this.loggingUtils.debug("loadBusinessHours", "Business hours loaded successfully");
                            // Setup business hours timer with stored callback
                            this.setupBusinessHoursTimer();
                        }
                        else {
                            this.loggingUtils.debug("loadBusinessHours", "All business hours intervals are stale, no data available");
                        }
                    }
                    else {
                        this.loggingUtils.debug("loadBusinessHours", "No business hours data available");
                    }
                    resolve();
                })
                    .catch(error => {
                    this.loggingUtils.error("loadBusinessHours", `Error loading business hours: ${error}`);
                    resolve(); // Resolve anyway to not block initialization
                });
            });
        }
        /**
         * Clear business hours timer
         */
        clearBusinessHoursTimer() {
            if (this.businessHoursTimer) {
                clearTimeout(this.businessHoursTimer);
                this.businessHoursTimer = undefined;
            }
        }
        /**
         * Get current business hours interval
         * @returns Current business hours interval or undefined if not set
         */
        getCurrentBusinessHoursInterval() {
            return this.businessHoursInterval;
        }
        /**
         * Set business hours interval manually
         * @param interval - Business hours interval with startTime and endTime
         */
        setBusinessHoursInterval(interval) {
            this.businessHoursInterval = interval;
        }
    }
    /**
     * Constants for business hours events and API configuration
     */
    BusinessHoursUtils.constants = {
        ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_STARTED_EVENT_NAME: "onEmbeddedMessagingBusinessHoursStarted",
        ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME: "onEmbeddedMessagingBusinessHoursEnded",
        ON_EMBEDDED_MESSAGING_WITHIN_BUSINESS_HOURS_EVENT_NAME: "onEmbeddedMessagingWithinBusinessHours",
        IN_APP_SCRT2_API_PREFIX: "embeddedservice",
        IN_APP_SCRT2_API_VERSION: "v1"
    };

    /*
     * Copyright 2025 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * Validates a Hidden/Visible Pre-Chat field set by host in setHiddenPrechatFields/setVisiblePrechatFields method.
     * @param caller - The name of the calling function (e.g., 'setHiddenPrechatFields' or 'setVisiblePrechatFields')
     * @param fieldName - The name of the field to validate
     * @param fieldValue - The value to validate
     * @param prechatFieldsFromConfig - Array of prechat fields from configuration
     * @param isEditableByEndUser - Optional boolean indicating if the field is editable by end user (for visible fields only)
     * @return {boolean} True if fieldName and/or fieldValue are valid and False otherwise.
     */
    function validatePrechatField(caller, fieldName, fieldValue, prechatFieldsFromConfig, isEditableByEndUser) {
        const isHiddenField = caller === 'setHiddenPrechatFields';
        // List of field names from configuration response.
        const prechatFieldNamesFromConfig = prechatFieldsFromConfig.map(({ name }) => name);
        // Field name object from configuration response for the passed in fieldName.
        const prechatField = prechatFieldsFromConfig.find((fields) => fields.name === fieldName);
        const loggingUtils = LoggingUtils.getInstance();
        if (!prechatFieldNamesFromConfig.includes(fieldName)) {
            loggingUtils.error('validatePrechatField', `${caller} called with an invalid field name ${fieldName}.`);
            return false;
        }
        if (typeof fieldValue === 'string' &&
            (fieldValue.toLowerCase().includes('javascript:') || fieldValue.toLowerCase().includes('<script>'))) {
            loggingUtils.error('validatePrechatField', `JavaScript isn't allowed in the value for the ${fieldName} field when calling ${caller}.`);
            return false;
        }
        if (fieldValue && (prechatField === null || prechatField === void 0 ? void 0 : prechatField.maxLength) && String(fieldValue).length > prechatField.maxLength) {
            loggingUtils.error('validatePrechatField', `Value for the ${fieldName} field in ${caller} exceeds the maximum length restriction of ${prechatField.maxLength} characters.`);
            return false;
        }
        // These checks are only applicable to hidden fields.
        if (isHiddenField) {
            if (typeof fieldValue !== 'string') {
                loggingUtils.error('validatePrechatField', `You must specify a string for the ${fieldName} field in ${caller} instead of a ${typeof fieldValue} value.`);
                return false;
            }
        }
        // This check is only applicable to visible fields.
        if (isEditableByEndUser !== undefined && typeof isEditableByEndUser !== 'boolean') {
            loggingUtils.error('validatePrechatField', `setVisiblePrechatFields was called with isEditableByEndUser set to a value that's not boolean. Enter a boolean value.`);
            return false;
        }
        return true;
    }

    /*
     * Copyright 2026 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * Validate an auto-response's page query string parameter set by host via the `setAutoResponseParameters` API method
     * @param {String} parameterName - Key of auto-response page parameter provided by host.
     * @param {String} parameterValue - Value of auto-response page parameter provided by host.
     * @returns {Boolean} Returns true if parameter key and/or value are valid. Otherwise, returns false.
     */
    function validateAutoResponseParameter(parameterName, parameterValue) {
        const loggingUtils = LoggingUtils.getInstance();
        if (typeof parameterName !== "string" || parameterName.trim().length < 1) {
            loggingUtils.error("validateAutoResponseParameter", `Expected a non-empty string for the parameter name, but received ${typeof parameterName}`);
            return false;
        }
        if (typeof parameterValue !== "string" || parameterValue.trim().length < 1) {
            loggingUtils.error("validateAutoResponseParameter", `Expected a non-empty string for the parameter value, but received ${typeof parameterValue}`);
            return false;
        }
        return true;
    }

    const IN_APP_SCRT2_API_PREFIX = "embeddedservice";
    const IN_APP_SCRT2_API_VERSION = "v1";
    /**
     *  Conversation Status.
     */
    const CONVERSATION_STATUS = {
        NOT_STARTED: "NOT_STARTED",
        OPEN: "OPEN",
        CLOSED: "CLOSED",
    };
    /**
     * Parent page elements class constants.
     */
    const TOP_CONTAINER_NAME = "embedded-messaging";
    const LWR_IFRAME_NAME = "embeddedMessagingFrame";
    const LWR_IFRAME_TITLE = "Chat Window";
    const PREVENT_SCROLLING_CLASS = "embeddedMessagingPreventScrolling";
    /**
     *  Auth Modes.
     */
    const AUTH_MODE = {
        AUTH: "Auth",
        UNAUTH: "UnAuth",
        EXP_SITE_AUTH: "ExperienceSiteAuth",
        SALESFORCE_SESSION_AUTH: "SalesforceSessionAuth"
    };
    /**
     * Auth modes that are considered authenticated i.e user verification is enabled on the messaging channel.
     */
    const AUTHENTICATED_MODES = [AUTH_MODE.AUTH, AUTH_MODE.SALESFORCE_SESSION_AUTH, AUTH_MODE.EXP_SITE_AUTH];
    /**
     * Auth modes that require an identity token to be set.
     */
    const ID_TOKEN_AUTH_MODES = [AUTH_MODE.AUTH, AUTH_MODE.SALESFORCE_SESSION_AUTH];
    /**
     * Identity token types.
     */
    const ID_TOKEN_TYPE = {
        JWT: "JWT",
        SalesforceSessionToken: "SalesforceSessionToken"
    };
    /**
     * Experience Site Context constants.
     */
    const EXP_SITE_CONTEXT = {
        AURA: "AURA",
        LWR: "LWR"
    };
    /**
     * Channel Menu channel types.
     */
    const CHANNEL_TYPE = {
        EMBEDDED_MESSAGING: "EmbeddedMessaging"
    };

    class ConfigUtils {
        /**
         * Validates that all required fields in the SCRT configuration are present and have correct types.
         * @returns {boolean} True if the configuration is valid, false otherwise.
         */
        validateConfigResponse() {
            const { embeddedServiceConfig, standardLabels } = this.scrtConfig;
            // Validate top-level config
            if (!embeddedServiceConfig) {
                return false;
            }
            // Validate standardLabels array
            if (!Array.isArray(standardLabels)) {
                return false;
            }
            // Validate string fields
            if (typeof embeddedServiceConfig.siteUrl !== 'string' ||
                typeof embeddedServiceConfig.deploymentType !== 'string' ||
                typeof embeddedServiceConfig.site !== 'string' ||
                typeof embeddedServiceConfig.name !== 'string') {
                return false;
            }
            // Validate htmlDirection enum
            if (embeddedServiceConfig.htmlDirection !== 'LTR' && embeddedServiceConfig.htmlDirection !== 'RTL') {
                return false;
            }
            // Validate array fields
            if (!Array.isArray(embeddedServiceConfig.branding) ||
                !Array.isArray(embeddedServiceConfig.customLabels) ||
                !Array.isArray(embeddedServiceConfig.forms)) {
                return false;
            }
            // Validate object fields
            if (embeddedServiceConfig.attachments === null ||
                typeof embeddedServiceConfig.attachments !== 'object' ||
                embeddedServiceConfig.fallbackMessage === null ||
                typeof embeddedServiceConfig.fallbackMessage !== 'object' ||
                embeddedServiceConfig.embeddedServiceMessagingChannel === null ||
                typeof embeddedServiceConfig.embeddedServiceMessagingChannel !== 'object' ||
                embeddedServiceConfig.termsAndConditions === null ||
                typeof embeddedServiceConfig.termsAndConditions !== 'object' ||
                embeddedServiceConfig.transcript === null ||
                typeof embeddedServiceConfig.transcript !== 'object' ||
                embeddedServiceConfig.choiceListConfig === null ||
                typeof embeddedServiceConfig.choiceListConfig !== 'object' ||
                embeddedServiceConfig.messagingChannel === null ||
                typeof embeddedServiceConfig.messagingChannel !== 'object') {
                return false;
            }
            return true;
        }
        /**
         * Validates that all required fields in the init() parameters are present and have correct types.
         * @returns {boolean} True if the settings are valid, false otherwise.
         */
        validateInitSettings() {
            const { orgId, eswConfigDevName, siteURL, snippetConfig, language } = this.initSettings;
            if (typeof orgId !== 'string' || typeof eswConfigDevName !== 'string' || typeof siteURL !== 'string' || typeof language !== 'string' || typeof (snippetConfig === null || snippetConfig === void 0 ? void 0 : snippetConfig.scrt2URL) !== 'string') {
                return false;
            }
            return true;
        }
        /**
         * Creates a new instance of ConfigUtils with the provided configuration.
         * @param {InitSettings} initSettings - The parameters from init()
         * @throws {Error} Throws an error if the configuration is invalid.
         */
        constructor(initSettings) {
            /**
             * LoggingUtils instance
             */
            this.loggingUtils = LoggingUtils.getInstance();
            this.initSettings = initSettings;
            if (!this.validateInitSettings()) {
                throw new Error('ConfigUtils: init() parameters are invalid');
            }
        }
        /**
         * Loads the configuration settings from SCRT, stores and validates them.
         * @returns {Promise<void>} A promise that resolves when the configuration is loaded and validated.
         */
        loadConfigurationSettings() {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const configurationUrl = `${this.getScrt2URL()}/${IN_APP_SCRT2_API_PREFIX}/${IN_APP_SCRT2_API_VERSION}/embedded-service-config?orgId=${this.getOrgId()}&esConfigName=${this.getEswConfigDevName()}&language=${this.getLanguage()}`;
                    fetch(configurationUrl)
                        .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    }).then((data) => {
                        this.scrtConfig = data;
                        if (!this.validateConfigResponse()) {
                            throw new Error('ConfigUtils: SCRT config is invalid');
                        }
                        this.loggingUtils.debug("loadConfigurationSettings", `Configuration settings loaded.`);
                        resolve();
                    })
                        .catch(error => {
                        this.loggingUtils.error("loadConfigurationSettings", `Error loading configuration settings: ${error}`);
                        reject(error);
                    });
                });
            });
        }
        /**
         * init settings getters
         */
        getScrt2URL() {
            return this.initSettings.snippetConfig.scrt2URL;
        }
        getOrgId() {
            return this.initSettings.orgId;
        }
        getEswConfigDevName() {
            return this.initSettings.eswConfigDevName;
        }
        getLanguage() {
            return this.initSettings.language;
        }
        getSiteURL() {
            return this.initSettings.siteURL;
        }
        getExpSiteURL() {
            return this.initSettings.snippetConfig.expSiteUrl;
        }
        getExpSiteContext() {
            return this.initSettings.snippetConfig.expSiteContext;
        }
        getIsExpSiteGuestUser() {
            return this.initSettings.snippetConfig.isExpSiteGuestUser;
        }
        /**
         * Gets the standard labels.
         * @returns {LabelConfig[]} Array of standard label configurations.
         */
        getStandardLabels() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.standardLabels;
        }
        /**
         * Gets the custom labels.
         * @returns {LabelConfig[]} Array of custom label configurations.
         */
        getCustomLabels() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.customLabels;
        }
        /**
         * Gets the branding configuration.
         * @returns {BrandingConfig[]} Array of branding configurations.
         */
        getBranding() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.branding;
        }
        /**
         * Gets the visible pre-chat form fields.
         * @returns {PrechatField[]} Array of visible pre-chat form fields.
         */
        getVisiblePrechatFormFields() {
            var _a, _b;
            return ((_b = (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.forms[0]) === null || _b === void 0 ? void 0 : _b.formFields) || [];
        }
        /**
         * Gets the hidden pre-chat form fields.
         * @returns {PrechatField[]} Array of hidden pre-chat form fields.
         */
        getHiddenPrechatFormFields() {
            var _a, _b;
            return ((_b = (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.forms[0]) === null || _b === void 0 ? void 0 : _b.hiddenFormFields) || [];
        }
        /**
         * Gets the terms and conditions configuration.
         * @returns {TermsAndConditionsConfig} The terms and conditions configuration.
         */
        getTermsAndConditions() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.termsAndConditions;
        }
        /**
         * Gets the transcript configuration.
         * @returns {TranscriptConfig} The transcript configuration.
         */
        getTranscript() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.transcript;
        }
        /**
         * Gets the choice list configuration.
         * @returns {ChoiceListConfig} The choice list configuration.
         */
        getChoiceList() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.choiceListConfig;
        }
        /**
         * Gets the user verification mode
         * @returns {AuthMode} The user verification mode.
         */
        getAuthMode() {
            var _a, _b, _c, _d, _e, _f, _g;
            return (_d = (_c = (_b = (_a = this.mergedSettings) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig) === null || _b === void 0 ? void 0 : _b.embeddedServiceMessagingChannel) === null || _c === void 0 ? void 0 : _c.authMode) !== null && _d !== void 0 ? _d : (_g = (_f = (_e = this.scrtConfig) === null || _e === void 0 ? void 0 : _e.embeddedServiceConfig) === null || _f === void 0 ? void 0 : _f.embeddedServiceMessagingChannel) === null || _g === void 0 ? void 0 : _g.authMode;
        }
        /**
         * Sets the user verification auth mode for the messaging channel.
         * @param authMode - The user verification auth mode to set.
         * @throws {Error} Throws an error if the messaging channel configuration is not found.
         */
        setAuthMode(authMode) {
            var _a, _b;
            if (!((_b = (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig) === null || _b === void 0 ? void 0 : _b.embeddedServiceMessagingChannel)) {
                throw new Error('ConfigUtils: Messaging channel configuration not found');
            }
            this.scrtConfig.embeddedServiceConfig.embeddedServiceMessagingChannel.authMode = authMode;
        }
        /**
         * Gets the messaging channel configuration
         * @returns {MessagingChannelConfig} The messaging channel configuration
         */
        getMessagingChannelConfig() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.messagingChannel;
        }
        /**
         * Gets the HTML direction (LTR or RTL)
         * @returns {"LTR" | "RTL"} The HTML direction
         */
        getHtmlDirection() {
            var _a;
            return (_a = this.scrtConfig) === null || _a === void 0 ? void 0 : _a.embeddedServiceConfig.htmlDirection;
        }
        /**
         * Gets the recaptcha site key
         * @returns {string | undefined} The recaptcha site key, or undefined if not available
         */
        getRecaptchaSiteKey() {
            var _a, _b;
            return (_b = (_a = this.getMessagingChannelConfig()) === null || _a === void 0 ? void 0 : _a.captchaInfo) === null || _b === void 0 ? void 0 : _b.siteKey;
        }
        /**
         * Merge a key-value mapping into the setting object, such that the provided
         * values take priority. This allows the settings in the snippet to override
         * what we get from SCRT
         *
         * @param {object} additionalSettings - A key-value mapping.
         * @returns {InitSettings & ScrtConfigResponse} Merged settings object
         */
        getMergedSettings(additionalSettings) {
            //using a clone of the objects to avoid mutating the original objects
            const baseMerged = JSON.parse(JSON.stringify(Object.assign(Object.assign({}, this.initSettings), this.scrtConfig)));
            /**
             * Merge a key-value mapping into the setting object, such that the provided
             * values take priority. This allows the settings in the snippet to override
             * what we get from SCRT
             *
             * @param {object} targetObj - Target object to merge into
             * @param {object} sourceObj - Source object to merge from
             */
            const mergeObjects = (targetObj, sourceObj) => {
                /**
                 * Helper function to create a map from array items based on key properties
                 * @param {Array} array - The array to create a map from
                 * @param {Function} keyExtractor - Function to extract key from array item
                 * @returns {Map} Map of key to index
                 */
                function createArrayMap(array, keyExtractor) {
                    const map = new Map();
                    array.forEach((item, index) => {
                        if (typeof item === 'object' && item !== null) {
                            const key = keyExtractor(item);
                            if (key !== null) {
                                map.set(key, index);
                            }
                        }
                    });
                    return map;
                }
                /**
                 * Helper function to merge arrays with custom key matching
                 * @param {Array} targetArray - Target array to merge into
                 * @param {Array} sourceArray - Source array to merge from
                 * @param {Function} keyExtractor - Function to extract key from array item
                 */
                function mergeArraysWithKeyMatching(targetArray, sourceArray, keyExtractor) {
                    const targetMap = createArrayMap(targetArray, keyExtractor);
                    sourceArray.forEach((sourceItem) => {
                        if (typeof sourceItem === 'object' && sourceItem !== null) {
                            const key = keyExtractor(sourceItem);
                            if (key !== null) {
                                if (targetMap.has(key)) {
                                    // Override existing item with source item
                                    const targetIndex = targetMap.get(key);
                                    targetArray[targetIndex] = sourceItem;
                                }
                                else {
                                    // Add new item
                                    targetArray.push(sourceItem);
                                }
                            }
                        }
                    });
                }
                Object.keys(sourceObj).forEach((key) => {
                    if (Array.isArray(sourceObj[key])) {
                        // Handle array merging
                        if (Array.isArray(targetObj[key])) {
                            if (targetObj[key].length === 0) {
                                // If target array is empty, replace it entirely with source array
                                targetObj[key] = sourceObj[key];
                            }
                            else if (key === 'branding') {
                                // For branding, merge arrays based on 'n' property
                                mergeArraysWithKeyMatching(targetObj[key], sourceObj[key], (item) => item.hasOwnProperty('n') ? item.n : null);
                            }
                            else if (key === 'customLabels') {
                                // For custom labels, merge arrays based on 'sectionName' and 'labelName' properties
                                mergeArraysWithKeyMatching(targetObj[key], sourceObj[key], (item) => (item.hasOwnProperty('sectionName') && item.hasOwnProperty('labelName'))
                                    ? item.sectionName + item.labelName
                                    : null);
                            }
                            // For other array types, keep target array as is (no merging)
                        }
                        else if (targetObj[key] === undefined) {
                            // If array exists in source but not target, just use it
                            targetObj[key] = sourceObj[key];
                        }
                    }
                    else if (typeof (targetObj[key]) === "object" && typeof (sourceObj[key]) === "object" && targetObj[key] !== null && sourceObj[key] !== null) {
                        // Handle object merging (existing logic with null checks)
                        mergeObjects(targetObj[key], sourceObj[key]);
                    }
                    else {
                        // Handle primitive values (existing logic)
                        targetObj[key] = sourceObj[key];
                    }
                });
            };
            if (additionalSettings && typeof additionalSettings === "object") {
                mergeObjects(baseMerged, additionalSettings);
            }
            this.mergedSettings = baseMerged;
            return baseMerged;
        }
    }

    /**
     * Validation method for customer supplied identity token data to the setIdentityToken call.
     * @param identityTokenData - The identity token data parameter to be validated.
     * @returns true if identity token data parameter is well formed and false otherwise.
     */
    function validateIdentityTokenData(identityTokenData) {
        if (identityTokenData !== null && identityTokenData !== undefined && typeof identityTokenData === "object") {
            return true;
        }
        LoggingUtils.getInstance().error("validateIdentityTokenData", `Invalid identity token parameter passed into the setIdentityToken method. Specify a valid object containing the token data.`);
        return false;
    }
    /**
     * Validation method for customer supplied identity token.
     * JWT and SalesforceSessionToken verification schemes are supported.
     * @param identityTokenType - The type of identity token.
     * @param token - The JWT string used to authorize the session (same for both JWT and SalesforceSessionToken).
     * @param myDomainUrl - Optional; required when identityTokenType is SalesforceSessionToken (top-level on identityTokenData).
     * @returns true if identity token is valid and false otherwise.
     */
    function validateIdentityToken(identityTokenType, token, myDomainUrl) {
        let isValid = false;
        switch (identityTokenType) {
            case ID_TOKEN_TYPE.JWT:
                isValid = validateJwt(token);
                break;
            case ID_TOKEN_TYPE.SalesforceSessionToken:
                isValid = validateSalesforceSessionToken(token, myDomainUrl);
                break;
            default:
                LoggingUtils.getInstance().error("validateIdentityToken", `Unsupported identity token type: ${identityTokenType}`);
                break;
        }
        return isValid;
    }
    /**
     * Validation method for identity token of type SalesforceSessionToken.
     * Validates that myDomainUrl and JWT are non-empty strings; for non-opaque JWT tokens, validates that the JWT is valid.
     * @param token - The JWT string used to authorize the session (same for both JWT and SalesforceSessionToken).
     * @param myDomainUrl - The myDomainUrl from identityTokenData (must be a string).
     * @returns true if myDomainUrl is valid, false otherwise.
     */
    function validateSalesforceSessionToken(token, myDomainUrl) {
        if (typeof myDomainUrl !== "string" || myDomainUrl.length === 0) {
            LoggingUtils.getInstance().error("validateSalesforceSessionToken", "SalesforceSessionToken must contain non-empty myDomainUrl of type string.");
            return false;
        }
        if (typeof token !== "string" || token.length === 0) {
            LoggingUtils.getInstance().error("validateSalesforceSessionToken", "SalesforceSessionToken must contain non-empty token of type string.");
            return false;
        }
        return true;
    }
    /**
     * Method for parsing JWT and extracting the JSON payload.
     * @param jwt - The JWT to be parsed.
     * @returns JSON payload of the jwt
     */
    function parseJwt(jwt) {
        // Split out the payload from the header
        const base64Url = jwt.split('.')[1];
        // Convert base64Url string to base64
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decode base64 payload
        const jsonPayload = decodeURIComponent(window.atob(base64)
            .split('')
            .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
            .join(''));
        return JSON.parse(jsonPayload);
    }
    /**
     * Validation method for identity token of type JWT.
     * @param jwt - The JWT to be validated.
     * @returns true if JWT is valid and false otherwise.
     */
    function validateJwt(jwt) {
        let jwtPayload;
        let isValid;
        // Perform null check on the token
        if (!jwt) {
            LoggingUtils.getInstance().debug("validateJwt", `Empty jwt parameter passed in - skipping validation.`);
            return false;
        }
        try {
            // Extract JWT payload.
            jwtPayload = parseJwt(jwt);
            // Validate that the JWT has not expired.
            // Per RFC 7519, a JWT is valid if the current time (in seconds) is before
            // the `exp` claim value.
            // See: https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4
            isValid = Math.floor(Date.now() / 1000) < jwtPayload.exp;
            // Log JWT expiry to console if devMode is on and JWT has expired.
            if (!isValid) {
                LoggingUtils.getInstance().debug("validateJwt", `JWT has expired at ${(new Date(jwtPayload.exp * 1000)).toString()}`);
            }
            return isValid;
        }
        catch (e) {
            LoggingUtils.getInstance().error("validateJwt", `JWT validation failed: ${e.message}`);
            return false;
        }
    }

    /*
     * Copyright 2026 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * recaptcha Constants
     */
    const RECAPTCHA_CLASS = "embeddedMessagingRecaptchaBadgeContainer";
    const RECAPTCHA_URL = "https://www.google.com/recaptcha/api.js?render=explicit";
    /**
     * Store the client-id returned by recaptcha to be used while executing recaptcha
     */
    let recaptchaClientId;
    /**
     * Checks if recaptcha script needs to be loaded.
     * 1. Check whether recaptcha client ID or grecaptcha are defined
     * 2. Check whether site key is available
     * @param siteKey - The site key for the recaptcha
     * @returns {boolean} true if recaptcha script needs to be loaded, false otherwise
     */
    function shouldLoadRecaptchaScript(siteKey) {
        // Check whether recaptcha client ID or grecaptcha are defined
        const hasRecaptchaInitialized = typeof recaptchaClientId !== 'undefined' && typeof window.grecaptcha !== 'undefined';
        return typeof siteKey === 'string' && siteKey.length > 0 && !hasRecaptchaInitialized;
    }
    /**
     * 1. Load the reCa ptcha script on the parent page
     * 2. On script load, render the recaptcha badge on the parent page
     * @param siteKey - The site key for the recaptcha
     * @param htmlDirection - The HTML direction
     * @param conversationStatus - The conversation status
     * @returns {Promise}
     */
    function loadRecaptchaScript(siteKey, htmlDirection) {
        const loggingUtils = LoggingUtils.getInstance();
        return new Promise((resolve, reject) => {
            try {
                const recaptchaContainer = document.getElementById(RECAPTCHA_CLASS);
                if (recaptchaContainer === null || recaptchaContainer === void 0 ? void 0 : recaptchaContainer.parentNode) {
                    try {
                        recaptchaContainer.parentNode.removeChild(recaptchaContainer);
                    }
                    catch (err) {
                        loggingUtils.error('loadRecaptchaScript', `Something went wrong in removing the existing recaptcha badge container: ${err}`);
                    }
                }
                if (!siteKey) {
                    reject(new Error('recaptcha siteKey is not available'));
                    return;
                }
                const script = document.createElement('script');
                script.src = RECAPTCHA_URL;
                const recaptchaBannerDiv = document.createElement('div');
                recaptchaBannerDiv.id = RECAPTCHA_CLASS;
                recaptchaBannerDiv.classList.add(RECAPTCHA_CLASS);
                const agentforceMessaging = window.agentforce_messaging;
                const badgePosition = (htmlDirection === null || htmlDirection === void 0 ? void 0 : htmlDirection.toLowerCase()) === "rtl"
                    ? "bottomright"
                    : "bottomleft";
                // Do not render the recaptcha badge in inline mode. It will be displayed as a visual branding in the input footer.
                if (agentforceMessaging.settings.displayMode === 'inline') {
                    recaptchaBannerDiv.style.display = 'none';
                }
                agentforceMessaging.settings.targetElement.appendChild(recaptchaBannerDiv);
                script.onload = () => {
                    const grecaptcha = window.grecaptcha;
                    grecaptcha.ready(() => {
                        recaptchaClientId = grecaptcha.render(RECAPTCHA_CLASS, {
                            'sitekey': siteKey,
                            'size': 'invisible',
                            'badge': badgePosition
                        });
                        resolve();
                    });
                };
                script.onerror = (err) => {
                    const errorMessage = (err === null || err === void 0 ? void 0 : err.message) || err;
                    reject(errorMessage);
                };
                agentforceMessaging.settings.targetElement.appendChild(script);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    /**
     * Generate the recaptcha token.
     * @returns {Promise}
     */
    function generateRecaptchaToken() {
        return new Promise((resolve, reject) => {
            const grecaptcha = window.grecaptcha;
            grecaptcha.ready(() => {
                grecaptcha.execute(recaptchaClientId, { action: 'AccessTokenRequest' }).then((token) => {
                    resolve(token);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
    /**
     * Hide the recaptcha badge.
     * @returns {void}
     */
    function hideRecaptchaBadge() {
        const recaptchaBadge = document.getElementById(RECAPTCHA_CLASS);
        if (recaptchaBadge) {
            recaptchaBadge.style.display = 'none';
        }
    }

    /*
     * Copyright 2026 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */
    /**
     * Applies the `chatButtonPosition` snippet setting by writing CSS custom properties
     * `--eswButtonBottom` and `--eswButtonRight` on `document.documentElement`. The
     * variables cascade to the FAB / minimized iframe via normal CSS inheritance.
     *
     * Expected format: `"<bottom>, <right>"` (e.g. `"25px, 30px"`). Whitespace around each
     * value is trimmed. Length units other than `px` (e.g. `rem`, `%`) pass through untouched.
     *
     * @param {string | undefined} position - Raw `chatButtonPosition` snippet value.
     */
    function applyChatButtonPosition(position) {
        if (typeof position !== 'string' || position.length === 0) {
            return;
        }
        const positionValues = position.split(',');
        if (positionValues.length !== 2) {
            LoggingUtils.getInstance().error('applyChatButtonPosition', `Invalid embeddedservice_bootstrap.settings.chatButtonPosition value specified: ${position}. Valid format is "25px, 30px".`);
            return;
        }
        document.documentElement.style.setProperty('--eswButtonBottom', positionValues[0].trim());
        document.documentElement.style.setProperty('--eswButtonRight', positionValues[1].trim());
    }

    var C = /* @__PURE__ */ ((a) => (a.HostNotConnected = "HostNotConnected", a.Timeout = "Timeout", a.NoHandler = "NoHandler", a.HandlerError = "HandlerError", a.Unknown = "Unknown", a))(C || {});
    class l extends Error {
      constructor(e, t, n) {
        super(t), this.type = e, this.originalError = n, Object.setPrototypeOf(this, l.prototype);
      }
    }
    function f(a) {
      const e = a?.trim();
      if (e === "*") return "*";
      if (!e)
        throw new Error("Invalid origin URL");
      return new URL(e).origin;
    }
    class p {
      constructor(e = {}) {
        this.instanceId = Math.random().toString(36).substring(2, 15), this.handlers = /* @__PURE__ */ new Map(), this.pendingCalls = /* @__PURE__ */ new Map(), this.messageHandler = null, this.isConnected = !1, this.connectionCallbacks = [];
        const t = e.timeout ?? 5e3, n = f(e.targetOrigin ?? "*");
        this.options = {
          timeout: t,
          connectTimeout: e.connectTimeout ?? t,
          callTimeout: e.callTimeout ?? t,
          isHost: e.isHost ?? !1,
          targetOrigin: n,
          targetFrameId: e.targetFrameId,
          onError: e.onError
        }, this.handleMessage = this.handleMessage.bind(this), this.onError = e.onError, this.options.targetOrigin === "*" && console.warn(
          "[RPC] Warning: targetOrigin is set to '*', which allows all origins. This is not recommended for production environments."
        );
      }
      registerHandler(e, t) {
        this.handlers.set(e, t), console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Registered handler for event: ${e}`
        );
      }
      unregisterHandler(e) {
        this.handlers.delete(e), console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Unregistered handler for event: ${e}`
        );
      }
      onConnectionChange(e) {
        this.connectionCallbacks.push(e), e(this.isConnected);
      }
      notifyConnectionChange(e) {
        this.isConnected !== e && (this.isConnected = e, console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Connection status changed: ${e ? "Connected" : "Disconnected"}`
        ), this.connectionCallbacks.forEach((t) => t(e)));
      }
      async connect() {
        if (this.options.isHost)
          throw new Error("Host cannot initiate connection");
        return this.isConnected ? (console.debug("[RPC-CLIENT] Already connected to host"), Promise.resolve()) : (console.debug("[RPC-CLIENT] Starting connection to host..."), new Promise((e, t) => {
          const n = setTimeout(() => {
            t(new Error("RPC connection timeout"));
          }, this.options.connectTimeout), s = () => {
            clearTimeout(n);
          }, o = (i) => {
            i.data?.type === "rpc-connect" && i.data?.connected && (console.debug(
              "[RPC-CLIENT] Received connection confirmation from host"
            ), s(), this.notifyConnectionChange(!0), window.removeEventListener("message", o), e());
          };
          window.addEventListener("message", o), this.postMessage({
            type: "rpc-connect"
          }), console.debug("[RPC-CLIENT] Sent connection request to host");
        }));
      }
      /**
       * Calls a remote event. If the host has not implemented the requested function,
       * resolves to defaultValue (if provided), otherwise rejects.
       * @param event The event name
       * @param data Data to send
       * @param options Optional: { timeout, defaultValue }
       */
      async callRemote(e, t, n) {
        if (!this.isConnected) {
          const c = new l(
            "HostNotConnected",
            "RPC not connected. Call connect() first."
          );
          return new Promise((d, h) => {
            this.handleErrorOrReject(
              c,
              {
                event: e,
                data: t,
                defaultValue: typeof n == "object" && n ? n.defaultValue : void 0,
                timeout: typeof n == "object" && n ? n.timeout : void 0
              },
              d,
              h
            );
          });
        }
        let s, o;
        const i = this.options.callTimeout ?? 5e3;
        typeof n == "number" ? s = n : typeof n == "object" && n !== null ? (s = n.timeout ?? i, o = n.defaultValue) : s = i;
        const r = `rpc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return new Promise((c, d) => {
          let h = null;
          s > 0 && (h = setTimeout(() => {
            this.pendingCalls.delete(r);
            const m = new l(
              "Timeout",
              `RPC call to '${e}' timed out after ${s}ms`
            );
            this.handleErrorOrReject(
              m,
              { event: e, data: t, defaultValue: o, timeout: s },
              c,
              d
            );
          }, s));
          const g = { resolve: c, reject: d, timeout: h };
          g.defaultValue = o, this.pendingCalls.set(r, g);
          const u = {
            type: "rpc-call",
            id: r,
            event: e,
            data: t
          };
          this.postMessage(u), console.debug(
            `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Called remote event: ${e}`,
            {
              id: r,
              data: t,
              timeout: s === 0 ? "infinite" : `${s}ms`,
              defaultValue: o
            }
          );
        });
      }
      async handleErrorOrReject(e, t, n, s) {
        if (this.onError) {
          await this.onError(e, t, n, s);
          return;
        }
        if (s) {
          s(e);
          return;
        }
        throw e;
      }
      postMessage(e) {
        const t = {
          ...e,
          senderInstanceId: this.instanceId,
          senderIsHost: this.options.isHost
        };
        let n, s;
        if (this.options.isHost) {
          let i = window.frames[0];
          this.options.targetFrameId && (i = document.getElementById(
            this.options.targetFrameId
          )?.contentWindow ?? void 0), i && i !== window ? (n = i, s = "iframe") : (n = window, s = "same-window");
        } else
          window.parent && window.parent !== window ? (n = window.parent, s = "parent-window") : (n = window, s = "same-window");
        const o = this.options.targetOrigin ?? "*";
        n.postMessage(t, o), console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Posted message:`,
          {
            type: e.type,
            event: e.event || "N/A",
            id: e.id || "N/A",
            context: s,
            targetWindow: n === window ? "self" : "other"
          }
        );
      }
      async handleMessage(e) {
        if (!e.data?.type?.startsWith?.("rpc-")) return;
        if (this.options.targetOrigin !== "*" && e.origin !== this.options.targetOrigin) {
          console.warn(
            `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Rejected message from origin '${e.origin}' (expected '${this.options.targetOrigin}')`
          );
          return;
        }
        const t = e.data;
        if (console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Received message:`,
          {
            type: t.type,
            event: t.event || "N/A",
            id: t.id || "N/A",
            senderInstanceId: t.senderInstanceId,
            senderIsHost: t.senderIsHost,
            myInstanceId: this.instanceId,
            myIsHost: this.options.isHost
          }
        ), t.senderInstanceId === this.instanceId) {
          console.debug(
            `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Ignoring message from self (instance: ${this.instanceId})`
          );
          return;
        }
        switch (this.options.isHost && !this.isConnected && t.senderIsHost === !1 && (console.debug(
          "[RPC-HOST] First client message received, setting host as connected"
        ), this.notifyConnectionChange(!0)), t.type) {
          case "rpc-connect":
            await this.handleConnect(t);
            break;
          case "rpc-call":
            await this.handleRemoteCall(t);
            break;
          case "rpc-response":
            this.handleRemoteResponse(t);
            break;
          case "rpc-register-handlers":
            this.handleHandlerRegistration(t);
            break;
        }
      }
      async handleConnect(e) {
        this.options.isHost && (console.debug(
          `[RPC-HOST] Processing connect message - currently connected: ${this.isConnected}`
        ), this.isConnected || (console.debug(
          "[RPC-HOST] Setting host as connected due to client connect message"
        ), this.notifyConnectionChange(!0)), this.postMessage({
          type: "rpc-connect",
          connected: !0
        }));
      }
      async handleRemoteCall(e) {
        const { id: t, event: n, data: s } = e;
        if (!(!t || !n)) {
          console.debug(
            `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Processing remote call:`,
            {
              event: n,
              id: t,
              data: s,
              availableHandlers: Array.from(this.handlers.keys())
            }
          );
          try {
            const o = this.handlers.get(n);
            if (!o) {
              const d = `No handler registered for event: ${n}`;
              throw console.debug(
                `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Handler not found:`,
                {
                  event: n,
                  availableHandlers: Array.from(this.handlers.keys())
                }
              ), new Error(d);
            }
            console.debug(
              `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Executing handler for: ${n}`
            );
            const r = await o({ type: n, data: s }), c = {
              type: "rpc-response",
              id: t,
              result: r
            };
            this.postMessage(c), console.debug(
              `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Handled remote call: ${n}`,
              { id: t, result: r }
            );
          } catch (o) {
            const i = {
              type: "rpc-response",
              id: t,
              error: o instanceof Error ? o.message : String(o)
            };
            this.postMessage(i), console.debug(
              `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Error handling remote call: ${n}`,
              { id: t, error: o }
            );
          }
        }
      }
      handleRemoteResponse(e) {
        const { id: t, result: n, error: s } = e;
        if (!t) return;
        const o = this.pendingCalls.get(t);
        if (!o) return;
        o.timeout && clearTimeout(o.timeout), this.pendingCalls.delete(t);
        const i = o.defaultValue;
        if (s)
          if (i !== void 0 && typeof s == "string" && s.startsWith("No handler registered for event:"))
            o.resolve(i);
          else {
            const r = new l(
              s.startsWith("No handler registered for event:") ? "NoHandler" : "HandlerError",
              s
            );
            this.onError ? this.onError(
              r,
              { event: "unknown", data: void 0, defaultValue: i },
              o.resolve,
              o.reject
            ) : o.reject(r);
          }
        else
          o.resolve(n);
        console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Received response for call: ${t}`,
          { result: n, error: s }
        );
      }
      handleHandlerRegistration(e) {
        const { handlers: t } = e;
        t && console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Remote registered handlers:`,
          t
        );
      }
      async waitForConnection() {
        if (!this.isConnected)
          return this._waitForConnection || (this._waitForConnection = new Promise((e) => {
            this.onConnectionChange((t) => {
              t && (this._waitForConnection = void 0, e());
            });
          })), this._waitForConnection;
      }
      startListening() {
        this.messageHandler || (this.messageHandler = this.handleMessage, window.addEventListener("message", this.messageHandler), console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Started listening for RPC messages`
        ));
      }
      stopListening() {
        this.messageHandler && (window.removeEventListener("message", this.messageHandler), this.messageHandler = null, this.pendingCalls.forEach(({ reject: e, timeout: t }) => {
          t && clearTimeout(t);
          try {
            e(new Error("RPC manager stopped"));
          } catch {
          }
        }), this.pendingCalls.clear(), this.notifyConnectionChange(!1), console.debug(
          `[RPC${this.options.isHost ? "-HOST" : "-CLIENT"}] Stopped listening for RPC messages`
        ));
      }
      getConnectionStatus() {
        return this.isConnected;
      }
      getRegisteredHandlers() {
        return Array.from(this.handlers.keys());
      }
      getInstanceId() {
        return this.instanceId;
      }
    }
    Object.assign(window, { RPCManager: p });

    var RPCManagerNamespace = /*#__PURE__*/Object.freeze({
        __proto__: null,
        RPCError: l,
        RPCErrorType: C,
        RPCManager: p
    });

    /*
     * Copyright 2025 salesforce.com, inc.
     * All Rights Reserved
     * Company Confidential
     */

    (() => {
        window.RPCManager = RPCManagerNamespace;
        let rpcManager;

        /**
         * Business Hours Utilities instance
         */
        let businessHoursUtils;

        /**
         * Config Utilities instance
         */
        let configUtils;

        /**
         * LoggingUtils singleton instance
         */
        let loggingUtils;

        // Track conversation status
        let conversationStatus = CONVERSATION_STATUS.NOT_STARTED;

        // Identity token cached so Channel Menu visibility checks can validate it without an RPC round-trip.
        let identityToken;

        // Tracks who owns the FAB in a Channel Menu deployment. 
        // If false, Channel Menu owns the FAB (CWC emits visibility events for Channel Menu to render the menu item).
        // If true, the CWC iframe owns the FAB (CWC toggles iframe display directly).
        let cwcOwnsFab = false;

        // Whether cwcfabready has been fired from container. 
        let cwcFabReadyHasFired = false;

        /**
         * Whether the onEmbeddedMessagingReady event has been fired.
         */
        let hasEmbeddedMessagingReadyEventFired = false;

        /**
         * Whether the onEmbeddedMessagingButtonCreated event has been fired.
         */
        let hasEmbeddedMessagingButtonCreatedEventFired = false;

        /**
    	 * This is a resolver function for when the app is ready to be used.
         */
    	let resolveAppReadyPromise;
    	let appReadyPromise = new Promise((resolve) => {
    		resolveAppReadyPromise = resolve;
    	});

        const hostEvents = {
            ON_EMBEDDED_MESSAGING_WINDOW_MINIMIZED_EVENT_NAME: "onEmbeddedMessagingWindowMinimized",
            ON_EMBEDDED_MESSAGING_WINDOW_MAXIMIZED_EVENT_NAME: "onEmbeddedMessagingWindowMaximized",
            ON_EMBEDDED_MESSAGING_CHANNEL_MENU_VISIBILITY_CHANGE_EVENT_NAME: "onEmbeddedMessagingChannelMenuVisibilityChanged"
        };

    	/**
    	 * Internal property to track page-specific parameters set by a customer for appending query strings to the Auto-Response URL.
    	 * @type {Object} - f.e. { parameterName1: parameterValue2, parameterName2: parameterValue2 }
    	 */
    	let autoResponseParameters = {};

        /**
         * Check if we are on a Desktop (or non-mobile client) based on information in the user agent.
         * Browsers on tablets behave the same as mobile devices.
         * @returns {boolean} - True if Desktop, false if not.
         */
        function isDesktop() {
            return navigator.userAgent.indexOf("Mobi") === -1;
        }

        /**
         * Check if web client is being used in an experience site (LWR & Aura)
         *
         * @returns {boolean} - return 'true' if we are in a LWR or Aura experience site and 'false' otherwise.
         */
        function isExpSite() {
            return configUtils.getExpSiteContext() === EXP_SITE_CONTEXT.LWR || isAuraExpSite();
        }

        /**
         * Check if this file was loaded into an Aura Salesforce Site.
         *
         * @return {boolean} True if this page is an Aura Salesforce Site.
         */
        function isAuraExpSite() {
            return configUtils.getExpSiteContext() === EXP_SITE_CONTEXT.AURA;
        }

        // =========================
        //  Channel Menu
        // =========================

        function isChannelMenuDeployment() {
            try {
                return Boolean(window.embedded_svc && window.embedded_svc.menu);
            } catch (e) {
                return false;
            }
        }

        function shouldShowChatButtonInInitialState() {
            return Boolean(businessHoursUtils?.isWithinBusinessHours()) && !embeddedservice_bootstrap.settings.hideChatButtonOnLoad;
        }

        /**
         * Decide whether the Embedded Messaging channel should be visible in Channel Menu.
         * @param {Boolean} setUtilAPIVisibility - explicit override from utilAPI.show/hideChatButton.
         */
        function shouldRenderEmbeddedMessagingInChannelMenu(setUtilAPIVisibility) {
            let shouldRender = shouldShowChatButtonInInitialState();
            if (setUtilAPIVisibility !== undefined && setUtilAPIVisibility !== null) {
                shouldRender = setUtilAPIVisibility;
            }
            if (isAuthenticatedMode()) {
                shouldRender = shouldRender && (
                    configUtils.getAuthMode() === AUTH_MODE.AUTH
                        ? validateJwt(identityToken)
                        : Boolean(identityToken)
                );
            }
            return shouldRender;
        }

        function emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(isVisible) {
            try {
                dispatchEventToHost(hostEvents.ON_EMBEDDED_MESSAGING_CHANNEL_MENU_VISIBILITY_CHANGE_EVENT_NAME, {
                    detail: {
                        devName: configUtils?.getEswConfigDevName(),
                        isVisible
                    }
                });
            } catch (err) {
                loggingUtils?.error("emitEmbeddedMessagingChannelMenuVisibilityChangeEvent", `Failed to fire visibility-change event: ${err}`);
            }
        }

        /**
         * Returns true when the Channel Menu deployment has exactly one menu item and that item
         * is the Embedded Messaging channel.
         */
        function isChannelMenuOnlyEmbeddedMessaging() {
            try {
                const items = window.embedded_svc?.menu?.menuConfig?.configuredChannels;
                return Array.isArray(items)
                    && items.length === 1
                    && items[0]?.channelType === CHANNEL_TYPE.EMBEDDED_MESSAGING;
            } catch (error) {
                loggingUtils?.error("isChannelMenuOnlyEmbeddedMessaging", `Failed to check if Channel Menu is only Embedded Messaging: ${error}`);
                return false;
            }
        }

        /**
         * Transfer FAB ownership from Channel Menu to the CWC iframe.
         */
        function transferFabToCwc() {
            if (!isChannelMenuDeployment()) return;
            cwcOwnsFab = true;
        }

        // =========================
        //  Minimization / Maximization
        // =========================
        function handleMinimize() {
            const frame = getIframe();

            // [Mobile] Remove class that prevents background clicking and scrolling.
            document.body.classList.remove(PREVENT_SCROLLING_CLASS);

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

                frame.classList.remove("initial");
                frame.classList.add("minimized");
                frame.classList.remove("maximized");

                // If Channel Menu owns the FAB, hide our iframe so it doesn't render alongside Channel Menu's FAB.
                if (isChannelMenuDeployment() && !cwcOwnsFab) {
                    frame.style.display = "none";
                }

                dispatchEventToHost(hostEvents.ON_EMBEDDED_MESSAGING_WINDOW_MINIMIZED_EVENT_NAME);
            }
        }

        function handleMaximize() {
            const frame = getIframe();

            if(!isDesktop()) {
                // [Mobile] Add class that prevents background clicking and scrolling.
                document.body.classList.add(PREVENT_SCROLLING_CLASS);
            }

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

                frame.classList.remove("initial");
                frame.classList.add("maximized");
                frame.classList.remove("minimized");

                if (isChannelMenuDeployment()) {
                    // While Channel Menu owned the FAB, handleMinimize hid the iframe; ensure it's visible on maximize.
                    frame.style.display = "";
                    // Any maximize (including session restore via ESW_APP_MAXIMIZE) means iframe owns the FAB.
                    transferFabToCwc();
                }

                dispatchEventToHost(hostEvents.ON_EMBEDDED_MESSAGING_WINDOW_MAXIMIZED_EVENT_NAME);
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
         * Agentforce Messaging User Verification class for client API.
         */
        function AgentforceMessagingUserVerification() {}

        /**
         * Agentforce Messaging User Verification class for client API.
         */
        function AgentforceMessagingPrechatAPI() {}

        /**
    	 * Auto-Response API methods exposed in window.embeddedservice_bootstrap.autoResponseAPI
    	 * for setting/updating/removing query string parameters on the Auto-Response Web View URL from the host domain.
         */
        function AgentforceMessagingAutoResponseAPI() {}
        
        /**
         * Centralized function to validate if API calls can be processed.
         * Checks if the onEmbeddedMessagingReady event has been fired.
         * @throws {Error} - Throws an Error if validation fails
         */
        function validateEmbeddedMessagingReadyEventFired() {
            if (!hasEmbeddedMessagingReadyEventFired) {
                throw new Error("API not available before onEmbeddedMessagingReady is fired.");
            }
        }

        /**
         * Centralized function to validate if API calls can be processed.
         * Checks if the onEmbeddedMessagingButtonCreated event has been fired.
         * @throws {Error} - Throws an Error if validation fails
         */
        function validateEmbeddedMessagingButtonCreatedEventFired() {
            if (!hasEmbeddedMessagingButtonCreatedEventFired) {
                throw new Error("API not available before onEmbeddedMessagingButtonCreated event is fired.");
            }
        }

        /**
         * Client API method to send a text message programatically
         */
        AgentforceMessagingUtil.prototype.sendTextMessage = function (message, context) {
            try {
                validateEmbeddedMessagingReadyEventFired();
                return callRpcClient("sendTextMessage", { message, context })
                    .then((response) => {
                        if (response.success) {
                            return Promise.resolve();
                        }
                        throw response.error;
                    })
                    .catch((error) => {
                        loggingUtils.error("sendTextMessage", `Failed to send message: ${error}`);
                        return Promise.reject(error);
                    });
            } catch (error) {
                loggingUtils.error("sendTextMessage", `Failed to send message: ${error}`);
                return Promise.reject(error);
            }
        };

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
                validateEmbeddedMessagingReadyEventFired();
                return callRpcClient("setSessionContext", context)
                    .then((response) => {
                        if (response.success) {
                            return;
                        }
                        throw response.error;
                    })
                    .catch((error) => {
                        loggingUtils.error("setSessionContext", `Failed to set session context: ${error}`);
                        return Promise.reject(error);
                    });
            } catch (error) {
                loggingUtils.error("setSessionContext", `Failed to set session context: ${error}`);
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
        AgentforceMessagingPrechatAPI.prototype.setHiddenPrechatFields = function (hiddenFields) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                if (hiddenFields && typeof hiddenFields === "object") {
                    const validatedHiddenFields = {};
                    const prechatFieldsFromConfig = configUtils.getHiddenPrechatFormFields();

                    for (const [fieldName, fieldValue] of Object.entries(hiddenFields)) {
                        if (validatePrechatField('setHiddenPrechatFields', fieldName, fieldValue, prechatFieldsFromConfig)) {
                            validatedHiddenFields[fieldName] = fieldValue;
                        }
                    }
                    // Not returning the promise to be consistent with V1
                    callRpcClient("setHiddenPrechatFields", { hiddenFields: validatedHiddenFields })
                        .catch((error) => {
                            loggingUtils.error("setHiddenPrechatFields", `Failed to set hidden prechat fields: ${error}`);
                        });
                    return true;
                }
                throw new Error("setHiddenPrechatFields must be called with object of key-value pairs.");
            } catch (error) {
                loggingUtils.error("setHiddenPrechatFields", `Failed to set hidden prechat fields: ${error}`);
                return false;
            }
        };

        /**
         * EXTERNAL API - DO NOT CHANGE SHAPE
         * A publicly exposed api for the host (i.e. customer) to invoke and remove Hidden Prechat fields.
         * Removes an existing Hidden Prechat field with the passed in key name.
         *
         * @param {object} hiddenFields - an object (in the form of an Array) of Hidden Prechat field names (e.g. [ HiddenPrechatFieldName1, HiddenPrechatFieldName2 ]) to be removed/deleted.
         */
        AgentforceMessagingPrechatAPI.prototype.removeHiddenPrechatFields = function (hiddenFields) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                if (hiddenFields && Array.isArray(hiddenFields)) {
                    // Not returning the promise to be consistent with V1
                    callRpcClient("removeHiddenPrechatFields", { hiddenFields })
                        .catch((error) => {
                            loggingUtils.error("removeHiddenPrechatFields", `Failed to remove hidden prechat fields: ${error}`);
                        });
                    return true;
                }
                throw new Error("removeHiddenPrechatFields must be called with array of strings.");
            } catch (error) {
                loggingUtils.error("removeHiddenPrechatFields", `Failed to remove hidden prechat fields: ${error}`);
                return false;
            }
        };

        /**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE
    	 * A publicly exposed api for the host (i.e. customer) to invoke and set Visible Prechat fields.
    	 * Sets a new Visible Prechat field or updates an existing field with the passed in value.
    	 *
    	 * @param {object} hiddenFields - Object with key-value pairs, with 2 fields in each object. (i.e. field value, editability boolean flag).
    	 */
    	AgentforceMessagingPrechatAPI.prototype.setVisiblePrechatFields = function setVisiblePrechatFields(visibleFields) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                if (visibleFields && typeof visibleFields === 'object' && !Array.isArray(visibleFields)) {
                    const validatedFields = {};

                    for (const [fieldName, fieldData] of Object.entries(visibleFields)) {
                        if (validatePrechatField('setVisiblePrechatFields', fieldName, fieldData.value, configUtils.getVisiblePrechatFormFields(), fieldData.isEditableByEndUser)) {
                            validatedFields[fieldName] = {
                                value: fieldData.value,
                                isEditableByEndUser: fieldData.isEditableByEndUser === undefined ? true : Boolean(fieldData.isEditableByEndUser)
                            };
        
                            // Log successful update action on Visible Prechat fields for debugging purposes.
                            loggingUtils.log("setVisiblePrechatFields", `[setVisiblePrechatFields] Successfully updated Visible Pre-Chat field ${fieldName}.`);
                        }
                    }

                    // Not returning the promise to be consistent with V1
                    callRpcClient("setVisiblePrechatFields", { visibleFields: validatedFields })
                        .catch((error) => {
                            loggingUtils.error("setVisiblePrechatFields", `Failed to set visible prechat fields: ${error}`);
                        });
                    return true;
                }

                throw new Error("setVisiblePrechatFields called with an invalid object. Pass in an object with key-value pairs.");
            } catch (error) {
                loggingUtils.error("setVisiblePrechatFields", `Failed to set visible prechat fields: ${error}`);
                return false;
            }
        };

        /**
         * EXTERNAL API - DO NOT CHANGE SHAPE
         * A publicly exposed api for the host (i.e. customer) to invoke and remove Visible Prechat fields.
         * Removes an existing Visible Prechat field with the passed in key name.
         *
         * @param {object} visibleFields - Array of Visible Prechat field names to be removed/deleted.
         */
        AgentforceMessagingPrechatAPI.prototype.unsetVisiblePrechatFields = function unsetVisiblePrechatFields(visibleFields) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                if (visibleFields && Array.isArray(visibleFields) && visibleFields.length) {
                    // Not returning the promise to be consistent with V1
                    callRpcClient("unsetVisiblePrechatFields", { visibleFields })
                        .catch((error) => {
                            loggingUtils.error("unsetVisiblePrechatFields", `Failed to unset visible prechat fields: ${error}`);
                        });
                    return true;
                }
                throw new Error("unsetVisiblePrechatFields must be called with array of strings.");
            } catch (error) {
                loggingUtils.error("unsetVisiblePrechatFields", `Failed to unset visible prechat fields: ${error}`);
                return false;
            }
        };

    	/**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to set/update auto-response page parameters.
    	 * Sets a new parameter (key-value pair) or updates an existing parameter with the same key to a new value.
    	 *
    	 * @param {Object} pageParameters - Map containing key-value pairs of query string parameters as invoked by the host.
    	 * (e.g. { parameterName1: parameterValue2, parameterName2: parameterValue2 })
    	 */
    	AgentforceMessagingAutoResponseAPI.prototype.setAutoResponseParameters = function setAutoResponseParameters(pageParameters) {
    		// Ensure client is ready for the host (customer) to invoke public Auto-Response API methods.
    		validateEmbeddedMessagingReadyEventFired();

    		if (pageParameters && typeof pageParameters === "object") {
    			for (const [paramKey, paramValue] of Object.entries(pageParameters)) {
    				// Validate parameters are valid non-empty strings.
    				if (validateAutoResponseParameter(paramKey, paramValue)) {
    					autoResponseParameters[paramKey] = paramValue;
    					// Log successfully updated auto-response parameters for debugging purposes.
    					loggingUtils.log("setAutoResponseParameters", `[setAutoResponseParameters] Successfully updated auto-response parameter ${paramKey}`);
    				} else {
    					loggingUtils.warning("setAutoResponseParameters", `[setAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`);
    				}
    			}

    			callRpcClient("setAutoResponseParameters", { autoResponseParameters })
    				.catch((error) => {
    					loggingUtils.error("setAutoResponseParameters", `Failed to set auto-response parameters: ${error}`);
    			});
    			return true;
    		} else {
    			loggingUtils.error("setAutoResponseParameters", `[setAutoResponseParameters] Must pass in an object of parameters as key-value pairs.`);
    			return false;
    		}
    	};

    	/**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to remove auto-response page parameters.
    	 * Removes an existing parameter with the specified key.
    	 *
    	 * @param {Array} pageParameters - Array containing parameter names/keys (e.g. [ parameterName1, parameterName2 ])
    	 */
    	AgentforceMessagingAutoResponseAPI.prototype.removeAutoResponseParameters = function removeAutoResponseParameters(pageParameters) {
    		// Ensure client is ready for the host (customer) to invoke public Auto-Response API methods.
    		validateEmbeddedMessagingReadyEventFired();

    		if (pageParameters && Array.isArray(pageParameters)) {
    			pageParameters.forEach(function(paramKey) {
    				if (autoResponseParameters.hasOwnProperty(paramKey)) {
    					delete autoResponseParameters[paramKey];
    					// Log successfully removed auto-response page parameter for debugging purposes.
    					loggingUtils.log("removeAutoResponseParameters", `[removeAutoResponseParameters] Successfully removed auto-response parameter ${paramKey}`);
    				} else {
    					loggingUtils.warning("removeAutoResponseParameters", `[removeAutoResponseParameters] Failed to validate auto-response parameter ${paramKey}`);
    				}
    			});

    			callRpcClient("removeAutoResponseParameters", { autoResponseParameters })
    				.catch((error) => {
    					loggingUtils.error("removeAutoResponseParameters", `Failed to remove auto-response parameters: ${error}`);
    				});
    			return true;
    		} else {
    			loggingUtils.error("removeAutoResponseParameters", `[removeAutoResponseParameters] Must pass in an array of parameter names.`);
    			return false;
    		}
    	};

        /**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to launch the chat programatically.
         *
         * @param {object} options - Object containing the following properties:
         *  - {boolean} shouldStartNewConversation - Flag to determine if a new conversation should be started, only valid if the chat is currently in ended state.
    	 */
        AgentforceMessagingUtil.prototype.launchChat = function (options = {}) {
            try {
                validateEmbeddedMessagingButtonCreatedEventFired();

                const iframe = getIframe();
                if (iframe) {
                    // Iframe owns the FAB from here on; transfer FAB ownership to CWC before toggling visibility
                    // so toggleChatFabVisibility(true) hits the cwc-owns-FAB branch instead of emitting.
                    transferFabToCwc();
                    // Unhide iframe in case hideChatButton was previously called.
                    toggleChatFabVisibility(true);
                    return callRpcClient("launchChat", options)
                        .then(() => undefined)
                        .catch((error) => {
                            loggingUtils.error("launchChat", `Failed to launch chat: ${error}`);
                            return Promise.reject(error);
                        });
                }
                return Promise.resolve();
            } catch (error) {
                loggingUtils.error("launchChat", `Failed to launch chat: ${error}`);
                return Promise.reject(error);
            }
        };

        /**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to minimize the chat programatically.
    	 *
    	 */
        AgentforceMessagingUtil.prototype.minimizeChat = function () {
            try {
                validateEmbeddedMessagingButtonCreatedEventFired();

                const iframe = getIframe();
                if (iframe && iframe.classList.contains("maximized")) {
                    return callRpcClient("minimizeChat")
                        .then(() => undefined)
                        .catch((error) => {
                            loggingUtils.error("minimizeChat", `Failed to minimize chat: ${error}`);
                            return Promise.reject(error);
                        });
                }
                return Promise.resolve();
            } catch (error) {
                loggingUtils.error("minimizeChat", `Failed to minimize chat: ${error}`);
                return Promise.reject(error);
            }
        };

        /**
         * Returns true when the Channel Menu deployment has exactly one menu item and that item
         * is the Embedded Messaging channel.
         */
        function isChannelMenuOnlyEmbeddedMessaging() {
            try {
                const items = window.embedded_svc?.menu?.menuConfig?.configuredChannels;
                return Array.isArray(items)
                    && items.length === 1
                    && items[0]?.channelType === CHANNEL_TYPE.EMBEDDED_MESSAGING;
            } catch (error) {
                loggingUtils?.error("isChannelMenuOnlyEmbeddedMessaging", `Failed to check if Channel Menu is only Embedded Messaging: ${error}`);
                return false;
            }
        }
        
        /**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to show chat button programatically.
    	 *
    	 */
        AgentforceMessagingUtil.prototype.showChatButton = function () {
            if (isChannelMenuDeployment()) {
                return emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(true);
                if (!isChannelMenuOnlyEmbeddedMessaging()) return;
            }
            return toggleChatFabVisibility(true);
        };

        /**
    	 * EXTERNAL API - DO NOT CHANGE SHAPE!
    	 * A publicly exposed API for the host (i.e. customer) to hide chat button programatically.
    	 *
    	 */
        AgentforceMessagingUtil.prototype.hideChatButton = function () {
            if (isChannelMenuDeployment()) {
                emitEmbeddedMessagingChannelMenuVisibilityChangeEvent(false);
            }
            return toggleChatFabVisibility(false);
        };

        /**
         * EXTERNAL API - DO NOT CHANGE SHAPE
         * User verification API method for setting the identity token used to authorize the end user's session.
         * This API is used to set the initial identity token as well as any subsequent tokens generated by the customer
         * to extend the end user's session.
         *
         * JWT-based and SalesforceSessionToken identity tokens are accepted.
         * @param {Object} identityTokenData - The customer-supplied identity token data object.
         * Per the user verification contract, the object contains the following fields:
         *  - {String} identityTokenType : the verification scheme of the identity token (e.g. "JWT", "SalesforceSessionToken").
         *  - {String} identityToken : the JWT string used to authorize the user session.
         *  - {String} [myDomainUrl] : required when identityTokenType is "SalesforceSessionToken"; not present for "JWT".
         * @return {Boolean} true if identity token provided is valid and false otherwise.
         */
        AgentforceMessagingUserVerification.prototype.setIdentityToken = function setIdentityToken(identityTokenData) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                if (!ID_TOKEN_AUTH_MODES.includes(configUtils.getAuthMode())) {
                    throw new Error(`Invalid user verification authentication mode: ${configUtils.getAuthMode()}`);
                }

                // Perform validation on the identity token data supplied.
                const { identityTokenType, identityToken: token, myDomainUrl } = identityTokenData;
                if (!validateIdentityTokenData(identityTokenData) || !validateIdentityToken(identityTokenType, token, myDomainUrl)) {
                    return false;
                }
                // Cache token in memory for Channel Menu visibility checks (avoids RPC round-trip).
                identityToken = token;
                callRpcClient("setIdentityToken", {identityTokenData})
                    .catch((error) => {
                        throw new Error(`Failed to set identity token: ${error}`);
                    });
                // if (isChannelMenuDeployment()) {
                //     // Three lifecycle cases for setIdentityToken in CM:
                //     //   (a) post-handoff re-auth (after clearSession): cwcfabready won't re-fire,
                //     //       so unhide the iframe directly and restore the validation flag.
                //     //   (b) pre-handoff token refresh: emit visibility so channelMenu.js reorders MIAW back in.
                //     //   (c) initial JWT: no-op here; cwcfabready -> handleFabReadyEvent will emit.
                //     if (cwcOwnsFab && cwcFabReadyHasFired) {
                //         // (a) re-auth after clearSession
                //         hasEmbeddedMessagingButtonCreatedEventFired = true;
                //         toggleIframeVisibility(true);
                //     } else if (hasEmbeddedMessagingButtonCreatedEventFired) {
                //         // (b) token refresh while CM still owns the FAB
                //         emitEmbeddedMessagingChannelMenuVisibilityChangeEvent();
                //     }
                //     // (c) initial JWT: implicit fall-through; no-op here
                // }
            }
            catch (error) {
                loggingUtils.error("setIdentityToken", `Failed to set identity token: ${error}`);
                return false;
            }
            return true;
        };

        /**
         * EXTERNAL API - DO NOT CHANGE SHAPE
         * User verification API method for clearing the current user's session.
         * Per the user verification contract, the customer is responsible for invoking this API method when the end-user
         * logs out of the current session.
         *
         * @param {Boolean} shouldEndSession - Flag to determine if current session should be ended.
         * @return {Promise} - Promise that resolves after a session is successfully cleared OR is rejected with relevant error message.
         */
        AgentforceMessagingUserVerification.prototype.clearSession = function clearSession(shouldEndSession) {
            try {
                validateEmbeddedMessagingReadyEventFired();

                cwcFabReadyHasFired = false;
                return callRpcClient("clearSession", { shouldEndSession })
                    .then(() => {
                        resetClientToInitialState();
                    })
                    .catch((error) => {
                        throw error;
                    });
            }
            catch (error) {
                console.error("clearSession", `Failed to clear user session: ${error}`);
                return Promise.reject(error);
            }
        };

        /**
         * Returns true if the current auth mode is a valid authenticated mode (AUTH, SALESFORCE_SESSION_AUTH or EXP_SITE_AUTH).
         * @returns {boolean}
         */
        function isAuthenticatedMode() {
            const authMode = configUtils.getAuthMode();
            return AUTHENTICATED_MODES.includes(authMode);
        }

        /**
         * Returns true if the chat button should be hidden on reset.
         * @returns {boolean}
         * @description
         * - No need to hide chat button if the button was not created.
         * - Hide chat button if the auth mode requires an identity token. Button is shown after setting the identity token.
         * - Hide chat button if the auth mode is EXP_SITE_AUTH and the user is a guest user. Show button for logged in users.
         */
        function shouldHideChatButtonOnReset() {
            // No need to hide chat button if the button was not created.
            if (!hasEmbeddedMessagingButtonCreatedEventFired) {
                return false;
            }
            if (!isAuthenticatedMode()) {
                return embeddedservice_bootstrap.settings.hideChatButtonOnLoad;
            }
            // Hide chat button if the auth mode requires an identity token.
            if (ID_TOKEN_AUTH_MODES.includes(configUtils.getAuthMode())) {
                return true;
            }
            if (configUtils.getAuthMode() === AUTH_MODE.EXP_SITE_AUTH) {
                return configUtils.getIsExpSiteGuestUser() ? true : embeddedservice_bootstrap.settings.hideChatButtonOnLoad;
            }
            return true;
        }

        /**
         * Resets client to the inital/zero state, i.e the client state on page load without a messaging jwt in web storage.
         * Dispatches the onEmbeddedMessagingReady event after reset to indicate the host page that the client is ready for subsequent chat session.
         * For authenticated conversations that require an identity token, this method also hides the chat button.
         * For guest conversations & authenticated exp site users, this method also emits the onEmbeddedMessagingButtonCreated event. 
         * For authenticated conversations that require an identity token, the onEmbeddedMessagingButtonCreated event is fired after setting the identity token.
         */
        function resetClientToInitialState() {
            if (shouldHideChatButtonOnReset()) {
                embeddedservice_bootstrap.utilAPI.hideChatButton();
            }
            identityToken = undefined;
            resetInMemoryState();
            emitEmbeddedMessagingReadyEvent();
            if (!isAuthenticatedMode() || (configUtils.getAuthMode() === AUTH_MODE.EXP_SITE_AUTH && !configUtils.getIsExpSiteGuestUser())) {
                emitEmbeddedMessagingButtonCreatedEvent();
            }
            // Skip if CWC already owns the FAB. Re-emitting would trigger reorder + 
            // animation flicker for a Channel Menu that the user can no longer see anyway.
            // if (isChannelMenuDeployment() && !cwcOwnsFab) {
            //     emitEmbeddedMessagingChannelMenuVisibilityChangeEvent();
            // }
        }

        /**
         * Reset in-memory variables that track the client state.
         */
        function resetInMemoryState() {
            conversationStatus = CONVERSATION_STATUS.NOT_STARTED;
            hasEmbeddedMessagingButtonCreatedEventFired = false;
            hasEmbeddedMessagingReadyEventFired = false;
            cwcOwnsFab = false;
        }

        /**
         * Helper function for non-CM show/hideChatButton (and post-handoff CM via launchChat).
         * In CM deployments, the public show/hideChatButton APIs short-circuit to emit a
         * Channel Menu visibility event before reaching this helper, so the CM-emit branch
         * that previously lived here is no longer needed.
         * @param {boolean} show
         * @returns {boolean} true if show is true OR conversation status === NOT_STARTED
         */
        function toggleChatFabVisibility(show) {
            try {
                validateEmbeddedMessagingButtonCreatedEventFired();

                if (!show && conversationStatus !== CONVERSATION_STATUS.NOT_STARTED) {
                    loggingUtils.warning("hideChatButton", "Ignored hideChatButton: messaging window is already showing.");
                    return false;
                }

                if (show || conversationStatus === CONVERSATION_STATUS.NOT_STARTED) {
                    toggleIframeVisibility(show);
                    return true;
                }
                return false;
            } catch (error) {
                loggingUtils.error("toggleChatFabVisibility", `Failed to ${show ? "show" : "hide"} chat button: ${error}`);
                return false
            }
        }

        /**
         * Toggle iframe between display none to visible.
         * @param {boolean} show
         */
        function toggleIframeVisibility(show) {
            const iframe = getIframe();
            if (iframe) {
                iframe.style.display = (show ? "" : "none");
            }
        }

        function callRpcClient(eventName, eventData = {}) {
            if (!rpcManager) {
                loggingUtils.error("callRpcClient", "RPC not available");
                return Promise.resolve(false);
            }

            return rpcManager
                .waitForConnection()
                .then(() =>
                    rpcManager.callRemote(eventName, eventData)
                )
                .then((response) => {
                    loggingUtils.debug("callRpcClient", "Event sent to iframe");
                    return response;
                })
                .catch((error) => {
                    loggingUtils.error("callRpcClient", `Failed to send event: ${error}`);
                    return false;
                });
        }
        /**
         * Returns true if the chat button should be shown on page load.
         * @returns {boolean}
         * @description
         * - Show chat button if the conversation is open.
         * - Show chat button if the hideChatButtonOnLoad setting is undefined or false.
         * - Show chat button if the user is within business hours.
         */
        function shouldShowChatButtonOnLoad() {
            if (conversationStatus === CONVERSATION_STATUS.OPEN) {
                return true;
            }
            if (typeof embeddedservice_bootstrap.settings.hideChatButtonOnLoad === 'boolean') {
                return !embeddedservice_bootstrap.settings.hideChatButtonOnLoad;
            }
            return businessHoursUtils?.isWithinBusinessHours();
        }

        /**
         * Handle the onEmbeddedMessagingButtonCreated event.
         * Sets CSS variables for minimized iframe dimensions and unhides the iframe.
         * @param {CustomEvent} event - Button created event containing button dimensions
         */
        function handleFabReadyEvent(event) {
            if (cwcFabReadyHasFired) {
                 return;   
            }
            const buttonWidth = event?.data?.buttonDimensions?.width;
            const buttonHeight = event?.data?.buttonDimensions?.height;

            // For Channel Menu, skip the iframe-hide mid-conversation. 
            // Once CWC owns the FAB, the iframe is the visible surface so hiding it would collapse the modal.
            // if (!isChannelMenuDeployment() || conversationStatus === CONVERSATION_STATUS.NOT_STARTED) {
                toggleIframeVisibility(false);
            //}

            if (buttonWidth) {
                document.documentElement.style.setProperty('--minimized-iframe-width', buttonWidth + "px");
            }
            if (buttonHeight) {
                document.documentElement.style.setProperty('--minimized-iframe-height', buttonHeight + "px");
            }

            setIframeDisplayMode();
            emitEmbeddedMessagingButtonCreatedEvent();

            // If Channel Menu owns the FAB, report visibility instead of unhiding the iframe-FAB.
            // if (isChannelMenuDeployment()
            //     && !cwcOwnsFab
            //     && conversationStatus === CONVERSATION_STATUS.NOT_STARTED) {
            //     emitEmbeddedMessagingChannelMenuVisibilityChangeEvent();
            //     return;
            // }

            if (shouldShowChatButtonOnLoad()) {
                if (conversationStatus !== CONVERSATION_STATUS.NOT_STARTED) loggingUtils.debug("handleFabReadyEvent", "Active conversation outside business hours - showing iframe");
                if (businessHoursUtils?.isWithinBusinessHours()) loggingUtils.debug("handleFabReadyEvent", `Currently within business hours - showing iframe`);

                embeddedservice_bootstrap.utilAPI.showChatButton();
            }
            cwcFabReadyHasFired = true;
        }

        /**
         * Emits the onEmbeddedMessagingButtonCreated event to the host.
         * @throws {Error} - Throws an Error if the event is not fired
         */
        function emitEmbeddedMessagingButtonCreatedEvent() {
            hasEmbeddedMessagingButtonCreatedEventFired = true;
            try {
                dispatchEventToHost("onEmbeddedMessagingButtonCreated");
            } catch(err) {
                hasEmbeddedMessagingButtonCreatedEventFired = false;
                loggingUtils.error("emitEmbeddedMessagingButtonCreatedEvent", `Something went wrong in firing onEmbeddedMessagingButtonCreated event ${err}.`);
            }
        }

        /**
         * Load the bootstrap.css file for this static file.
         */
        function loadCSS() {
            return new Promise((resolve, reject) => {
                let baseURL = configUtils.getSiteURL();
                let link = document.createElement("link");

                link.id = "embeddedMessagingBootstrapStyles";
                link.class = "embeddedMessagingBootstrapStyles";
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
            if (window.RPCManager) {
                window.RPCManager = undefined;
            }
        }

        /**
         * Set up the RPC manager (RPC is bundled into init.js). Returns a promise for use in init sequencing.
         * Rejects if initialization fails or rpcManager is not set.
         */
        function setupRPC() {
            if (rpcManager) {
                return Promise.resolve(true);
            }
            try {
                initializeRPC();
                if (!rpcManager) {
                    return Promise.reject(new Error("RPC initialization failed"));
                }
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(error);
            }
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
                    loggingUtils.error("initializeRPC", "RPCManager constructor not available");
                    return;
                }

                rpcManager = new window.RPCManager.RPCManager({
                    isHost: true,
                    targetOrigin: configUtils.getSiteURL(),
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
                    loggingUtils.debug(
                    "initializeRPC",
                    `RPC connection status: ${connected ? "Connected" : "Disconnected"}`
                    );
                });
                rpcManager.startListening();
                loggingUtils.debug("initializeRPC", "RPC host initialized successfully");
                // Cleanup on page unload
                window.addEventListener("beforeunload", cleanupRPC);
            } catch (error) {
                loggingUtils.error("initializeRPC", `RPC initialization failed: ${error}`);
                throw error;
            }
        }

        function registerRpcHandlers() {
            // Iframe app ready event handler
            rpcManager.registerHandler("ESW_APP_READY_EVENT", async () => {
                await appReadyPromise;
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
                const incoming = event?.data?.conversationStatus || CONVERSATION_STATUS.NOT_STARTED;
                const wasNotStarted = conversationStatus === CONVERSATION_STATUS.NOT_STARTED;
                conversationStatus = incoming;
                if (incoming === CONVERSATION_STATUS.OPEN) {
                    hideRecaptchaBadge();
                    // We are restoring an existing session. Hand off the FAB so 
                    // Channel Menu can't render behind the auto-opened modal.
                    if (wasNotStarted) {
                        transferFabToCwc();
                    }
                }
            });

            rpcManager.registerHandler("cwcfabready", (event) => {
                handleFabReadyEvent(event);
            });

            rpcManager.registerHandler("cwcresetclienttoinitialstate", (event) => {
                resetClientToInitialState();
            });

            rpcManager.registerHandler("dispatchEventToHost", (event) => {
                const { eventName, eventData } = event.data;
                if (eventData) {
                    dispatchEventToHost(eventName, { detail: eventData });
                } else {
                    dispatchEventToHost(eventName);
                }
            });

            rpcManager.registerHandler("cwcgeneraterecaptchatoken", async () => {
                return await generateRecaptchaToken().then((token) => {
                    return { token };
                }).catch((err) => {
                    loggingUtils.error("generateRecaptchaToken", `Error generating recaptcha token: ${err}`);
                    return null;
                });
            });

            rpcManager.registerHandler("setiframedimensions", (event) => {
                const iframeWidth = event?.data?.dimensions?.width;
                const iframeHeight = event?.data?.dimensions?.height;
                if (iframeWidth && iframeHeight) {
                    document.documentElement.style.setProperty('--minimized-iframe-width', iframeWidth + "px");
                    document.documentElement.style.setProperty('--minimized-iframe-height', iframeHeight + "px");
                }
            });
        }

        function dispatchEventToHost(eventName, options = { detail: {}}) {
            if (!eventName) {
    			throw new Error(`Expected an eventName parameter with a string value. Instead received ${eventName}.`);
    		}
    		if (options && !('detail' in options)) {
    			throw new Error(`The options parameter of the event is malformed: ${options}.`);
    		}
            try {
    			window.dispatchEvent(new CustomEvent(eventName, options));
    		} catch(err) {
    			throw new Error("Something went wrong while dispatching the event " + eventName + ":" + err);
    		}
        }

        /**
         * Business hours timer callback that gets invoked when business hours transitions occur
         * @param {boolean} wasWithinBusinessHours - Whether we were within business hours when timer was set
         */
        async function businessHoursTimerCallback(wasWithinBusinessHours) {
            loggingUtils.debug("businessHoursTimerCallback", `Business hours timer expired. Was within business hours: ${wasWithinBusinessHours}`);
            
            // Show or hide chat button based on business hours transition & dispatch events to host.
            // utilAPI.show/hideChatButton handles both CM (emits visibility event) and non-CM
            // (toggles iframe FAB) — see the prototype definitions on AgentforceMessagingUtil.
            if (wasWithinBusinessHours) {
                loggingUtils.debug("businessHoursTimerCallback", `Leaving business hours - hiding chat button`);
                agentforce_messaging.utilAPI.hideChatButton();
                dispatchEventToHost(BusinessHoursUtils.constants.ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME);

                 // Reload business hours to refresh the interval
                if (businessHoursUtils) {
                    await businessHoursUtils.loadBusinessHours();
                }
            } else {
                loggingUtils.debug("businessHoursTimerCallback", `Entering business hours - showing chat button`);
                agentforce_messaging.utilAPI.showChatButton();
                dispatchEventToHost(BusinessHoursUtils.constants.ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_STARTED_EVENT_NAME);
                // Setup timer for next interval start time
                businessHoursUtils?.setupBusinessHoursTimer();
            }
        }

        function emitEmbeddedMessagingReadyEvent() {
            hasEmbeddedMessagingReadyEventFired = true;
    		try {
                dispatchEventToHost("onEmbeddedMessagingReady");
    		} catch(err) {
    			hasEmbeddedMessagingReadyEventFired = false;
    			loggingUtils.error("emitEmbeddedMessagingReadyEvent", `Something went wrong in firing onEmbeddedMessagingReady event ${err}.`);
    		}
        }

        function prepareConfigObject() {
            // Remove targetElement since HTMLElement cannot be cloned.
            const { targetElement, ...snippetSettings } = agentforce_messaging.settings;
            const mergedSettings = configUtils.getMergedSettings(snippetSettings);
            try {
                const hostLocation = new URL(window.location.href);
                // Pass hostUrl to iframe
                mergedSettings.metrics.hostUrl = hostLocation.origin + hostLocation.pathname;
            } catch (err) {
                loggingUtils.error("prepareConfigObject", `Something went wrong in getting the hostUrl.`);
            }
            mergedSettings.isExpSite = isExpSite();
            return mergedSettings
        }

        function createTopContainer() {
            const topContainerElement = document.createElement("div");

            if (getTopContainer()) return getTopContainer();

            topContainerElement.id = TOP_CONTAINER_NAME;
            topContainerElement.className = TOP_CONTAINER_NAME;

            return topContainerElement;
        }

        /**
         * Validates displayMode and targetElement configuration.
         * Warns about likely misconfigurations between displayMode and targetElement.
         */
        function validateDisplayModeConfiguration() {
            const settings = embeddedservice_bootstrap.settings;
            const isInlineMode = settings.displayMode === 'inline';
            const isUsingDefaultTarget = settings.targetElement === document.body;
            const hasCustomTarget = settings.targetElement && 
                                    settings.targetElement instanceof Element && 
                                    !isUsingDefaultTarget;

            // Warning: inline mode with default document.body target
            if (isInlineMode && isUsingDefaultTarget) {
                loggingUtils.warning(
                    'validateDisplayModeConfiguration',
                    'Configuration Warning: displayMode is set to "inline" but targetElement is using the default (document.body). ' +
                    'This will embed the chat into the entire page body. ' +
                    'If you want to embed the chat in a specific container, set targetElement to your desired DOM element.'
                );
            }

            // Warning: custom targetElement in non-inline mode
            if (!isInlineMode && hasCustomTarget) {
                loggingUtils.warning(
                    'validateDisplayModeConfiguration',
                    'Configuration Warning: targetElement is set to a custom element but displayMode is not set to "inline". ' +
                    'In floating mode, the chat button will float within the specified container instead of embedding. ' +
                    'Set displayMode to "inline" if you want the chat to fully embed in the container.'
                );
            }

            return true;
        }

        function setIframeDisplayMode() {
            const iframe = getIframe();
            if (iframe) {
                // Validate configuration before applying displayMode, continues either way, just logs a warning if there is a problem
                validateDisplayModeConfiguration();

                if (embeddedservice_bootstrap.settings.displayMode === 'inline') {
                    iframe.classList.add("inline");
                } else {
                    iframe.classList.add("initial");
                }
            }
        }

        AgentforceMessaging.prototype.createIframe = function createIframe() {
            return new Promise((resolve, reject) => {
                try {
                    const markupFragment = document.createDocumentFragment();
                    const topContainer = createTopContainer();
                    const iframe = document.createElement("iframe");

                    iframe.title = LWR_IFRAME_TITLE;
                    iframe.className = LWR_IFRAME_NAME;
                    iframe.id = LWR_IFRAME_NAME;

                    iframe.style.backgroundColor = "transparent";
                    iframe.allowTransparency = "true";
                    // Hide until load so unstyled default iframe dimensions / blank document do not flash.
                    iframe.style.visibility = "hidden";

                    let siteURL = configUtils.getSiteURL();
                    // Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
                    if (!siteURL.endsWith("/")) siteURL += "/";

                    iframe.src =
                        siteURL +
                        "?lwc.mode=" +
                        (agentforce_messaging.settings.devMode ? "dev" : "prod");
                    // Allow microphone access for voice conversations.
                    iframe.allow = "microphone";

                    // Set sandbox attributes on iframe unless omitSandbox flag is on.
                    if (!agentforce_messaging.settings.omitSandbox) {
                        iframe.sandbox =
                            "allow-scripts allow-same-origin allow-modals allow-downloads allow-popups allow-popups-to-escape-sandbox";
                    }

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
                };
                // Initialize LoggingUtils singleton instance.
                loggingUtils = LoggingUtils.getInstance(
                    {
                        clientVersion: 'v2',
                        eswConfigDevName: eswConfigDevName,
                        devMode: Boolean(agentforce_messaging.settings.devMode),
                        getAuthMode: () => configUtils.getAuthMode(),
                        getConversationId: () => undefined // Conversation ID not tracked in V2 init
                    },
                    appReadyPromise
                );
                // Initialize configUtils instance.
                configUtils = new ConfigUtils({
                    orgId,
                    eswConfigDevName,
                    siteURL,
                    snippetConfig,
                    language: agentforce_messaging.settings.language,
                });

                // If CWC is the only channel in CM, transfer FAB ownership to CWC.
                if (isChannelMenuOnlyEmbeddedMessaging()) {
                    transferFabToCwc();
                }

                // Apply `chatButtonPosition` snippet setting.
                applyChatButtonPosition(agentforce_messaging.settings.chatButtonPosition);

                // Load CSS file.
                const cssPromise = loadCSS()
                    .then(() => {
                        loggingUtils.log("init", `Loaded CSS`);
                    })
                    .catch(() => {
                        throw new Error(`Error loading CSS`);
                    });

                // Set up RPC for iframe & host communication
                const rpcPromise = setupRPC()
                    .then(() => {
                        loggingUtils.debug("init", `RPC ready`);
                    })
                    .catch(() => {
                        throw new Error(`Error setting up RPC`);
                    });

                // Load configuration settings from SCRT 2.0.
                const configPromise = configUtils.loadConfigurationSettings()
                    .then(() => {
                        loggingUtils.debug("init", `Loaded configuration settings`);

                        if (isExpSite()) {
                            // Check if exp site/credential-based user verification is enabled.
                            if (agentforce_messaging.settings.expSiteAuthMode) {
                                // Auth mode must also be enabled on the messaging channel.
                                if (configUtils.getAuthMode() === AUTH_MODE.AUTH) {
                                    // Set the auth mode for experience site credential-based user verification.
                                    configUtils.setAuthMode(AUTH_MODE.EXP_SITE_AUTH);
                                } else {
                                    console.error("init", "User verification is not enabled for the messaging channel.");
                                    throw new Error("User verification is not enabled for the messaging channel.");
                                }
                            }
                        }
                    })
                    .catch(() => {
                        throw new Error(`Error loading configuration settings`);
                    });

                // Load LWR site in parallel with CSS; iframe stays visibility:hidden until both CSS and onload complete.
                const iframePromise = agentforce_messaging
                    .createIframe()
                    .then(() => {
                        loggingUtils.log("init", `Created Agentforce Messaging frame`);
                    })
                    .catch((e) => {
                        throw new Error(
                            `Error creating Agentforce Messaging frame: ${e}`
                        );
                    });

                Promise.all([cssPromise, iframePromise]).then(() => {
                    const iframe = getIframe();
                    if (iframe) {
                        iframe.style.visibility = "";
                    }
                }).catch(() => {
                    // Init Promise.all logs; avoid unhandled rejection on this parallel gate.
                });

                // Create BusinessHoursUtils instance
                loggingUtils.debug("init", `Creating business hours utility instance`);
                businessHoursUtils = new BusinessHoursUtils({
                    orgId,
                    scrt2URL: snippetConfig.scrt2URL,
                    eswConfigDevName,
                    businessHoursTimerCallback: businessHoursTimerCallback
                });
                
                // Load business hours and setup timer
                const businessHoursPromise = businessHoursUtils.loadBusinessHours()
                    .then(() => {
                        if (businessHoursUtils.isWithinBusinessHours()) {
                            dispatchEventToHost(BusinessHoursUtils.constants.ON_EMBEDDED_MESSAGING_WITHIN_BUSINESS_HOURS_EVENT_NAME);
                        } else {
                            // TODO - revisit event name W-20615521
                            dispatchEventToHost(BusinessHoursUtils.constants.ON_EMBEDDED_MESSAGING_BUSINESS_HOURS_ENDED_EVENT_NAME);
                        }
                    })
                    .catch((err) => {
                        loggingUtils.error("init", `Error loading business hours: ${err}`);
                        // Don't throw error to prevent blocking initialization
                    });

                const recaptchaPromise = configPromise.then(() => {
                    const siteKey = configUtils.getRecaptchaSiteKey();
                    if (shouldLoadRecaptchaScript(siteKey)) {
                        return loadRecaptchaScript(siteKey, configUtils.getHtmlDirection()).then(() => {
                            loggingUtils.log("init", "recaptcha script loaded and badge rendered");
                        }).catch((err) => {
                            throw new Error(`Error loading recaptcha script: ${err}`);
                        });
                    } else {
                        // If recaptcha is not to be loaded, resolve immediately
                        return Promise.resolve();
                    }
                });

                Promise.all([cssPromise, rpcPromise, configPromise, iframePromise, businessHoursPromise, recaptchaPromise])
                    .then(() => {
                        // Initialize app after all promises are resolved.
                        resolveAppReadyPromise();
                    }).catch((err) => {
                        loggingUtils.error("init", `Error initializing app: ${err}`);
                    });
            } catch (initError) {
                throw new Error(initError);
            }
        };

        /**
         * EXTERNAL API - DO NOT CHANGE SHAPE
         * Invoked by Channel Menu (channelMenu.js#bootstrapEmbeddedMessagingInChannelMenu) when an
         * end user clicks the embedded messaging item.
         */
        AgentforceMessaging.prototype.bootstrapEmbeddedMessaging = function bootstrapEmbeddedMessaging() {
            try {
                return embeddedservice_bootstrap.utilAPI.launchChat();
            } catch (e) {
                throw new Error("[Bootstrap API] Something went wrong bootstrapping Embedded Messaging: " + e);
            }
        };

        /**
         * Remove event listeners on host window.
         */
        AgentforceMessaging.prototype.removeEventHandlers = function removeEventHandlers() {
            // Cleanup RPC manager
            cleanupRPC();

            // Remove beforeunload event listener
            window.removeEventListener("beforeunload", cleanupRPC);
        };

        /**
         * Remove the markup from the DOM. 
         * This method is ONLY called from Experience Site context currently when 
         * experience_messaging:embeddedMessaging is unloaded from the DOM.
         */ 
        AgentforceMessaging.prototype.removeMarkup = function removeMarkup() {
            const topContainer = getTopContainer();

            // Remove scroll prevention class from body
            if (document.body.classList.contains(PREVENT_SCROLLING_CLASS)) {
                document.body.classList.remove(PREVENT_SCROLLING_CLASS);
            }

            // Remove top container element
            if (topContainer && topContainer.parentNode) {
                topContainer.parentNode.removeChild(topContainer);
            }

            // Remove CSS link element
            const cssLink = document.getElementById("embeddedMessagingBootstrapStyles");
            if (cssLink && cssLink.parentNode) {
                cssLink.parentNode.removeChild(cssLink);
            }

            // Remove CSS custom properties
            document.documentElement.style.removeProperty("--minimized-iframe-width");
            document.documentElement.style.removeProperty("--minimized-iframe-height");

            // Remove iframe
            removeIframe();
        };

        /**
         * Remove the iframe from the DOM and reset the iframe ready promise.
         */
        function removeIframe() {
            const iframe = getIframe();
            if (iframe && iframe.parentNode) {
                // Remove main messaging iframe
                iframe.parentNode.removeChild(iframe);
                // Reset iframe ready promise after removing the iframe.
                appReadyPromise = new Promise((resolve) => {
                    resolveAppReadyPromise = resolve;
                });
            }
        }

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
                    loggingUtils.error("createProxy", `Property '${String(prop)}' is not implemented on ${objectName}`);
                    return undefined;
                },
                set: function(proxyTarget, prop, value) {
                    if (prop in targetObject) {
                        targetObject[prop] = value;
                        return true;
                    }
                    loggingUtils.error("createProxy", `Property '${String(prop)}' is not implemented on ${objectName}`);
                    return false;
                }
            });
        }

        if (!window.agentforce_messaging) {
            window.agentforce_messaging = new AgentforceMessaging();
            window.agentforce_messaging.utilAPI = new AgentforceMessagingUtil();
            window.agentforce_messaging.userVerificationAPI = new AgentforceMessagingUserVerification();
            window.agentforce_messaging.prechatAPI = new AgentforceMessagingPrechatAPI();
            window.agentforce_messaging.autoResponseAPI = new AgentforceMessagingAutoResponseAPI();

            // Create proxies for embeddedservice_bootstrap and its client APIs
            window.embeddedservice_bootstrap = createProxy(window.agentforce_messaging, 'agentforce_messaging');
            window.agentforce_messaging.utilAPI = createProxy(
                window.agentforce_messaging.utilAPI,
                'agentforce_messaging.utilAPI'
            );
            window.agentforce_messaging.userVerificationAPI = createProxy(
                window.agentforce_messaging.userVerificationAPI,
                'agentforce_messaging.userVerificationAPI'
            );
            window.agentforce_messaging.prechatAPI = createProxy(
                window.agentforce_messaging.prechatAPI,
                'agentforce_messaging.prechatAPI'
            );
            window.agentforce_messaging.autoResponseAPI = createProxy(
                window.agentforce_messaging.autoResponseAPI,
                'agentforce_messaging.autoResponseAPI'
            );
        } else {
            // Use getInstance() here since loggingUtils might not be initialized in this IIFE execution
            LoggingUtils.getInstance().error("init", `Agentforce Messaging has already been initialized`);
        }
    })();

})();
