requirejs(
	// Pass in either "snippet_stmfb" or "snippet_stmfc"
	["util", "snippet_stmfb"],
	function(util, snippetFileName) {
		// Success callback.
		console.log("Snippet loaded successfully using require.js.");
	},
	function(e) {
		// Error callback.	
		console.error(e);
	}
);
