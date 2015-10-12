var log = require('log');

var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

(function constructor(args) {

	removeDetailsShortcut();

	var params = {
		type: 'details',
		title: 'Open last picture',
		subtitle: $model.get('time'),

		// FIXME: https://jira.appcelerator.org/browse/TIMOB-19709
		// icon: 'images/shortcutItemIcon.png',
		icon: '6ce9fb071294c440a20ff73b7c09fef2082c2206',

		userInfo: {
			filename: $model.get('filename')
		}
	};

	appShortcuts.addShortcutItem(params);

	log.args('Ti.UI.iOS.ApplicationShortcuts.addShortcutItem', params);

})(arguments[0] || {});

function removeDetailsShortcut() {

	// When called from deletePicture() we don't need to check the userInfo
	// !!!!!!!!! Remove the details shortcutItem we've added in the constructor

	var params = {
		type: 'details'
	};

	appShortcuts.removeShortcutItem(params);

	log.args('Ti.UI.iOS.ApplicationShortcuts.removeShortcutItem', params);
}

function deletePicture() {
	removeDetailsShortcut();

	Ti.Filesystem.getFile($model.transform().filepath).deleteFile();

	$model.destroy();

	Alloy.Globals.closeDetails();
}

function onWindowClose() {
	Alloy.Globals.detailsWindow = null;
}