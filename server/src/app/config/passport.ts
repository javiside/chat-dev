import express from 'express';
import { IUserModel } from '../models/user';
import pjwt from 'passport-jwt';
let JwtStrategy = pjwt.Strategy;
let ExtractJwt = pjwt.ExtractJwt;
import { User } from '../models/user'
import { config } from '../config/main';
import * as passport from 'passport';

var cookieExtractor = function(req: express.Request) {
  var token = null;
  if (req && req.cookies)
  {
      token = req.cookies['token'];
  }
  return token;
};

module.exports = function(passport: any) {
  var opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.secret
  };
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, next) {
      User.findOne({ _id: jwt_payload.id }, function(err: Error, user: IUserModel) {
        if (err) {
          return next(err);
        }
        if (user) {
          next(null, { _id: user._id });
        } else {
          next(null, false);
        }
      });
    })
  );
};
