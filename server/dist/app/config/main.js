"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    secret: process.env.SECRET || '!(:--(=myChatPassword=)--:)!',
    database: process.env.DB || 'mongodb://@localhost:27017/token'
};
