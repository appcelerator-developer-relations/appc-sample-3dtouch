# iOS 9 3D Touch Sample App

This sample app demonstrates the new [3D Touch](http://www.apple.com/iphone-6s/3d-touch/) capabilities of the iPhone 6S. Titanium 5.1 implements [Peek and Pop](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71-SW1) and [Home Screen Quick Actions](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71-SW1). The new [force-properties](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UITouch_Class/index.html#//apple_ref/occ/instp/UITouch/force) available in touch-events will be [added in a later release](https://jira.appcelerator.org/browse/TIMOB-19492) as well as [support for the related Apple Pencil](https://jira.appcelerator.org/browse/TIMOB-19667).

## Force Touch vs 3D Touch
Force Touch was introduced with the [Apple Watch](https://developer.apple.com/watch/human-interface-guidelines/#force-touch) and has later been added to the MacBook and Magic Trackpad for [OS X](https://developer.apple.com/osx/force-touch/). Still, it is two different techniques and 3D Touch is another.

* Apple provides little detail about how Force Touch for Apple Watch exactly works but as a developer it is important that [you do not have direct access to the touch events](https://forums.developer.apple.com/message/5723#5723) and have to implement [Context Menus](https://developer.apple.com/library/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/Menus.html) to which a touch is either *firm* or not. It was even rumored that the Apple Watch measures how the surface of your finger grows as you press with more force.

* The Trackpads however [have four force sensors](http://www.apple.com/macbook/design/) and allow developers to [monitor the exact presure and acceleration](https://developer.apple.com/osx/force-touch/) in OS X.

* The developer experience for 3D Touch on iPhone 6S and 6S Plus is [similar](https://developer.apple.com/ios/3d-touch/) to Force Touch on OS X, but the technique driving it is again different. The screen is now [one big pressure sensor](http://www.apple.com/iphone-6s/3d-touch/) which can measure the exact pressure anywhere.

Why Apple uses two different names for three different techniques is a mistery. We can probably expect the 3D Touch technique to come to Apple Watch 2 and new Trackpacks at which point *Force Touch* would no longer be used.

## Running the Sample
At this moment the iOS Simulator does not let you to simulate 3D Touch events. So to run and test the sample you will need an iPhone 6S to build to.

> **NOTE:** There is a [tweak available](https://github.com/DeskConnect/SBShortcutMenuSimulator) to simulate the Quick Actions in iOS Simulator.

### Via Appcelerator Studio

* Import it via *Dashboard* if available.
* Or import it via *File > Import... > Git > Git Repository as New Project*
	* Select *URI* and enter:

			https://github.com/appcelerator-developer-relations/appc-sample-3dtouch

* Select a device to build to via *Run > Run As*.

### Via CLI

1. Clone the repository:

		git clone https://github.com/appcelerator-developer-relations/appc-sample-ti500

2. To run it with `appc run` first import it to the platform:

		appc new --import --no-services

3. Build to device:

		[appc run | ti build] -p ios -T device

## Quick Actions

There are two ways to define *Quick Actions* or *Application Shortcuts* as the related APIs are called.

### Static shortcuts in `tiapp.xml`

Static shortcuts must be specified in `Info.plist` and work right after the app has installed. In Titanium you will add them to [tiapp.xml](tiapp.xml#L20) under the `ios/plist/dict` element, but apart from that you can just follow the [Apple Reference](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW36).

In the sample app we've [added a Quick Action](tiapp.xml#L20) to select a picture from the device photo gallery to add to the app.

Instead of `UIApplicationShortcutItemIconType` you can also use `UIApplicationShortcutItemIconFile` to use a 35x35dp so-called [Template Image](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/BarIcons.html#//apple_ref/doc/uid/TP40006556-CH21-SW1). The title and subtitle can be localized by using a name you provide strings for via `i18n/<language>/app.xml` - not `strings.xml`.

> **NOTE:** There is a known bug that for static icons you need to find the corresponding hash of the image under `build/iphone/Assets.xcassets`.

We'll come back to how we handle the action later.

### Dynamic shortcuts in JavaScript

Dynamic shortcuts are created via an instance of [Ti.UI.iOS.ApplicationShortcuts](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts), which means they will only be available once you have used these APIs and they can also be removed.

In our sample we create a dynamic shortcut in the [details controller](app/controllers/details.js#L11). We first create an instance of the above API and then use [addDynamicShortcut](https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts-method-addDynamicShortcut).

> **NOTE:** As you can see we first use [Ti.UI.iOS.forceTouchSupported](https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS-property-forceTouchSupported) to test if the OS version and device actually support 3D Touch. The app might crash if you don't!

## TODO

* Thank Ben for shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* Check we need to wait for the camera to close or our preview actions won't work
* Find name for type of image required for icon

## Resources

* Code shortcutitems: https://github.com/appcelerator/titanium_mobile/blob/master/iphone/Classes/TiUIiOSApplicationShortcutsProxy.m
* Docs shortcutitems: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts-method-removeShortcutItem
* PR shortcutitems: https://github.com/appcelerator/titanium_mobile/pull/7236
* Docs previewactions: https://appcelerator.github.io/appc-docs/latest/#!/api/Titanium.UI.iOS.PreviewContext
* PR previewactions: https://github.com/appcelerator/titanium_mobile/pull/7235
* Apple Docs: https://developer.apple.com/library/prerelease/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/index.html#//apple_ref/doc/uid/TP40016543-CH1-SW1