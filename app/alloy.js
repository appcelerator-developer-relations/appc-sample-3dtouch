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

(function (global) {

	var NUMBER_OF_COLUMNS = 4; // Change this to whatever you want

	Alloy.Globals.TI_VERSION = parseInt(Ti.version.split('.')[0], 10);
	Alloy.Globals.imageWidth = Alloy.Globals.imageHeight = (Ti.Platform.displayCaps.platformWidth / NUMBER_OF_COLUMNS);// - (2 * NUMBER_OF_COLUMNS);

	Alloy.Globals.contentWidth = Ti.Platform.displayCaps.platformWidth;
	Alloy.Globals.contentHeight = Ti.Platform.displayCaps.platformHeight-65;
})(this);
