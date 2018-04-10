"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ObjectId = mongoose_1.Schema.Types.ObjectId;
;
// Message Schema
var MessageSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
        default: ''
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    conversation: {
        type: ObjectId,
        ref: 'Conversation',
        required: true
    },
    date: { type: Date, default: Date.now }
});
// module.exports = mongoose.model('Message', MessageSchema);
exports.Message = mongoose_1.model("Message", MessageSchema);
