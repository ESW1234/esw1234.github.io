requirejs(
	// Load either snippet_stmfb.js or snippet_stmfc.js
	["util", "snippet_stmfc.js"],
	function(util, snippetJavaScript) {
		// Success callback.
		console.log("Snippet: " + snippetJavaScript + "loaded successfully using require.js.");
	},
	function(e) {
		// Error callback.	
		console.error(e);
	}
);
