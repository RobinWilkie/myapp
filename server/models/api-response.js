/**
 * Created by robin on 22/02/2017.
 */

//data transfer class to move data out of the controller
var ApiResponse = function(cnf){
  this.success = cnf.success; //signals if request succeeded
  this.extras = cnf.extras; //extras is an object to contain additional data
};

module.exports = ApiResponse;