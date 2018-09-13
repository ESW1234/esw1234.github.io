'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function containsMatch(collection, predicate) {
    // Could also use _.filter(collection, predicate).length > 0
    // but _.find() returns the first match.
    return (_.find(collection, predicate) !== undefined);
}
exports.containsMatch = containsMatch;
//# sourceMappingURL=moreLodash.js.map