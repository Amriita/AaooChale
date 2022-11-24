const { func } = require('joi');
const config = require('./../config');
const userController = require('./../app/controller/userController');

module.exports = function(router , io) {

    router.get('/healtcheck',function(req,res){
        return userController.healthcheck(req,res);
    })

    //send otp & login Api
    router.post('/login',function(req,res){
        return userController.login(req,res);
    })

    router.post('/verify-otp', function(req,res) {
        return userController.verifyOTP(req,res);
    })
}