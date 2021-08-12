requirejs(
	// Pass in either "snippet_stmfb" or "snippet_stmfc"
	["util", "snippet_stmfc"],
	function(util, snippetFileName) {
		// Success callback.
		console.log("Snippet: " + snippetFileName + "loaded successfully using require.js.");
	},
	function(e) {
		// Error callback.	
		console.error(e);
	}
);
