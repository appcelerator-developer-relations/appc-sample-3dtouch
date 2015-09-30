// An empty definition effectively gives you Backbone collection without a
// sync-adapter. This means we have to fill (reset) the collection every
// time the app starts and changes do not persist between sessions.
// Ideal if all you want is Alloy's data-binding for any array of objects.
exports.definition = {};
