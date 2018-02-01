embedded_svc.defineFeature("Invite", function(esw) {
/**
 * Lot of code in this file ported over from
 * liveagent/main/clients/html/rest/src/visitor/{build}/button.js and
 * liveagent/main/clients/html/rest/src/visitor/{build}/invite.js
 */ 

/**
 * Invite related global variables
 */
	var inviteTriggered = false;
	var customVariables = {};
	var customVariableRules = {};
	var buttons = {};
	var counter = 0;
	// Static HTML for agent avatar image should have this ID
	var INVITE_AVATAR_DOM_ID = "embeddedServiceAvatar";
	
	/*******************************************/
	/** Storage **/
	/*******************************************/
	var store = new function() {
		var Keys = {
			PAGE_COUNT: "snapinsPc",
			SESSION_START: "snapinsStart",
			PAGE: "snapinsPage_",
			PAGE_TIME: "snapinsPageTime_"
		};
		
		this.init = function() {
			var pageCount = parseInt(window.localStorage.getItem(Keys.PAGE_COUNT), 10) || 0;
			
			// Storing session data in localStorage as we don't care about session continuity with invitations
			// We never delete session data unless the chasitor clears browser data
			if(!window.localStorage.getItem(Keys.SESSION_START)) {
				window.localStorage.setItem(Keys.SESSION_START, new Date().getTime().toString());
			}
			// Set the current page and update page count
			window.localStorage.setItem(Keys.PAGE_COUNT, (pageCount + 1).toString());
			window.localStorage.setItem(Keys.PAGE + pageCount.toString(), window.location.href);
			window.localStorage.setItem(Keys.PAGE_TIME + pageCount.toString(), new Date().getTime());
		};
		
		this.getPageCount = function() {
			return parseInt(window.localStorage.getItem(Keys.PAGE_COUNT), 10);
		};
		
		this.getSessionStart = function() {
			return window.localStorage.getItem(Keys.SESSION_START);
		};
		
		this.getCurrentPage = function() {
			return window.localStorage.getItem(Keys.PAGE + (this.getPageCount() - 1).toString());
		};
	}();

	function getCSSAnimationPrefix(element) {
		var prefixes = ["Webkit", "Moz", "O", "ms", "Khtml"];
		var cssPrefix;

		if(element.style.animationName !== undefined) {
			return "";
		}
		prefixes.forEach(function(prefix) {
			if(element.style[prefix + "AnimationName"] !== undefined) {
				cssPrefix = prefix.toLowerCase();
			}
		});

		return cssPrefix;
	}

	/**
	 * Adds event listener to the specified element
	 */
	function addEventListener(elem, event, callback) {
		if(elem.addEventListener) {
			elem.addEventListener(event, callback, false);
		} else if(elem.attachEvent) {
			elem.attachEvent("on" + event, callback, false);
		} else {
			throw new Error("Could not add event listener");
		}
	}

	/**
 	* Abstract prototype for buttons
 	* @constructor
 	*/
	function AbstractButton() {}

	AbstractButton.TYPE = {
		STANDARD: "STANDARD",
		INVITE: "INVITE",
		AGENT: "AGENT"
	};

	AbstractButton.prototype.init = function(buttonId, type) {
		this.buttonId = buttonId;
		this.type = type;
		this.onlineState = undefined;
		this.trackers = [];
	};

	AbstractButton.prototype.getType = function() {
		return this.type;
	};

	/**
 	* @return {?boolean} The online state for the button. Null if unknown.
 	*/
	AbstractButton.prototype.getOnlineState = function() {
		return this.onlineState;
	};
	
	/**
 	* @param {boolean} newOnlineState Set the online state of the button
 	*/
	AbstractButton.prototype.setOnlineState = function(newOnlineState) {
		this.onlineState = newOnlineState;
		// Set online state for button trackers
		this.trackers.forEach(function(tracker) {
			tracker.setState(newOnlineState);
		});
	};

	/**
 	* Abstract prototype for invite rule tree nodes
 	* @constructor
 	*/
	 function AbstractRuleTreeNode() {}
	 AbstractRuleTreeNode.prototype.init = function(left, right) {
		 this.left = left;
		 this.right = right;
	 };
	 AbstractRuleTreeNode.prototype.evaluate = function(invite) {
		 return false;
	 };

	/**
	* Abstract prototype for invite rules
 	* @constructor
 	*/
	function AbstractInviteRule() {}

	AbstractInviteRule.TYPE = {
		NUMBER_OF_PAGE_VIEWS: "NUMBER_OF_PAGE_VIEWS",
		URL_MATCH: "URL_MATCH",
		SECONDS_ON_PAGE: "SECONDS_ON_PAGE",
		SECONDS_ON_SITE: "SECONDS_ON_SITE",
		CUSTOM_VARIABLE: "CUSTOM_VARIABLE"
	};

	AbstractInviteRule.OPERATOR = {
		EQUALS: "EQUALS",
		NOT_EQUAL: "NOT_EQUAL",
		START_WITH: "START_WITH",
		CONTAINS: "CONTAINS",
		NOT_CONTAIN: "NOT_CONTAIN",
		LESS_THAN: "LESS_THAN",
		GREATER_THAN: "GREATER_THAN",
		LESS_OR_EQUAL: "LESS_OR_EQUAL",
		GREATER_OR_EQUAL: "GREATER_OR_EQUAL"
	};

	AbstractInviteRule.prototype.init = function(ruleId, buttonId, compareFrom, operator, compareTo) {
		this.ruleId = ruleId;
		this.buttonId = buttonId;
		this.compareFrom = compareFrom;
		this.operator = operator;
		this.compareTo = compareTo;
	};

	AbstractInviteRule.prototype.getId = function() {
		return this.ruleId;
	};

	AbstractInviteRule.prototype.evaluate = function(from, to) {
		switch(this.operator) {
			case AbstractInviteRule.OPERATOR.EQUALS:
				esw.log("Evaluate: " + from + " == " + to);
				
				return from === to;
			case AbstractInviteRule.OPERATOR.NOT_EQUAL:
				esw.log("Evaluate: " + from + " != " + to);
				
				return from !== to;
			case AbstractInviteRule.OPERATOR.START_WITH:
				esw.log("Evaluate: " + from + " indexOf " + to + " == 0");
				
				return from.indexOf(to) === 0;
			case AbstractInviteRule.OPERATOR.CONTAINS:
				esw.log("Evaluate: " + from + " indexOf " + to + " != -1");
				
				return from.indexOf(to) !== -1;
			case AbstractInviteRule.OPERATOR.NOT_CONTAIN:
				esw.log("Evaluate: " + from + " indexOf " + to + " == -1");
				
				return from.indexOf(to) === -1;
			case AbstractInviteRule.OPERATOR.LESS_THAN:
				esw.log("Evaluate: " + parseFloat(from) + " < " + parseFloat(to));
				
				return parseFloat(from) < parseFloat(to);
			case AbstractInviteRule.OPERATOR.GREATER_THAN:
				esw.log("Evaluate: " + parseFloat(from) + " > " + parseFloat(to));
				
				return parseFloat(from) > parseFloat(to);
			case AbstractInviteRule.OPERATOR.LESS_OR_EQUAL:
				esw.log("Evaluate: " + parseFloat(from) + " <= " + parseFloat(to));
				
				return parseFloat(from) <= parseFloat(to);
			case AbstractInviteRule.OPERATOR.GREATER_OR_EQUAL:
				esw.log("Evaluate: " + parseFloat(from) + " >= " + parseFloat(to));
				
				return parseFloat(from) >= parseFloat(to);
			default:
				return undefined;
		}
	};

	/**
	* Atom node of the invite rule binary tree (the actual rule to eval)
	* @constructor
	*/
	function AtomRuleTreeNode(ruleId) {
		this.ruleId = ruleId;
		AbstractRuleTreeNode.prototype.init.call(this, null, null);
	}

	AtomRuleTreeNode.prototype = new AbstractRuleTreeNode();

	AtomRuleTreeNode.prototype.evaluate = function(invite) {
		esw.log("Evaluating Atom Node: " + this.ruleId);
		
		return invite.getRule(this.ruleId).evaluate();
	};

	/**
	 * And node of the invite rule binary tree (requires both children to be true)
	 * @constructor
	 */
	function AndRuleTreeNode(left, right) {
		AbstractRuleTreeNode.prototype.init.call(this, left, right);
	}

	AndRuleTreeNode.prototype = new AbstractRuleTreeNode();

	AndRuleTreeNode.prototype.evaluate = function(invite) {
		var ret;

		esw.log("Evaluating And Node");
		ret = this.left.evaluate(invite) && this.right.evaluate(invite);

		return ret;
	};

	/**
	 * Or node of the invite rule binary tree (requires one child to be true)
	 * @constructor
	 */
	function OrRuleTreeNode(left, right) {
		AbstractRuleTreeNode.prototype.init.call(this, left, right);
	}

	OrRuleTreeNode.prototype = new AbstractRuleTreeNode();

	OrRuleTreeNode.prototype.evaluate = function(invite) {
		var ret = this.left.evaluate(invite) || this.right.evaluate(invite);

		esw.log("Evaluating Or Node");
		
		return ret;
	};

	/**
	 * Not node of the invite rule binary tree (evals the opposite of the child node)
	 * @constructor
	 */
	function NotRuleTreeNode(left) {
		AbstractRuleTreeNode.prototype.init.call(this, left, null);
	}

	NotRuleTreeNode.prototype = new AbstractRuleTreeNode();

	NotRuleTreeNode.prototype.evaluate = function(invite) {
		var ret = !this.left.evaluate(invite);
		
		esw.log("Evaluating Not Node");

		return ret;
	};

	function getInviteTracker(buttonId) {
		if(getInviteButton(buttonId)) {
			return getInviteButton(buttonId).getTracker();
		}
		
		return null;
	}

	/**
 	* Abstract prototype for invite renderers
 	* @constructor
 	*/
	 function AbstractInviteRenderer() {}
	 AbstractInviteRenderer.prototype.init = function(buttonId, element, startPosition, endPosition) {
		 if(window.innerWidth) {
			 this.realWidth = window.innerWidth;
		 } else if(document.documentElement && document.documentElement.clientWidth) {
			 this.realWidth = document.documentElement.clientWidth;
		 } else if(document.body) {
			 this.realWidth = document.body.clientWidth;
		 }
 
		 if(window.innerHeight) {
			 this.realHeight = window.innerHeight;
		 } else if(document.documentElement && document.documentElement.clientHeight) {
			 this.realHeight = document.documentElement.clientHeight;
		 } else if(document.body) {
			 this.realHeight = document.body.clientHeight;
		 }
 
		 this.offset = 25;
		 this.buttonId = buttonId;
 
		 this.animationPrefix = getCSSAnimationPrefix(element);
 
		 this.element = element;
		 this.element.style.position = this.animationPrefix ? "fixed" : "absolute";
		 this.element.style.left = "-1000px";
		 this.element.style.top = "-1000px";
		 this.element.style.zIndex = "10000";
		 this.element.style.display = "";
		 this.element.style.visibility = "visible";
 
		 this.width = this.element.offsetWidth;
		 this.height = this.element.offsetHeight;
 
		 this.startPosition = startPosition;
		 this.endPosition = endPosition;
	 };

	 AbstractInviteRenderer.prototype.render = function() {
		 this.element.style.display = "";
	 };

	 AbstractInviteRenderer.prototype.renderFinish = function() {
	 };

	 AbstractInviteRenderer.prototype.remove = function(animate) {
		 this.element.style.left = "-1000px";
		 this.element.style.top = "-1000px";
	 };

	 AbstractInviteRenderer.prototype.addRenderListeners = function() {
		 var buttonId = this.buttonId;
 
		 var iterationEvent = "AnimationIteration";
		 var endEvent = "AnimationEnd";
 
		 if(this.animationPrefix === "") {
			 iterationEvent = iterationEvent.toLowerCase();
			 endEvent = endEvent.toLowerCase();
		 } else {
			 iterationEvent = this.animationPrefix + iterationEvent;
			 endEvent = this.animationPrefix + endEvent;
		 }
 
		 addEventListener(this.element, iterationEvent, function() { getInviteTracker(buttonId).renderFinish(); });
		 addEventListener(this.element, endEvent, function() { getInviteTracker(buttonId).removeFinish(); });
	 };

	/**
 	* Slide renderers display the invite by easing it from off-screen to on-screen
 	*/
	function SlideInviteRenderer(buttonId, element, startPosition, endPosition) {
		AbstractInviteRenderer.prototype.init.call(this, buttonId, element, startPosition, endPosition);
	}
	SlideInviteRenderer.prototype = new AbstractInviteRenderer();

	SlideInviteRenderer.prototype.render = function() {
		var leftFrom = this.width * this.startPosition.xPosition + this.offset * this.startPosition.xOffset;
		var topFrom = this.height * this.startPosition.yPosition + this.offset * this.startPosition.yOffset;
		var leftTo = this.width * this.endPosition.xPercent * -1 + this.offset * this.endPosition.xOffset;
		var topTo = this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset;
		var slide = document.createElement("style");
		var prefix = "";

		AbstractInviteRenderer.prototype.addRenderListeners.call(this);
		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}
		slide.innerHTML = "@" + prefix + "keyframes slide" + this.buttonId +
		"{" +
		"from { margin-left: " + leftFrom + "px; margin-top: " + topFrom + "px; left: " + this.startPosition.xPercent * 100 + "%; top: " + this.startPosition.yPercent * 100 + "%; }" +
		"to { margin-left: " + leftTo + "px; margin-top: " + topTo + "px; left: " + this.endPosition.xPercent * 100 + "%; top: " + this.endPosition.yPercent * 100 + "%; }" +
		"}";
		document.getElementsByTagName("head")[0].appendChild(slide);

		this.element.style[prefix + "animation-name"] = "slide" + this.buttonId;
		this.element.style[prefix + "animation-duration"] = "1s";
		this.element.style[prefix + "animation-iteration-count"] = "2";
		this.element.style[prefix + "animation-direction"] = "alternate";
		this.element.style[prefix + "animation-timing-function"] = "ease-in-out";

		this.element.style.setProperty(prefix + "animation-name", "slide" + this.buttonId, "");
		this.element.style.setProperty(prefix + "animation-duration", "1s", "");
		this.element.style.setProperty(prefix + "animation-iteration-count", "2", "");
		this.element.style.setProperty(prefix + "animation-direction", "alternate", "");
		this.element.style.setProperty(prefix + "animation-timing-function", "ease-in-out", "");

		AbstractInviteRenderer.prototype.render.call(this);
	};

	SlideInviteRenderer.prototype.renderFinish = function() {
		var prefix = "";

		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}

		this.element.style[prefix + "animation-play-state"] = "paused";
		this.element.style.setProperty(prefix + "animation-play-state", "paused", "");
	};

	SlideInviteRenderer.prototype.remove = function(animate) {
		var prefix = "";

		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}

		if(animate) {
			this.element.style[prefix + "animation-play-state"] = "running";
			this.element.style.setProperty(prefix + "animation-play-state", "running", "");
		} else {
		// Removes the animation, otherwise it stays in the paused state
			this.element.style[prefix + "animation-name"] = "";
			this.element.style.setProperty(prefix + "animation-name", "", "");
			AbstractInviteRenderer.prototype.remove.call(this, animate);
		}
	};

	/**
	* Fade renderers display the invite by fading it into view
	*/
	function FadeInviteRenderer(buttonId, element, startPosition, endPosition) {
		AbstractInviteRenderer.prototype.init.call(this, buttonId, element, null, endPosition);
	}

	FadeInviteRenderer.prototype = new AbstractInviteRenderer();

	FadeInviteRenderer.prototype.render = function() {
		var prefix = "";
		var fade = document.createElement("style");
		var left = this.width * this.endPosition.xPercent * -1 + this.offset * this.endPosition.xOffset;
		var top = this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset;
		
		AbstractInviteRenderer.prototype.addRenderListeners.call(this);
		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}
		fade.innerHTML = "@" + prefix + "keyframes fade" + this.buttonId +
		"{" +
		"from { opacity: 0; }" +
		"to { opacity: 1; }" +
		"}";
		document.getElementsByTagName("head")[0].appendChild(fade);

		this.element.style[prefix + "animation-name"] = "fade" + this.buttonId;
		this.element.style[prefix + "animation-duration"] = "1s";
		this.element.style[prefix + "animation-iteration-count"] = "2";
		this.element.style[prefix + "animation-direction"] = "alternate";
		this.element.style[prefix + "animation-timing-function"] = "ease-in-out";

		this.element.style.setProperty(prefix + "animation-name", "fade" + this.buttonId, "");
		this.element.style.setProperty(prefix + "animation-duration", "1s", "");
		this.element.style.setProperty(prefix + "animation-iteration-count", "2", "");
		this.element.style.setProperty(prefix + "animation-direction", "alternate", "");
		this.element.style.setProperty(prefix + "animation-timing-function", "ease-in-out", "");
		this.element.style.marginLeft = left + "px";
		this.element.style.left = this.endPosition.xPercent * 100 + "%";
		this.element.style.marginTop = top + "px";
		this.element.style.top = this.endPosition.yPercent * 100 + "%";

		AbstractInviteRenderer.prototype.render.call(this);
	};

	FadeInviteRenderer.prototype.renderFinish = function() {
		var prefix = "";

		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}
		// Remove animation
		this.element.style[prefix + "animation-name"] = "";
		this.element.style.setProperty(prefix + "animation-name", "", "");
	};

	FadeInviteRenderer.prototype.remove = function(animate) {
		var prefix = "";

		if(this.animationPrefix !== "") {
			prefix = "-" + this.animationPrefix + "-";
		}

		if(animate) {
			this.element.style[prefix + "animation-play-state"] = "running";
			this.element.style.setProperty(prefix + "animation-play-state", "running", "");

			// There seems to be a bug in the opacity CSS animation where it doesn't stay at 0 upon reverse
			this.element.style.opacity = 0;
		} else {
			// Removes the animation, otherwise it stays in the paused state
			this.element.style[prefix + "animation-name"] = "";
			this.element.style.setProperty(prefix + "animation-name", "", "");
			AbstractInviteRenderer.prototype.remove.call(this, animate);
		}
	};

	/**
	* Appear renderers display the invite by simply displaying it at a certain position with no effects
	*/
	function AppearInviteRenderer(buttonId, element, startPosition, endPosition) {
		AbstractInviteRenderer.prototype.init.call(this, buttonId, element, null, endPosition);
	}
	AppearInviteRenderer.prototype = new AbstractInviteRenderer();

	AppearInviteRenderer.prototype.render = function() {
		var left = this.width * this.endPosition.xPercent * -1 + this.offset * this.endPosition.xOffset;
		var top = this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset;
		
		this.element.style.marginLeft = left + "px";
		this.element.style.left = this.endPosition.xPercent * 100 + "%";

		this.element.style.marginTop = top + "px";
		this.element.style.top = this.endPosition.yPercent * 100 + "%";

		AbstractInviteRenderer.prototype.render.call(this);

		getInviteTracker(this.buttonId).renderFinish();
	};

	AppearInviteRenderer.prototype.remove = function(animate) {
		if(animate) {
			getInviteTracker(this.buttonId).removeFinish();
		} else {
			AbstractInviteRenderer.prototype.remove.call(this, animate);
		}
	};
	
	/**
 	* Represents a server-side invite button
 	* @constructor
 	*/
	 function InviteButton(buttonId) {
		AbstractButton.prototype.init.call(this, buttonId, AbstractButton.TYPE.INVITE);
		this.active = false;
		this.filterLogic = null;
		this.rules = {};
		this.ruleTree = null;
		this.inviteDelay = null;
		this.inviteTimeout = null;
		this.autoRejectTimeout = null;
	}

	InviteButton.prototype = new AbstractButton();

	InviteButton.RENDERER = {
		Slide: { RenderClass: SlideInviteRenderer },
		Fade: { RenderClass: FadeInviteRenderer },
		Appear: { RenderClass: AppearInviteRenderer }
	};

	InviteButton.START_POSITION = {
		TopLeft: { xPercent: 0,
			xPosition: -1,
			xOffset: -1,
			yPercent: 0,
			yPosition: -1,
			yOffset: -1 },
		TopLeftTop: { xPercent: 0,
			xPosition: 0,
			xOffset: 1,
			yPercent: 0,
			yPosition: -1,
			yOffset: -1 },
		Top: { xPercent: 0.5,
			xPosition: -0.5,
			xOffset: 0,
			yPercent: 0,
			yPosition: -1,
			yOffset: -1 },
		TopRightTop: { xPercent: 1,
			xPosition: -1,
			xOffset: -1,
			yPercent: 0,
			yPosition: -1,
			yOffset: -1 },
		TopRight: { xPercent: 1,
			xPosition: 0,
			xOffset: 1,
			yPercent: 0,
			yPosition: -1,
			yOffset: -1 },
		TopRightRight: { xPercent: 1,
			xPosition: 0,
			xOffset: 1,
			yPercent: 0,
			yPosition: 0,
			yOffset: 1 },
		Right: { xPercent: 1,
			xPosition: 0,
			xOffset: 1,
			yPercent: 0.5,
			yPosition: -0.5,
			yOffset: 0 },
		BottomRightRight: { xPercent: 1,
			xPosition: 0,
			xOffset: 1,
			yPercent: 1,
			yPosition: -1,
			yOffset: -1 },
		BottomRight: { xPercent: 1,
			xPosition: 0,
			xOffset: 1,
			yPercent: 1,
			yPosition: 0,
			yOffset: 1 },
		BottomRightBottom: { xPercent: 1,
			xPosition: -1,
			xOffset: -1,
			yPercent: 1,
			yPosition: 0,
			yOffset: 1 },
		Bottom: { xPercent: 0.5,
			xPosition: -0.5,
			xOffset: 0,
			yPercent: 1,
			yPosition: 0,
			yOffset: 1 },
		BottomLeftBottom: { xPercent: 0,
			xPosition: 0,
			xOffset: 1,
			yPercent: 1,
			yPosition: 0,
			yOffset: 1 },
		BottomLeft: { xPercent: 0,
			xPosition: -1,
			xOffset: -1,
			yPercent: 1,
			yPosition: 0,
			yOffset: 1 },
		BottomLeftLeft: { xPercent: 0,
			xPosition: -1,
			xOffset: -1,
			yPercent: 1,
			yPosition: -1,
			yOffset: -1 },
		Left: { xPercent: 0,
			xPosition: -1,
			xOffset: -1,
			yPercent: 0.5,
			yPosition: -0.5,
			yOffset: 0 },
		TopLeftLeft: { xPercent: 0,
			xPosition: -1,
			xOffset: -1,
			yPercent: 0,
			yPosition: 0,
			yOffset: 1 }
	};

	InviteButton.END_POSITION = {
		TopLeft: { xPercent: 0,
			xOffset: 1,
			yPercent: 0,
			yOffset: 1 },
		Top: { xPercent: 0.5,
			xOffset: 0,
			yPercent: 0,
			yOffset: 1 },
		TopRight: { xPercent: 1,
			xOffset: -1,
			yPercent: 0,
			yOffset: 1 },
		Left: { xPercent: 0,
			xOffset: 1,
			yPercent: 0.5,
			yOffset: 0 },
		Center: { xPercent: 0.5,
			xOffset: 0,
			yPercent: 0.5,
			yOffset: 0 },
		Right: { xPercent: 1,
			xOffset: -1,
			yPercent: 0.5,
			yOffset: 0 },
		BottomLeft: { xPercent: 0,
			xOffset: 1,
			yPercent: 1,
			yOffset: -1 },
		Bottom: { xPercent: 0.5,
			xOffset: 0,
			yPercent: 1,
			yOffset: -1 },
		BottomRight: { xPercent: 1,
			xOffset: -1,
			yPercent: 1,
			yOffset: -3 }
	};
	
	/**
 	* Retrieves (and creates if necessary) an InviteButton for a specified buttonId
 	* @param {string} buttonId The requested button's id
 	* @return {AbstractButton} The requested button
 	*/
	 function getInviteButton(buttonId) {
		if(!buttons[buttonId]) {
			buttons[buttonId] = new InviteButton(buttonId);
		}
		
		return buttons[buttonId];
	}

	/**
 	* Standard rules perform simple comparison operations which either return true or false
 	* @constructor
 	*/
	 function StandardInviteRule(ruleId, buttonId, compareFrom, operator, compareTo) {
		AbstractInviteRule.prototype.init.call(this, ruleId, buttonId, compareFrom, operator, compareTo);
	}

	StandardInviteRule.prototype = new AbstractInviteRule();

	StandardInviteRule.prototype.evaluate = function() {
		esw.log("Evaluating StandardInviteRule");
		
		return AbstractInviteRule.prototype.evaluate.call(this, this.compareFrom, this.compareTo);
	};

	/**
 	* Timer rules perform simple comparison operations which either return true or false,
 	* or they may set a timeout to trigger the rule evaluation again later on
 	* @constructor
 	*/
	function TimerInviteRule(ruleId, buttonId, compareFrom, operator, compareTo) {
		AbstractInviteRule.prototype.init.call(this, ruleId, buttonId, compareFrom, operator, compareTo);
	}

	TimerInviteRule.prototype = new AbstractInviteRule();

	TimerInviteRule.prototype.evaluate = function() {
		var compareFrom = new Date().getTime() - this.compareFrom;
		var ret = AbstractInviteRule.prototype.evaluate.call(this, compareFrom, this.compareTo);
		var diff;

		// If evaluation failed, return the difference in seconds to set the timeout for.  This is
		// only done if the current value of the timestamp (compareFrom) is less than what it is being
		// compared to, because this means the criteria still has a potential to evaluate to true.  It
		// uses <= because the rule could use the > operator, and if compareFrom == compareTo, the rule
		// would eval to false, but we still want to set a timeout to try again (even if it's 0 seconds).
		esw.log("Evaluating TimerInviteRule");
		if(!ret && compareFrom <= this.compareTo) {
			diff = this.compareTo - compareFrom;

			if(getInviteButton(this.buttonId).getInviteDelay() === null || diff < getInviteButton(this.buttonId).getInviteDelay()) {
				getInviteButton(this.buttonId).setInviteDelay(diff);
			}
		}
		
		return ret;
	};

	/**
 	* Custom rules perform simple comparison operations against custom variables provided
 	* by the setCustomVariable api method
 	* @constructor
 	*/
	function CustomInviteRule(ruleId, buttonId, compareFrom, operator, compareTo) {
		AbstractInviteRule.prototype.init.call(this, ruleId, buttonId, compareFrom, operator, compareTo);
	}

	CustomInviteRule.prototype = new AbstractInviteRule();

	CustomInviteRule.prototype.evaluate = function() {
		if(customVariables.hasOwnProperty(this.compareFrom)) {
			esw.log("Evaluating CustomInviteRule");
			
			return AbstractInviteRule.prototype.evaluate.call(this, customVariables[this.compareFrom].toString(), this.compareTo);
		}
		esw.log("CustomInviteRule evaluation failed due to missing custom variable");
		
		return false;
	};

	function buildRuleTree(filter) {
		var split = 0;
		var parenCount = 0;
		var i;
		var left;
		var right;

		counter += 1;
		if(counter > 1000) {
			throw new Error("Error processing rule filter logic, preventing recursion");
		}

		for(i = 0; i < filter.length; i += 1) {
			if(filter.charAt(i) === "(") {
				parenCount += 1;
			} else if(filter.charAt(i) === ")") {
				parenCount -= 1;
			}
			if(filter.charAt(i) === "," && parenCount === 1) {
				split = i;
			}
		}
		if(filter.indexOf("AND(") === 0) {
			left = buildRuleTree(filter.substring(4, split));
			right = buildRuleTree(filter.substring(split + 1, filter.length - 1));

			return new AndRuleTreeNode(left, right);
		} else if(filter.indexOf("OR(") === 0) {
			left = buildRuleTree(filter.substring(3, split));
			right = buildRuleTree(filter.substring(split + 1, filter.length - 1));

			return new OrRuleTreeNode(left, right);
		} else if(filter.indexOf("NOT(") === 0) {
			left = buildRuleTree(filter.substring(4, filter.length - 1));

			return new NotRuleTreeNode(left);
		} else if(!isNaN(parseInt(filter, 10))) {
			return new AtomRuleTreeNode(parseInt(filter, 10));
		}
		throw new Error("Encountered unexpected character in filter logic");
	}

	/**
 	* Invite buttonTrackers Triggers when the underlying invite button is in its "Online" state
 	* @constructor
 	*/
	 function InviteButtonTracker(buttonId, element, renderer, startPosition, endPosition, hasInviteAfterAccept, hasInviteAfterReject, rejectTime) {
		this.buttonId = buttonId;
		this.element = element;
		this.hasInviteAfterAccept = hasInviteAfterAccept;
		this.hasInviteAfterReject = hasInviteAfterReject;
		this.rejectTime = rejectTime;
		if(getCSSAnimationPrefix(element) === null) {
			// Default to AppearInviteRenderer for browsers that don't support CSS animation
			this.renderer = new InviteButton.RENDERER.Appear.RenderClass(buttonId, element, InviteButton.START_POSITION[startPosition], InviteButton.END_POSITION[endPosition]);
		} else {
			this.renderer = new InviteButton.RENDERER[renderer].RenderClass(buttonId, element, InviteButton.START_POSITION[startPosition], InviteButton.END_POSITION[endPosition]);
		}
	}

	InviteButtonTracker.prototype.setState = function(online) {
		if(online && !inviteTriggered && getInviteButton(this.buttonId).trigger()) {
			inviteTriggered = true;
			this.renderer.render();
		} else if(!online && getInviteButton(this.buttonId).isActive()) {
			// If the invite is currently displayed (isActive) and we are setting it offline, we want to set inviteTriggered
			// back to false so that if the agent comes back online, the invite can be displayed again
			inviteTriggered = false;
			this.remove(true);
		}
	};

	InviteButtonTracker.prototype.renderFinish = function() {
		var buttonId = this.buttonId;
		
		getInviteButton(this.buttonId).setActive(true);
		if(this.rejectTime !== -1) {
			getInviteButton(this.buttonId).setAutoRejectTimeout(window.setTimeout(function() { getInviteButton(buttonId).rejectInvite(); }, this.rejectTime * 1000));
		}
		this.renderer.renderFinish();
	};

	InviteButtonTracker.prototype.accept = function() {
		if(!this.hasInviteAfterAccept) {
			esw.setCookie("liveagent_invite_rejected_" + this.buttonId, true, false);
		}
		this.remove(false);
	};

	InviteButtonTracker.prototype.reject = function() {
		if(!this.hasInviteAfterReject) {
			esw.setCookie("liveagent_invite_rejected_" + this.buttonId, true, false);
		}
		this.remove(true);
	};

	InviteButtonTracker.prototype.remove = function(animate) {
		getInviteButton(this.buttonId).setActive(false);
		this.renderer.remove(animate);
	};

	InviteButtonTracker.prototype.removeFinish = function() {
		this.renderer.remove(false);
	};

	/**
 	* @param {array} rules Array of rules
 	* @param {string} filter The filter logic used to evaluate the rules
 	*/
	InviteButton.prototype.setRules = function(rules, filter) {
		var id;
		var jsonRule;
		var rule;

		if(!rules || !filter) {
			return;
		}
		for(id in rules) {
			if(rules.hasOwnProperty(id)) {
				jsonRule = rules[id];
				rule = null;

				switch(jsonRule.type) {
					case AbstractInviteRule.TYPE.NUMBER_OF_PAGE_VIEWS:
						rule = new StandardInviteRule(jsonRule.order, this.buttonId, store.getPageCount(), jsonRule.operator, parseInt(jsonRule.value, 10));
						break;
					case AbstractInviteRule.TYPE.URL_MATCH:
						rule = new StandardInviteRule(jsonRule.order, this.buttonId, store.getCurrentPage(), jsonRule.operator, jsonRule.value);
						break;
					case AbstractInviteRule.TYPE.SECONDS_ON_PAGE:
						rule = new TimerInviteRule(jsonRule.order, this.buttonId, new Date().getTime(), jsonRule.operator, parseInt(jsonRule.value, 10) * 1000);
						break;
					case AbstractInviteRule.TYPE.SECONDS_ON_SITE:
						rule = new TimerInviteRule(jsonRule.order, this.buttonId, parseInt(store.getSessionStart(), 10), jsonRule.operator, parseInt(jsonRule.value, 10) * 1000);
						break;
					case AbstractInviteRule.TYPE.CUSTOM_VARIABLE:
						rule = new CustomInviteRule(jsonRule.order, this.buttonId, jsonRule.name, jsonRule.operator, jsonRule.value);
						if(!customVariableRules.hasOwnProperty(jsonRule.name)) {
							customVariableRules[jsonRule.name] = [];
						}
						customVariableRules[jsonRule.name].push(this.buttonId);
						break;
					default:
						break;
				}
				if(rule !== null) {
					this.addRule(rule);
				}
			}
		}
		
		this.filterLogic = filter;
		this.ruleTree = buildRuleTree(filter);
	};

	/**
 	* @param {boolean} newOnlineState Set the online state of the invite
 	*/
	InviteButton.prototype.setOnlineState = function(newOnlineState) {
		// If we are setting the invite offline, we need to check if a timeout was set
		// during rule evaluation and cancel that timeout from firing
		if(!newOnlineState && this.inviteTimeout !== null) {
			clearTimeout(this.inviteTimeout);
			this.inviteTimeout = null;
		}
		if(!newOnlineState && this.autoRejectTimeout !== null) {
			clearTimeout(this.autoRejectTimeout);
			this.autoRejectTimeout = null;
		}
		AbstractButton.prototype.setOnlineState.call(this, newOnlineState);
	};
	
	/**
 	* @return {boolean} Whether or not the invite is currently displayed (and the animation has finished)
 	*/
	InviteButton.prototype.isActive = function() {
		return this.active;
	};

	/**
 	* @param {boolean} active Whether or not the invite is currently displayed (and the animation has finished)
 	*/
	InviteButton.prototype.setActive = function(active) {
		this.active = active;
	};

	InviteButton.prototype.addTracker = function(element, data) {
		var tracker;

		// Mobile device check based on https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
		if(/Mobi/.test(navigator.userAgent)) {
			// If invite is being rendered on a mobile device, animation set to Fade and position fixed at BottomRight
			tracker = new InviteButtonTracker(data.id, element, "Fade", undefined, "BottomRight", data.hasInviteAfterAccept, data.hasInviteAfterReject, data.inviteRejectTime);
		} else {
			tracker = new InviteButtonTracker(data.id, element, data.inviteRenderer, data.inviteStartPosition, data.inviteEndPosition, data.hasInviteAfterAccept, data.hasInviteAfterReject, data.inviteRejectTime);
		}

		// InviteButtons can only have 1 tracker
		this.trackers = [];

		this.trackers.push(tracker);
	};
	
	/**
 	* Convenience method to get the buttonTracker since InviteButtons can only have 1
 	*/
	InviteButton.prototype.getTracker = function() {
		if(this.trackers.length > 1) {
			throw new Error("InviteButtons should have less than 1 tracker");
		}
		
		return this.trackers[0];
	};
	
	/**
	 * DO NOT CHANGE
	 * Called from the static html invite accept button
	 * Accepts the automated chat invite
	 */
	InviteButton.prototype.acceptInvite = function() {
		esw.onHelpButtonClick();
		this.getTracker().accept();
	};

	/**
	* DO NOT CHANGE
	* Called from the static html invite reject button
 	* Rejects an automated chat invitation.
 	*/
	InviteButton.prototype.rejectInvite = function() {
		this.getTracker().reject();
	};

	/**
	 * DO NOT CHANGE
	 * Called by admins to set custom variables for invite rules
	 */
	InviteButton.prototype.setCustomVariable = function(name, value) {
		var invite;

		customVariables[name] = value;
		if(customVariableRules.hasOwnProperty(name)) {
			customVariableRules[name].forEach(function(customVariableRuleName) {
				invite = getInviteButton(customVariableRuleName);
				// Invites can be in a "partially" online state, where the agent is available but the rule evaluation failed.
				// The only reason we should re-attempt to set the online state via custom rule trigger is if the online state
				// is already true (which means an agent is available), but we call setOnlineState again because that will handle
				// setting the state for the individual trackers and going through the proper setState channels.
				if(invite.getOnlineState()) {
					invite.setOnlineState(true);
				}
			});
		}
	};

	InviteButton.prototype.trigger = function() {
		var ret = true;
		var invite = this;
		var isHelpButtonAlreadyClicked = esw.componentInitInProgress || document.getElementsByClassName("embeddedServiceSidebar").length > 0;
		
		if(esw.getCookie("liveagent_invite_rejected_" + this.buttonId) || isHelpButtonAlreadyClicked) {
			return false;
		}
		
		if(this.ruleTree !== null) {
			esw.log("Invite " + this.buttonId + " Rule Evaluation");
			esw.log("Filter Logic: " + this.filterLogic);
			ret = this.ruleTree.evaluate(this);
		}
		if(!ret && this.inviteDelay !== null) {
			this.inviteTimeout = window.setTimeout(function() { invite.setOnlineState(true); }, this.inviteDelay);
			this.inviteDelay = null;
		}
		
		return ret;
	};

	InviteButton.prototype.addRule = function(rule) {
		this.rules[rule.getId()] = rule;
	};

	InviteButton.prototype.getRule = function(ruleId) {
		return this.rules[ruleId];
	};

	InviteButton.prototype.getInviteDelay = function() {
		return this.inviteDelay;
	};

	InviteButton.prototype.setInviteDelay = function(inviteDelay) {
		esw.log("Setting invite delay to: " + inviteDelay);
		this.inviteDelay = inviteDelay;
	};

	InviteButton.prototype.setAutoRejectTimeout = function(timeout) {
		this.autoRejectTimeout = timeout;
	};

	function InviteAPI() {
		this.inviteButton = getInviteButton(esw.settings.buttonId);
		store.init();

		// Set the "img src" of the agent's avatar after snippet settings have loaded if the avatar dom id is present.
		if(document.getElementById(INVITE_AVATAR_DOM_ID)) {
			if(embedded_svc.settings.avatarImgURL) {
				document.getElementById(INVITE_AVATAR_DOM_ID).src = embedded_svc.settings.avatarImgURL;
			} else {
				// If the avatarImgURL is not defined, remove the image from the dom.
				document.getElementById(INVITE_AVATAR_DOM_ID).remove();
			}
		}
	}

	esw.inviteAPI = new InviteAPI();
});
