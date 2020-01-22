requirejs(
	["util", "snippet"],
	function(util, snippet) {
		console.log("Successfully loaded require dependencies.");
	},
	function(err) {
		console.log("ERROR: " + err);
	}
);
