requirejs(
	// Load either snippet_stmfb.js or snippet_stmfc.js
	["util", "snippet_stmfb.js"],
	function(util, snippet) {
		// Success callback.
		console.log("Snippet loaded successfully using require.js.");
	},
	function(e) {
		// Error callback.	
		console.error(e);
	}
);
