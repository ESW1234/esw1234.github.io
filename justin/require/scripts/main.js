requirejs(["snapins_snippet"], function(snippet) {
    //This function is called when scripts/helper/snapins_snippet.js is loaded.
    //If snapins_snippet.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/snapins_snippet".
});
