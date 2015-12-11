# iOS 9 3D Touch Sample App

> **NOTE:** This Sample App requires Titanium 5.1.0, Alloy 1.7.26 and AppC CLI Core Package 5.1.0 or later. It also requires iOS 9 and an iPhone 6S device or later.

This sample app demonstrates the new [3D Touch](http://www.apple.com/iphone-6s/3d-touch/) capabilities of the iPhone 6S. Titanium 5.1 implements [Peek and Pop](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71-SW1) and [Home Screen Quick Actions](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html#//apple_ref/doc/uid/TP40006556-CH71-SW1). The new [force-properties](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UITouch_Class/index.html#//apple_ref/occ/instp/UITouch/force) available in touch-events will be [added in a later release](https://jira.appcelerator.org/browse/TIMOB-19492) as well as [support for the related Apple Pencil](https://jira.appcelerator.org/browse/TIMOB-19667).

![screenshots](docs/screencast.gif)

## Force Touch vs 3D Touch
Force Touch was introduced with the [Apple Watch](https://developer.apple.com/watch/human-interface-guidelines/#force-touch) and has later been added to the MacBook and Magic Trackpad for [OS X](https://developer.apple.com/osx/force-touch/). Still, these devices use two different techniques and 3D Touch is yet another.

* Apple provides little detail about how Force Touch for Apple Watch exactly works, but as a developer it is important that [you do not have direct access to the touch events](https://forums.developer.apple.com/message/5723#5723) and have to implement [Context Menus](https://developer.apple.com/library/ios/documentation/General/Conceptual/WatchKitProgrammingGuide/Menus.html) to which a touch is either *firm* or not. It was even rumored that the Apple Watch measures how the surface of your finger grows as you press with more force.

* The Trackpads however [have four force sensors](http://www.apple.com/macbook/design/) and allow developers to [monitor the exact pressure and acceleration](https://developer.apple.com/osx/force-touch/) in OS X.

* The developer experience for 3D Touch on iPhone 6S and 6S Plus is [similar](https://developer.apple.com/ios/3d-touch/) to Force Touch on OS X, but the technique driving it is again different. The screen is now [one big pressure sensor](http://www.apple.com/iphone-6s/3d-touch/) which can measure the exact pressure anywhere.

Why Apple uses two different names for three different techniques is a mystery. We can probably expect the 3D Touch technique to come to Apple Watch 2 and new Trackpads at which point *Force Touch* would no longer be used.

## Running the Sample
At this moment, the iOS Simulator does not let you to simulate 3D Touch events. So to run and test the sample you will need an iPhone 6S to build to.

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

Press firmly on the app icon to reveal the static *Quick Actions* or *Application Shortcuts*. Once you've used the app add and then view a picture, you will also see the dynamic shortcut:

![shortcuts](docs/shortcuts.png)

### Static shortcuts

Static shortcuts must be specified in `Info.plist` and work right after the app has installed. In Titanium you will add them to [tiapp.xml](tiapp.xml#L21) under the `ios/plist/dict` element, but apart from that you can just follow the [Apple Reference](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW36).

In the sample app we've [added a Quick Action](tiapp.xml#L24) to select a picture from the device photo gallery to add to the app.

Instead of `UIApplicationShortcutItemIconType` you can also use `UIApplicationShortcutItemIconFile` to use a 35x35dp so-called [Template Icon](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/BarIcons.html#//apple_ref/doc/uid/TP40006556-CH21-SW1). The title and subtitle can be localized by using a name you provide strings for via `i18n/<language>/app.xml` - not `strings.xml`.

> **NOTE:** To use custom template icons the image must be in an asset catalog. This is an optional feature in 5.1.0 that can be enabled by `<use-app-thinning>true</use-app-thinning>` under the `ios` element in [tiapp.xml](tiapp.xml#L18).

> **NOTE:** It is a [known issue](https://jira.appcelerator.org/browse/CLI-845) that to use a custom template icon for static shortcuts you need to find the corresponding hash of the image found under `build/iphone/Assets.xcassets`.

We'll come back to how we handle the action later.

### Dynamic shortcuts

Dynamic shortcuts are created via an instance of [Ti.UI.iOS.ApplicationShortcuts](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts), which means they will only be available once you have used these APIs and they can also be removed.

In our sample we create a dynamic shortcut for the last-viewed picture in the [details controller](app/controllers/details.js#L11). We first create an instance of the above API and then use [addDynamicShortcut](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts-method-addDynamicShortcut). The params are similar to the static shortcuts, with the exception of [icon](https://docs.appcelerator.com/platform/latest/#!/api/ShortcutParams-property-icon) which can be either the path to a Template Icon or one of the `Ti.UI.iOS.SHORTCUT_ICON_TYPE_*` constants.

> **NOTE:** As you can see, we first use [Ti.UI.iOS.forceTouchSupported](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS-property-forceTouchSupported) to test if the OS version and device actually support 3D Touch. The app might crash if you don't!

When a picture gets deleted from the app we use the different APIs also demonstrated in the [api controller](app/controllers/api.js) to also remove the shortcut if it happened to be the last one we've viewed. You'll find this code in the [thumbnail](app/controllers/thumbnail.js#L65) and [details](app/controllers/details.js#L61) controllers.

### Handling Quick Actions
When the user taps a Quick Action, the [Ti.App.iOS:shortcutitemclick](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.App.iOS-event-shortcutitemclick) event is fired. The payload includes all properties you have set static or dynamic shortcut except the icon. Simply use `itemtype` to identify the shortcut and act accordingly.

In our sample app we're listening to the event in the [pictures controller](app/controllers/pictures.js#L19). For the dynamic details-shortcut you can see we're using the custom `userInfo` payload to get the actual model ID of the last-viewed picture.

## Peek & Pop
Press firmly on one of the thumbnails in the sample app to play with Peek and Pop. As you start applying more force the rest of the screen will blur, then a preview will appear and finally the details window will open. Swipe up while you Peek to reveal any quick actions available. As you use it more often you will get a feel for the amount of pressure needed to trigger Peek directly.

![preview](docs/preview.png)

### PreviewContext
To add Peek & Pop to a individual view or a List/Table View, create an instance of [Ti.UI.iOS.createPreviewContext](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS-method-createPreviewContext) and set it to the view's [previewContext](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.View-property-previewContext) property. When used in a List/Table View you need to listen to the PreviewContext's [peek](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-event-peek) event and update the view set to its `preview` property.

### Sample
Use the top-left icon on the *Pictures* tab to switch between thumbnails that each individually have a preview context and a ListView where all items share a preview context.

For both views we create the previewContext in [preview.xml](app/views/preview.xml). As from Alloy 1.7.25 and AppC CLI Core Package 5.1.0 you can define these in XML. In classic this would look like:

	$.previewContext = Ti.UI.iOS.createPreviewContext({
		contentHeight: 400,
		preview: $.preview,
		actions: createActions()
	});
	$.previewContext.addEventListener('peek', onPeek);
	$.previewContext.addEventListener('pop', onPop);

* The preview showed during Peek is simply a Titanium View you assign to the [preview](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-property-preview) property. Use the previewContext's [contentHeight](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-property-contentHeight) property to enable rounded corners and not have the view take up all available height.

* Listen to the [peek](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-event-peek) event to update a shared preview when it is about to be displayed for a specific item. The event payload has the `sectionIndex`, `itemIndex` and optional `itemId` you need to do so.

* To pop you add an event listener to the [pop](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-event-pop) event. It has the same payload as `peek`. In our sample we just open the [details view](app/views/details.xml) via the helper method exposed in the [list controller](app/controllers/list.js#L26).

* Finally an array of Quick Actions can be assigned to the [actions](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext-property-actions) property. These can also be [grouped](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewActionGroup) and the samples demonstrates both, as well as the different styles available.

## Credits

A special thanks to community member Ben Bahrenburg for [his initial implementation](https://github.com/appcelerator/titanium_mobile/pull/7236) of the Quick Actions. Appcelerator engineer Hans Knöchel implemented Peek and Pop and did the initial version of this sample.

## Links

* Titanium API reference: [Ti.UI.iOS.ApplicationShortcuts](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.ApplicationShortcuts)
* Titanium API reference: [Ti.UI.iOS.PreviewContext](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.PreviewContext)
* Apple Human Interface Guidelines: [3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/3DTouch.html)
* Apple Documentation: [Getting Started with 3D Touch](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/Adopting3DTouchOniPhone/index.html)
