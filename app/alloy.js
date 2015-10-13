// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

(function(global) {

	// FIXME: 25% does not have the same result
	Alloy.Globals.thumbnailSize = Ti.Platform.displayCaps.platformWidth / 4;

	var versions = Ti.version.split('.');
	Alloy.Globals.isSupported = (parseInt(versions[0], 10) >= 5 && parseInt(versions[1], 10) >= 1 && Ti.UI.iOS.forceTouchSupported);

})(this);
