module.exports = function(mongoClient, dbConnectUrl) {    
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;

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
        },
        findDocuments : function(documentName, query, callback) {
            mongoClient.connect(dbConnectUrl, function(err, db){			
                // Get the documents collection
                var collection = db.collection(documentName);
                // Find some documents
                collection.find(query).toArray(function(err, docs) {
                    assert.equal(err, null);   
                    db.close();            
                    callback(docs);
                });
		    });	            
        },        
        findOne : function(documentName, id, callback) {
            mongoClient.connect(dbConnectUrl, function(err, db){			
                // Get the documents collection
                var collection = db.collection(documentName);
                
                collection.find({_id: ObjectId(id.toString())}).toArray(function(err, items) {
                    console.log(err, items);
                    //assert.equal(err, null);                    
                    db.close();                 
                    callback(items);
                });
		    });	            
        }
    }    
};
