const { config } = require('dotenv');
const { User } = require('../models/user');

const getUserByMobile = async (mobile) => {
    let user = await User.findOne({'mobile_no':mobile});
    if(user) return user.toJSON();
    return null;
}

const updateUser = async(userId , user) =>{
    user.updated_at = new Date().getTime();
    let updatedUser = await User.findByIdAndUpdate(userId , user , {new : true});
    if(updatedUser) return updatedUser.toJSON();
    return null;
}

const createUser = async(user) => {
    if(!user.created_at) user.created_at = new Date().getTime();

    user.name = '';
    let createdUser = await User.create(user);

    return createUser.toJSON();
}

const storeUserOTP = async(userId , otp) => {
    await User.findByIdAndUpdate({_id: userId } , {
        $set:{
            'otp.value': otp,
            'otp.expired_at' : new Date().getTime() + config.OTP_EXPIRED_IN_MINUTE * 60 * 1000
        }
    })
}

const userOtpVerified = async(userId , token) =>{
    return await User.findByIdAndUpdate({_id:userId} , {
        $set : {
            otp : {value:'' , expired_at : 0},
            token : [{token:token , access : 'auth'}],
            otp_verified: true,
            is_register:true
        }
    } , {new : true})
}

module.exports = {
    getUserByMobile,
    updateUser,
    createUser,
    storeUserOTP,
    userOtpVerified
}