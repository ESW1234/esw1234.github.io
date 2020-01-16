// This file will be loaded NOT using require.js and before util.js to reproduce the mismatch anonymous define module error.
// define({});

// NOTE: if you comment out line 2 and include the below line instead the mismatch anonymous define error will be fixed.
define('anon', {});
