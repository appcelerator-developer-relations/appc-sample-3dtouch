var log = require('log');

// Reference to the current detail window so we can close it
var currentDetailWindow;

// Reference to our activity so we can invalidate it
var activity;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	if (Alloy.Globals.TI_VERSION < 5) {
		return;
	}

	populateCollection();

	// Add the Beatles to Spotlight
	addToIndex();

	// Listen to the event that will fire when uses handoff or opens a Spotlight search result
	Ti.App.iOS.addEventListener('continueactivity', onContinueactivity);

})(arguments[0] || {});

/**
 * Helper function to populate the collection. We need to do this every time we
 * open the app because its a model with no sync adapter, just used for data-binding.
 */
function populateCollection() {
	$.collection.reset([{
		id: 'https://en.wikipedia.org/wiki/John_Lennon',
		name: 'John Lennon',
		bio: 'John Winston Ono Lennon MBE (born John Winston Lennon; 9 October 1940 – 8 December 1980) was an English singer and songwriter who rose to worldwide fame as a co-founder of the band the Beatles, the most commercially successful band in the history of popular music. With Paul McCartney, he formed a celebrated songwriting partnership.',
		image: '/images/john.jpg'
	}, {
		id: 'https://en.wikipedia.org/wiki/Paul_McCartney',
		name: 'Paul McCartney',
		bio: 'Sir James Paul McCartney MBE (born 18 June 1942) is an English singer-songwriter, multi-instrumentalist, and composer. With John Lennon, George Harrison, and Ringo Starr, he gained worldwide fame as the bassist of the English rock band the Beatles, one of the most popular and influential groups in the history of pop music; his songwriting partnership with Lennon is one of the most celebrated of the 20th century. After the band\'s break-up, he pursued a solo career and formed Wings with his first wife, Linda, and Denny Laine.',
		image: '/images/paul.jpg'
	}, {
		id: 'https://en.wikipedia.org/wiki/George_Harrison',
		name: 'George Harrison',
		bio: 'George Harrison,[nb 1] MBE (25 February 1943 – 29 November 2001) was an English musician, multi-instrumentalist, singer and songwriter and music and film producer who achieved international fame as the lead guitarist of the Beatles. Although John Lennon and Paul McCartney were the band\'s primary songwriters, most of their albums included at least one Harrison composition, including "While My Guitar Gently Weeps", "Here Comes the Sun" and "Something", which became the Beatles\' second-most-covered song.',
		image: '/images/george.jpg'
	}, {
		id: 'https://en.wikipedia.org/wiki/Ringo_Starr',
		name: 'Ringo Starr',
		bio: 'Richard Starkey,[2]` MBE (born 7 July 1940), known professionally as Ringo Starr, is an English musician and actor who gained worldwide fame as the drummer for the Beatles. He occasionally sang lead vocals, usually for one song on an album, including "With a Little Help from My Friends", "Yellow Submarine" and their cover of "Act Naturally". He also wrote the Beatles\' songs "Don\'t Pass Me By" and "Octopus\'s Garden", and is credited as a co-writer of others, such as "What Goes On" and "Flying".',
		image: '/images/ringo.jpg'
	}]);
}

/**
 * Helper function and event listener to the leftNav-add-Button.
 * It will add all individual Beatles to the Spotlight index.
 */
function addToIndex() {

	// Create an instance of the index
	var searchableIndex = Ti.App.iOS.createSearchableIndex();

	// Check if Spotlight is supported (since iOS 9)
	if (!searchableIndex.isSupported()) {
		return alert('Ti.App.iOS.SearchableIndex requires iOS 9');
	}

	// Collect all items we'll create
	var searchableItems = [];

	// Walk through all Beatle models
	$.collection.each(function (model) {

		// Create a set of attributes describing this item
		var searchableItemAttributeSet = Ti.App.iOS.createSearchableItemAttributeSet({

			// In particular useful for music which can be played straight from Spotlight search results
			itemContentType: Ti.App.iOS.UTTYPE_PLAIN_TEXT,

			// The information shown in Spotlight search results
			title: model.get('name'),
			contentDescription: model.get('bio'),

			// FIXME: It is more efficient to use thumbnailURL (https://jira.appcelerator.org/browse/TIMOB-19467)
			thumbnailData: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, model.get('image')).read(),

			// Not shown, but used to match results (try 'appsearch')
			keywords: ['beatle', 'appsearch', 'sample', 'alloy', 'titanium', 'appcelerator']
		});

		// Create the actual item we want to index
		var searchableItem = Ti.App.iOS.createSearchableItem({

			// Used to uniquely identify this item within the app (group)
			uniqueIdentifier: model.get('id'),

			// Optional identifier for a group which you might want to delete all at once
			// Should be a reserve domain-type content type
			domainIdentifier: 'com.appcelerator.sample.spotlight.beatle',

			// The set of attributes we created above
			attributeSet: searchableItemAttributeSet
		});

		searchableItems.push(searchableItem);
	});

	// Add the searchable items to the index and provide a callback to check if it worked
	searchableIndex.addToDefaultSearchableIndex(searchableItems, function (e) {
		log.args('Ti.App.iOS.SearchableIndex.addToDefaultSearchableIndex', e);
	});

	// Unless this is the initial call to addIndex, inform the user
	if ($.win.leftNavButton) {
		alert('Use spotlight and search for \'appsearch\' to find the individual beatles.');
	}

	// Replace the leftNavButton with the button to delete the items from the index
	$.win.leftNavButton = $.deleteFromIndex;
}

