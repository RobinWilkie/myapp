/**
 * Created by robin on 22/02/2017.
 */

//if apiResponse is unsuccessful define error conditions
var ApiMessages = function(){ };
ApiMessages.USERNAME_NOT_FOUND = 0;
ApiMessages.INVALID_PWD = 1;
ApiMessages.DB_ERROR = 2;
ApiMessages.NOT_FOUND = 3;
ApiMessages.USERNAME_ALREADY_EXISTS = 4;
ApiMessages.COULD_NOT_CREATE_USER = 5;
ApiMessages.PASSWORD_RESET_EXPIRED = 6;
ApiMessages.PASSWORD_RESET_HASH_MISMATCH = 7;
ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH = 8;
ApiMessages.COULD_NOT_RESET_PASSWORD = 9;

module.exports = ApiMessages;