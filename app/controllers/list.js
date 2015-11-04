var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	bindData();

	if (Ti.UI.iOS.forceTouchSupported) {

		var previewCtrl = Alloy.createController('preview');

		var previewContext = previewCtrl.getContext();

		previewContext.addEventListener('peek', function(e) {
			var model = Alloy.Collections.picture.get(e.itemId);

			previewCtrl.setModel(model);
		});

		$.listView.previewContext = previewContext;
	}

})(arguments[0] || {});

function onItemclick(e) {
	log.args('Ti.UI.ListView:itemclick', e);

	Alloy.Globals.openDetails(e.itemId);
}