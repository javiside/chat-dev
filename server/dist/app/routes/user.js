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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_1 = require("../models/user"); //User model
var main_1 = require("../config/main");
var mongoose_1 = __importDefault(require("mongoose"));
var ObjectId = mongoose_1.default.Types.ObjectId;
// Register new users
exports.register = function (req, res) {
    if (!req.body.email ||
        !req.body.password ||
        !req.body.firstname ||
        !req.body.lastname) {
        if (!req.body.firstname) {
            res.status(401).json({ msg: 'Please include the first name' });
        }
        if (!req.body.lastname) {
            res.status(401).json({ msg: 'Please include the last name' });
        }
        if (!req.body.email) {
            res.status(401).json({ msg: 'Please include the email' });
        }
        if (!req.body.password) {
            res.status(401).json({ msg: 'Please include the password' });
        }
    }
    else {
        user_1.User.findOne({ email: req.body.email }, function (err, usr) {
            if (usr === null || usr === undefined) {
                var newUser = new user_1.User({
                    email: req.body.email,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                });
                // Attempt to save the new user
                newUser.save(function (err, user) {
                    if (err) {
                        res.status(401).json({
                            msg: err.code === 11000
                                ? 'Email already exists'
                                : 'Please enter a valid Email'
                        });
                    }
                    else {
                        var token = jsonwebtoken_1.default.sign({ id: user._id }, main_1.config.secret, {
                            expiresIn: 60 * 60 * 24 // 24 hours
                        });
                        res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
                        res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
                        res.sendStatus(200); // User saved
                    }
                });
            }
            else {
                res.status(401).json({
                    msg: 'Email already exists'
                });
            }
        });
    }
};
// Check user email and pass in db
exports.login = function (req, res) {
    user_1.User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.status(401).json({ msg: 'Email not found' }); // User not found
        }
        else {
            // Check if password matches
            user.comparePasswords(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create the token
                    var token = jsonwebtoken_1.default.sign({ id: user._id }, main_1.config.secret, {
                        expiresIn: 60 * 60 * 24 // 24 hours
                    });
                    res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
                    res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
                    res.sendStatus(200);
                }
                else {
                    res.status(401).json({ msg: 'Wrong Password' });
                }
            });
        }
    });
};
// Logout route (destroys token)
exports.logout = function (req, res) {
    res.cookie('token', null, { maxAge: 1 });
    res.cookie('user', null, { maxAge: 1 });
    res.cookie('io', null, { maxAge: 1 });
    res.end('logged out');
};
///////////////////////////////////////////////////////////////////////////////////
// After auth
exports.dash = function (req, res) {
    res.json({ userID: req.user._id });
};
// Get User Info
exports.me = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.findOne({
                    _id: req.cookies.user
                }, function (err, user) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err)
                                    res.json({ msg: 'Error trying to fetch user info ' }); // Error
                                if (!!user) return [3 /*break*/, 1];
                                res.json({ msg: 'Not found' }); // User not found
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, user_1.User.findById(req.cookies.user)
                                    .populate({
                                    path: 'conversations._id',
                                    populate: {
                                        path: 'participants._id',
                                        select: 'firstname lastname email admin -_id'
                                    }
                                })
                                    .exec(function (err, popConv) { return __awaiter(_this, void 0, void 0, function () {
                                    var convsParts, updtConvs, userData, _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                convsParts = popConv.conversations
                                                    .map(function (conv) { return conv._id; })
                                                    .map(function (convPar) { return convPar.participants; })
                                                    .map(function (parArr, idx) {
                                                    return (_a = {},
                                                        _a[user.conversations[idx]._id] = parArr.map(function (par) { return ({
                                                            email: par._id.email,
                                                            firstname: par._id.firstname,
                                                            lastname: par._id.lastname,
                                                            admin: par.admin
                                                        }); }),
                                                        _a);
                                                    var _a;
                                                });
                                                updtConvs = popConv.conversations.map(function (c) { return ({
                                                    _id: c._id._id,
                                                    name: c.name,
                                                    lastMessage: c._id.lastMessage
                                                }); });
                                                _a = {
                                                    _id: req.cookies.user,
                                                    firstname: user.firstname,
                                                    lastname: user.lastname,
                                                    email: user.email,
                                                    contacts: user.contacts,
                                                    conversations: updtConvs,
                                                    invitations: user.invitations
                                                };
                                                return [4 /*yield*/, convsParts];
                                            case 1:
                                                userData = (_a.convParts = _b.sent(),
                                                    _a);
                                                return [4 /*yield*/, res.json(userData)];
                                            case 2:
                                                _b.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
///////////////////////////////////////////////////////////////////////////////////////////////
// Update name or lastname
exports.updateMe = function (req, res) {
    user_1.User.findByIdAndUpdate(req.cookies.user, { $set: { firstname: req.body.firstname, lastname: req.body.lastname } }, { new: true }, function (err, user) {
        if (err) {
            return res.status(401).json({ msg: 'err' });
        }
        res
            .status(200)
            .json({ newFirstName: user.firstname, newLastName: user.lastname });
    });
};
// Add new contact
exports.addContact = function (req, res) {
    user_1.User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            return res
                .status(401)
                .json({ msg: 'Error: trying to find the contact' });
        }
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        else {
            user_1.User.findOne({ _id: req.cookies.user }, function (err, myId) {
                if (err)
                    return err;
                if (myId.contacts.find(function (myConts) { return myConts.email === req.body.email; }) === undefined) {
                    if (myId.email !== req.body.email) {
                        user_1.User.findOne({ email: req.body.email }, function (err, contact) {
                            if (err)
                                return err;
                            user_1.User.findByIdAndUpdate(req.cookies.user, {
                                $addToSet: {
                                    contacts: {
                                        _id: new ObjectId(contact._id),
                                        name: contact.fullName,
                                        email: contact.email
                                    }
                                }
                            }, { new: true }, function (err, user) {
                                if (err) {
                                    return res.status(401).json({
                                        msg: 'Error: trying to add the contact'
                                    });
                                }
                                res.status(200).json({
                                    _id: contact._id,
                                    name: contact.fullName,
                                    email: contact.email
                                });
                            });
                        });
                    }
                    else {
                        return res.status(401).json({ msg: 'You cannot add yourself' });
                    }
                }
                else {
                    return res.status(401).json({ msg: 'User already added' });
                }
            });
        }
    });
};
// Remove Contact
exports.deleteContact = function (req, res) {
    user_1.User.findByIdAndUpdate({ _id: req.cookies.user }, { $pull: { contacts: { _id: req.body.delContact } } }, { new: true }, function (err, user) {
        if (err) {
            return res.status(401).json({ msg: 'err' });
        }
        res.status(200).json({ delCont: user.contacts });
    });
};
