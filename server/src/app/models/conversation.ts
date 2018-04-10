import { Document, Schema, Model, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;
import { Participant } from './user';
import { User } from './user';
import { Message, IMessage } from './message';

export interface IConversation {
  _id: any;
  name: string;
  info?: any;
  email?: string;
  messages: Array<IMessage>;
  participants: Array<Participant>;
  lastMessage?: String;
}
export interface Conversations extends Array<IConversation> {}
export interface IConvModel extends IConversation, Document {}

// Conversation Schema
const ConversationSchema = new Schema({
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
  date: { type: Date, default: Date.now }
});
export const Conversation: Model<IConvModel> = model<IConvModel>(
  'Conversation',
  ConversationSchema
);
