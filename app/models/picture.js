exports.definition = {

    config: {

        columns: {
            time: 'TEXT',
            filename: 'TEXT'
        },

        // Use SQLite to persist the data
        adapter: {
            type: 'sql',
            collection_name: 'pictures',
            idAttribute: 'filename'
        }
    },

    // Extend the default BackBone model
    extendModel: function(Model) {

        _.extend(Model.prototype, {

            // Will be used in data-binding instead of attributes
            transform: function transform() {
                var transformed = this.toJSON();

                // We can't store the full path because each build to iOS Simulator results in a new path
                transformed.filepath = Ti.Filesystem.applicationDataDirectory + this.get('filename');

                return transformed;
            }
        });

        // FIXME: Required views in data-binding don't support transform() but expect __transform
        Object.defineProperty(Model.prototype, '__transform', {

            // So we just link that through to transform()
            get: Model.prototype.transform
        });

        return Model;
    }
};