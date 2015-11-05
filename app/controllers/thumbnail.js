/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	if (Ti.UI.iOS.forceTouchSupported) {

		var previewContext = Alloy.createController('preview', {

			// Because we are required within a data-bound view we are passed
			// the model as $model. We pass it on to the previewContext.
			// Since we create the context for each thumbnail we don't need
			// the peek-event like in list.js to update the view.
			model: $model

		}).getView();

		$.imageView.previewContext = previewContext;
	}

})(arguments[0] || {});

function onThumbnailClick() {

	// The item's special itemId property is the model ID we need
	// See pictures.js for the implementation of openDetails()
	Alloy.Globals.openDetails($model);
}