module.exports = function(mongoClient, dbConnectUrl) {
    var assert = require('assert');
    return {
        insertDocuments : function(documentName, data, callback) {
            mongoClient.connect(dbConnectUrl, function(err, db){			
                // Get the documents collection
                var collection = db.collection(documentName);
                // Insert some documents
                collection.insertMany(data, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(data.length, result.result.n);
                    assert.equal(data.length, result.ops.length);
                    console.log("Inserted %d documents into the collection", data.length);
                    db.close();
                    callback(result);                    
                });
		    });	            
        }
    }    
};
