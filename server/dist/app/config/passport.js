"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var passport_jwt_1 = __importDefault(require("passport-jwt"));
var JwtStrategy = passport_jwt_1.default.Strategy;
var ExtractJwt = passport_jwt_1.default.ExtractJwt;
var user_1 = require("../models/user");
var main_1 = require("../config/main");
var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};
module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: main_1.config.secret
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, next) {
        user_1.User.findOne({ _id: jwt_payload.id }, function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                next(null, { _id: user._id });
            }
            else {
                next(null, false);
            }
        });
    }));
};
