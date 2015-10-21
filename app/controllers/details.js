var log = require('log');

var appShortcuts;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// If supported..
	if (Ti.UI.iOS.forceTouchSupported) {

		// Create an applicationShortcuts instance
		appShortcuts = Ti.UI.iOS.createApplicationShortcuts();
		
		// Remove the details shortcut
		removeDetailsShortcut();

		// Add the details shortcut
		var params = {

			// Must be unique to identify it in the shortcutitemclick-listener in list.js
			itemtype: 'details',

			title: 'Open last picture',
			subtitle: $model.get('time'),

			// A grey-scale icon of 35x35dp
			icon: 'images/shortcutItemIcon.png',

			// A custom payload
			userInfo: {
				filename: $model.get('filename')
			}
		};

		appShortcuts.addDynamicShortcut(params);

		log.args('Ti.UI.iOS.ApplicationShortcuts.addDynamicShortcut', params);
	}

})(arguments[0] || {});

/**
 * Helper used in the constructor and deletePicture() to remove the details shortcut
 */
function removeDetailsShortcut() {

	// Other than in list.js we don't need to check the userInfo.filename
	// since we will replace it if we're called from the constructor or it
	// is the one we created there and now remove in deletePicture()
	appShortcuts.removeDynamicShortcut('details');

	log.args('Ti.UI.iOS.ApplicationShortcuts.removeDynamicShortcut', 'details');
}

/**
 * Event listener set in the view to delete this picture
 */
function deletePicture() {

	// If supported, remove the details shortcut we created in the constructor
	if (appShortcuts) {
		removeDetailsShortcut();
	}

	// Delete the actual file
	Ti.Filesystem.getFile($model.transform().filepath).deleteFile();

	$model.destroy();

	// Use the global method set in list.js to close our window
	Alloy.Globals.closeDetails();
}

/**
 * Event listener set in the view for when our window is closed
 */
function onWindowClose() {

	// Null the global reference to the current detailsWindow so
	// that closeDetails() in list.js won't try to close it twice
	Alloy.Globals.detailsWindow = null;
}