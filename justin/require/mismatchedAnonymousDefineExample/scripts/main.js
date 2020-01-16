requirejs(["util"], function(util) {
  /*
   * You will never reach this because an error will be thrown on loading util.js via require.
   * 
   * An error is thrown because require has been loaded and another javascript file was loaded
   * that calls define() but was not loaded via require.
   */
  console.log("Loaded util.js via require.");
});
