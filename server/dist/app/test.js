"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var user_1 = require("./models/user");
var message_1 = require("./models/message");
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
describe('Testing User model', function () {
    it('should be an error if the first name is empty', function () {
        var user = new user_1.User({
            email: 'a@a.a',
            password: 'a',
            firstname: '',
            lastname: 'Smith'
        });
        user.validate(function (err) {
            chai_1.expect(err).to.exist;
        });
    });
    it('should be an error if the last name is not passed', function () {
        var user = new user_1.User({
            email: 'a@a.a',
            password: 'a',
            firstname: 'Jhon'
        });
        user.validate(function (err) {
            chai_1.expect(err).to.exist;
        });
    });
    it('should be an error if the email is empty', function () {
        var user = new user_1.User({
            email: '',
            password: 'a',
            firstname: 'Jhon',
            lastname: 'Smith'
        });
        user.validate(function (err) {
            chai_1.expect(err).to.exist;
        });
    });
    it('should be an error if the password is not passed', function () {
        var user = new user_1.User({
            email: 'a@a.a',
            firstname: 'Jhon',
            lastname: 'Smith'
        });
        user.validate(function (err) {
            chai_1.expect(err).to.exist;
        });
    });
    it('should continue if the four elements are passed', function () {
        var user = new user_1.User({
            email: 'a@a.a',
            password: 'a',
            firstname: 'Jhon',
            lastname: 'Smith'
        });
        user.validate(function (err) {
            chai_1.expect(err).to.not.exist;
        });
    });
});
describe('Testing the save message function', function () {
    it('should be an error if the conversation Id is empty', function () {
        var newMsg = new message_1.Message({
            text: 'new message',
            owner: new ObjectId('5ac2c914bbfebd5bf07b4fb1'),
            conversation: ''
        });
        newMsg.validate(function (err) {
            chai_1.expect(err.name).equal('ValidationError');
        });
    });
    it('should continue if text, owner (id) and conv (id) are passed', function () {
        var newMsg = new message_1.Message({
            text: 'new message',
            owner: new ObjectId('5ac2c914bbfebd5bf07b4fb1'),
            conversation: new ObjectId('6ac2c914bbfebd5bf07b4fb2')
        });
        newMsg.validate(function (err) {
            chai_1.expect(err).to.not.exist;
        });
    });
});
