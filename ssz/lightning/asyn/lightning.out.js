/*
 * Copyright 2024 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

// make sure we don't redefine the api if already present
if (!window.$Lightning) {
    $Lightning = (function() {
        // delegate status
        var delegateLoaded = false;

        // queue to store un-delegated calls
        var callQueue = [];

        // util methods
        function getDelegateScriptUrl() {
            // load the delegate script based on stored version (got from aura nonce) or get latest version
            var url = "/lightning.out.delegate.js?v=" + getDelegateScriptVersion();

            // Extract the base path from our own <script> include to adjust for LC4VF/Communities/Sites
            var scripts = document.getElementsByTagName("script");
            for (var m = 0; m < scripts.length; m++) {
                var script = scripts[m].src;
                var i = script.indexOf("/lightning.out.js");
                if (i >= 0) {
                    var basePath = script.substring(0, i);
                    url = basePath + url;
                    break;
                }
            }

            return url;
        }

        function getDelegateScriptVersion(){
            try {
                if(localStorage.lightningOutDelegateVersion){
                    return localStorage.lightningOutDelegateVersion;
                }
            } catch (e) {}
            return (new Date()).getTime();
        }

        function loadDelegateScript() {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = getDelegateScriptUrl();
            script.onload = function() {
                delegateLoaded = true;
                while(callQueue.length) {
                    $Lightning._delegate.use.apply(this, callQueue.shift());
                }
            }
            document.head.appendChild(script);
        }

        function loadAuraScript(){
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = getAuraFWUrl();
                //"https://sisi-lcs-imac3-dev-ed.develop.my.localhost.sfdcdev.site.com:7443/auratest/auraFW/javascript/ZmQ3cTY1S1FuMXN4RWtOb0MzX19mQWI3R1VKcGhJWk5vdjhFRG1WRXIwQ2cyNTAuMy4xLTYuMC4w/aura_dev.js";
            script.async = true;
            script.setAttribute("rel", "prefetch");

            script.onload = function() {
                console.log("Loading an script " + this.src);
            }
                /*function() {
                delegateLoaded = true;
                while(callQueue.length) {
                    $Lightning._delegate.use.apply(this, callQueue.shift());
                }
            }*/

            var head = document.getElementsByTagName("HEAD")[0];

            head.appendChild(script);
        }

        function getAuraFWUrl() {
            // load the delegate script based on stored version (got from aura nonce) or get latest version
            var url = "/auraFW/javascript/" + getDelegateScriptVersion() + "/aura_prod.js";

            // Extract the base path from our own <script> include to adjust for LC4VF/Communities/Sites
            /*
            var scripts = document.getElementsByTagName("script");
            for (var m = 0; m < scripts.length; m++) {
                var script = scripts[m].src;
                var i = script.indexOf("/lightning/lightning.out2.js");
                if (i >= 0) {
                    var basePath = script.substring(0, i);
                    url = basePath + url;
                    break;
                }
            }*/

            return "https://dsg000007gucs2aa.test1.my.pc-rnd.site.com" + url;
        }
        // load delegate

        loadAuraScript();
        loadDelegateScript();

        return {
            use: function() {
                var args = Array.prototype.slice.call(arguments);
                if (delegateLoaded) {
                    return $Lightning._delegate.use.apply(this, args);
                } else {
                    // queue the request
                    return callQueue.push(args);
                }
            },
            createComponent: function() {
                return $Lightning._delegate.createComponent.apply(this, Array.prototype.slice.call(arguments));
            },
            getApplication: function() {
                return $Lightning._delegate.getApplication.apply(this, Array.prototype.slice.call(arguments));
            },
            lightningLoaded: function() {
                return $Lightning._delegate.lightningLoaded.apply(this, Array.prototype.slice.call(arguments));
            },
            ready: function() {
                return $Lightning._delegate.ready.apply(this, Array.prototype.slice.call(arguments));
            }
        }
    })();
}
