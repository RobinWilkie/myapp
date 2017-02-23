/**
 * Created by 20101777 on 23/02/2017.
 */

//inject dependencies into controller
var AccountController = function(userModel, session, mailer){
  this.crypto = require('crypto'); //for generating password hashes
    this.uuid = require('node-uuid'); //for unique identifiers
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.UserProfileModel = require('../models/user-profile.js');
    this.userModel = userModel; //instance of the user Mongoose Class
    this.session = session; //object that controller uses to store session data
    this.mailer = mailer; //helper object to send password reset email to user
};

//getter method for the session
AccountController.prototype.getSession = function(){
  return this.session;
};

//setter method for the session
AccountController.prototype.setSession = function(session){
    this.session = session;
};

//method to create secure pseudo random  hash of password
AccountController.prototype.hashPassword = function(password, salt, callback){
  //use Password-Based Key Derivation Function pbkdf2 to hash and iterate
    var iterations = 10000,
        keyLen = 64; //64 bit
    this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};

//create logon method
AccountController.prototype.logon = function(username, password, callback) {

    var me = this;

    me.userModel.findOne({ username: username }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {

            me.hashPassword(password, user.passwordSalt, function (err, passwordHash) {

                if (passwordHash == user.passwordHash) {

                    var userProfileModel = new me.UserProfileModel({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        username: user.username
                    });

                    me.session.userProfileModel = userProfileModel;

                    return callback(err, new me.ApiResponse({
                        success: true, extras: {
                            userProfileModel:userProfileModel
                        }
                    }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_PWD } }));
                }
            });
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.USERNAME_NOT_FOUND } }));
        }

    });
};

AccountController.prototype.logoff = function () {
    if (this.session.userProfileModel) delete this.session.userProfileModel;
    return;
};

AccountController.prototype.register = function (newUser, callback) {
    var me = this;
    me.userModel.findOne({ username: newUser.username }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.USERNAME_ALREADY_EXISTS } }));
        } else {

            newUser.save(function (err, user, numberAffected) {

                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }

                if (numberAffected === 1) {

                    var userProfileModel = new me.UserProfileModel({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        username: user.username
                    });

                    return callback(err, new me.ApiResponse({
                        success: true, extras: {
                            userProfileModel: userProfileModel
                        }
                    }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER } }));
                }

            });
        }

    });
};

AccountController.prototype.resetPassword = function (email, callback) {
    var me = this;
    me.userModel.findOne({ email: email }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }

        if (user) {
            // Save the user's email and a password reset hash in session. We will use
            var passwordResetHash = me.uuid.v4();
            me.session.passwordResetHash = passwordResetHash;
            me.session.emailWhoRequestedPasswordReset = email;

            me.mailer.sendPasswordResetHash(email, passwordResetHash);

            return callback(err, new me.ApiResponse({ success: true, extras: { passwordResetHash: passwordResetHash } }));
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
        }
    })
};

AccountController.prototype.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
    var me = this;
    if (!me.session || !me.session.passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EXPIRED } }));
    }

    if (me.session.passwordResetHash !== passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
    }

    if (me.session.emailWhoRequestedPasswordReset !== email) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
    }

    var passwordSalt = this.uuid.v4();

    me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {

        me.userModel.update({ email: email }, { passwordHash: passwordHash, passwordSalt: passwordSalt }, function (err, numberAffected, raw) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (numberAffected < 1) {

                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD } }));
            } else {
                return callback(err, new me.ApiResponse({ success: true, extras: null }));
            }
        });
    });
};

module.exports = AccountController;