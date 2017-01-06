var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
    clientID: String,
    server: String,
    port: String,
    username: String,
    password: String,
    createdBy: String,
    createdOn: Date,
});

module.exports = mongoose.model('Connection', schema);