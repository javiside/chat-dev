import express from 'express';
import jwt from 'jsonwebtoken';
import { IConvModel } from '../models/conversation';
import { IUserModel } from '../models/user';
import { Conversation } from '../models/conversation'; //conversation model
import { User, Participant } from '../models/user'; //User model
import { config } from '../config/main';
import mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId;

// Register new conversations
export const createConv = (req: express.Request, res: express.Response) => {
  if (!req.body.name || !req.body.participants) {
    res.status(401).json({ msg: 'Please include the name and participants' });
  } else {
    let usersWithObjId = req.body.participants.map((el: Participant) => {
      return { _id: new ObjectId(el._id), active: false, admin: false };
    });
    let fullList = [
      ...usersWithObjId,
      { _id: new ObjectId(req.cookies.user), active: true, admin: true }
    ];

    let newConv = new Conversation({
      name: req.body.name,
      participants: fullList
    });
    // Attempt to save the new conversation
    newConv.save((err: Error, conv: IConvModel) => {
      if (err) {
        res.status(401).json({ msg: err });
      } else {
        // -Include ME to the conv and -Send invitations to others
        // -Include ME:
        User.findByIdAndUpdate(
          req.cookies.user,
          {
            $addToSet: {
              conversations: {
                _id: new ObjectId(conv._id),
                name: conv.name,
                lastMessage: conv.lastMessage
              }
            }
          },
          { new: true },
          (err: any, updated: IUserModel | null) => {
            if (err) {
              res.status(401).json({ msg: err });
            }
            // -Send invitations:
            req.body.participants.forEach((user: Participant) =>
              User.findByIdAndUpdate(
                user._id,
                {
                  $addToSet: {
                    invitations: {
                      _id: new ObjectId(conv._id),
                      name: conv.name
                    }
                  }
                },
                { new: true },
                (err: any, updated: IUserModel | null) => {
                  if (err) res.status(401).json({ msg: err });
                }
              )
            );
            Conversation.findById(conv._id)
              .populate({
                path: 'participants._id',
                select: 'firstname lastname email -_id'
              })
              .exec((err: Error, popConv: IConvModel) => {
                res.status(200).json({
                  _id: conv._id,
                  name: conv.name,
                  info: popConv.participants.map(
                    (part: Participant) => part._id
                  )
                });
              }); // conversation saved)
          }
        );
      }
    });
  }
};

// Accept or delete invitations
export const invAction = (req: express.Request, res: express.Response) => {
  let options =
    req.body.action === 'to-accept'
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

  User.findByIdAndUpdate(
    req.cookies.user,
    options,
    (err: any, doc: IUserModel | null) => {
      if (err) res.status(401).json({ msg: err });
      Conversation.findById(req.body.invitation)
        .populate({
          path: 'participants._id',
          select: 'firstname lastname email -_id'
        })
        .exec((err: Error, popConv: IConvModel) => {
          Conversation.findByIdAndUpdate(
            req.body.invitation,
            (err: any, newConv: IConvModel) => {
              if (err) res.status(401).json({ msg: 'No messages' });
            }
          )
            .populate({
              path: 'messages._id',
              select: '-__v'
            })
            .exec(async (err: any, popConvMsgs: IConvModel) => {
              let allMsgs = [];
              if (popConvMsgs!.messages.length > 0) {
                allMsgs = popConvMsgs!.messages.map((el: any) => el._id);
              }
              res.status(200).json({
                _id: req.body.invitation,
                name: req.body.name,
                action: req.body.action,
                info: popConv.participants.map((part: Participant) => part._id),
                messages: allMsgs,
                lastMessage: popConvMsgs.lastMessage
              });
            });
        });
    }
  );
};

// Accept or delete invitations
export const AddToConv = (req: express.Request, res: express.Response) => {
  let conv = req.body.currentConv;
  let userEmail = req.body.contactAdded;
  User.findOne({ email: userEmail }, (err: any, newUser: IUserModel) => {
    if (err) res.status(401).json({ msg: err });
    Conversation.findByIdAndUpdate(
      conv,
      {
        $push: {
          participants: {
            _id: new ObjectId(newUser._id),
            admin: false,
            active: true
          }
        }
      },
      { new: true },
      (err: any, conv: IConvModel | null) => {
        if (err) res.status(401).json({ msg: err });
        if (conv) {
          Conversation.findById(conv._id)
            .populate({
              path: 'participants._id',
              select: 'firstname lastname email -_id'
            })
            .exec((err: Error, popConv: IConvModel) => {
              res.status(200).json({
                _id: conv._id,
                name: conv.name,
                info: popConv.participants.map((part: Participant) => part._id)
              });
            }); // conversation saved)
        } else {
          if (err) res.status(401).json({ msg: 'No conversation found' });
        }
      }
    );
  });
};
// Change conv avatar
export const changeAvatar = (req: express.Request, res: express.Response) => {
  if (req.body.avatar && req.body.conv){
  Conversation.findByIdAndUpdate(
    { _id: req.body.conv },
    { $set: { avatar: req.body.avatar } },
    { new: true },
    function(err: any, user: IConvModel | null) {
      if (err) {
        return res.status(401).json({ msg: 'err' });
      }
      res.status(200).end();
    }
  );
}
};