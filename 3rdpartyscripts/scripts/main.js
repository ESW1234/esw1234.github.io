requirejs(
	["util", "snippet"]),
	function(util, snippet) {
		// Success callback.
		console.log("Snippet loaded successfully using require.js.");
	},
	function(e) {
		// Error callback.	
		console.error(e);
	}
);
