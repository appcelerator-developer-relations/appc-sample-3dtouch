/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// We've allready called fetch() in pictures.js and instead of doing
	// this again we simply call the data-binding method we've given a name
	// in the view manually.
	bindData();

})(arguments[0] || {});