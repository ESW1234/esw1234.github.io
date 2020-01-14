requirejs(["util", "snippet"], function(util, snippet) {
    //This function is called when scripts/helper/snippet.js is loaded.
    //If snippet.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "snippet".
});
