(function constructor(args) {

	var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

	removeShortcut();

	appShortcuts.addShortcutItem({
		type: 'details',
		title: 'Open last picture',
		subtitle: $model.get('time'),

		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19709
		// icon: 'images/shortcutItemIcon.png',
		icon: '6ce9fb071294c440a20ff73b7c09fef2082c2206',

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

	// Or, since details is the only dynamic type, we could also do:
	// appShortcuts.removeAllDynamicShortcuts();
}

function deletePicture() {
	Ti.Filesystem.getFile($model.transform().filepath).deleteFile();

	removeShortcut();

	$model.destroy();

	Alloy.Globals.closeDetails();
}