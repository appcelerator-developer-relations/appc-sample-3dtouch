(function constructor(args) {

	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

	removeShortcut();

	appShortcuts.addShortcutItem({
		type: 'details',
		title: 'Open last picture',
		subtitle: $model.get('time'),
		icon: '/images/shortcutItemIcon.png',
		userInfo: {
			filename: $model.get('filename')
		}
	});

})(arguments[0] || {});

function removeShortcut() {
	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

	// This check is not required, just here as example
	if (appShortcuts.dynamicShortcutExists({
			type: 'details'
		})) {

		// Remove the existing details shortcut item
		appShortcuts.removeShortcutItem({
			type: 'details'
		});
	}
}

function deletePicture() {
	Ti.Filesystem.getFile($model.transform().filepath).deleteFile();

	removeShortcut();

	$model.destroy();

	Alloy.Globals.closeDetails();
}