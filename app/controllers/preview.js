var log = require('log');

// Public interface
$.getContext = getContext;
$.setModel = setModel;

var model;
var context;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	if (args.model) {
		setModel(args.model);
	}

})(arguments[0] || {});

function setModel(val) {
	model = val;

	$.time.text = model.get('time');
	$.picture.image = model.transform().filepath;
}

function getContext() {

	if (context) {
		return context;
	}

	context = Ti.UI.iOS.createPreviewContext({
		preview: $.getView(),
		actions: createActions(),

		// If you leave this undefined it will use all available height
		// It will also no longer apply a border radius to the view
		contentHeight: 400
	});

	context.addEventListener('peek', function(e) {
		log.args('Ti.UI.iOS.PreviewContext:peek', e);
	});

	context.addEventListener('pop', function(e) {
		log.args('Ti.UI.iOS.PreviewContext:pop', e);

		openDetails();
	});

	return context;
}

function createActions() {

	var sendAction = Ti.UI.iOS.createPreviewAction({
		title: 'Send per Mail',
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
	});

	sendAction.addEventListener('click', sendPicture);

	var confirmAction = Ti.UI.iOS.createPreviewAction({
		title: 'Confirm',
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	var cancelAction = Ti.UI.iOS.createPreviewAction({
		title: 'Cancel'
	});

	var deleteAction = Ti.UI.iOS.createPreviewActionGroup({
		title: 'Delete',
		actions: [confirmAction, cancelAction],
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	confirmAction.addEventListener('click', deletePicture);

	return [sendAction, deleteAction];
}

function sendPicture() {
	var dialog = Ti.UI.createEmailDialog({
		subject: model.get('time')
	});
	dialog.addAttachment(Ti.Filesystem.getFile(model.transform().filepath));
	dialog.open();
}

function deletePicture() {
	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();
	var detailsShortcut = appShortcuts.getDynamicShortcut('details');

	if (detailsShortcut && detailsShortcut.userInfo.filename === model.get('filename')) {

		// Remove the existing details shortcut item
		appShortcuts.removeDynamicShortcut('details');

		log.args('Ti.UI.iOS.ApplicationShortcuts.removeDynamicShortcut', 'details');
	}

	Ti.Filesystem.getFile(model.transform().filepath).deleteFile();

	model.destroy();
}

function openDetails() {
	Alloy.Globals.openDetails(model);
}