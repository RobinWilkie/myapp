/**
 * Created by robin on 22/02/2017.
 */
var UserProfileModel = function(cnf){
    this.name = cnf.name,
        this.email = cnf.email,
        this.phone = cnf.phone,
        this.username = cnf.username,
};

module.exports = UserProfileModel;