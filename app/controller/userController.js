var { User } = require('./../models/user');
var mongoose = require('mongoose');
const userRepo = require('../repositiories/userrepo');
const Service = require('../services/userServices');
const config = require('../../config');
const _ = require('lodash')

module.exports = {

    healthcheck:async function(req,res){
        return res.status(200).send("CHECKING API");
    },



    login: async function (req, res) {
        try {
            
            var params = _.pick(
                req.body,
                'mobile_no',
                'name',
                'device_id',
                'deviceNAme',
                'os',
                'deviceModel',
                'processor',
                'ram'
            );
            console.log({params})
            if (_.isEmpty(params)) {
                return res.status(404).json(Service.response(0, "Missing PArams", null));
            }

            if (isNaN(params.mobile_no) || params.mobile_no.trim().length != 10) {
                return res.status(404).json(Service.response(0, "Mobile number not correct", null));
            }

            var user = await userRepo.getUserByMobile(params.mobile_no);

            console.log({user})

            let userObject = {
                name : params.name,
                mobile_no: params.mobile_no,
                devide_id : params.device_id,
                user_device : {
                    name : params.deviceNAme || '',
                    model : params.deviceModel || '',
                    os : params.os || '',
                    processor : params.processor || '',
                    ram : params.ram || ''
                }
            };

            //console.log({userObject})

            if (user) {

                console.log("inside if")
                // if (!user.is_active) {
                //     return res.status(404).json(Service.response(0, "Account deactivated", null));
                // }

                userObject.is_register = user.otp_verified;

                //update user 
                user = await userRepo.updateUser(user._id, userObject);
                console.log({user})
            } else {
                userObject.otp_verified = false;
                user = await userRepo.createUser(userObject)
               
            }

            var otpGenerate = await Service.generateOtp();
            console.log({otpGenerate})

            if (!otpGenerate.status) {
                return res.status(404).json(Service.response(0, 'Error sending Otp please check mobile number ', null));
            }
            //await Service.sendOtp(user.mobile_no, otpGenerate.otp);

            await userRepo.storeUserOTP(user._id, otpGenerate.otp);

            return res.status(200).json(Service.response(1, 'OTP Send ', { id: user._id, mobile_no: user.mobile_no }));
        } catch (err) {
            return res.status(404).json(Service.response(0, 'Server Error', null));
        }
    },

    verifyOTP : async function (req, res){
        try{
            var params = _.pick(req.body , 'mobile_no' , 'otp' , 'id');
           
            let user = await userRepo.getUserByMobile(params.mobile_no);

            if(!user || user._id != params.id.toString()){
                return res.status(404).json(Service.response(0 , "Missing params",null));
            }
            console.log(params.otp+"")
           
            if(user.otp.value != params.otp){
                var message = '';
                var updateObj = {};

                if(user.otp.send_attempts != config.otp_send_limit){
                    console.log("data")
                    var otpGenerate = await Service.generateOtp();
                    
                    updateObj['otp.value'] = otpGenerate.otp;
                    updateObj['otp.expired_at'] = new Date().getTime() + config.OTP_EXPIRED_IN_MINUTE * 60 * 1000;
                    message = "false otp Resend"
                }

                let rez = await userRepo.updateUser(user._id , updateObj);

                console.log(rez)

                if(rez) return res.status(200).json(Service.response(0 , message , null));

                return res.status(500).json(Service.response(0 , 'server Error' , null));
            }

            if(user.otp.expired_at < new Date().getTime()){
                console.log("Data")
                return res.status(404).json(Service.response(0 , 'otp Expired' , null));
            }

            var isRegister = false;

            console.log("is_register",isRegister)

            let token = await Service.issueToken(user._id);
            console.log({token})

            updatedUser = await userRepo.userOtpVerified(user._id , token);

            console.log({updatedUser})

            if(!user) return res.status(400).json(Service.response(0 , "server Error", null));

            return res.status(200).json(Service.response(1 , "success" , updatedUser));
        }catch(error){
            return res.status(404).json(Service.response(0 , 'server error' , null));
        }
    }
}; 