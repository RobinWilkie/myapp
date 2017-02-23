/**
 * Created by robin on 22/02/2017.
 */

//create UserProfileModel class to model user profile entity
var UserProfileModel = function(cnf){
    //define properties to hold a user's data
        this.name = cnf.name,
        this.email = cnf.email,
        this.phone = cnf.phone,
        this.username = cnf.username
};

module.exports = UserProfileModel;