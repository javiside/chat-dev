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
var server_1 = __importDefault(require("../server"));
var mongoose_1 = __importDefault(require("mongoose"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var main_1 = require("./config/main");
var user_1 = require("./models/user");
var conversation_1 = require("./models/conversation");
var ObjectId = mongoose_1.default.Types.ObjectId;
var getCookie = function (str) {
    if (str === null || str === undefined || str.indexOf('token=') < 0) {
        return null;
    }
    else {
        var cookie = str.split('token=')[1].split(';')[0];
        return cookie;
    }
};
var allClients = {};
server_1.default.on('connection', function (socket) {
    socket.on('login', function () { return __awaiter(_this, void 0, void 0, function () {
        var cookie, userId_1, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, getCookie(socket.request.headers.cookie)];
                case 1:
                    cookie = _e.sent();
                    if (!(cookie !== null)) return [3 /*break*/, 5];
                    _b = (_a = jsonwebtoken_1.default).verify;
                    return [4 /*yield*/, cookie];
                case 2: return [4 /*yield*/, _b.apply(_a, [_e.sent(), main_1.config.secret])
                        .id];
                case 3:
                    userId_1 = _e.sent();
                    // Find the users conversations/rooms (id was in the encrypted token)
                    _d = (_c = user_1.User).findById;
                    return [4 /*yield*/, userId_1];
                case 4:
                    // Find the users conversations/rooms (id was in the encrypted token)
                    _d.apply(_c, [_e.sent(), function (err, user) {
                            if (err)
                                return new Error('Authentication Error');
                            for (var _i = 0, _a = user.conversations; _i < _a.length; _i++) {
                                var room = _a[_i];
                                socket.join(room._id);
                            }
                            allClients[userId_1] = socket; // Attach the socket to the user id
                            var _loop_1 = function (client) {
                                if (client && client !== userId_1) {
                                    user_1.User.findById(client, function (err, c) {
                                        for (var _i = 0, _a = c.contacts; _i < _a.length; _i++) {
                                            var f = _a[_i];
                                            if (f._id.toString() === userId_1) {
                                                allClients[client].emit('userOnline', user.fullName, user.email);
                                            }
                                        }
                                    });
                                }
                            };
                            // Notify all contacts that have you as contact/friend, on login
                            for (var client in allClients) {
                                _loop_1(client);
                            }
                        }]);
                    // Join the new conversation when creating or accepting new convs
                    socket.on('newConv', function (convId) {
                        socket.join(convId);
                    });
                    //Emit an event for every user on the invitation
                    socket.on('newInv', function (convName, userList) {
                        var _loop_2 = function (id) {
                            user_1.User.findById(id, function (err, invUser) {
                                if (err)
                                    return err;
                                allClients[id].emit('invSent', invUser.invitations);
                            });
                        };
                        for (var _i = 0, userList_1 = userList; _i < userList_1.length; _i++) {
                            var id = userList_1[_i];
                            _loop_2(id);
                        }
                    });
                    // when receiving a message emmit a room event and update the db (conversations and msgs)
                    socket.on('newMessage', function (conv, text) {
                        conversation_1.Conversation.findByIdAndUpdate(conv, { new: true }, function (err, foundConv) {
                            if (err) {
                                return err;
                            }
                            foundConv.lastMessage =
                                new Date().toLocaleTimeString('en-US').replace(/:\d{2}\s/, ' ') +
                                    ': ' +
                                    text;
                            foundConv.save();
                            user_1.User.findByIdAndUpdate(userId_1, { new: true }, function (err, updated) {
                                if (err) {
                                    return err;
                                }
                                for (var _i = 0, _a = updated.conversations; _i < _a.length; _i++) {
                                    var c = _a[_i];
                                    if (c._id.toString() === conv) {
                                        c.lastMessage =
                                            new Date()
                                                .toLocaleTimeString('en-US')
                                                .replace(/:\d{2}\s/, ' ') +
                                                ': ' +
                                                text;
                                        updated.save();
                                    }
                                }
                            });
                        });
                        conversation_1.Conversation.findById(conv)
                            .populate({
                            path: 'messages',
                            select: '-_id -__v'
                        })
                            .exec(function (err, popConv) {
                            socket
                                .to(conv)
                                .emit('msgSent', popConv.messages[popConv.messages.length - 1]);
                            server_1.default.in(conv).emit('updateLastMsg', conv, text);
                        });
                    });
                    _e.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
    //End the socket connection
    socket.on('logout', function () {
        socket.removeAllListeners();
        socket.leaveAll();
        delete socket.rooms;
        socket.disconnect();
        // var i = allClients.indexOf(socket);
        // allClients.splice(i, 1);
        // console.log(allClients.length);
    });
    socket.on('disconnect', function () {
        console.log('Got FULL disconnect!');
    });
});
