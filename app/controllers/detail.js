/* global $model */

var log = require('log');

// Reference to the activity created so we can invalidate it
var activity;

function onWindowFocus(e) {
	createUserActivity();
}

function onWindowBlur(e) {
	invalidateActivity();
}

function openWebsite() {
	Ti.Platform.openURL($model.get('id'));
}

/**
 * Called when the detail window receives focus to create the user activity and
 * make it the current by calling becomeCurrent()
 */
function createUserActivity() {

	// Make sure any existing activity is invalidated
	invalidateActivity();

	// Parameters for Ti.App.iOS.createUserActivity()
	var parameters = {

		// This value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.spotlight.detail',

		// We'll receive this information when the activity is continued via handoff
		userInfo: {
			id: $model.get('id')
		},

		// This activity can be continued on another device
		eligibleForHandoff: true,

		// Index this activity for Spotlight as well as Siri suggestions
		eligibleForSearch: true,

		// Count this activity as a 'pageview' toward the related web/app content
		eligibleForPublicIndexing: true,

		// Required for eligibleForPublicIndexing, allowing users to open the result in the app
		requiredUserInfoKeys: ['id'],

		// Required for eligibleForPublicIndexing, allowing users to open the result on the website
		// The website should use Markup pointing back to this app for this to work
		webpageURL: $model.get('id')
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Add a content attribute set, just like we did for Spotlight items
	activity.addContentAttributeSet(Ti.App.iOS.createSearchableItemAttributeSet({

		// In particular useful for music which can be played straight from Spotlight search results
		itemContentType: Ti.App.iOS.UTTYPE_PLAIN_TEXT,

		// The information shown in Spotlight search results
		title: $model.get('name'),
		contentDescription: $model.get('bio'),

		// FIXME: It is more efficient to use thumbnailURL (https://jira.appcelerator.org/browse/TIMOB-19467)
		thumbnailData: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, $model.get('image')).read(),

		// Not shown, but used to match results (try 'appsearch')
		keywords: ['beatle', 'spotlight', 'appsearch', 'sample', 'alloy', 'titanium', 'appcelerator'],

		// The ID of the related Spotlight item to enhance result and prevent duplicates
		relatedUniqueIdentifier: $model.get('id')
	}));

	// Check if the user's OS version supports user activities
	if (activity.supported) {

		// Make it the current activity
		activity.becomeCurrent();

	} else {
		alert('UserActivity is not supported');
	}
}

/**
 * Called when the user moves away from the detail window so we can invalidate
 * the user activity. Once invalidated it cannot become current again!
 */
function invalidateActivity() {

	if (!activity) {
		return;
	}

	activity.invalidate();
	activity = null;

	log.args('Ti.App.iOS.UserActivity#detail.invalidate()');
}