var log = require('log');

// Public interface
$.setModel = setModel;

var model;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// A model was passed (see thumbnail.js)
	if (args.model) {
		setModel(args.model);
	}

})(arguments[0] || {});

/**
 * Public method to update the preview with model data
 */
function setModel(val) {
	model = val;

	$.time.text = model.get('time');
	$.picture.image = model.transform().filepath;
}

/**
 * Helper method to create preview actions.
 */
function createActions() {

	var sendAction = Ti.UI.iOS.createPreviewAction({
		title: 'Send per Mail',

		// Wil render a checkmark on the right
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_SELECTED
	});

	sendAction.addEventListener('click', sendPicture);

	var confirmAction = Ti.UI.iOS.createPreviewAction({
		title: 'Confirm',

		// Will render in red
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	confirmAction.addEventListener('click', deletePicture);

	var cancelAction = Ti.UI.iOS.createPreviewAction({
		title: 'Cancel',

		// The default style, so not actually required
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
	});

	// Actions can be grouped
	var deleteActionGroup = Ti.UI.iOS.createPreviewActionGroup({
		title: 'Delete',
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE,
		actions: [confirmAction, cancelAction]
	});

	return [sendAction, deleteActionGroup];
}

/**
 * Event listener for the Send per Mail action
 */
function sendPicture() {
	var dialog = Ti.UI.createEmailDialog({
		subject: model.get('time')
	});
	dialog.addAttachment(Ti.Filesystem.getFile(model.transform().filepath));
	dialog.open();
}

/**
 * Event listener for the Delete > Confirm action
 */
function deletePicture() {

	// Create an applicationShortcuts instance
	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

	// Find the details shortcut
	var detailsShortcut = appShortcuts.getDynamicShortcut('details');

	// If found, check if it's about the picture we want to delete
	if (detailsShortcut && detailsShortcut.userInfo.filename === model.get('filename')) {

		// Remove it
		appShortcuts.removeDynamicShortcut('details');

		log.args('Ti.UI.iOS.ApplicationShortcuts.removeDynamicShortcut', 'details');
	}

	// Delete the actual file
	Ti.Filesystem.getFile(model.transform().filepath).deleteFile();

	// Delete the model (which will update all bound views)
	model.destroy();
}

/**
 * Event listener set in the view for when the user peeks.
 */
function onPeek(e) {
	log.args('Ti.UI.iOS.PreviewContext:peek', e);
}

/**
 * Event listener set in the view for when the user pops.
 */
function onPop(e) {
	log.args('Ti.UI.iOS.PreviewContext:pop', e);

	// Open the details window for this model
	// See pictures.js for the implementation of openDetails()
	Alloy.Globals.openDetails(model);
}