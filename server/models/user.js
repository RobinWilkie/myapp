/**
 * Created by robin on 22/02/2017.
 */

// require Mongoose to handle login and register
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//model user properties that I want to capture
var UserSchema = new Schema({
   name: String,
    email: String,
    phone: String,
    username: String,
    passwordHash: String,
    passwordSalt: String //password's hash and salt so don't have to store passwords in database
});

module.exports = mongoose.model('User', UserSchema);