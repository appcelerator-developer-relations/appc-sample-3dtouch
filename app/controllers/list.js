var moment = require('alloy/moment');

var log = require('log');

(function constructor(args) {

	Ti.App.iOS.addEventListener("shortcutitemclick", onShortcutitemclick);

	Alloy.Collections.picture.on('fetch destroy change add remove reset', onCollectionChange);

	Alloy.Collections.picture.fetch();

	Alloy.Globals.openDetails = openDetails;
	Alloy.Globals.closeDetails = closeDetails;

})(arguments[0] || {});

function onShortcutitemclick(e) {

	log.args('Ti.App.iOS:shortcutitemclick', e);

	if (e.itemtype === 'NewPhoto') {
		takePicture();

	} else if (e.itemtype === 'details') {

		var model = Alloy.Collections.picture.get(e.userInfo.filename);

		if (!model) {
			return alert('Picture not found: ' + e.userInfo.filename);
		}

		Alloy.Globals.openDetails(Alloy.createController("details", {
			$model: model
		}).getView());
	}

	$.tab.active = true;
}

function onCollectionChange() {
	$.placeholder.visible = !Alloy.Collections.picture.length;
}

function takePicture() {

	// in iOS Simulator, select existing photo instead
	var fn = Ti.Media.isCameraSupported ? 'showCamera' : 'openPhotoGallery';

	Ti.Media[fn]({
		allowEditing: true,
		success: function(e) {
			addPicture(e.media);
		}
	});
}

function addPicture(picture) {
	var filename = Ti.Platform.createUUID() + '.jpg';
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
	file.write(picture);

	Alloy.Collections.picture.create({
		time: moment().format(),
		filename: filename
	});
}

function openDetails(window) {

	closeDetails();

	Alloy.Globals.detailsWindow = window;

	$.tab.openWindow(Alloy.Globals.detailsWindow);
}

function closeDetails() {

	if (Alloy.Globals.detailsWindow) {
		$.tab.closeWindow(Alloy.Globals.detailsWindow);
	}
}