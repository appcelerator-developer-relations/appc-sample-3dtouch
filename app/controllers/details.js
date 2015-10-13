var log = require('log');

var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

(function constructor(args) {

	removeDetailsShortcut();

	var params = {
		itemtype: 'details',
		title: 'Open last picture',
		subtitle: $model.get('time'),

		// actual: 6ce9fb071294c440a20ff73b7c09fef2082c2206

		icon: '/images/shortcutItemIcon.png',
		userInfo: {
			filename: $model.get('filename')
		}
	};

	appShortcuts.addDynamicShortcut(params);

	log.args('Ti.UI.iOS.ApplicationShortcuts.addDynamicShortcut', params);

})(arguments[0] || {});

function removeDetailsShortcut() {

	// When called from deletePicture() we don't need to check the userInfo
	// !!!!!!!!! Remove the details shortcutItem we've added in the constructor

	appShortcuts.removeDynamicShortcut('details');

	log.args('Ti.UI.iOS.ApplicationShortcuts.removeDynamicShortcut', 'details');
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