import { Document, Schema, Model, model } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;
import bcrypit from 'bcryptjs';
import { Conversations } from './conversation';

interface Invitation {
  _id: string;
  name: string;
}
export interface Participant {
  _id: any;
  firstname: string;
  lastname: string;
  email: string;
  admin: boolean;
}
interface Participants {
  [_id: string]: Array<Participant>;
}
interface Contact {
  _id: string;
  name: string;
  email: string;
}

export interface UserStore {
  firstname: string;
  lastname: string;
  email: string;
  contacts: Array<Contact>;
  conversations: Conversations;
  invitations: Array<Invitation>;
  convParts: Array<Participants>;
}

export interface IUserModel extends UserStore, Document {
  password: string;
  admin: boolean;
  fullName: string;
  comparePasswords: (
    pw: string,
    cb: (err: Error, isMatch: boolean) => void
  ) => void;
}
// User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    set: function(value: string) {
      return value.trim().toLowerCase();
    },
    validate: [
      function(email) {
        return (
          email.match(
            /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i
          ) != null
        );
      },
      'Invalid email'
    ]
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  contacts: {
    type: [
      {
        _id: ObjectId,
        name: String,
        email: String
      }
    ],
    default: []
  },
  conversations: {
    type: [
      {
        _id: {
          type: ObjectId,
          ref: 'Conversation'
        },
        name: String,
        lastMessage: String
      }
    ],
    default: []
  },
  invitations: {
    type: [
      {
        _id: ObjectId,
        name: String
      }
    ],
    default: []
  }
});
// Save the user's hashed password
UserSchema.pre('save', function(this: IUserModel, next) {
  let user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypit.genSalt(10, function(err: Error, salt: string) {
      if (err) {
        return next(err);
      }
      bcrypit.hash(user.password, salt, function(err: Error, hash: string) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Create method to compare passwords
UserSchema.methods.comparePasswords = function(
  pw: string,
  cb: (err: Error | null, isMatch: boolean) => void
) {
  bcrypit.compare(pw, this.password, function(err: Error, isMatch: boolean) {
    if (err) {
      return cb(err, false);
    }
    cb(null, isMatch);
  });
};

UserSchema.virtual('fullName').get(function(this: IUserModel) {
  return this.firstname + ' ' + this.lastname;
});

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
