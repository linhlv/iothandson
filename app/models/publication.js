var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var schema   = new Schema({
    friendlyName: String,
    topic: String,
    description: String,
    textOn: String,
    textOff: String,
    textAuto: String,
    valueOn: String,
    valueOff: String,
    valueAuto: String,
    createdBy: String,
    createdOn: Date,
});

module.exports = mongoose.model('Publication', schema);