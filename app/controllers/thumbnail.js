(function constructor(args) {

	if (Ti.UI.iOS.forceTouchSupported) {

		var previewContext = Ti.UI.iOS.createPreviewContext({
			preview: createPreview(),
			actions: createActions(),
			contentHeight: 400,
			pop: openDetails
		});

		imageView.setPreviewContext(previewContext);
	}

})(arguments[0] || {});

function createPreview() {
	return Alloy.createController("preview", {
		$model: $model
	}).getView();
}

function createActions() {

	var sendAction = Ti.UI.iOS.createPreviewAction({
		title: "Send per Mail",
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
	});

	sendAction.addEventListener("click", sendPicture);

	var confirmAction = Ti.UI.iOS.createPreviewAction({
		title: "Confirm",
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	var cancelAction = Ti.UI.iOS.createPreviewAction({
		title: "Cancel"
	});

	var deleteAction = Ti.UI.iOS.createPreviewActionGroup({
		title: "Delete",
		actions: [confirmAction, cancelAction],
		style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	confirmAction.addEventListener("click", deletePicture);

	return [sendAction, deleteAction];
}

function sendPicture() {
	var dialog = Ti.UI.createEmailDialog({
		subject: $model.get('time')
	});
	dialog.addAttachment(Ti.Filesystem.getFile($model.transform().filepath));
	dialog.open();
}

function deletePicture() {

	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();
	var dynamicShortcuts = appShortcuts.listDynamicShortcuts();

	var detailsShortcut = _.find(dynamicShortcuts, function(shortcut) {
		return shortcut.type === 'details';
	});

	if (detailsShortcut && detailsShortcut.userInfo.filename === $model.get('filename')) {

		var params = {
			type: 'details'
		};

		// Remove the existing details shortcut item
		appShortcuts.removeShortcutItem(params);

		log.args('Ti.UI.iOS.ApplicationShortcuts.removeShortcutItem', params);
	}

	Ti.Filesystem.getFile($model.transform().filepath).deleteFile();

	$model.destroy();
}

function openDetails() {
	Alloy.Globals.openDetails(Alloy.createController("details", {
		$model: $model
	}).getView());
}