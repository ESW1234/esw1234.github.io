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
    const INIT_SCRIPT_NAME = "init-agentforce-messaging";

    // App/Client configuration
    let appConfiguration = {};

    // =========================
    //  DOM Selectors
    // =========================
    function getTopContainer() {
        return document.getElementById(TOP_CONTAINER_NAME);
    }

    function getIframe() {
        return document.getElementById(LWR_IFRAME_NAME);
    }

    function getInitScriptElement() {
        return document.getElementById(INIT_SCRIPT_NAME);
    }

    function getSiteUrl() {
        try {
            return appConfiguration.siteUrl;
        } catch (err) {
            console.error(`Error retrieving site URL: ${err}`);
        }
    }

    function handleResize(postMessage) {
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

            if (postMessage.state === "expanded") {
                frame.classList.remove("init");
                frame.classList.remove("normal");
                frame.classList.remove("closed");
                frame.classList.add("expanded");
            } else if (postMessage.state === "normal") {
                frame.classList.remove("init");
                frame.classList.remove("closed");
                frame.classList.remove("expanded");
                frame.classList.add("normal");
            } else if (postMessage.state === "closed") {
                frame.classList.remove("init");
                frame.classList.remove("expanded");
                frame.classList.remove("normal");
                frame.classList.add("closed");
            } else if (postMessage.state === "init") {
                frame.classList.add("init");
            }
        }
    }

    // =========================
    //  Iframe Message Handlers
    // =========================
    function handleMessageEvent(event) {
        const postMessage = event.data;
        switch (postMessage.type) {
            case "resize":
                handleResize(postMessage);
                break;
            case "text_message_link_click":
                handleLinkClick(postMessage);
                break;
            case "lwr_iframe_ready":
                sendConfigurationToAppIframe();
                break;
            default:
                console.warn(
                    "Unrecognized postMessage event name: " + postMessage.type
                );
                break;
        }
    }

    /**
     * Sends configuration data to LWR app.
     */
    function sendConfigurationToAppIframe() {
        sendPostMessageToAppIframe("set_app_config", appConfiguration);
    }

    /**
     * Send a post message to the LWR App iframe window. If the frame is not ready, wait for it.
     *
     * @param {String} type - Type/Name of method.
     * @param {Object} data - Data to send with message. Only included in post message if data is defined.
     */
    function sendPostMessageToAppIframe(type, data) {
        const iframe = getIframe();

        if (typeof type !== "string") {
            throw new Error(
                `Expected a string to use as message param in post message, instead received ${type}.`
            );
        }

        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
                {
                    type,
                    ...(data && { data })
                },
                getSiteUrl()
            );
        } else {
            console.warning(
                `Agentforce Messaging iframe not available for post message with method ${type}.`
            );
        }
    }
    
    // =========================
    //  Initialization
    // =========================
    function AgentforceMessaging() {
        this.settings = {
            targetElement: document.body
        };
    }

    /**
     * Load the init.css file for this static file.
     */
    function loadCSS() {
        return new Promise((resolve, reject) => {
            let link = document.createElement("link");
            let initSrc = "";
            const initScriptElement = getInitScriptElement();

            if(!initScriptElement) {
                reject("Failed to locate init.js on page.");
            }

            link.id = "css";
            link.class = "css";
            initSrc = initScriptElement.src;
            link.href = initSrc.substring(0, initSrc.indexOf("/init.js")) + "/init.css";
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

        topContainerElement.id = TOP_CONTAINER_NAME;
        topContainerElement.className = TOP_CONTAINER_NAME;

        return topContainerElement;
    }

    function isValidAppConfiguration(configData) {
        if (!configData || !configData.siteUrl || !configData.agentApiConfiguration 
            || !configData.agentApiConfiguration.agentId || !configData.agentApiConfiguration.domainUrl) {
            return false;
        }
        return true;
    }

    AgentforceMessaging.prototype.createIframe = function createIframe() {
        return new Promise((resolve, reject) => {
            try {
                const markupFragment = document.createDocumentFragment();
                const topContainer = createTopContainer();
                const iframe = document.createElement("iframe");
                const devMode = Boolean(appConfiguration.devMode);

                iframe.title = LWR_IFRAME_NAME;
                iframe.className = LWR_IFRAME_NAME;
                iframe.id = LWR_IFRAME_NAME;

                iframe.style.backgroundColor = "transparent";
                iframe.allowTransparency = "true";

                let siteURL = getSiteUrl();
                // Ensure a '/' is at the end of an LWR URI so a redirect doesn't occur.
                if (!siteURL.endsWith("/")) siteURL += "/";

                iframe.src =
                    siteURL +
                    "?lwc.mode=" +
                    (devMode ? "dev" : "prod");
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

    AgentforceMessaging.prototype.init = function init(appConfigData) {
        try {
            if (!isValidAppConfiguration(appConfigData)) {
                throw new Error("Invalid init() configuration specified. siteUrl, agentId & domainUrl are mandatory.");
            }
            
            // Set configuration for the app
            appConfiguration = appConfigData || {};
            
            // Add message event handler
            window.addEventListener("message", handleMessageEvent);

            // Load CSS file.
            loadCSS()
                .then(() => {
                    console.log(`Loaded CSS`);
                })
                .catch(() => {
                    console.error(`Error loading CSS`);
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

    if (!window.agentforce_messaging) {
        window.agentforce_messaging = new AgentforceMessaging();
    } else {
        console.error(`Agentforce Messaging has already been initialized`);
    }
})();
