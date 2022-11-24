const { User } = require('../models/user');
const config = require('../../config');
const { func } = require('joi');
const { reject } = require('lodash');
const { request, response } = require('express');
const jwt = require('jsonwebtoken')
var apikey = "NmY2YTU0N2E1ODVhNDI1MTMzNDI2NTMyNTI3NjQ3MzI=";
var senderId  = "AAOO Chale";
const _ = require('lodash')

module.exports = {

    response : function(status , message , data) {
        return {
            status:status,
            message:message,
            data:data
        }
    },

    randomNumber : async function(length){
        return Math.floor(
            Math.pow(10 , length-1) + Math.random() * (Math.pow(10 , length) - Math.pow(10 , length-1) -1)
        );
    },

    generateOtp : async function () {
        let otp = config.static_otp;
        if(process.env.NODE_ENV == 'production'){
            otp = await this.randomNumber(config.otp_length);
        } 
        return { status:true , otp , message : "OTP Generate Success"};
    },
    sendOtp : function(mobile , otp){
        console.log("Data")
        return new Promise((resolve , reject) => {

            const projectName = "Aoo chale";
            var message = Otp + 'is your Otp to verify your user account on ' + projectName;

            request.prependOnceListener('https://api.textlocal.in/send/' , {
                form: {
                    apikey: apikey,
                    number : mobile,
                    message : message,
                    sender : senderId
                }
            }, function(error , message , body) {
                console.log("SMS send" , {
                    apikey : apikey,
                    number : mobile,
                    message : mobile,
                    sender : senderId
                });
                if(response.statusCode == 200){
                    console.log('Response',body);
                    var body_obj  = JSON.parse(body);
                    if(body_obj.status == 'success'){
                        return resolve(true);
                    }else{
                        return resolve(false);
                    }
                }else{
                    return resolve(false);
                }
            })
        })
    },

    issueToken: function(data){
        
        return jwt.sign({secretId : data } , config.apisecret );
    }

}
