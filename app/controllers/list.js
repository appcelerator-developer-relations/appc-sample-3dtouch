var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// We've allready called fetch() in pictures.js and instead of doing
	// this again we simply call the data-binding method we've given a name
	// in the view manually.
	bindData();

	// For ListView and TableView the previewContext is added to the list
	// instead of every single item/row.
	if (Ti.UI.iOS.forceTouchSupported) {

		// Get the previewContext and its controller
		var previewCtrl = Alloy.createController('preview');
		var previewContext = previewCtrl.getView();

		// Since all items share the same preview we need to listen to the peek event
		previewContext.addEventListener('peek', function(e) {

			// Which contains the item's sectionIndex, itemIndex and optional itemId
			// that we can use to look up the data
			var model = Alloy.Collections.picture.get(e.itemId);

			// And update the preview accordingly (see previewContext.js)
			previewCtrl.setModel(model);
		});

		$.listView.previewContext = previewContext;
	}

})(arguments[0] || {});

/**
 * Event listener set in the view for when user taps on an item
 */
function onItemclick(e) {
	log.args('Ti.UI.ListView:itemclick', e);

	// The item's special itemId property is the model ID we need
	// See pictures.js for the implementation of openDetails()
	Alloy.Globals.openDetails(e.itemId);
}