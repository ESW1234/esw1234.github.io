(function(something) {
	function ChannelMenuBranding() {
		// This would be replaced by custom branding JSON from Rest Endpoint
		this.channelBrandingData = {
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

		this.generateCss(this.channelBrandingData);
	}

	ChannelMenuBranding.prototype.generateCss = function(jsonBrandingStyles) {
		var stylesToApply = "";
		var channelMenuButton = document.getElementsByClassName("channelMenuButton");
		var channelMenuBranding = document.createElement("style");

		channelMenuBranding.type = "text/css";

		// Generate css based on Branding JSON
		Object.keys(jsonBrandingStyles).forEach(function(key) {
			if(jsonBrandingStyles[key]) {
				stylesToApply += "." + key + " { " + jsonBrandingStyles[key].cssTagType + ": " + jsonBrandingStyles[key].cssValue + " } \n";
			}
		});
		channelMenuBranding.innerHTML = stylesToApply;

		if(channelMenuButton) {
			if(channelMenuButton[0]) {
				channelMenuButton[0].append(channelMenuBranding);
			}
		}
	};

	document.channelBranding = new ChannelMenuBranding();
})(document.channelBranding || {});
