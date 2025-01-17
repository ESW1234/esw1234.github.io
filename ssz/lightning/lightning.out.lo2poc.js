(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
        (function(that) {
            "use strict";
            var Framebus = require("framebus");
            var $$iframeRef$$;
            var bus;

            function load(endpoint, parentDomElement) {
                console.log("lo_demo_hostpagescript js is loaded");
                const iframe = that.document.createElement("iframe");
                const shadow = parentDomElement.attachShadow({ mode: "closed" });
                iframe.id = "lightning_af";
                iframe.name = "lightning_af";
                iframe.scrolling = "no"
                iframe.sandxox = "allow-downloads allow-forms allow-scripts";
                iframe.frameborder = 0;
                iframe.style = "position:relative;border:0;overflow:none;visibility:none"
                iframe.width = "100%";
                iframe.height = iframe.style.height;
                iframe.onerror = (err) => alert("Error Loading iframe for " + iframe.src);
                iframe.onload = (event) => {
                    const customEvent = new CustomEvent("LightningOutLoaded", {
                        detail: {
                            application: endpoint,
                        },
                        composed: true
                    });
                    //Need this so we can maintain contact with the iframe.
                    // Since we are within a closed shadow root, we cannot select the iframe after the fact.
                    $$iframeRef$$ = event.target;
                    shadow.dispatchEvent(customEvent);

                    bus = new Framebus({targetFrames: [$$iframeRef$$]});


                    bus.on("lo.iframeModified", function (data) {
                        // $$iframeRef$$.width = data.detail.width;
                        $$iframeRef$$.height = data.detail.height;
                        console.log("Framebus iframe received event: lo.iframeModified" + JSON.stringify(data.detail));
                    });

                    bus.on("lo.dataToParent", function (data) {
                        const customEventData = new CustomEvent("lo.dataReceive", {
                            detail: data.detail ,
                            composed: true
                        });
                        parentDomElement.dispatchEvent(customEventData);
                        console.log("Framebus iframe received event: lo.dataToParent, dispatching it to host page");
                    });


                    parentDomElement.addEventListener("lo.dataSend", (event) => {
                        bus.emit("lo.dataToChild", {
                            detail: event.detail
                        })
                    })
                };

                window.addEventListener("message", (event) => {
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
                });

                shadow.appendChild(iframe);
                iframe.src = endpoint;
            }

            function preload(endpoint, parentDomElement) {
                load(endpoint, parentDomElement);
            }

            class LightningOut extends HTMLElement {
                static get observedAttributes() {
                    return ['data-url'];
                }

                adoptedCallback() {
                    // If someone tries to modify the parent of the component, remove the whole component.
                    this.remove();
                }

                connectedCallback() {
                    const url = this.getAttribute('data-url');
                    if (url) {
                       // preload("https://trialorgfarmforu5.my.localhost.sfdcdev.site.com:7443/lp/error" + "?LIGHTNING_OUT=true", this);
                      // preload("https://trialorgfarmforu5.my.localhost.sfdcdev.site.com:7443/lwr3?queryParam=fragment/z4v9l1k6pkgwb5dkk34xzadt2fwkkxxuwubz42vyblx" + "&LIGHTNING_OUT=true", this);
                         //preload("https://trialorgfarmforu5.my.localhost.sfdcdev.site.com:7443/lp/20Yxx0000011R4k/webruntime/fragment/06e9c70355f0b0a3042d8179fb887050/prod/en-US/z4vkkmcwgf8fr487n08gppr81lfzn6xp1a7bqx8ay4l" + "?LIGHTNING_OUT=true", this);
                        ///lp/20Yxx0000011R4k/webruntime/fragment/06e9c70355f0b0a3042d8179fb887050/prod/en-US/z4vkkmcwgf8fr487n08gppr81lfzn6xp1a7bqx8ay4l
                        preload(url , this);
                    } else {
                        console.error('No URL provided for LightningOut element.');
                    }
                }
            }
            customElements.define("framebus-lo-fragment", LightningOut);

        })(window);
    },{"framebus":4}],2:[function(require,module,exports){
        'use strict';

        function uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0;
                var v = c === 'x' ? r : r & 0x3 | 0x8;

                return v.toString(16);
            });
        }

        module.exports = uuid;

    },{}],3:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.Framebus = void 0;
        var lib_1 = require("./lib");
        var DefaultPromise = (typeof window !== "undefined" &&
            window.Promise);
        var Framebus = /** @class */ (function () {
            function Framebus(options) {
                if (options === void 0) { options = {}; }
                this.origin = options.origin || "*";
                this.channel = options.channel || "";
                this.verifyDomain = options.verifyDomain;
                // if a targetFrames configuration is not passed in,
                // the default behavior is to broadcast the payload
                // to the top level window or to the frame itself.
                // By default, the broadcast function will loop through
                // all the known siblings and children of the window.
                // If a targetFrames array is passed, it will instead
                // only broadcast to those specified targetFrames
                this.targetFrames = options.targetFrames || [];
                this.limitBroadcastToFramesArray = Boolean(options.targetFrames);
                this.isDestroyed = false;
                this.listeners = [];
                this.hasAdditionalChecksForOnListeners = Boolean(this.verifyDomain || this.limitBroadcastToFramesArray);
            }
            Framebus.setPromise = function (PromiseGlobal) {
                Framebus.Promise = PromiseGlobal;
            };
            Framebus.target = function (options) {
                return new Framebus(options);
            };
            Framebus.prototype.addTargetFrame = function (frame) {
                if (!this.limitBroadcastToFramesArray) {
                    return;
                }
                this.targetFrames.push(frame);
            };
            Framebus.prototype.include = function (childWindow) {
                if (childWindow == null) {
                    return false;
                }
                if (childWindow.Window == null) {
                    return false;
                }
                if (childWindow.constructor !== childWindow.Window) {
                    return false;
                }
                lib_1.childWindows.push(childWindow);
                return true;
            };
            Framebus.prototype.target = function (options) {
                return Framebus.target(options);
            };
            Framebus.prototype.emit = function (eventName, data, reply) {
                if (this.isDestroyed) {
                    return false;
                }
                var origin = this.origin;
                eventName = this.namespaceEvent(eventName);
                if ((0, lib_1.isntString)(eventName)) {
                    return false;
                }
                if ((0, lib_1.isntString)(origin)) {
                    return false;
                }
                if (typeof data === "function") {
                    reply = data;
                    data = undefined; // eslint-disable-line no-undefined
                }
                var payload = (0, lib_1.packagePayload)(eventName, origin, data, reply);
                if (!payload) {
                    return false;
                }
                if (this.limitBroadcastToFramesArray) {
                    this.targetFramesAsWindows().forEach(function (frame) {
                        (0, lib_1.sendMessage)(frame, payload, origin);
                    });
                }
                else {
                    (0, lib_1.broadcast)(payload, {
                        origin: origin,
                        frame: window.top || window.self,
                    });
                }
                return true;
            };
            Framebus.prototype.emitAsPromise = function (eventName, data) {
                var _this = this;
                return new Framebus.Promise(function (resolve, reject) {
                    var didAttachListener = _this.emit(eventName, data, function (payload) {
                        resolve(payload);
                    });
                    if (!didAttachListener) {
                        reject(new Error("Listener not added for \"".concat(eventName, "\"")));
                    }
                });
            };
            Framebus.prototype.on = function (eventName, originalHandler) {
                if (this.isDestroyed) {
                    return false;
                }
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                var self = this;
                var origin = this.origin;
                var handler = originalHandler;
                eventName = this.namespaceEvent(eventName);
                if ((0, lib_1.subscriptionArgsInvalid)(eventName, handler, origin)) {
                    return false;
                }
                if (this.hasAdditionalChecksForOnListeners) {
                    /* eslint-disable no-invalid-this, @typescript-eslint/ban-ts-comment */
                    handler = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        // @ts-ignore
                        if (!self.passesVerifyDomainCheck(this && this.origin)) {
                            return;
                        }
                        // @ts-ignore
                        if (!self.hasMatchingTargetFrame(this && this.source)) {
                            return;
                        }
                        originalHandler.apply(void 0, args);
                    };
                    /* eslint-enable no-invalid-this, @typescript-eslint/ban-ts-comment */
                }
                this.listeners.push({
                    eventName: eventName,
                    handler: handler,
                    originalHandler: originalHandler,
                });
                lib_1.subscribers[origin] = lib_1.subscribers[origin] || {};
                lib_1.subscribers[origin][eventName] = lib_1.subscribers[origin][eventName] || [];
                lib_1.subscribers[origin][eventName].push(handler);
                return true;
            };
            Framebus.prototype.off = function (eventName, originalHandler) {
                var handler = originalHandler;
                if (this.isDestroyed) {
                    return false;
                }
                if (this.verifyDomain) {
                    for (var i = 0; i < this.listeners.length; i++) {
                        var listener = this.listeners[i];
                        if (listener.originalHandler === originalHandler) {
                            handler = listener.handler;
                        }
                    }
                }
                eventName = this.namespaceEvent(eventName);
                var origin = this.origin;
                if ((0, lib_1.subscriptionArgsInvalid)(eventName, handler, origin)) {
                    return false;
                }
                var subscriberList = lib_1.subscribers[origin] && lib_1.subscribers[origin][eventName];
                if (!subscriberList) {
                    return false;
                }
                for (var i = 0; i < subscriberList.length; i++) {
                    if (subscriberList[i] === handler) {
                        subscriberList.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };
            Framebus.prototype.teardown = function () {
                if (this.isDestroyed) {
                    return;
                }
                this.isDestroyed = true;
                for (var i = 0; i < this.listeners.length; i++) {
                    var listener = this.listeners[i];
                    this.off(listener.eventName, listener.handler);
                }
                this.listeners.length = 0;
            };
            Framebus.prototype.passesVerifyDomainCheck = function (origin) {
                if (!this.verifyDomain) {
                    // always pass this check if no verifyDomain option was set
                    return true;
                }
                return this.checkOrigin(origin);
            };
            Framebus.prototype.targetFramesAsWindows = function () {
                if (!this.limitBroadcastToFramesArray) {
                    return [];
                }
                return this.targetFrames
                    .map(function (frame) {
                        // we can't pull off the contentWindow
                        // when the iframe is originally added
                        // to the array, because if it is not
                        // in the DOM at that time, it will have
                        // a contentWindow of `null`
                        if (frame instanceof HTMLIFrameElement) {
                            return frame.contentWindow;
                        }
                        return frame;
                    })
                    .filter(function (win) {
                        // just in case an iframe element
                        // was removed from the DOM
                        // and the contentWindow property
                        // is null
                        return win;
                    });
            };
            Framebus.prototype.hasMatchingTargetFrame = function (source) {
                if (!this.limitBroadcastToFramesArray) {
                    // always pass this check if we aren't limiting to the target frames
                    return true;
                }
                var matchingFrame = this.targetFramesAsWindows().find(function (frame) {
                    return frame === source;
                });
                return Boolean(matchingFrame);
            };
            Framebus.prototype.checkOrigin = function (postMessageOrigin) {
                var merchantHost;
                var a = document.createElement("a");
                a.href = location.href;
                if (a.protocol === "https:") {
                    merchantHost = a.host.replace(/:443$/, "");
                }
                else if (a.protocol === "http:") {
                    merchantHost = a.host.replace(/:80$/, "");
                }
                else {
                    merchantHost = a.host;
                }
                var merchantOrigin = a.protocol + "//" + merchantHost;
                if (merchantOrigin === postMessageOrigin) {
                    return true;
                }
                if (this.verifyDomain) {
                    return this.verifyDomain(postMessageOrigin);
                }
                return true;
            };
            Framebus.prototype.namespaceEvent = function (eventName) {
                if (!this.channel) {
                    return eventName;
                }
                return "".concat(this.channel, ":").concat(eventName);
            };
            Framebus.Promise = DefaultPromise;
            return Framebus;
        }());
        exports.Framebus = Framebus;

    },{"./lib":11}],4:[function(require,module,exports){
        "use strict";
        var lib_1 = require("./lib");
        var framebus_1 = require("./framebus");
        (0, lib_1.attach)();
        module.exports = framebus_1.Framebus;

    },{"./framebus":3,"./lib":11}],5:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.detach = exports.attach = void 0;
        var _1 = require("./");
        var isAttached = false;
        function attach() {
            if (isAttached || typeof window === "undefined") {
                return;
            }
            isAttached = true;
            window.addEventListener("message", _1.onMessage, false);
        }
        exports.attach = attach;
        // removeIf(production)
        function detach() {
            isAttached = false;
            window.removeEventListener("message", _1.onMessage, false);
        }
        exports.detach = detach;
        // endRemoveIf(production)

    },{"./":11}],6:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.broadcastToChildWindows = void 0;
        var _1 = require("./");
        function broadcastToChildWindows(payload, origin, source) {
            for (var i = _1.childWindows.length - 1; i >= 0; i--) {
                var childWindow = _1.childWindows[i];
                if (childWindow.closed) {
                    _1.childWindows.splice(i, 1);
                }
                else if (source !== childWindow) {
                    (0, _1.broadcast)(payload, {
                        origin: origin,
                        frame: childWindow.top,
                    });
                }
            }
        }
        exports.broadcastToChildWindows = broadcastToChildWindows;

    },{"./":11}],7:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.broadcast = void 0;
        var _1 = require("./");
        function broadcast(payload, options) {
            var i = 0;
            var frameToBroadcastTo;
            var origin = options.origin, frame = options.frame;
            try {
                frame.postMessage(payload, origin);
                if ((0, _1.hasOpener)(frame) && frame.opener.top !== window.top) {
                    broadcast(payload, {
                        origin: origin,
                        frame: frame.opener.top,
                    });
                }
                // previously, our max value was frame.frames.length
                // but frames.length inherits from window.length
                // which can be overwritten if a developer does
                // `var length = value;` outside of a function
                // scope, it'll prevent us from looping through
                // all the frames. With this, we loop through
                // until there are no longer any frames
                // eslint-disable-next-line no-cond-assign
                while ((frameToBroadcastTo = frame.frames[i])) {
                    broadcast(payload, {
                        origin: origin,
                        frame: frameToBroadcastTo,
                    });
                    i++;
                }
            }
            catch (_) {
                /* ignored */
            }
        }
        exports.broadcast = broadcast;

    },{"./":11}],8:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.subscribers = exports.childWindows = exports.prefix = void 0;
        exports.prefix = "/*framebus*/";
        exports.childWindows = [];
        exports.subscribers = {};

    },{}],9:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.dispatch = void 0;
        var _1 = require("./");
        function dispatch(origin, event, data, reply, e) {
            if (!_1.subscribers[origin]) {
                return;
            }
            if (!_1.subscribers[origin][event]) {
                return;
            }
            var args = [];
            if (data) {
                args.push(data);
            }
            if (reply) {
                args.push(reply);
            }
            for (var i = 0; i < _1.subscribers[origin][event].length; i++) {
                _1.subscribers[origin][event][i].apply(e, args);
            }
        }
        exports.dispatch = dispatch;

    },{"./":11}],10:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.hasOpener = void 0;
        function hasOpener(frame) {
            if (frame.top !== frame) {
                return false;
            }
            if (frame.opener == null) {
                return false;
            }
            if (frame.opener === frame) {
                return false;
            }
            if (frame.opener.closed === true) {
                return false;
            }
            return true;
        }
        exports.hasOpener = hasOpener;

    },{}],11:[function(require,module,exports){
        "use strict";
        var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                desc = { enumerable: true, get: function() { return m[k]; } };
            }
            Object.defineProperty(o, k2, desc);
        }) : (function(o, m, k, k2) {
            if (k2 === undefined) k2 = k;
            o[k2] = m[k];
        }));
        var __exportStar = (this && this.__exportStar) || function(m, exports) {
            for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        __exportStar(require("./attach"), exports);
        __exportStar(require("./broadcast-to-child-windows"), exports);
        __exportStar(require("./broadcast"), exports);
        __exportStar(require("./constants"), exports);
        __exportStar(require("./dispatch"), exports);
        __exportStar(require("./has-opener"), exports);
        __exportStar(require("./is-not-string"), exports);
        __exportStar(require("./message"), exports);
        __exportStar(require("./package-payload"), exports);
        __exportStar(require("./send-message"), exports);
        __exportStar(require("./subscribe-replier"), exports);
        __exportStar(require("./subscription-args-invalid"), exports);
        __exportStar(require("./types"), exports);
        __exportStar(require("./unpack-payload"), exports);

    },{"./attach":5,"./broadcast":7,"./broadcast-to-child-windows":6,"./constants":8,"./dispatch":9,"./has-opener":10,"./is-not-string":12,"./message":13,"./package-payload":14,"./send-message":15,"./subscribe-replier":16,"./subscription-args-invalid":17,"./types":18,"./unpack-payload":19}],12:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.isntString = void 0;
        function isntString(str) {
            return typeof str !== "string";
        }
        exports.isntString = isntString;

    },{}],13:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.onMessage = void 0;
        var _1 = require("./");
        function onMessage(e) {
            if ((0, _1.isntString)(e.data)) {
                return;
            }
            var payload = (0, _1.unpackPayload)(e);
            if (!payload) {
                return;
            }
            var data = payload.eventData;
            var reply = payload.reply;
            (0, _1.dispatch)("*", payload.event, data, reply, e);
            (0, _1.dispatch)(e.origin, payload.event, data, reply, e);
            (0, _1.broadcastToChildWindows)(e.data, payload.origin, e.source);
        }
        exports.onMessage = onMessage;

    },{"./":11}],14:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.packagePayload = void 0;
        var _1 = require("./");
        function packagePayload(event, origin, data, reply) {
            var packaged;
            var payload = {
                event: event,
                origin: origin,
            };
            if (typeof reply === "function") {
                payload.reply = (0, _1.subscribeReplier)(reply, origin);
            }
            payload.eventData = data;
            try {
                packaged = _1.prefix + JSON.stringify(payload);
            }
            catch (e) {
                throw new Error("Could not stringify event: ".concat(e.message));
            }
            return packaged;
        }
        exports.packagePayload = packagePayload;

    },{"./":11}],15:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.sendMessage = void 0;
        /**
         * A basic function for wrapping the sending of postMessages to frames.
         */
        function sendMessage(frame, payload, origin) {
            try {
                frame.postMessage(payload, origin);
            }
            catch (error) {
                /* ignored */
            }
        }
        exports.sendMessage = sendMessage;

    },{}],16:[function(require,module,exports){
        "use strict";
        var __importDefault = (this && this.__importDefault) || function (mod) {
            return (mod && mod.__esModule) ? mod : { "default": mod };
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.subscribeReplier = void 0;
        var framebus_1 = require("../framebus");
        var uuid_1 = __importDefault(require("@braintree/uuid"));
        function subscribeReplier(fn, origin) {
            var uuid = (0, uuid_1.default)();
            function replier(data, replyOriginHandler) {
                fn(data, replyOriginHandler);
                framebus_1.Framebus.target({
                    origin: origin,
                }).off(uuid, replier);
            }
            framebus_1.Framebus.target({
                origin: origin,
            }).on(uuid, replier);
            return uuid;
        }
        exports.subscribeReplier = subscribeReplier;

    },{"../framebus":3,"@braintree/uuid":2}],17:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.subscriptionArgsInvalid = void 0;
        var _1 = require("./");
        function subscriptionArgsInvalid(event, fn, origin) {
            if ((0, _1.isntString)(event)) {
                return true;
            }
            if (typeof fn !== "function") {
                return true;
            }
            return (0, _1.isntString)(origin);
        }
        exports.subscriptionArgsInvalid = subscriptionArgsInvalid;

    },{"./":11}],18:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });

    },{}],19:[function(require,module,exports){
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.unpackPayload = void 0;
        var _1 = require("./");
        function unpackPayload(e) {
            var payload;
            if (e.data.slice(0, _1.prefix.length) !== _1.prefix) {
                return false;
            }
            try {
                payload = JSON.parse(e.data.slice(_1.prefix.length));
            }
            catch (err) {
                return false;
            }
            if (payload.reply) {
                var replyOrigin_1 = e.origin;
                var replySource_1 = e.source;
                var replyEvent_1 = payload.reply;
                payload.reply = function reply(replyData) {
                    if (!replySource_1) {
                        return;
                    }
                    var replyPayload = (0, _1.packagePayload)(replyEvent_1, replyOrigin_1, replyData);
                    if (!replyPayload) {
                        return;
                    }
                    replySource_1.postMessage(replyPayload, replyOrigin_1);
                };
            }
            return payload;
        }
        exports.unpackPayload = unpackPayload;

    },{"./":11}]},{},[1]);
