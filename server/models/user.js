/**
 * Created by robin on 22/02/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
   name: String,
    email: String,
    phone: String,
    username: String,
    passwordHash: String,
    passwordSalt: String
});

module.exports = mongoose.model('User', UserSchema);