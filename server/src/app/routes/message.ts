import express from 'express';
import { IMessageModel } from '../models/message';
import { Message } from '../models/message'; //Message model
import { User, IUserModel } from '../models/user'; //User model
import { Conversation } from '../models/conversation'; //conversation model
import mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId;

// Get messages for the chat
export const getMessages = (req: express.Request, res: express.Response) => {
  User.findById(req.cookies.user, (err: any, user: IUserModel) => {
    if (err) res.status(401).json({ msg: 'No messages' });
  })
    .populate({
      path: 'conversations._id',
      populate: {
        path: 'messages._id',
        select: '-__v'
      }
    })
    .exec(async (err: any, popUsrConvMsgs) => {
      if (popUsrConvMsgs!.conversations.length < 1) {
        res.status(200).json([]);
      } else {
        let allMsgs = popUsrConvMsgs!.conversations.map((el: any) =>
          el._id.messages.map((m: any) => m._id)
        );
        const mergMsgs = allMsgs.reduce((prev: any, curr: any) => {
          return prev.concat(curr);
        });
        await res.status(200).json(mergMsgs);
      }
    });
};

// Save Messages
export const saveMessage = (req: express.Request, res: express.Response) => {
  if (req.body.currentConv !== null && req.body.messageSent !== null) {
    let conv = req.body.currentConv;
    let text = req.body.messageSent;
    let ownerName = req.body.ownerName;
    let userId = req.cookies.user;
    //Create a new message and save it
    let newMsg = new Message({
      text: text,
      owner: new ObjectId(userId),
      ownerName: ownerName,
      conversation: new ObjectId(conv)
    });
    // Attempt to save the new message
    newMsg.save((err: Error, msg: IMessageModel) => {
      if (err)
        return res.status(401).json({
          msg: err
        });

      // Store the message id on the conversation
      Conversation.findByIdAndUpdate(
        conv,
        {
          $push: { messages: { _id: new ObjectId(msg._id), owner: userId } },
          $set: { lastMessage: text }
        },
        (err: Error) => {
          if (err) {
            return res.status(401).json({
              msg: err
            });
          }
          res.status(200).json({
            conversation: conv,
            text: text,
            owner: userId,
            ownerName: ownerName,
            date: new Date()
          });
        }
      );
    });
  }
};
