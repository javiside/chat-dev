import { Document, Schema, Model, model} from 'mongoose';
const ObjectId = Schema.Types.ObjectId;
import { User } from './user';
import {Conversation} from'./conversation';

export interface IMessage {
  text: string,
  owner: string,
  ownerName: string,
  conversation: string,
  date: Date
}

export interface IMessageModel extends IMessage, Document {};
// Message Schema
const MessageSchema = new Schema({
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
export const Message: Model<IMessageModel> = model<IMessageModel>("Message", MessageSchema);