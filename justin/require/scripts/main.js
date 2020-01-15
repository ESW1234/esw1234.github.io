requirejs(["util", "inert"], function(util, inert) {
    //This function is called when scripts/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "util".
//     console.log("require dependencies loaded");
    
//     var script = document.createElement("script");
    
//     script.type = "text/javascript";
//     script.src = "scripts/snippet.js";
//     script.onload = function() {
//         console.log("snippet loaded");
//     };
    
//     document.body.appendChild(script);

    console.log("util loaded");
    console.log("snippet loaded");
});
