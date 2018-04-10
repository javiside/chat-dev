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
var conversation_1 = require("../models/conversation"); //conversation model
var user_1 = require("../models/user"); //User model
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
// Register new conversations
exports.createConv = function (req, res) {
    if (!req.body.name || !req.body.participants) {
        res.status(401).json({ msg: 'Please include the name and participants' });
    }
    else {
        var usersWithObjId = req.body.participants.map(function (el) {
            return { _id: new ObjectId(el._id), active: false, admin: false };
        });
        var fullList = usersWithObjId.concat([
            { _id: new ObjectId(req.cookies.user), active: true, admin: true }
        ]);
        var newConv = new conversation_1.Conversation({
            name: req.body.name,
            participants: fullList
        });
        // Attempt to save the new conversation
        newConv.save(function (err, conv) {
            if (err) {
                res.status(401).json({ msg: err });
            }
            else {
                // -Include ME to the conv and -Send invitations to others
                // -Include ME:
                user_1.User.findByIdAndUpdate(req.cookies.user, {
                    $addToSet: {
                        conversations: {
                            _id: new ObjectId(conv._id),
                            name: conv.name,
                            lastMessage: conv.lastMessage
                        }
                    }
                }, { new: true }, function (err, updated) {
                    if (err) {
                        res.status(401).json({ msg: err });
                    }
                    // -Send invitations:
                    req.body.participants.forEach(function (user) {
                        return user_1.User.findByIdAndUpdate(user._id, {
                            $addToSet: {
                                invitations: {
                                    _id: new ObjectId(conv._id),
                                    name: conv.name
                                }
                            }
                        }, { new: true }, function (err, updated) {
                            if (err)
                                res.status(401).json({ msg: err });
                        });
                    });
                    conversation_1.Conversation.findById(conv._id)
                        .populate({
                        path: 'participants._id',
                        select: 'firstname lastname email -_id'
                    })
                        .exec(function (err, popConv) {
                        res.status(200).json({
                            _id: conv._id,
                            name: conv.name,
                            info: popConv.participants.map(function (part) { return part._id; })
                        });
                    }); // conversation saved)
                });
            }
        });
    }
};
// Accept or delete invitations
exports.invAction = function (req, res) {
    var options = req.body.action === 'to-accept'
        ? {
            $pull: { invitations: { _id: new ObjectId(req.body.invitation) } },
            $push: {
                conversations: {
                    _id: new ObjectId(req.body.invitation),
                    name: req.body.name
                }
            }
        }
        : { $pull: { invitations: { _id: new ObjectId(req.body.invitation) } } };
    user_1.User.findByIdAndUpdate(req.cookies.user, options, function (err, doc) {
        if (err)
            res.status(401).json({ msg: err });
        conversation_1.Conversation.findById(req.body.invitation)
            .populate({
            path: 'participants._id',
            select: 'firstname lastname email -_id'
        })
            .exec(function (err, popConv) {
            conversation_1.Conversation.findByIdAndUpdate(req.body.invitation, function (err, newConv) {
                if (err)
                    res.status(401).json({ msg: 'No messages' });
            })
                .populate({
                path: 'messages._id',
                select: '-__v'
            })
                .exec(function (err, popConvMsgs) { return __awaiter(_this, void 0, void 0, function () {
                var allMsgs;
                return __generator(this, function (_a) {
                    allMsgs = [];
                    if (popConvMsgs.messages.length > 0) {
                        allMsgs = popConvMsgs.messages.map(function (el) { return el._id; });
                    }
                    res.status(200).json({
                        _id: req.body.invitation,
                        name: req.body.name,
                        action: req.body.action,
                        info: popConv.participants.map(function (part) { return part._id; }),
                        messages: allMsgs,
                        lastMessage: popConvMsgs.lastMessage
                    });
                    return [2 /*return*/];
                });
            }); });
        });
    });
};
// Accept or delete invitations
exports.AddToConv = function (req, res) {
    var conv = req.body.currentConv;
    var userEmail = req.body.contactAdded;
    user_1.User.findOne({ email: userEmail }, function (err, newUser) {
        if (err)
            res.status(401).json({ msg: err });
        conversation_1.Conversation.findByIdAndUpdate(conv, {
            $push: {
                participants: {
                    _id: new ObjectId(newUser._id),
                    admin: false,
                    active: true
                }
            }
        }, { new: true }, function (err, conv) {
            if (err)
                res.status(401).json({ msg: err });
            if (conv) {
                conversation_1.Conversation.findById(conv._id)
                    .populate({
                    path: 'participants._id',
                    select: 'firstname lastname email -_id'
                })
                    .exec(function (err, popConv) {
                    res.status(200).json({
                        _id: conv._id,
                        name: conv.name,
                        info: popConv.participants.map(function (part) { return part._id; })
                    });
                }); // conversation saved)
            }
            else {
                if (err)
                    res.status(401).json({ msg: 'No conversation found' });
            }
        });
    });
};
// Change conv avatar
exports.changeAvatar = function (req, res) {
    if (req.body.avatar && req.body.conv) {
        conversation_1.Conversation.findByIdAndUpdate({ _id: req.body.conv }, { $set: { avatar: req.body.avatar } }, { new: true }, function (err, user) {
            if (err) {
                return res.status(401).json({ msg: 'err' });
            }
            res.status(200).end();
        });
    }
};
