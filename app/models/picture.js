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

            // In data-binding, properties returned by this method preceed model attributes
            transform: function transform() {
                return {

                    // We can't store the full path because each build to iOS Simulator results in a new path
                    filepath: Ti.Filesystem.applicationDataDirectory + this.get('filename')
                };
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