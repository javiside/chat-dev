"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var message_1 = require("../models/message"); //Message model
var user_1 = require("../models/user"); //User model
var conversation_1 = require("../models/conversation"); //conversation model
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
// Get messages for the chat
exports.getMessages = function (req, res) {
    user_1.User.findById(req.cookies.user, function (err, user) {
        if (err)
            res.status(401).json({ msg: 'No messages' });
    })
        .populate({
        path: 'conversations._id',
        populate: {
            path: 'messages._id',
            select: '-__v'
        }
    })
        .exec(function (err, popUsrConvMsgs) { return __awaiter(_this, void 0, void 0, function () {
        var allMsgs, mergMsgs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(popUsrConvMsgs.conversations.length < 1)) return [3 /*break*/, 1];
                    res.status(200).json([]);
                    return [3 /*break*/, 3];
                case 1:
                    allMsgs = popUsrConvMsgs.conversations.map(function (el) {
                        return el._id.messages.map(function (m) { return m._id; });
                    });
                    mergMsgs = allMsgs.reduce(function (prev, curr) {
                        return prev.concat(curr);
                    });
                    return [4 /*yield*/, res.status(200).json(mergMsgs)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
// Save Messages
exports.saveMessage = function (req, res) {
    if (req.body.currentConv !== null && req.body.messageSent !== null) {
        var conv_1 = req.body.currentConv;
        var text_1 = req.body.messageSent;
        var ownerName_1 = req.body.ownerName;
        var userId_1 = req.cookies.user;
        //Create a new message and save it
        var newMsg = new message_1.Message({
            text: text_1,
            owner: new ObjectId(userId_1),
            ownerName: ownerName_1,
            conversation: new ObjectId(conv_1)
        });
        // Attempt to save the new message
        newMsg.save(function (err, msg) {
            if (err)
                return res.status(401).json({
                    msg: err
                });
            // Store the message id on the conversation
            conversation_1.Conversation.findByIdAndUpdate(conv_1, {
                $push: { messages: { _id: new ObjectId(msg._id), owner: userId_1 } },
                $set: { lastMessage: text_1 }
            }, function (err) {
                if (err) {
                    return res.status(401).json({
                        msg: err
                    });
                }
                res.status(200).json({
                    conversation: conv_1,
                    text: text_1,
                    owner: userId_1,
                    ownerName: ownerName_1,
                    date: new Date()
                });
            });
        });
    }
};
