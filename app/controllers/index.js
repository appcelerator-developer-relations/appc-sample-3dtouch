var moment = require('alloy/moment');

(function constructor(args) {

	Ti.App.iOS.addEventListener("shortcutitemclick", onShortcutitemclick);

	Alloy.Collections.picture.on('fetch destroy change add remove reset', onCollectionChange);

	Alloy.Collections.picture.fetch();

	Alloy.Globals.nav = $.nav;

	$.nav.open();

})(arguments[0] || {});

function onCollectionChange() {
	$.placeholder.visible = !Alloy.Collections.picture.length;
}

function onShortcutitemclick(e) {

	console.log(e);

	if (true) {
		takePicture();
	}

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
	var filename = moment().format() + '.jpg';

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filename);
	file.write(picture);

	Alloy.Collections.picture.create({
		filename: filename,
		filepath: file.nativePath
	});
}