requirejs(
	["util"],
	function(util) {
		console.log("INSIDE REQUIREJS CALLBACK.");
	},
	function(err) {
		debugger;
	}
);
