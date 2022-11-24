var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const _ = require('lodash');

var userModel = new Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    is_active: {
        type: String
    },
    is_deleted: {
        type: String
    },
    mobile_no: {
        type: String,
        trim: true
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    },
    is_register: {
        type: String
    },
    otp: {
        value: {
            type: String
        },
        expired_at: {
            type: String
        },
        send_attempts : {
            type: Number,
            default:0
        }
    },
    otp_verified: {
        type: Boolean,
        default: true
    },
    password: {
        type: String
    },
    user_device: {
        name: {
            type: String
        },
        model: {
            type: String
        },
        os: {
            type: String
        },
        processor: {
            type: String
        },
        ram: {
            type: String
        },
    },
    device_id:{
        type: String,
        trim : true
    },
    token: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

var User = mongoose.model('User', userModel);

module.exports = {
    User
};