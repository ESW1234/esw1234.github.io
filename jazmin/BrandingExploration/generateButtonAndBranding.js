(function() {
	function ChannelMenuBrandingDemo() {
		// This would be replaced by custom branding JSON from Rest Endpoint
		var CHANNEL_BRANDING_DATA = {
			branding1: {
				cssTagType: "color",
				cssValue: "FF5733"
			},
			branding2: {
				cssTagType: "color",
				cssValue: "#FFBD33"
			},
			 branding3: {
				cssTagType: "color",
				cssValue: "#33FFBD"
			},
			branding4: {
				cssTagType: "font-size",
				cssValue: "1.2em"
			},
			branding5: {
				cssTagType: "font-family",
				cssValue: "Arial"
			}
		};

		this.displayBrandedHelpButton();
	}

	ChannelMenuBrandingDemo.prototype.generateButton = function(callback) {
		var channelMenuButton = document.createElement("div");
		channelMenuButton.className = 'channelMenuButton';
		channelMenuButton.innerHTML =
			'<div class="helpButton">' + 
				'<button class="helpButtonEnabled uiButton" href="javascript:void(0)">' +
					'<span class="embeddedServiceIcon" aria-hidden="true" data-icon="&#59648;"></span>' + 
					'<span class="helpButtonLabel" id="helpButtonSpan" aria-live="polite" aria-atomic="true">' +
						'<span class="message">Hello I am a Button</span>' +
					'</span>' +
				'</button>'+
			'</div>';

		// Don't display the button until you generate the CSS.
		channelMenuButton.style.display = "none";

		// Now that we have created the button append it to the page
		document.body.appendChild(channelMenuButton);

		// Callback after we have completed generating the help button and putting it on the page
		if(callback) {
			callback()
		}
	};

	ChannelMenuBrandingDemo.prototype.generateCss = function() {
		var stylesToApply = "";
		var channelMenuButton = document.getElementsByClassName("channelMenuButton");
		var channelMenuBranding = document.createElement("style");
		var brandingData = CHANNEL_BRANDING_DATA;

		channelMenuBranding.type = "text/css";

		// Generate css based on Branding JSON
		Object.keys(brandingData).forEach(function(key) {
			if(brandingData) {
				stylesToApply += "." + key + " { " + brandingData[key].cssTagType + ": " + brandingData[key].cssValue + " } \n";
			}
		});
		channelMenuBranding.innerHTML = stylesToApply;

		if(channelMenuButton) {
			if(channelMenuButton[0]) {
				channelMenuButton[0].append(channelMenuBranding);

				// Display button now that we have applyed the Branding
				channelMenuButton[0].style.display = "";
			}
		}
	};

	ChannelMenuBrandingDemo.prototype.displayBrandedHelpButton = function() {
		this.generateButton(this.generateCss)
	}

	document.channelMenuBrandingDemo = new ChannelMenuBrandingDemo();
})(document.channelMenuBrandingDemo || {});
