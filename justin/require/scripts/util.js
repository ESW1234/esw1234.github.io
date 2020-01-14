// example module to load from require.html
console.log("util - define");
define({
    color: "black",
    size: "unisize"
});
define(function() {
    var sample1 = {};
    //do your stuff
    return sample1;
});
// Just set a global var
myFoobar = "foo";
