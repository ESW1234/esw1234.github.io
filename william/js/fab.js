/*
 * Copyright, 2019, SALESFORCE.com
 * All Rights Reserved
 * Company Confidential
 *
 *
 * TO MINIFY: Use esw-check (https://git.soma.salesforce.com/embedded-service-for-web/esw-check):
 *			eswcheck main --notests --nolint --jsversion [current-version]
 *
 *			or
 *
 * 			Use Google Closure Compiler:
 * 			google-closure-compiler --js=fab.js --js_output_file=fab.min.js
 * 
 * 			Install google-closure-compiler by running:
 * 				npm install -g google-closure-compiler
 */

(function() {
	var TOP_CONTAINER_ID = "embedded-service";
	var ESW_SNIPPET_VERSION = "5.0";
	var ENDPOINT_API_VERSION = "48";

	var SCRT_ENDPOINT_URL;
	var SCRT_MAX_RETRY_ATTEMPTS = 3;
	var SCRT_RETRY_ATTEMPTS = 0;
	// Collision possibility is 1 in 10^15. Also UUID is passed along with the logs for us to identify the usersession by a unique identifier.
	var UUID = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);

	// Constants for logging metrics.
	var LOG_IFRAME_ID = "eswframeForLog";
	var ORG_LEVEL_METRICS = {
		timeTakenToLoadChannelMenu: "not loaded",
		channelMenuOptionsConfigured: [],
		channelCTAClicked: [],
		uniqueId: UUID
	};
	var USER_LEVEL_METRICS = {
		countChannelMenuOpened: 0,
		countChannelCTAClicked: 0,
		uniqueId: UUID
	};
	// Epoch Milliseconds.
	var START_TIME_FAB_LOAD = new Date().getTime();
	var END_TIME_FAB_LOAD;
	
	const DEFAULT_MENU_ICONS = {};

	Object.defineProperties(DEFAULT_MENU_ICONS, {
		QUESTION: {
			value: "M50 22c-16.6 0-30 12.5-30 28 0 5 1.4 9.6 3.8 13.7.3.5.4 1.1.2 1.6l-2.8 8.9c-.5 1.6 1 3 2.6 2.5l8.8-3.1c.6-.2 1.2-.1 1.7.2 4.6 2.7 10 4.2 15.8 4.2 16.6 0 30-12.5 30-28C80 34.5 66.6 22 50 22zm3 45c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2zm.8-12.7c-.4.1-.8.5-.8 1v1.6c0 1.1-.9 2.1-2 2.1h-2c-1.1 0-2-1-2-2.1v-1.6c0-3 2-5.7 4.9-6.7 1.1-.4 2.1-.9 2.7-1.8 3.4-4.5 0-9.7-4.5-9.8-1.6-.1-3.2.6-4.4 1.7-.8.8-1.4 1.8-1.6 2.8-.2.9-1 1.6-1.9 1.6h-2.1c-1.2 0-2.2-1.2-2-2.4.5-2.4 1.6-4.6 3.4-6.3 2.3-2.3 5.4-3.5 8.7-3.4 6.3.2 11.5 5.4 11.7 11.7.2 5.2-3 9.9-8.1 11.6z"
		},
		CLOSE: {
			value: "M59.615 48.846l25-25.192c1.154-1.154 1.154-2.885 0-4.039l-3.846-4.038c-1.154-1.154-2.884-1.154-4.038 0L51.538 40.769c-.769.77-1.923.77-2.692 0L23.654 15.385c-1.154-1.154-2.885-1.154-4.039 0l-4.038 4.038c-1.154 1.154-1.154 2.885 0 4.039l25.192 25.192c.77.77.77 1.923 0 2.692L15.385 76.731c-1.154 1.154-1.154 2.884 0 4.038l4.038 4.039c1.154 1.154 2.885 1.154 4.039 0l25.192-25.193c.77-.769 1.923-.769 2.692 0l25.192 25.193c1.154 1.154 2.885 1.154 4.039 0l4.038-4.039c1.154-1.154 1.154-2.884 0-4.038l-25-25.193c-.769-.769-.769-1.923 0-2.692z"
		},
		SALESFORCE: {
			value: [
				{
					type: "path",
					d: "M41.73 22.885C45 19.615 49.424 17.5 54.424 17.5c6.54 0 12.308 3.654 15.385 9.038 2.692-1.153 5.577-1.923 8.654-1.923 11.923 0 21.538 9.616 21.538 21.54S90.385 67.69 78.462 67.69c-1.54 0-2.885-.192-4.23-.384-2.694 4.807-7.886 8.077-13.847 8.077-2.5 0-4.808-.577-6.923-1.54-2.693 6.347-9.04 10.77-16.54 10.77-7.69 0-14.422-4.807-16.922-11.73-1.154.192-2.308.384-3.462.384-9.23 0-16.73-7.5-16.73-16.732 0-6.153 3.27-11.538 8.27-14.423-.963-2.307-1.54-5-1.54-7.692 0-10.577 8.654-19.23 19.424-19.23 6.73.192 12.307 3.076 15.77 7.692",
					fill: "#1589ee"
				}
			]
		}
	});

	// Stubbing out embedded_svc. This will be merged if Embedded Chat is enabled in channel menu.
	window.embedded_svc = {};

	function EmbeddedServiceMenu() {
		this.settings = {
			displayChannelMenu: true,
			devMode: false,
			releaseVersion: ESW_SNIPPET_VERSION,
			language: undefined,
			storageDomain: document.domain
		};

		// [Chat] Initialize empty settings for Embedded Chat CTA
		this.chat = { settings: {} };
		this.logFrame = undefined;
		this.outboundLogMessagesQueue = [];
		this.logFrameLoaded = false;

		// Maximum number of CTA options to display at runtime
		EmbeddedServiceMenu.MAX_NUMBER_OF_OPTIONS = 6;

		// [Mobile] Stores the last scroll position prior to maximizing
		EmbeddedServiceMenu.DOCUMENT_SCROLL_POSITION = -1;

		// [A11Y] Stores all listbox options
		EmbeddedServiceMenu.FOCUSABLE_OPTIONS = [];
		// [A11Y] Stores index of the item last focused
		EmbeddedServiceMenu.FOCUSED_OPTION_INDEX = 0;

		// Supported closing menu animations.
		EmbeddedServiceMenu.ANIMATION_CONSTANTS = {
			HIDE: "hide",
			FADE: "fade"
		};
	}

	/******************************************************
						Accessibility
	******************************************************/
	/**
	 * Implements keyboard navigation/roving tabindex on menu items.
	 *
	 * @param {*} event - keydown window.event
	 */
	function handleKeyDown(event) {
		// Keycodes values.
		const VK_ESC = 27;
		const VK_UP = 38;
		const VK_DOWN = 40;

		var previousSelected = EmbeddedServiceMenu.FOCUSABLE_OPTIONS[EmbeddedServiceMenu.FOCUSED_OPTION_INDEX];
		var newSelected;

		switch(event.keyCode) {
			case VK_ESC: {
				event.preventDefault();

				embedded_svc.menu.closeChannelMenu();
				document.getElementById("esw-fab").focus();

				break;
			}
			case VK_UP: {
				event.preventDefault();

				previousSelected.setAttribute("tabindex", -1);
				previousSelected.removeAttribute("aria-selected");

				if(EmbeddedServiceMenu.FOCUSED_OPTION_INDEX === 0) {
					// If on first menu item, wrap/trap focus to last menu item.
					EmbeddedServiceMenu.FOCUSED_OPTION_INDEX = EmbeddedServiceMenu.FOCUSABLE_OPTIONS.length - 1;
				} else {
					// Decrement index.
					EmbeddedServiceMenu.FOCUSED_OPTION_INDEX -= 1;
				}

				newSelected = EmbeddedServiceMenu.FOCUSABLE_OPTIONS[EmbeddedServiceMenu.FOCUSED_OPTION_INDEX];
				newSelected.setAttribute("tabindex", 0);
				newSelected.focus();
				newSelected.setAttribute("aria-selected", true);

				break;
			}
			case VK_DOWN: {
				event.preventDefault();

				previousSelected.setAttribute("tabindex", -1);
				previousSelected.removeAttribute("aria-selected");

				if(EmbeddedServiceMenu.FOCUSED_OPTION_INDEX === EmbeddedServiceMenu.FOCUSABLE_OPTIONS.length - 1) {
					// If on last menu item, wrap/trap focus to first menu item.
					EmbeddedServiceMenu.FOCUSED_OPTION_INDEX = 0;
				} else {
					// Increment index.
					EmbeddedServiceMenu.FOCUSED_OPTION_INDEX += 1;
				}

				newSelected = EmbeddedServiceMenu.FOCUSABLE_OPTIONS[EmbeddedServiceMenu.FOCUSED_OPTION_INDEX];
				newSelected.setAttribute("tabindex", 0);
				newSelected.focus();
				newSelected.setAttribute("aria-selected", true);

				break;
			}
			default: {
				// Do nothing if other keys are pressed.
				break;
			}
		}
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
	 * [https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/channel-menus](https://git.soma.salesforce.com/embedded-service-for-web/embedded-service-icons/tree/master/channel-menu)
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
		var element = document.createElementNS("http://www.w3.org/2000/svg", elementType);
		
		Object.getOwnPropertyNames(elementDefinition).forEach(function(attribute) {
			if(attribute === "children") {
				elementDefinition.children.forEach(function(childElementDefinition) {
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
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

		if(iconData) {
			svg.setAttribute("focusable", "false");
			svg.setAttribute("aria-hidden", "true");
			svg.setAttribute("viewBox", "0 0 100 100");

			if(Array.isArray(iconData)) {
				iconData.forEach(function(pathDefinition) {
					createSVGElement(svg, pathDefinition.type, pathDefinition);
				});
			} else {
				createSVGElement(svg, "path", { d: iconData });
			}

			return svg;
		} else {
			embedded_svc.utils.error("[Channel Menu] Invalid icon data.");
		}

		return undefined;
	}

	/******************************************************
			Factories for Channel CTAs (call-to-action)
	******************************************************/
	/**
	 * Builds the icon component for each supported channel type to be used in a CTA (call-to-action).
	 * - Generates a HTMLElement (<svg> or <img>) for default and custom icons.
	 * - For channel types that allow icon customization, check for custom icons, else use default.
	 *
	 * @return {Object} - Contains factory functions for generating a supported channel type's icon.
	 */
	function iconFactory() {
		/**
		 * Helper function that renders `default SVG icons`.
		 * @param {Array} data - Icon data, including path and fill elements, to be constructed dynamically.
		 * @returns {HTMLElement} - SVG element, or undefined if invalid icon data.
		 */
		var renderDefaultSVG = function(data) {
			var icon = renderSVG(data);

			icon.setAttribute("class", "esw-default_icon");

			return icon;
		};

		/**
		 * Helper function that renders `default IMG icons`.
		 * @param {String} data - Icon data, usually a relative path URL where the img file is hosted.
		 * @returns {HTMLElement} icon - IMG element, may be returned without a source if invalid icon data.
		 */
		var renderDefaultIMG = function(data) {
			var icon = document.createElement("img");
			var src = embedded_svc.menu.settings.gslbBaseURL + data;

			if(icon && src) icon.setAttribute("src", src);
			icon.setAttribute("class", "esw-default_icon");

			return icon;
		};

		/**
		 * Helper function that renders `custom IMG icons`.
		 * @param {String} data - Icon data, usually a full URL where the img file is hosted.
		 * @returns {HTMLElement} icon - IMG element, may be returned without a source if invalid icon data.
		 */
		var renderCustomIMG = function(data) {
			var icon = document.createElement("img");

			if(icon && data) icon.setAttribute("src", data);
			icon.setAttribute("class", "esw-custom_icon");

			return icon;
		};

		/**
		 * Boilerplate function that checks if the custom icon URL is present on the channel.
		 * If so, render `custom IMG icon`, otherwise render `default SVG icon`.
		 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
		 * @param {Array} data - ICON_SVG field for the Embedded Service Chat channel type.
		 * @return {HTMLElement} icon - SVG or IMG element, may be undefined if invalid icon data.
		 */
		var renderCustomOrDefaultIcon = function(channel, data) {
			var customIconUrl = channel.iconUrl;

			if(customIconUrl && customIconUrl.length > 0) {
				return renderCustomIMG(customIconUrl);
			} else {
				return renderDefaultSVG(data);
			}
		};

		return {
			/**
			 * Generates the icon element for Embedded Service Chat channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the Embedded Service Chat channel type.
			 * @return {HTMLElement} icon - The generated <svg> or <img> DOM element representing the CTA icon, or undefined if params are invalid.
			 */
			generateEmbeddedServiceChatIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat icon: data is undefined.");
				} else {
					icon = renderCustomOrDefaultIcon(channel, data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for Phone (Click-to-Call) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the Phone (Click-to-Call) channel type.
			 * @return {HTMLElement} icon - The generated <svg> or <img> DOM element representing the CTA icon, or undefined if params are invalid.
			 */
			generatePhoneIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Phone icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Phone icon: data is undefined.");
				} else {
					icon = renderCustomOrDefaultIcon(channel, data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for SMS (Text) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the SMS (Text) channel type.
			 * @return {HTMLElement} icon - The generated <svg> or <img> DOM element representing the CTA icon, or undefined if params are invalid.
			 */
			generateSmsIcon: function(channel, data) {
				var icon;
				
				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating SMS icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating SMS icon: data is undefined.");
				} else {
					icon = renderCustomOrDefaultIcon(channel, data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for Facebook Messenger channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the Facebook Messenger channel type.
			 * @return {HTMLElement} icon - The generated <svg> DOM element representing the default CTA icon, or undefined if params are invalid.
			 */
			generateFacebookMessengerIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger icon: data is undefined.");
				} else {
					icon = renderDefaultSVG(data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for WhatsApp channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the WhatsApp channel type.
			 * @return {HTMLElement} icon - The generated <svg> DOM element representing the default CTA icon, or undefined if params are invalid.
			 */
			generateWhatsAppIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp icon: data is undefined.");
				} else {
					icon = renderDefaultSVG(data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for Apple Business Chat channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} data - ICON_IMG field for the Apple Business Chat channel type.
			 * @return {HTMLElement} icon - The generated <img> DOM element representing the default CTA icon, or undefined if params are invalid.
			 */
			generateAppleBusinessChatIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat icon: data is undefined.");
				} else {
					icon = renderDefaultIMG(data);
				}

				return icon;
			},
			/**
			 * Generates the icon element for Custom URL channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - ICON_SVG field for the Custom URL channel type.
			 * @return {HTMLElement} icon - The generated <svg> or <img> DOM element representing the CTA icon, or undefined if params are invalid.
			 */
			generateCustomUrlIcon: function(channel, data) {
				var icon;

				if(!channel || !data) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Custom URL icon: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Custom URL icon: data is undefined.");
				} else {
					icon = renderCustomOrDefaultIcon(channel, data);
				}

				return icon;
			}
		};
	}

	/**
	 * Builds the label component for each supported channel type to be used in call-to-action.
	 * - Generates a String for each supported channel type's label (default or custom).
	 *
	 * TODO: (226) Inject each channel's caption label.
	 *
	 * @return {Object} - Contains factory functions that generates each supported channel type's label.
	 */
	function labelFactory() {
		/**
		 * Helper function that returns the label to be rendered for a particular channel type.
		 *
		 * @param {Array} customLabels - Array of custom labels for a channel type to be used to override standard labels
		 * @param {String} channelType - channel type.
		 * @returns {String} label - The text to be appended on the menu item, or undefined if params are invalid.
		 */
		var renderLabel = function(customLabels, channelType) {
			var standardLabelsObject = embedded_svc.menu.menuConfig.labelData;
			var customLabelsObject = {};

			// Process custom labels in to the object format for easier consumption
			customLabels.forEach(function(customLabel) {
				customLabelsObject[customLabel.sectionName] = customLabelsObject[customLabel.sectionName] || [];
				customLabelsObject[customLabel.sectionName][customLabel.labelName] = customLabel.labelValue;
			});

			if(customLabelsObject.ChannelMenu_ChannelType && customLabelsObject.ChannelMenu_ChannelType[channelType]){
				return customLabelsObject.ChannelMenu_ChannelType[channelType]
			} else{
				return standardLabelsObject.ChannelMenu_ChannelType[channelType]
			}
		};

		return {
			/**
			 * Generates the default label for Embedded Service Chat channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the Embedded Service Chat channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateEmbeddedServiceChatLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat label: data is undefined.");
				} else {
					label = embedded_svc.menu.menuConfig.embeddedChat.labelsObject.ChannelMenu_ChannelType.LiveAgent;
				}

				return label;
			},
			/**
			 * Generates the default label for Phone (Click-to-Call) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the Phone (Click-to-Call) channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generatePhoneLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Phone label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating Phone label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			},
			/**
			 * Generates the default label for SMS (Text) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the SMS (Text) channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateSmsLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating SMS label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating SMS label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			},
			/**
			 * Generates the default label for Facebook Messenger channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the Facebook Messenger channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateFacebookMessengerLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			},
			/**
			 * Generates the default label for WhatsApp channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the WhatsApp channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateWhatsAppLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			},
			/**
			 * Generates the default label for Apple Business Chat channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} channelType - CHANNEL_TYPE field for the Apple Business Chat channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateAppleBusinessChatLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			},
			/**
			 * Generates the default label for Custom URL channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {String} data - CHANNEL_TYPE field for the Custom URL channel type.
			 * @return {String} label - The generated text representing the configured CTA default label, or undefined if params are invalid.
			 */
			generateCustomUrlLabel: function(channel, channelType) {
				var label;

				if(!channel || !channelType) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Custom URL label: channel is undefined.");
					if(!channelType) embedded_svc.utils.error("[Channel Menu] Error generating Custom URL label: data is undefined.");
				} else {
					label = renderLabel(channel.labels, channelType);
				}

				return label;
			}
		};
	}

	/**
	 * Builds the link component for each supported channel type to be used in call-to-action.
	 * - Generates a String for each supported channel type's link.
	 *
	 * @return {Object} - Contains factory functions that each generates each supported channel type's link URL.
	 */
	function linkFactory() {
		return {
			/**
			 * Generates the URL link for Embedded Service Chat channel from CTA configuration.
			 *
			 * Note special handling (empty link) for Embedded Chat channel.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the Embedded Service Chat channel type.
			 * @param {Array} target - URL_TARGET field for the Embedded Service Chat channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateEmbeddedServiceChatLink: function(channel, data, target) {
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating ESW Chat link: target is undefined.");
				} else {
					// Setting `href` to `#` is bad because it will reset the scroll position to the top of the page.
					// Using `javascript:void(0);` will ensure clicking the anchor does not execute or change the user's scroll position.
					url.href = "javascript:void(0);";

					if(target[0]) {
						// Embedded Chat should always be opened in the same frame.
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for Click-to-Call (Phone) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the Click-to-Call (Phone) channel type.
			 * @param {Array} target - URL_TARGET field for the Click-to-Call (Phone) channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generatePhoneLink: function(channel, data, target) {
				var messagingPlatformKey;
				var protocol;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Phone link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Phone link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating Phone link: target is undefined.");
				} else {
					/**
					 * The messagingPlatformKey (phoneNumber field) returned from entity assumed to be
					 * in international format, i.e. the country code (with leading `+`) is included.
					 *
					 * For official documentation on formatting for "tel:" URI, see https://tools.ietf.org/html/rfc3966.
					 */
					messagingPlatformKey = channel.phoneNumber;
					protocol = data;

					if(protocol && messagingPlatformKey) {
						/**
						 * Expected link: "tel:+14151234567"
						 *
						 * (required) `protocol[0]` is the "tel:" URI.
						 */
						url.href = protocol[0] + messagingPlatformKey;
					}

					if(target[0]) {
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for Text (SMS) channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the Text (SMS) channel type.
			 * @param {Array} target - URL_TARGET field for the Text (SMS) channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateSmsLink: function(channel, data, target) {
				var messagingPlatformKey;
				var protocol;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating SMS link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating SMS link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating SMS link: target is undefined.");
				} else {
					/**
					 * The messagingPlatformKey returned from LiveMessage entities is assumed to be
					 * in international format, i.e. the country code (with leading `+`) is included.
					 *
					 * For official documentation on formatting for "sms:" URI, see https://tools.ietf.org/html/rfc5724.
					 */
					messagingPlatformKey = channel.configuration.messagingPlatformKey;
					protocol = data;

					if(protocol && messagingPlatformKey) {
						/**
						 * Expected link: "sms:+14151234567"
						 *
						 * (required) `protocol[0]` is the "sms:" URI.
						 */
						url.href = protocol[0] + messagingPlatformKey;
					}

					if(target[0]) {
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for Facebook Messenger channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the Facebook Messenger channel type.
			 * @param {Array} target - URL_TARGET field for the Facebook Messenger channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateFacebookMessengerLink: function(channel, data, target) {
				var messagingPlatformKey;
				var protocol;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating Facebook Messenger link: target is undefined.");
				} else {
					/**
					 * The protocol + domain patterns came from this documentation:
					 * https://developers.facebook.com/docs/messenger-platform/discovery/m-me-links
					 */
					messagingPlatformKey = channel.configuration.messagingPlatformKey;
					protocol = data;

					if(protocol && messagingPlatformKey) {
						/**
						 * Expected link: "https://m.me/1234"
						 *
						 * (required) `protocol[0]` is the protocol + domain.
						 */
						url.href = protocol[0] + messagingPlatformKey;
					}

					if(target[0]) {
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for WhatsApp channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the WhatsApp channel type.
			 * @param {Array} target - URL_TARGET field for the WhatsApp channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateWhatsAppLink: function(channel, data, target) {
				var messagingPlatformKey;
				var protocol;
				var numberMatcher;
				var phoneNumber;
				var domain;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating WhatsApp link: target is undefined.");
				} else {
					/**
					 * WhatsApp requires specific handling for mobile vs desktop.
					 * The messagingPlatformKey returned from the LiveMessage entities requires a regular expression
					 * to pull out the number and create the link manually here, client-side.
					 *
					 * The protocol + domain patterns came from this documentation:
					 * https://faq.whatsapp.com/en/general/26000030/?category=5245251
					 */
					messagingPlatformKey = channel.configuration.messagingPlatformKey;
					protocol = data;

					if(protocol && messagingPlatformKey) {
						/**
						 * Pull out "whatsapp:" protocol, keep only numeric characters.
						 * If this is on Desktop, keep the `+` symbol it it exists, remove on Mobile.
						 * Group 0 on the numberMatcher variable will be the optional `+` followed by the phone number.
						 */
						if(embedded_svc.utils.isDesktop()) {
							// Regex reads: select an optional `+` symbol for Desktop only, strip out for Mobile.
							numberMatcher = messagingPlatformKey.match(/\+?[0-9]+/);
						} else {
							// Regex reads: select one or more of any numeric character (from 0-9).
							numberMatcher = messagingPlatformKey.match(/[0-9]+/);
						}

						if(numberMatcher === null) {
							embedded_svc.utils.warning("[Channel Menu] Error generating WhatsApp link: unable to find match RegEx against messagingPlatformKey: " + messagingPlatformKey);
						}
	
						// Set the phone number variable.
						if(numberMatcher !== null && numberMatcher[0]) phoneNumber = numberMatcher[0];
						/**
						 * Expected desktop link: "https://web.whatsapp.com/send?phone=+1234"
						 * Expected mobile link: "https://wa.me/1234"
						 *
						 * (required) `protocol[2]` is the desktop protocol + domain.
						 * (required) `protocol[0]` is the mobile protocol + domain.
						 */
						domain = embedded_svc.utils.isDesktop() ? protocol[2] : protocol[0];

						// Create the WhatsApp link.
						if(domain && phoneNumber) {
							url.href = domain + phoneNumber;
						} else {
							embedded_svc.utils.warning("[Channel Menu] Error generating WhatsApp link: domain or phoneNumber is undefined");
						}
					}

					if(target[0]) {
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for Apple Business Chat channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} data - URL_PROTOCOL field for the Apple Business Chat channel type.
			 * @param {Array} target - URL_TARGET field for the Apple Business Chat channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateAppleBusinessChatLink: function(channel, data, target) {
				var messagingPlatformKey;
				var protocol;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !data || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat link: channel is undefined.");
					if(!data) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat link: data is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating Apple Business Chat link: target is undefined.");
				} else {
					/**
					 * The protocol + domain patterns came from this documentation:
					 * https://developer.apple.com/documentation/businesschat/starting_a_chat_from_a_url
					 */
					messagingPlatformKey = channel.configuration.messagingPlatformKey;
					protocol = data;
				
					if(protocol && messagingPlatformKey) {
						/**
						 * Expected link: "https://bcrw.apple.com/urn:biz:1234"
						 *
						 * (required) `protocol[0]` is the protocol + domain.
						 */
						url.href = protocol[0] + messagingPlatformKey;
					}

					if(target[0]) {
						url.target = target[0];
					}
				}

				return url;
			},
			/**
			 * Generates the URL link for Custom URL channel from CTA configuration.
			 *
			 * @param {Object} channel - Deployment-specific menu item configuration data for this channel.
			 * @param {Array} target - URL_TARGET field for the Custom URL channel type.
			 * @return {Object} url - Composed of the configured channel anchor's href and target attributes, which are undefined if params are invalid.
			 */
			generateCustomUrlLink: function(channel, target) {
				var messagingPlatformKey;
				var url = {
					href: undefined,
					target: undefined
				};

				if(!channel || !target) {
					if(!channel) embedded_svc.utils.error("[Channel Menu] Error generating Custom URL link: channel is undefined.");
					if(!target) embedded_svc.utils.error("[Channel Menu] Error generating custom URL link: target is undefined.");
				} else {
					/**
					 * Note: The admin is expected to declare a full URL path in setup.
					 */
					messagingPlatformKey = channel.url;

					if(messagingPlatformKey) {
						/**
						 * Expected link: "https://www.salesforce.com/"
						 */
						url.href = messagingPlatformKey;

						// Configure opening link in same page or new tab/window.
						url.target = channel.shouldOpenUrlInSameTab ? target[0] : target[1];
					}
				}

				return url;
			}
		};
	}

	/******************************************************
				Factories for Supported Channels
	******************************************************/
	/**
	 * Channel menu item factory for type: Embedded Service Chat (Live Agent).
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory functions for the channel menu item.
	 */
	function embeddedServiceChatFactory() {
		const ESCHAT_CTA = {
			CHANNEL_TYPE: "EmbeddedServiceConfig",
			URL_PROTOCOL: [],
			URL_TARGET: ["_self"],
			ICON_SVG: [
				{
					type: "path",
					d: "M50 7.692c-25.577 0-45.962 18.846-45.962 42.116 0 7.307 2.116 14.23 5.577 20.384.577.962.77 2.116.385 3.27L4.038 89.808c-.576 1.538.962 2.884 2.5 2.5l16.539-6.346c.961-.385 2.115-.193 3.27.384 6.922 3.846 15.191 6.154 24.038 6.154 25.192-.192 45.769-18.846 45.769-42.308-.192-23.654-20.77-42.5-46.154-42.5zm-23.077 50c-4.23 0-7.692-3.461-7.692-7.692s3.461-7.692 7.692-7.692 7.692 3.461 7.692 7.692-3.461 7.692-7.692 7.692zm23.077 0c-4.23 0-7.692-3.461-7.692-7.692s3.461-7.692 7.692-7.692 7.692 3.461 7.692 7.692-3.461 7.692-7.692 7.692zm23.077 0c-4.23 0-7.692-3.461-7.692-7.692s3.461-7.692 7.692-7.692 7.692 3.461 7.692 7.692-3.461 7.692-7.692 7.692z"
				}
			]
		};

		return {
			/**
			 * Builder function for Embedded Service Chat (Live Agent) channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				// Storing chat configuration on a variable makes it easier to consume in the components.
				// TODO : To support multiple chats and their respective labels, we should name this embedded_svc.menu.menuConfig.embeddedChat.<MenuItemName/Id>
				embedded_svc.menu.menuConfig.embeddedChat = channelConfiguration;
				// Merging labels here and saving it on the object for consumption in generating label for cta and for availability calls
				// TODO : When we want to support multiple chat ctas we'll need to rework logic around availability call labels (W-6123652)
				embedded_svc.menu.menuConfig.embeddedChat.labelsObject = embedded_svc.menu.mergeLabels(channelConfiguration.labels);

				return {
					icon: iconFactory().generateEmbeddedServiceChatIcon(channelConfiguration, ESCHAT_CTA.ICON_SVG),
					label: labelFactory().generateEmbeddedServiceChatLabel(channelConfiguration, ESCHAT_CTA.CHANNEL_TYPE),
					link: linkFactory().generateEmbeddedServiceChatLink(channelConfiguration, ESCHAT_CTA.URL_PROTOCOL, ESCHAT_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type for Embedded Service Chat (Live Agent) channel menu item.
			 */
			getChannelType: function() {
				return ESCHAT_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: Phone (Click-to-Call).
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function phoneFactory() {
		const PHONE_CTA = {
			CHANNEL_TYPE: "Phone",
			URL_PROTOCOL: [
				"tel:", /* (required) phone number */
				","	/* (optional} phone extension */
			],
			URL_TARGET: ["_blank"],
			ICON_SVG: [
				{
					type: "path",
					d: "M93.27 72.885l-11.732-9.423c-2.692-2.116-6.538-2.308-9.23-.193l-10 7.308c-1.154.961-2.885.77-4.039-.385l-15-13.461-13.461-15c-1.154-1.154-1.154-2.693-.385-4.039l7.308-10c2.115-2.692 1.923-6.538-.193-9.23L27.115 6.73c-2.884-3.462-8.077-3.846-11.346-.577l-10 10c-1.538 1.538-2.307 3.654-2.307 5.77.961 19.614 9.807 38.268 22.884 51.345s31.73 21.923 51.346 22.885c2.116.192 4.231-.77 5.77-2.308l10-10c3.653-2.884 3.461-8.27-.193-10.961z"
				}
			]
		};

		return {
			/**
			 * Builder function for Phone (Click-to-Call) channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generatePhoneIcon(channelConfiguration, PHONE_CTA.ICON_SVG),
					label: labelFactory().generatePhoneLabel(channelConfiguration, PHONE_CTA.CHANNEL_TYPE),
					link: linkFactory().generatePhoneLink(channelConfiguration, PHONE_CTA.URL_PROTOCOL, PHONE_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type enum for Phone (Click-to-Call) channel menu item.
			 */
			getChannelType: function() {
				return PHONE_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: SMS (Text).
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function smsFactory() {
		const SMS_CTA = {
			CHANNEL_TYPE: "Text",
			URL_PROTOCOL: [
				"sms:", /* (required) phone number */
				"?body=" /* (optional) URL encoded string */
			],
			URL_TARGET: ["_blank"],
			ICON_SVG: [
				{
					type: "clipPath",
					id: "sms-clip-path",
					children: [{
						type: "rect",
						rx: "9.36",
						ry: "9.36",
						fill: "#88c551"
					}]
				},
				{
					type: "clipPath",
					id: "sms-clip-path-2",
					children: [{
						type: "rect",
						rx: "9.36",
						ry: "9.36",
						fill: "#88c551"
					}]
				},
				{
					type: "clipPath",
					id: "sms-clip-path-3",
					children: [{
						type: "rect",
						rx: "9.36",
						ry: "9.36",
						fill: "#88c551"
					}]
				},
				{
					type: "rect",
					width: "100",
					height: "100",
					rx: "9.36",
					ry: "9.36",
					fill: "#88c551"
				},
				{
					type: "g",
					"clip-path": "url(#sms-clip-path)",
					children: [{
						type: "g",
						isolation: "isolate",
						children: [{
							type: "rect",
							x: "-3.67",
							y: "-4.21",
							width: "135.33",
							height: "137.67",
							fill: "#88c551"
						}, {
							type: "g",
							"clip-path": "url(#sms-clip-path-2)",
							children: [{
								type: "rect",
								x: "8",
								y: "7.46",
								width: "112",
								height: "112",
								rx: "9.36",
								ry: "9.36",
								fill: "#ffffff"
							}, {
								type: "g",
								"clip-path": "url(#sms-clip-path-3)",
								children: [{
									type: "rect",
									x: "-3.67",
									y: "-4.21",
									width: "135.33",
									height: "135.33",
									fill: "#88c551"
								}]
							}]
						}]
					}]
				},
				{
					type: "path",
					d: "M50 24.86c-15.164 0-27.25 11.171-27.25 25a24.602 24.602 0 0 0 3.312 12.085 2.344 2.344 0 0 1 .227 1.938l-3.562 9.664A1.18 1.18 0 0 0 24.219 75l9.804-3.758a2.383 2.383 0 0 1 1.938.227 29.406 29.406 0 0 0 14.258 3.648C65.14 75 77.344 63.852 77.344 50.055 77.227 36.03 65.03 24.859 50 24.859zM39.062 54.046a4.96 4.96 0 0 1-1.14 1.484 6.14 6.14 0 0 1-1.703.914 5.398 5.398 0 0 1-1.946.227 6.148 6.148 0 0 1-2.539-.422 5.633 5.633 0 0 1-2.164-1.477l-.226-.234c-.117-.11 0-.336.226-.57l1.828-1.703c.227-.235.454-.235.57-.118a1.938 1.938 0 0 1 .227.344 3.063 3.063 0 0 0 .907.781 2.484 2.484 0 0 0 1.828.227 1.172 1.172 0 0 0 .57-.227l.344-.343a.703.703 0 0 0 .11-.453c0-.461-.11-.57-.227-.688a2.242 2.242 0 0 0-1.024-.57c-.46-.11-.914-.344-1.484-.453-.57-.227-1.14-.461-1.563-.688a4.36 4.36 0 0 1-1.258-1.25 4.055 4.055 0 0 1-.57-2.172 3.906 3.906 0 0 1 .461-2.047 3.516 3.516 0 0 1 1.25-1.367 4.047 4.047 0 0 1 1.711-.781 7.266 7.266 0 0 1 4.102.117 7.492 7.492 0 0 1 1.71.867l.344.227c.227.117.117.453-.11.687l-1.741 1.735a.563.563 0 0 1-.782 0c-.226-.117-.335-.344-.453-.344a3.125 3.125 0 0 0-2.054-.344.61.61 0 0 0-.453.227l-.344.344c-.11.117-.11.226-.11.453a.656.656 0 0 0 .227.57 4.102 4.102 0 0 0 1.023.57c.461.117.914.344 1.485.461s1.14.453 1.562.68a4.383 4.383 0 0 1 1.258 1.258 4.031 4.031 0 0 1 .57 2.164 3.727 3.727 0 0 1-.421 1.914zm18.93 1.562a1.172 1.172 0 0 1-1.258 1.141H55.57c-.687 0-1.03-.453-1.03-1.14v-6.696a.594.594 0 0 0-1.142-.227l-1.937 5.133a.992.992 0 0 1-1.024.68h-.78a1.156 1.156 0 0 1-1.032-.68l-2.063-5.133a.594.594 0 0 0-1.14.227v6.727a1.172 1.172 0 0 1-1.258 1.14h-1.14c-.68 0-1.024-.453-1.024-1.14v-12.5A1.047 1.047 0 0 1 43.023 42h2.97a1.156 1.156 0 0 1 1.023.687l2.28 5.93c.227.453.915.453 1.024 0l2.282-5.93A.992.992 0 0 1 53.625 42h3.078a1.172 1.172 0 0 1 1.258 1.14zm11.969-1.476a3.836 3.836 0 0 1-1.25 1.476 6.094 6.094 0 0 1-1.711.914 5.703 5.703 0 0 1-1.938.227 6.094 6.094 0 0 1-2.562-.422 5.68 5.68 0 0 1-2.172-1.484l-.172-.227c-.11-.117 0-.344.227-.57l1.797-1.703c.226-.227.453-.227.57-.11a1.398 1.398 0 0 1 .227.336 3.125 3.125 0 0 0 .914.782 2.617 2.617 0 0 0 1.82.226c.234-.117.46-.117.57-.226l.344-.344a2.531 2.531 0 0 0 .117-.461c0-.453-.117-.57-.226-.68a2.203 2.203 0 0 0-1.032-.57c-.453-.117-.914-.344-1.484-.461s-1.133-.453-1.563-.68a4.836 4.836 0 0 1-1.367-1.258 4.031 4.031 0 0 1-.57-2.164 3.977 3.977 0 0 1 .437-2.039 3.656 3.656 0 0 1 1.258-1.367 4.688 4.688 0 0 1 1.711-.781 7.125 7.125 0 0 1 4.102.117 4.797 4.797 0 0 1 1.71 1.024l.344.343c.227.11.118.453-.117.68l-1.726 1.695a.555.555 0 0 1-.782 0c-.226-.11-.335-.336-.453-.336a3.125 3.125 0 0 0-2.054-.343.57.57 0 0 0-.453.226l-.344.344a.656.656 0 0 0-.117.453.664.664 0 0 0 .234.57 4.102 4.102 0 0 0 1.023.57c.454.118.914.344 1.485.454.57.234 1.14.46 1.562.687a7.187 7.187 0 0 1 1.367 1.25 4.055 4.055 0 0 1 .625 2.172 2.523 2.523 0 0 1-.382 1.711z",
					fill: "#ffffff"
				}
			]
		};

		return {
			/**
			 * Factory function for SMS channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generateSmsIcon(channelConfiguration, SMS_CTA.ICON_SVG),
					label: labelFactory().generateSmsLabel(channelConfiguration, SMS_CTA.CHANNEL_TYPE),
					link: linkFactory().generateSmsLink(channelConfiguration, SMS_CTA.URL_PROTOCOL, SMS_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the main factory which factory method to use.
			 *
			 * @return {String} Channel type enum for SMS (Text) channel menu item.
			 */
			getChannelType: function() {
				return SMS_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: Facebook Messenger.
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function facebookMessengerFactory() {
		const FACEBOOKMESSENGER_CTA = {
			CHANNEL_TYPE: "Facebook",
			URL_PROTOCOL: [
				"https://m.me/", /* (required) page name */
				"?ref=" /* (optional) referral params */
			],
			URL_TARGET: ["_blank"],
			ICON_SVG: [
				{
					type: "linearGradient",
					id: "fb-linear-gradient",
					x1: "-1521.35",
					y1: "309.76",
					x2: "-1521.35",
					y2: "312.2",
					gradientTransform: "matrix(45.53, 0, 0, -46, 69324.43, 14369.07)",
					gradientUnits: "userSpaceOnUse",
					children: [{
						type: "stop",
						offset: "0.11",
						"stop-color": "#006dff"
					}, {
						type: "stop",
						offset: "0.95",
						"stop-color": "#00c6ff"
					}]
				},
				{
					type: "path",
					d: "M50 6.25c-23.992 0-43.297 18.04-43.297 40.414 0 12.805 6.313 23.992 16.055 31.57V93.75l14.797-8.117A47.273 47.273 0 0 0 50 87.258c23.992 0 43.297-18.047 43.297-40.414S73.992 6.25 50 6.25zm4.508 54.305l-11.18-11.547-21.656 11.93 23.64-25.102 11.18 11.547 21.633-11.906z",
					fill: "url(#fb-linear-gradient)",
					stroke: "#d8d8d8"
				}
			],
			ICON_IMG: "/img/social/icon/fb-messenger.svg"
		};

		return {
			/**
			 * Builder function for Facebook Messenger channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generateFacebookMessengerIcon(channelConfiguration, FACEBOOKMESSENGER_CTA.ICON_SVG),
					label: labelFactory().generateFacebookMessengerLabel(channelConfiguration, FACEBOOKMESSENGER_CTA.CHANNEL_TYPE),
					link: linkFactory().generateFacebookMessengerLink(channelConfiguration, FACEBOOKMESSENGER_CTA.URL_PROTOCOL, FACEBOOKMESSENGER_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type enum for Facebook Messenger channel menu item.
			 */
			getChannelType: function() {
				return FACEBOOKMESSENGER_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: WhatsApp.
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function whatsAppFactory() {
		const WHATSAPP_CTA = {
			CHANNEL_TYPE: "WhatsApp",
			URL_PROTOCOL: [
				/* MOBILE */
				"https://wa.me/", /* (required) phone number */
				"/?text=" /* (optional) URL encoded string */,
				/* DESKTOP */
				"https://web.whatsapp.com/send?phone=", /* (required) phone number */
				"&text=" /* (optional) URL encoded string */
			],
			URL_TARGET: ["_blank"],
			ICON_SVG: [
				{
					type: "g",
					children: [{
						type: "g",
						children: [{
							type: "path",
							d: "M6.406 93.75l6.172-22.5C.547 50.547 7.656 24.062 28.36 12.031 45.391 2.11 66.953 5 80.86 18.984c16.954 16.953 16.954 44.375 0 61.328-8.125 8.125-19.14 12.657-30.703 12.657-7.265 0-14.375-1.797-20.703-5.313L6.406 93.75zM30.47 79.844l1.328.781a36.009 36.009 0 0 0 18.36 5c19.921 0 36.093-16.094 36.093-36.016S70.156 13.516 50.234 13.516 14.141 29.687 14.141 49.609c0 6.797 1.875 13.438 5.468 19.141l.86 1.328-3.672 13.281 13.672-3.515z",
							fill: "#ffffff"
						}]
					}, {
						type: "linearGradient",
						id: "shape_3_1_",
						x1: "63.9914",
						y1: "780.1",
						x2: "63.9914",
						y2: "671.9173",
						gradientTransform: "matrix(1 0 0 1 0 -662)",
						gradientUnits: "userSpaceOnUse",
						children: [{
							type: "stop",
							offset: "0",
							"stop-color": "#20B038"
						}, {
							type: "stop",
							offset: "1",
							"stop-color": "#60D66A"
						}]
					}, {
						type: "path",
						d: "M7.969 92.266l5.937-21.72C2.344 50.547 9.22 24.923 29.22 13.36S74.844 8.672 86.406 28.75s4.688 45.625-15.39 57.188a41.84 41.84 0 0 1-20.938 5.624c-6.953 0-13.906-1.718-20-5.078l-22.11 5.782z",
						fill: "url(#shape_3_1_)"
					}, {
						type: "g",
						children: [{
							type: "linearGradient",
							id: "SVGID_1_",
							x1: "63.9875",
							y1: "782",
							x2: "63.9875",
							y2: "669.891",
							gradientTransform: "matrix(1 0 0 1 0 -662)",
							gradientUnits: "userSpaceOnUse",
							children: [{
								type: "stop",
								offset: "0",
								"stop-color": "#f9f9f9"
							}, {
								type: "stop",
								offset: "1",
								"stop-color": "#ffffff"
							}]
						}, {
							type: "path",
							d: "M6.406 93.75l6.172-22.5C.547 50.547 7.656 24.062 28.36 12.031 45.391 2.11 66.953 5 80.86 18.984c16.954 16.953 16.954 44.375 0 61.328-8.125 8.125-19.14 12.657-30.703 12.657-7.265 0-14.375-1.797-20.703-5.313L6.406 93.75zM30.47 79.844l1.328.781a36.009 36.009 0 0 0 18.36 5c19.921 0 36.093-16.094 36.093-36.016S70.156 13.516 50.234 13.516 14.141 29.687 14.141 49.609c0 6.797 1.875 13.438 5.468 19.141l.86 1.328-3.672 13.281 13.672-3.515z",
							fill: "url(#SVGID_1_)"
						}, {
							type: "g",
							children: [{
								type: "path",
								d: "M39.375 31.484c-.781-1.797-1.64-1.875-2.422-1.875h-2.11c-1.093 0-2.187.547-2.89 1.328-2.5 2.344-3.828 5.625-3.828 8.985 0 5.312 3.906 10.469 4.453 11.172s7.5 12.031 18.516 16.328c9.14 3.594 11.015 2.89 12.969 2.734S70.469 67.5 71.406 65s.938-4.688.625-5.156-1.015-.703-2.11-1.25-6.405-3.203-7.421-3.516-1.719-.547-2.422.547-2.812 3.516-3.437 4.219-1.25.781-2.344.234c-3.203-1.25-6.094-3.125-8.672-5.39a32.971 32.971 0 0 1-6.016-7.5c-.625-1.094-.078-1.641.47-2.188s1.093-1.25 1.64-1.875c.468-.547.781-1.172 1.093-1.797s.235-1.328-.078-1.875c-.312-.469-2.421-5.86-3.359-7.969z",
								fill: "#ffffff",
								"fill-rule": "evenodd",
								"clip-rule": "evenodd"
							}]
						}]
					}]

				}
			],
			ICON_IMG: "/img/social/icon/whatsapp.svg"
		};

		return {
			/**
			 * Builder function for WhatsApp channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generateWhatsAppIcon(channelConfiguration, WHATSAPP_CTA.ICON_SVG),
					label: labelFactory().generateWhatsAppLabel(channelConfiguration, WHATSAPP_CTA.CHANNEL_TYPE),
					link: linkFactory().generateWhatsAppLink(channelConfiguration, WHATSAPP_CTA.URL_PROTOCOL, WHATSAPP_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type enum for WhatsApp channel menu item.
			 */
			getChannelType: function() {
				return WHATSAPP_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: Apple Business Chat.
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function appleBusinessChatFactory() {
		const APPLEBUSINESSCHAT_CTA = {
			CHANNEL_TYPE: "AppleBusinessChat",
			URL_PROTOCOL: [
				"https://bcrw.apple.com/urn:biz:", /* (required) business id */
				"?body=", /* (optional) URL encoded string */
				"?biz-intent-id=", /* (optional) biz-intent-id */
				"&biz-group-id=" /* (optional) biz-group-id */
			],
			URL_TARGET: ["_blank"],
			ICON_IMG: "/embeddedservice/icon/AppleMessagesBubbleIcon.png"
		};

		return {
			/**
			 * Builder function for Apple Business Chat channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generateAppleBusinessChatIcon(channelConfiguration, APPLEBUSINESSCHAT_CTA.ICON_IMG),
					label: labelFactory().generateAppleBusinessChatLabel(channelConfiguration, APPLEBUSINESSCHAT_CTA.CHANNEL_TYPE),
					link: linkFactory().generateAppleBusinessChatLink(channelConfiguration, APPLEBUSINESSCHAT_CTA.URL_PROTOCOL, APPLEBUSINESSCHAT_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type enum for Apple Business Chat channel menu item.
			 */
			getChannelType: function() {
				return APPLEBUSINESSCHAT_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Channel menu item factory for type: Custom URL.
	 * Configures icon, label, and link. Contains channel type specific properties.
	 *
	 * @return {Object} Contains the factory function for the channel menu item.
	 */
	function customUrlFactory() {
		var CUSTOMURL_CTA = {
			CHANNEL_TYPE: "CustomURL",
			URL_TARGET: ["_self", "_blank"],
			ICON_SVG: [
				{
					type: "path",
					d: "M50 3.846C24.423 3.846 3.846 24.423 3.846 50S24.423 96.154 50 96.154 96.154 75.577 96.154 50 75.577 3.846 50 3.846zm0 9.616zm3.846.192h-.384.384zM50 86.538c-20.192 0-36.538-16.346-36.538-36.538 0-1.923.192-4.038.576-5.77 2.5.385 5.577 1.347 7.116 2.885 3.27 3.462 6.923 7.5 10.384 8.27 0 0-.384.192-.769.769-.384.577-.769 1.73-.769 3.654 0 9.038 8.462 3.654 8.462 12.692s10.192 12.692 10.192 5.385 6.73-10.77 6.73-16.347-5.192-5.384-8.46-7.307c-3.462-1.731-5.193-4.616-11.732-3.654-3.461-3.27-5.384-5.962-3.846-9.039 1.73-3.269 8.846-3.846 8.846-8.846s-4.807-5.961-8.269-5.961c-1.538 0-4.808-1.154-7.5-2.5 3.27-3.27 7.308-5.962 11.539-7.885 3.076 1.346 8.269 3.462 12.692 3.462 5.192 0 7.884-3.654 7.115-5.962 8.654 1.346 16.346 5.77 21.923 11.923-2.884 1.731-6.73 3.654-13.461 3.654-8.846 0-8.846 9.039-3.654 10.77 5.385 1.73 10.77-3.462 12.5 0 1.73 3.46-12.5 3.46-8.846 12.307 3.654 8.846 7.115-.192 10.769 8.654s10.77-1.346 5.385-8.27c-2.308-3.076-1.731-12.5 3.653-12.5h1.731c.77 3.078 1.346 6.347 1.346 9.616C86.538 70.192 70.192 86.538 50 86.538z"
				}
			]
		};

		return {
			/**
			 * Builder function for Custom URL channel menu item.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to data for the configured channel's {HTMLElement} icon, {String} label, and {String} link.
			 */
			buildChannel: function(channelConfiguration) {
				return {
					icon: iconFactory().generateCustomUrlIcon(channelConfiguration, CUSTOMURL_CTA.ICON_SVG),
					label: labelFactory().generateCustomUrlLabel(channelConfiguration, CUSTOMURL_CTA.CHANNEL_TYPE),
					link: linkFactory().generateCustomUrlLink(channelConfiguration, CUSTOMURL_CTA.URL_TARGET)
				};
			},
			/**
			 * Returns the channel type enum, which informs the builder which factory method to use.
			 *
			 * @return {String} Channel type enum for Custom URL channel menu item.
			 */
			getChannelType: function() {
				return CUSTOMURL_CTA.CHANNEL_TYPE;
			}
		};
	}

	/**
	 * Helper function that reads the channel configuration and returns the current channel's type.
	 *
	 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
	 * @returns {String} The given channel's channelType or messageType, if the channel type is "MessagingChannel".
	 */
	function getChannelType(channelConfiguration) {
		// Special handling for third-party channels (LiveMessage entities), we need to look at messageType if channelType = "MessagingChannel".
		return channelConfiguration.channelType === "MessagingChannel" ? channelConfiguration.configuration.messageType : channelConfiguration.channelType;
	}

	/**
	 * Main channel menu item factory.
	 *
	 * @return {Object} Reference to main mega-factory function, which invokes the correct factory for the given channel type.
	 */
	function channelMenuItemFactory() {
		// Object containing factory mappings based on the channel type.
		const CHANNEL_TYPE_MAPPING = {};

		// Instantiate factories for supported channel types.
		var embeddedServiceChatChannelFactory = embeddedServiceChatFactory();
		var phoneChannelFactory = phoneFactory();
		var smsChannelFactory = smsFactory();
		var facebookMessengerChannelFactory = facebookMessengerFactory();
		var whatsAppChannelFactory = whatsAppFactory();
		var appleBusinessChatChannelFactory = appleBusinessChatFactory();
		var customUrlChannelFactory = customUrlFactory();

		// Keys are tied to MessageTypeEnum.java and EmbeddedServiceChannelType.java.
		Object.defineProperties(CHANNEL_TYPE_MAPPING, {
			EmbeddedServiceConfig: {
				value: embeddedServiceChatChannelFactory.getChannelType()
			},
			Phone: {
				value: phoneChannelFactory.getChannelType()
			},
			SMS: {
				value: smsChannelFactory.getChannelType()
			},
			Facebook: {
				value: facebookMessengerChannelFactory.getChannelType()
			},
			AppleBusinessChat: {
				value: appleBusinessChatChannelFactory.getChannelType()
			},
			WhatsApp: {
				value: whatsAppChannelFactory.getChannelType()
			},
			CustomUrl: {
				value: customUrlChannelFactory.getChannelType()
			}
		});

		return {
			/**
			 * Main channel menu item builder.
			 * This is function is exposed publicly.
			 *
			 * @param {Object} channelConfiguration - Deployment-specific menu item configuration data for this channel.
			 * @return {Object} Reference to the configured channel's data to be constructed later.
			 */
			buildChannel: function(channelConfiguration) {
				var channelType = getChannelType(channelConfiguration);
				var channel;

				switch(channelType) {
					case CHANNEL_TYPE_MAPPING.EmbeddedServiceConfig:
						channel = embeddedServiceChatChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.Phone:
						channel = phoneChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.SMS:
						channel = smsChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.Facebook:
						channel = facebookMessengerChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.AppleBusinessChat:
						channel = appleBusinessChatChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.WhatsApp:
						channel = whatsAppChannelFactory.buildChannel(channelConfiguration);
						break;
					case CHANNEL_TYPE_MAPPING.CustomUrl:
						channel = customUrlChannelFactory.buildChannel(channelConfiguration);
						break;
					case undefined:
						throw new Error("[Channel Menu] Unable to build channel. Undefined channel type.");
					default:
						throw new Error("[Channel Menu] Unable to build channel. Unknown channel type: " + channelType);
				}

				return channel;
			}
		};
	}

	/**
	 * Invokes the main menu item builder. Includes basic validation before returning the configured data to be constructed.
	 *
	 * @param {Object} channelConfiguration - Deployment-specific configuration data for a configured menu item.
	 * @return {Object} Reference to data for the configured channel's data: {HTMLElement} icon, {String} label, and {String} link.
	 */
	function buildMenuItem(channelConfiguration) {
		var channelData = embedded_svc.menu.channelMenuItemFactory.buildChannel(channelConfiguration);
		var errors = [];

		if(!!channelData.icon && !!channelData.label && !!channelData.link.href && !!channelData.link.target) {
			return channelData;
		} else if(typeof channelData.icon === "undefined") {
			errors.push("[Channel Menu] Error building icon for menu item: " + channelConfiguration.name);
		} else if(typeof channelData.label === "undefined") {
			errors.push("[Channel Menu] Error building label for menu item: " + channelConfiguration.name);
		} else if(typeof channelData.link.href === "undefined") {
			errors.push("[Channel Menu] Error building link.href for menu item: " + channelConfiguration.name);
		} else if(typeof channelData.link.target === "undefined") {
			errors.push("[Channel Menu] Error building link.target for menu item: " + channelConfiguration.name);
		} else {
			errors.push("[Channel Menu] Unknown error building menu item: " + channelConfiguration.name);
		}

		if(errors.length === 0) {
			return channelData;
		} else {
			throw new Error(errors);
		}
	}

	/******************************************************
						Markup generation
	******************************************************/
	/*
	* Markup Overview (Classes and IDs) - please update if you make markup changes.
	* 	(NOTE: if channelType = MessagingChannel, we will use messageType for specificity.)
	*
	* MULTIPLE CHANNEL MENU
	*	body.embeddedServiceChannelMenuPreventScrolling
	*	div.embedded-service #TOP_CONTAINER_ID
	*		div#esw-modaloverlay.isMaximized
	*		div#esw-container
	*			button.fab #esw-fab
	*				div.icon_fab_container #esw-menu-[opened/closed]-fab-icon
	*					img/svg.icon_fab #esw-icon-<channelType>
	*			div.channelmenu #esw-channelmenu (role=dialog)
	*				header.channelmenu_header #esw-channelmenu_header
	*					h2
	*					p
	*				ul.channelmenu_ctas #esw-channelmenu_ctas (role=listbox)
	*					li.cta-<channelType> #esw-cta_<id> (role=presentation)
	*						a.cta-link-<channelType> #esw-cta_link-<id>	(role=option)
	*							img/svg.icon_cta-<iconKey> #esw-icon-<channelType>
	*							span.cta-label-<channelType> #esw-cta_label-<id>
	*				footer.channelmenu_footer #esw-channelmenu_footer
	*					a.channelmenu_footer-link
	*						svg.icon_channelmenu-footer
	*						span.channelmenu_footer-label
	*
	* SINGLE CHANNEL BUTTON
	*	div.embedded-service #TOP_CONTAINER_ID
	*		button.fab #esw-fab
	*			div.icon_fab_container
	*				img/svg.icon_fab #esw-icon-<channelType>
	*
	*/
	/**
	 * Constructs the menu header element, including labels and background image if applicable.
	 *
	 * @return {HTMLElement} headerElement - Reference to the channel menu header element.
	 */
	function generateMenuHeaderMarkup() {
		var showHeaderText = embedded_svc.menu.menuConfig.brandingData.showHeaderText === "true";
		var headerBackgroundImageURL = embedded_svc.menu.menuConfig.brandingData.headerBackgroundImage;
		var headerElement = document.createElement("header");
		var headerTextElement;
		var subheaderTextElement;
		var headerTextNode;
		var subheaderTextNode;
		var url;

		headerElement.id = "esw-channelmenu_header";
		headerElement.className = "channelmenu_header";
		headerElement.classList.add("active");

		// [Branding] If specified, append header background image url.
		if(headerBackgroundImageURL) {
			url = "url(\"" + headerBackgroundImageURL + "\")";

			headerElement.style.backgroundImage = url;
		}

		// [Branding] If `Show Header Text` is checked, append primary and secondary greetings.
		if(showHeaderText) {
			// Construct header's text elements.
			headerTextElement = document.createElement("h2");
			subheaderTextElement = document.createElement("p");
	
			// [Custom Labels] Set the header's primary and secondary greetings from label data.
			headerTextNode = document.createTextNode(embedded_svc.menu.menuConfig.labelData.ChannelMenu_Container.HeaderPrimaryGreeting);
			subheaderTextNode = document.createTextNode(embedded_svc.menu.menuConfig.labelData.ChannelMenu_Container.HeaderSecondaryGreeting);

			headerTextElement.appendChild(headerTextNode);
			subheaderTextElement.appendChild(subheaderTextNode);

			// Append the header text to the the menu header markup.
			headerElement.appendChild(headerTextElement);
			headerElement.appendChild(subheaderTextElement);
		}

		return headerElement;
	}

	/**
	 * Constructs the icon, label, and link for configured menu items on the channel menu deployment.
	 *
	 * @return {HTMLElement} listItemsElement - Reference to the channel menu's unordered list of menu items.
	 */
	function generateChannelMenuItemsMarkup() {
		var listItemsElement = document.createElement("ul");

		// Channels should already be ordered, configured for end user's device, and limited to maximum of 6 options.
		var configuredChannels = embedded_svc.menu.menuConfig.configuredChannels;

		// Iterate through each menu item and configure its icon, link, and label.
		Object.keys(configuredChannels).forEach(function(channel) {
			var channelConfiguration = configuredChannels[channel];
			var channelType = getChannelType(channelConfiguration);
			// Invoke main channel factory.
			var menuItemElements = buildMenuItem(channelConfiguration);

			// Create DOM elements to append configured menu items to.
			var cta = document.createElement("li");
			var link = document.createElement("a");
			var label = document.createElement("span");
			var iconContainer = document.createElement("div");
			var icon = menuItemElements.icon;

			ORG_LEVEL_METRICS.channelMenuOptionsConfigured.push(channelType);

			// Set DOM selectors for CTAs. See `Markup Generation` tree for overview of class names and ids.
			cta.className = "cta-" + channelType.toLowerCase();
			cta.id = "esw-cta_" + channelConfiguration.id;

			link.className = "cta-link-" + channelType.toLowerCase();
			link.id = "esw-cta_link-" + channelConfiguration.id;

			iconContainer.classList.add("icon_cta_container");

			// Note: IE11 does not support Element.classList for svg elements.
			icon.setAttribute(
				"class",
				icon.getAttribute("class") + " icon_cta-" + channelType.toLowerCase()
			);
			icon.id = "esw-icon-" + channelConfiguration.id;

			label.className = "cta-label-" + channelType.toLowerCase();
			label.id = "esw-cta_label-" + channelConfiguration.id;

			// [A11Y] Set role for listbox options.
			cta.setAttribute("role", "presentation");
			link.setAttribute("role", "option");

			// [A11Y] Icons are decorative (empty alt is better for screenreaders than no alt).
			icon.setAttribute("alt", "");

			// [Chat] Special handling for Web Chat channels only.
			if(channelType === "EmbeddedServiceConfig") {
				// Initialize Chat as menu item.
				embedded_svc.menu.initializeEmbeddedChat(channelConfiguration);

				// Add start chat handler to channel menu item's click handler.
				link.addEventListener("click", function(e) {
					if(this.parentElement.classList.contains("disabled") || this.parentElement.classList.contains("loading")) {
						// If option is disabled or loading, prevent handling the click.
						e.preventDefault();
					} else {
						embedded_svc.menu.openEmbeddedChat();
						USER_LEVEL_METRICS.countChannelCTAClicked += 1;
						// Add the menu items configured on the channel menu to metrics
						ORG_LEVEL_METRICS.channelCTAClicked.push(channelType);
					}
				});
			}

			// [A11Y] Set inital focus on first menu item.
			if(Number(channel) === 0) {
				link.setAttribute("tabindex", 0);
			} else {
				link.setAttribute("tabindex", -1);
			}

			// [A11Y] Keyboard navigation on each listbox options.
			link.addEventListener("keydown", handleKeyDown);
			link.addEventListener("click", function() {
				USER_LEVEL_METRICS.countChannelCTAClicked += 1;
				ORG_LEVEL_METRICS.channelCTAClicked.push(channelType);
				embedded_svc.menu.postMessage(ORG_LEVEL_METRICS);
			});
			// Construct link element.
			link.setAttribute("href", menuItemElements.link.href);
			link.setAttribute("target", menuItemElements.link.target);
			link.setAttribute("rel", "noopener");

			// Construct label element.
			label.appendChild(document.createTextNode(menuItemElements.label));

			// Build the channel option markup
			iconContainer.appendChild(icon);
			link.appendChild(iconContainer);
			link.appendChild(label);
			cta.appendChild(link);
			listItemsElement.appendChild(cta);
		});

		listItemsElement.id = "esw-channelmenu_ctas";
		listItemsElement.className = "channelmenu_ctas";
		listItemsElement.classList.add("active");

		// [A11Y] Set role for listbox on menu items.
		listItemsElement.setAttribute("role", "listbox");
		// TODO: [W-6808211] Make this accessibility label customizable.
		listItemsElement.setAttribute("aria-label", "Choose channel");

		// [A11Y] Store all focusable menu items for wrapping keyboard navigation of listbox elements.
		EmbeddedServiceMenu.FOCUSABLE_OPTIONS = listItemsElement.querySelectorAll("a");

		return listItemsElement;
	}

	/**
	 * Constructs the menu footer element, including link to navigate and logo.
	 *
	 * @return {HTMLElement} footerElement - Reference to the channel menu footer element.
	 */
	EmbeddedServiceMenu.prototype.generateMenuFooterMarkup = function generateMenuFooterMarkup() {
		var footerElement = document.createElement("footer");
		var anchorElement = document.createElement("a");
		var spanTextElement = document.createElement("span");
		// No custom labels for essentials label
		var anchorTextNode = document.createTextNode(embedded_svc.menu.menuConfig.labelData.ChannelMenu_Container.EssentialsTagline);
		var essentialsIcon = renderSVG(DEFAULT_MENU_ICONS.SALESFORCE);

		footerElement.setAttribute("class", "channelmenu_footer");

		anchorElement.setAttribute("class", "channelmenu_footer-link");
		anchorElement.setAttribute("href", "https://www.salesforce.com/essentialschat/");
		anchorElement.setAttribute("target", "_blank");

		spanTextElement.setAttribute("class", "channelmenu_footer-label");
		spanTextElement.appendChild(anchorTextNode);

		essentialsIcon.setAttribute("class", "icon_channelmenu-footer");

		anchorElement.appendChild(essentialsIcon);
		anchorElement.appendChild(spanTextElement);

		footerElement.appendChild(anchorElement);

		return footerElement;
	};

	/**
	 * Utility function to Find and remove protocol (http, ftp, etc.) and get hostname Retrieve the host name from the URl .
	 * Note: This piece of code has been replicated from chasitor.esw.js.
	 * @param {*} url
	 */
	function getHostName(url) {
		var hostname;

		if(url) {
			if(window.URL && typeof window.URL === "function") {
				hostname = new URL(url).hostname;
			} else {
				// Fallback for IE11
				if(url.indexOf("//") > -1) {
					hostname = url.split("/")[2];
				} else {
					hostname = url.split("/")[0];
				}

				// Find and remove port number
				hostname = hostname.split(":")[0];
				// Find and remove "?"
				hostname = hostname.split("?")[0];
			}
		}
	
		return hostname;
	}

	/**
	 * Add an event listener for when the logging iframe is loaded. We don't assign an onload handler for the iframe's src
	 * because there is a delay between when the html file loads and when the iframe is ready to receive messages. The
	 * logFrameLoaded attribute on embedded_svc.menu keeps track of when the iframe is ready.
	 */
	function addOnLogFrameMessageListener() {
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
		var logFrameOrigin = getHostName(embedded_svc.menu.settings.liveAgentChatUrl);

		eventer(messageEvent, function(e) {
			if(getHostName(e.origin) !== logFrameOrigin) {
				return;
			}
			// Checking for e.message value for IE browsers.
			if(e.data === "LogFrameLoaded" || e.message === "LogFrameLoaded") {
				embedded_svc.menu.logFrameLoaded = true;
			}
		});
	}

	/**
	 * Construct the menu markup with deployment-specific channels.
	 *
	 * @return {DocumentFragment} - Markup for channel menu and configured channels.
	 */
	EmbeddedServiceMenu.prototype.generateMenuMarkup = function generateMenuMarkup() {
		var isEssentialsEdition = embedded_svc.menu.menuConfig.additionalSettings.isEssentialsEdition;
		var showHeader = embedded_svc.menu.menuConfig.brandingData.showHeader === "true";
		var thisFragment = document.createDocumentFragment();
		var menu = document.createElement("div");
		var header;
		var footer;
		var channels;

		menu.id = "esw-channelmenu";
		menu.className = "channelmenu";
		menu.classList.add("active");

		// [A11Y] Set role to dialog.
		menu.setAttribute("role", "dialog");

		// Intially, menu is not open on page load.
		menu.style.visibility = "hidden";

		// [Branding] If `Show Header` is checked, generate and append menu header markup.
		if(showHeader) {
			header = generateMenuHeaderMarkup();
			menu.appendChild(header);
		}

		// Build the menu markup.
		channels = generateChannelMenuItemsMarkup();
		menu.appendChild(channels);

		// [Essentials] If Essentials edition, generate and append footer markup.
		if(isEssentialsEdition) {
			footer = embedded_svc.menu.generateMenuFooterMarkup();
			menu.appendChild(footer);
		}
		
		thisFragment.appendChild(menu);

		return thisFragment;
	};

	/**
	 * Construct the button markup and channel menu with multiple channels.
	 *
	 * @return {DocumentFragment} - Markup for button and menu with multiple channels.
	 */
	function generateMultipleChannelMenuMarkup() {
		var markupFragment = document.createDocumentFragment();
		var modal = document.createElement("div");
		var container = document.createElement("div");
		var fab = document.createElement("button");
		var button_ariaLabel = embedded_svc.menu.menuConfig.labelData.ChannelMenu_Container.MenuButtonAssistiveText || "Channel Menu";
		var closedIconContainer;
		var openedIconContainer;
		var closedIconElement;
		var openedIconElement;
		var menu;

		modal.id = "esw-modaloverlay";
		container.id = "esw-container";

		fab.id = "esw-fab";
		fab.className = "fab";
		fab.name = button_ariaLabel;
		fab.type = "button";

		// [Animations]
		fab.classList.add("show");

		// [Custom Icons][Closed Menu Button] Construct FAB (default state, i.e. when menu is closed.)
		// If custom icon is set for default (menu closed) state, build that icon. Otherwise, build the default icon.
		if(embedded_svc.menu.menuConfig.brandingData.customDefaultButtonIcon && embedded_svc.menu.menuConfig.brandingData.customDefaultButtonIcon.length > 0) {
			closedIconElement = document.createElement("img");
			closedIconElement.setAttribute("src", embedded_svc.menu.menuConfig.brandingData.customDefaultButtonIcon);
			closedIconElement.classList.add("esw-custom_icon");
		} else {
			closedIconElement = renderSVG(DEFAULT_MENU_ICONS.QUESTION);
			closedIconElement.setAttribute("id", "esw-icon-question");
			// Note: IE11 does not support Element.classList for svg elements.
			closedIconElement.setAttribute("class", "esw-default_icon");
		}

		closedIconContainer = document.createElement("div");
		closedIconContainer.classList.add("icon_fab_container");
		closedIconContainer.setAttribute("id", "esw-menu-closed-fab-icon");
		closedIconContainer.appendChild(closedIconElement);

		// [Custom Icons][Opened Menu Button] Construct FAB (close state, i.e. when menu is opened.)
		// If custom icon is set for close (menu opened) state, build that icon. Otherwise, build the default icon.
		if(embedded_svc.menu.menuConfig.brandingData.customCloseButtonIcon && embedded_svc.menu.menuConfig.brandingData.customCloseButtonIcon.length > 0) {
			openedIconElement = document.createElement("img");
			openedIconElement.setAttribute("src", embedded_svc.menu.menuConfig.brandingData.customCloseButtonIcon);
			openedIconElement.classList.add("esw-custom_icon");
		} else {
			openedIconElement = renderSVG(DEFAULT_MENU_ICONS.CLOSE);
			openedIconElement.setAttribute("id", "esw-icon-close");
			// Note: IE11 does not support Element.classList for svg elements.
			openedIconElement.setAttribute("class", "esw-default_icon");
		}
		openedIconContainer = document.createElement("div");
		openedIconContainer.classList.add("icon_fab_container");
		openedIconContainer.setAttribute("id", "esw-menu-opened-fab-icon");
		openedIconContainer.style.display = "none";
		openedIconContainer.appendChild(openedIconElement);

		// Append both (default and close) icons to the button.
		fab.appendChild(closedIconContainer);
		fab.appendChild(openedIconContainer);

		// Construct markup for multiple channels configured on deployment.
		menu = embedded_svc.menu.generateMenuMarkup();

		// Attach menu toggle (to open/close) to button's click handler.
		fab.addEventListener("click", function() {
			embedded_svc.menu.toggleMenu();
		});

		// [A11Y] Set semantic menu markup for screenreaders.
		fab.setAttribute("aria-label", button_ariaLabel);
		fab.setAttribute("aria-expanded", "false");
		fab.setAttribute("aria-haspopup", "true");

		// Build channel menu.
		container.appendChild(menu);
		container.appendChild(fab);

		// [Mobile] Append background overlay (for modal view displayed on mobile devices).
		markupFragment.appendChild(modal);
		markupFragment.appendChild(container);

		return markupFragment;
	}

	/**
	 * Construct the button markup for a single channel.
	 *
	 * @return {DocumentFragment} - Markup for button for a single channel.
	 */
	function generateSingleChannelButtonMarkup() {
		var markupFragment = document.createDocumentFragment();
		var fab = document.createElement("button");
		var iconContainer = document.createElement("div");
		var button_ariaLabel = embedded_svc.menu.menuConfig.labelData.ChannelMenu_Container.MenuButtonAssistiveText || "Channel Menu";
		var icon;
		var singleChannelConfiguration = embedded_svc.menu.menuConfig.configuredChannels[0];
		var menuItemElements = buildMenuItem(singleChannelConfiguration);
		var channelType = getChannelType(singleChannelConfiguration);

		fab.id = "esw-fab";
		fab.className = "fab";
		fab.name = button_ariaLabel;
		fab.type = "button";

		// [Animations]
		fab.classList.add("show");

		// [A11Y] Set channel label on FAB.
		fab.setAttribute("aria-label", menuItemElements.label);

		// Construct icon container and set the single channel's icon on FAB.
		iconContainer.setAttribute("class", "icon_fab_container");
		icon = menuItemElements.icon;
		icon.classList.add("icon_fab");
		icon.setAttribute("id", "esw-icon-" + channelType.toLowerCase());
		iconContainer.appendChild(icon);
		fab.appendChild(iconContainer);

		// Set channel link on FAB.
		if(channelType === "EmbeddedServiceConfig") {
			// Initialize Chat as single CTA.
			embedded_svc.menu.initializeEmbeddedChat(singleChannelConfiguration);

			// Attach startChat() to button's click handler.
			fab.addEventListener("click", function(e) {
				if(fab.classList.contains("loading")) {
					// If Chat is loading, prevent handling the click.
					e.preventDefault();
				} else {
					embedded_svc.menu.openEmbeddedChat();
				}
			});
		} else {
			// Directly launch third-party channel on button click.
			fab.addEventListener("click", function() {
				USER_LEVEL_METRICS.countChannelCTAClicked += 1;
				embedded_svc.menu.postMessage(USER_LEVEL_METRICS);
				window.open(menuItemElements.link.href, menuItemElements.link.target, "noopener");
			});
		}

		return markupFragment.appendChild(fab);
	}

	/**
	 * Generate the markup with deployment-specific configuration.
	 *
	 * @return {DocumentFragment} - Markup for entire channel menu application.
	 */
	function generateMarkup() {
		var thisFragment = document.createDocumentFragment();
		var configuredChannels = embedded_svc.menu.menuConfig.configuredChannels;
		var markup;

		// Instantiate the main channel menu item factory.
		embedded_svc.menu.channelMenuItemFactory = channelMenuItemFactory();

		if(configuredChannels.length === 1) {
			// Generate markup for single channel (button) configured on deployment.
			markup = generateSingleChannelButtonMarkup();
		} else {
			// Generate markup for multiple channels (menu) configured on deployment.
			markup = generateMultipleChannelMenuMarkup();
		}

		thisFragment.appendChild(markup);

		return thisFragment;
	}

	/**
	 * Evaluate which channels are configured on this deployment by doing the following:
	 *	1) Determine if each menu item is supported for the user's operating system.
	 *	2) Ordering the menu items (based on order field).
	 *	3) Ensure maximum of 6 menu items are rendered.
	 * Updates embedded_svc.menu.menuConfig.configuredChannels with the array of configured channels.
	 */
	function updateConfiguredChannels() {
		var currentOperatingSystem = embedded_svc.utils.getOS();
		var allChannels = embedded_svc.menu.menuConfig.menuItems;
		var supportedChannels = [];
		var orderedChannels;
		var configuredChannels;

		if(allChannels && allChannels.length > 0) {
			// Implement OS detection to evaluate which channels are supported for the end user's operating system.
			if(currentOperatingSystem) {
				allChannels.forEach(function(channel) {
					if(channel.unSupportedOS && channel.unSupportedOS.length > 0) {
						// Check if the end user's OS is included in the unsupported OS array.
						if(channel.unSupportedOS.indexOf(currentOperatingSystem) === -1) {
							// If no, this channel should be displayed for this user.
							supportedChannels.push(channel);
						} else {
							// If yes, this channel should be hidden for this user.
							embedded_svc.utils.log("[Channel Menu] The channel \"" + channel.name + "\" is hidden for the following OS: " + currentOperatingSystem);
						}
					} else {
						// No OSes were configured to be hidden, so display this channel.
						supportedChannels.push(channel);
					}
				});
			} else {
				// The user's OS is not properly detected, so display all channels.
				supportedChannels = allChannels;
				embedded_svc.utils.warning("[Channel Menu] OS not properly detected. All channels will be shown.");
			}

			// Sort channels based on increasing order.
			orderedChannels = supportedChannels.sort(function(a, b) {
				return a.order < b.order ? -1 : 1;
			});

			// Display the first six options (or less, if applicable) returned from the response. This does not alter the original array.
			configuredChannels = orderedChannels.slice(0, EmbeddedServiceMenu.MAX_NUMBER_OF_OPTIONS);
			if(configuredChannels.length === 0) {
				embedded_svc.utils.log("[Channel Menu] 0 channels configured on this deployment: " + embedded_svc.menu.menuConfig.menuSettings.name + " for this device.");
			} else {
				// Updates embedded_svc.menu.menuConfig.configuredChannels with the array of configured channels.
				embedded_svc.menu.menuConfig.configuredChannels = configuredChannels;
			}
		} else {
			embedded_svc.utils.error("[Channel Menu] 0 channels configured on this deployment: " + embedded_svc.menu.menuConfig.menuSettings.name + ".");
		}
	}

	/******************************************************
					Initialization functions
	******************************************************/
	/**
	 * Creates the top parent container div and appends the FAB to the DOM.
	 *
	 * @param {function} callback - function to invoke after top container is appended, i.e. injecting custom branding.
	 */
	function appendTopContainer(callback) {
		var container = document.createElement("div");
		var markup = generateMarkup();

		container.className = TOP_CONTAINER_ID;
		container.id = TOP_CONTAINER_ID;

		container.appendChild(markup);
		document.body.appendChild(container);
		// This is a one time commit where all data about the org should have been captured. Also if the time taken is greater than 0 it means channel menu has been loaded on the org.
		if(ORG_LEVEL_METRICS.timeTakenToLoadChannelMenu > 0) {
			ORG_LEVEL_METRICS.channelMenuLoadSuccess = true;
		}

		// Initially show or hide the FAB.
		if(!embedded_svc.menu.settings.displayChannelMenu) {
			embedded_svc.menu.hideTopContainer();
		}

		if(callback && typeof callback === "function") {
			callback();
		}
	}

	/**
	 * Creates iframe for logging purposes. Loads html page from scrt/content.
	 *
	 * For local scrt splunk debugging, see this doc: https://salesforce.quip.com/ZFwmAEqJwzOe
	 *
	 * @param {String} iframeURL - The src for the SCRT logging iframe.
	 */
	function createLoggingIframe(iframeURL) {
		var child = document.createElement("iframe");

		child.id = LOG_IFRAME_ID;
		child.src = iframeURL;
		child.style.display = "none";
		child.onload = function() {
			var frame = embedded_svc.menu.getLogFrame();

			// Send all messages that were awaiting the iframe to load.
			embedded_svc.menu.outboundLogMessagesQueue.forEach(function(message) {
				frame.postMessage(message, iframeURL);
			});
			embedded_svc.menu.outboundLogMessagesQueue = [];
		};
		addOnLogFrameMessageListener();
		document.body.appendChild(child);
	}

	/**
	 * Merges customlabels passed in to the function with the labels in embedded_svc.menu.menuConfig.labelData
	 *
	 * @param {Array} customLabels - An array of custom labels to be merged with labelData
	 */
	EmbeddedServiceMenu.prototype.mergeLabels = function mergeLabels(customLabels) {
		// Initialize labelData with the standard labels
		var labelData = embedded_svc.menu.menuConfig.labelData;

		// Override labelData with custom labels
		if(customLabels && customLabels.length > 0) {
			customLabels.forEach(function(customLabel) {
				labelData[customLabel.sectionName][customLabel.labelName] = customLabel.labelValue;
			});
		}

		return labelData;
	};

	/**
	 * Merge custom menu settings labels and standard labels with custom labels overriding the standard labels
	 * Save the resulting labelData as embedded_svc.menu.menuConfig.labelData
	 * Merge custom menu settings with standard labels as there can only be one setting per channel menu, unlike menu items
	 */
	function processLabels() {
		var standardLabels = embedded_svc.menu.menuConfig.standardLabels;
		// MenuSettings Labels include header, footer, etc. on the menu but doesn't include labels on individual menu items
		var customMenuSettingsLabels = embedded_svc.menu.menuConfig.menuSettings.labels;
		var labelData = {};

		// Labels are sent as an array instead of an object for each section from the REST endpoint
		// Process labels in to the object format for easier consumption
		standardLabels.forEach(function(standardLabel) {
			labelData[standardLabel.sectionName] = labelData[standardLabel.sectionName] || [];
			labelData[standardLabel.sectionName][standardLabel.labelName] = standardLabel.labelValue;
		});
		// Save label data for later reference.
		embedded_svc.menu.menuConfig.labelData = labelData;
		// Override labelData with custom menu settings labels
		embedded_svc.menu.menuConfig.labelData = embedded_svc.menu.mergeLabels(customMenuSettingsLabels);
	}

	/**
	 * Process branding data, map branding vaules to usable CSS values (if applicable), and store for later reference.
	 *
	 */
	function processBranding() {
		// These branding properties are not CSS values and will be stored on embedded_svc.menu.menuConfig.brandingData
		const menuBrandingKeys = ["showHeader", "showHeaderText", "customDefaultButtonIcon", "customCloseButtonIcon", "headerBackgroundImage"];
		// These branding properties need some work to be CSS values and will be stored  with other CSS-ready branding properties on embedded_svc.menu.menuConfig.brandingData.styles
		const customBrandingKeys = ["font", "baseFontSize", "showHorizontalRowsBetweenItems"];
		const customBrandingValues = {
			font: {
				Arial: "sans-serif",
				"Salesforce Sans": "sans-serif",
				Georgia: "serif",
				"Palantino Linotype": "serif",
				"Times New Roman": "serif",
				"Arial Black": "sans-serif",
				"Comic Sans MS": "cursive",
				Impact: "fantasy",
				"Lucida Sans Unicode": "sans-serif",
				Tacoma: "sans-serif",
				"Trebuchet MS": "sans-serif",
				Verdana: "sans-serif",
				"Courier New": "monospace",
				"Lucida Console": "monospace",
				customFont: "sans-serif"
			},
			baseFontSize: {
				Small: "14px",
				Medium: "16px",
				Large: "18px"
			},
			showHorizontalRowsBetweenItems: {
				// eslint-disable-next-line quote-props
				"true": "0.2px solid",
				// eslint-disable-next-line quote-props
				"false": "none"
			}
		};
		var brandingConfiguration = embedded_svc.menu.menuConfig.menuSettings.branding;
		var brandingData = {
			styles: []
		};

		// Parse branding data.
		if(brandingConfiguration) {
			Object.keys(brandingConfiguration).forEach(function(key) {
				var name = brandingConfiguration[key].n;
				var value = brandingConfiguration[key].v;
				var usableValue = "";

				// Note: If value is not set (i.e. image URLs), it will not be present in the server response.
				if(name && value && value.trim().length > 0) {
					if(customBrandingKeys.indexOf(name) === -1) {
						if(menuBrandingKeys.indexOf(name) === -1) {
							// Store CSS-ready values for later.
							brandingData.styles[name] = value;
						} else {
							// Store non-CSS values for later.
							brandingData[name] = value;
						}
					} else {
						// Some branding properties need some help translating into CSS.
						switch(name) {
							case "font":
								if(typeof customBrandingValues[name][value] === "undefined") {
									usableValue = value + ", " + customBrandingValues[name].customFont;
								} else {
									usableValue = value + ", " + customBrandingValues[name][value];
								}
								break;
							default:
								// For `baseFontSize` and `showHorizontalRowsBetweenItems`
								usableValue = customBrandingValues[name][value];
								break;
						}
						// Store the usable CSS value rather than the value returned from server.
						brandingData.styles[name] = usableValue;
					}
				} else {
					embedded_svc.utils.log("[Channel Menu] No custom branding value was specified for branding property \"" + name + "\". Default value will be used.");
				}
			});
		} else {
			embedded_svc.utils.warning("[Channel Menu] Branding configuration not found. Channel Menu will be displayed with default branding values.");
		}

		// Save branding data for later reference.
		embedded_svc.menu.menuConfig.brandingData = brandingData;
	}

	/**
	 * To consume each custom branding property, you need a:
	 * 	1) CSS selector, i.e. which UI elements to customize.
	 * 	2) CSS tag type, i.e. which CSS property to override.
	 * 	3) CSS value (from the response), i.e. what CSS value to apply.
	 *
	 * @param {String} selector - CSS selector, i.e. which UI elements to customize.
	 * @param {String} property - CSS tag type, i.e. which CSS property to override.
	 * @param {String} value - CSS value (from the response), i.e. what CSS value to apply.
	 * @returns {String} style - CSS snippet for consuming a custom branding property.
	 */
	function buildCSS(selector, property, value) {
		var style = "";

		if(!!selector && !!property && !!value) {
			style = selector + " { " + property + ": " + value + "; } \n";
		} else if(typeof selector === "undefined") {
			embedded_svc.utils.warning("[Channel Menu] Error: undefined selector while building CSS for custom branding.");
		} else if(typeof property === "undefined") {
			embedded_svc.utils.warning("[Channel Menu] Error: undefined property while building CSS for custom branding.");
		} else if(typeof value === "undefined") {
			embedded_svc.utils.warning("[Channel Menu] Error: undefined value while building CSS for custom branding.");
		} else {
			embedded_svc.utils.warning("[Channel Menu] Unknown error building CSS for custom branding property \"" + property + "\".");
		}

		return style;
	}

	/**
	 * Build the contents of the custom branding style element from the deployment's custom branding values.
	 *
	 * @returns {String} stylesToApply - Snippet with deployment's custom branding values.
	 */
	function buildCustomBrandingStyleElement() {
		const customBrandingBuilder = {
			font: {
				cssSelector: [".embedded-service"],
				cssProperty: ["font-family"]
			},
			baseFontSize: {
				cssSelector: [".embedded-service"],
				cssProperty: ["font-size"]
			},
			buttonColor: {
				cssSelector: [
					".embedded-service .fab",
					".embedded-service .channelmenu_ctas svg.esw-default_icon[class*=\"icon_cta-\"]",
					".embedded-service .channelmenu_ctas > li[class~=\"loading\"] .loading-circles .loading-circle:before"
				],
				cssProperty: [
					"background-color",
					"fill",
					"background-color"
				]
			},
			buttonIconColor: {
				cssSelector: [
					".embedded-service .fab div[class=\"icon_fab_container\"] > svg.esw-default_icon",
					".embedded-service .fab[class~=\"loading\"] .loading-circles .loading-circle:before"
				],
				cssProperty: [
					"fill",
					"background-color"
				]
			},
			headerBackgroundColor: {
				cssSelector: [".embedded-service .channelmenu_header"],
				cssProperty: ["background-color"]
			},
			headerTextAlignment: {
				cssSelector: [".embedded-service .channelmenu_header"],
				cssProperty: ["text-align"]
			},
			headerTextColor: {
				cssSelector: [".embedded-service .channelmenu_header"],
				cssProperty: ["color"]
			},
			menuBackgroundColor: {
				cssSelector: [
					".embedded-service ul.channelmenu_ctas",
					".embedded-service .channelmenu"
				],
				cssProperty: [
					"background-color",
					"background-color"
				]
			},
			menuBackgroundHoverColor: {
				cssSelector: [".embedded-service .channelmenu_ctas > li:hover"],
				cssProperty: ["background-color"]
			},
			menuTextColor: {
				cssSelector: [".embedded-service .channelmenu_ctas a"],
				cssProperty: ["color"]
			},
			menuTextHoverColor: {
				cssSelector: [".embedded-service .channelmenu_ctas span[class^=\"cta-label-\"]:hover"],
				cssProperty: ["color"]
			},
			showHorizontalRowsBetweenItems: {
				cssSelector: [".embedded-service .channelmenu_ctas > li"],
				cssProperty: ["border-bottom"]
			},
			horizontalRowColor: {
				cssSelector: [".embedded-service .channelmenu_ctas > li"],
				cssProperty: ["border-bottom-color"]
			},
			/** Note: buttonHoverColor is calculated from buttonColor (i.e. not part of response) */
			buttonHoverColor: {
				cssSelector: ".embedded-service .fab:hover, .embedded-service .fab:focus, .embedded-service .fab:active",
				cssProperty: "background-color",
				alphaValue: "0.8"
			}
		};
		var brandingStylesKeys = Object.keys(embedded_svc.menu.menuConfig.brandingData.styles);
		var stylesToApply = "";

		if(brandingStylesKeys.length) {
			// Generate styles for branding properties that rely solely on CSS.
			brandingStylesKeys.forEach(function(brandingProperty) {
				var brandingStyles = embedded_svc.menu.menuConfig.brandingData.styles;
				var i;

				if(customBrandingBuilder[brandingProperty] && brandingStyles[brandingProperty]) {
					// This is for consuming a branding property in multiple places, f.e. cta icon color is the same as button color.
					for(i = 0; i < customBrandingBuilder[brandingProperty].cssSelector.length; i++) {
						// To consume each custom branding property, you need a:
						// 1) CSS selector, i.e. which UI elements to customize.
						// 2) CSS tag type, i.e. which CSS property to override.
						// 3) CSS value (from the response), i.e. what CSS value to apply.
						stylesToApply += buildCSS(
							customBrandingBuilder[brandingProperty].cssSelector[i],
							customBrandingBuilder[brandingProperty].cssProperty[i],
							brandingStyles[brandingProperty]
						);
					}
				}
			});

			// Calculate styling for button:hover color, which is buttonColor converted from hex to rgba so that we can set the alpha to lighten it.
			stylesToApply += buildCSS(
				customBrandingBuilder.buttonHoverColor.cssSelector,
				customBrandingBuilder.buttonHoverColor.cssProperty,
				embedded_svc.utils.hexToRGBA(embedded_svc.menu.menuConfig.brandingData.styles.buttonColor, customBrandingBuilder.buttonHoverColor.alphaValue)
			);
		} else {
			embedded_svc.utils.warning("[Channel Menu] Branding styles not found. Custom branding will not be generated.");
		}

		return stylesToApply;
	}

	/**
	 * Generate and append custom branding <style> element from deployment configuration with custom branding values.
	 */
	function generateCustomBrandingStyleElement() {
		var brandingElement = document.createElement("style");
		var callback;

		brandingElement.type = "text/css";
		brandingElement.innerHTML = buildCustomBrandingStyleElement();

		if(brandingElement.innerHTML.length) {
			callback = function() {
				// CSS is loaded and custom branding is applied prior to appending markup to avoid unstyled elements on the page.
				document.getElementById(TOP_CONTAINER_ID).appendChild(brandingElement);
			};
		}

		// Style element appended to top-level container as a callback.
		appendTopContainer(callback);
	}

	/**
	 * Load the fab.css file
	 */
	function loadCSS() {
		var link = document.createElement("link");
		var baseURL = embedded_svc.menu.settings.gslbBaseURL;

		link.href = baseURL + "/embeddedservice/menu/fab" + (embedded_svc.menu.settings.devMode ? "" : ".min") + ".css";
		link.type = "text/css";
		link.rel = "stylesheet";
		// Ensures custom branding element is applied after main stylesheet is loaded.
		link.onload = generateCustomBrandingStyleElement.bind(this);

		document.getElementsByTagName("head")[0].appendChild(link);
	}

	/**
	 * Load a specified script from the directory specified.
	 *
	 * @param {String} directory - The name of the directory the script resides in.
	 * @param {String} name - The name of the utility script to load.
	 * @param {Function} scriptOnLoadFunction - Function to call when the script is loaded.
	 */
	function loadScriptFromDirectory(directory, name, scriptOnLoadFunction) {
		var lowerCaseName = name.toLowerCase();
		var script = document.createElement("script");
		var baseURL = embedded_svc.menu.settings.gslbBaseURL;

		script.type = "text/javascript";
		script.src = [
			baseURL,
			"embeddedservice",
			embedded_svc.menu.settings.releaseVersion,
			directory,
			lowerCaseName + (embedded_svc.menu.settings.devMode ? "" : ".min") + ".js"
		].filter(Boolean).join("/");

		if(scriptOnLoadFunction) script.onload = scriptOnLoadFunction;

		document.body.appendChild(script);
	}

	/**
	 * Make the SCRT JSONP call
	 */
	function getChannelMenuConfiguration() {
		var scriptElem;

		// JSONP call to SCRT by adding a script tag to the page
		scriptElem = document.createElement("script");
		scriptElem.type = "text/javascript";
		scriptElem.src = SCRT_ENDPOINT_URL;

		document.body.appendChild(scriptElem);
		SCRT_RETRY_ATTEMPTS += 1;
	}
	/**
	 * Process channel menu settings response from the SCRT JSONP call.
	 * Channel Menu Settings call works in the same way as the Settings call for chat button.
	 * This is the callback function that is passed into the JSONP call
	 *
	 * @param {Array} data - Array of JSON objects e.g. [{type: "", message: {}}] sent in the callback from the jsonp call
	 */
	EmbeddedServiceMenu.prototype.processChannelMenuConfiguration = function processChannelMenuConfiguration(data) {
		data.messages.forEach(function(message) {
			if(message.type === "EmbeddedServiceMenu") {
				// Store response as JSON object on menuConfig.
				embedded_svc.menu.menuConfig = message.message;

				// Initialize empty array of configured channels for this deployment/device.
				embedded_svc.menu.menuConfig.configuredChannels = [];
				// Evaluate how many channels configured to display for this deployment/device.
				updateConfiguredChannels();

				// Finish initialization.
				if(embedded_svc.menu.menuConfig.configuredChannels.length < 1) {
					// If there are no channels configured for this device on this deployment, don't append FAB.
					embedded_svc.utils.log("[Channel Menu] 0 channels configured for this deployment/device. Channel menu will not be displayed.");
				} else {
					// Process labels, merge standard and custom labels.
					processLabels();
					// Process and prep custom branding for consumption.
					processBranding();
					// Load stylesheet before injecting custom branding CSS.
					loadCSS();
					END_TIME_FAB_LOAD = new Date().getTime();
					ORG_LEVEL_METRICS.timeTakenToLoadChannelMenu = END_TIME_FAB_LOAD - START_TIME_FAB_LOAD;

					// Store the iframe src and create the logging iframe for splunk metrics after we have the liveAgentChatUrl.  Retrieve the existing liveAgentChatUrl domain  and use the same domain for loading the iframe.
					embedded_svc.menu.settings.iframeURL = embedded_svc.menu.settings.liveAgentChatUrl.substring(0, embedded_svc.menu.settings.liveAgentChatUrl.lastIndexOf("/chat")) + "/content/test/webdriver/logChannelMenu.html?parent=" + document.location.href;
					createLoggingIframe(embedded_svc.menu.settings.iframeURL);
				}
			} else if(message.type === "Error" && SCRT_RETRY_ATTEMPTS < SCRT_MAX_RETRY_ATTEMPTS) {
				embedded_svc.utils.log("[Channel Menu] Getting deployment information failed. Retrying... Attempt: " + SCRT_RETRY_ATTEMPTS);
				getChannelMenuConfiguration();
			} else if(message.type === "Error" && SCRT_RETRY_ATTEMPTS === SCRT_MAX_RETRY_ATTEMPTS) {
				embedded_svc.utils.error("[Channel Menu] " + message.type + " from jsonp call: " + message.message.text);
			} else {
				embedded_svc.utils.error("[Channel Menu] Unexpected message type from jsonp call: " + message.type);
			}
		});
	};

	/**
	 * Construct the JSONP URL.
	 *
	 * @return {String} - Returns JSONP URL
	 */
	function constructChannelMenuEndpointURL() {
		var endpointPath = "/rest/EmbeddedService/EmbeddedServiceMenu.jsonp";
		var language = embedded_svc.menu.settings.language;
		var channelMenuDevName = embedded_svc.menu.settings.channelMenuSettingDevName;
		var queryParams = "";

		queryParams += "?Settings.prefix=EmbeddedService";
		queryParams += "&org_id=" + embedded_svc.menu.settings.orgId;
		queryParams += "&EmbeddedServiceMenu.menuName=" + channelMenuDevName;
		queryParams += "&callback=embedded_svc.menu.processChannelMenuConfiguration";
		queryParams += "&version=" + ENDPOINT_API_VERSION;
		if(typeof language === "string" && language.trim().length > 0) {
			queryParams += "&EmbeddedServiceMenu.language=" + language;
		}

		return embedded_svc.menu.settings.liveAgentChatUrl + endpointPath + queryParams;
	}

	EmbeddedServiceMenu.prototype.finishInit = function finishInit() {
		if(!window.embedded_svc.utils.isOrganizationId(embedded_svc.menu.settings.orgId)) {
			throw new Error("Invalid OrganizationId Parameter Value: " + embedded_svc.menu.settings.orgId);
		}

		SCRT_ENDPOINT_URL = constructChannelMenuEndpointURL();

		// Retrieve deployment-specific configurations from server if no chat present on page already
		// TODO: Find a better hook for continuing active chat sessions in channel menu. This always evaluates to false on page load.
		if(embedded_svc.liveAgentAPI) {
			// Do not make the REST call if there's already an existing session of chat.
			embedded_svc.addEventHandler("sessionDataRetrieved", function(serializedData) {
				if(!serializedData.CHASITOR_SERIALIZED_KEY) {
					getChannelMenuConfiguration();
				}
			});
		} else {
			getChannelMenuConfiguration();
		}
	};

	/**
	 * Retrieve a reference to the iframe DOM element.
	 *
	 * @returns {HTMLElement} A reference to the iframe.
	 */
	EmbeddedServiceMenu.prototype.getLogFrame = function getLogFrame() {
		var element = document.getElementById(LOG_IFRAME_ID);

		if(!this.logFrame && element) {
			this.logFrame = element.contentWindow;
		}

		return this.logFrame;
	};

	/**
	* Entry point initialization function (invoked by the snippet).
	*
	* @param {string} baseCoreURL - The base URL for the server where ESW files live.
	* @param {string} liveAgentChatUrl -  Live agent chat url on SCRT server.
	* @param {string} gslbBaseURL - The base URL for the global Salesforce load balancer.
	* @param {string} orgId - The entity ID for the organization.
	* @param {string} eswConfigDevName - The developer name for the EmbeddedServiceConfig object.
	* @param {object} channelMenuSettingDevName - The developer name for the Channel Menu Settings object.
	*/
	EmbeddedServiceMenu.prototype.init = function init(baseCoreURL, liveAgentChatUrl, gslbBaseURL, orgId, channelMenuSettingDevName) {
		if(typeof baseCoreURL !== "string") {
			throw new Error("baseCoreURL value must be a string.");
		}

		if(typeof liveAgentChatUrl !== "string") {
			throw new Error("liveAgentChatUrl value must be a string.");
		}

		if(typeof orgId !== "string") {
			throw new Error("orgId value must be a string.");
		}

		if(typeof channelMenuSettingDevName !== "string") {
			throw new Error("channelMenuSettingDevName value must be a string.");
		}

		this.settings.baseCoreURL = baseCoreURL;
		this.settings.liveAgentChatUrl = liveAgentChatUrl;
		this.settings.gslbBaseURL = gslbBaseURL ? gslbBaseURL : baseCoreURL;
		this.settings.orgId = orgId;
		this.settings.channelMenuSettingDevName = channelMenuSettingDevName;

		// Load the common utils file.
		loadScriptFromDirectory("utils", "common", function() {
			embedded_svc.menu.finishInit();
		});
	};

	/******************************************************
					Public runtime functions
						(Embedded Chat)
	******************************************************/
	/**
	 * Updates the Embedded Chat CTA based on agent availability.
	 * Disables or hides the channel if agents are not available to chat.
	 */
	EmbeddedServiceMenu.prototype.onAgentAvailabilityChange = function onAgentAvailabilityChange() {
		var isMenuItem = embedded_svc.menu.menuConfig.configuredChannels.length > 1;
		var channelMenuWebChatLabels = embedded_svc.menu.menuConfig.embeddedChat.labelsObject.ChannelMenu_WebChat;
		var chatCtaAnchor = document.querySelector(".cta-link-embeddedserviceconfig");
		var chatCtaListItem = document.querySelector(".cta-embeddedserviceconfig");
		var chatCtaSpan = document.getElementsByClassName("cta-label-embeddedserviceconfig")[0];
		var chatSingleButton = document.getElementById("esw-fab");

		if(isMenuItem && (!chatCtaAnchor || !chatCtaListItem || !chatCtaSpan)) {
			embedded_svc.utils.warning("[Channel Menu] Embedded Chat menu item element is not present.");
		} else if(!isMenuItem && !chatSingleButton) {
			embedded_svc.utils.warning("[Channel Menu] Embedded Chat button element is not present.");
		} else if(embedded_svc.isButtonDisabled) {
			// Availability changes update the isButtonDisabled setting.
			if(isMenuItem) {
				chatCtaAnchor.setAttribute("aria-disabled", true);
				chatCtaListItem.classList.add("disabled");
				chatCtaSpan.innerText = channelMenuWebChatLabels.ChatUnavailable;
			} else {
				// Hide channel menu if there's just one channel and agents are offline.
				embedded_svc.menu.hideButtonAndMenu(EmbeddedServiceMenu.ANIMATION_CONSTANTS.FADE);
				embedded_svc.menu.hideTopContainer();
				embedded_svc.utils.log("[Channel Menu] Hiding Channel Menu until agents are available to chat.");
			}
		} else {
			if(isMenuItem) {
				chatCtaAnchor.removeAttribute("aria-disabled");
				chatCtaListItem.classList.remove("disabled");
				chatCtaSpan.innerText = channelMenuWebChatLabels.ChatAvailable;
			} else {
				// Show channel menu if there's just one channel and agents are online.
				embedded_svc.menu.showTopContainer();
				embedded_svc.menu.showButtonAndMenu();
			}
		}
	};

	/**
	 * Runtime function to open the Embedded Chat application.
	 * This function fires when user clicks the Chat CTA/FAB.
	 */
	EmbeddedServiceMenu.prototype.openEmbeddedChat = function() {
		var isMenuItem = embedded_svc.menu.menuConfig.configuredChannels.length > 1;
		var chatLabels = embedded_svc.menu.menuConfig.embeddedChat.labelsObject.ChannelMenu_WebChat;
		var chatCtaElement;
		var chatCtaLabel;
		var chatCtaIcon;
		var chatLoadingSpinner = document.createElement("div");
		var circle;
		var i;

		// [Animations] Build loading spinner.
		chatLoadingSpinner.setAttribute("class", "loading-circles");
		for(i = 1; i < 13; i++) {
			circle = document.createElement("div");
			circle.setAttribute("class", "loading-circle" + i + " loading-circle");
			chatLoadingSpinner.appendChild(circle);
		}

		// Seamless animation from Channel Menu to sidebar after Chat loads.
		if(isMenuItem) {
			chatCtaElement = document.querySelector(".cta-embeddedserviceconfig");
			chatCtaLabel = document.getElementsByClassName("cta-label-embeddedserviceconfig")[0];
			chatCtaIcon = document.querySelector(".icon_cta-embeddedserviceconfig");
			chatLoadingSpinner.classList.add("icon_cta-loading");

			// Set loading state for Chat menu item.
			chatCtaElement.classList.add("loading");
			chatCtaLabel.innerText = chatLabels.ChatLoading;
			// [Animations] Replace chat icon with loading spinner.
			chatCtaIcon.style.display = "none";
			chatCtaIcon.parentNode.insertBefore(chatLoadingSpinner, chatCtaIcon);

			// Create component only as bootstrap is already done in openChannelMenu.
			embedded_svc.createEmbeddedServiceComponent()
				.then(function(result) {
					embedded_svc.utils.log("[Channel Menu] " + result);
					// Reset label to Web Chat (Online).
					chatCtaLabel.innerText = chatLabels.ChatAvailable;
					// Close channel menu when sidebar is ready to be displayed.
					embedded_svc.menu.hideButtonAndMenu(EmbeddedServiceMenu.ANIMATION_CONSTANTS.FADE);
				}).catch(function(result) {
					embedded_svc.utils.warning("[Channel Menu] " + result);
					// Reset label to Web Chat Offline.
					chatCtaLabel.innerText = chatLabels.ChatUnavailable;
				}).finally(function() {
					// Replace loading spinner with chat icon.
					chatCtaIcon.parentNode.removeChild(chatLoadingSpinner);
					chatCtaIcon.style.display = "flex";
					// Reset menu item back to normal clickable state.
					chatCtaElement.classList.remove("loading");
				});
		} else {
			chatCtaElement = document.getElementById("esw-fab");
			chatCtaIcon = document.getElementById("esw-icon-embeddedserviceconfig");
			chatLoadingSpinner.classList.add("icon_fab-loading");

			// Set loading state for Chat FAB.
			chatCtaElement.classList.add("loading");
			chatCtaElement.setAttribute("aria-label", chatLabels.ChatLoading);
			// [Animations] Loading state for button (i.e. single-channel Chat FAB).
			chatCtaIcon.style.display = "none";
			chatCtaIcon.parentNode.insertBefore(chatLoadingSpinner, chatCtaIcon);

			// Open the Chat widget.
			embedded_svc.onHelpButtonClick();
		}

		// After closing Chat, display Channel Menu again.
		embedded_svc.addEventHandler("afterDestroy", function() {
			if(isMenuItem) {
				embedded_svc.menu.showButtonAndMenu();
			} else {
				// Replace loading spinner with chat icon.
				chatCtaIcon.parentNode.removeChild(chatLoadingSpinner);
				chatCtaIcon.style.display = "flex";
				// Reset Chat FAB to normal state.
				chatCtaElement.setAttribute("aria-label", chatLabels.ChatAvailable);
				chatCtaElement.classList.remove("loading");
			}
		});
	};

	/**
	 * Load esw.js and call embedded_svc.init() to initialize first-party Embedded Chat.
	 *
	 * @param {Object} menuItemData - Deployment configuration data for the Chat CTA.
	 */
	EmbeddedServiceMenu.prototype.initializeEmbeddedChat = function initializeEmbeddedChat(menuItemData) {
		var labelsLanguage = embedded_svc.menu.menuConfig.additionalSettings.labelsLanguage;

		loadScriptFromDirectory(undefined, "esw", function() {
			embedded_svc.settings.displayHelpButton = false;
			embedded_svc.settings.enabledFeatures = ["LiveAgent"];
			embedded_svc.settings.entryFeature = "LiveAgent";
			// Pass in language setting to esw.js if its defined in fab.js so that it's used on sidebar initialization
			if(labelsLanguage && labelsLanguage.trim() !== "") {
				embedded_svc.settings.language = labelsLanguage;
			}
			// Add the chat settings passed in from snippet
			if(embedded_svc.menu.chat.settings) {
				Object.getOwnPropertyNames(embedded_svc.menu.chat.settings).forEach(function(setting) {
					Object.defineProperty(embedded_svc.settings, setting, Object.getOwnPropertyDescriptor(embedded_svc.menu.chat.settings, setting));
				});
			}

			embedded_svc.init(
				embedded_svc.menu.settings.baseCoreURL,
				menuItemData.configuration.siteUrl,
				embedded_svc.menu.settings.gslbBaseURL,
				embedded_svc.menu.settings.orgId,
				menuItemData.channel,
				{
					baseLiveAgentContentURL: embedded_svc.menu.menuConfig.additionalSettings.liveAgentContentUrl,
					deploymentId: menuItemData.configuration.embeddedServiceLiveAgent.liveChatDeployment,
					buttonId: menuItemData.configuration.embeddedServiceLiveAgent.liveChatButton,
					baseLiveAgentURL: embedded_svc.menu.settings.liveAgentChatUrl,
					eswLiveAgentDevName: menuItemData.configuration.embeddedServiceLiveAgent.eswLiveAgentDevName,
					isOfflineSupportEnabled: menuItemData.configuration.embeddedServiceLiveAgent.isOfflineSupportEnabled
				}
			);
		});
	};

	/******************************************************
					Public runtime functions
						(Channel Menu)
	******************************************************/
	/**
	 * Runtime function to open the menu.
	 */
	EmbeddedServiceMenu.prototype.openChannelMenu = function openChannelMenu() {
		var fab = document.getElementById("esw-fab");
		var menu = document.getElementById("esw-channelmenu");
		var modal = document.getElementById("esw-modaloverlay");
		var scrollPosition = document.body.scrollTop;
		var animatedElements = document.getElementById(TOP_CONTAINER_ID).querySelectorAll(".active");
		var i;

		// [Animations] Trigger animation classes on `active` menu elements when menu is opened.
		// NOTE: We are using a for-loop here because NodeList.prototype.forEach is not supported in IE11.
		for(i = 0; i < animatedElements.length; i++) {
			// Use Object.keys with a map function because IE11 doesn't support Object.values.
			Object.keys(EmbeddedServiceMenu.ANIMATION_CONSTANTS).map(function(key) {
				return EmbeddedServiceMenu.ANIMATION_CONSTANTS[key];
			}).forEach(function(animatedElement, animationClass) {
				// The param animatedElement is animatedElements[i] from outer for-loop, animationClass is the value for the key in the ANIMATIONS_CONSTANTS map.
				if(animatedElement.classList.contains(animationClass)) animatedElement.classList.remove(animationClass);
			}.bind(this, animatedElements[i]));
			// Always add "show" class.
			animatedElements[i].classList.add("show");
		}

		// Show the menu.
		menu.style.visibility = "visible";

		// [A11Y] Set focus on the most recently selected listbox option.
		if(EmbeddedServiceMenu.FOCUSABLE_OPTIONS[EmbeddedServiceMenu.FOCUSED_OPTION_INDEX]) {
			setTimeout(function() {
				EmbeddedServiceMenu.FOCUSABLE_OPTIONS[EmbeddedServiceMenu.FOCUSED_OPTION_INDEX].focus();
			}, 500);
		}

		// [A11Y] Lets screenreaders know the menu is expanded.
		fab.setAttribute("aria-expanded", "true");

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen max width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(!modal.classList.contains("isMaximized")) {
			modal.classList.add("isMaximized");
		}

		// [Mobile] The `embeddedServiceChannelMenuPreventScrolling` class is appended/removed from the document.body
		// to prevent background scrolling on devices that display the background modal.
		if(!embedded_svc.utils.isDesktop() && !document.body.classList.contains("embeddedServiceChannelMenuPreventScrolling")) {
			document.body.classList.add("embeddedServiceChannelMenuPreventScrolling");
			EmbeddedServiceMenu.DOCUMENT_SCROLL_POSITION = scrollPosition;
		}

		// Toggles FAB icon from closed state to open state.
		fab.querySelector("#esw-menu-closed-fab-icon").style.display = "none";
		fab.querySelector("#esw-menu-opened-fab-icon").style.display = "inline-block";

		// Attribute embedded_svc liveAgentAPI would only be defined if chat is an option in the channel menu.
		if(embedded_svc.liveAgentAPI) {
			if(typeof Promise === "function" && typeof Promise.prototype.then === "function") {
				embedded_svc.loadLightningOutScripts(
					{ baseCoreUrl: this.settings.baseCoreURL }
				).then(embedded_svc.instantiateLightningOutApplication);
			} else {
				embedded_svc.loadScriptFromDirectory(
					"common",
					"promisepolyfill",
					this.openChannelMenu.bind(this),
					true
				);
			}
		}
		USER_LEVEL_METRICS.countChannelMenuOpened += 1;
		embedded_svc.menu.postMessage(USER_LEVEL_METRICS);
	};

	/**
	 * Send a message to the logging iframe.
	 *
	 * @param {Object} metricsData - Data to be posted to log frame.
	 */
	EmbeddedServiceMenu.prototype.postMessage = function postMessage(metricsData) {
		// The data received to post metrics is massaged to a more readable form in splunk.
		var message = {
			liveAgentChatUrl: this.settings.liveAgentChatUrl,
			orgId: this.settings.orgId,
			domain: document.domain,
			// Metrics data can be user level or org level metrics.
			metricsData: metricsData,
			devMode: this.settings.devMode,
			timestamp: new Date().toUTCString()
		};
		var frame = this.getLogFrame();

		if(frame && this.logFrameLoaded === true) {
			frame.postMessage(message, this.settings.iframeURL);
		} else {
			this.outboundLogMessagesQueue.push(message);
		}
	};

	/**
	 * Runtime function to close the menu.
	 *
	 * @param {String} animationClass - Optional. The string class to add to the channel menu container to hide or fade, should be one of the keys included in ANIMATION_CONSTANTS map.
	 */
	EmbeddedServiceMenu.prototype.closeChannelMenu = function closeChannelMenu(animationClass) {
		var fab = document.getElementById("esw-fab");
		var menu = document.getElementById("esw-channelmenu");
		var modal = document.getElementById("esw-modaloverlay");
		var animatedElements = document.getElementById(TOP_CONTAINER_ID).querySelectorAll(".active");
		var i;
		var animation = animationClass ? animationClass : "hide";

		// [Animations] Trigger animation classes on `active` menu elements when menu is opened.
		// NOTE: We are using a for-loop here because NodeList.prototype.forEach is not supported in IE11.
		for(i = 0; i < animatedElements.length; i++) {
			if(animatedElements[i].classList.contains("show")) animatedElements[i].classList.remove("show");
			animatedElements[i].classList.add(animation);
		}

		// Hide the menu.
		menu.style.visibility = "hidden";

		// [A11Y] Lets screenreaders know the menu is not expanded.
		fab.setAttribute("aria-expanded", "false");

		// Toggles FAB icon from opened state to closed state.
		fab.querySelector("#esw-menu-opened-fab-icon").style.display = "none";
		fab.querySelector("#esw-menu-closed-fab-icon").style.display = "inline-block";

		// [Mobile] `isMaximized` controls showing the background modal. This class is constrained by media queries
		// (against the screen max width) in CSS, so there's no need to check isDesktop() before adding/removing the class.
		if(modal.classList.contains("isMaximized")) {
			modal.classList.remove("isMaximized");
		}

		// [Mobile] The `embeddedServiceChannelMenuPreventScrolling` class is appended/removed from the body
		// to prevent background scrolling on devices that display the background modal.
		if(!embedded_svc.utils.isDesktop()) {
			document.body.classList.remove("embeddedServiceChannelMenuPreventScrolling");
			document.body.scrollTop = EmbeddedServiceMenu.DOCUMENT_SCROLL_POSITION;
		}
	};

	/**
	 * Runtime function to toggle the channel menu.
	 *
	 * This function fires when user clicks the FAB when there are multiple channels configured.
	 */
	EmbeddedServiceMenu.prototype.toggleMenu = function toggleMenu() {
		var menu = document.getElementById("esw-channelmenu");

		if(menu.style.visibility === "hidden") {
			embedded_svc.menu.openChannelMenu();
		} else {
			embedded_svc.menu.closeChannelMenu();
		}
	};

	/**
	 * Runtime function to visually show the button and menu.
	 */
	EmbeddedServiceMenu.prototype.showButtonAndMenu = function showButtonAndMenu() {
		var fab = document.getElementById("esw-fab");

		if(fab) {
			// Use Object.keys with a map function because IE11 doesn't support Object.values.
			Object.keys(EmbeddedServiceMenu.ANIMATION_CONSTANTS).map(function(key) {
				return EmbeddedServiceMenu.ANIMATION_CONSTANTS[key];
			}).forEach(function(animationClass) {
				if(fab.classList.contains(animationClass)) fab.classList.remove(animationClass);
			});
			// Always add "show" class.
			fab.classList.add("show");
		}

		// [Animations/A11Y] If "Reduce Motion" is supported and checked, toggle showing button instead of animating it.
		if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			fab.style.visibility = "visible";
		}
	};

	/**
	 * Runtime function to close the menu (if it is open) and visually hide the button.
	 *
	 * @param {String} animationClass - Optional. The string class to add to the channel menu container to hide or fade, should be one of the keys included in ANIMATION_CONSTANTS map.
	 */
	EmbeddedServiceMenu.prototype.hideButtonAndMenu = function hideButtonAndMenu(animationClass) {
		var fab = document.getElementById("esw-fab");
		// Default to "hide" if an animation is not passed in.
		var animation = animationClass ? animationClass : "hide";

		// Close the menu (if it is open) before hiding the button.
		if(!!document.getElementById("esw-channelmenu")) embedded_svc.menu.closeChannelMenu(animation);

		if(fab) {
			if(fab.classList.contains("show")) fab.classList.remove("show");
			fab.classList.add(animation);
		}

		// [Animations/A11Y] If "Reduce Motion" is supported and checked, toggle hiding button instead of animating it.
		if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			fab.style.visibility = "hidden";
		}
	};

	/**
	 * Runtime function to show the entire app (FAB and Channel Menu) in the document flow.
	 */
	EmbeddedServiceMenu.prototype.showTopContainer = function showTopContainer() {
		var element = document.getElementById(TOP_CONTAINER_ID);

		if(element) element.style.display = "flex";
	};

	/**
	 * Runtime function to hide the entire app (FAB and Channel Menu) from the document flow.
	 */
	EmbeddedServiceMenu.prototype.hideTopContainer = function hideTopContainer() {
		var element = document.getElementById(TOP_CONTAINER_ID);

		if(element) element.style.display = "none";
	};

	/**
	 * Runtime function to destroy the entire app and clear embedded_svc.
	 * If you use this function, you must call embedded_svc.menu.init() again.
	 */
	EmbeddedServiceMenu.prototype.destroy = function destroy() {
		var element = document.getElementById(TOP_CONTAINER_ID);

		if(element && element.parentElement) element.parentElement.removeChild(element);
		if(window.embedded_svc) window.embedded_svc = undefined;
	};

	window.embedded_svc.menu = new EmbeddedServiceMenu();
})();