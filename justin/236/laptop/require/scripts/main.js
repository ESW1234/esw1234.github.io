requirejs(
	["scripts/util"],
	function(util) {
		console.log("Successfully loaded util.js using require.");
	},
	function(err) {
		console.error("Error loading util.js using require: " + err);
	}
);
