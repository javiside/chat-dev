"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ObjectId = mongoose_1.Schema.Types.ObjectId;
// Conversation Schema
var ConversationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    participants: {
        type: [
            {
                _id: {
                    type: ObjectId,
                    ref: 'User'
                },
                active: {
                    type: Boolean,
                    default: false
                },
                admin: {
                    type: Boolean,
                    required: true
                }
            }
        ],
        required: true,
        default: []
    },
    messages: {
        type: [
            {
                _id: {
                    type: ObjectId,
                    ref: 'Message'
                }
            }
        ],
        default: []
    },
    lastMessage: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    avatar: { type: String, default: '' }
});
exports.Conversation = mongoose_1.model('Conversation', ConversationSchema);
