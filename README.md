# iOS 9 3D Touch Sample App

## TODO

* Thank Ben for shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* How to simulate shortcutitem: https://github.com/DeskConnect/SBShortcutMenuSimulator
	echo 'com.appcelerator.sample.3dtouch' | nc 127.0.0.1 8000
* How to do dynamic shortcutitem: remove/add item for last picture viewed and use image filename as subtitle and image itself (resized) as icon
* We cant store the full path because it changes every time you do a new build to iOS Sim

## Resources

* Code shortcutitems: https://github.com/appcelerator/titanium_mobile/blob/master/iphone/Classes/TiUIiOSApplicationShortcutsProxy.m
* Docs shortcutitems: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts-method-removeShortcutItem
* PR shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* Docs previewactions: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.PreviewContext
* PR previewactions: https://github.com/appcelerator/titanium_mobile/pull/7235
* Apple Docs: https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/index.html#//apple_ref/doc/uid/TP40016543-CH1-SW1