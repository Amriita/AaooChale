const dotenv = require('dotenv');
dotenv.config();

const config = function() {
    this.dbconnectionurl = process.env.MONGODB_URL;
    this.static_otp = '123456';
    this.otp_length = 6;
    this.OTP_EXPIRED_IN_MINUTE = 10
    this.apisecret = "chfvyvyhvhf"
    this.otp_send_limit = 10
}

module.exports = new config();