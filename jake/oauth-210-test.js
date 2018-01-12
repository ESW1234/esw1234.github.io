(function() {
	var BASE_CORE_URL = "https://na1-blitz04.soma.salesforce.com";
	var COMMUNITY_ENDPOINT_URL = "https://justincommunitessubdomain-15-15c3c79d62b.blitz04.soma.force.com/napili081517";
	var oauthToken;

	embedded_svc = {
		auth: {}
	};

	function loadLightningApp() {
		$Lightning.use(
			"c:oauthTestApp",
			function() {
				console.log("Lightning app loaded!");
				$Lightning.createComponent(
					"c:oauthTest",
					{},
					document.querySelector("#appContainer"),
					function(newCmp) {
						console.log(arguments);
					}
				);

			}.bind(this),
			COMMUNITY_ENDPOINT_URL,
			embedded_svc.auth.oauthToken,
			undefined
		);
	}
	function onAuthSet() {
		var scriptEl;

		if(!window.$Lightning && embedded_svc.auth.oauthToken) {
			scriptEl = document.createElement("script");
			scriptEl.type = "text/javascript";

			scriptEl.onload = function() {
				loadLightningApp();
			}.bind(this);

			scriptEl.src = BASE_CORE_URL + "/lightning/lightning.out.js";
			document.getElementsByTagName("head")[0].appendChild(scriptEl);
		} else {
			loadLightningApp();
		}
	}

	Object.defineProperty(embedded_svc.auth, "oauthToken", {
		get: function() {
			return oauthToken;
		},
		set: function(value) {
			oauthToken = value;
			onAuthSet();
		}
	});

	document.querySelector("#authSubmit").onclick = function() {
		embedded_svc.auth.oauthToken = document.querySelector("#authToken").value;
	};
})();
