"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ObjectId = mongoose_1.Schema.Types.ObjectId;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
// User Schema
var UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        set: function (value) {
            return value.trim().toLowerCase();
        },
        validate: [
            function (email) {
                return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null);
            },
            'Invalid email'
        ]
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    contacts: {
        type: [
            {
                _id: ObjectId,
                name: String,
                email: String
            }
        ],
        default: []
    },
    conversations: {
        type: [
            {
                _id: {
                    type: ObjectId,
                    ref: 'Conversation'
                },
                name: String,
                lastMessage: String
            }
        ],
        default: []
    },
    invitations: {
        type: [
            {
                _id: ObjectId,
                name: String
            }
        ],
        default: []
    }
});
// Save the user's hashed password
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcryptjs_1.default.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcryptjs_1.default.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});
// Create method to compare passwords
UserSchema.methods.comparePasswords = function (pw, cb) {
    bcryptjs_1.default.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err, false);
        }
        cb(null, isMatch);
    });
};
UserSchema.virtual('fullName').get(function () {
    return this.firstname + ' ' + this.lastname;
});
exports.User = mongoose_1.model('User', UserSchema);
