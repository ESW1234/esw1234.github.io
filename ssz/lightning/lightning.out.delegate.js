$Lightning = $Lightning || {};
$Lightning._delegate = (function() {

    // private state
    var _application, _applicationTag, _auraContextCallback;
    var _pendingReadyRequests = [];
    var _ready = false;
    var _previousRequestAuthToken;

    function ready(callback) {
        if (_ready) {
            _auraContextCallback(callback);
        } else {
            _pendingReadyRequests.push(callback);
        }
    };

    function initAbsoluteGVP(absoluteUrl) {
        var initGVP = function(url) {
            var prefix = "$Absolute";
            if (!$A.getContext() || !$A.get(prefix)) {
                $A.addValueProvider(prefix, { url : url});
            }
        }

        if (window.Aura && window.Aura.frameworkJsReady) {
            initGVP(absoluteUrl);
        } else {
            var Aura = window.Aura || (window.Aura={});
            Aura.beforeFrameworkInit = Aura.beforeFrameworkInit || [], window.Aura.beforeFrameworkInit.push(initGVP(absoluteUrl));
        }
    };

    function addScripts(urls, onload) {
        var head = document.getElementsByTagName("HEAD")[0];
        for (var i = 0; i < urls.length; i++) {
            var script = document.createElement("SCRIPT");
            script.type = "text/javascript";
            script.src = urls[i];
            script.async = false;
            script.onerror = logError;
            if (i == urls.length - 1) {
                script.onload = onload;
            }
            head.appendChild(script);
        }
    };

    function addAsyncScripts(urls) {
        var head = document.getElementsByTagName("HEAD")[0];
        for (var i = 0; i < urls.length; i++) {
            var script = document.createElement("SCRIPT");
            script.type = "text/javascript";
            script.setAttribute("data-src", urls[i]);
            head.appendChild(script);
        }
    };

    function addStyle(url) {
        var link = document.createElement("LINK");
        link.setAttribute("data-href", url);
        link.type = "text/css";
        link.rel = "stylesheet";
        link.classList.add("auraCss");
        link.onerror = logError;
        var head = document.getElementsByTagName("HEAD")[0];
        head.appendChild(link);
    };

    function logError(error) {
        var targetURI;
        // for <script> tags, targetURI is the src attribute
        if (typeof error.target.src !== "undefined") {
            targetURI = error.target.src;
        } else {
        // for <link> tags, targetURI is the href attribute
            targetURI = error.target.href;
        }

        if (typeof $A.metricsService !== "undefined") {
            $A.metricsService.transaction("aura", "lightningout:client-error", {
                "context": {
                    "eventSource": "error",
                    "attributes": {
                        "targetURI": targetURI,
                        "baseURI": error.currentTarget.baseURI
                    }
                }
            });
        }
    }

    function displayErrorText(error) {
        var para = document.createElement("P");
        var lines = error.split("\\n");
        for (var n = 0; n < lines.length; n++) {
            var t = document.createTextNode(lines[n]);
            para.appendChild(t);
            var br = document.createElement("BR");
            para.appendChild(br);
        }

        document.body.appendChild(para);
    };

    function requestApp(applicationTag, lightningEndPointURI, authToken, paramsObj, callback) {
        var parts = applicationTag.split(":");

        var url = parts[0] + "/" + parts[1] + ".app?aura.format=JSON&aura.formatAdapter=LIGHTNING_OUT";

        if (paramsObj) {
            url = url + "&" + Object.keys(paramsObj).map(function(key, index) {
                return key + "=" + paramsObj[key];
            }).join("&");
        }

        if (lightningEndPointURI) {
            url = lightningEndPointURI + "/" + url;
        } else {
            // Extract the base path from our own <script> include to adjust for LC4VF/Communities/Sites
            var scripts = document.getElementsByTagName("script");
            for (var m = 0; m < scripts.length; m++) {
                var script = scripts[m].src;
                var i = script.indexOf("/lightning/lightning.out.js");
                if (i >= 0) {
                    var basePath = script.substring(0, i);
                    url = basePath + "/" + url;
                    break;
                }
            }
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr);
            }
        };

        xhr.open("GET", url, true);

        if(authToken || paramsObj) {
            xhr.withCredentials = true;
        }
        if(authToken) {
            xhr.setRequestHeader("Authorization", "OAuth " + authToken);
            _previousRequestAuthToken = authToken;
        }

        xhr.send();
    };

    return {
        use: function(applicationTag, callback, lightningEndPointURI, authToken, paramsObj) {
            if(_applicationTag && _applicationTag !== applicationTag) {
                throw new Error("$Lightning.use() already invoked with application: " + _applicationTag);
            }

            if(!_applicationTag) {
                _applicationTag = applicationTag;
                _pendingReadyRequests = [];
                _ready = false;

                requestApp(applicationTag, lightningEndPointURI, authToken, paramsObj, function(xhr) {
                    var errorMarker = xhr.responseText.indexOf("/*ERROR*/");
                    if (errorMarker == -1) {
                        var config = JSON.parse(xhr.responseText);

                        // save the delegate version to local storage
                        try {
                            localStorage.lightningOutDelegateVersion = config.delegateVersion;
                        } catch (e) {}

                        addAsyncScripts(config.clientLibraries);

                        addScripts(config.scripts, function() {
                            if ((config.absoluteURL) && !$A.util.isEmpty(config.absoluteURL)) {
                                initAbsoluteGVP(config.absoluteURL);
                            }

                            if (config.auraConfig) {
                            	setTimeout(function () {
                            		$A.initAsync(config.auraConfig);
                                }, 0);
                            } else {
                                // Backward compatibility with 198
                                $A.initConfig(config.auraInitConfig, true);
                                $Lightning.lightningLoaded();
                            }
                        });

                        var styles = config.styles;
                        for (var n = 0; n < styles.length; n++) {
                            addStyle(styles[n]);
                        }
                    } else {
                        // Strip aura servlet error markers
                        var startIndex = (xhr.responseText.startsWith("*/")) ? 2 : 0;
                        var jsonExcptn = xhr.responseText.substring(startIndex,errorMarker);
                        jsonExcptn = jsonExcptn.replace(/\\n/g, "\\\\n"); // preserve newlines inside json stringified values by escaping them
                        var exceptn = JSON.parse(jsonExcptn);
                        displayErrorText(exceptn.message);
                    }
                });
            } else if(authToken !== _previousRequestAuthToken && $A !== undefined && $A !== null) {
                // Update the CSRF token for the new authentication context.
                requestApp(applicationTag, lightningEndPointURI, authToken, paramsObj, function(xhr) {
                    var config = JSON.parse(xhr.responseText);
                    if(config.auraConfig && config.auraConfig.token){
                    	   $A.clientService.resetToken(config.auraConfig.token);
                    }
                });
            }
            
            if(callback) {
                ready(callback);
            }
            

        },

        ready : ready,

        createComponent : function(type, attributes, locator, callback) {
            // Check to see if we know about the component - enforce aura:dependency
            // is used to avoid silent performance killer
            var unknownComponent;
            try {
                unknownComponent = $A.componentService.getDef(type) === undefined;
            } catch (e) {
                if ("Unknown component: markup://" + type === e.message) {
                    unknownComponent = true;
                } else {
                    throw e;
                }
            }

            if (unknownComponent) {
                $A.warning("No component definition for " + type + " in the client registry - for best performance add <aura:dependency resource=\""
                        + type + "\"/> to your extension of "
                        + _applicationTag + ".");
            }

            _auraContextCallback(function() {
                var config = {
                    componentDef : "markup://" + type,
                    attributes : {
                        values : attributes
                    }
                };

                $A.createComponent(type, attributes, function(component, status, statusMessage) {
                    var error = null;

                    var stringLocator = $A.util.isString(locator);
                    var hostEl = stringLocator ? document.getElementById(locator) : locator;

                    if (!hostEl) {
                        error = "Invalid locator specified - "
                                + (stringLocator ? "no element found in the DOM with id=" + locator : "locator element not provided");
                    } else if (status !== "SUCCESS") {
                        error = statusMessage;
                    }

                    if (error) {
                        throw new Error(error);
                    }

                    $A.util.addClass(hostEl,"slds-scope");
                    $A.render(component, hostEl);
                    $A.afterRender(component);

                    hostEl.setAttribute("data-ltngout-rendered-by", component.getGlobalId());

                    if (callback) {
                        try {
                            callback(component, status, statusMessage);
                        } catch (e) {
                            // Associate any callback error with the lightning out component being created to facilitate proper gack suppression
                            if (!(e instanceof $A.$auraError$)) {
                                e = new $A.$auraError$(null, e);
                            }
                            e.component = type;
                            e.componentStack = e.componentStack.concat(" > ", "[", type, "]");
                            $A.reportError("Lightning out App error in callback function", e);
                        }
                    }
                });
            });
        },

        lightningLoaded : function(application, auraContextCallback) {
            if (!_application) {
                _application = application;
                _auraContextCallback = auraContextCallback;

                if (!document.getElementById("auraErrorMessage")) {
                    var div = document.createElement("DIV");
                    div.id = "auraErrorMessage";
                    document.body.appendChild(div);
                }

                for (var n = 0; n < _pendingReadyRequests.length; n++) {
                    _pendingReadyRequests[n]();
                }

                _ready = true;
            }
        },

        getApplication : function() {
            return _application;
        }
    };
})();
