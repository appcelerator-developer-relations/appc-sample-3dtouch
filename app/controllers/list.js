var moment = require('alloy/moment');

var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// If supported, listen to the event that fires when a app shortcut has been tapped on
	if (Ti.UI.iOS.forceTouchSupported) {
		Ti.App.iOS.addEventListener('shortcutitemclick', onShortcutitemclick);
	}

	// Listen to collection changes
	Alloy.Collections.picture.on('fetch destroy change add remove reset', onCollectionChange);

	// Fetch collection models via its adapter (see models/picture.js)
	Alloy.Collections.picture.fetch();

	// Expose global helper methods to close a previous detailsWindow before we open a new one
	// Tabs don't have a pop-to-root method we can use for this
	Alloy.Globals.openDetails = openDetails;
	Alloy.Globals.closeDetails = closeDetails;

})(arguments[0] || {});

/**
 * Event listener for taps on app shortcut items
 */
function onShortcutitemclick(e) {

	log.args('Ti.App.iOS:shortcutitemclick', e);

	// The static shortcut we've set in tiapp.xml
	if (e.itemtype === 'add') {
		addPicture();

		// The dynamic shortcut we set in details.js
	} else if (e.itemtype === 'details') {

		// Get the modelId from the shortcut item payload
		var modelId = e.userInfo.filename;

		// Get the model
		var model = Alloy.Collections.picture.get(modelId);

		// The model no longer exist
		if (!model) {
			return alert('Picture not found: ' + e.userInfo.filename);
		}

		// Create the detail window and open it via our helper
		Alloy.Globals.openDetails(model);
	}

	// Activate our
	$.tab.active = true;
}

/**
 * Event listener for changes to the collection
 */
function onCollectionChange() {

	// Show the placeholder when the collection is empty (!0 === true)
	$.placeholder.visible = !Alloy.Collections.picture.length;
}

/**
 * Event listener set in list.xml for the '+' button
 */
function addPicture() {

	Ti.Media.openPhotoGallery({
		mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
		success: function(e) {

			// FIXME: https://jira.appcelerator.org/browse/TIMOB-19764
			// We need to wait for the photo gallery to close or our preview actions won't work
			setTimeout(function() {

				// Create a unique filename
				var filename = Ti.Platform.createUUID() + '.jpg';

				// Create the file under the applicationDataDirectory
				var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);

				// Write a square version of the selected media to the file
				file.write(e.media.imageAsThumbnail(e.media.width));

				// Add the model to the collection
				Alloy.Collections.picture.create({

					// Set the time the picture was added
					time: moment().format(),

					// Set the filename (the full path changes between builds)
					filename: filename
				});

			}, 500);
		},
		error: function(e) {
			alert(e.error || 'Unknown Error');
		}
	});
}

/**
 * Global helper to open a detailsWindow but first close the previous.
 * Tabs don't have a pop-to-root method we can use for this.
 */
function openDetails(model) {

	// Close the current detailsWindow, if any
	Alloy.Globals.closeDetails();

	// Create a new details controller and reference its view
	Alloy.Globals.detailsWindow = Alloy.createController('details', {
		$model: model
	}).getView();

	// Open it under the tab
	$.tab.openWindow(Alloy.Globals.detailsWindow);
}

/**
 * Global helper to close the detailsWindow, if any
 */
function closeDetails() {

	if (Alloy.Globals.detailsWindow) {
		$.tab.closeWindow(Alloy.Globals.detailsWindow);
	}
}