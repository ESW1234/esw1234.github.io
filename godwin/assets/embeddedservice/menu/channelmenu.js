	/**
	 * Load bootstrap.js and call embeddedservice_bootstrap.init() to initialize first-party Embedded Messaging (MIAW).
	 *
	 * @param {Object} menuItemData - Deployment configuration data for the Chat CTA.
	 * @param {Boolean} isMenuItem - If the Embedded Messaging channel clicked was a menu item or a single-channel button.
	 */
	embedded_svc.menu.initializeEmbeddedMessaging = function initializeEmbeddedMessaging(menuItemData, isMenuItem) {
		var labelsLanguage = embedded_svc.menu.menuConfig.additionalSettings.labelsLanguage;
		var baseURL = 'https://godwinlaw.my.localhost.sfdcdev.site.com:6101/ESWMessagingWebExperienc1709839200606';

		// Load bootstrap.js from MIAW deployment's LWR site endpoint.
		embedded_svc.utils.loadScriptFromUrl(
			baseURL + "/assets/js/bootstrap" + (embedded_svc.menu.settings.devMode ? "" : ".min") + ".js",
			function() {
				// Verify global object is available.
				if(!window.embeddedservice_bootstrap || !embeddedservice_bootstrap) {
					embedded_svc.utils.error("[Channel Menu] Global object embeddedservice_bootstrap is not available.");

					return;
				}

				// Pass language to bootstrap.js if it's defined in channelMenu.js.
				if(labelsLanguage && labelsLanguage.trim() !== "") {
					embeddedservice_bootstrap.settings.language = labelsLanguage;
				}

				// Merge in any MIAW settings passed in from page (snippet) or file (static resource).
				if(embedded_svc.menu.configuration && embedded_svc.menu.configuration[menuItemData.name] && embedded_svc.menu.configuration[menuItemData.name].settings) {
					Object.getOwnPropertyNames(embedded_svc.menu.configuration[menuItemData.name].settings).forEach(function(setting) {
						Object.defineProperty(embeddedservice_bootstrap.settings, setting, Object.getOwnPropertyDescriptor(embedded_svc.menu.configuration[menuItemData.name].settings, setting));
					});
				}

				// Verify Bootstrap API is available, or notify admin to publish.
				if(typeof window.embeddedservice_bootstrap.bootstrapEmbeddedMessaging !== "function") {
					embedded_svc.utils.error("[Channel Menu] Initialization script is not up to date. Please publish your MIAW deployment: " + menuItemData.channel);
				}

				// If MIAW was configured to not be initially displayed that takes precedent over business hours
				if (menuItemData.isDisplayedOnPageLoad) {
					addEmbeddedMessagingVisibilityChangeEventListener(isMenuItem);
				}

				embeddedservice_bootstrap.init(
					embedded_svc.menu.settings.orgId,
					menuItemData.channel,
					'https://godwinlaw.my.localhost.sfdcdev.site.com:6101/ESWMessagingWebExperienc1709839200606',
					{
						scrt2URL: menuItemData.scrt2Url
					}
				);
			},
			function() {
				embedded_svc.utils.error("[Channel Menu] Error downloading MIAW initialization script.");
			}.bind(embedded_svc)
		);
	}
