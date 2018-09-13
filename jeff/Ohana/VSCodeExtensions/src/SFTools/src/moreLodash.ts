'use strict';

import * as _ from 'lodash';


export function containsMatch<T extends object>(
	collection: T | null | undefined,
	predicate?: _.ObjectIterateeCustom<T, boolean>): boolean {

	// Could also use _.filter(collection, predicate).length > 0
	// but _.find() returns the first match.
	return (_.find(collection, predicate) !== undefined);
}
