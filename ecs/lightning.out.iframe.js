/*
Example Use:

<script async src="https://authlout1.my.localhost.sfdcdev.site.com:7443/lightning/lightning.out.iframe.js"></script>
        <script>
            document.addEventListener("LightningOutLoaded", e => alert(`${e.detail.application} is loaded.`));
            ($Lightning = window.$Lightning || {}).data = ["c:exampleComponentLOApp", "https://authlout1.lightning.localhost.sfdcdev.force.com:7443", {}, null, document.getElementById("lightningout1"), new Promise((myResolve) => myResolve("00Dxx0000000000!xxxxYYYYDEAf5PLyiV8OAl3.s_000000VNOEvjdZ47VBr.AzxMrCOrV9Zs.62AHJRN7Uji8xvyu53gG9VEvksHAeQ5cxFl4b"))]
        </script>
*/

(function(that) {
    "use strict";
    if (that.$Lightning && that.$Lightning._v > 1) {
        // Already initialized
        return;
    }

    //TODO!!!
    //need to add support for token refresh
    var $$iframeRef$$;
    const $Lightning = (that.$Lightning || {});


    $Lightning._v = 2;

    function load(application, endpoint, attributes, branding, parentDomElement, authTokenFunction) {
        const appParts = application.split(":");
        function generateUrl() {
            let url = `${endpoint}/${appParts[0]}/${appParts[1]}.app`;
            if (attributes &&
                (Object.keys(attributes).length !== 0) &&
                (attributes.constructor === Object)) {
                url += "?" + new URLSearchParams(attributes).toString();
            }
            return url;
        }

        const iframe = that.document.createElement("iframe");
        //const shadow = parentDomElement.attachShadow({ mode: "closed" });
        iframe.id = "lightning_af";
        iframe.name = "lightning_af";
        iframe.scrolling = "no"
        iframe.sandxox = "allow-downloads allow-forms allow-scripts";
        iframe.frameborder = 0;
        iframe.style = "position:relative;border:0;overflow:none;visibility:none"
        iframe.width = iframe.style.width;
        iframe.height = iframe.style.height;
        iframe.onerror = (err) => alert("Error Loading iframe for " + iframe.src);
        iframe.onload = (event) => {
            const customEvent = new CustomEvent("LightningOutLoaded", {
                detail: {
                    application: application,
                }
            });
            //Need this so we can maintain contact with the iframe.
            // Since we are within a closed shadow root, we cannot select the iframe after the fact.
            $$iframeRef$$ = event.target;
            that.document.dispatchEvent(customEvent);
        };

        window.addEventListener("message", (event) => {
            if(event.origin === endpoint) {
                if (event.data && event.data.type !== null) {
                    switch(event.data.type) {
                        case "lo.appInit":
                            if (branding) {
                                const iframeWindow = $$iframeRef$$.contentWindow;
                                iframeWindow.postMessage({ type: "lo.customStyles", styles: branding }, "*")
                            } else {
                                $$iframeRef$$.style.visibility = "visible";
                            }
                            break;

                        case "lo.styleLoaded":
                            $$iframeRef$$.style.position = "relative";
                            $$iframeRef$$.style.visibility = "visible";
                            break;

                        case "lo.iframeModified":
                            if (event.data.detail) {
                                $$iframeRef$$.width = event.data.detail.width;
                                $$iframeRef$$.height = event.data.detail.height;
                            }
                            break;

                        default:
                            if (event.data.detail && event.data.detail.name) {
                                const bubbles = !!event.data.detail.bubbles;
                                const composed = !!event.data.detail.composed;

                                const customEvent = new CustomEvent(event.data.detail.name, {
                                    bubbles: bubbles,
                                    composed: composed,
                                    detail: event.data.detail.data
                                });
                                parentDomElement.dispatchEvent(customEvent);
                            }
                    }
                }
            }
        });

        shadow.appendChild(iframe);

        if (authTokenFunction) {
            if(typeof authTokenFunction === "string") {
                authTokenFunction = new Promise((myResolve) => myResolve(authTokenFunction));
            }

            authTokenFunction.then((authToken) => {
                    const div = that.document.createElement("div");
                    const form = that.document.createElement("form");
                    form.action = generateUrl();
                    form.method = "post";
                    form.target = "lightning_af";
                    const input = that.document.createElement("input");
                    input.name = "sid";
                    input.type = "hidden";
                    input.value = authToken;
                    form.appendChild(input);
                    div.style.display = "none";
                    div.attachShadow({ mode: "closed" }).appendChild(form);
                    document.body.appendChild(div);
                    form.submit();
                    document.body.removeChild(div);
                },
                (msg) => {
                    const customEvent = new CustomEvent("LightningOutAuthError", {
                        detail: {
                            application: application,
                            detail: msg
                        }
                    });
                    that.document.dispatchEvent(customEvent);
                });
        } else {
            iframe.src = generateUrl();
        }
    }

    function preload(application, endpoint, attributes, branding, parentDomElement, authToken) {
        if(branding) {
            fetch(branding, { cache: "force-cache" })
                .then((res) => { return res.text() })
                .then((css) => {
                    branding = btoa(css);
                    load(application, endpoint, attributes, branding, parentDomElement, authToken);
                })
        } else {
            load(application, endpoint, attributes, null, parentDomElement, authToken);
        }
    }

    function setupDynamicWebComponent(name, application, endpoint, authToken, callback) {
        class LightningOut extends HTMLElement {
            static observedAttributes = ['custom-attrs','styles-url'];

            adoptedCallback() {
                //If someone tries to modify the parent of the component, remove the whole component.
				this.remove();
            }

            connectedCallback() {
                var branding = this.getAttribute('styles-url');
                var attrs = this.getAttribute('custom-attrs');
                preload(application, endpoint, attrs, branding, this, authToken)
            }
        }
        customElements.define(name, LightningOut);
        if(callback) {
            callback();
        }
    }

    function checkAndCleanAppParams(application, endpoint, attributes, branding, parentDomElement, authToken) {
        var appName;

        if(!application || typeof application !== "string") {
            throw new LightningOutError("app_null_or_invalid_type");
        }
        if(!endpoint || typeof endpoint !== "string") {
            throw new LightningOutError("app_uri_null_or_invalid_type");
        }
        if(attributes) {
            if(typeof attributes !== "object") {
                throw new LightningOutError("attributes_null_or_invalid_type");
            } else if(Object.keys(attributes).length) {
                try {
                    attributes = JSON.parse(attributes);
                } catch (error) {
                    throw new LightningOutError("attributes_cannot_be_parsed");
                }
            }
        }
        if(branding) {
            try {
                new URL(branding);
            } catch (error) {
                throw new LightningOutError("invalid_branding_url");
            }
        }
        if(!parentDomElement || !(parentDomElement instanceof HTMLElement)) {
            throw new LightningOutError("root_element_invalid");
        }

        if(authToken && (typeof authToken !== "string")) {
            throw new LightningOutError("access_token_invalid");
        }

        try {
            appName = application.toLowerCase().replace(":", "-")
        } catch (error) {
            throw new LightningOutError("app_name_cannot_be_set");
        }
        return {
            appName: appName,
            application: application,
            endpoint: endpoint,
            attributes: JSON.stringify(attributes),
            branding: branding,
            parentDomElement: parentDomElement,
            authToken: authToken
        }
    }

    class LightningOutError extends Error {
        constructor(type) {
            const ERROR_DETAILS = {
                "app_null_or_invalid_type": {
                    code: "LO-00001",
                    message: "Passed in application name is either missing or not a string.  Please provide a valid application name."
                },
                "app_uri_null_or_invalid_type": {
                    code: "LO-00002",
                    message: "Passed in application URI is either missing or not a string.  Please provide a valid application URI address."
                },
                "attributes_null_or_invalid_type": {
                    code: "LO-00003",
                    message: "Passed in custom attributes are not an object.  Please provide valid custom attributes."
                },
                "attributes_cannot_be_parsed": {
                    code: "LO-00004",
                    message: "Passed in custom attributes cannot be parsed.  Custom attributes cannot contain functions."
                },
                "invalid_branding_url": {
                    code: "LO-00005",
                    message: "Passed in custom styles URL is not a valid URL.  Please provide a valid URL for custom styles."
                },
                "root_element_invalid": {
                    code: "LO-00006",
                    message: "Root DOM element not found or invalid.  Please provide a valid root DOM element."
                },
                "access_token_invalid": {
                    code: "LO-00007",
                    message: "Access Token not a valid string.  Please provide a valid access token."
                },
                "app_name_cannot_be_set": {
                    code: "LO-00008",
                    message: "Cannot set the name of the Lightning Out Web Component.  Please review the name of your Lightning OUt application."
                }
            };
            super("LightningOutError: " + type);
            this.name = "LightningOutError";
            if(ERROR_DETAILS[type]) {
                this.message = `${ERROR_DETAILS[type].code}: ${ERROR_DETAILS[type].message}`;
            } else {
                this.message = "LO-UNKNOWN_ERROR: An unknown Lightning Out Error occured.";
            }
        }
    }

    $Lightning.load = function(application, endpoint, attributes, branding, parentDomElement, authToken) {
    	preload(application, endpoint, attributes, branding, parentDomElement, authToken);
    }
    
    $Lightning.use = function(application, endpoint, attributes, branding, parentDomElement, authToken) {
        try {
            const cleanParams = checkAndCleanAppParams(application, endpoint, attributes, branding, parentDomElement, authToken);
            setupDynamicWebComponent(cleanParams.appName, application, endpoint, authToken, function() {
                const customElem = document.createElement(cleanParams.appName);
                customElem.setAttribute("custom-attrs", cleanParams.attributes);
                customElem.setAttribute("styles-url", cleanParams.branding);
                cleanParams.parentDomElement.appendChild(customElem);
            });
        } catch (error) {
            throw(error);
        }

    }

    const configDom = that.document.querySelector(".lightningout");
    if (configDom) {
        $Lightning.load(
            configDom.getAttribute("data-application"),
            configDom.getAttribute("data-endpoint"),
            configDom.getAttribute("data-attributes"),
            configDom
        );
    } else if($Lightning.data) {
        $Lightning.load(
            $Lightning.data[0],
            $Lightning.data[1],
            $Lightning.data[2],
            $Lightning.data[3],
            $Lightning.data[4],
            $Lightning.data[5]
        );
    }

    that.$Lightning = Object.freeze($Lightning);

})(this);
