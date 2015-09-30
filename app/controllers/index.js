/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
 (function constructor(args) {

 	if (Alloy.Globals.TI_VERSION < 5) {
 		return alert('This sample requires Titanium 5 or later.');
 	}

	$.index.open();

})(arguments[0] || {});