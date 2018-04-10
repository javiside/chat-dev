import express from 'express';
import jwt from 'jsonwebtoken';
import { IUserModel } from '../models/user';
import { Participant } from '../models/user';
import { User } from '../models/user'; //User model
import { Conversation } from '../models/conversation'; //User model
import { config } from '../config/main';
import mongoose from 'mongoose';
let ObjectId = mongoose.Types.ObjectId;

// Register new users
export const register = (req: express.Request, res: express.Response) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstname ||
    !req.body.lastname
  ) {
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
  } else {
    User.findOne({ email: req.body.email }, (err, usr) => {
      if (usr === null || usr === undefined) {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        });
        // Attempt to save the new user
        newUser.save((err: any, user: IUserModel) => {
          if (err) {
            res.status(401).json({
              msg:
                err.code === 11000
                  ? 'Email already exists'
                  : 'Please enter a valid Email'
            });
          } else {
            let token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn: 60 * 60 * 24 // 24 hours
            });
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
            res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
            res.sendStatus(200); // User saved
          }
        });
      } else {
        res.status(401).json({
          msg: 'Email already exists'
        });
      }
    });
  }
};

// Check user email and pass in db
export const login = (req: express.Request, res: express.Response) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err: Error, user: IUserModel) => {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ msg: 'Email not found' }); // User not found
      } else {
        // Check if password matches
        user.comparePasswords(req.body.password, function(err: Error, isMatch) {
          if (isMatch && !err) {
            // Create the token
            let token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn: 60 * 60 * 24 // 24 hours
            });
            res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
            res.cookie('user', user._id, { maxAge: 1000 * 60 * 60 * 24 }); // 24hrs
            res.sendStatus(200);
          } else {
            res.status(401).json({ msg: 'Wrong Password' });
          }
        });
      }
    }
  );
};

// Logout route (destroys token)
export const logout = (req: express.Request, res: express.Response) => {
  res.cookie('token', null, { maxAge: 1 });
  res.cookie('user', null, { maxAge: 1 });
  res.cookie('io', null, { maxAge: 1 });
  res.end('logged out');
};

///////////////////////////////////////////////////////////////////////////////////

// After auth
export const dash = (req: express.Request, res: express.Response) => {
  res.json({ userID: req.user!._id });
};

// Get User Info
export const me = async (req: express.Request, res: express.Response) => {
  await User.findOne(
    {
      _id: req.cookies.user
    },
    async (err: Error, user: IUserModel) => {
      if (err) res.json({ msg: 'Error trying to fetch user info ' }); // Error
      if (!user) {
        res.json({ msg: 'Not found' }); // User not found
      } else {
        await User.findById(req.cookies.user)
          .populate({
            path: 'conversations._id',
            populate: {
              path: 'participants._id',
              select: 'firstname lastname email admin -_id'
            }
          })
          .exec(async (err: Error, popConv: IUserModel) => {
            let convsParts = popConv.conversations
              .map(conv => conv._id)
              .map(convPar => convPar.participants)
              .map((parArr, idx) => ({
                [user.conversations[idx]._id]: parArr.map(
                  (par: Participant) => ({
                    email: par._id.email,
                    firstname: par._id.firstname,
                    lastname: par._id.lastname,
                    admin: par.admin
                  })
                )
              }));
            let updtConvs = popConv.conversations.map(c => ({
              _id: c._id._id,
              name: c._id.name,
              lastMessage: c._id.lastMessage,
              avatar: c._id.avatar
            }));
            
            let userData = {
              _id: req.cookies.user,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              contacts: user.contacts,
              conversations: updtConvs,
              invitations: user.invitations,
              convParts: await convsParts,
              avatar: user.avatar
            };
            await res.json(userData);
          });
      }
    }
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////
// Update name or lastname
export const updateMe = (req: express.Request, res: express.Response) => {
  User.findByIdAndUpdate(
    req.cookies.user,
    { $set: { firstname: req.body.firstname, lastname: req.body.lastname } },
    { new: true },
    function(err: any, user: IUserModel | null) {
      if (err) {
        return res.status(401).json({ msg: 'err' });
      }
      res
        .status(200)
        .json({ newFirstName: user!.firstname, newLastName: user!.lastname });
    }
  );
};

// Add new contact
export const addContact = (req: express.Request, res: express.Response) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err: Error, user: IUserModel) => {
      if (err) {
        return res
          .status(401)
          .json({ msg: 'Error: trying to find the contact' });
      }
      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      } else {
        User.findOne(
          { _id: req.cookies.user },
          (err: Error, myId: IUserModel) => {
            if (err) return err;
            if (
              myId.contacts.find(
                myConts => myConts.email === req.body.email
              ) === undefined
            ) {
              if (myId.email !== req.body.email) {
                User.findOne(
                  { email: req.body.email },
                  (err: Error, contact: IUserModel) => {
                    if (err) return err;
                    User.findByIdAndUpdate(
                      req.cookies.user,
                      {
                        $addToSet: {
                          contacts: {
                            _id: new ObjectId(contact._id),
                            name: contact.fullName,
                            email: contact.email,
                            avatar: contact.avatar
                          }
                        }
                      },
                      { new: true },
                      function(err: any, user: IUserModel | null) {
                        if (err) {
                          return res.status(401).json({
                            msg: 'Error: trying to add the contact'
                          });
                        }
                        res.status(200).json({
                          _id: contact._id,
                          name: contact.fullName,
                          email: contact.email,
                          avatar: contact.avatar
                        });
                      }
                    );
                  }
                );
              } else {
                return res.status(401).json({ msg: 'You cannot add yourself' });
              }
            } else {
              return res.status(401).json({ msg: 'User already added' });
            }
          }
        );
      }
    }
  );
};
// Change avatar
export const changeAvatar = (req: express.Request, res: express.Response) => {
  if (req.body.avatar){
  User.findByIdAndUpdate(
    { _id: req.cookies.user },
    { $set: { avatar: req.body.avatar } },
    { new: true },
    function(err: any, user: IUserModel | null) {
      if (err) {
        return res.status(401).json({ msg: 'err' });
      }
      res.status(200).end();
    }
  );
}
};
// Remove Contact
export const deleteContact = (req: express.Request, res: express.Response) => {
  User.findByIdAndUpdate(
    { _id: req.cookies.user },
    { $pull: { contacts: { _id: req.body.delContact } } },
    { new: true },
    function(err: any, user: IUserModel | null) {
      if (err) {
        return res.status(401).json({ msg: 'err' });
      }
      res.status(200).json({ delCont: user!.contacts });
    }
  );
};
