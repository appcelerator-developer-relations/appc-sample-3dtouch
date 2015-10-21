var log = require('log');

var appShortcuts;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// If supported, create an applicationShortcuts instance
	if (Ti.UI.iOS.forceTouchSupported) {
		appShortcuts = Ti.UI.iOS.createApplicationShortcuts();
	}

})(arguments[0] || {});

/**
 * Event handler set in view to list all static shortcuts
 */
function listStaticShortcuts() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	log.args('Ti.UI.iOS.ApplicationShortcuts.listStaticShortcuts', appShortcuts.listStaticShortcuts());
}

/**
 * Event handler set in view to list all dynamic shortcuts
 */
function listDynamicShortcuts() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	var res = appShortcuts.listDynamicShortcuts();

	log.args('Ti.UI.iOS.ApplicationShortcuts.listDynamicShortcuts', res);

	// If don't have any, explain how to create it
	if (res.length === 0) {
		Ti.UI.createAlertDialog({
			title: 'None',
			message: 'Open a picture to create a dynamic shortcut.'
		}).show();
	}
}

/**
 * Event handler set in view to check if our dynamic shortcut exists
 */
function dynamicShortcutExists() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	var res = appShortcuts.dynamicShortcutExists('details');

	log.args('Ti.UI.iOS.ApplicationShortcuts.dynamicShortcutExists', 'details', res);

	// If don't have it, explain how to create it
	if (!res) {
		Ti.UI.createAlertDialog({
			title: 'Does not exist',
			message: 'Open a picture to create a dynamic shortcut.'
		}).show();
	}
}

/**
 * Event handler set in view to get our dynamic shortcut
 */
function getDynamicShortcut() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	var res = appShortcuts.getDynamicShortcut('details');

	log.args('Ti.UI.iOS.ApplicationShortcuts.getDynamicShortcut', 'details', res);

	// If don't have it, explain how to create it
	if (!res) {
		Ti.UI.createAlertDialog({
			title: 'Does not exist',
			message: 'Open a picture to create a dynamic shortcut.'
		}).show();
	}
}

/**
 * Event handler set in view to remove our dynamic shortcut
 */
function removeDynamicShortcut() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	appShortcuts.removeDynamicShortcut('details');

	// Explain how to (re)create it
	Ti.UI.createAlertDialog({
		title: 'Removed',
		message: 'Open a picture to create a new dynamic shortcut.'
	}).show();
}

/**
 * Event handler set in view to remove all dynamic shortcuts
 */
function removeAllDynamicShortcuts() {

	if (!appShortcuts) {
		return alert('This device does not support Force Touch');
	}

	appShortcuts.removeAllDynamicShortcuts();

	// Explain how to create our dynamic shortcut
	Ti.UI.createAlertDialog({
		title: 'Removed',
		message: 'Open a picture to create a new dynamic shortcut.'
	}).show();
}