/**
 * Event listener for the leftNav-trash-button. It will delete the
 * individual Beatles from Spotlight by their shared domainIdentifier.
 */
function deleteFromIndex() {

	// Create an instance of the index
	var searchableIndex = Ti.App.iOS.createSearchableIndex();

	// Delete all Spotlight items with the given domain identifiers.
	searchableIndex.deleteAllSearchableItemByDomainIdenifiers(['com.appcelerator.sample.spotlight.beatle'], function (e) {
		log.args('Ti.App.iOS.SearchableIndex.deleteAllSearchableItemByDomainIdenifiers', e);
	});

	alert('Use spotlight and search for \'appsearch\' to verify you can no longer find the individual beatles, but still find the activity of viewing this tab.');

	// Replace the leftNavButton with the button to re-index the items
	$.win.leftNavButton = $.addToIndex;
}

/**
 * Event listener for the continueactivity event which will fire when a user
 * taps on the handoff icon or the Core Spotlight search item.
 */
function onContinueactivity(e) {
	var modelId;

	log.args('Ti.App.iOS:continueactivity', e);

	// A Spotlight search result was opened
	if (e.activityType === 'com.apple.corespotlightitem') {

		// The model ID is what we've set via Ti.App.iOS.SearchableItem.identifier
		modelId = e.searchableItemActivityIdentifier;

		// The UserActivity for the detail window was continued
	} else if (e.activityType === 'com.appcelerator.sample.spotlight.detail') {

		// The model ID is what we've set via Ti.App.iOS.UserActivity.userInfo.id
		modelId = e.userInfo.id;

		// The UserActivity for the list was continued
	} else if (e.activityType === 'com.appcelerator.sample.spotlight.list') {

		closeDetail();

	} else {

		// Don't select our tab
		return;
	}

	// Select our tab
	$.tab.active = true;

	if (modelId) {

		// Pass the model ID to openDetail to handle opening the detail window
		openDetail(modelId);
	}
}

/**
 * Helper function to close the current detail window, if any
 */
function closeDetail() {

	if (!currentDetailWindow) {
		return;
	}

	$.tab.close(currentDetailWindow);

	currentDetailWindow = null;
}

/**
 * Helper function to lookup a model by its ID, close the current detail
 * window if needed and then open a new one for the model.
 */
function openDetail(id) {

	// Look up the model by the given ID
	var model = $.collection.get(id);

	// We somehow have an unknown ID, perhaps an old search result
	if (!model) {
		return alert('That\'s no Beatle!');
	}

	closeDetail();

	// Replace the current detail window by one for this model
	currentDetailWindow = Alloy.createController('detail', {

		// Pass the model as $model to use data binding
		$model: model

	}).getView();

	// Open the new detail window via the tab
	$.tab.open(currentDetailWindow);
}

function onListViewItemclick(e) {

	// The model ID is what we've set via the ListItem's special itemId property
	var modelId = e.itemId;

	openDetail(modelId);
}

function onWindowFocus(e) {
	createUserActivity();
}

function onWindowBlur(e) {
	invalidateActivity();
}

function openWebsite() {
	Ti.Platform.openURL('https://en.wikipedia.org/wiki/The_Beatles');
}

/**
 * Called when the list window receives focus to create the user activity and
 * make it the current by calling becomeCurrent()
 */
function createUserActivity() {

	if (activity) {
		return;
	}

	var parameters = {

		// This value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.spotlight.list',

		// This activity can be continued on another device
		eligibleForHandoff: true,

		// Index this activity for Spotlight as well as Siri suggestions
		eligibleForSearch: true,

		// Count this activity as a 'pageview' toward the related web/app content
		eligibleForPublicIndexing: true,

		// Required for eligibleForPublicIndexing
		webpageURL: 'https://en.wikipedia.org/wiki/The_Beatles'
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Add a set of attributes describing this user activity
	activity.addContentAttributeSet(Ti.App.iOS.createSearchableItemAttributeSet({
		itemContentType: Ti.App.iOS.UTTYPE_PLAIN_TEXT,

		title: 'The Beatles',
		contentDescription: 'The Beatles were an English rock band, formed in Liverpool in 1960. With members John Lennon, Paul McCartney, George Harrison and Ringo Starr, they became widely regarded as the greatest and most influential act of the rock era.',
		thumbnailData: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images/beatles.jpg').read(),

		keywords: ['beatles', 'appsearch', 'sample', 'alloy', 'titanium', 'appcelerator']
	}));

	// Check if the user's OS version supports user activities
	if (activity.supported) {

		// Make it the current activity
		activity.becomeCurrent();

	} else {
		log.args('Did not call becomeCurrent() because activity.supported is:', activity.supported);
	}
}

/**
 * Called when the user moves away from the list window so we can invalidate
 * the user activity. Once invalidated it cannot become current again!
 */
function invalidateActivity() {

	if (!activity) {
		return;
	}

	activity.invalidate();
	activity = null;

	log.args('Ti.App.iOS.UserActivity#list.invalidate()');
}
