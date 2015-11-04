/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	if (Ti.UI.iOS.forceTouchSupported) {
		
		var previewCtrl = Alloy.createController('preview', {
			model: $model
		});

		var previewContext = previewCtrl.getContext();

		$.imageView.previewContext = previewContext;
	}

})(arguments[0] || {});

function onThumbnailClick() {
	Alloy.Globals.openDetails($model);
}