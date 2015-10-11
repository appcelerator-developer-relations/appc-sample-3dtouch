exports.definition = {
    config: {
        columns: {
            time: 'TEXT',
            filename: 'TEXT'
        },
        adapter: {
            type: 'sql',
            collection_name: 'pictures',
            idAttribute: 'filename'
        }
    },
    extendModel: function(Model) {
        
        _.extend(Model.prototype, {
            transform: function transform() {
                return {

                    // We can't store the full path because each build to iOS Simulator results in a new path
                    filepath: Ti.Filesystem.applicationDataDirectory + this.get('filename')
                };
            }
        });

        // FIXME: Inherited models don't support transform()
        Object.defineProperty(Model.prototype, '__transform', {
            get: Model.prototype.transform
        });

        return Model;
    }
};