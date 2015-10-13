# iOS 9 3D Touch Sample App

## TODO

* Thank Ben for shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* How to simulate shortcutitem: https://github.com/DeskConnect/SBShortcutMenuSimulator
	IN THAT DIR!
	echo 'com.appcelerator.sample.3dtouch' | nc 127.0.0.1 8000
* How to do dynamic shortcutitem: remove/add item for last picture viewed and use image filename as subtitle and image itself (resized) as icon
* We cant store the full path because it changes every time you do a new build to iOS Sim

## Getting the sample

### Appcelerator Studio

* Import it via *Dashboard* if available.
* Import it via *File > Import... > Git > Git Repository as New Project*
	* Select *URI*
	* Enter `https://github.com/appcelerator-developer-relations/appc-sample-ti500`

### CLI

1. Clone the repository:

		git clone https://github.com/appcelerator-developer-relations/appc-sample-ti500

2. To run it with `appc run` first import it to the platform:

		appc new --import --no-services

## Resources

* Code shortcutitems: https://github.com/appcelerator/titanium_mobile/blob/master/iphone/Classes/TiUIiOSApplicationShortcutsProxy.m
* Docs shortcutitems: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts-method-removeShortcutItem
* PR shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* Docs previewactions: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.PreviewContext
* PR previewactions: https://github.com/appcelerator/titanium_mobile/pull/7235
* Apple Docs: https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/index.html#//apple_ref/doc/uid/TP40016543-CH1-SW1