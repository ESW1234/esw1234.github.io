requirejs.config({
	shim: {
		"bootstrap": {
			"deps": [
				'jquery'
			]
		}
	},
	paths: {
		"jquery": "https://code.jquery.com/jquery-1.11.2.min.js",
		"jquery-ui": "https://code.jquery.com/ui/1.11.4/jquery-ui.min.js",
		"bootstrap": "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"
	}
});

requirejs(["util", "purify"], function (util, purify) { // bootstrap must come first
	console.log("util, purify loaded");
	var script = document.createElement("script");
    
    	script.type = "text/javascript";
    	script.src = "scripts/snippet.js";
    	script.onload = function() {
		console.log("snippet loaded");
    	};

    	document.body.appendChild(script);
});

/*
requirejs(["util", "purify", "jquery"], function(util, purify, jquery) {
    console.log("util, purify, jquery loaded");

    //This function is called when scripts/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "util".
    
    var script = document.createElement("script");
    
    script.type = "text/javascript";
    script.src = "scripts/snippet.js";
    script.onload = function() {
        console.log("snippet loaded");
    };
    
    document.body.appendChild(script);
});
*/
